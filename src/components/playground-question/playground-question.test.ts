import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { TpConsole } from "../console/console.js";
import type { TpIframe } from "../iframe/iframe.js";
import { TpJavascriptViewerQuestion } from "../javascript-viewer-question/javascript-viewer-question.js";
import { TpPlayground } from "../playground/playground.js";

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
function mount(): TpJavascriptViewerQuestion {
	const question = new TpJavascriptViewerQuestion();
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

it("uses inherited open handling and requires a test source", () => {
	const question = new TpJavascriptViewerQuestion();
	expect(question.test).toBe("");
	document.body.append(question);
	expect(question.querySelector("tp-javascript-viewer")).not.toBeNull();
	expect(question.querySelector("details")?.open).toBe(false);
	question.open = true;
	expect(question.querySelector("details")?.open).toBe(true);
	action(question, "submit");
	expect(question.textContent).toContain("No test file is configured");
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
