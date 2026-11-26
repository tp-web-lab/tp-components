import { expect, test } from "@playwright/test";

for (const scenario of [
	"passing",
	"inferred",
	"query-change",
	"columns",
	"duplicates",
	"unexpected-error",
	"wrong-error",
	"setup-error",
	"missing-source",
	"invalid-json",
	"empty",
	"invalid-expectation",
	"sqlite",
	"library-error",
]) {
	test(`SQL comparisons: ${scenario}`, async ({ page }) => {
		await page.route("**/sql-tests.html", (route) =>
			route.fulfill({
				contentType: "text/html",
				body: "<!doctype html><html><body></body></html>",
			}),
		);
		if (scenario === "library-error")
			await page.route("**/sql-wasm.js", (route) => route.abort());
		await page.goto("/sql-tests.html");
		const saved = await page.evaluate(async (scenario) => {
			const data = await (
				await fetch(
					"/docs/components/sql-playground/examples/framework-tests.json",
				)
			).json();
			const testsFile = data.files.find(
				(file: { path: string }) => file.path === data.test,
			);
			const suite = JSON.parse(testsFile.content);
			if (scenario === "inferred") delete data.test;
			localStorage.setItem("tp-sql-db:sql-result-comparisons", "untouched");
			if (scenario === "query-change")
				data.files[0].content =
					"SELECT name, score FROM students ORDER BY name DESC;";
			if (scenario === "columns")
				suite.tests[0].expected[0].columns = ["NAME", "score"];
			if (scenario === "duplicates") suite.tests[1].expected[0].values.pop();
			if (scenario === "unexpected-error")
				data.files[0].content = "SELECT * FROM nonexistent;";
			if (scenario === "wrong-error")
				suite.tests[7].error = "different SQL error";
			if (scenario === "setup-error") {
				data.files[1].content = "invalid SQL;";
				suite.tests = [
					{
						name: "Cannot accept a setup error",
						query: "SELECT 1;",
						error: "syntax error",
					},
				];
			}
			if (scenario === "missing-source")
				suite.tests = [
					{ name: "Missing file", src: "/missing.sql", error: "not found" },
				];
			if (scenario === "empty") suite.tests = [];
			if (scenario === "invalid-expectation")
				suite.tests = [
					{
						name: "Wrong shape",
						query: "SELECT 1;",
						expected: [{ columns: ["n"], values: [[1, 2]] }],
					},
				];
			testsFile.content =
				scenario === "invalid-json" ? "{invalid" : JSON.stringify(suite);
			let saved = "";
			if (scenario === "sqlite") {
				await new Promise<void>((resolve, reject) => {
					const script = document.createElement("script");
					script.src =
						"https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/sql-wasm.js";
					script.onload = () => resolve();
					script.onerror = () => reject(new Error("Fixture load failed"));
					document.head.append(script);
				});
				const owner = window as unknown as {
					initSqlJs(options: { locateFile(file: string): string }): Promise<{
						Database: new () => {
							run(sql: string): void;
							export(): Uint8Array;
							close(): void;
						};
					}>;
				};
				const SQL = await owner.initSqlJs({
					locateFile: (file) =>
						`https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/${file}`,
				});
				const db = new SQL.Database();
				db.run(data.files[1].content);
				saved = btoa(
					Array.from(db.export(), (byte) => String.fromCharCode(byte)).join(""),
				);
				db.close();
				localStorage.setItem("sql-tests-snapshot", saved);
				data.database = {
					id: "stored",
					name: "Stored",
					type: "sqlite",
					path: "/stored.sqlite",
					storageKey: "sql-tests-snapshot",
				};
				delete data.setup;
			}
			await import("/src/components/sql-playground/sql-playground.ts");
			const { TpSqlProject } = await import(
				"/src/components/sql-playground/sql-project.ts"
			);
			const element = document.createElement(
				"tp-sql-playground",
			) as HTMLElement & { setProject(project: unknown): void };
			document.body.append(element);
			await new Promise((resolve) => setTimeout(resolve, 0));
			element.setProject(new TpSqlProject(data));
			return saved;
		}, scenario);
		const playground = page.locator("tp-sql-playground");
		const button = playground.locator("[data-tp-playground-test]");
		await expect(button).not.toHaveAttribute("disabled", "");
		await button.click();
		const native = playground.locator("tp-iframe iframe").first();
		const report = native
			.contentFrame()
			.locator("[data-tp-test-results][data-test-complete]");
		const passing = ["passing", "sqlite", "inferred"].includes(scenario);
		await expect(report).toHaveAttribute(
			"data-test-result",
			passing ? "passed" : "failed",
			{ timeout: 90000 },
		);
		await expect(report.locator("th")).toHaveText([
			"Suite",
			"Test",
			"Status",
			"Details",
		]);
		if (passing) {
			await expect(report.locator('[data-test-status="passed"]')).toHaveCount(
				8,
			);
			await expect(report.locator('[data-test-status="skipped"]')).toHaveCount(
				1,
			);
			await expect(report.locator("details")).not.toHaveAttribute("open", "");
			await report.locator("summary").click();
			await expect(report.locator("details")).toContainText(
				"Next test starts fresh",
			);
		} else
			await expect(
				report.locator('[data-test-status="failed"]'),
			).not.toHaveCount(0);
		if (["query-change", "columns", "duplicates"].includes(scenario))
			await expect(report).toContainText("Expected:");
		if (scenario === "setup-error")
			await expect(report).toContainText("Database setup failed");
		if (scenario === "passing") {
			const backgrounds: string[] = [];
			for (const theme of ["light", "dark", "light"]) {
				await playground.evaluate((element, theme) => {
					element.classList.remove("tp-light", "tp-dark");
					element.classList.add(`tp-${theme}`);
				}, theme);
				await expect(native.contentFrame().locator("html")).toHaveClass(
					`tp-${theme}`,
				);
				const expectedBackground = await playground.evaluate(
					(element) => getComputedStyle(element).backgroundColor,
				);
				await expect
					.poll(() =>
						report.evaluate(
							(element) =>
								element.ownerDocument.defaultView?.getComputedStyle(
									element.ownerDocument.body,
								).backgroundColor,
						),
					)
					.toBe(expectedBackground);
				const appearance = await report.evaluate((element) => {
					const view = element.ownerDocument.defaultView;
					const header = element.querySelector("th");
					if (!view || !header)
						throw new Error("Missing report document or header");
					return {
						background: view.getComputedStyle(element.ownerDocument.body)
							.backgroundColor,
						border: view.getComputedStyle(header).borderBottomWidth,
					};
				});
				backgrounds.push(appearance.background);
				expect(appearance.background).not.toBe("rgba(0, 0, 0, 0)");
				expect(Number.parseFloat(appearance.border)).toBeGreaterThan(0);
			}
			expect(backgrounds[0]).not.toBe(backgrounds[1]);
			expect(backgrounds[0]).toBe(backgrounds[2]);
			await expect
				.poll(async () =>
					native.evaluate((element) => {
						const f = element as HTMLIFrameElement;
						return Math.abs(
							f.getBoundingClientRect().height -
								(f.contentDocument?.documentElement.scrollHeight ?? 0),
						);
					}),
				)
				.toBeLessThan(5);
			const height = (await native.boundingBox())?.height ?? 0;
			await report.evaluate((element) => {
				const probe = document.createElement("div");
				probe.dataset.heightProbe = "";
				probe.style.height = "500px";
				element.append(probe);
			});
			await expect
				.poll(async () => (await native.boundingBox())?.height ?? 0)
				.toBeGreaterThan(height + 400);
			await report
				.locator("[data-height-probe]")
				.evaluate((element) => element.remove());
			await expect
				.poll(async () =>
					Math.abs(((await native.boundingBox())?.height ?? 0) - height),
				)
				.toBeLessThan(5);
			await page.setViewportSize({ width: 500, height: 800 });
			await expect(report).toBeVisible();
			await report.evaluate((element) =>
				element.setAttribute("data-old-report", ""),
			);
			await playground.evaluate(async (element) => {
				const api = element as HTMLElement & {
					getProject(): { files: { path: string; content: string }[] };
					setProject(project: unknown): void;
					test(): Promise<void>;
				};
				const project = api.getProject();
				project.files[0].content = "SELECT 0 AS wrong;";
				api.setProject(project);
				await api.test();
			});
			await expect(
				native
					.contentFrame()
					.locator(
						"[data-tp-test-results][data-test-complete]:not([data-old-report])",
					),
			).toHaveAttribute("data-test-result", "failed");
		}
		expect(
			await page.evaluate(() =>
				localStorage.getItem("tp-sql-db:sql-result-comparisons"),
			),
		).toBe("untouched");
		if (scenario === "sqlite")
			expect(
				await page.evaluate(() => localStorage.getItem("sql-tests-snapshot")),
			).toBe(saved);
	});
}
