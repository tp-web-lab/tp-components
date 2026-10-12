/** Shared library color presets, usable without loading a component. */
export declare const TP_COLOR_PRESETS: readonly ["tp-default", "tp-red", "tp-orange", "tp-amber", "tp-yellow", "tp-lime", "tp-green", "tp-emerald", "tp-teal", "tp-glaz", "tp-cyan", "tp-sky", "tp-blue", "tp-indigo", "tp-violet", "tp-purple", "tp-fuchsia", "tp-pink", "tp-rose", "tp-zinc", "tp-ivory", "tp-stone"];
export type TpColorPreset = (typeof TP_COLOR_PRESETS)[number];
/**
 * Maps each preset to the swatch color used by the UI.
 *
 * @summary Associates presets with preview colors.
 * @internal
 */
export declare const TP_COLOR_SWATCH: Record<TpColorPreset, string>;
