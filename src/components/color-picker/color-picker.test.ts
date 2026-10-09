/**
 * @module color-picker/test
 * @summary Tests for the `<tp-color-picker>` component.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./color-picker.js";
import type { TpColorPicker } from "./color-picker.js";

/**
 * Mounts a connected color picker component.
 *
 * @summary Creates and appends a color picker for tests.
 * @returns Connected color picker element.
 */
function mountViewer(): TpColorPicker {
	const viewer = document.createElement("tp-color-picker") as TpColorPicker;
	document.body.append(viewer);
	return viewer;
}

describe("<tp-color-picker>", () => {
	let writeText: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		document.body.innerHTML = "";
		writeText = vi.fn<(_: string) => Promise<void>>().mockResolvedValue();
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText },
		});
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("is registered as a custom element", () => {
		expect(customElements.get("tp-color-picker")).toBeDefined();
	});

	it("renders color token sections", () => {
		const viewer = mountViewer();
		const sections = viewer.querySelectorAll("[data-tp-color-picker-section]");
		expect(sections.length).toBeGreaterThan(0);
	});

	it("copies the clicked color as a CSS variable reference", () => {
		const picker = mountViewer();
		const listener = vi.fn();
		picker.addEventListener("tp-color-picker-select", listener);
		picker.querySelector<HTMLElement>(
			'[data-tp-color-picker-token][data-token="--tp-brand-500"]',
		)?.click();

		expect(writeText).toHaveBeenCalledWith("var(--tp-brand-500)");
		expect(listener).toHaveBeenCalledWith(expect.objectContaining({
			detail: { token: "--tp-brand-500", value: "var(--tp-brand-500)" },
		}));
	});

	it("renders a section for built-in .tp-* classes", () => {
		const viewer = mountViewer();
		const classSection = viewer.querySelector(
			"[data-tp-color-picker-class-section]",
		);
		expect(classSection).not.toBeNull();
	});

	it("renders top jump selects for scales, class scales and semantic tokens", () => {
		const viewer = mountViewer();
		const selects = viewer.querySelectorAll(
			"[data-tp-color-picker-jump-select]",
		);
		expect(selects.length).toBe(3);
	});

	it("places .tp-* class scales after scales and before semantic tokens", () => {
		const viewer = mountViewer();
		const infoScale = viewer.querySelector("#tp-color-picker-info-scale");
		const classSection = viewer.querySelector(
			"[data-tp-color-picker-class-section]",
		);
		const brandSemantic = viewer.querySelector(
			"#tp-color-picker-brand-semantic",
		);

		expect(infoScale).not.toBeNull();
		expect(classSection).not.toBeNull();
		expect(brandSemantic).not.toBeNull();

		if (!infoScale || !classSection || !brandSemantic) {
			throw new Error("Expected sections to exist");
		}

		const isClassAfterInfoScale =
			infoScale.compareDocumentPosition(classSection) &
			Node.DOCUMENT_POSITION_FOLLOWING;
		const isSemanticAfterClass =
			classSection.compareDocumentPosition(brandSemantic) &
			Node.DOCUMENT_POSITION_FOLLOWING;

		expect(isClassAfterInfoScale).not.toBe(0);
		expect(isSemanticAfterClass).not.toBe(0);
	});

	it("renders token cards with swatches and names", () => {
		const viewer = mountViewer();
		const card = viewer.querySelector<HTMLElement>(
			"[data-tp-color-picker-token]",
		);
		expect(card).not.toBeNull();

		const tokenName = card?.querySelector("[data-tp-color-picker-token-name]");
		const swatch = card?.querySelector("[data-tp-color-picker-swatch]");
		expect(tokenName).not.toBeNull();
		expect(swatch).not.toBeNull();
	});

	it("includes expected base token names", () => {
		const viewer = mountViewer();
		const brandToken = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-token][data-token="--tp-brand-500"]',
		);
		const neutralToken = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-token][data-token="--tp-neutral-500"]',
		);
		expect(brandToken).not.toBeNull();
		expect(neutralToken).not.toBeNull();
	});

	it("includes expected .tp-* class cards", () => {
		const viewer = mountViewer();
		const defaultClassCard = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-default"]',
		);
		const ivoryClassCard = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-ivory"]',
		);
		expect(defaultClassCard).not.toBeNull();
		expect(ivoryClassCard).not.toBeNull();
	});

	it("shows CSS declaration next to class name", () => {
		const viewer = mountViewer();
		const orangeClassName = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-orange"] [data-tp-color-picker-class-name]',
		);
		expect(orangeClassName?.textContent).toBe(
			".tp-orange { --tp-brand-seed: #f08039; }",
		);
	});

	it("renders all scale chips for each .tp-* class card on one line", () => {
		const viewer = mountViewer();
		const defaultClassCard = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-default"]',
		);
		expect(defaultClassCard).not.toBeNull();

		const scalesRow = defaultClassCard?.querySelector<HTMLElement>(
			"[data-tp-color-picker-class-scales]",
		);
		expect(scalesRow).not.toBeNull();

		const swatches = defaultClassCard?.querySelectorAll(
			'[data-tp-color-picker-class-swatch][data-mode="plain"]',
		);
		expect(swatches?.length).toBe(11);

		const labels = Array.from(
			defaultClassCard?.querySelectorAll<HTMLElement>(
				'[data-tp-color-picker-class-swatch][data-mode="plain"] [data-tp-color-picker-class-caption]',
			) ?? [],
		).map((element) => element.textContent);

		expect(labels).toEqual([
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
		]);
	});

	it("renders a second scale line for best brand-text contrast", () => {
		const viewer = mountViewer();
		const defaultClassCard = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-default"]',
		);
		expect(defaultClassCard).not.toBeNull();

		const bestScalesRow = defaultClassCard?.querySelector<HTMLElement>(
			"[data-tp-color-picker-class-scales-best]",
		);
		expect(bestScalesRow).not.toBeNull();

		const bestSwatches = defaultClassCard?.querySelectorAll<HTMLElement>(
			'[data-tp-color-picker-class-swatch][data-mode="best-contrast"]',
		);
		expect(bestSwatches?.length).toBe(11);
	});

	it("renders a third tone-on-tone line for best same-scale contrast", () => {
		const viewer = mountViewer();
		const defaultClassCard = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-default"]',
		);
		expect(defaultClassCard).not.toBeNull();

		const toneScalesRow = defaultClassCard?.querySelector<HTMLElement>(
			"[data-tp-color-picker-class-scales-tone]",
		);
		expect(toneScalesRow).not.toBeNull();

		const toneSwatches = defaultClassCard?.querySelectorAll<HTMLElement>(
			'[data-tp-color-picker-class-swatch][data-mode="tone-contrast"]',
		);
		expect(toneSwatches?.length).toBe(11);
	});

	it("renders small titles for the second and third rows", () => {
		const viewer = mountViewer();
		const titles = Array.from(
			viewer.querySelectorAll<HTMLElement>(
				"[data-tp-color-picker-class-scales-title]",
			),
		).map((element) => element.textContent);

		expect(titles).toContain("black or white text");
		expect(titles).toContain("accessible text contrast");
	});

	it("uses preset seed-based scale formulas for class chips", () => {
		const viewer = mountViewer();
		const redClassCard = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-red"]',
		);
		expect(redClassCard).not.toBeNull();

		const firstChip = redClassCard?.querySelector<HTMLElement>(
			"[data-tp-color-picker-class-chip]",
		);
		expect(firstChip).not.toBeNull();
		expect(firstChip?.style.backgroundColor).toContain("var(--tp-brand-seed)");
	});

	it("does not render AAA/ratio contrast output rows anymore", () => {
		const viewer = mountViewer();
		const contrastOutputs = viewer.querySelectorAll(
			"[data-tp-color-picker-class-contrast]",
		);
		expect(contrastOutputs.length).toBe(0);
	});

	it("applies visible preview text on best-contrast chips", () => {
		const viewer = mountViewer();
		const firstLightChipText = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-default"] [data-tp-color-picker-class-swatch][data-mode="best-contrast"] [data-tp-color-picker-class-chip-text]',
		);
		expect(firstLightChipText).not.toBeNull();
		expect(firstLightChipText?.textContent).toBe("Aa");
		expect(firstLightChipText?.classList.contains("tp-default")).toBe(true);
	});

	it("applies visible preview text on tone-on-tone chips", () => {
		const viewer = mountViewer();
		const firstToneChipText = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-default"] [data-tp-color-picker-class-swatch][data-mode="tone-contrast"] [data-tp-color-picker-class-chip-text]',
		);
		expect(firstToneChipText).not.toBeNull();
		expect(firstToneChipText?.textContent).toBe("Aa");
		expect(firstToneChipText?.classList.contains("tp-default")).toBe(true);
	});

	it("uses preset class on tone-on-tone text span", () => {
		const viewer = mountViewer();
		const toneText = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-orange"] [data-tp-color-picker-class-swatch][data-mode="tone-contrast"] [data-tp-color-picker-class-chip-text]',
		);
		expect(toneText).not.toBeNull();
		expect(toneText?.classList.contains("tp-orange")).toBe(true);
	});

	it("uses class-specific tone color instead of the default palette", () => {
		const viewer = mountViewer();
		const defaultToneText = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-default"] [data-tp-color-picker-class-swatch][data-mode="tone-contrast"][data-scale-step="500"] [data-tp-color-picker-class-chip-text]',
		);
		const orangeToneText = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-orange"] [data-tp-color-picker-class-swatch][data-mode="tone-contrast"][data-scale-step="500"] [data-tp-color-picker-class-chip-text]',
		);

		expect(defaultToneText).not.toBeNull();
		expect(orangeToneText).not.toBeNull();
		expect(defaultToneText?.classList.contains("tp-default")).toBe(true);
		expect(orangeToneText?.classList.contains("tp-orange")).toBe(true);
	});

	it("shows the text scale under the background scale on tone-on-tone chips", () => {
		const viewer = mountViewer();
		const toneSubcaption = viewer.querySelector<HTMLElement>(
			'[data-tp-color-picker-class][data-class-name="tp-default"] [data-tp-color-picker-class-swatch][data-mode="tone-contrast"] [data-tp-color-picker-class-subcaption]',
		);

		expect(toneSubcaption).not.toBeNull();
		expect(toneSubcaption?.hasAttribute("data-tp-color-picker-class-subcaption")).toBe(true);
	});

	it("parses the CSS color formats used by design tokens", () => {
		const picker = mountViewer() as unknown as {
			parseCssColor(value: string): [number, number, number] | null;
			parseOklabLightness(value: string): number | null;
			parseOklabAxis(value: string): number | null;
			parseHueDegrees(value: string): number | null;
			parseRgbChannel(value: string): number | null;
			parseUnitIntervalChannel(value: string): number | null;
			linearToSrgb(value: number): number;
			clampUnit(value: number): number;
			getContrastRatio(first: readonly [number, number, number], second: readonly [number, number, number]): number;
		};

		expect(picker.parseCssColor("white")).toEqual([1, 1, 1]);
		expect(picker.parseCssColor("black")).toEqual([0, 0, 0]);
		expect(picker.parseCssColor("#f80")).toEqual([1, 136 / 255, 0]);
		expect(picker.parseCssColor("#ff8800cc")).toEqual([1, 136 / 255, 0]);
		expect(picker.parseCssColor("rgb(255 50% 0 / .5)")).toEqual([1, 0.5, 0]);
		expect(picker.parseCssColor("color(srgb 1 50% 0 / .5)")).toEqual([1, 0.5, 0]);
		expect(picker.parseCssColor("oklab(50% 0 0)")).not.toBeNull();
		expect(picker.parseCssColor("oklch(0.5 0.1 0.5turn)")).not.toBeNull();
		expect(picker.parseCssColor("legacy(255, 128, 0)")).toEqual([1, 128 / 255, 0]);
		expect(picker.parseCssColor("")).toBeNull();
		expect(picker.parseCssColor("#12")).toBeNull();
		expect(picker.parseCssColor("rgb(nope 0 0)")).toBeNull();
		expect(picker.parseCssColor("color(srgb 1 0)")).toBeNull();
		expect(picker.parseCssColor("not-a-color")).toBeNull();

		expect(picker.parseOklabLightness("120%")).toBe(1);
		expect(picker.parseOklabLightness("nope")).toBeNull();
		expect(picker.parseOklabAxis("25%")).toBe(0.25);
		expect(picker.parseOklabAxis("nope")).toBeNull();
		expect(picker.parseHueDegrees("3.141592653589793rad")).toBeCloseTo(180);
		expect(picker.parseHueDegrees("100grad")).toBe(90);
		expect(picker.parseHueDegrees("90deg")).toBe(90);
		expect(picker.parseHueDegrees("0.5turn")).toBe(180);
		expect(picker.parseHueDegrees("45")).toBe(45);
		expect(picker.parseHueDegrees("nope")).toBeNull();
		expect(picker.parseRgbChannel("255")).toBe(1);
		expect(picker.parseRgbChannel("")).toBeNull();
		expect(picker.parseUnitIntervalChannel("150%")).toBe(1);
		expect(picker.parseUnitIntervalChannel("nope")).toBeNull();
		expect(picker.linearToSrgb(0)).toBe(0);
		expect(picker.linearToSrgb(1)).toBeCloseTo(1);
		expect(picker.clampUnit(-1)).toBe(0);
		expect(picker.clampUnit(2)).toBe(1);
		expect(picker.getContrastRatio([0, 0, 0], [1, 1, 1])).toBeCloseTo(21);
	});

	it("supports keyboard copying and reports clipboard failures", async () => {
		writeText.mockRejectedValueOnce(new Error("denied"));
		const picker = mountViewer();
		const onError = vi.fn();
		picker.addEventListener("tp-color-picker-copy-error", onError);
		const swatch = picker.querySelector<HTMLElement>("[data-tp-color-picker-token]");
		swatch?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
		await vi.waitFor(() => expect(onError).toHaveBeenCalledOnce());
		swatch?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
		expect(writeText).toHaveBeenCalledOnce();
	});

	it("computes the best chip contrast and operates jump controls", () => {
		const picker = mountViewer() as unknown as HTMLElement & {
			applyBestContrastToMode(mode: "best-contrast", candidates: readonly string[]): void;
		};
		const computedStyle = vi.spyOn(globalThis, "getComputedStyle").mockImplementation(
			(element) => ({
				backgroundColor: "rgb(255 255 255)",
				color: (element as HTMLElement).style.color || "black",
				getPropertyValue: () => "rgb(152 156 255)",
			}) as unknown as CSSStyleDeclaration,
		);

		picker.applyBestContrastToMode("best-contrast", ["white", "black", "invalid"]);
		const text = picker.querySelector<HTMLElement>(
			'[data-mode="best-contrast"] [data-tp-color-picker-class-chip-text]',
		);
		expect(text?.style.color).toBe("black");

		const target = picker.querySelector<HTMLElement>("#tp-color-picker-brand-scale");
		const scrollIntoView = vi.fn();
		if (target !== null) target.scrollIntoView = scrollIntoView;
		const select = picker.querySelector<HTMLSelectElement>("[data-tp-color-picker-jump-select]");
		if (select !== null) {
			select.dispatchEvent(new Event("change"));
			select.value = "tp-color-picker-brand-scale";
			select.dispatchEvent(new Event("change"));
		}
		expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
		expect(select?.value).toBe("");
		computedStyle.mockRestore();
	});
});
