import { afterEach, expect, it, vi } from "vitest";
import { openViewerSource } from "../../test-helpers/viewer-source.js";
import { TpHtmlViewer } from "../html-viewer/html-viewer.js";

afterEach(() => document.body.replaceChildren());

it("requires initialization before rendering a response and safely resets an idle viewer", async () => {
	const viewer = new TpHtmlViewer();
	expect(viewer.getValue()).toBe("");
	viewer.reset();
	await expect(viewer.createRenderedDocument()).rejects.toThrow(
		"Wait for the source",
	);
});

it("renders a current source snapshot while preserving the visible preview", async () => {
	const viewer = new TpHtmlViewer();
	viewer.innerHTML = "<template><p>Hello</p></template>";
	const ready = vi.fn();
	viewer.addEventListener("tp-markup-viewer-src-load", ready);
	document.body.append(viewer);
	await vi.waitFor(() => expect(ready).toHaveBeenCalledOnce());
	expect(viewer.getValue()).toBe("<p>Hello</p>");
	await openViewerSource(viewer);
	const editor = viewer.querySelector("tp-code-editor");
	if (!editor) throw new Error("Missing source editor");
	editor.setValue("<h1>Hello</h1>");
	expect(await viewer.createRenderedDocument()).toContain("<h1>Hello</h1>");
	expect(viewer.querySelector("iframe")?.srcdoc).toContain("<p>Hello</p>");
	editor.setValue("");
	expect(await viewer.createRenderedDocument()).toBe("");
	viewer.reset();
	expect(viewer.getValue()).toBe("<p>Hello</p>");
});
