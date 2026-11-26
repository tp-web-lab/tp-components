import { readFileSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";

async function expectCompactResults(page: Page, name: string): Promise<void> {
	const values = page
		.locator(
			`tp-${name} [data-tp-question-feedback-output] tp-console [data-tp-console-values]`,
		)
		.filter({ hasText: /\[(passed|failed|skipped)\]|unittest:|PlUnit:/ });
	await expect(values).toHaveCount(4);
	const lines = await values.allTextContents();
	expect(
		lines.filter((line) => /\[(passed|failed|skipped)\]/.test(line)),
	).toHaveLength(3);
	for (const line of lines) expect(line).not.toMatch(/[\r\n]/);
	expect(lines.join(" ")).not.toContain("Traceback");
}

for (const language of [
	"javascript",
	"typescript",
	"python",
	"prolog",
	"scheme",
	"ocaml",
]) {
	for (const kind of ["interpreter", "playground", "viewer"]) {
		for (const variant of ["introduction", "feedback-file"]) {
			test(`${language} ${kind} ${variant} question runs optional Feedback tests against edited code`, async ({
				page,
			}) => {
				const name = `${language}-${kind}-question`;
				const markup = readFileSync(
					`public/docs/components/${name}/examples/${variant}.html`,
					"utf8",
				);
				await page.route("**/question-feedback-fixture.html", (route) =>
					route.fulfill({
						contentType: "text/html",
						body: "<!doctype html><html><body></body></html>",
					}),
				);
				await page.goto("/question-feedback-fixture.html");
				const initial = await page.evaluate(
					async ({ name, markup }) => {
						await import(`/src/components/${name}/${name}.ts`);
						document.addEventListener(
							"tp-playground-src-load",
							() => {
								document.body.dataset.sourceReady = "true";
							},
							{ once: true },
						);
						document.body.innerHTML = markup;
						const question = document.querySelector(`tp-${name}`);
						const src = question?.getAttribute("src");
						if (!src) {
							const script = question?.querySelector("script[type^='tp/']");
							if (!script) throw new Error("Missing inline source");
							return (script.textContent ?? "").replace(/^ {4}/gm, "").trim();
						}
						const contents = await (await fetch(src)).text();
						if (src.endsWith(".md")) {
							const program = contents.match(/\[Program\]\(([^)]+)\)/)?.[1];
							if (!program) throw new Error("Missing Program link");
							return (
								await (
									await fetch(new URL(program, new URL(src, location.href)))
								).text()
							).trim();
						}
						return contents.trim();
					},
					{ name, markup },
				);
				await expect
					.poll(() =>
						page.evaluate((name) => {
							const editor = document.querySelector(
								`tp-${name} tp-code-editor`,
							) as (HTMLElement & { getValue(): string }) | null;
							return editor?.getValue().trim();
						}, name),
					)
					.toBe(initial);
				if (kind !== "interpreter" && variant === "introduction")
					await expect
						.poll(() => page.evaluate(() => document.body.dataset.sourceReady))
						.toBe("true");
				await page.evaluate(async (name) => {
					const question = document.querySelector(
						`tp-${name}`,
					) as HTMLElement & {
						submit(): Promise<void>;
					};
					await question.submit();
				}, name);
				const report = page
					.frameLocator(`tp-${name} tp-iframe[title="Test execution"] iframe`)
					.locator("[data-tp-test-results]");
				await expect(report).toHaveAttribute("data-test-result", "failed", {
					timeout: 120_000,
				});
				await expect(report.locator('[data-test-status="failed"]')).toHaveCount(
					3,
				);
				await expect(report.locator('[data-test-status="passed"]')).toHaveCount(
					0,
				);
				if (["python", "prolog"].includes(language))
					await expectCompactResults(page, name);
				if (language === "scheme") {
					const output = page.locator(
						`tp-${name} [data-tp-question-feedback-output] tp-console`,
					);
					await expect(output).toContainText("Positive number [failed]");
					await expect(output).toContainText("expected-value");
				}
				const corrected =
					language === "scheme"
						? "(define (double x) (* x 2))"
						: language === "ocaml"
							? "let double x = x * 2;;"
							: initial.replace(/\+\s*1/g, "* 2");
				expect(corrected).not.toBe(initial);
				await page.evaluate(
					async ({ name, corrected }) => {
						const question = document.querySelector(
							`tp-${name}`,
						) as HTMLElement & { submit(): Promise<void> };
						const editor = question.querySelector(
							"tp-code-editor",
						) as HTMLElement & { setValue(value: string): void };
						editor.setValue(corrected);
						// Match the editor's user-change event when setting its source through the API.
						editor.dispatchEvent(
							new CustomEvent("tp-code-editor-change", {
								bubbles: true,
								detail: { value: corrected },
							}),
						);
						await question.submit();
					},
					{ name, corrected },
				);
				await expect(report).toHaveAttribute("data-test-result", "passed", {
					timeout: 120_000,
				});
				await expect(report.locator('[data-test-status="passed"]')).toHaveCount(
					3,
				);
				await expect(report.locator('[data-test-status="failed"]')).toHaveCount(
					0,
				);
				await expect(report.locator("thead")).toContainText("Status");
				await page.getByRole("tab", { name: "Feedback", exact: true }).click();
				await expect(report.locator("tbody tr")).toHaveCount(3);
				await expect(
					page.locator(`tp-${name} tp-iframe[title="Test execution"]`),
				).toBeHidden();
				const consoleOutput = page.locator(
					`tp-${name} [data-tp-question-feedback-output] tp-console`,
				);
				await expect(consoleOutput).toBeVisible();
				await expect(consoleOutput).toContainText("passed");
				if (["python", "prolog"].includes(language))
					await expectCompactResults(page, name);
				if (language === "scheme") {
					await expect(consoleOutput).toContainText("Positive number [passed]");
					await expect(consoleOutput).toContainText("Zero [passed]");
					await expect(consoleOutput).toContainText("Negative number [passed]");
				}
			});
		}
	}
}

test("loads relative Feedback tests from an external Markdown exercise", async ({
	page,
}) => {
	await page.route("**/question-feedback-fixture.html", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: "<!doctype html><html><body></body></html>",
		}),
	);
	await page.route("**/feedback-exercise/exercise.md", (route) =>
		route.fulfill({
			contentType: "text/markdown",
			body: `Title
: Double

Prompt
: Implement double.

Program
: \`\`\`javascript
  function double(x) { return x * 2; }
  \`\`\`

Query
: double(3)

Feedback
: tests/double.test.js

Solution
: Multiply by two.
`,
		}),
	);
	await page.route("**/feedback-exercise/tests/double.test.js", (route) =>
		route.fulfill({
			contentType: "text/javascript",
			body: "import { describe, it, expect } from '@tp/test'; describe('Double', () => { it('doubles', () => expect(double(3)).to.equal(6)); });",
		}),
	);
	await page.goto("/question-feedback-fixture.html");
	await page.evaluate(async () => {
		await import(
			"/src/components/javascript-interpreter-question/javascript-interpreter-question.ts"
		);
		document.body.innerHTML =
			'<tp-javascript-interpreter-question open src="/feedback-exercise/exercise.md"></tp-javascript-interpreter-question>';
	});
	await expect
		.poll(() =>
			page.evaluate(() => {
				const editor = document.querySelector("tp-code-editor") as
					| (HTMLElement & { getValue(): string })
					| null;
				return editor?.getValue().trim();
			}),
		)
		.toBe("function double(x) { return x * 2; }");
	await page.evaluate(async () => {
		const question = document.querySelector(
			"tp-javascript-interpreter-question",
		) as HTMLElement & { submit(): Promise<void> };
		await question.submit();
	});
	await expect(
		page
			.frameLocator('tp-iframe[title="Test execution"] iframe')
			.locator("[data-tp-test-results]"),
	).toHaveAttribute("data-test-result", "passed");
});
