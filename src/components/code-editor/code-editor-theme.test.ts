import { afterEach, expect, it } from "vitest";
import "./code-editor.js";

afterEach(() => document.body.replaceChildren());

it("starts dark even inside a light page, and initializes the theme control accordingly", () => {
	const parent = document.createElement("div");
	parent.className = "tp-light";
	const editor = document.createElement("tp-code-editor");
	parent.append(editor);
	document.body.append(parent);
	expect(editor.classList.contains("tp-dark")).toBe(true);
	expect(editor.querySelector("tp-theme")?.getAttribute("mode")).toBe("dark");
});

it("preserves an explicit local light theme and later user changes on reconnection", () => {
	const editor = document.createElement("tp-code-editor");
	editor.className = "tp-light";
	document.body.append(editor);
	expect(editor.classList.contains("tp-dark")).toBe(false);
	expect(editor.querySelector("tp-theme")?.getAttribute("mode")).toBe("light");
	editor.remove();
	document.body.append(editor);
	expect(editor.classList.contains("tp-light")).toBe(true);
	expect(editor.classList.contains("tp-dark")).toBe(false);
});
