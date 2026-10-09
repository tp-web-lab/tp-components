import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { openViewerSource } from "../../test-helpers/viewer-source.js";
import type { TpHtmlViewer } from "../html-viewer/html-viewer.js";
import { TpHtmlViewerQuestion } from "../html-viewer-question/html-viewer-question.js";
import { buildBrowserTestDocument } from "../playground/browser-test-document.js";

vi.mock("../playground/browser-test-document.js", () => ({
	buildBrowserTestDocument: vi.fn(async () => ({ html: "<p>Test report</p>" })),
}));
beforeEach(() =>
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	),
);
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.clearAllMocks();
	vi.unstubAllGlobals();
});

/** Activates a question action without depending on its toolbar icon. */
function action(question: TpHtmlViewerQuestion, name: string): void {
	const button = question.querySelector<HTMLElement>(`[data-action="${name}"]`);
	if (!button) throw new Error(`Missing ${name}`);
	button.click();
}

it("tests freshly rendered edits, submits the source string and resets the viewer", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn(
			async (url: string) =>
				new Response(url.includes(".test.js") ? "test source" : "<p>Hello</p>"),
		),
	);
	const question = new TpHtmlViewerQuestion();
	question.setAttribute("src", "/heading.html");
	question.setAttribute("test", "/heading.test.js");
	document.body.append(question);
	const viewer = question.querySelector<TpHtmlViewer>("tp-html-viewer");
	if (!viewer) throw new Error("Missing viewer");
	await vi.waitFor(() => expect(viewer.getValue()).toBe("<p>Hello</p>"));
	await openViewerSource(viewer);
	const editor = viewer.querySelector("tp-code-editor");
	if (!editor) throw new Error("Missing source editor");
	editor.setValue("<h1>Hello</h1>");
	const submitted = vi.fn();
	question.addEventListener("tp-question-submit", submitted);
	action(question, "submit");
	await vi.waitFor(() =>
		expect(buildBrowserTestDocument).toHaveBeenCalledOnce(),
	);
	const project = vi.mocked(buildBrowserTestDocument).mock.calls[0]?.[0];
	expect(project?.findFile("/index.html")?.content).toContain("<h1>Hello</h1>");
	expect(project?.findFile("/heading.test.js")?.content).toBe("test source");
	expect(submitted.mock.calls[0]?.[0].detail.value).toBe("<h1>Hello</h1>");
	action(question, "reset");
	expect(viewer.getValue()).toBe("<p>Hello</p>");
});

it("reports markup rendering failures without executing tests", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response("tests")),
	);
	const question = new TpHtmlViewerQuestion();
	question.setAttribute("test", "/heading.test.js");
	document.body.append(question);
	const viewer = question.querySelector<TpHtmlViewer>("tp-html-viewer");
	if (!viewer) throw new Error("Missing viewer");
	vi.spyOn(viewer, "createRenderedDocument").mockRejectedValue(
		new Error("Invalid markup"),
	);
	action(question, "submit");
	await vi.waitFor(() =>
		expect(question.textContent).toContain("Invalid markup"),
	);
	expect(buildBrowserTestDocument).not.toHaveBeenCalled();
});
