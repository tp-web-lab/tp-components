/**
 * @module components/color-picker
 * @summary Viewer for base color tokens defined in `components/base/tp.css`.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
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
export declare class TpColorPicker extends TpBase {
    /**
     * Global stylesheet identifier for the component.
     *
     * @summary Identifier of the color-picker stylesheet.
     * @internal
     */
    private static readonly styleId;
    /**
     * Connects and renders the component.
     *
     * @summary Initializes and renders the color picker.
     */
    protected connectedCallback(): void;
    /**
     * Renders all token sections and swatches.
     *
     * @summary Builds the viewer UI from token definitions.
     * @internal
     */
    private render;
    /**
     * Creates top navigation controls used to jump between sections.
     *
     * @summary Renders jump selects for scales, class scales and semantic tokens.
     * @returns Navigation element containing all jump controls.
     * @internal
     */
    private createJumpControls;
    /**
     * Creates one labeled jump select control.
     *
     * @summary Renders one select used to jump to target sections/cards.
     * @param labelText Visible label for the control.
     * @param options Available jump targets.
     * @returns Labeled select wrapper element.
     * @internal
     */
    private createJumpSelect;
    /**
     * Handles a jump select change by scrolling to the selected target.
     *
     * @summary Scrolls smoothly to a selected section/card and resets the select.
     * @param select Changed select element.
     * @internal
     */
    private handleJumpSelect;
    /**
     * Creates the section that previews built-in `.tp-*` classes.
     *
     * @summary Renders a class preview section.
     * @returns Section element containing `.tp-*` class cards.
     * @internal
     */
    private createClassSection;
    /**
     * Creates one section block for a token group.
     *
     * @summary Renders one token section.
     * @param section Token section metadata.
     * @returns Section element with token cards.
     * @internal
     */
    private createSection;
    /**
     * Creates a card for one CSS token.
     *
     * @summary Renders one token card with swatch and resolved value.
     * @param tokenName CSS custom property name.
     * @returns Token card element.
     * @internal
     */
    private createTokenCard;
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
    private createClassCard;
    /**
     * Creates a small title displayed above a contrast row.
     *
     * @summary Renders a class-scale row title.
     * @param text Label text.
     * @param rowId Stable row identifier.
     * @returns Title element.
     * @internal
     */
    private createClassScalesTitle;
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
    private createClassSwatch;
    private addCopyInteraction;
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
    private updateClassScaleContrast;
    /**
     * Applies best contrast candidate color for one swatch row mode.
     *
     * @summary Picks the best candidate text token for every chip in a specific mode.
     * @param mode Swatch mode to process.
     * @param candidateColorExpressions Color expressions to evaluate for text color.
     * @internal
     */
    private applyBestContrastToMode;
    /**
     * Resolves a CSS color expression into a computed color string.
     *
     * @summary Resolves a color expression to a concrete computed color.
     * @param element Element used as resolution context.
     * @param colorExpression CSS color expression.
     * @returns Computed color string.
     * @internal
     */
    private resolveColorExpression;
    /**
     * Computes the WCAG contrast ratio between two colors.
     *
     * @summary Calculates contrast ratio from two RGB colors.
     * @param first First color as normalized RGB channels (`0..1`).
     * @param second Second color as normalized RGB channels (`0..1`).
     * @returns WCAG contrast ratio.
     * @internal
     */
    private getContrastRatio;
    /**
     * Computes WCAG relative luminance for an RGB color.
     *
     * @summary Converts normalized RGB to relative luminance.
     * @param rgb Normalized RGB channels (`0..1`).
     * @returns Relative luminance.
     * @internal
     */
    private getRelativeLuminance;
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
    private parseCssColor;
    /**
     * Parses `oklab(...)` and `oklch(...)` CSS colors.
     *
     * @summary Converts OKLab/OKLCH colors into normalized sRGB channels.
     * @param color CSS color string.
     * @returns Normalized RGB tuple or `null`.
     * @internal
     */
    private parseOklabOrOklchColor;
    /**
     * Parses OKLab lightness channel.
     *
     * @summary Parses OKLab lightness to normalized `0..1`.
     * @param value Channel text.
     * @returns Normalized lightness or `null`.
     * @internal
     */
    private parseOklabLightness;
    /**
     * Parses OKLab axis/chroma channel.
     *
     * @summary Parses OKLab axis value.
     * @param value Channel text.
     * @returns Axis value or `null`.
     * @internal
     */
    private parseOklabAxis;
    /**
     * Parses hue text from `oklch(...)`.
     *
     * @summary Parses hue value into degrees.
     * @param value Hue text (`deg`, `rad`, `turn`, `grad`, or unitless).
     * @returns Hue in degrees or `null`.
     * @internal
     */
    private parseHueDegrees;
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
    private oklabToSrgb;
    /**
     * Converts one linear RGB channel to sRGB.
     *
     * @summary Converts one linear channel and clamps it to `0..1`.
     * @param value Linear channel value.
     * @returns sRGB channel.
     * @internal
     */
    private linearToSrgb;
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
    private parseRgbChannel;
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
    private parseUnitIntervalChannel;
    /**
     * Clamps a channel value to the normalized `0..1` interval.
     *
     * @summary Clamps normalized color channel values.
     * @param value Channel value.
     * @returns Clamped value.
     * @internal
     */
    private clampUnit;
    /**
     * Reads the computed value of one CSS custom property.
     *
     * @summary Resolves the current computed value of a token.
     * @param tokenName CSS custom property name.
     * @returns Resolved token value string.
     * @internal
     */
    private getTokenValue;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-color-picker": TpColorPicker;
    }
}
