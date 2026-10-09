import { required } from "../../test-helpers/required.js";
/**
 * @module base/test
 * @summary Tests du composant `<tp-base>`.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import baseStyle from "./base.css?inline";
import { ensureTpBaseStyles, TpBase } from "./base.js";
import resetStyle from "./tp-reset.css?inline";
import tokenStyle from "./tp-tokens.css?inline";
import "../icon-button/icon-button.js";
import "../menu/menu.js";
import "../tabs/tabs.js";
import "../toolbar/toolbar.js";

/**
 * Attend la fin des micro-tâches en cours.
 *
 * @summary Attend la stabilisation asynchrone du DOM.
 * @returns Promesse résolue au prochain tour de micro-tâche.
 */
async function flush(): Promise<void> {
	await Promise.resolve();
}

async function settle(): Promise<void> {
	await flush();
	await new Promise<void>((resolve) => {
		setTimeout(resolve, 0);
	});
	await flush();
}

async function waitForElement<T extends Element>(selector: string): Promise<T> {
	for (let attempt = 0; attempt < 10; attempt += 1) {
		const element = document.querySelector<T>(selector);
		if (element !== null) {
			return element;
		}

		await settle();
	}

	throw new Error(`Element not found: ${selector}`);
}

/**
 * Fixture de test exposant publiquement les helpers protégés de `TpBase`.
 *
 * @summary Élément de test pour vérifier le comportement de la classe de base.
 * @internal
 */
class TpBaseFixture extends TpBase {
	/**
	 * Identifiant du style global de fixture.
	 *
	 * @summary Identifiant de style de fixture.
	 * @internal
	 */
	private static readonly fixtureStyleId = "tp-base-fixture-styles";

	/**
	 * Initialise la fixture.
	 *
	 * @summary Initialise la fixture de test.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(
			TpBaseFixture.fixtureStyleId,
			":where(tp-base-fixture) { display: block; }",
		);
	}

	/**
	 * Expose `getBooleanAttribute()` pour les tests.
	 *
	 * @summary Lit un attribut booléen via la base.
	 * @param name Nom de l’attribut.
	 * @returns Valeur booléenne.
	 */
	public readBoolean(name: string): boolean {
		return this.getBooleanAttribute(name);
	}

	/**
	 * Expose `setBooleanAttribute()` pour les tests.
	 *
	 * @summary Écrit un attribut booléen via la base.
	 * @param name Nom de l’attribut.
	 * @param value Valeur à appliquer.
	 */
	public writeBoolean(name: string, value: boolean): void {
		this.setBooleanAttribute(name, value);
	}

	/**
	 * Expose `getStringAttribute()` pour les tests.
	 *
	 * @summary Lit un attribut texte via la base.
	 * @param name Nom de l’attribut.
	 * @param fallback Valeur de repli.
	 * @returns Valeur résolue.
	 */
	public readString(name: string, fallback = ""): string {
		return this.getStringAttribute(name, fallback);
	}

	/**
	 * Expose `setStringAttribute()` pour les tests.
	 *
	 * @summary Écrit un attribut texte via la base.
	 * @param name Nom de l’attribut.
	 * @param value Valeur à appliquer.
	 */
	public writeString(name: string, value: string): void {
		this.setStringAttribute(name, value);
	}

	/**
	 * Expose `removeAttributes()` pour les tests.
	 *
	 * @summary Supprime plusieurs attributs via la base.
	 * @param names Liste des attributs à supprimer.
	 */
	public clearAttributes(...names: string[]): void {
		this.removeAttributes(...names);
	}

	/**
	 * Expose `queryElement()` pour les tests.
	 *
	 * @summary Recherche un élément via la base.
	 * @param selectors Sélecteur CSS.
	 * @returns Élément trouvé ou `null`.
	 */
	public find(selectors: string): Element | null {
		return this.queryElement(selectors);
	}
}

if (!customElements.get("tp-base-fixture")) {
	customElements.define("tp-base-fixture", TpBaseFixture);
}

class TpGeneratedChildFixture extends TpBase {
	protected override connectedCallback(): void {
		super.connectedCallback();

		if (this.querySelector(":scope > [data-tp-generated-child]") !== null) {
			return;
		}

		const generated = document.createElement("div");
		generated.setAttribute("data-tp-generated-child", "");
		generated.hidden = true;
		this.prepend(generated);
	}
}

if (!customElements.get("tp-generated-child-fixture")) {
	customElements.define("tp-generated-child-fixture", TpGeneratedChildFixture);
}

describe("<tp-base>", () => {
	beforeEach(() => {
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn(() => 0),
		);
		vi.stubGlobal("cancelAnimationFrame", vi.fn());
	});

	afterEach(() => {
		Object.defineProperty(document, "fullscreenElement", {
			configurable: true,
			get: () => null,
		});
		document.body.innerHTML = "";
		document.body.className = "";
		document.documentElement.removeAttribute(
			"data-tp-preserve-document-styles",
		);
		vi.unstubAllGlobals();

		const baseStyleEl = document.getElementById("tp-base-styles");
		baseStyleEl?.remove();
		const resetStyleEl = document.getElementById("tp-reset-styles");
		resetStyleEl?.remove();
		const tokenStyleEl = document.getElementById("tp-token-styles");
		tokenStyleEl?.remove();

		const fixtureStyleEl = document.getElementById("tp-base-fixture-styles");
		fixtureStyleEl?.remove();
	});

	it("est défini", () => {
		expect(customElements.get("tp-base")).toBe(TpBase);
	});

	it("injecte le style de base une seule fois", async () => {
		document.body.innerHTML = `
      <tp-base></tp-base>
      <tp-base></tp-base>
    `;

		await flush();

		const styleEls = document.querySelectorAll("#tp-base-styles");
		const resetStyleEls = document.querySelectorAll("#tp-reset-styles");
		const tokenStyleEls = document.querySelectorAll("#tp-token-styles");
		expect(styleEls).toHaveLength(1);
		expect(resetStyleEls).toHaveLength(1);
		expect(tokenStyleEls).toHaveLength(1);

		const styleEl = document.getElementById("tp-base-styles");
		const resetStyleEl = document.getElementById("tp-reset-styles");
		const tokenStyleEl = document.getElementById("tp-token-styles");
		expect(styleEl?.textContent).toBe(baseStyle);
		expect(resetStyleEl?.textContent).toBe(resetStyle);
		expect(tokenStyleEl?.textContent).toBe(tokenStyle);
	});

	it("préserve les styles du document hôte lorsque cela est demandé", async () => {
		document.documentElement.setAttribute(
			"data-tp-preserve-document-styles",
			"",
		);
		document.body.innerHTML = "<tp-base></tp-base>";
		await flush();

		expect(document.getElementById("tp-token-styles")).toBeInstanceOf(
			HTMLStyleElement,
		);
		expect(document.getElementById("tp-reset-styles")).toBeNull();
		expect(document.getElementById("tp-base-styles")).toBeNull();
	});

	it("applique un thème initial au body", () => {
		vi.stubGlobal(
			"matchMedia",
			vi.fn(() => ({ matches: false }) as unknown as MediaQueryList),
		);

		ensureTpBaseStyles();

		expect(document.body.classList.contains("tp-light")).toBe(true);
		expect(document.body.classList.contains("tp-dark")).toBe(false);
	});

	it("injecte les couleurs globales pour le HTML généré par Highlight.js", () => {
		ensureTpBaseStyles();

		const resetStyleEl = document.getElementById("tp-reset-styles");
		expect(resetStyleEl?.textContent).toContain(".hljs-tag");
		expect(resetStyleEl?.textContent).toContain("--tp-syntax-token-string");
	});

	it("recalcule l’échelle brand dans les presets locaux", () => {
		ensureTpBaseStyles();

		const tokenStyleEl = document.getElementById("tp-token-styles");
		const cssText = tokenStyleEl?.textContent ?? "";

		expect(cssText).toMatch(/\.tp-blue[\s\S]*--tp-brand-seed: #4a97f4/);
		expect(cssText).toMatch(
			/\.tp-default,[\s\S]*\.tp-blue,[\s\S]*--tp-brand-600:/,
		);
		expect(cssText).toMatch(
			/\.tp-default,[\s\S]*\.tp-blue,[\s\S]*--tp-brand-950:/,
		);
	});
	it("provides a text-style alias for every brand palette in light and dark modes", () => {
		ensureTpBaseStyles();
		const css = document.getElementById("tp-token-styles")?.textContent ?? "";
		const palettes = [
			...css.matchAll(/\.(tp-[a-z]+),\s*\.\1-style\s*\{\s*--tp-brand-seed:/g),
		].map((match) => match[1]);
		expect(palettes).toHaveLength(22);
		for (const palette of palettes) {
			expect(css).toContain(`.tp-dark .${palette}-style`);
			const textRule = css.slice(css.indexOf("/* Text-color shortcuts"));
			expect(textRule).toContain(`.${palette}-style`);
			expect(textRule).toContain("color: var(--tp-brand-text-colorful)");
		}
	});

	it("marque automatiquement le host avec data-tp-base-host", async () => {
		document.body.innerHTML = "<tp-base></tp-base>";
		await flush();

		const element = document.querySelector("tp-base");
		expect(element).toBeInstanceOf(TpBase);
		expect(element?.hasAttribute("data-tp-base-host")).toBe(true);
	});

	it("injecte aussi le style de base via une classe fille", async () => {
		document.body.innerHTML = "<tp-base-fixture></tp-base-fixture>";
		await flush();

		const baseStyleEl = document.getElementById("tp-base-styles");
		const fixtureStyleEl = document.getElementById("tp-base-fixture-styles");
		const fixture = document.querySelector("tp-base-fixture");

		expect(baseStyleEl).toBeInstanceOf(HTMLStyleElement);
		expect(fixtureStyleEl).toBeInstanceOf(HTMLStyleElement);
		expect(fixture?.hasAttribute("data-tp-base-host")).toBe(true);
	});

	it("ensureGlobalStyle() n’injecte un style de fixture qu’une seule fois", async () => {
		document.body.innerHTML = `
      <tp-base-fixture></tp-base-fixture>
      <tp-base-fixture></tp-base-fixture>
    `;
		await flush();

		const styleEls = document.querySelectorAll("#tp-base-fixture-styles");
		expect(styleEls).toHaveLength(1);
	});

	it("lit et écrit correctement les attributs texte", async () => {
		document.body.innerHTML = "<tp-base-fixture></tp-base-fixture>";
		await flush();

		const fixture = document.querySelector("tp-base-fixture") as TpBaseFixture;

		expect(fixture.readString("name", "fallback")).toBe("fallback");

		fixture.writeString("name", "demo");
		expect(fixture.readString("name")).toBe("demo");
		expect(fixture.getAttribute("name")).toBe("demo");

		fixture.writeString("name", "");
		expect(fixture.hasAttribute("name")).toBe(false);
	});

	it("supprime plusieurs attributs avec removeAttributes()", async () => {
		document.body.innerHTML =
			'<tp-base-fixture foo="" bar="" baz=""></tp-base-fixture>';
		await flush();

		const fixture = document.querySelector("tp-base-fixture") as TpBaseFixture;

		fixture.clearAttributes("foo", "bar");

		expect(fixture.hasAttribute("foo")).toBe(false);
		expect(fixture.hasAttribute("bar")).toBe(false);
		expect(fixture.hasAttribute("baz")).toBe(true);
	});

	it("retourne un élément avec queryElement()", async () => {
		document.body.innerHTML = `
      <tp-base-fixture>
        <div class="target">hello</div>
      </tp-base-fixture>
    `;
		await flush();

		const fixture = document.querySelector("tp-base-fixture") as TpBaseFixture;
		const target = fixture.find(".target");

		expect(target).toBeInstanceOf(HTMLDivElement);
		expect(target?.textContent).toBe("hello");
	});

	it("déclare dir et lang dans observedAttributes", () => {
		expect(TpBase.observedAttributes).toContain("dir");
		expect(TpBase.observedAttributes).toContain("lang");
	});

	it("attributeChangedCallback ne lève pas d'erreur sur tp-base", async () => {
		document.body.innerHTML = '<tp-base dir="ltr"></tp-base>';
		await flush();

		const element = document.querySelector("tp-base") as TpBase;
		expect(() => {
			element.setAttribute("dir", "rtl");
			element.setAttribute("lang", "ar");
		}).not.toThrow();
	});

	it("reflect dir et lang via les attributs natifs", async () => {
		document.body.innerHTML = '<tp-base dir="rtl" lang="ar"></tp-base>';
		await flush();

		const element = document.querySelector("tp-base") as TpBase;
		expect(element.dir).toBe("rtl");
		expect(element.lang).toBe("ar");
	});

	it("reconnaît Ctrl+? sur les dispositions AZERTY et QWERTY", async () => {
		document.body.innerHTML =
			'<tp-base-fixture tabindex="0"></tp-base-fixture>';
		await flush();

		const fixture = document.querySelector("tp-base-fixture") as TpBaseFixture;
		const helpSpy = vi.spyOn(fixture, "help").mockResolvedValue();
		const event = new KeyboardEvent("keydown", {
			key: "?",
			code: "Comma",
			ctrlKey: true,
			shiftKey: true,
			bubbles: true,
			cancelable: true,
		});
		fixture.dispatchEvent(event);

		expect(event.defaultPrevented).toBe(true);
		expect(helpSpy).toHaveBeenCalledTimes(1);
	});

	it("prefers the hovered non-focusable box over the focused splitter", async () => {
		await import("../box/box.js");
		await import("../splitter/splitter.js");
		document.body.innerHTML =
			'<tp-splitter tabindex="0"><tp-box><span>Hover here</span></tp-box><p>Other pane</p></tp-splitter>';
		const splitter = required(document.querySelector<TpBase>("tp-splitter"));
		const box = required(document.querySelector<TpBase>("tp-box"));
		const boxHelp = vi.spyOn(box, "help").mockResolvedValue();
		const splitterHelp = vi.spyOn(splitter, "help").mockResolvedValue();
		splitter.focus();
		box
			.querySelector("span")
			?.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
		// Later focus events must not erase the pointer target.
		splitter.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
		splitter.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "?",
				ctrlKey: true,
				bubbles: true,
				cancelable: true,
			}),
		);
		expect(boxHelp).toHaveBeenCalledTimes(1);
		expect(splitterHelp).not.toHaveBeenCalled();
		box.dispatchEvent(
			new PointerEvent("pointerout", {
				bubbles: true,
				relatedTarget: document.body,
			}),
		);
		splitter.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "?",
				ctrlKey: true,
				bubbles: true,
				cancelable: true,
			}),
		);
		expect(splitterHelp).toHaveBeenCalledTimes(1);
		expect(boxHelp).toHaveBeenCalledTimes(1);
	});

	it("ignores a removed hovered component and falls back to keyboard focus", () => {
		document.body.innerHTML =
			'<tp-base-fixture id="focused" tabindex="0"></tp-base-fixture><tp-base-fixture id="hovered"></tp-base-fixture>';
		const focused = required(document.querySelector<TpBase>("#focused"));
		const hovered = required(document.querySelector<TpBase>("#hovered"));
		const help = vi.spyOn(focused, "help").mockResolvedValue();
		hovered.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
		hovered.remove();
		focused.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "?",
				ctrlKey: true,
				bubbles: true,
				cancelable: true,
			}),
		);
		expect(help).toHaveBeenCalledTimes(1);
	});

	it("does not duplicate keyboard metadata when reader help already contains its table", async () => {
		const interactions =
			"#### Mouse interactions\n\n| Control | Result |\n| --- | --- |\n| Heading | Toggle content. |\n\n#### Keyboard interactions\n\n| Key | Result |\n| --- | --- |\n| Ctrl+? | Open User Help. |\n| Enter | Toggle content. |";
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => ({
				ok: true,
				json: async () => ({
					tagname: "tp-base-fixture",
					classname: "TpBaseFixture",
					attributes: [],
					methods: [],
					events: [],
					cssproperties: [],
					examples: [],
					userHelp: {
						displayName: "Readable fixture",
						interactions,
						keyboard: [{ key: "Enter", description: "Duplicate metadata" }],
					},
				}),
			})),
		);
		document.body.innerHTML =
			'<tp-base-fixture data-tp-help-src="/help/tables.json"></tp-base-fixture>';
		const fixture = required(
			document.querySelector<TpBaseFixture>("tp-base-fixture"),
		);
		await fixture.help();
		const drawer = required(
			document.getElementById("tp-component-help-drawer"),
		);
		expect(drawer.querySelector("section > dl")).toBeNull();
		expect(drawer.textContent).not.toContain("Duplicate metadata");
		await vi.waitFor(() =>
			expect(drawer.querySelectorAll("table")).toHaveLength(2),
		);
		expect(drawer.textContent).toContain("Ctrl+?");
	});

	it("opens reader help with a direct independent preview and keyboard instructions", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => ({
				ok: true,
				json: async () => ({
					tagname: "tp-base-fixture",
					classname: "TpBaseFixture",
					superclass: "TpBase",
					description: "Author-facing description",
					examples: [],
					attributes: [],
					methods: [],
					events: [],
					cssproperties: [],
					userHelp: {
						displayName: "Readable fixture",
						introduction:
							"The custom `tp-base-fixture` element presents sample content.",
						interactions: "Click a section to open it.",
						keyboard: [
							{ key: "Enter", description: "Toggle the focused section." },
						],
					},
				}),
			})),
		);
		document.body.innerHTML =
			'<tp-base-fixture data-tp-help-src="/help/fixture.json" tabindex="0"><p>Preview content</p></tp-base-fixture>';
		await flush();
		const fixture = required(
			document.querySelector<TpBaseFixture>("tp-base-fixture"),
		);
		const help = vi.spyOn(fixture, "help");
		const event = new KeyboardEvent("keydown", {
			key: "?",
			ctrlKey: true,
			bubbles: true,
			cancelable: true,
		});
		fixture.dispatchEvent(event);
		await help.mock.results[0]?.value;
		const drawer = required(
			document.getElementById("tp-component-help-drawer"),
		);
		expect(event.defaultPrevented).toBe(true);
		expect(drawer.getAttribute("label")).toBe("User help");
		expect(drawer.textContent).toContain("Current element");
		expect(
			drawer.querySelector(".tp-component-help > h2:first-child")?.textContent,
		).toBe("Readable fixture");
		expect(drawer.textContent).toContain("User interactions");
		expect(drawer.textContent).toContain("Toggle the focused section.");
		await vi.waitFor(() => {
			expect(
				drawer.querySelector("tp-markdown:not(.tp-component-help-introduction)")
					?.textContent,
			).toContain("Click a section");
		});
		const introduction = required(
			drawer.querySelector(".tp-component-help-introduction"),
		);
		await vi.waitFor(() =>
			expect(introduction.textContent).toContain("presents sample content"),
		);
		expect(introduction.previousElementSibling?.textContent).toBe(
			"Current element",
		);
		expect(introduction.nextElementSibling?.className).toBe(
			"tp-component-help-preview",
		);
		expect(
			drawer.querySelector(
				"tp-html-viewer, tp-tabs, .tp-component-help-controls",
			),
		).toBeNull();
		expect(drawer.textContent).not.toMatch(
			/Author-facing|extends|Attributes|CSS properties/,
		);
		const clone = required(
			drawer.querySelector<TpBaseFixture>(
				".tp-component-help-preview > tp-base-fixture",
			),
		);
		expect(clone).not.toBe(fixture);
		expect(clone.textContent).toContain("Preview content");
		clone.setAttribute("label", "Clone only");
		expect(fixture.hasAttribute("label")).toBe(false);
	});

	it("uses author source, resolves relative resources and avoids duplicate IDs", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => ({
				ok: true,
				json: async () => ({
					tagname: "tp-base-fixture",
					classname: "TpBaseFixture",
					superclass: "TpBase",
					description: "",
					examples: [],
					attributes: [],
					methods: [],
					events: [],
					cssproperties: [],
				}),
			})),
		);
		document.body.innerHTML =
			'<div data-tp-markdown-source="/docs/demo/index.md"><tp-base-fixture id="original" data-tp-help-src="/help/fixture.json"></tp-base-fixture></div>';
		const fixture = required(
			document.querySelector<TpBaseFixture>("tp-base-fixture"),
		);
		fixture.setAttribute(
			"data-source",
			'<tp-base-fixture><label for="field">Name</label><input id="field"><img src="./image.svg"><script>window.helpExecuted = true;</script><script type="tp/txt">Author content</script></tp-base-fixture>',
		);
		await fixture.help();
		const clone = required(
			document.querySelector<HTMLElement>(
				".tp-component-help-preview > tp-base-fixture",
			),
		);
		expect(clone.id).not.toBe("original");
		expect(clone.querySelector("input")?.id).not.toBe("field");
		expect(clone.querySelector("label")?.htmlFor).toBe(
			clone.querySelector("input")?.id,
		);
		expect(clone.querySelector("img")?.src).toContain("/docs/demo/image.svg");
		expect(clone.querySelector('script:not([type="tp/txt"])')).toBeNull();
		expect(clone.querySelector('script[type="tp/txt"]')?.textContent).toBe(
			"Author content",
		);
		expect(fixture.id).toBe("original");
	});

	it("attache le drawer d'aide à l'élément fullscreen actif", async () => {
		const fetchSpy = vi.fn(async () => ({
			ok: true,
			json: async () => ({
				tagname: "tp-base-fixture",
				classname: "TpBaseFixture",
				superclass: "TpBase",
				description: "Fixture help.",
				examples: [],
				attributes: [],
				methods: [],
				events: [],
				cssproperties: [],
			}),
		}));
		vi.stubGlobal("fetch", fetchSpy);

		document.body.innerHTML = `
      <section id="fullscreen-root">
        <tp-base-fixture data-tp-help-src="/help/tp-base-fixture.json"></tp-base-fixture>
      </section>
    `;
		await flush();

		const fullscreenRoot =
			document.querySelector<HTMLElement>("#fullscreen-root");
		const fixture = document.querySelector("tp-base-fixture") as TpBaseFixture;
		Object.defineProperty(document, "fullscreenElement", {
			configurable: true,
			get: () => fullscreenRoot,
		});

		await fixture.help();

		const drawer = await waitForElement<HTMLElement>(
			"#tp-component-help-drawer",
		);
		expect(drawer.parentElement).toBe(fullscreenRoot);
	});

	it("ouvre l'aide générée avec Ctrl+? pour un composant seulement survolé", async () => {
		const fetchSpy = vi.fn(async () => ({
			ok: true,
			json: async () => ({
				tagname: "tp-base-fixture",
				classname: "TpBaseFixture",
				superclass: "TpBase",
				description: "Hovered fixture help.",
				examples: [],
				attributes: [],
				methods: [],
				events: [],
				cssproperties: [],
			}),
		}));
		vi.stubGlobal("fetch", fetchSpy);

		document.body.innerHTML = `
      <tp-base-fixture data-tp-help-src="/help/hovered-fixture.json">
        <p id="hover-target">content</p>
      </tp-base-fixture>
    `;
		await flush();

		const hoverTarget = document.getElementById(
			"hover-target",
		) as HTMLParagraphElement;
		hoverTarget.dispatchEvent(
			new PointerEvent("pointerover", { bubbles: true }),
		);

		const event = new KeyboardEvent("keydown", {
			key: "?",
			ctrlKey: true,
			shiftKey: true,
			bubbles: true,
			cancelable: true,
		});
		document.dispatchEvent(event);

		const drawer = await waitForElement<HTMLElement>(
			"#tp-component-help-drawer",
		);
		expect(event.defaultPrevented).toBe(true);
		expect(fetchSpy).toHaveBeenCalledWith("/help/hovered-fixture.json");
		expect(drawer.getAttribute("label")).toBe("User help");
		expect(drawer.textContent).toContain("User interactions");
	});
});
