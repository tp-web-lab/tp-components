/**
 * @module components/playground/style-test
 * @summary Tests for shared playground styles.
 */

import { describe, expect, it } from "vitest";
import style from "./playground.css?inline";

describe("playground styles", () => {
	it("lets the render iframe and its container shrink to their content", () => {
		expect(style).toMatch(
			/\[data-tp-playground-preview-group\]\s*\{[^}]*align-self: flex-start/,
		);
		expect(style).toMatch(
			/tp-iframe\[data-tp-playground-preview\]\s*\{[^}]*min-block-size: 0/,
		);
		expect(style).toMatch(
			/tp-iframe\[data-tp-playground-preview\]\[hidden\]\s*\{\s*display: none/,
		);
	});
	it("keeps a compact gap between the toolbar and the code/render area", () => {
		expect(style).toMatch(/\[data-tp-playground-root\]\s*\{[^}]*gap: 0\.25rem/);
	});

	it("lets every playground fit beside floated navigation", () => {
		const rule = style.match(
			/tp-playground,\s*tp-html-playground,\s*tp-javascript-playground,[^{]+\{([^}]+)\}/,
		);
		expect(rule?.[0]).toContain("tp-restructuredtext-playground");
		expect(rule?.[1]).toContain("display: flow-root;");
		expect(rule?.[1]).toContain("inline-size: auto;");
		expect(rule?.[1]).toContain("min-inline-size: 0;");
	});
	it("resets toolbar menu bullets", () => {
		expect(style).toContain("[data-tp-playground-toolbar] tp-menu li::marker");
		expect(style).toContain("content: '';");
	});

	it("scrolls the playground toolbar with the document instead of making it sticky", () => {
		expect(style).toMatch(
			/\[data-tp-playground-toolbar\]\s*\{[^}]*position: static/,
		);
	});

	it("wraps the toolbar sections without splitting the end actions", () => {
		expect(style).toMatch(
			/\[data-tp-playground-toolbar\]\s*\{[^}]*flex-wrap: wrap/,
		);
		expect(style).toContain(
			"[data-tp-playground-toolbar] > [data-toolbar-end]",
		);
		expect(style).toContain("margin-inline-start: auto;");
	});

	it("fills the active file panel instead of hiding legacy DD panels", () => {
		expect(style).toContain(
			"[data-tp-playground-editor-panel] tp-tabs > [role='tabpanel']:not([hidden])",
		);
		expect(style).not.toContain("tp-tabs dd[role='tabpanel']");
		expect(style).toMatch(
			/tp-tabs > \[role='tabpanel'\]\s*\{[^}]*min-block-size: 0/,
		);
	});

	it("lets the editor and its panels follow the intrinsic CodeMirror height", () => {
		expect(style).toContain(
			"[data-tp-playground-editor-panel] tp-code-editor {",
		);
		expect(style).not.toContain("block-size: 100% !important;");
		expect(style).not.toMatch(/block-size: (24|28)rem/);
		expect(style).toMatch(
			/\[data-tp-playground-main-splitter\]\s*\{[^}]*block-size: auto/,
		);
		expect(style).toMatch(
			/\[data-tp-playground-editor-panel\]\s*\{[^}]*block-size: auto/,
		);
		expect(style).toMatch(
			/\[data-tp-playground-work-group\]\s*\{[^}]*align-self: flex-start/,
		);
		expect(style).toContain(
			"[data-tp-playground-editor-panel] tp-code-editor > [data-tp-code-editor]",
		);
		expect(style).toContain(
			"[data-tp-playground-editor-panel] tp-code-editor .cm-scroller",
		);
		expect(style).toContain("overflow: auto;");
	});
});
