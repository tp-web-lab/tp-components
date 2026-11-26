import { expect, test } from "@playwright/test";

for (const language of ["javascript", "typescript", "python"]) {
	for (const scenario of [
		"passing",
		"failing",
		"runtime-error",
		"import-error",
		"empty",
		"fixture-error",
		"library-error",
		language === "python" ? "unexpected-success" : "timeout",
	]) {
		test(`${language}: ${scenario} common test report`, async ({ page }) => {
			await page.route("**/test-frameworks.html", (route) =>
				route.fulfill({
					contentType: "text/html",
					body: "<!doctype html><html><body></body></html>",
				}),
			);
			if (scenario === "library-error")
				await page.route(
					language === "python" ? "**/pyodide.js" : "**/mocha@10/mocha.js",
					(route) => route.abort(),
				);
			await page.goto("/test-frameworks.html");
			await page.evaluate(
				async ({ language, scenario }) => {
					const projectData = await (
						await fetch(
							`/docs/components/${language}-playground/examples/framework-tests.json`,
						)
					).json();
					const testFile = projectData.files[1];
					const python = language === "python";
					if (scenario === "unexpected-success")
						testFile.content =
							"import unittest\nclass Unexpected(unittest.TestCase):\n    @unittest.expectedFailure\n    def test_success(self):\n        pass\n";
					if (scenario === "timeout")
						testFile.content =
							"import {it} from '@tp/test'; it('timeout', () => new Promise(() => {})).timeout(20);";

					if (scenario === "failing")
						projectData.files[0].content = projectData.files[0].content.replace(
							"value * 2",
							"value",
						);
					if (scenario === "empty") testFile.content = "";
					if (scenario === "runtime-error")
						testFile.content = python
							? "import unittest\nclass Errors(unittest.TestCase):\n    def test_error(self):\n        raise ValueError('case exploded')\n"
							: "import {it} from '@tp/test'; it('rejected promise', async () => {throw new Error('case exploded');});";
					if (scenario === "import-error")
						testFile.content = python
							? "raise RuntimeError('module exploded')"
							: "throw new Error('module exploded');";
					if (scenario === "fixture-error")
						testFile.content = python
							? "import unittest\nclass BrokenFixture(unittest.TestCase):\n    @classmethod\n    def setUpClass(cls):\n        raise ValueError('fixture exploded')\n    def test_unreachable(self):\n        pass\n"
							: "import {describe, it, before} from '@tp/test'; describe('Broken fixture', () => { before(() => {throw new Error('fixture exploded');}); it('unreachable', () => {}); });";
					await import(
						`/src/components/${language}-playground/${language}-playground.ts`
					);
					const projectModule = await import(
						`/src/components/${language}-playground/${language}-project.ts`
					);
					const Project =
						projectModule[
							language === "javascript"
								? "TpJavascriptProject"
								: language === "typescript"
									? "TpTypescriptProject"
									: "TpPythonProject"
						];
					const element = document.createElement(
						`tp-${language}-playground`,
					) as HTMLElement & {
						setProject(project: unknown): void;
						test(): Promise<void>;
					};
					document.body.append(element);
					await new Promise((resolve) => setTimeout(resolve, 0));
					element.setProject(new Project(projectData));
					await element.test();
				},
				{ language, scenario },
			);
			const nativeFrame = page
				.locator(`tp-${language}-playground tp-iframe iframe`)
				.first();
			const report = nativeFrame
				.contentFrame()
				.locator("[data-tp-test-results][data-test-complete]");
			await expect(report).toHaveAttribute(
				"data-test-result",
				scenario === "passing" ? "passed" : "failed",
				{ timeout: 90000 },
			);
			await expect(report.locator("th")).toHaveText([
				"Suite",
				"Test",
				"Status",
				"Details",
			]);
			if (scenario === "passing") {
				if (language !== "python") {
					for (const library of ["mocha", "chai"]) {
						await expect(
							nativeFrame.contentFrame().locator(`script[src*="/${library}@"]`),
						).toHaveAttribute("crossorigin", "anonymous");
					}
				}

				await expect(report.locator('[data-test-status="passed"]')).toHaveCount(
					language === "python" ? 4 : 3,
				);
				await expect(
					report.locator('[data-test-status="skipped"]'),
				).toHaveCount(1);
				await expect(
					report.locator('[data-test-status="expected-failure"]'),
				).toHaveCount(language === "python" ? 1 : 0);
				await expect(report.locator("details")).not.toHaveAttribute("open", "");
				await report.locator("summary").click();
				await expect(report.locator("details pre")).toContainText(
					"Preparing Double",
				);
				await expect
					.poll(async () =>
						nativeFrame.evaluate((element) => {
							const frame = element as HTMLIFrameElement;
							return Math.abs(
								frame.getBoundingClientRect().height -
									(frame.contentDocument?.documentElement.scrollHeight ?? 0),
							);
						}),
					)
					.toBeLessThan(5);
				const height = (await nativeFrame.boundingBox())?.height ?? 0;
				await report.evaluate((element) => {
					const probe = document.createElement("div");
					probe.dataset.heightProbe = "";
					probe.style.height = "500px";
					element.append(probe);
				});
				await expect
					.poll(async () => (await nativeFrame.boundingBox())?.height ?? 0)
					.toBeGreaterThan(height + 400);
				await report
					.locator("[data-height-probe]")
					.evaluate((element) => element.remove());
				await expect
					.poll(async () =>
						Math.abs(((await nativeFrame.boundingBox())?.height ?? 0) - height),
					)
					.toBeLessThan(5);
				await page.setViewportSize({ width: 500, height: 800 });
				await expect(report).toBeVisible();
				// Re-run with changed source: a previous success must never survive the new run.
				await report.evaluate((element) =>
					element.setAttribute("data-old-report", ""),
				);
				await page
					.locator(`tp-${language}-playground`)
					.evaluate(async (element) => {
						const api = element as HTMLElement & {
							getProject(): { files: { path: string; content: string }[] };
							setProject(project: unknown): void;
							test(): Promise<void>;
						};
						const project = api.getProject();
						project.files[0].content = project.files[0].content.replace(
							"value * 2",
							"value",
						);
						api.setProject(project);
						await api.test();
					});
				await expect(
					nativeFrame
						.contentFrame()
						.locator(
							"[data-tp-test-results][data-test-complete]:not([data-old-report])",
						),
				).toHaveAttribute("data-test-result", "failed", { timeout: 90000 });
			} else {
				await expect(
					report.locator('[data-test-status="failed"]'),
				).not.toHaveCount(0);
				if (scenario === "failing")
					await expect(
						report.locator('[data-test-status="failed"]').first(),
					).toContainText(
						language === "python" ? "AssertionError" : "Expected:",
					);
				if (scenario.endsWith("-error") && scenario !== "library-error")
					await expect(report).toContainText("exploded");
				if (scenario === "empty")
					await expect(report).toContainText("No tests executed.");
			}
		});
	}
}
