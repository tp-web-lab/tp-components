import { afterEach, describe, expect, it } from "vitest";
import "./code-editor/code-editor.js";
import "./flip-card/flip-card.js";

afterEach(() => document.body.replaceChildren());

describe("keyboard access to scrollable content", () => {
	it("keeps readonly code focusable when editable content is disabled", async () => {
		const editor = document.createElement("tp-code-editor");
		editor.setAttribute("readonly", "");
		editor.setAttribute("value", "const answer = 42;");
		document.body.append(editor);
		await Promise.resolve();
		await Promise.resolve();
		const content = editor.querySelector<HTMLElement>(".cm-content");
		expect(content?.getAttribute("contenteditable")).toBe("false");
		expect(content?.tabIndex).toBe(0);
		content?.focus();
		expect(document.activeElement).toBe(content);
		editor.removeAttribute("readonly");
		expect(editor.querySelector<HTMLElement>(".cm-content")?.tabIndex).toBe(0);
	});
	it("exposes only the visible card face to keyboard navigation", () => {
		const card = document.createElement("tp-flip-card");
		card.setAttribute("button-position", "none");
		card.innerHTML =
			"<dl><dt>recto</dt><dd>Front</dd><dt>verso</dt><dd><button>Back action</button></dd></dl>";
		document.body.append(card);
		const front = card.querySelector<HTMLElement>(".tp-flip-card-recto");
		const back = card.querySelector<HTMLElement>(".tp-flip-card-verso");
		expect(front?.tabIndex).toBe(0);
		expect(back?.inert).toBe(true);
		front?.dispatchEvent(
			new KeyboardEvent("keydown", { key: " ", bubbles: true }),
		);
		expect(card.hasAttribute("flipped")).toBe(false);
		card.setAttribute("flipped", "");
		expect(front?.tabIndex).toBe(-1);
		expect(front?.inert).toBe(true);
		expect(back?.tabIndex).toBe(0);
		expect(back?.inert).toBe(false);
	});
});
