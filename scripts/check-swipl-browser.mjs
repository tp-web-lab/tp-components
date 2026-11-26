import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium, firefox, webkit } from "@playwright/test";
const baseUrl = process.env.TP_EXAMPLES_URL ?? "http://127.0.0.1:4173";
const browser = await { chromium, firefox, webkit }[
	process.env.BROWSER ?? "chromium"
].launch();
try {
	const page = await browser.newPage();
	page.on("console", (message) => {
		if (message.type() === "error") console.error(message.text());
	});
	page.on("pageerror", (error) => console.error(error));
	if (process.env.SWIPL_DIST)
		await page.route(
			"https://cdn.jsdelivr.net/npm/swipl-wasm@8.3.1/dist/swipl/*",
			async (route) => {
				const name = new URL(route.request().url()).pathname.split("/").at(-1);
				await route.fulfill({
					contentType: name.endsWith(".js")
						? "application/javascript"
						: name.endsWith(".wasm")
							? "application/wasm"
							: "application/octet-stream",
					body: await readFile(process.env.SWIPL_DIST + "/" + name),
					headers: { "access-control-allow-origin": "*" },
				});
			},
		);
	await page.route("**/__swipl-test", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: "<!doctype html><body></body>",
		}),
	);
	await page.goto(`${baseUrl}/__swipl-test`);
	await page.evaluate(async () => {
		const { buildPrologExecutionDocument } = await import(
			"/src/components/prolog-playground/prolog-execution-document.ts"
		);
		const { TpPrologProject } = await import(
			"/src/components/prolog-playground/prolog-project.ts"
		);
		const project = new TpPrologProject({
			entry: "/program.pl",
			query: "/query.pl",
			files: [
				{
					path: "/index.html",
					language: "html",
					content: '<p id="native-dom">Before</p>',
				},
				{
					path: "/program.pl",
					language: "prolog",
					content:
						':- use_module(library(clpfd)).\n:- use_module(library(wasm)).\n:- use_module(library(dom)).\ndigit(X) :- X in 1..3.\nupdate :- P := document.getElementById("native-dom"), P.textContent := "Updated by SWI", bind(P, click, _, P.textContent := "Clicked").',
				},
				{
					path: "/query.pl",
					language: "prolog",
					content:
						"digit(X), labeling([], [X]).\ndigit(X).\nupdate.\nwriteln(hello).\nX is 1.5 + 2.5.\nmissing_predicate.",
				},
			],
		});
		const result = await buildPrologExecutionDocument(project);
		const frame = document.createElement("iframe");
		frame.srcdoc = result.html;
		document.body.append(frame);
	});
	const frame =
		page.frames().find((frame) => frame !== page.mainFrame()) ??
		(await new Promise((resolve) => page.once("frameattached", resolve)));
	await frame.waitForFunction(
		() =>
			document
				.querySelector("[data-tp-prolog-output]")
				?.textContent.includes("missing_predicate"),
		{},
		{ timeout: 60000 },
	);
	const output = await frame.locator("[data-tp-prolog-output]").textContent();
	console.log(output);
	assert.match(output, /X = 1/);
	assert.match(output, /X = 3/);
	assert.match(output, /X = 4/);
	assert.match(output, /hello/);
	assert.match(output, /ERROR/);
	assert.equal(
		await frame.locator("#native-dom").textContent(),
		"Updated by SWI",
	);
	console.log(
		"SWI execution, CLP(FD), residual constraints, DOM, output and errors verified.",
	);
	for (const [name, test, expected] of [
		[
			"PlUnit passing",
			":- use_module(library(plunit)).\n:- begin_tests(arithmetic).\ntest(sum) :- 2 =:= 1+1.\ntest(failure, [fail]) :- 1=2.\ntest(exception, [throws(error(example,_))]) :- throw(error(example,context)).\n:- end_tests(arithmetic).",
			"PlUnit: passed",
		],
		[
			"PlUnit failing",
			":- use_module(library(plunit)).\n:- begin_tests(arithmetic).\ntest(wrong) :- 1=2.\n:- end_tests(arithmetic).",
			"PlUnit: failed",
		],
		[
			"TP legacy",
			':- test(answer, member(X,[a,b]), ["X = a", "X = b"]).',
			"Tests: 1/1 passed",
		],
	]) {
		await page.evaluate(
			async ({ test }) => {
				const { buildPrologTestDocument } = await import(
					"/src/components/prolog-playground/prolog-test-document.ts"
				);
				const { TpPrologProject } = await import(
					"/src/components/prolog-playground/prolog-project.ts"
				);
				const result = await buildPrologTestDocument(
					new TpPrologProject({
						entry: "/program.pl",
						test: "/test.pl",
						files: [
							{ path: "/program.pl", language: "prolog", content: "fact(ok)." },
							{ path: "/test.pl", language: "prolog", content: test },
						],
					}),
				);
				document.querySelector("iframe").srcdoc = result.html;
			},
			{ test },
		);
		await frame.waitForFunction(
			(expected) =>
				document
					.querySelector("[data-tp-prolog-test-output]")
					?.textContent.includes(expected),
			expected,
			{ timeout: 60000 },
		);
		console.log(
			name,
			await frame.locator("[data-tp-prolog-test-output]").textContent(),
		);
	}

	const catalog = JSON.parse(
		await readFile(
			"public/examples/playgrounds/prolog-playground/index.json",
			"utf8",
		),
	);
	const projects = [];
	for (const name of catalog.examples) {
		const directory = "public/examples/playgrounds/prolog-playground/" + name;
		const meta = JSON.parse(
			await readFile(directory + "/project.json", "utf8"),
		);
		const manifest = JSON.parse(
			await readFile(directory + "/.files.json", "utf8"),
		);
		const files = await Promise.all(
			manifest.files.map(async (path) => ({
				path: "/" + path,
				language: path.endsWith(".html") ? "html" : "prolog",
				content: await readFile(directory + "/" + path, "utf8"),
			})),
		);
		if (files.some((f) => f.path === "/test.pl")) meta.test = "/test.pl";
		projects.push({ ...meta, id: name, files });
	}
	for (const library of ["clpq", "clpr"])
		projects.push({
			id: library,
			entry: "/program.pl",
			query: "/query.pl",
			files: [
				{
					path: "/program.pl",
					language: "prolog",
					content: ":- use_module(library(" + library + ")).",
				},
				{ path: "/query.pl", language: "prolog", content: "{X = 1/3}." },
			],
		});
	for (const project of projects) {
		project.files.find(
			(file) => file.path === (project.query ?? "/query.pl"),
		).content += "\nwriteln('__TP_DONE__').";
		await page.evaluate(async (data) => {
			const { buildPrologExecutionDocument } = await import(
				"/src/components/prolog-playground/prolog-execution-document.ts"
			);
			const { TpPrologProject } = await import(
				"/src/components/prolog-playground/prolog-project.ts"
			);
			document.querySelector("iframe").srcdoc = (
				await buildPrologExecutionDocument(new TpPrologProject(data))
			).html;
		}, project);
		await frame.waitForFunction(
			() =>
				document
					.querySelector("[data-tp-prolog-output]")
					?.textContent.includes("__TP_DONE__\ntrue."),
			null,
			{ timeout: 60000 },
		);
		const result = await frame.locator("[data-tp-prolog-output]").textContent();
		assert.doesNotMatch(
			result,
			/ERROR:|Unknown procedure/,
			project.id + ": " + result,
		);
		if (project.id === "04-prolog-dom") {
			await frame.locator("#button").click();
			assert.equal(
				await frame.locator("#title").textContent(),
				"Clicked from Prolog!",
			);
		}
		if (project.id === "05-prolog-dom-advanced") {
			await frame.locator("#add-button").click();
			assert.equal(await frame.locator("li.added").count(), 1);
			await frame.locator("#replace-button").click();
			assert.equal(
				await frame.locator(".items li").first().textContent(),
				"First item replaced",
			);
			const count = await frame.locator(".items li").count();
			await frame.locator("#remove-button").click();
			assert.equal(await frame.locator(".items li").count(), count - 1);
			await frame.locator("#toggle-button").click();
			assert.equal(
				await frame.locator("#details").evaluate((e) => e.hidden),
				false,
			);
		}
		if (project.test) {
			await page.evaluate(async (data) => {
				const { buildPrologTestDocument } = await import(
					"/src/components/prolog-playground/prolog-test-document.ts"
				);
				const { TpPrologProject } = await import(
					"/src/components/prolog-playground/prolog-project.ts"
				);
				document.querySelector("iframe").srcdoc = (
					await buildPrologTestDocument(new TpPrologProject(data))
				).html;
			}, project);
			await frame.waitForFunction(
				() =>
					document
						.querySelector("[data-tp-prolog-test-output]")
						?.textContent.includes("PlUnit:"),
				null,
				{ timeout: 60000 },
			);
			assert.match(
				await frame.locator("[data-tp-prolog-test-output]").textContent(),
				/PlUnit: passed/,
			);
		}
		console.log("Verified project", project.id);
	}
} finally {
	await browser.close();
}
