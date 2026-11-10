import { afterEach, expect, it, vi } from "vitest";
import "./code-editor.js";

afterEach(() => document.body.replaceChildren());

it("highlights all Markdown heading levels without treating fenced code as headings", async () => {
	const editor = document.createElement("tp-code-editor");
	editor.setAttribute("language", "markdown");
	editor.setAttribute(
		"value",
		[
			"# First",
			"## Second",
			"### Third",
			"#### Fourth",
			"##### Fifth",
			"###### Sixth",
			"",
			"Plain paragraph",
			"",
			"```text",
			"# Code, not a heading",
			"```",
		].join("\n"),
	);
	document.body.append(editor);
	await vi.waitFor(() => {
		const lines = editor.querySelectorAll(".cm-line");
		expect(lines.length).toBeGreaterThanOrEqual(12);
		for (let index = 0; index < 6; index++) {
			const span = lines[index]?.querySelector("span");
			expect(span).not.toBeNull();
			expect(getComputedStyle(span as HTMLElement).fontWeight).toBe("700");
		}
		expect(lines[7]?.querySelector("span")).toBeNull();
		expect(lines[10]?.querySelector("span")).toBeNull();
	});
});

it("highlights only list markers, including nested lists, outside fenced code", async () => {
	const editor = document.createElement("tp-code-editor");
	editor.setAttribute("language", "markdown");
	editor.setAttribute(
		"value",
		"- First\n  - Nested\n\n* Second\n\n+ Third\n\n1. Ordered\n2. Next\n\n```text\n- Literal\n1. Literal\n```",
	);
	document.body.append(editor);
	await vi.waitFor(() => {
		const lines = editor.querySelectorAll(".cm-line");
		for (const [index, marker] of [
			[0, "-"],
			[1, "-"],
			[3, "*"],
			[5, "+"],
			[7, "1."],
			[8, "2."],
		] as const) {
			const span = lines[index]?.querySelector("span");
			expect(span?.textContent).toBe(marker);
			expect(getComputedStyle(span as HTMLElement).fontWeight).toBe("700");
		}
		expect(lines[11]?.querySelector("span")).toBeNull();
		expect(lines[12]?.querySelector("span")).toBeNull();
	});
});
