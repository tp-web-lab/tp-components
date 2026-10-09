import { expect, it } from "vitest";
import { renderAnnotation } from "./personal-annotations.js";

it("preserves a native Markdown formula through the real parser and sanitizer", async () => {
	const html = await renderAnnotation(
		"il était une fois :tp-math:`E=mc^2`{} disait Einstein",
		"md",
	);
	expect(html).toContain("<tp-math");
	expect(html).toContain("E=mc^2");
	expect(html).not.toContain("<code>");
});
