import { expect, type Locator, test } from "@playwright/test";

/** Checks both the native iframe and its output panel against visible content. */
async function expectFittedFrame(viewer: Locator): Promise<void> {
	await expect
		.poll(async () =>
			viewer.locator("iframe").evaluate((element) => {
				const frame = element as HTMLIFrameElement;
				const body = frame.contentDocument?.body;
				const content = body?.querySelector("tp-python-playground");
				if (!body || !content) return false;
				const bottom = Math.max(
					content.getBoundingClientRect().bottom,
					body.querySelector("[data-test-growth]")?.getBoundingClientRect()
						.bottom ?? 0,
				);
				const height = frame.getBoundingClientRect().height;
				const panelHeight =
					frame.parentElement?.getBoundingClientRect().height ?? 0;
				return (
					height >= bottom &&
					height <= bottom + 32 &&
					panelHeight >= height &&
					panelHeight <= height + 32
				);
			}),
		)
		.toBe(true);
}

test("all markup viewers fit nested playgrounds when content grows, shrinks or changes", async ({
	page,
}) => {
	await page.goto("/index.html#/components/python-playground/index.md");
	const exampleTabs = page
		.locator("tp-html-viewer")
		.locator("xpath=ancestor::tp-tabs[1]");
	const languages = ["html", "asciidoc", "markdown", "restructuredtext"];
	for (const [index, language] of languages.entries()) {
		await test.step(language, async () => {
			await exampleTabs
				.locator(':scope > [data-tp-tablist] > [role="tab"]')
				.nth(index)
				.click();
			const viewer = page.locator(`tp-${language}-viewer`);
			await viewer.locator("select").selectOption("Basic usage");
			const content = viewer.frameLocator("iframe");
			await expect(
				content.locator("tp-python-playground tp-code-editor"),
			).toBeVisible();
			await expectFittedFrame(viewer);
			const editor = content.locator("tp-python-playground tp-code-editor");
			const original = await editor.evaluate((element) =>
				(element as HTMLElement & { getValue(): string }).getValue(),
			);
			await editor.evaluate((element) => {
				(element as HTMLElement & { setValue(value: string): void }).setValue(
					Array.from({ length: 60 }, (_, line) => `print(${line})`).join("\n"),
				);
			});
			await expect
				.poll(() =>
					editor.evaluate((element) => element.getBoundingClientRect().height),
				)
				.toBeGreaterThan(700);
			await expectFittedFrame(viewer);
			await editor.evaluate((element, value) => {
				(element as HTMLElement & { setValue(value: string): void }).setValue(
					value,
				);
			}, original);
			await expect
				.poll(() =>
					editor.evaluate((element) => element.getBoundingClientRect().height),
				)
				.toBeLessThan(400);
			await content
				.locator("[data-tp-playground-editor-toolbar] button")
				.click();
			await expectFittedFrame(viewer);
			await content.locator("body").evaluate((body) => {
				setTimeout(() => {
					const extra = body.ownerDocument.createElement("p");
					extra.setAttribute("data-test-growth", "");
					extra.style.height = "800px";
					extra.textContent = "Asynchronously added content";
					body.append(extra);
				}, 20);
			});
			await expect(content.locator("[data-test-growth]")).toBeVisible();
			await expectFittedFrame(viewer);
			await content
				.locator("[data-test-growth]")
				.evaluate((element) => element.remove());
			await expectFittedFrame(viewer);
			await page.setViewportSize({ width: 800, height: 768 });
			await expectFittedFrame(viewer);
			await page.setViewportSize({ width: 1280, height: 720 });
			await expectFittedFrame(viewer);
			await viewer.locator("select").selectOption("Single source file");
			await expect(content.locator("tp-python-playground")).toHaveAttribute(
				"src",
				/example\.py$/,
			);
			await expect(
				content.locator("tp-python-playground tp-code-editor"),
			).toBeVisible();
			await expectFittedFrame(viewer);
		});
	}
});
