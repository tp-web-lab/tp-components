import "../components/scheme-viewer/scheme-viewer.js";
import "../components/ocaml-viewer/ocaml-viewer.js";
import "../components/prolog-viewer/prolog-viewer.js";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { TpConsole } from "../components/console/console.js";
import { TpHtmlViewer } from "../components/html-viewer/html-viewer.js";
import { TpJavascriptViewer } from "../components/javascript-viewer/javascript-viewer.js";
import { readViewerMode } from "./viewer-mode.js";

// Layout is checked in real browsers; jsdom does not implement CodeMirror measurements.
beforeEach(() => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
});

afterEach(() => {
	vi.unstubAllGlobals();
	document.body.replaceChildren();
	vi.restoreAllMocks();
});
it("resolves explicit modes before the legacy lite attribute", () => {
	const host = document.createElement("div");
	expect(readViewerMode(host)).toBe("default");
	host.setAttribute("lite", "");
	expect(readViewerMode(host)).toBe("lite");
	for (const mode of ["default", "lite", "simple"] as const) {
		host.setAttribute("mode", mode);
		expect(readViewerMode(host)).toBe(mode);
	}
	host.setAttribute("mode", "invalid");
	expect(readViewerMode(host)).toBe("default");
	host.removeAttribute("mode");
	expect(readViewerMode(host)).toBe("lite");
});
it("shows both markup panes in simple mode and preserves edits when changing modes", async () => {
	const viewer = new TpHtmlViewer();
	viewer.mode = "simple";
	viewer.innerHTML = '<script type="text/html"><p>Initial</p></script>';
	document.body.append(viewer);
	await vi.waitFor(() => {
		expect(viewer.dataset.layout).toBe("both");
		expect(viewer.querySelector("tp-code-editor")).not.toBeNull();
	});
	await viewer.setValue("<p>Edited</p>");
	viewer.mode = "lite";
	await vi.waitFor(() => expect(viewer.dataset.viewerMode).toBe("lite"));
	expect(viewer.getValue()).toBe("<p>Edited</p>");
	viewer.mode = "simple";
	await vi.waitFor(() => expect(viewer.dataset.layout).toBe("both"));
	expect(viewer.getValue()).toBe("<p>Edited</p>");
	vi.spyOn(globalThis, "fetch").mockResolvedValue(
		new Response("<p>New file</p>"),
	);
	viewer.setAttribute("src", "/new-example.html");
	await vi.waitFor(() => expect(viewer.getValue()).toBe("<p>New file</p>"));
});
it("keeps simple panes visible and opens the console for output and errors in every mode", async () => {
	const viewer = new TpJavascriptViewer();
	viewer.mode = "simple";
	document.body.append(viewer);
	await vi.waitFor(() =>
		expect(
			viewer
				.querySelector("[data-tp-programming-viewer-root]")
				?.getAttribute("data-view"),
		).toBe("both"),
	);
	expect(
		viewer
			.querySelector('[data-tp-programming-viewer-panel="code"]')
			?.hasAttribute("hidden"),
	).toBe(false);
	expect(
		viewer
			.querySelector("[data-tp-playground-console]")
			?.hasAttribute("hidden"),
	).toBe(true);
	const before = viewer.getProject();
	viewer.mode = "default";
	expect(viewer.getProject()).toEqual(before);
	expect(viewer.dataset.viewerMode).toBe("default");
	const output = viewer.querySelector<TpConsole>(
		"[data-tp-playground-console]",
	);
	if (!output) throw new Error("Missing viewer console");
	for (const mode of ["default", "lite", "simple"] as const) {
		viewer.mode = mode;
		expect(output.mode).toBe(mode);
		expect(output.querySelector("tp-theme")?.getAttribute("mode")).toBe(
			mode === "simple" ? "light" : "dark",
		);
		output.clear();
		expect(output.hasAttribute("hidden")).toBe(true);
		output.log("A message");
		expect(output.hasAttribute("hidden")).toBe(false);
		output.clear();
		expect(output.hasAttribute("hidden")).toBe(true);
		output.error("An error");
		expect(output.hasAttribute("hidden")).toBe(false);
	}
});

it("routes Scheme, OCaml and Prolog viewer and playground messages to the output", async () => {
	for (const component of ["scheme", "ocaml", "prolog"].flatMap((language) => [
		`tp-${language}-viewer`,
		`tp-${language}-playground`,
	])) {
		const viewer = document.createElement(component);
		viewer.setAttribute("mode", "simple");
		document.body.append(viewer);
		await vi.waitFor(() =>
			expect(
				viewer.querySelector("tp-iframe")?.contentWindow?.document.body,
			).toBeTruthy(),
		);
		expect(viewer.querySelector("tp-console")).toBeNull();
		expect(
			viewer.querySelector("[data-tp-programming-viewer-console]"),
		).toBeNull();
		const frameWindow = viewer.querySelector("tp-iframe")?.contentWindow;
		window.dispatchEvent(
			new MessageEvent("message", {
				source: frameWindow,
				data: {
					type: "tp-playground-console-entry",
					kind: "log",
					values: ["<b>Literal message</b>", { answer: 42 }],
				},
			}),
		);
		const output = frameWindow?.document.querySelector(
			"[data-tp-inline-messages]",
		);
		expect(output?.textContent).toContain("<b>Literal message</b>");
		expect(output?.querySelector("b")).toBeNull();
		expect(output?.textContent).toContain('"answer": 42');
		window.dispatchEvent(
			new MessageEvent("message", {
				source: frameWindow,
				data: {
					type: "tp-playground-console-entry",
					kind: "error",
					values: [{ __tp_console_type: "error", message: "Expected error" }],
				},
			}),
		);
		expect(output?.textContent).toContain("Expected error");
		viewer.remove();
	}
});
