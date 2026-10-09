import { expect, it } from "vitest";
import editorStyle from "../code-editor/code-editor.css?inline";
import listStyle from "./code-comment.css?inline";

it("hides only the author list when open is absent", () => {
	expect(listStyle).toMatch(
		/tp-code-comment:not\(\[open\]\) > ol\s*\{\s*display: none/,
	);
});

it("pairs numbered SVG backgrounds and strokes with their host theme tokens", () => {
	expect(editorStyle).toMatch(
		/tp-code-editor \.tp-code-comment-marker > tp-icon\s*\{\s*color: var\(--tp-code-editor-foreground\)/,
	);
	expect(editorStyle).toMatch(
		/tp-code-editor \.tp-code-comment-marker svg > circle\[fill="white"\]\s*\{\s*fill: var\(--tp-code-editor-surface\)/,
	);
	expect(listStyle).toContain("color: var(--tp-text-body, CanvasText)");
	expect(listStyle).toMatch(
		/\[data-code-comment-number\] svg > circle\[fill="white"\]\s*\{\s*fill: var\(--tp-paper-color, Canvas\)/,
	);
});
