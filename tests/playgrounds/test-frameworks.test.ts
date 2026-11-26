import { expect, test } from "@playwright/test";

for (const language of ["prolog", "scheme", "ocaml"]) {
	for (const scenario of [
		"passing",
		"failing",
		"empty",
		"syntax-error",
		...(language === "scheme" ? ["isolated"] : []),
	]) {
		test(`${language}: ${scenario} native test suite`, async ({ page }) => {
			await page.route("**/test-frameworks.html", (route) =>
				route.fulfill({
					contentType: "text/html",
					body: "<!doctype html><html><body></body></html>",
				}),
			);
			await page.goto("/test-frameworks.html");
			await page.evaluate(
				async ({ language, scenario }) => {
					const projectData = await (
						await fetch(
							`/docs/components/${language}-playground/examples/framework-tests.json`,
						)
					).json();
					const source = projectData.files[0];
					if (scenario === "isolated") {
						source.content = `(define (local-value) 42)
(define result ((eval 'local-value)))
(define (eval expression environment) 'student-evaluator)
(define (apply procedure arguments) 'student-apply)
(display "ready ") result`;
						projectData.files[1].content = `(test-begin "Isolated source")
(test-equal "Native eval sees submitted definitions" 42 result)
(test-equal "Single execution output" "ready 42" tp-test-program-output)
(test-equal "Student apply is available" 'student-apply (apply + '(1 2)))
(test-end "Isolated source")`;
					}

					if (scenario === "failing")
						source.content =
							language === "scheme"
								? "(define (double x) x)"
								: language === "ocaml"
									? "let double x = x;;"
									: "double(X, X). choice(a). choice(b).";
					if (scenario === "empty")
						projectData.files[1].content =
							language === "prolog"
								? ":- use_module(library(plunit)). :- begin_tests(empty). :- end_tests(empty)."
								: "";
					if (scenario === "syntax-error")
						projectData.files[1].content =
							language === "scheme"
								? "(test-equal"
								: language === "ocaml"
									? "let = ;;"
									: ":- use_module(library(plunit)). :- begin_tests(bad). test(good) :- true. test(bad) :- (. :- end_tests(bad).";
					const module = await import(
						`/src/components/${language}-playground/${language}-playground.ts`
					);
					const element = document.createElement(`tp-${language}-playground`);
					const projectModule = await import(
						language === "prolog"
							? "/src/components/prolog-playground/prolog-project.ts"
							: "/src/components/playground/project.ts"
					);
					document.body.append(element);
					await new Promise((resolve) => setTimeout(resolve, 0));
					(
						element as HTMLElement & { setProject(project: unknown): void }
					).setProject(
						new (language === "prolog"
							? projectModule.TpPrologProject
							: projectModule.TpProject)(projectData),
					);
					// The same public action is used by the toolbar Test button.
					await (element as HTMLElement & { test(): Promise<void> }).test();
					void module;
				},
				{ language, scenario },
			);
			const frame = page
				.locator(`tp-${language}-playground tp-iframe iframe`)
				.first()
				.contentFrame();
			const report = frame.locator(
				"[data-tp-test-results][data-test-complete]",
			);
			await expect(report).toHaveAttribute(
				"data-test-result",
				scenario === "passing" || scenario === "isolated" ? "passed" : "failed",
				{ timeout: 90000 },
			);
			if (scenario === "passing") {
				await expect(
					report.locator('[data-test-status="passed"]'),
				).not.toHaveCount(0);
				await expect(
					report.locator('[data-test-status="skipped"]'),
				).toHaveCount(1);
				await expect(report.locator("details")).not.toHaveAttribute("open", "");
				await report.locator("summary").click();
				await expect(report.locator("details")).toHaveAttribute("open", "");
				const nativeFrame = page
					.locator(`tp-${language}-playground tp-iframe iframe`)
					.first();
				await expect
					.poll(async () =>
						nativeFrame.evaluate((element) => {
							const frameElement = element as HTMLIFrameElement;
							return Math.abs(
								frameElement.getBoundingClientRect().height -
									(frameElement.contentDocument?.documentElement.scrollHeight ??
										0),
							);
						}),
					)
					.toBeLessThan(5);
				const initialHeight = (await nativeFrame.boundingBox())?.height ?? 0;
				await report.evaluate((element) => {
					const block = document.createElement("div");
					block.dataset.heightProbe = "";
					block.style.height = "500px";
					element.append(block);
				});
				await expect
					.poll(async () => (await nativeFrame.boundingBox())?.height ?? 0)
					.toBeGreaterThan(initialHeight + 400);
				await report
					.locator("[data-height-probe]")
					.evaluate((element) => element.remove());
				await expect
					.poll(async () =>
						Math.abs(
							((await nativeFrame.boundingBox())?.height ?? 0) - initialHeight,
						),
					)
					.toBeLessThan(5);
				await page.setViewportSize({ width: 500, height: 800 });
				await expect(report).toBeVisible();
			} else if (scenario === "isolated") {
				await expect(report.locator('[data-test-status="passed"]')).toHaveCount(
					3,
				);
			} else
				await expect(
					report.locator('[data-test-status="failed"]'),
				).not.toHaveCount(0);
		});
	}
}
