/** Shared library color presets, usable without loading a component. */
export const TP_COLOR_PRESETS = [
	"tp-default",
	"tp-red",
	"tp-orange",
	"tp-amber",
	"tp-yellow",
	"tp-lime",
	"tp-green",
	"tp-emerald",
	"tp-teal",
	"tp-glaz",
	"tp-cyan",
	"tp-sky",
	"tp-blue",
	"tp-indigo",
	"tp-violet",
	"tp-purple",
	"tp-fuchsia",
	"tp-pink",
	"tp-rose",
	"tp-zinc",
	"tp-ivory",
	"tp-stone",
] as const;

export type TpColorPreset = (typeof TP_COLOR_PRESETS)[number];

/**
 * Maps each preset to the swatch color used by the UI.
 *
 * @summary Associates presets with preview colors.
 * @internal
 */
export const TP_COLOR_SWATCH: Record<TpColorPreset, string> = {
	"tp-default": "#88B1A1" /* tp-glaz */,
	"tp-red": "#ef5655",
	"tp-orange": "#f08039",
	"tp-amber": "#e89a26",
	"tp-yellow": "#dcb31e",
	"tp-lime": "#9abb28",
	"tp-green": "#5dbb55",
	"tp-emerald": "#47b873",
	"tp-teal": "#37b995",
	"tp-glaz": "#88B1A1",
	"tp-cyan": "#20b8bc",
	"tp-sky": "#1caedd",
	"tp-blue": "#4a97f4",
	"tp-indigo": "#6e85f8",
	"tp-violet": "#927cfb",
	"tp-purple": "#ae75f6",
	"tp-fuchsia": "#d26ae8",
	"tp-pink": "#e468b0",
	"tp-rose": "#ee6383",
	"tp-zinc": "#8b8c93",
	"tp-ivory": "#fffff0",
	"tp-stone": "#918c87",
};
