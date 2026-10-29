import { expect, it } from "vitest";
import { safeMarkdownContent } from "./safe-markdown.js";

it("renders Markdown formatting, fenced code and mathematical sources", () => {
	const content = safeMarkdownContent(
		"**Reasoning**\n\n- First\n- Second\n\n```python\n# Comment\n    return x**2\n```\n\n:latexmath:`x^2`\n\n```latexmath\n\\frac{x}{2}\n```",
	);
	expect(content.querySelector("strong")?.textContent).toBe("Reasoning");
	expect(content.querySelectorAll("li")).toHaveLength(2);
	expect(content.querySelector("pre code")?.textContent).toContain(
		"# Comment\n    return x**2",
	);
	expect(
		Array.from(content.querySelectorAll("tp-math"), (node) =>
			node.getAttribute("value"),
		),
	).toEqual(["x^2", "\\frac{x}{2}"]);
});

it("does not activate HTML, custom components, styles or unsafe links", () => {
	const content = safeMarkdownContent(
		'<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n::: tp-python-viewer\nprint("execute")\n:::\n\n[bad](javascript:alert(1))\n\nText{style="color:red" onclick="alert(1)"}',
	);
	expect(
		content.querySelector("script, img, style, tp-python-viewer, iframe"),
	).toBeNull();
	expect(content.querySelector("[onclick], [onerror], [style]")).toBeNull();
	expect(content.querySelector('a[href^="javascript:"]')).toBeNull();
});
