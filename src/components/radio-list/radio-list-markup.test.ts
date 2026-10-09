import { afterEach, expect, it, vi } from "vitest";
import "./radio-list.js";

afterEach(() => document.body.replaceChildren());

it("removes the final paragraph margin from native markup option labels", async () => {
	document.body.innerHTML =
		'<tp-radio-list orientation="horizontal"><ul><li><p>Article HTML</p></li><li><p>First paragraph</p><p>Last paragraph</p></li></ul></tp-radio-list>';
	await vi.waitFor(() => {
		expect(
			document.querySelectorAll("label[data-tp-radio-list-label] > p"),
		).toHaveLength(3);
	});
	const paragraphs = document.querySelectorAll(
		"label[data-tp-radio-list-label] > p",
	);
	expect(paragraphs).toHaveLength(3);
	const margins = Array.from(paragraphs, (paragraph) =>
		Number.parseFloat(getComputedStyle(paragraph).marginBlockEnd),
	);
	expect(margins[0]).toBe(0);
	expect(margins[1]).toBeGreaterThan(0);
	expect(margins[2]).toBe(0);
});
