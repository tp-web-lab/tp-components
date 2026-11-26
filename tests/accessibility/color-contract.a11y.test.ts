import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

interface ColorPair {
	name: string;
	foreground: string;
	background: string;
	minimum: number;
}

const contract = JSON.parse(
	readFileSync(
		resolve(
			import.meta.dirname,
			"../../config/accessibility-color-contract.json",
		),
		"utf8",
	),
) as { themes: string[]; pairs: ColorPair[] };

test("semantic color-token contrast contract", async ({ page }) => {
	await page.goto("/accessibility-test.html");
	await page.locator("#fixture").evaluate(async (fixture) => {
		fixture.append(document.createElement("tp-base"));
		await customElements.whenDefined("tp-base");
	});
	await page.locator("#fixture").evaluate((fixture, { themes, pairs }) => {
		for (const theme of themes) {
			const themeFixture = document.createElement("section");
			themeFixture.className = theme;
			themeFixture.style.background = "var(--tp-background-color)";
			pairs.forEach((pair, index) => {
				const sample = document.createElement("span");
				sample.id = `${theme}-${index}`;
				sample.style.display = "block";
				sample.style.fontSize = pair.minimum >= 4.5 ? "16px" : "24px";
				sample.style.color = `var(${pair.foreground})`;
				sample.style.backgroundColor = `var(${pair.background})`;
				sample.textContent = pair.name;
				themeFixture.append(sample);
			});
			fixture.append(themeFixture);
		}
	}, contract);

	const results = await new AxeBuilder({ page })
		.include("#fixture")
		.withRules(["color-contrast"])
		.analyze();
	const failures = results.violations.flatMap((violation) =>
		violation.nodes.map(
			(node) =>
				`${node.target.join(" ")}: ${node.failureSummary ?? violation.help}`,
		),
	);

	expect(failures, failures.join("\n")).toEqual([]);
});

test("all brand palettes follow local theme transitions with readable semantic colors", async ({
	page,
}) => {
	await page.goto("/accessibility-test.html");
	const failures = await page.evaluate(async ({ pairs }) => {
		await import(`${"/src/components/theme/theme.ts"}`);
		const { TP_COLOR_PRESETS: presets } = (await import(
			`${"/src/components/color/color-presets.ts"}`
		)) as { TP_COLOR_PRESETS: string[] };
		const fixture = document.querySelector("#fixture");
		if (!fixture) throw new Error("Missing fixture");
		const outer = document.createElement("div");
		const host = document.createElement("div");
		const sample = document.createElement("span");
		sample.textContent = "Palette contrast";
		outer.append(host);
		host.append(sample);
		fixture.append(outer);
		const controller = document.createElement("tp-theme") as HTMLElement & {
			anchor: string;
			mode: string;
		};
		controller.anchor = "#color-contract-scope";
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d", { willReadFrequently: true });
		if (!context) throw new Error("Missing canvas context");
		const luminance = (color: string): number => {
			context.fillStyle = color;
			context.fillRect(0, 0, 1, 1);
			const rgb = [...context.getImageData(0, 0, 1, 1).data]
				.slice(0, 3)
				.map((value) => {
					const channel = value / 255;
					return channel <= 0.04045
						? channel / 12.92
						: ((channel + 0.055) / 1.055) ** 2.4;
				});
			return (
				(rgb[0] ?? 0) * 0.2126 + (rgb[1] ?? 0) * 0.7152 + (rgb[2] ?? 0) * 0.0722
			);
		};
		const failures: string[] = [];
		for (const topology of ["same", "ancestor", "nested", "theme-child"])
			for (const brand of presets) {
				controller.remove();
				outer.removeAttribute("id");
				host.removeAttribute("id");
				outer.className =
					topology === "theme-child"
						? brand
						: topology === "nested"
							? "tp-dark"
							: "";
				host.className = topology === "theme-child" ? "" : brand;
				(topology === "ancestor" ? outer : host).id = "color-contract-scope";
				controller.mode = "light";
				fixture.append(controller);
				let initial: string[] = [];
				for (const [step, mode] of ["light", "dark", "light"].entries()) {
					controller.mode = mode;
					const colors: string[] = [];
					for (const pair of pairs) {
						sample.style.color = `var(${pair.foreground})`;
						sample.style.backgroundColor = `var(${pair.background})`;
						const style = getComputedStyle(sample);
						const fg = luminance(style.color),
							bg = luminance(style.backgroundColor);
						const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
						colors.push(`${style.color}/${style.backgroundColor}`);
						if (ratio < pair.minimum)
							failures.push(
								`${topology}/${brand}/${mode}/${pair.name}: ${ratio.toFixed(2)} < ${pair.minimum}`,
							);
					}
					if (step === 0) initial = colors;
					if (step === 2 && JSON.stringify(colors) !== JSON.stringify(initial))
						failures.push(`${topology}/${brand}: light colors not restored`);
				}
			}
		return failures;
	}, contract);
	expect(failures, failures.join("\n")).toEqual([]);
});

test("built-in logos retain readable letters and graphics in the library and toolbar", async ({
	page,
}) => {
	await page.goto("/accessibility-test.html");
	const failures = await page.evaluate(async () => {
		await import(`${"/src/components/icon/icon.ts"}`);
		await import(`${"/src/components/toolbar/toolbar.ts"}`);
		const { updateDocumentLogo } = await import(
			`${"/src/components/toolbar/document-logo.ts"}`
		);
		const { TP_COLOR_PRESETS: presets } = await import(
			`${"/src/components/color/color-presets.ts"}`
		);
		const fixture = document.querySelector("#fixture");
		if (!fixture) throw new Error("Missing fixture");
		const { tpInternalIcons } = await import(
			`${"/src/components/icon/icon-internal.ts"}`
		);
		const names = Object.keys(tpInternalIcons).filter((name) =>
			name.startsWith("logo-"),
		);
		if (!names.length) throw new Error("Missing logo library");
		fixture.innerHTML = '<section id="logo-scope"></section>';
		const scope = fixture.querySelector("section");
		if (!scope) throw new Error("Missing scope");
		scope.style.color = "var(--tp-brand-text-colorful)";
		for (const name of names) {
			const icon = document.createElement("tp-icon");
			icon.setAttribute("name", name);
			icon.setAttribute("size", "2em");
			scope.append(icon);
			const toolbar = document.createElement("tp-toolbar");
			scope.append(toolbar);
			updateDocumentLogo(toolbar, name);
		}
		await new Promise((resolve) => requestAnimationFrame(resolve));
		const icons = [...scope.querySelectorAll('tp-icon[name^="logo-"]')];
		if (icons.length !== names.length * 2)
			throw new Error("Missing standalone or toolbar logo");
		const ctx = document
			.createElement("canvas")
			.getContext("2d", { willReadFrequently: true });
		if (!ctx) throw new Error("Missing canvas context");
		const luminance = (color: string) => {
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, 1, 1);
			const values = [...ctx.getImageData(0, 0, 1, 1).data]
				.slice(0, 3)
				.map((value) => {
					const c = value / 255;
					return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
				});
			return (
				(values[0] ?? 0) * 0.2126 +
				(values[1] ?? 0) * 0.7152 +
				(values[2] ?? 0) * 0.0722
			);
		};
		const ratio = (a: string, b: string) => {
			const x = luminance(a),
				y = luminance(b);
			return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
		};
		const failures: string[] = [];
		for (const brand of presets)
			for (const theme of ["light", "dark"]) {
				scope.className = `${brand} tp-${theme}`;
				scope.style.backgroundColor = "var(--tp-paper-color)";
				// Toolbar controls inherit the native 100 ms color transition.
				await new Promise((resolve) => setTimeout(resolve, 150));
				for (const [index, icon] of icons.entries()) {
					const name = icon.getAttribute("name");
					const paper = getComputedStyle(scope).backgroundColor;
					const text = icon.querySelector("svg text"),
						circle = icon.querySelector("svg circle");
					if (text) {
						if (!circle)
							throw new Error(`Missing letter background for ${name}`);
						const contrast = ratio(
							getComputedStyle(text).fill,
							getComputedStyle(circle).fill,
						);
						if (contrast < 4.5)
							failures.push(
								`${brand}/${theme}/${name}/${index}: letters ${contrast.toFixed(3)} < 4.5`,
							);
					}
					const shapes = [
						...icon.querySelectorAll("svg path,svg circle,svg rect"),
					].filter(
						(shape) =>
							!shape.closest("defs") && getComputedStyle(shape).fill !== "none",
					);
					if (!shapes.length) throw new Error(`Missing graphic for ${name}`);
					for (const [part, shape] of shapes.entries()) {
						const style = getComputedStyle(shape);
						// Composite translucent strokes/figures onto paper before measuring.
						ctx.clearRect(0, 0, 1, 1);
						ctx.fillStyle = paper;
						ctx.fillRect(0, 0, 1, 1);
						ctx.globalAlpha = Number(style.opacity) * Number(style.fillOpacity);
						ctx.fillStyle = style.fill;
						ctx.fillRect(0, 0, 1, 1);
						ctx.globalAlpha = 1;
						const pixels = ctx.getImageData(0, 0, 1, 1).data;
						const rendered = `rgb(${pixels[0]} ${pixels[1]} ${pixels[2]})`;
						const contrast = ratio(rendered, paper);
						if (contrast < 3)
							failures.push(
								`${brand}/${theme}/${name}/${index}/${part}: graphic ${contrast.toFixed(3)} < 3`,
							);
					}
				}
			}
		return failures;
	});
	expect(failures, failures.join("\n")).toEqual([]);
});
