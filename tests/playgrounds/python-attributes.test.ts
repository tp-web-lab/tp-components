import { expect, test } from "@playwright/test";

test("Demo keeps Python runnable after switching sources and interrupting a preview", async ({
	page,
}) => {
	await page.setViewportSize({ width: 800, height: 768 });
	await page.goto("/index.html#/components/python-playground/index.md");
	const controls = page.locator(
		'tp-component-viewer[tag="tp-python-playground"]',
	);
	await controls.getByRole("radio", { name: "Demo", exact: true }).check();
	await expect(
		controls.locator("[data-component-preview] iframe"),
	).toHaveAttribute("srcdoc", /tp-python-playground/);
	const preview = controls.frameLocator("[data-component-preview] iframe");
	const output = preview.frameLocator("tp-python-playground tp-iframe iframe");
	const run = preview.locator("[data-tp-playground-run] button");
	const source = controls.locator('[data-component-setting="src"]');
	const consoleOutput = preview.locator("tp-console");

	await source.getByRole("radio", { name: "file1", exact: true }).check();
	await expect(output.locator("#result")).toHaveText("6 × 7 = 42");
	await run.click();
	await expect(output.locator("#result")).toHaveText("6 × 7 = 42");
	await expect(preview.locator("tp-iframe")).toBeVisible();

	// Simulate a still-pending package/import operation in the disposable frame.
	await output.locator("body").evaluate(() => {
		const bridge = window as Window & {
			tpRunWithPyodide: (callback: () => Promise<void>) => Promise<void>;
		};
		void bridge.tpRunWithPyodide(() => {
			document.body.dataset.pendingExecution = "true";
			return new Promise<void>((resolve) => {
				setTimeout(resolve, 10_000);
			});
		});
	});
	await expect(output.locator("body")).toHaveAttribute(
		"data-pending-execution",
		"true",
	);
	await source.getByRole("radio", { name: "Default", exact: true }).check();
	await expect(consoleOutput).toContainText("Hello Python playground");
	await expect(output.locator("#app")).toHaveText("Hello Python playground");
	await run.click();
	await expect(consoleOutput).toContainText("Hello Python playground");

	await source.getByRole("radio", { name: "file2", exact: true }).check();
	await expect(output.locator("#result")).toHaveText("1, 4, 9, 16, 25");
	await run.click();
	await expect(output.locator("#result")).toHaveText("1, 4, 9, 16, 25");
	await expect(preview.locator("tp-iframe")).toBeVisible();
	await source
		.getByRole("radio", { name: "file-unknown", exact: true })
		.check();
	await expect(consoleOutput).toContainText(
		"The file is missing or does not contain valid JSON.",
	);
	await expect(consoleOutput).not.toContainText("1, 4, 9, 16, 25");
	await expect(consoleOutput).not.toContainText("Hello Python playground");
	await source.getByRole("radio", { name: "file1", exact: true }).check();
	await run.click();
	await expect(output.locator("#result")).toHaveText("6 × 7 = 42");
});

test("repository examples render distinct projects and reload edited Python imports", async ({
	page,
}) => {
	await page.goto("/index.html#/components/python-playground/index.md");
	const controls = page.locator(
		'tp-component-viewer[tag="tp-python-playground"]',
	);
	await controls.getByRole("radio", { name: "Demo", exact: true }).check();
	const preview = controls.frameLocator("[data-component-preview] iframe");
	const output = preview.frameLocator("tp-python-playground tp-iframe iframe");
	const repository = controls.locator('[data-component-setting="repository"]');
	await controls
		.locator('[data-component-setting="src"]')
		.getByRole("radio", { name: "Default", exact: true })
		.check();
	const run = preview.locator("[data-tp-playground-run] button");
	const consoleOutput = preview.locator("tp-console");
	await repository.getByRole("radio", { name: "dir1", exact: true }).check();
	await expect(output.locator("#result")).toHaveText("2 + 3 = 5");
	await run.click();
	await expect(output.locator("#result")).toHaveText("2 + 3 = 5");
	await repository.getByRole("radio", { name: "dir2", exact: true }).check();
	await expect(output.locator("#result")).toHaveText("Area: 24");
	await preview.locator("tp-python-playground").evaluate((element) => {
		(element as HTMLElement & { openFile: (path: string) => void }).openFile(
			"/geometry.py",
		);
	});
	await preview.locator("tp-code-editor").evaluate((element) => {
		const value =
			"def rectangle_area(width, height):\n    return width * height + 1\n";
		(element as HTMLElement & { setValue: (value: string) => void }).setValue(
			value,
		);
		element.dispatchEvent(
			new CustomEvent("tp-code-editor-change", { detail: { value } }),
		);
	});
	await run.click();
	await expect(output.locator("#result")).toHaveText("Area: 25");
	await repository
		.getByRole("radio", { name: "dir-unknown", exact: true })
		.check();
	await expect(consoleOutput).toContainText(
		"attributes-repository-dir-unknown/project.json",
	);
	await expect(consoleOutput).not.toContainText("Area: 25");
	await repository.getByRole("radio", { name: "Default", exact: true }).check();
	await expect(output.locator("#app")).toHaveText("Hello Python playground");
	await expect(consoleOutput).toContainText("Hello Python playground");
	await run.click();
	await expect(output.locator("#app")).toHaveText("Hello Python playground");
});
