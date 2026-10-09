/**
 * @module components/color-picker
 * @summary Viewer for base color tokens defined in `components/base/tp.css`.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./color-picker.css?inline";

/**
 * One token section rendered by the viewer.
 *
 * @summary Section metadata for token rendering.
 * @internal
 */
type TpColorTokenSection = {
	id: string;
	group: "seed" | "scale" | "semantic";
	title: string;
	tokens: readonly string[];
};

/**
 * One preset class displayed by the viewer.
 *
 * @summary Metadata describing a built-in color preset class.
 * @internal
 */
type TpColorClassItem = {
	id: string;
	presetClass: string;
	brandSeed: string;
};

/**
 * Rendering mode for one class-scale row.
 *
 * @summary Distinguishes plain, semantic contrast and tonal contrast rows.
 * @internal
 */
type TpClassScaleMode = "plain" | "best-contrast" | "tone-contrast";

/**
 * Ordered scale steps used for `.tp-COLOR` previews.
 *
 * @summary Numeric suffixes for the color scale tokens.
 * @internal
 */
const TP_COLOR_SCALE_STEPS = [
	"50",
	"100",
	"200",
	"300",
	"400",
	"500",
	"600",
	"700",
	"800",
	"900",
	"950",
] as const;

/**
 * Mix formulas for each scale step, aligned with `components/base/tp.css`.
 *
 * @summary Color-mix expressions for one preset seed across scale steps.
 * @internal
 */
const TP_COLOR_SCALE_MIXES: Readonly<
	Record<(typeof TP_COLOR_SCALE_STEPS)[number], string>
> = {
	"50": "color-mix(in oklab, var(--tp-brand-seed), white 95%)",
	"100": "color-mix(in oklab, var(--tp-brand-seed), white 87%)",
	"200": "color-mix(in oklab, var(--tp-brand-seed), white 70%)",
	"300": "color-mix(in oklab, var(--tp-brand-seed), white 47%)",
	"400": "color-mix(in oklab, var(--tp-brand-seed), white 23%)",
	"500": "var(--tp-brand-seed)",
	"600": "color-mix(in oklab, var(--tp-brand-seed), black 15.5%)",
	"700": "color-mix(in oklab, var(--tp-brand-seed), black 28.25%)",
	"800": "color-mix(in oklab, var(--tp-brand-seed), black 43.5%)",
	"900": "color-mix(in oklab, var(--tp-brand-seed), black 58.5%)",
	"950": "color-mix(in oklab, var(--tp-brand-seed), black 73.75%)",
};

/**
 * One navigation option in the top jump controls.
 *
 * @summary Target metadata for select-based navigation.
 * @internal
 */
type TpColorJumpOption = {
	label: string;
	targetId: string;
};

/**
 * Creates the full 50..950 token scale for a color family.
 *
 * @summary Builds color scale token names for one family.
 * @param family Color family prefix (`brand`, `neutral`, etc.).
 * @returns Ordered token names for the family.
 * @internal
 */
function createScaleTokens(family: string): readonly string[] {
	return TP_COLOR_SCALE_STEPS.map((step) => `--tp-${family}-${step}`);
}

/**
 * Creates semantic fill/stroke/text token names for one family.
 *
 * @summary Builds semantic token names for one family.
 * @param family Color family prefix (`brand`, `neutral`, etc.).
 * @returns Ordered semantic token names.
 * @internal
 */
function createSemanticTokens(family: string): readonly string[] {
	return [
		`--tp-${family}-fill-softer`,
		`--tp-${family}-fill-soft`,
		`--tp-${family}-fill-mid`,
		`--tp-${family}-fill-loud`,
		`--tp-${family}-fill-louder`,
		`--tp-${family}-text-on-soft`,
		`--tp-${family}-text-on-mid`,
		`--tp-${family}-text-on-loud`,
		`--tp-${family}-text-colorful`,
		`--tp-${family}-stroke-softer`,
		`--tp-${family}-stroke-soft`,
		`--tp-${family}-stroke-mid`,
	];
}

/**
 * Token groups displayed by the component.
 *
 * @summary Static token sections rendered in the viewer.
 * @internal
 */
const TP_SEED_TOKEN_SECTION: TpColorTokenSection = {
	id: "tp-color-picker-seed-tokens",
	group: "seed",
	title: "Seed tokens",
	tokens: [
		"--tp-brand-seed",
		"--tp-neutral-seed",
		"--tp-success-seed",
		"--tp-warning-seed",
		"--tp-danger-seed",
		"--tp-info-seed",
	],
};

const TP_SCALE_TOKEN_SECTIONS: readonly TpColorTokenSection[] = [
	{
		id: "tp-color-picker-brand-scale",
		group: "scale",
		title: "Brand scale",
		tokens: createScaleTokens("brand"),
	},
	{
		id: "tp-color-picker-neutral-scale",
		group: "scale",
		title: "Neutral scale",
		tokens: createScaleTokens("neutral"),
	},
	{
		id: "tp-color-picker-success-scale",
		group: "scale",
		title: "Success scale",
		tokens: createScaleTokens("success"),
	},
	{
		id: "tp-color-picker-warning-scale",
		group: "scale",
		title: "Warning scale",
		tokens: createScaleTokens("warning"),
	},
	{
		id: "tp-color-picker-danger-scale",
		group: "scale",
		title: "Danger scale",
		tokens: createScaleTokens("danger"),
	},
	{
		id: "tp-color-picker-info-scale",
		group: "scale",
		title: "Info scale",
		tokens: createScaleTokens("info"),
	},
];

const TP_SEMANTIC_TOKEN_SECTIONS: readonly TpColorTokenSection[] = [
	{
		id: "tp-color-picker-brand-semantic",
		group: "semantic",
		title: "Brand semantic tokens",
		tokens: createSemanticTokens("brand"),
	},
	{
		id: "tp-color-picker-neutral-semantic",
		group: "semantic",
		title: "Neutral semantic tokens",
		tokens: createSemanticTokens("neutral"),
	},
	{
		id: "tp-color-picker-success-semantic",
		group: "semantic",
		title: "Success semantic tokens",
		tokens: createSemanticTokens("success"),
	},
	{
		id: "tp-color-picker-warning-semantic",
		group: "semantic",
		title: "Warning semantic tokens",
		tokens: createSemanticTokens("warning"),
	},
	{
		id: "tp-color-picker-danger-semantic",
		group: "semantic",
		title: "Danger semantic tokens",
		tokens: createSemanticTokens("danger"),
	},
	{
		id: "tp-color-picker-info-semantic",
		group: "semantic",
		title: "Info semantic tokens",
		tokens: createSemanticTokens("info"),
	},
];

/**
 * Built-in color preset classes from `tp.css` to display in the viewer.
 *
 * @summary Color preset class previews rendered by the component.
 * @internal
 */
const TP_COLOR_CLASS_ITEMS: readonly TpColorClassItem[] = [
	{
		id: "tp-color-picker-class-tp-default",
		presetClass: "tp-default",
		brandSeed: "#989cff",
	},
	{
		id: "tp-color-picker-class-tp-red",
		presetClass: "tp-red",
		brandSeed: "#ef5655",
	},
	{
		id: "tp-color-picker-class-tp-orange",
		presetClass: "tp-orange",
		brandSeed: "#f08039",
	},
	{
		id: "tp-color-picker-class-tp-amber",
		presetClass: "tp-amber",
		brandSeed: "#e89a26",
	},
	{
		id: "tp-color-picker-class-tp-yellow",
		presetClass: "tp-yellow",
		brandSeed: "#dcb31e",
	},
	{
		id: "tp-color-picker-class-tp-lime",
		presetClass: "tp-lime",
		brandSeed: "#9abb28",
	},
	{
		id: "tp-color-picker-class-tp-green",
		presetClass: "tp-green",
		brandSeed: "#5dbb55",
	},
	{
		id: "tp-color-picker-class-tp-emerald",
		presetClass: "tp-emerald",
		brandSeed: "#47b873",
	},
	{
		id: "tp-color-picker-class-tp-teal",
		presetClass: "tp-teal",
		brandSeed: "#37b995",
	},
	{
		id: "tp-color-picker-class-tp-glaz",
		presetClass: "tp-glaz",
		brandSeed: "#88B1A1",
	},
	{
		id: "tp-color-picker-class-tp-cyan",
		presetClass: "tp-cyan",
		brandSeed: "#20b8bc",
	},
	{
		id: "tp-color-picker-class-tp-sky",
		presetClass: "tp-sky",
		brandSeed: "#1caedd",
	},
	{
		id: "tp-color-picker-class-tp-blue",
		presetClass: "tp-blue",
		brandSeed: "#4a97f4",
	},
	{
		id: "tp-color-picker-class-tp-indigo",
		presetClass: "tp-indigo",
		brandSeed: "#6e85f8",
	},
	{
		id: "tp-color-picker-class-tp-violet",
		presetClass: "tp-violet",
		brandSeed: "#927cfb",
	},
	{
		id: "tp-color-picker-class-tp-purple",
		presetClass: "tp-purple",
		brandSeed: "#ae75f6",
	},
	{
		id: "tp-color-picker-class-tp-fuchsia",
		presetClass: "tp-fuchsia",
		brandSeed: "#d26ae8",
	},
	{
		id: "tp-color-picker-class-tp-pink",
		presetClass: "tp-pink",
		brandSeed: "#e468b0",
	},
	{
		id: "tp-color-picker-class-tp-rose",
		presetClass: "tp-rose",
		brandSeed: "#ee6383",
	},
	{
		id: "tp-color-picker-class-tp-zinc",
		presetClass: "tp-zinc",
		brandSeed: "#8b8c93",
	},
	{
		id: "tp-color-picker-class-tp-ivory",
		presetClass: "tp-ivory",
		brandSeed: "#fffff0",
	},
	{
		id: "tp-color-picker-class-tp-stone",
		presetClass: "tp-stone",
		brandSeed: "#918c87",
	},
];

/**
 * `<tp-color-picker>` displays base `tp.css` color tokens as swatches.
 *
 * The component reads current CSS custom property values from computed styles,
 * so it reflects active presets/themes.
 *
 * @summary Viewer for base color tokens.
 * @tagname tp-color-picker
 * @event tp-color-picker-select Emitted after a CSS variable reference is selected and copied.
 * @event tp-color-picker-copy-error Emitted when the clipboard rejects a copy operation.
 * @example
 * <tp-color-picker></tp-color-picker>
 */
export class TpColorPicker extends TpBase {
	/**
	 * Global stylesheet identifier for the component.
	 *
	 * @summary Identifier of the color-picker stylesheet.
	 * @internal
	 */
	private static readonly styleId = "tp-color-picker-styles";

	/**
	 * Connects and renders the component.
	 *
	 * @summary Initializes and renders the color picker.
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpColorPicker.styleId, style);
		this.render();
	}

	/**
	 * Renders all token sections and swatches.
	 *
	 * @summary Builds the viewer UI from token definitions.
	 * @internal
	 */
	private render(): void {
		const fragment = document.createDocumentFragment();
		fragment.append(this.createJumpControls());
		fragment.append(this.createSection(TP_SEED_TOKEN_SECTION));
		for (const section of TP_SCALE_TOKEN_SECTIONS) {
			fragment.append(this.createSection(section));
		}
		fragment.append(this.createClassSection());
		for (const section of TP_SEMANTIC_TOKEN_SECTIONS) {
			fragment.append(this.createSection(section));
		}

		this.replaceChildren(fragment);
		this.updateClassScaleContrast();
	}

	/**
	 * Creates top navigation controls used to jump between sections.
	 *
	 * @summary Renders jump selects for scales, class scales and semantic tokens.
	 * @returns Navigation element containing all jump controls.
	 * @internal
	 */
	private createJumpControls(): HTMLElement {
		const controls = document.createElement("section");
		controls.setAttribute("data-tp-color-picker-jump-controls", "");

		controls.append(
			this.createJumpSelect(
				"Scales",
				TP_SCALE_TOKEN_SECTIONS.map((section) => ({
					label: section.title,
					targetId: section.id,
				})),
			),
			this.createJumpSelect(
				".tp-* class scales",
				TP_COLOR_CLASS_ITEMS.map((item) => ({
					label: `.${item.presetClass}`,
					targetId: item.id,
				})),
			),
			this.createJumpSelect(
				"Semantic tokens",
				TP_SEMANTIC_TOKEN_SECTIONS.map((section) => ({
					label: section.title,
					targetId: section.id,
				})),
			),
		);

		return controls;
	}

	/**
	 * Creates one labeled jump select control.
	 *
	 * @summary Renders one select used to jump to target sections/cards.
	 * @param labelText Visible label for the control.
	 * @param options Available jump targets.
	 * @returns Labeled select wrapper element.
	 * @internal
	 */
	private createJumpSelect(
		labelText: string,
		options: readonly TpColorJumpOption[],
	): HTMLElement {
		const control = document.createElement("label");
		control.setAttribute("data-tp-color-picker-jump-control", "");

		const label = document.createElement("span");
		label.setAttribute("data-tp-color-picker-jump-label", "");
		label.textContent = labelText;

		const select = document.createElement("select");
		select.setAttribute("data-tp-color-picker-jump-select", "");
		select.addEventListener("change", () => this.handleJumpSelect(select));

		const placeholder = document.createElement("option");
		placeholder.value = "";
		placeholder.textContent = `Go to ${labelText.toLowerCase()}…`;
		select.append(placeholder);

		for (const option of options) {
			const optionElement = document.createElement("option");
			optionElement.value = option.targetId;
			optionElement.textContent = option.label;
			select.append(optionElement);
		}

		control.append(label, select);
		return control;
	}

	/**
	 * Handles a jump select change by scrolling to the selected target.
	 *
	 * @summary Scrolls smoothly to a selected section/card and resets the select.
	 * @param select Changed select element.
	 * @internal
	 */
	private handleJumpSelect(select: HTMLSelectElement): void {
		const targetId = select.value;
		if (!targetId) {
			return;
		}

		this.querySelector<HTMLElement>(`#${targetId}`)?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
		select.value = "";
	}

	/**
	 * Creates the section that previews built-in `.tp-*` classes.
	 *
	 * @summary Renders a class preview section.
	 * @returns Section element containing `.tp-*` class cards.
	 * @internal
	 */
	private createClassSection(): HTMLElement {
		const sectionElement = document.createElement("section");
		sectionElement.id = "tp-color-picker-class-scales";
		sectionElement.setAttribute("data-tp-color-picker-section", "");
		sectionElement.setAttribute("data-tp-color-picker-class-section", "");

		const title = document.createElement("h3");
		title.setAttribute("data-tp-color-picker-section-title", "");
		title.textContent = ".tp-* class scales";

		const grid = document.createElement("div");
		grid.setAttribute("data-tp-color-picker-grid", "");
		grid.setAttribute("data-tp-color-picker-class-grid", "");

		for (const classItem of TP_COLOR_CLASS_ITEMS) {
			grid.append(this.createClassCard(classItem));
		}

		sectionElement.append(title, grid);
		return sectionElement;
	}

	/**
	 * Creates one section block for a token group.
	 *
	 * @summary Renders one token section.
	 * @param section Token section metadata.
	 * @returns Section element with token cards.
	 * @internal
	 */
	private createSection(section: TpColorTokenSection): HTMLElement {
		const sectionElement = document.createElement("section");
		sectionElement.id = section.id;
		sectionElement.setAttribute("data-tp-color-picker-section", "");
		sectionElement.setAttribute(
			"data-tp-color-picker-section-group",
			section.group,
		);

		const title = document.createElement("h3");
		title.setAttribute("data-tp-color-picker-section-title", "");
		title.textContent = section.title;

		const grid = document.createElement("div");
		grid.setAttribute("data-tp-color-picker-grid", "");

		for (const tokenName of section.tokens) {
			grid.append(this.createTokenCard(tokenName));
		}

		sectionElement.append(title, grid);
		return sectionElement;
	}

	/**
	 * Creates a card for one CSS token.
	 *
	 * @summary Renders one token card with swatch and resolved value.
	 * @param tokenName CSS custom property name.
	 * @returns Token card element.
	 * @internal
	 */
	private createTokenCard(tokenName: string): HTMLElement {
		const card = document.createElement("article");
		card.setAttribute("data-tp-color-picker-token", "");
		card.dataset.token = tokenName;
		card.tabIndex = 0;
		card.setAttribute("role", "button");
		card.setAttribute("aria-label", `Copy var(${tokenName})`);
		this.addCopyInteraction(card, tokenName);

		const swatch = document.createElement("span");
		swatch.setAttribute("data-tp-color-picker-swatch", "");
		swatch.style.backgroundColor = `var(${tokenName})`;

		const tokenCode = document.createElement("code");
		tokenCode.setAttribute("data-tp-color-picker-token-name", "");
		tokenCode.textContent = tokenName;

		const tokenValue = document.createElement("output");
		tokenValue.setAttribute("data-tp-color-picker-token-value", "");
		tokenValue.textContent = this.getTokenValue(tokenName) || "(unresolved)";

		card.append(swatch, tokenCode, tokenValue);
		return card;
	}

	/**
	 * Creates one card for a built-in color preset class.
	 *
	 * Each preset card renders:
	 * - one plain brand scale line
	 * - one brand-text contrast line
	 * - one tone-on-tone contrast line
	 *
	 * @summary Renders one color preset class scale card.
	 * @param classItem Class metadata to render.
	 * @returns Class card element.
	 * @internal
	 */
	private createClassCard(classItem: TpColorClassItem): HTMLElement {
		const card = document.createElement("article");
		card.id = classItem.id;
		card.setAttribute("data-tp-color-picker-class", "");
		card.dataset.className = classItem.presetClass;

		const name = document.createElement("code");
		name.setAttribute("data-tp-color-picker-class-name", "");
		name.textContent = `.${classItem.presetClass} { --tp-brand-seed: ${classItem.brandSeed}; }`;

		const scales = document.createElement("div");
		scales.setAttribute("data-tp-color-picker-class-scales", "");
		for (const scaleStep of TP_COLOR_SCALE_STEPS) {
			scales.append(
				this.createClassSwatch(
					scaleStep,
					classItem.presetClass,
					scaleStep,
					"plain",
				),
			);
		}

		const bestContrastScales = document.createElement("div");
		bestContrastScales.setAttribute("data-tp-color-picker-class-scales", "");
		bestContrastScales.setAttribute(
			"data-tp-color-picker-class-scales-best",
			"",
		);
		for (const scaleStep of TP_COLOR_SCALE_STEPS) {
			bestContrastScales.append(
				this.createClassSwatch(
					scaleStep,
					classItem.presetClass,
					scaleStep,
					"best-contrast",
				),
			);
		}
		const bestContrastTitle = this.createClassScalesTitle(
			"black or white text",
			"best",
		);

		const toneContrastScales = document.createElement("div");
		toneContrastScales.setAttribute("data-tp-color-picker-class-scales", "");
		toneContrastScales.setAttribute(
			"data-tp-color-picker-class-scales-tone",
			"",
		);
		for (const scaleStep of TP_COLOR_SCALE_STEPS) {
			toneContrastScales.append(
				this.createClassSwatch(
					scaleStep,
					classItem.presetClass,
					scaleStep,
					"tone-contrast",
				),
			);
		}
		const toneContrastTitle = this.createClassScalesTitle(
			"accessible text contrast",
			"tone",
		);

		card.append(
			name,
			scales,
			bestContrastTitle,
			bestContrastScales,
			toneContrastTitle,
			toneContrastScales,
		);
		return card;
	}

	/**
	 * Creates a small title displayed above a contrast row.
	 *
	 * @summary Renders a class-scale row title.
	 * @param text Label text.
	 * @param rowId Stable row identifier.
	 * @returns Title element.
	 * @internal
	 */
	private createClassScalesTitle(text: string, rowId: string): HTMLElement {
		const title = document.createElement("div");
		title.setAttribute("data-tp-color-picker-class-scales-title", "");
		title.dataset.row = rowId;
		title.textContent = text;
		return title;
	}

	/**
	 * Creates one swatch preview for a class combination.
	 *
	 * @summary Renders one class scale swatch.
	 * @param label Scale label shown under the chip.
	 * @param presetClass `.tp-COLOR` class applied to the chip.
	 * @param scaleStep Numeric scale suffix (`50`, `100`, ...).
	 * @param mode Rendering mode for the swatch.
	 * @returns Swatch element with preview and label.
	 * @internal
	 */
	private createClassSwatch(
		label: string,
		presetClass: string,
		scaleStep: (typeof TP_COLOR_SCALE_STEPS)[number],
		mode: TpClassScaleMode,
	): HTMLElement {
		const swatch = document.createElement("div");
		swatch.setAttribute("data-tp-color-picker-class-swatch", "");
		swatch.dataset.mode = mode;
		swatch.dataset.scaleStep = scaleStep;
		const tokenName = `--tp-brand-${scaleStep}`;
		swatch.tabIndex = 0;
		swatch.setAttribute("role", "button");
		swatch.setAttribute("aria-label", `Copy var(${tokenName})`);
		this.addCopyInteraction(swatch, tokenName);

		const chip = document.createElement("span");
		chip.setAttribute("data-tp-color-picker-class-chip", "");
		chip.classList.add(presetClass);
		chip.style.backgroundColor = TP_COLOR_SCALE_MIXES[scaleStep];
		if (mode !== "plain") {
			const text = document.createElement("span");
			text.setAttribute("data-tp-color-picker-class-chip-text", "");
			text.classList.add(presetClass);
			text.textContent = "Aa";
			chip.append(text);
		}

		const caption = document.createElement("code");
		caption.setAttribute("data-tp-color-picker-class-caption", "");
		caption.textContent = label;
		swatch.append(chip, caption);

		if (mode === "tone-contrast") {
			const subcaption = document.createElement("code");
			subcaption.setAttribute("data-tp-color-picker-class-subcaption", "");
			swatch.append(subcaption);
		}

		return swatch;
	}

	private addCopyInteraction(element: HTMLElement, tokenName: string): void {
		const copy = (): void => {
			const value = `var(${tokenName})`;
			if (navigator.clipboard !== undefined) {
				void navigator.clipboard.writeText(value).catch((error: unknown) => {
					this.dispatchEvent(
						new CustomEvent("tp-color-picker-copy-error", {
							bubbles: true,
							composed: true,
							detail: { token: tokenName, value, error },
						}),
					);
				});
			}
			this.dispatchEvent(
				new CustomEvent("tp-color-picker-select", {
					bubbles: true,
					composed: true,
					detail: { token: tokenName, value },
				}),
			);
		};
		element.addEventListener("click", copy);
		element.addEventListener("keydown", (event) => {
			if (event.key !== "Enter" && event.key !== " ") return;
			event.preventDefault();
			copy();
		});
	}

	/**
	 * Computes and applies best text contrast for each `.tp-COLOR` scale chip.
	 *
	 * The best candidate is chosen between:
	 * - `--tp-brand-text-on-soft`
	 * - `--tp-brand-text-on-mid`
	 * - `--tp-brand-text-on-loud`
	 *
	 * @summary Applies best-contrast brand text token on contrast chips.
	 * @internal
	 */
	private updateClassScaleContrast(): void {
		this.applyBestContrastToMode("plain", ["black", "white"]);
		this.applyBestContrastToMode("best-contrast", ["black", "white"]);
		this.applyBestContrastToMode("tone-contrast", ["black", "white"]);
	}

	/**
	 * Applies best contrast candidate color for one swatch row mode.
	 *
	 * @summary Picks the best candidate text token for every chip in a specific mode.
	 * @param mode Swatch mode to process.
	 * @param candidateColorExpressions Color expressions to evaluate for text color.
	 * @internal
	 */
	private applyBestContrastToMode(
		mode: TpClassScaleMode,
		candidateColorExpressions: readonly string[],
	): void {
		const swatches = this.querySelectorAll<HTMLElement>(
			`[data-tp-color-picker-class-swatch][data-mode="${mode}"]`,
		);
		for (const swatch of swatches) {
			const chip = swatch.querySelector<HTMLElement>(
				"[data-tp-color-picker-class-chip]",
			);
			const chipText = swatch.querySelector<HTMLElement>(
				"[data-tp-color-picker-class-chip-text]",
			);
			if (!chip || !chipText) {
				continue;
			}

			const backgroundColor = this.parseCssColor(
				globalThis.getComputedStyle(chip).backgroundColor,
			);
			if (!backgroundColor) {
				continue;
			}

			const candidates = candidateColorExpressions
				.map((expression) => ({
					expression,
					resolvedColor: this.resolveColorExpression(chip, expression),
				}))
				.map((candidate) => ({
					expression: candidate.expression,
					resolvedColor: candidate.resolvedColor,
					parsed: this.parseCssColor(candidate.resolvedColor),
				}))
				.filter(
					(
						candidate,
					): candidate is {
						expression: string;
						resolvedColor: string;
						parsed: [number, number, number];
					} =>
						Boolean(
							candidate.expression &&
								candidate.resolvedColor &&
								candidate.parsed,
						),
				);

			if (candidates.length === 0) {
				continue;
			}

			const [firstCandidate, ...remainingCandidates] = candidates;
			if (firstCandidate === undefined) {
				continue;
			}

			let bestCandidate = firstCandidate;
			let bestRatio = this.getContrastRatio(
				backgroundColor,
				bestCandidate.parsed,
			);
			for (const candidate of remainingCandidates) {
				const ratio = this.getContrastRatio(backgroundColor, candidate.parsed);
				if (ratio > bestRatio) {
					bestCandidate = candidate;
					bestRatio = ratio;
				}
			}

			chipText.style.color = bestCandidate.expression;
		}
	}

	/**
	 * Resolves a CSS color expression into a computed color string.
	 *
	 * @summary Resolves a color expression to a concrete computed color.
	 * @param element Element used as resolution context.
	 * @param colorExpression CSS color expression.
	 * @returns Computed color string.
	 * @internal
	 */
	private resolveColorExpression(
		element: HTMLElement,
		colorExpression: string,
	): string {
		const previousColor = element.style.color;
		element.style.color = colorExpression;
		const resolvedColor = globalThis.getComputedStyle(element).color;
		element.style.color = previousColor;
		return resolvedColor.trim();
	}

	/**
	 * Computes the WCAG contrast ratio between two colors.
	 *
	 * @summary Calculates contrast ratio from two RGB colors.
	 * @param first First color as normalized RGB channels (`0..1`).
	 * @param second Second color as normalized RGB channels (`0..1`).
	 * @returns WCAG contrast ratio.
	 * @internal
	 */
	private getContrastRatio(
		first: readonly [number, number, number],
		second: readonly [number, number, number],
	): number {
		const firstLuminance = this.getRelativeLuminance(first);
		const secondLuminance = this.getRelativeLuminance(second);
		const lightest = Math.max(firstLuminance, secondLuminance);
		const darkest = Math.min(firstLuminance, secondLuminance);
		return (lightest + 0.05) / (darkest + 0.05);
	}

	/**
	 * Computes WCAG relative luminance for an RGB color.
	 *
	 * @summary Converts normalized RGB to relative luminance.
	 * @param rgb Normalized RGB channels (`0..1`).
	 * @returns Relative luminance.
	 * @internal
	 */
	private getRelativeLuminance(rgb: readonly [number, number, number]): number {
		const red =
			rgb[0] <= 0.04045 ? rgb[0] / 12.92 : ((rgb[0] + 0.055) / 1.055) ** 2.4;
		const green =
			rgb[1] <= 0.04045 ? rgb[1] / 12.92 : ((rgb[1] + 0.055) / 1.055) ** 2.4;
		const blue =
			rgb[2] <= 0.04045 ? rgb[2] / 12.92 : ((rgb[2] + 0.055) / 1.055) ** 2.4;
		return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
	}

	/**
	 * Parses a CSS color into normalized RGB channels.
	 *
	 * Supported input formats:
	 * - `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`
	 * - `rgb(...)`, `rgba(...)`
	 * - `color(srgb ...)`
	 *
	 * @summary Parses CSS color text to normalized RGB channels.
	 * @param cssColor CSS color string.
	 * @returns Normalized RGB tuple or `null` when parsing fails.
	 * @internal
	 */
	private parseCssColor(cssColor: string): [number, number, number] | null {
		const color = cssColor.trim().toLowerCase();
		if (!color) {
			return null;
		}

		if (color === "white") {
			return [1, 1, 1];
		}
		if (color === "black") {
			return [0, 0, 0];
		}

		if (color.startsWith("#")) {
			const hex = color.slice(1);
			if (hex.length === 3 || hex.length === 4) {
				const [redHex, greenHex, blueHex] = hex;
				if (
					redHex === undefined ||
					greenHex === undefined ||
					blueHex === undefined
				) {
					return null;
				}

				const red = Number.parseInt(redHex + redHex, 16) / 255;
				const green = Number.parseInt(greenHex + greenHex, 16) / 255;
				const blue = Number.parseInt(blueHex + blueHex, 16) / 255;
				return [red, green, blue];
			}
			if (hex.length === 6 || hex.length === 8) {
				const red = Number.parseInt(hex.slice(0, 2), 16) / 255;
				const green = Number.parseInt(hex.slice(2, 4), 16) / 255;
				const blue = Number.parseInt(hex.slice(4, 6), 16) / 255;
				return [red, green, blue];
			}
			return null;
		}

		const oklabColor = this.parseOklabOrOklchColor(color);
		if (oklabColor) {
			return oklabColor;
		}

		const rgbMatch = color.match(/^rgba?\((.+)\)$/);
		if (rgbMatch) {
			const [, rgbContent] = rgbMatch;
			if (rgbContent === undefined) {
				return null;
			}

			const channels = rgbContent
				.replaceAll("/", " ")
				.replaceAll(",", " ")
				.split(/\s+/)
				.filter(Boolean)
				.slice(0, 3)
				.map((value) => this.parseRgbChannel(value));
			if (channels.length < 3 || channels.some((channel) => channel === null)) {
				return null;
			}
			const [red, green, blue] = channels;
			if (
				red === undefined ||
				green === undefined ||
				blue === undefined ||
				red === null ||
				green === null ||
				blue === null
			) {
				return null;
			}
			return [red, green, blue];
		}

		const colorSrgbMatch = color.match(/^color\(srgb\s+(.+)\)$/);
		if (colorSrgbMatch) {
			const [, srgbContent] = colorSrgbMatch;
			if (srgbContent === undefined) {
				return null;
			}

			const channels = srgbContent
				.replaceAll("/", " ")
				.split(/\s+/)
				.filter(Boolean)
				.slice(0, 3)
				.map((value) => this.parseUnitIntervalChannel(value));
			if (channels.length < 3 || channels.some((channel) => channel === null)) {
				return null;
			}
			const [red, green, blue] = channels;
			if (
				red === undefined ||
				green === undefined ||
				blue === undefined ||
				red === null ||
				green === null ||
				blue === null
			) {
				return null;
			}
			return [red, green, blue];
		}

		const numericParts = color
			.match(/[\d.]+/g)
			?.slice(0, 3)
			.map(Number);
		if (
			!numericParts ||
			numericParts.length < 3 ||
			numericParts.some((channel) => Number.isNaN(channel))
		) {
			return null;
		}

		const [red, green, blue] = numericParts;
		if (red === undefined || green === undefined || blue === undefined) {
			return null;
		}

		return [red / 255, green / 255, blue / 255];
	}

	/**
	 * Parses `oklab(...)` and `oklch(...)` CSS colors.
	 *
	 * @summary Converts OKLab/OKLCH colors into normalized sRGB channels.
	 * @param color CSS color string.
	 * @returns Normalized RGB tuple or `null`.
	 * @internal
	 */
	private parseOklabOrOklchColor(
		color: string,
	): [number, number, number] | null {
		const oklabMatch = color.match(/^oklab\((.+)\)$/);
		if (oklabMatch) {
			const [, oklabContent] = oklabMatch;
			if (oklabContent === undefined) {
				return null;
			}

			const parts = oklabContent
				.replaceAll("/", " ")
				.split(/\s+/)
				.filter(Boolean)
				.slice(0, 3);
			if (parts.length < 3) {
				return null;
			}
			const [lightnessText, firstAxisText, secondAxisText] = parts;
			if (
				lightnessText === undefined ||
				firstAxisText === undefined ||
				secondAxisText === undefined
			) {
				return null;
			}

			const lightness = this.parseOklabLightness(lightnessText);
			const firstAxis = this.parseOklabAxis(firstAxisText);
			const secondAxis = this.parseOklabAxis(secondAxisText);
			if (lightness === null || firstAxis === null || secondAxis === null) {
				return null;
			}
			return this.oklabToSrgb(lightness, firstAxis, secondAxis);
		}

		const oklchMatch = color.match(/^oklch\((.+)\)$/);
		if (oklchMatch) {
			const [, oklchContent] = oklchMatch;
			if (oklchContent === undefined) {
				return null;
			}

			const parts = oklchContent
				.replaceAll("/", " ")
				.split(/\s+/)
				.filter(Boolean)
				.slice(0, 3);
			if (parts.length < 3) {
				return null;
			}
			const [lightnessText, chromaText, hueText] = parts;
			if (
				lightnessText === undefined ||
				chromaText === undefined ||
				hueText === undefined
			) {
				return null;
			}

			const lightness = this.parseOklabLightness(lightnessText);
			const chroma = this.parseOklabAxis(chromaText);
			const hueDegrees = this.parseHueDegrees(hueText);
			if (lightness === null || chroma === null || hueDegrees === null) {
				return null;
			}
			const hueRadians = (hueDegrees * Math.PI) / 180;
			return this.oklabToSrgb(
				lightness,
				chroma * Math.cos(hueRadians),
				chroma * Math.sin(hueRadians),
			);
		}

		return null;
	}

	/**
	 * Parses OKLab lightness channel.
	 *
	 * @summary Parses OKLab lightness to normalized `0..1`.
	 * @param value Channel text.
	 * @returns Normalized lightness or `null`.
	 * @internal
	 */
	private parseOklabLightness(value: string): number | null {
		const trimmed = value.trim();
		if (!trimmed) {
			return null;
		}
		const parsed = Number.parseFloat(trimmed);
		if (Number.isNaN(parsed)) {
			return null;
		}
		if (trimmed.endsWith("%")) {
			return this.clampUnit(parsed / 100);
		}
		return this.clampUnit(parsed);
	}

	/**
	 * Parses OKLab axis/chroma channel.
	 *
	 * @summary Parses OKLab axis value.
	 * @param value Channel text.
	 * @returns Axis value or `null`.
	 * @internal
	 */
	private parseOklabAxis(value: string): number | null {
		const trimmed = value.trim();
		if (!trimmed) {
			return null;
		}
		const parsed = Number.parseFloat(trimmed);
		if (Number.isNaN(parsed)) {
			return null;
		}
		if (trimmed.endsWith("%")) {
			return parsed / 100;
		}
		return parsed;
	}

	/**
	 * Parses hue text from `oklch(...)`.
	 *
	 * @summary Parses hue value into degrees.
	 * @param value Hue text (`deg`, `rad`, `turn`, `grad`, or unitless).
	 * @returns Hue in degrees or `null`.
	 * @internal
	 */
	private parseHueDegrees(value: string): number | null {
		const trimmed = value.trim();
		if (!trimmed) {
			return null;
		}
		const parsed = Number.parseFloat(trimmed);
		if (Number.isNaN(parsed)) {
			return null;
		}
		if (trimmed.endsWith("deg")) {
			return parsed;
		}
		if (trimmed.endsWith("grad")) {
			return parsed * 0.9;
		}
		if (trimmed.endsWith("rad")) {
			return (parsed * 180) / Math.PI;
		}
		if (trimmed.endsWith("turn")) {
			return parsed * 360;
		}
		return parsed;
	}

	/**
	 * Converts one OKLab color to normalized sRGB.
	 *
	 * @summary Transforms OKLab channels into normalized sRGB channels.
	 * @param lightness OKLab `L` channel (`0..1`).
	 * @param firstAxis OKLab `a` channel.
	 * @param secondAxis OKLab `b` channel.
	 * @returns Normalized sRGB tuple.
	 * @internal
	 */
	private oklabToSrgb(
		lightness: number,
		firstAxis: number,
		secondAxis: number,
	): [number, number, number] {
		const lPrime =
			lightness + 0.3963377774 * firstAxis + 0.2158037573 * secondAxis;
		const mPrime =
			lightness - 0.1055613458 * firstAxis - 0.0638541728 * secondAxis;
		const sPrime =
			lightness - 0.0894841775 * firstAxis - 1.291485548 * secondAxis;

		const l = lPrime ** 3;
		const m = mPrime ** 3;
		const s = sPrime ** 3;

		const linearRed = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
		const linearGreen = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
		const linearBlue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

		return [
			this.linearToSrgb(linearRed),
			this.linearToSrgb(linearGreen),
			this.linearToSrgb(linearBlue),
		];
	}

	/**
	 * Converts one linear RGB channel to sRGB.
	 *
	 * @summary Converts one linear channel and clamps it to `0..1`.
	 * @param value Linear channel value.
	 * @returns sRGB channel.
	 * @internal
	 */
	private linearToSrgb(value: number): number {
		if (value <= 0.0031308) {
			return this.clampUnit(12.92 * value);
		}
		return this.clampUnit(1.055 * value ** (1 / 2.4) - 0.055);
	}

	/**
	 * Parses one RGB channel from `rgb(...)` / `rgba(...)` formats.
	 *
	 * Supports both percentage channels (`95%`) and numeric channels (`242`).
	 *
	 * @summary Parses one RGB/RGBA channel to the normalized `0..1` range.
	 * @param value Channel text.
	 * @returns Normalized channel or `null`.
	 * @internal
	 */
	private parseRgbChannel(value: string): number | null {
		const trimmed = value.trim();
		if (!trimmed) {
			return null;
		}

		const parsed = Number.parseFloat(trimmed);
		if (Number.isNaN(parsed)) {
			return null;
		}
		if (trimmed.endsWith("%")) {
			return this.clampUnit(parsed / 100);
		}
		return this.clampUnit(parsed / 255);
	}

	/**
	 * Parses one `color(srgb ...)` channel value.
	 *
	 * Supports both unit channels (`0.95`) and percentage channels (`95%`).
	 *
	 * @summary Parses one `color(srgb ...)` channel to normalized `0..1`.
	 * @param value Channel text.
	 * @returns Normalized channel or `null`.
	 * @internal
	 */
	private parseUnitIntervalChannel(value: string): number | null {
		const trimmed = value.trim();
		if (!trimmed) {
			return null;
		}

		const parsed = Number.parseFloat(trimmed);
		if (Number.isNaN(parsed)) {
			return null;
		}
		if (trimmed.endsWith("%")) {
			return this.clampUnit(parsed / 100);
		}
		return this.clampUnit(parsed);
	}

	/**
	 * Clamps a channel value to the normalized `0..1` interval.
	 *
	 * @summary Clamps normalized color channel values.
	 * @param value Channel value.
	 * @returns Clamped value.
	 * @internal
	 */
	private clampUnit(value: number): number {
		if (value < 0) {
			return 0;
		}
		if (value > 1) {
			return 1;
		}
		return value;
	}

	/**
	 * Reads the computed value of one CSS custom property.
	 *
	 * @summary Resolves the current computed value of a token.
	 * @param tokenName CSS custom property name.
	 * @returns Resolved token value string.
	 * @internal
	 */
	private getTokenValue(tokenName: string): string {
		const computedStyle = globalThis.getComputedStyle(this);
		return computedStyle.getPropertyValue(tokenName).trim();
	}
}

if (!customElements.get("tp-color-picker")) {
	customElements.define("tp-color-picker", TpColorPicker);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-color-picker": TpColorPicker;
	}
}
