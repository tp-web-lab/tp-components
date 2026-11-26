import { expect, test } from "@playwright/test";

test("open dropdowns and drawers retain contrast across brand and interaction states", async ({
	page,
}) => {
	test.setTimeout(240_000);
	await page.goto("/accessibility-test.html");
	const presets = await page.evaluate(async () => {
		for (const name of [
			"drawer",
			"dropdown",
			"button",
			"icon-button",
			"tabs",
			"tree",
			"color",
			"theme",
		])
			await import(`/src/components/${name}/${name}.ts`);
		const { TP_COLOR_PRESETS } = await import(
			`${"/src/components/color/color-presets.ts"}`
		);
		const fixture = document.querySelector("#fixture");
		if (!fixture) throw new Error("Missing fixture");
		fixture.innerHTML = `<section id="scope" class="tp-default">
   <tp-drawer id="drawer" label="Color contrast" style="--tp-drawer-size:700px">
    <tp-theme id="theme" anchor="#scope"></tp-theme>
    <p>Drawer content <a href="#example">Example link</a></p>
    <tp-button id="solid" variant="brand">Apply</tp-button>
    <tp-button id="outline" variant="brand" outlined>Cancel</tp-button>
    <tp-button id="link" variant="brand" outlined href="#example">Next page</tp-button>
    <tp-icon-button id="icon" variant="brand" name="heart" label="Favorite"></tp-icon-button>
    <tp-color id="color" anchor="#scope"></tp-color>
    <tp-tabs id="tabs"><dl><dt>First</dt><dd>First panel</dd><dt>Second</dt><dd>Second panel</dd></dl></tp-tabs>
    <div class="tp-markup-multi-pages-sidebar"><tp-tree id="tree"><ul><li><a href="#example" aria-current="page">Current page</a></li></ul></tp-tree></div>
    <tp-button id="trigger">Menu</tp-button>
    <tp-dropdown id="menu" anchor="#trigger"><ul><li id="plain">Plain item</li><li id="linked"><a href="#example">Linked item</a></li><li id="nested">Submenu<ul><li id="child">Nested item</li></ul></li></ul></tp-dropdown>
   </tp-drawer></section>`;
		const navigationStyle = await import(
			`${"/src/components/markup-multi-pages/markup-multi-pages.css?inline"}`
		);
		const navigationSheet = document.createElement("style");
		navigationSheet.textContent = navigationStyle.default;
		document.head.append(navigationSheet);
		const style = document.createElement("style");
		style.textContent =
			"#fixture *,#fixture *::before,#fixture *::after{transition:none!important;animation:none!important} #scope{color:var(--tp-text-body);background:var(--tp-paper-color)}";
		document.head.append(style);
		(
			document.querySelector("#drawer") as HTMLElement & { show(): void }
		).show();
		return TP_COLOR_PRESETS as string[];
	});
	const failures: string[] = [];
	let measurements = 0;
	const measure = async (selector: string, label: string, focus = false) => {
		const result = await page.locator(selector).evaluate((element, focus) => {
			const ctx = document
				.createElement("canvas")
				.getContext("2d", { willReadFrequently: true });
			if (!ctx) throw new Error("Missing canvas context");
			const rgba = (color: string) => {
				ctx.clearRect(0, 0, 1, 1);
				ctx.fillStyle = color;
				ctx.fillRect(0, 0, 1, 1);
				return [...ctx.getImageData(0, 0, 1, 1).data];
			};
			const mix = (fg: number[], bg: number[]) =>
				fg
					.slice(0, 3)
					.map(
						(v, i) =>
							v * ((fg[3] ?? 255) / 255) +
							(bg[i] ?? 0) * (1 - (fg[3] ?? 255) / 255),
					)
					.concat(255);
			const background = (e: Element | null): number[] => {
				if (!e) return [255, 255, 255, 255];
				const c = rgba(getComputedStyle(e).backgroundColor);
				return c[3] === 255 ? c : mix(c, background(e.parentElement));
			};
			const luminance = (c: number[]) =>
				c
					.slice(0, 3)
					.map((v) => {
						const x = v / 255;
						return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
					})
					.reduce(
						(sum, v, i) => sum + v * ([0.2126, 0.7152, 0.0722][i] ?? 0),
						0,
					);
			const contrast = (a: number[], b: number[]) => {
				const x = luminance(a),
					y = luminance(b);
				return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
			};
			const style = getComputedStyle(element),
				bg = background(element);
			const icon = element.parentElement?.localName === "tp-icon-button";
			// Icon buttons use currentColor; an adjacent textual label is not assumed.
			const label =
				element.querySelector("[data-tp-button-content]") ?? element;
			const fg = mix(rgba(getComputedStyle(label).color), bg);
			const errors: string[] = [];
			const brightness = Number(
				style.filter.match(/brightness\(([.\d]+)\)/)?.[1] ?? 1,
			);
			const filtered = (color: number[]) =>
				color.map((value, index) =>
					index < 3 ? Math.min(255, value * brightness) : value,
				);
			const ratio = contrast(filtered(fg), filtered(bg)),
				min = icon ? 3 : 4.5;
			if (ratio < min && element.getAttribute("role") !== "separator")
				errors.push(`foreground ${ratio.toFixed(3)} < ${min}`);
			if (focus) {
				if (!element.matches(":focus-visible"))
					errors.push("keyboard focus is not visible");
				const ring =
					style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0
						? style.outlineColor
						: style.boxShadow.match(
								/(?:rgba?\([^)]*\)|color\([^)]*\)|oklab\([^)]*\))(?=[^,]*$)/,
							)?.[0];
				if (!ring) errors.push("no focus indicator");
				else {
					const r = contrast(
						rgba(ring),
						parseFloat(style.outlineOffset) < 0
							? bg
							: background(element.parentElement),
					);
					if (r < 3) errors.push(`focus indicator ${r.toFixed(3)} < 3`);
				}
			}
			return errors;
		}, focus);
		measurements++;
		failures.push(...result.map((error) => `${label}: ${error}`));
	};
	for (const preset of presets)
		for (const mode of ["light", "dark"]) {
			await page.evaluate(
				({ preset, mode }) => {
					(
						document.querySelector("#color") as HTMLElement & { preset: string }
					).preset = preset;
					(
						document.querySelector("#theme") as HTMLElement & { mode: string }
					).mode = mode;
				},
				{ preset, mode },
			);
			const prefix = `${preset}/${mode}`;
			for (const selector of [
				"#solid > button",
				"#outline > button",
				"#link > a",
				"#tree a",
				"#icon > button",
				"#color > tp-icon-button > button",
				"#theme > tp-icon-button > button",

				'#tabs [role="tab"]:nth-child(2)',
			]) {
				await page.mouse.move(0, 0);
				await measure(selector, `${prefix}/${selector}/normal`);
				await page.locator(selector).hover();
				await measure(selector, `${prefix}/${selector}/hover`);
				await page.mouse.move(0, 0);
				await page.keyboard.press("Tab");
				await page.locator(selector).focus();
				await measure(selector, `${prefix}/${selector}/focus`, true);
			}
			await page.locator('#tabs [role="tab"]').nth(1).click();
			await expect(page.locator('#tabs [role="tab"]').nth(1)).toHaveAttribute(
				"aria-selected",
				"true",
			);
			await measure(
				'#tabs [role="tab"]:nth-child(2)',
				`${prefix}/selected tab`,
			);
			await page.locator('#tabs [role="tab"]').nth(1).hover();
			await measure(
				'#tabs [role="tab"]:nth-child(2)',
				`${prefix}/selected tab hover`,
			);
			await page.mouse.move(0, 0);
			await page.keyboard.press("Tab");
			await page.locator('#tabs [role="tab"]').nth(1).focus();
			await measure(
				'#tabs [role="tab"]:nth-child(2)',
				`${prefix}/selected tab focus`,
				true,
			);
			await page
				.locator("#menu")
				.evaluate((e) => (e as HTMLElement & { show(): void }).show());
			for (const selector of ["#plain", "#linked > a"]) {
				await page.locator(selector).hover();
				await measure(selector, `${prefix}/${selector}/hover`);
			}
			await page.mouse.move(0, 0);
			await page.keyboard.press("Tab");
			await page.locator("#plain").focus();
			await measure("#plain", `${prefix}/menu focus`, true);
			await page.locator("#nested").hover();
			await page.locator("#nested").focus();
			await page.keyboard.press("ArrowRight");
			await expect(page.locator("#child")).toBeVisible();
			await measure("#child", `${prefix}/submenu`);
			await page
				.locator("#menu")
				.evaluate((e) => (e as HTMLElement & { hide(): void }).hide());
			await page.mouse.move(0, 0);
			await page.keyboard.press("Tab");
			await page.locator("#drawer > [data-tp-drawer-resize]").focus();
			await measure(
				"#drawer > [data-tp-drawer-resize]",
				`${prefix}/drawer resize focus`,
				true,
			);
			for (const control of ["color", "theme"]) {
				await page.locator(`#${control} > tp-icon-button > button`).click();
				const selected = `#${control} [data-selected]`;
				await expect(page.locator(selected)).toBeVisible();
				await measure(selected, `${prefix}/${control}/selected`);
				await page.locator(selected).hover();
				await measure(selected, `${prefix}/${control}/selected hover`);
				await page.mouse.move(0, 0);
				await page.keyboard.press("Tab");
				await page.locator(selected).focus();
				await measure(selected, `${prefix}/${control}/selected focus`, true);
				await page
					.locator(`#${control} > tp-dropdown`)
					.evaluate((e) => (e as HTMLElement & { hide(): void }).hide());
			}
			await page.locator('#tabs [role="tab"]').first().click();
		}
	await test.info().attach("interaction-colors", {
		body: JSON.stringify(
			{ presets: presets.length, measurements, failures },
			null,
			2,
		),
		contentType: "application/json",
	});
	expect(failures, failures.join("\n")).toEqual([]);
});
