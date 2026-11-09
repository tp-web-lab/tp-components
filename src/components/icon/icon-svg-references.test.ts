import { afterEach, expect, it, vi } from "vitest";
import "./icon.js";

afterEach(() => document.body.replaceChildren());
it("isolates gradient references from hidden and repeated icons", async () => {
	const source =
		'<svg viewBox="0 0 10 10"><defs><linearGradient id="a"><stop stop-color="blue"/></linearGradient></defs><path fill="url(#a)" d="M0 0h10v10z"/></svg>';
	document.body.innerHTML = `<div hidden><tp-icon>${source}</tp-icon></div><tp-icon>${source}</tp-icon>`;
	await vi.waitFor(() =>
		expect(
			document.querySelectorAll("[data-tp-icon-container] linearGradient"),
		).toHaveLength(2),
	);
	const gradients = Array.from(
		document.querySelectorAll("[data-tp-icon-container] linearGradient"),
	);
	expect(gradients[0]?.id).not.toBe(gradients[1]?.id);
	for (const icon of document.querySelectorAll("[data-tp-icon-container]")) {
		expect(icon.querySelector("path")?.getAttribute("fill")).toBe(
			`url(#${icon.querySelector("linearGradient")?.id})`,
		);
	}
});
