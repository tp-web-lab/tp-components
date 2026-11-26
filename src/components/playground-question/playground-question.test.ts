import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { TpConsole } from "../console/console.js";
import type { TpIframe } from "../iframe/iframe.js";
import { TpJavascriptViewerQuestion } from "../javascript-viewer-question/javascript-viewer-question.js";
import { TpPlayground } from "../playground/playground.js";
import type { TpProject } from "../playground/project.js";

beforeEach(() => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	vi.stubGlobal(
		"fetch",
		vi.fn().mockImplementation(async () => new Response("test source")),
	);
	vi.spyOn(TpPlayground.prototype, "run").mockResolvedValue();
});
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

/** Mounts a configured exercise through its public interface. */
function mount(open = true): TpJavascriptViewerQuestion {
	const question = new TpJavascriptViewerQuestion();
	question.open = open;
	question.setAttribute("test", "/double.test.js");
	question.innerHTML =
		"<dl><dt>Title</dt><dd>Double</dd><dt>Prompt</dt><dd>Complete the function.</dd></dl>";
	document.body.append(question);
	return question;
}
/** Activates an inherited question action. */
function action(question: TpJavascriptViewerQuestion, name: string): void {
	const button = question.querySelector<HTMLElement>(
		`[data-tp-question-form-panel] [data-action="${name}"]`,
	);
	if (!button) throw new Error(`Missing ${name}`);
	button.click();
}

it("uses inherited open handling and accepts an optional test source", () => {
	const question = new TpJavascriptViewerQuestion();
	expect(question.test).toBe("");
	document.body.append(question);
	expect(question.querySelector("tp-javascript-viewer")).toBeNull();
	expect(question.querySelector("details")?.open).toBe(false);
	question.open = true;
	expect(question.querySelector("details")?.open).toBe(true);
	action(question, "submit");
	expect(question.textContent).toContain("No tests provided.");
});

it("forwards src and waits for the current control to finish loading", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockImplementation(async () => new Response("export const x = 1;")),
	);
	const question = mount();
	question.setAttribute("src", "/double.js");
	expect(
		question.querySelector("tp-javascript-viewer")?.getAttribute("src"),
	).toContain("/double.js");
	action(question, "submit");
	expect(question.textContent).toContain("Wait for the source");
	await vi.waitFor(() =>
		expect(
			question.querySelector("tp-javascript-viewer")?.getProject().entry,
		).toBe("/double.js"),
	);
	const build = vi
		.spyOn(TpPlayground.prototype, "createTestDocument")
		.mockResolvedValue({ html: "<main>Report</main>" });
	action(question, "submit");
	await vi.waitFor(() => expect(build).toHaveBeenCalledOnce());
});

it("runs every submission, routes only its own test messages and cleans up on reset", async () => {
	const cleanup = vi.fn();
	const build = vi
		.spyOn(TpPlayground.prototype, "createTestDocument")
		.mockResolvedValue({ html: "<main>Test document</main>", cleanup });
	const question = mount();
	await Promise.resolve();
	action(question, "submit");
	await vi.waitFor(() =>
		expect(question.querySelector('[title="Test execution"]')).not.toBeNull(),
	);
	expect(build).toHaveBeenCalledWith({
		path: "/double.test.js",
		language: "javascript",
		content: "test source",
	});
	const frame = question.querySelector<TpIframe>(
		'tp-iframe[title="Test execution"]',
	);
	if (!frame?.contentWindow) throw new Error("Missing test frame");
	const consoleElement = question.querySelector<TpConsole>(
		"[data-tp-question-feedback-output] tp-console",
	);
	if (!consoleElement) throw new Error("Missing report console");
	const add = vi.spyOn(consoleElement, "addEntry");
	const data = { type: "tp-playground-console-entry", kind: "log", values: [] };
	window.dispatchEvent(new MessageEvent("message", { data, source: window }));
	expect(add).not.toHaveBeenCalled();
	window.dispatchEvent(
		new MessageEvent("message", { data, source: frame.contentWindow }),
	);
	expect(add).toHaveBeenCalledOnce();
	window.dispatchEvent(
		new MessageEvent("message", { data: null, source: frame.contentWindow }),
	);
	action(question, "submit");
	await vi.waitFor(() => expect(build).toHaveBeenCalledTimes(2));
	expect(cleanup).toHaveBeenCalled();
	action(question, "reset");
	expect(question.querySelector('[title="Test execution"]')).toBeNull();
	question.remove();
});

it("reports loading and build errors in Feedback", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue(new Response("", { status: 404 })),
	);
	const question = mount();
	action(question, "submit");
	await vi.waitFor(() => expect(question.textContent).toContain("HTTP 404"));
	vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("tests")));
	vi.spyOn(TpPlayground.prototype, "createTestDocument").mockRejectedValue(
		new Error("Invalid tests"),
	);
	action(question, "submit");
	await vi.waitFor(() =>
		expect(question.textContent).toContain("Invalid tests"),
	);
});

it("disposes stale asynchronous builds after a reset", async () => {
	const cleanup = vi.fn();
	let finish:
		| ((value: { html: string; cleanup: () => void }) => void)
		| undefined;
	const build = vi
		.spyOn(TpPlayground.prototype, "createTestDocument")
		.mockImplementation(
			() =>
				new Promise((resolve) => {
					finish = resolve;
				}),
		);
	const question = mount();
	action(question, "submit");
	await vi.waitFor(() => expect(build).toHaveBeenCalledOnce());
	action(question, "reset");
	finish?.({ html: "stale", cleanup });
	await vi.waitFor(() => expect(cleanup).toHaveBeenCalledOnce());
	expect(question.querySelector('[title="Test execution"]')).toBeNull();
});

it("starts a closed exercise only when opened and retains edits on reopening", async () => {
	const question = mount(false);
	question.setAttribute("src", "/double.js");
	expect(question.querySelector("tp-javascript-viewer")).toBeNull();
	expect(fetch).not.toHaveBeenCalled();
	expect(TpPlayground.prototype.run).not.toHaveBeenCalled();
	question.open = true;
	const viewer = question.querySelector("tp-javascript-viewer");
	expect(viewer).not.toBeNull();
	await vi.waitFor(() => expect(fetch).toHaveBeenCalled());
	question.open = false;
	question.open = true;
	expect(question.querySelector("tp-javascript-viewer")).toBe(viewer);
});

it("uses a Feedback file and tests the submitted project snapshot, not subsequent edits", async () => {
	let finish: ((response: Response) => void) | undefined;
	vi.stubGlobal(
		"fetch",
		vi.fn(
			() =>
				new Promise<Response>((resolve) => {
					finish = resolve;
				}),
		),
	);
	const question = new TpJavascriptViewerQuestion();
	question.open = true;
	question.setAttribute(
		"data-tp-source",
		"https://example.test/course/exercise.md",
	);
	question.innerHTML =
		'<dl><dt>Title</dt><dd>Double</dd><dt>Prompt</dt><dd>Edit</dd><dt>Feedback</dt><dd><a href="tests/double.test.js">Tests</a></dd></dl>';
	document.body.append(question);
	const viewer = question.querySelector("tp-javascript-viewer");
	if (!viewer) throw new Error("Missing viewer");
	const project = viewer.getProject();
	project.entry = "/main.js";
	project.files = [
		{
			path: "/main.js",
			language: "javascript",
			content: "function double(x) { return x * 2; }",
		},
	];
	viewer.setProject(project);
	let tested = "";
	vi.spyOn(TpPlayground.prototype, "createTestDocument").mockImplementation(
		async function (this: TpPlayground<TpProject>) {
			tested = this.getProject().findFile("/main.js")?.content ?? "";
			return { html: "<p>Tests</p>" };
		},
	);
	action(question, "submit");
	expect(fetch).toHaveBeenCalledWith(
		"https://example.test/course/tests/double.test.js",
		expect.anything(),
	);
	const file = project.files[0];
	if (!file) throw new Error("Missing program");
	file.content = "function double(x) { return 0; }";
	viewer.setProject(project);
	finish?.(new Response("assertions"));
	await vi.waitFor(() => expect(tested).toContain("x * 2"));
	expect(tested).not.toContain("return 0");
});
