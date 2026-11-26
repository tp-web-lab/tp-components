/** Browser inventory of visible text contrast in introductory component examples.
 * Covers all brand presets and light → dark → light via the real theme controller.
 * Hidden UI, canvas/image text, gradients and inaccessible frames require separate review.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { namedExamples, viewerSource } from "./component-basic-examples.mjs";
import { documentedComponents } from "./standardize-component-examples.mjs";

const selected = process.env.TP_COMPONENTS?.split(",");
const names = selected || documentedComponents().sort();
const interactions = process.env.TP_AUDIT_INTERACTIONS === "1";
const browser = await chromium.launch();
const results = [];
try {
	const page = await browser.newPage({
		viewport: { width: 1280, height: 1000 },
	});
	page.on("dialog", (dialog) => dialog.dismiss());

	for (const name of names) {
		const html = namedExamples(
			"html",
			viewerSource(
				"html",
				readFileSync(
					`public/docs/components/${name}/examples/examples.html`,
					"utf8",
				),
			),
		).find((e) => e.label === "Basic usage")?.source;
		try {
			await page.goto(
				(process.env.TP_AUDIT_URL || "http://127.0.0.1:4173") +
					"/accessibility-test.html",
			);
			await page.evaluate(async () => {
				await import("/src/components/theme/theme.ts");
			});
			const ready = await page.evaluate(
				async ({ name, html }) => {
					const fixture = document.querySelector("#fixture");
					fixture.replaceChildren();
					await import(`/src/components/${name}/${name}.ts`);
					const host = document.createElement("section");
					host.id = "audit-scope";
					host.className = "tp-default";
					host.style.cssText =
						"color:var(--tp-text-body);background:var(--tp-paper-color);padding:16px";
					const template = document.createElement("template");
					template.innerHTML = html;
					host.append(template.content);
					fixture.append(host);
					const theme = document.createElement("tp-theme");
					theme.id = "audit-theme-control";
					theme.anchor = "#audit-scope";
					theme.mode = "light";
					fixture.append(theme);
					const style = document.createElement("style");
					style.textContent =
						"#audit-scope *, #audit-scope *::before, #audit-scope *::after { transition:none!important;animation:none!important; }";
					fixture.append(style);
					// The introductory examples are authored project fixtures, including their initialization scripts.
					for (const old of [...host.querySelectorAll("script")]) {
						if (
							old.type &&
							!["module", "text/javascript", "application/javascript"].includes(
								old.type,
							)
						)
							continue;
						const script = document.createElement("script");
						for (const attr of old.attributes)
							script.setAttribute(attr.name, attr.value);
						script.textContent = old.textContent;
						old.replaceWith(script);
					}
					const pending = [...host.querySelectorAll("*")]
						.filter(
							(e) =>
								e.localName.startsWith("tp-") &&
								!e.localName.endsWith("-backdrop"),
						)
						.map((e) => customElements.whenDefined(e.localName));
					const loaded = await Promise.race([
						Promise.all(pending).then(() => true),
						new Promise((r) => setTimeout(() => r(false), 5000)),
					]);
					await new Promise((r) => setTimeout(r, 1500));
					return { loaded, present: !!host.querySelector(`tp-${name}`) };
				},
				{ name, html },
			);
			let cdp,
				nodes = [];
			if (interactions) {
				await page.evaluate(async () => {
					const host = document.querySelector("#audit-scope");
					for (const help of host.querySelectorAll(
						'[data-game-command="help"]',
					))
						help.click();
					for (const rules of host.querySelectorAll('[data-game-help="rules"]'))
						rules.click();
					if (
						host.querySelector("[data-tp-game-scope]") &&
						!host.querySelector("tp-drawer.tp-game-rules")
					)
						throw new Error("Game rules drawer was not created");
					for (const overlay of host.querySelectorAll("tp-dropdown,tp-drawer"))
						overlay.show();
					for (const branch of host.querySelectorAll('[aria-haspopup="menu"]'))
						branch.setAttribute("aria-expanded", "true");
					await new Promise((resolve) => setTimeout(resolve, 300));
				});
				cdp = await page.context().newCDPSession(page);
				await cdp.send("DOM.enable");
				await cdp.send("CSS.enable");
				const { root } = await cdp.send("DOM.getDocument");
				({ nodeIds: nodes } = await cdp.send("DOM.querySelectorAll", {
					nodeId: root.nodeId,
					selector:
						'#audit-scope :is(button,a,input,textarea,select,[tabindex],[role="menuitem"],[role="tab"],[data-tp-tree-row],summary)',
				}));
			}
			for (const interaction of interactions
				? ["open", "hover", "focus"]
				: ["default"]) {
				if (cdp) {
					const forcedPseudoClasses =
						interaction === "hover"
							? ["hover"]
							: interaction === "focus"
								? ["focus", "focus-visible", "focus-within"]
								: [];
					for (let offset = 0; offset < nodes.length; offset += 100)
						await Promise.all(
							nodes.slice(offset, offset + 100).map((nodeId) =>
								cdp
									.send("CSS.forcePseudoState", {
										nodeId,
										forcedPseudoClasses,
									})
									.catch(() => {}),
							),
						);
				}
				const audit = await page.evaluate(
					async ({ interactions }) => {
						const { TP_COLOR_PRESETS: presets } = await import(
							"/src/components/color/color-presets.ts"
						);
						const host = document.querySelector("#audit-scope"),
							theme = document.querySelector("#audit-theme-control");
						const canvas = document.createElement("canvas"),
							ctx = canvas.getContext("2d", { willReadFrequently: true });
						const cache = new Map();
						const rgba = (c) => {
							if (!cache.has(c)) {
								ctx.clearRect(0, 0, 1, 1);
								ctx.fillStyle = c;
								ctx.fillRect(0, 0, 1, 1);
								cache.set(c, [...ctx.getImageData(0, 0, 1, 1).data]);
							}
							return cache.get(c);
						};
						const lum = (c) => {
							const a = c.slice(0, 3).map((x) => {
								x /= 255;
								return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
							});
							return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
						};
						const blend = (fg, bg) =>
							fg
								.slice(0, 3)
								.map((v, i) => (v * fg[3]) / 255 + bg[i] * (1 - fg[3] / 255))
								.concat(255);
						const frameOwners = new Map();
						const roots = [host];
						let inaccessibleFrames = 0;
						for (const frame of host.querySelectorAll("iframe")) {
							try {
								if (frame.contentDocument?.body) {
									roots.push(frame.contentDocument.body);
									frameOwners.set(frame.contentDocument, frame);
								} else inaccessibleFrames++;
							} catch {
								inaccessibleFrames++;
							}
						}
						const elements = roots
							.flatMap((root) => [...root.querySelectorAll("*")])
							.filter((e) => {
								if (
									e.closest(
										'script,style,svg,template,[hidden],[disabled],[aria-disabled="true"]',
									)
								)
									return false;
								const text = [...e.childNodes]
									.filter((n) => n.nodeType === 3)
									.map((n) => n.textContent)
									.join("")
									.trim();
								if (
									!/[\p{L}\p{N}]/u.test(text) &&
									!e.matches(
										interactions
											? "input,textarea,tp-icon-button > button,tp-icon-button > a"
											: "input,textarea",
									)
								)
									return false;
								const r = e.getBoundingClientRect();
								return (
									r.width > 0 &&
									r.height > 0 &&
									getComputedStyle(e).visibility === "visible"
								);
							});
						const issues = new Map();
						let checks = 0,
							gradients = 0;
						const transitions = [];
						for (const brand of presets) {
							for (const p of presets) host.classList.remove(p);
							host.classList.add(brand);
							let first;
							for (const [step, mode] of ["light", "dark", "light"].entries()) {
								theme.mode = mode;
								for (const control of host.querySelectorAll("tp-theme"))
									control.mode = mode;
								for (const control of host.querySelectorAll("tp-color"))
									control.preset = brand;
								await new Promise((resolve) => requestAnimationFrame(resolve));
								const styles = new Map(),
									backgrounds = new Map();
								const style = (e) => {
									if (!styles.has(e)) styles.set(e, getComputedStyle(e));
									return styles.get(e);
								};
								const bg = (e) => {
									if (!e) return [255, 255, 255, 255];
									if (backgrounds.has(e)) return backgrounds.get(e);
									const s = style(e);
									if (s.backgroundImage !== "none") {
										gradients++;
										return null;
									}
									const c = rgba(s.backgroundColor);
									const b =
										c[3] === 255
											? c
											: bg(e.parentElement || frameOwners.get(e.ownerDocument));
									const out = b ? blend(c, b) : null;
									backgrounds.set(e, out);
									return out;
								};
								const signature = new Map();
								for (const e of elements) {
									if (!e.isConnected) continue;
									const s = style(e);
									if (
										s.display === "none" ||
										s.visibility !== "visible" ||
										Number(s.opacity) < 1
									)
										continue;
									const background = bg(e);
									if (!background) continue;
									const foreground = blend(rgba(s.color), background);
									const a = lum(foreground),
										b = lum(background),
										ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
									const min =
										e.matches("tp-icon-button > button,tp-icon-button > a") ||
										parseFloat(s.fontSize) >= 24 ||
										(parseFloat(s.fontSize) >= 18.66 &&
											Number(s.fontWeight) >= 700)
											? 3
											: 4.5;
									checks++;
									signature.set(e, `${s.color}|${background.join(",")}`);
									if (ratio + 0.01 < min) {
										const selector =
											e.localName +
											(typeof e.className === "string" && e.className
												? `.${e.className.trim().replaceAll(/\s+/g, ".")}`
												: "");
										const text = (
											[...e.childNodes]
												.filter((n) => n.nodeType === 3)
												.map((n) => n.textContent)
												.join("")
												.trim() ||
											e.getAttribute("aria-label") ||
											e.getAttribute("placeholder") ||
											e.value ||
											""
										).slice(0, 90);
										const key = `${selector}|${text}|${mode}`;
										const existing = issues.get(key);
										if (existing) {
											existing.brands.add(brand);
											existing.minimumRatio = Math.min(
												existing.minimumRatio,
												ratio,
											);
										} else
											issues.set(key, {
												selector,
												text,
												mode,
												brands: new Set([brand]),
												minimumRatio: ratio,
												required: min,
												foreground: s.color,
												background,
												inline: e.getAttribute("style"),
												parent: e.parentElement?.outerHTML.slice(0, 600),
											});
									}
								}
								if (step === 0) first = signature;
								if (
									step === 2 &&
									[...signature].some(
										([element, color]) =>
											first.has(element) && first.get(element) !== color,
									)
								)
									transitions.push(brand);
							}
						}
						return {
							elements: elements.length,
							openedDropdowns:
								host.querySelectorAll("tp-dropdown[open]").length,
							openedDrawers: host.querySelectorAll("tp-drawer[open]").length,
							selected: host.querySelectorAll(
								"[aria-selected=true],[aria-checked=true],[aria-current=true],[data-selected],input:checked",
							).length,
							checks,
							gradients,
							inaccessibleFrames,
							frames: host.querySelectorAll("iframe").length,
							canvases: host.querySelectorAll("canvas").length,
							transitions,
							issues: [...issues.values()].map((i) => ({
								...i,
								brands: [...i.brands],
							})),
						};
					},
					{ interactions },
				);
				results.push({ component: name, interaction, ...ready, ...audit });
				console.log(
					`${name}/${interaction}: ${audit.checks} checks, ${audit.issues.length} issues, ${audit.transitions.length} transition differences`,
				);
			}
			await cdp?.detach();
		} catch (error) {
			results.push({ component: name, error: String(error) });
			console.log(`${name}: ERROR ${String(error).slice(0, 120)}`);
		}
		writeFileSync(
			process.env.TP_AUDIT_OUTPUT || "/tmp/component-theme-colors.json",
			JSON.stringify(
				{ generatedAt: new Date().toISOString(), results },
				null,
				2,
			),
		);
	}
} finally {
	await browser.close();
}

// A measured failure or incomplete example must fail an automated invocation.
if (
	results.some(
		(result) =>
			result.error ||
			!result.loaded ||
			!result.present ||
			result.issues?.length ||
			result.transitions?.length,
	)
)
	process.exitCode = 1;
