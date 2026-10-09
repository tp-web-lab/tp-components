import { afterEach, describe, expect, it } from "vitest";
import "./icon.js";

afterEach(() => document.body.replaceChildren());

describe("inline icon placeholders", () => {
	it("displays only the icon, not the text required by inline markup", async () => {
		document.body.innerHTML =
			'<p>Settings <tp-icon name="settings" aria-label="Settings">icon</tp-icon>.</p>';
		const icon = document.querySelector("tp-icon");
		await Promise.resolve();
		expect(icon?.querySelector("[data-tp-icon-container] svg")).not.toBeNull();
		expect(icon?.textContent).not.toContain("icon");
		expect(icon?.getAttribute("aria-label")).toBe("Settings");
		expect(icon?.getAttribute("data-source")).toContain("icon</tp-icon>");
	});

	it("does not use placeholder text as an implicit fallback", async () => {
		document.body.innerHTML =
			'<tp-icon name="missing-inline-placeholder" fallback="?">icon</tp-icon>';
		await Promise.resolve();
		expect(document.querySelector("tp-icon")?.textContent).toBe("?");
	});

	it("preserves inline SVG sources while removing their adjacent placeholder", async () => {
		document.body.innerHTML =
			'<tp-icon>icon<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"></circle></svg></tp-icon>';
		await Promise.resolve();
		const icon = document.querySelector("tp-icon");
		expect(icon?.querySelector(":scope > svg circle")).not.toBeNull();
		expect(
			icon?.querySelector("[data-tp-icon-container] svg circle"),
		).not.toBeNull();
		expect(icon?.textContent).not.toContain("icon");
	});
});
