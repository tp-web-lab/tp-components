import { describe, expect, it, vi } from "vitest";
import { createViewerRunShortcut } from "./viewer-run-shortcut.js";

describe("viewer Run shortcut", () => {
	it("runs only the inner viewer and prevents editor newline handling", () => {
		const outer = document.createElement("div");
		const inner = document.createElement("div");
		const editor = document.createElement("textarea");
		outer.append(inner);
		inner.append(editor);
		const outerRun = vi.fn();
		const innerRun = vi.fn();
		const editorKey = vi.fn();
		outer.addEventListener(
			"keydown",
			createViewerRunShortcut(outer, outerRun),
			true,
		);
		inner.addEventListener(
			"keydown",
			createViewerRunShortcut(inner, innerRun),
			true,
		);
		editor.addEventListener("keydown", editorKey);
		const event = new KeyboardEvent("keydown", {
			key: "Enter",
			shiftKey: true,
			bubbles: true,
			cancelable: true,
		});
		editor.dispatchEvent(event);
		expect(innerRun).toHaveBeenCalledOnce();
		expect(outerRun).not.toHaveBeenCalled();
		expect(editorKey).not.toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});
	it.each([
		{ shiftKey: false },
		{ shiftKey: true, ctrlKey: true },
		{ shiftKey: true, metaKey: true },
		{ shiftKey: true, altKey: true },
		{ shiftKey: true, isComposing: true },
	])("leaves other keys and composition untouched: %j", (options) => {
		const host = document.createElement("div");
		const run = vi.fn();
		host.addEventListener("keydown", createViewerRunShortcut(host, run), true);
		const event = new KeyboardEvent("keydown", {
			key: "Enter",
			bubbles: true,
			cancelable: true,
			...options,
		});
		host.dispatchEvent(event);
		expect(run).not.toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(false);
	});
	it("suppresses repeat without running twice", () => {
		const host = document.createElement("div");
		const run = vi.fn();
		host.addEventListener("keydown", createViewerRunShortcut(host, run), true);
		const event = new KeyboardEvent("keydown", {
			key: "Enter",
			shiftKey: true,
			repeat: true,
			cancelable: true,
		});
		host.dispatchEvent(event);
		expect(run).not.toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});
});
