import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const root = resolve(import.meta.dirname, "../..");
const examplesRoot = join(root, "public/docs/components");
const components = readdirSync(examplesRoot)
	.filter((component) => {
		try {
			readFileSync(join(examplesRoot, component, "examples/examples.html"));
			return true;
		} catch {
			return false;
		}
	})
	.sort();

for (const component of components) {
	test(`tp-${component}`, async ({ page }, testInfo) => {
		if (component === "prose-editor") testInfo.setTimeout(120_000);
		const markup = readFileSync(
			join(examplesRoot, component, "examples/examples.html"),
			"utf8",
		);
		await page.goto("/accessibility-test.html");
		await page.locator("#fixture").evaluate((fixture, html) => {
			const template = document.createElement("template");
			template.innerHTML = html;
			for (const child of [...template.content.children]) {
				if (child.localName !== "tp-html-viewer") continue;
				// Only unwrap the documentation viewer's source template. Templates
				// inside the actual component remain author content, not test fixtures.
				for (const source of [...child.children]) {
					if (source instanceof HTMLTemplateElement) {
						source.replaceWith(source.content);
					}
				}
				child.replaceWith(...child.childNodes);
			}
			for (const example of template.content.querySelectorAll(
				'[role="example"]',
			)) {
				const label = example.getAttribute("label");
				example.setAttribute("role", "group");
				example.removeAttribute("label");
				if (label !== null) example.setAttribute("aria-label", label);
			}
			fixture.replaceChildren(template.content);
		}, markup);
		// An inert template used to let axe report success without testing anything.
		await expect(
			page.locator(`#fixture tp-${component}`).first(),
		).toBeAttached();
		await page.waitForFunction(async () => {
			const tags = [...document.querySelectorAll("*")]
				.map((element) => element.localName)
				.filter(
					(tagName) =>
						tagName.startsWith("tp-") && !tagName.endsWith("-backdrop"),
				);
			await Promise.all(
				tags.map((tagName) => customElements.whenDefined(tagName)),
			);
			await new Promise<void>((resolve) =>
				requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
			);
			return document.querySelector('tp-diagram[aria-busy="true"]') === null;
		});
		await page.locator("#fixture").evaluate(async (fixture) => {
			for (const previous of [...fixture.querySelectorAll("script")]) {
				if (
					previous.type &&
					!["module", "text/javascript", "application/javascript"].includes(
						previous.type,
					)
				)
					continue;
				const script = document.createElement("script");
				for (const attribute of previous.attributes)
					script.setAttribute(attribute.name, attribute.value);
				script.textContent = previous.textContent;
				const loaded = script.src
					? new Promise<void>((resolve, reject) => {
							script.onload = () => resolve();
							script.onerror = () =>
								reject(new Error(`Cannot load example script: ${script.src}`));
						})
					: Promise.resolve();
				previous.replaceWith(script);
				await loaded;
			}
			const runtime = window as Window & {
				MathJax?: { startup?: { promise?: Promise<unknown> } };
			};
			await runtime.MathJax?.startup?.promise;
			await new Promise<void>((resolve) =>
				requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
			);
		});

		const results = await new AxeBuilder({ page })
			.include("#fixture")
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
			.analyze();
		const payload = {
			browser: testInfo.project.name,
			component: `tp-${component}`,
			incomplete: results.incomplete.length,
			violations: results.violations.map((violation) => ({
				help: violation.help,
				helpUrl: violation.helpUrl,
				id: violation.id,
				impact: violation.impact,
				targets: violation.nodes.flatMap((node) => node.target.map(String)),
				details: violation.nodes.map((node) => ({
					target: node.target.map(String),
					summary: node.failureSummary,
				})),
			})),
		};
		await testInfo.attach("axe-result", {
			body: Buffer.from(JSON.stringify(payload)),
			contentType: "application/json",
		});

		expect(
			payload.violations,
			JSON.stringify(payload.violations, null, 2),
		).toEqual([]);
	});
}
