# Brand colors and theme transitions

Last verification: **2026/11/18**.

This focused color review complements the [accessibility inventory](index.md). It measures rendered foreground/background pairs and checks that returning from dark to light restores the initial colors. It is not a certification of every interaction state.

## Results

| Check | Coverage | Result |
| --- | --- | --- |
| Shared semantic colors | 22 brand presets × 34 pairs × 4 scope arrangements × light → dark → light | 8,976 checks per browser; no failures |
| Browser engines | Chromium, Firefox, WebKit | 6 tests passed |
| Introductory component examples | All 212 implementations, 22 presets, light → dark → light, Chromium | 778,211 text contrast measurements; no remaining measured failures or transition differences |
| Targeted unit tests | Base styles, theme controller, tabs | 87 passed |

The four scope arrangements cover theme and brand on the same element, a theme around a brand scope, a local theme inside a dark page, and a theme-only child inheriting its parent's brand. WebKit checks the browser engine; it does not replace a separate Safari application review.

[Detailed per-component results](theme-colors.json) record loading, measured text, frames, exclusions, failures and transition differences. The six examples with no eligible DOM text are `tp-diagram`, `tp-frame`, `tp-icon`, `tp-screen`, `tp-skeleton` and `tp-tikz`; their empty measurement sets are **not** contrast passes.

## Corrections

- Preset semantic colors follow the nearest theme, including local light sections within dark pages and inherited brand colors.
- Text over medium brand surfaces uses a contrasting foreground; yellow and ivory text on paper use a darker light-theme level.
- Console values, object trees, crossword clues, Mastermind attempt numbers and turtle captions use theme-aware tokens.
- Emoji, symbol and icon picker tiles pair brand backgrounds with their corresponding foreground.
- Graph status/calibration labels and slide-note summaries use colors appropriate to their surfaces.
- The comparison example pairs each background with its semantic foreground. Tab panels use body text independently of an enclosing brand callout.

See the [dropdown, drawer and interaction review](interaction-colors.md) for the subsequent open-menu, hover, focus and selected-state checks.

## Built-in logos

All six `logo-*` names are checked directly: `logo-tp`, `logo-tp-components`, `logo-tp-markdown`, `logo-tp-markdown-doc`, its `logo-tp-multi-markdown` alias, and `logo-enibook`. Each appears as a library icon and in a document toolbar: 22 palettes × 2 themes × 6 names × 2 contexts × 3 browser engines = **1,584 logo cases**.

The regression requires at least **4.5:1** between letters and their disk, and **3:1** between graphic details and paper. Translucent outlines are composited onto paper before measurement. Black and white shapes inside SVG masks are excluded because they define transparency rather than visible colors. `logo-enibook` is tested with the inherited brand foreground.

The TP letters use `--tp-paper-color` against the disk's `--tp-brand-text-colorful`. Using `--tp-brand-text-on-mid` was incorrect because the disk is not a medium brand surface. The drawings and typography remain unchanged. These SVG checks pass in Chromium, Firefox and WebKit and run with `pnpm test:a11y:colors`. New `logo-*` entries are discovered automatically by the regression.

## Method and limits

The component inventory loads each Basic usage example independently. It changes the surrounding scope and local `tp-theme`/`tp-color` controllers, samples visible text and form values, and inspects accessible first-level render frames. Ordinary text targets 4.5:1; large text targets 3:1. This inventory allows a 0.01 rounding tolerance when comparing computed 8-bit colors; the shared-palette regression uses the exact threshold without that tolerance.

Animation can replace or hide DOM nodes. Transition comparisons therefore compare colors only for elements present in both light snapshots, independently of their changing text.

This review does not exhaustively open menus, drawers or alternative tabs, or exercise every hover, focus, selected, error and disabled state. Text in SVG, canvas, images and videos, backgrounds containing gradients/images, partially transparent text, pseudo-elements, placeholder styling, deeper/external frames and author-defined color overrides require separate inspection. The default code palette is covered by the semantic contract; arbitrary third-party palettes are not.

## Reproduce

Run the shared-palette regression in all three browser engines:

```sh
pnpm test:a11y:colors
```

With the component development server running on port 4173, run the introductory-example inventory:

```sh
node scripts/audit-component-theme-colors.mjs
```

The inventory writes `/tmp/component-theme-colors.json` and exits unsuccessfully on a measured failure, a transition mismatch or an incomplete example. Use `TP_AUDIT_URL` to select another server, `TP_AUDIT_OUTPUT` to select the report path, or `TP_COMPONENTS=tabs,console` to restrict the run.
