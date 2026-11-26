import { describe, expect, it } from "vitest";
import { htmlToMarkup } from "./markup-conversion.js";

describe("RST role boundaries", () => {
	it.each([".", ",", ";", ":", "!", "?", ")", "]", "}", "—", "»", "", " next"])(
		"omits escapes before a closing delimiter: %s",
		(suffix) => {
			const code = htmlToMarkup(
				`<p>and <mark>highlighted</mark>${suffix}</p>`,
				"restructuredtext",
			);
			expect(code).toContain(
				`and :example-mark-1:\`highlighted\`${suffix}`.trimEnd(),
			);
			expect(code).not.toContain("\\ ");
		},
	);
	it.each(["", " ", "(", "[", "{", "«", "—", ":", "/"])(
		"omits escapes after an opening delimiter: %s",
		(prefix) => {
			const code = htmlToMarkup(
				`<p>${prefix}<mark>highlighted</mark>.</p>`,
				"restructuredtext",
			);
			expect(code).not.toContain("\\ ");
		},
	);
	it("keeps the separators needed inside words and between adjacent roles", () => {
		const code = htmlToMarkup(
			"<p>H<sub>2</sub>O, m<sup>2</sup>. <mark>A</mark><ins>B</ins>.</p>",
			"restructuredtext",
		);
		expect(code).toContain("H\\ :sub:`2`\\ O, m\\ :sup:`2`.");
		expect(code).toContain(":example-mark-1:`A`\\ :example-ins-2:`B`.");
		expect(code).not.toContain("\\ \\ ");
	});
	it("does not rewrite literal role examples in code", () => {
		const code = htmlToMarkup(
			"<pre><code>and \\ :example-mark-1:`highlighted`\\ .</code></pre>",
			"restructuredtext",
		);
		expect(code).toContain("and \\ :example-mark-1:`highlighted`\\ .");
	});
});
