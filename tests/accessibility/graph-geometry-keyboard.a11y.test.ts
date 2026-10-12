import { expect, test } from "@playwright/test";

test("geometry actions support Tab, Shift+Tab, Enter and Space", async ({
	page,
}) => {
	await page.goto("/accessibility-test.html");
	await page.locator("#fixture").evaluate((fixture) => {
		const g = document.createElement("tp-graph-geometry");
		g.setAttribute("built-in", "");
		fixture.replaceChildren(g);
	});
	const geometry = page.locator("#fixture tp-graph-geometry");
	const tools = geometry.locator("[data-tool] > button");
	await expect(tools.first()).toBeVisible();
	const count = await tools.count();
	expect(count).toBeGreaterThan(18);
	// Start before the tools to verify the entry point, not just programmatic focus.
	await geometry
		.getByRole("button", { name: "New construction", exact: true })
		.focus();
	for (let i = 0; i < count; i++) {
		await page.keyboard.press("Tab");
		await expect(tools.nth(i)).toBeFocused();
	}
	for (let i = count - 2; i >= 0; i--) {
		await page.keyboard.press("Shift+Tab");
		await expect(tools.nth(i)).toBeFocused();
	}
	await page.keyboard.press("Tab");
	await page.keyboard.press("Enter");
	await expect(geometry.locator('[data-tool="pan"]')).toHaveAttribute(
		"aria-pressed",
		"true",
	);
	await expect(tools.nth(1)).toBeFocused();
	await page.keyboard.press("Tab");
	await page.keyboard.press("Space");
	await expect(geometry.locator('[data-tool="point"]')).toHaveAttribute(
		"aria-pressed",
		"true",
	);
	await expect(tools.nth(2)).toBeFocused();
	await expect(geometry.locator('[data-tool="point"]')).not.toHaveAttribute(
		"outlined",
	);
	await expect(geometry.locator("[data-hint]")).toContainText(
		"place a free point",
	);
	await geometry.evaluate((g) => g.setAttribute("readonly", ""));
	await expect(geometry.locator('[data-tool="point"] > button')).toBeDisabled();
	await expect(
		geometry.locator('[data-tool="point"] > button'),
	).toHaveAttribute("tabindex", "-1");
	await expect(geometry.locator('[data-tool="pan"] > button')).toHaveAttribute(
		"tabindex",
		"0",
	);
});
