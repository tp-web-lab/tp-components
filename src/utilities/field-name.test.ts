import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { renderMarkdownToHtml } from "../components/markdown/markdown.js";
import { stubMathJaxRuntime } from "../test-helpers/mathjax.js";
import "../components/textfield/textfield.js";
import "../components/mathfield/mathfield.js";
import "../components/numberfield/numberfield.js";
import "../components/datefield/datefield.js";
import "../components/timefield/timefield.js";

const cases = [
	["tp-textfield", "Ada"],
	["tp-mathfield", "x^2"],
	["tp-numberfield", "12"],
	["tp-datefield", "2026-10-05"],
	["tp-timefield", "14:30"],
] as const;
beforeEach(() => stubMathJaxRuntime());
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it.each(cases)(
	"uses inline content only as the name for %s",
	async (tag, value) => {
		const html = await renderMarkdownToHtml(
			`:${tag}:\`identifier\`{value="${value}" placeholder="Hint"}`,
		);
		document.body.innerHTML = html;
		const field = document.querySelector(tag);
		expect(field?.getAttribute("name")).toBe("identifier");
		expect(field?.getAttribute("id")).not.toBe("identifier");
		expect(field?.getAttribute("value")).toBe(value);
		const input = field?.querySelector("input");
		expect(input?.name).toBe("identifier");
		expect(input?.value).toBe(value);
		expect(input?.placeholder).toBe("Hint");
		field?.remove();
		if (field) document.body.append(field);
		expect(field?.getAttribute("name")).toBe("identifier");
	},
);
it.each(cases)(
	"preserves explicit names and does not infer a value for %s",
	(tag) => {
		const field = document.createElement(tag);
		field.textContent = "identifier";
		field.setAttribute("name", "explicit");
		document.body.append(field);
		expect(field.getAttribute("name")).toBe("explicit");
		expect(field.hasAttribute("value")).toBe(false);
		field.removeAttribute("name");
		field.remove();
		document.body.append(field);
		expect(field.hasAttribute("name")).toBe(false);
	},
);
