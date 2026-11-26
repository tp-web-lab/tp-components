/** Audit real introductory examples and opened dropdowns/drawers. Requires Vite. */
import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { chromium, firefox, webkit } from "@playwright/test";
const root = new URL("../", import.meta.url);
const base = process.env.TP_EXAMPLES_URL ?? "http://127.0.0.1:4173";
const names = readdirSync(new URL("public/docs/components/", root)).filter(
	(name) =>
		existsSync(
			new URL(
				`public/docs/components/${name}/examples/introduction.html`,
				root,
			),
		),
);
const report = [];
if (process.env.TP_COMPONENTS)
	names.splice(0, names.length, ...process.env.TP_COMPONENTS.split(","));
for (const [engineName, engine] of Object.entries({
	chromium,
	firefox,
	webkit,
}).filter(([n]) => !process.env.TP_BROWSER || n === process.env.TP_BROWSER)) {
	const browser = await engine.launch();
	const context = await browser.newContext({
		viewport: { width: 1280, height: 900 },
	});
	await context.route("**/__icon_geometry", (r) =>
		r.fulfill({
			contentType: "text/html",
			body: "<!doctype html><html><body></body></html>",
		}),
	);
	let cursor = 0;
	const rows = [];
	await Promise.all(
		Array.from({ length: 3 }, async () => {
			const page = await context.newPage();
			while (cursor < names.length) {
				const name = names[cursor++];
				try {
					await page.goto(`${base}/__icon_geometry`);
					await page.evaluate(
						async ({ name, html }) => {
							await import("/src/tp-loader.ts");
							await import(`/src/components/${name}/${name}.ts`);
							document.body.innerHTML = html;
							if (name === "icon-button") {
								for (const component of ["toolbar", "drawer", "dropdown"])
									await import(`/src/components/${component}/${component}.ts`);
								const presets = ["xxs", "xs", "s", "m", "l", "xl", "xxl"]
									.flatMap((size) =>
										[
											"",
											'href="#target"',
											"disabled",
											'aria-pressed="true"',
											"loading",
											'loading loading-mode="inline"',
										].map(
											(state) =>
												`<tp-icon-button name="plus" size="${size}" ${state}></tp-icon-button>`,
										),
									)
									.join("");
								const samples = document.createElement("div");
								samples.innerHTML = `${presets}<tp-toolbar><tp-button data-document-logo><tp-icon name="logo-tp"></tp-icon></tp-button></tp-toolbar><tp-dropdown>${presets}</tp-dropdown><tp-drawer label="Geometry">${presets}</tp-drawer>`;
								document.body.append(samples);
							}
						},
						{
							name,
							html: readFileSync(
								new URL(
									`public/docs/components/${name}/examples/introduction.html`,
									root,
								),
								"utf8",
							),
						},
					);
					// Allow deferred children, icon fetches and initial layout to complete.
					await page.waitForTimeout(1000);
					const samples = [];
					for (const mode of ["light", "dark"]) {
						await page.evaluate((mode) => {
							document.documentElement.classList.remove("tp-light", "tp-dark");
							document.documentElement.classList.add(`tp-${mode}`);
						}, mode);
						for (const opened of [false, true]) {
							if (opened) {
								await page.evaluate(() => {
									for (const e of document.querySelectorAll(
										"tp-dropdown,tp-drawer",
									))
										e.setAttribute("open", "");
								});
								await page.waitForTimeout(350);
							}
							samples.push(
								...(await page.evaluate(
									({ mode, opened }) =>
										[...document.querySelectorAll("tp-icon-button")].flatMap(
											(host) => {
												const b = host.querySelector(
														":scope > button,:scope > a",
													),
													icon = b?.querySelector(":scope > tp-icon");
												if (!b || !icon) return [];
												const r = b.getBoundingClientRect(),
													i = icon.getBoundingClientRect();
												if (
													!r.width ||
													!r.height ||
													!i.width ||
													!i.height ||
													getComputedStyle(b).visibility === "hidden"
												)
													return [];
												const svg = icon.querySelector("svg"),
													s = svg?.getBoundingClientRect();
												const dx = Math.abs(
														r.x + r.width / 2 - i.x - i.width / 2,
													),
													dy = Math.abs(
														r.y + r.height / 2 - i.y - i.height / 2,
													);
												const square = Math.abs(r.width - r.height);
												const inlineLoading =
													host.hasAttribute("loading") &&
													host.getAttribute("loading-mode") === "inline";
												const error =
													!inlineLoading &&
													(dx > 0.6 ||
														dy > 0.6 ||
														square > 0.6 ||
														(s &&
															(Math.abs(r.x + r.width / 2 - s.x - s.width / 2) >
																0.6 ||
																Math.abs(
																	r.y + r.height / 2 - s.y - s.height / 2,
																) > 0.6)));
												return [
													{
														mode,
														opened,
														name: host.getAttribute("name"),
														size: host.getAttribute("size"),
														loading: host.getAttribute("loading-mode"),
														disabled: host.hasAttribute("disabled"),
														context: host.parentElement.tagName,
														logo: host.hasAttribute("data-document-logo"),
														width: r.width,
														height: r.height,
														dx,
														dy,
														svg: !!svg,
														svgDx: s
															? Math.abs(r.x + r.width / 2 - s.x - s.width / 2)
															: null,
														svgDy: s
															? Math.abs(
																	r.y + r.height / 2 - s.y - s.height / 2,
																)
															: null,
														error: !!error,
													},
												];
											},
										),
									{ mode, opened },
								)),
							);
						}
					}
					rows.push({ name, samples });
				} catch (e) {
					rows.push({ name, error: String(e) });
				}
				if (rows.length % 25 === 0)
					console.log(`${engineName}: ${rows.length}/${names.length}`);
			}
			await page.close();
		}),
	);
	const failures = rows.flatMap((r) =>
		r.error
			? [{ name: r.name, error: r.error }]
			: r.samples
					.filter((s) => s.error)
					.map((s) => ({ component: r.name, ...s })),
	);
	console.log(
		`${engineName}: ${rows.length} components, ${rows.reduce((n, r) => n + (r.samples?.length ?? 0), 0)} button measurements, ${failures.length} failures`,
	);
	report.push({ engine: engineName, rows, failures });
	writeFileSync(
		"/tmp/tp-icon-button-geometry.json",
		JSON.stringify(report, null, 2),
	);
	await browser.close();
}
if (report.some((r) => r.failures.length)) process.exitCode = 1;
