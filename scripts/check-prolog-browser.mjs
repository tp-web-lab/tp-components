import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium, firefox, webkit } from "@playwright/test";
const base = process.env.TP_EXAMPLES_URL ?? "http://127.0.0.1:4173";
const browser = await { chromium, firefox, webkit }[
	process.env.BROWSER ?? "chromium"
].launch();
try {
	const page = await browser.newPage();
	page.setDefaultTimeout(20000);
	page.on("pageerror", (error) => console.error(error));
	if (process.env.SWIPL_DIST)
		await page.route(
			"https://cdn.jsdelivr.net/npm/swipl-wasm@8.3.1/dist/swipl/*",
			async (route) => {
				const name = new URL(route.request().url()).pathname.split("/").at(-1);
				await route.fulfill({
					body: await readFile(`${process.env.SWIPL_DIST}/${name}`),
					contentType: name.endsWith(".js")
						? "application/javascript"
						: name.endsWith(".wasm")
							? "application/wasm"
							: "application/octet-stream",
					headers: { "access-control-allow-origin": "*" },
				});
			},
		);
	await page.route("**/__prolog-test", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: "<!doctype html><body></body>",
		}),
	);
	await page.goto(base + "/__prolog-test");
	await page.evaluate(async () => {
		await import("/src/components/prolog/prolog.js");
		const source = await (
			await fetch("/docs/components/prolog/examples/introduction.html")
		).text();
		document.body.innerHTML = source;
	});
	const host = page.locator("tp-prolog");
	assert.equal(
		await host.locator(".tp-prolog-output").textContent(),
		"tp-prolog - enter a query ending with a full stop.\nEngine: SWI-Prolog 10.1.21 · WASM: swipl-wasm 8.3.1\n",
	);
	assert.equal(
		await host.locator(".tp-prolog-title tp-icon").getAttribute("name"),
		"file_type_prolog",
	);
	assert.equal(
		await host.locator(".tp-prolog-title tp-icon").getAttribute("library"),
		"languages",
	);
	assert.equal(
		await host.locator(".tp-prolog-actions > tp-icon-button").count(),
		6,
	);
	assert.equal(await host.locator(".tp-prolog-title").innerText(), "Prolog");
	for (const name of ["tp-color", "tp-theme", "tp-fullscreen"]) {
		assert.equal(
			await host.locator(name).getAttribute("anchor"),
			"#" + (await host.getAttribute("id")),
		);
	}
	assert.deepEqual(
		await host
			.locator(".tp-prolog-toolbar [data-toolbar-end]")
			.evaluate((e) =>
				[...e.children].map((n) =>
					n.hasAttribute("data-prolog-edit")
						? "code"
						: (n.getAttribute("data-action") ?? n.localName),
				),
			),
		[
			"code",
			"apply-source",
			"tp-divider",
			"tp-color",
			"tp-theme",
			"tp-fullscreen",
		],
	);
	const title = await host.locator(".tp-prolog-title").boundingBox();
	const controls = await host.locator("tp-color").boundingBox();
	assert.ok(title.x + title.width <= controls.x);
	const initial = await host.evaluate((e) => ({
		background: getComputedStyle(e.querySelector(".tp-prolog-panel"))
			.backgroundColor,
		body: document.body.className,
	}));
	await host.locator("tp-theme").evaluate((e) => {
		e.mode = "dark";
	});
	await page.waitForFunction(() =>
		document.querySelector("tp-prolog").classList.contains("tp-dark"),
	);
	assert.notEqual(
		await host
			.locator(".tp-prolog-panel")
			.evaluate((e) => getComputedStyle(e).backgroundColor),
		initial.background,
	);
	const divider = host.locator(".tp-prolog-toolbar tp-divider[data-document-navbar-divider]");
	const dividerBefore = await divider.evaluate(e => getComputedStyle(e).borderLeftColor);
	await host.locator("tp-color").evaluate((e) => {
		e.preset = "tp-red";
	});
	assert.notEqual(await divider.evaluate(e => getComputedStyle(e).borderLeftColor), dividerBefore);
	assert.equal(await divider.evaluate(e => getComputedStyle(e).getPropertyValue("--tp-divider-color").trim()), await divider.evaluate(e => getComputedStyle(e).getPropertyValue("--tp-brand-stroke-soft").trim()));
	assert.ok(await host.evaluate((e) => e.classList.contains("tp-red")));
	assert.equal(
		(await page.locator("body").getAttribute("class")) ?? "",
		initial.body,
	);
	await host.locator("tp-theme").evaluate((e) => {
		e.mode = "light";
	});
	await host.locator("tp-fullscreen button").click();
	await page.waitForFunction(
		() => document.fullscreenElement === document.querySelector("tp-prolog"),
	);
	await page.evaluate(() => document.exitFullscreen());
	const input = page.locator("tp-prolog .tp-prolog-prompt input");
	const libraryItem = name => host.locator(`[data-prolog-library="${name}"]`);
	await input.fill("member(X, [a,b]).");
	for (const name of ["clpfd", "random", "plunit", "dom"]) {
		if (!await host.locator(".tp-prolog-libraries tp-dropdown").evaluate(e => e.open)) await host.locator("[data-prolog-libraries-trigger]").click();
		await libraryItem(name).click();
		await page.waitForFunction(name => document.querySelector(`[data-prolog-library="${name}"]`)?.hasAttribute("data-loaded"), name);
		assert.equal(await input.inputValue(), "member(X, [a,b]).");
		assert.equal(await libraryItem(name).locator("tp-icon").evaluate(e => getComputedStyle(e).visibility), "visible");
	}
	await input.click();
	await host.locator('[data-action="reset"]').click();
	assert.equal(await host.locator("[data-prolog-library][data-loaded]").count(), 0);

	const transcript = () => page.locator(".tp-prolog-output").innerText();
	await input.fill("color(X).");
	for (let attempt = 0; attempt < 2; attempt++) {
		await host.locator('[data-action="run"]').click();
		await page.waitForFunction(() => document.querySelector("tp-prolog").getAttribute("aria-busy") === "false");
		assert.equal(await input.inputValue(), "color(X).");
	}
	assert.equal((await transcript()).match(/X = red/g)?.length, 2);
	await host.locator('[data-action="accept"]').click();
	assert.match(await transcript(), /X = red \.\n$/);
	await input.fill("color(green).");
	await host.locator('[data-action="run"]').click();
	await page.waitForFunction(() => document.querySelector("tp-prolog").getAttribute("aria-busy") === "false");
	assert.equal(await input.inputValue(), "color(green).");
	assert.match(await transcript(), /true\./);
	await host.locator(".tp-prolog-prompt [data-tp-textfield-clear] button").click();
	assert.equal(await input.inputValue(), "");
	await host.locator('[data-action="reset"]').click();

	const run = async (query) => {
		console.log("Query", query);
		await input.fill(query);
		await input.press("Enter");
		await page.waitForFunction(
			() =>
				document.querySelector("tp-prolog").getAttribute("aria-busy") ===
				"false",
		);
	};
	assert.equal(
		await host.locator('[data-action="all"]').getAttribute("disabled"),
		null,
	);
	await input.fill("color(X).");
	await host.locator('[data-action="all"]').click();
	await page.waitForFunction(
		() =>
			document.querySelector("tp-prolog").getAttribute("aria-busy") === "false",
	);
	assert.match(
		await transcript(),
		/X = red ;\nX = green ;\nX = blue ;\nfalse\./,
	);
	await host.locator('[data-action="clear"]').click();
	await input.fill("color(X).");
	await host.locator('[data-action="run"]').click();
	await page.waitForFunction(
		() =>
			document.querySelector("tp-prolog").getAttribute("aria-busy") === "false",
	);
	assert.match(await transcript(), /X = red/);
	await host.locator('[data-action="next"]').click();
	await page.waitForFunction(
		() =>
			document.querySelector("tp-prolog").getAttribute("aria-busy") === "false",
	);
	assert.match(await transcript(), /X = green/);
	await run(";");
	assert.match(await transcript(), /X = blue/);
	await run(";");
	assert.match(await transcript(), /false\./);
	await run("color(X).");
	await host.locator('[data-action="all"]').click();
	await page.waitForFunction(
		() =>
			document.querySelector("tp-prolog").getAttribute("aria-busy") === "false",
	);
	assert.match(
		await transcript(),
		/X = red ;\nX = green ;\nX = blue ;\nfalse\./,
	);
	assert.equal(
		await host.locator('[data-action="all"]').getAttribute("disabled"),
		null,
	);
	await run("repeat.");
	await host.locator('[data-action="all"]').click();
	await host.locator('[data-action="accept"]').click();
	await page.waitForFunction(
		() =>
			document.querySelector("tp-prolog").getAttribute("aria-busy") === "false",
	);
	await run("repeat.");
	await host.locator('[data-action="all"]').click();
	await page.keyboard.press("Escape");
	await page.waitForFunction(
		() =>
			document.querySelector("tp-prolog").getAttribute("aria-busy") === "false",
	);
	await run("assertz(likes(ada, prolog)).");
	await run("likes(ada, X).");
	assert.match(await transcript(), /X = prolog/);
	await input.press("ArrowUp");
	assert.equal(await input.inputValue(), "likes(ada, X).");
	await run("use_module(library(clpfd)).");
	assert.equal(await libraryItem("clpfd").getAttribute("data-loaded"), "");
	await run("X in 1..3.");
	assert.match(await transcript(), /clpfd:/);
	await run("X in 1..3, labeling([], [X]).");
	assert.match(await transcript(), /X = 1/);
	await run("use_module(library(wasm)).");
	await run("use_module(library(dom)).");
	await run('Elem := document.createElement(div), append_html(Elem, b("DOM works")), Text := Elem.textContent.');
	assert.match(await transcript(), /DOM works/);

	await run('document.title := "Prolog DOM".');
	assert.equal(await page.title(), "Prolog DOM", await transcript());
	await run("missing_predicate.");
	assert.match(await transcript(), /ERROR:/);
	await run("true.");
	assert.match(await transcript(), /true\./);
	await run("repeat, fail.");
	assert.match(await transcript(), /inference_limit/);
	await run("writeln(hello).");
	assert.match(await transcript(), /hello\n/);
	await page.locator('tp-prolog [data-action="clear"]').click();
	assert.equal(await transcript(), "");
	await run("likes(ada, X).");
	assert.match(await transcript(), /X = prolog/);
	await page.locator('tp-prolog [data-action="reset"]').click();
	await page.waitForFunction(
		() =>
			document.querySelector("tp-prolog").getAttribute("aria-busy") === "false",
	);
	await run("likes(ada, X).");
	assert.match(await transcript(), /ERROR:/);
	await run("color(X).");
	assert.match(await transcript(), /X = red/);
	assert.equal(
		await page.locator("tp-prolog").evaluate((e) => e.shadowRoot),
		null,
	);
	await page.setViewportSize({ width: 380, height: 700 });
	assert.ok(
		await page
			.locator("tp-prolog")
			.evaluate((e) => e.scrollWidth <= e.clientWidth + 1),
	);
	await page.setViewportSize({ width: 1100, height: 800 });
	assert.equal(
		await host.locator("[data-prolog-filename]").textContent(),
		"program.pl",
	);
	await host.evaluate((e) => {
		e.filename = "colors.pl";
	});
	await host.locator("[data-prolog-edit]").click();
	const editor = host.locator("tp-code-editor");
	await editor.locator(".cm-content").waitFor();
	assert.equal(await editor.evaluate((e) => e.filename), "colors.pl");
	assert.match(
		await editor.evaluate((e) => e.getValue()),
		/^color\(red\)\.\ncolor\(green\)/,
	);
	await editor.evaluate((e) => {
		e.value = Array.from({ length: 40 }, (_, i) => `color(c${i}).`).join("\n");
	});
	await page.waitForFunction(
		() =>
			document.querySelector("tp-prolog tp-code-editor").getBoundingClientRect()
				.height > 600,
	);
	const tall = (await editor.boundingBox()).height;
	await editor.locator(".cm-content").fill("color(purple).");
	await page.waitForFunction(
		(tall) =>
			document.querySelector("tp-prolog tp-code-editor").getBoundingClientRect()
				.height <
			tall - 300,
		tall,
	);
	await host.locator('[data-action="apply-source"]').click();
	await page.waitForFunction(
		() =>
			document.querySelector("tp-prolog").getAttribute("aria-busy") === "false",
	);
	await run("color(X).");
	assert.match(await transcript(), /X = purple/);
	assert.doesNotMatch(await transcript(), /X = red/);
	await host.locator("[data-prolog-edit]").click();
	await host.locator("[data-prolog-edit]").click();
	assert.equal(await editor.evaluate((e) => e.getValue()), "color(purple).");
	await editor.evaluate((e) => {
		e.value = "% " + "Long comment ".repeat(50) + "\ncolor(purple).";
	});
	await page.waitForFunction(() =>
		document
			.querySelector("tp-prolog tp-code-editor")
			.getValue()
			.startsWith("% Long"),
	);
	const wideEditorHeight = (await editor.boundingBox()).height;

	await page.setViewportSize({ width: 380, height: 700 });
	assert.ok(
		await host.evaluate((e) => e.scrollWidth <= e.clientWidth + 1),
		JSON.stringify(
			await host.evaluate((e) =>
				[...e.querySelectorAll("*")]
					.filter((n) => n.getBoundingClientRect().right > innerWidth)
					.slice(0, 12)
					.map((n) => [
						n.tagName,
						n.className,
						n.getBoundingClientRect().width,
					]),
			),
		),
	);
	await page.waitForFunction(
		(height) =>
			document.querySelector("tp-prolog tp-code-editor").getBoundingClientRect()
				.height >
			height + 40,
		wideEditorHeight,
	);
	await host.locator('.tp-prolog-actions [data-action="reset"]').click();
	await page.waitForFunction(
		() =>
			document.querySelector("tp-prolog").getAttribute("aria-busy") === "false",
	);
	assert.match(await editor.evaluate((e) => e.getValue()), /color\(red\)/);
	await run("color(X).");
	assert.match(await transcript(), /X = red/);
	// Separate interpreter: program and mutable facts must not leak between instances.
	await page.evaluate(() => {
		const e = document.createElement("tp-prolog");
		e.id = "second";
		e.value =
			":- use_module(library(plunit)).\n:- begin_tests(prompt).\ntest(sum) :- 4 is 2+2.\n:- end_tests(prompt).";
		document.body.append(e);
	});
	await page.evaluate(() =>
		document.querySelector("#second").run("current_predicate(color/1)."),
	);
	assert.match(
		await page.locator("#second .tp-prolog-output").innerText(),
		/false\./,
	);
	await page.evaluate(() =>
		document.querySelector("#second").run("run_tests(prompt)."),
	);
	assert.match(
		await page.locator("#second .tp-prolog-output").innerText(),
		/prompt:sum.*passed/,
	);
	const external = await page.evaluate(async () => {
		const wrapper = document.createElement("div");
		wrapper.setAttribute(
			"data-tp-source",
			location.origin + "/docs/components/prolog/index.md",
		);
		const interpreter = document.createElement("tp-prolog");
		interpreter.src = "examples/colors.pl";
		interpreter.value = "warm(blue).";
		wrapper.append(interpreter);
		document.body.append(wrapper);
		await interpreter.toggleSource();
		await interpreter.run("warm(X).");
		const code = interpreter.querySelector("tp-code-editor");
		return {
			filename: interpreter.filename,
			source: code.getValue(),
			output: interpreter.querySelector(".tp-prolog-output").textContent,
		};
	});
	assert.equal(external.filename, "colors.pl");
	assert.match(external.source, /^color\(red\)\./);
	assert.match(external.output, /X = red/);
	assert.doesNotMatch(external.output, /X = blue/);
	const version = await host
		.first()
		.evaluate(
			async (e) =>
				(
					await e.engine.prolog.forEach(
						"current_prolog_flag(version_data, swi(Major,Minor,Patch,_))",
					)
				)[0],
		);
	assert.equal(`${version.Major}.${version.Minor}.${version.Patch}`, "10.1.21");
	await page.goto(base + "/__prolog-test");
	await page.setViewportSize({ width: 1000, height: 850 });
	await page.evaluate(async () => {
		await import("/src/components/prolog/prolog.js");
		await import("/src/components/button/button.js");
		const html = await (await fetch("/docs/components/prolog/examples/examples.html")).text();
		const doc = new DOMParser().parseFromString(html, "text/html");
		const example = doc.querySelector("template").content.querySelector('[label="DOM elements and click events"]');
		if (!example) throw new Error("Missing DOM documentation example");
		document.body.replaceChildren(document.importNode(example, true));
	});
	const domHost = page.locator("tp-prolog");
	assert.equal(await domHost.locator('[data-prolog-library="dom"]').getAttribute("data-loaded"), null);
	await domHost.locator("[data-prolog-libraries-trigger]").click();
	await domHost.locator('[data-prolog-library="dom"]').click();
	await page.waitForFunction(() => document.querySelector('[data-prolog-library="dom"]')?.hasAttribute("data-loaded"));
	await domHost.locator(".tp-prolog-prompt input").click();
	assert.equal(await domHost.locator(".tp-prolog-prompt input").inputValue(), "setup_dom.");
	await domHost.locator('[data-action="run"]').click();
	await page.locator("#prolog-dom-demo tp-button button").waitFor().catch(async error => { console.error(await domHost.locator(".tp-prolog-output").textContent(), await page.locator("#prolog-dom-demo").innerHTML()); throw error; });
	assert.equal(await page.locator("#prolog-dom-demo p").textContent(), "Waiting for a click.");
	// End the query before checking that its event handler remains usable.
	await domHost.locator('[data-action="accept"]').click();
	await page.locator("#prolog-dom-demo tp-button button").click();
	assert.equal(await page.locator("#prolog-dom-demo p").textContent(), "The click was handled by Prolog!");
	await domHost.evaluate(e => e.run("setup_dom."));
	assert.equal(await page.locator("#prolog-dom-demo tp-button").count(), 1);
	assert.equal(await page.locator("#prolog-dom-demo p").textContent(), "Waiting for a click.");
	await page.locator("#prolog-dom-demo tp-button button").click();
	assert.equal(await page.locator("#prolog-dom-demo p").textContent(), "The click was handled by Prolog!");
	console.log("Documented DOM example: menu loading, HTML creation, click handler and rebuilding passed.");
	console.log(
		"Prolog prompt, next answers, history, persistence, reset, CLP(FD), errors, inference limit, light DOM and isolated sessions passed.",
	);
} finally {
	await browser.close();
}
