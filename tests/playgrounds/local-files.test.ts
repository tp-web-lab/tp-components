import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("an empty playground opens a source file and saves the active edits", async ({
	page,
}) => {
	// Exercise the download fallback shared by Safari and Firefox in all engines.
	await page.addInitScript(() => {
		Object.defineProperty(window, "showSaveFilePicker", {
			value: undefined,
			configurable: true,
		});
	});
	await page.goto("/index.html#/components/python-playground/index.md");
	const playground = page.locator("tp-python-playground").first();
	const menu = playground.locator("[data-tp-playground-toolbar-start-menu]");
	await expect(playground.locator("tp-code-editor")).toBeVisible();
	await expect(
		playground.frameLocator("tp-iframe iframe").locator("#result"),
	).toHaveText("6 × 7 = 42");
	await menu.getByRole("menuitem", { name: /^Project/ }).click();
	await menu.locator('[data-tp-playground-action="clear-project"]').click();
	await menu.getByRole("menuitem", { name: /^File/ }).click();
	await expect(
		menu.locator('[data-tp-playground-action="save-file"]'),
	).toHaveAttribute("aria-disabled", "true");
	const chooserPromise = page.waitForEvent("filechooser");
	await menu.locator('[data-tp-playground-action="open-source-file"]').click();
	const chooser = await chooserPromise;
	await chooser.setFiles({
		name: "answer.py",
		mimeType: "text/plain",
		buffer: Buffer.from(
			'from js import document\ndocument.getElementById("app").textContent = "Local Python file"\n',
		),
	});
	await expect(playground.locator("tp-code-editor")).toContainText(
		"Local Python file",
	);
	await playground.locator("[data-tp-playground-run] button").click();
	await expect(
		playground.frameLocator("tp-iframe iframe").locator("#app"),
	).toHaveText("Local Python file");
	await playground.locator("tp-code-editor").evaluate((element) => {
		const value = 'print("edited before saving")\n';
		(element as HTMLElement & { setValue: (text: string) => void }).setValue(
			value,
		);
		element.dispatchEvent(
			new CustomEvent("tp-code-editor-change", { detail: { value } }),
		);
	});
	let dialogs = 0;
	page.on("dialog", async (dialog) => {
		dialogs++;
		await dialog.accept(dialogs === 1 ? "answer.py" : "copy.py");
	});
	for (const [action, filename] of [
		["save-file", "answer.py"],
		["save-file", "answer.py"],
		["save-file-as", "copy.py"],
	]) {
		await menu.getByRole("menuitem", { name: /^File/ }).click();
		const downloading = page.waitForEvent("download");
		await menu.locator(`[data-tp-playground-action="${action}"]`).click();
		const download = await downloading;
		expect(download.suggestedFilename()).toBe(filename);
		const path = await download.path();
		if (path === null) throw new Error("The source file was not downloaded.");
		expect(await readFile(path, "utf8")).toBe(
			'print("edited before saving")\n',
		);
	}
	expect(dialogs).toBe(2);
});
