# Dropdown, drawer and interaction colors

Last verification: **2026/11/18**.

This review extends the [brand-color and theme-transition review](theme-colors.md) to open overlays and interactive states. It checks all **22 brand presets** in light and dark themes.

## Results

| Check | Coverage | Result |
| --- | --- | --- |
| Component inventory | 212 introductory examples × open / hover / focus, Chromium | 636 completed scans; no remaining measured contrast failures or transition differences |
| Text and icon contrast | Light → dark → light for each brand in every scan | 3,124,618 measurements |
| Open overlays across the examples | 342 dropdowns and 31 drawers, including the rules drawers of all 16 games | Sampled in every palette and theme |
| Existing selected states | 397 selected, checked or current markers in the final open snapshots | Included in the sampled content |
| Real pointer and keyboard regression | Dropdown, submenu, drawer, buttons, icon buttons, current navigation link, selected tabs and selected color/theme options | 9 tests passed in Chromium, Firefox and WebKit |
| Unit regressions | Base, dropdown, drawer, button, icon-button, color, theme and tabs | 211 tests passed |

[Detailed component/state measurements](interaction-colors.json).

The browser regression checks foreground contrast, visible keyboard focus and focus-indicator contrast. It exercises selected options both at rest and with hover/focus. It includes outlined buttons rendered as anchors, their inner labels, and the drawer resize handle. The palette contract also checks the focus color against paper.

## Corrections

- Dropdown menu items now have an explicit keyboard-focus outline.
- The focus token uses a readable brand foreground, including the ivory palette.
- Outlined buttons pair their hover background with the corresponding text-on-soft token. Link-button labels inherit the current button foreground.
- The brightness filter on hovered buttons was removed: it reduced the contrast of light ivory buttons below the required threshold.
- Icon-button variants use theme-aware semantic colors instead of fixed fallback colors. Color and theme triggers use readable brand and warning shades.
- Game toolbar color/theme controls retain readable icons on a neutral hover surface.
- Drawer resize handles use text-on-mid for the inset focus outline on their medium brand surface.
- Hovered tree rows preserve the appropriate foreground for current-page links, including links wrapped in paragraphs, and for typed object-tree values.

## Method and limits

The inventory opens each introductory example independently, opens its instantiated dropdowns and drawers, expands submenu branches and explicitly creates game-rule drawers. Chromium's CSS pseudo-state API applies hover and focus states to the discovered controls. This is a **stylesheet stress test**: several controls may be marked hovered/focused simultaneously, and overlays may overlap. It does not claim that every such combination is a possible user interaction.

A separate Playwright regression uses real pointer movement, keyboard focus and tab/menu actions inside a drawer in all three engines. Text targets 4.5:1; icon-only controls and focus indicators target 3:1. This regression uses strict thresholds and includes button brightness in its calculation. The large inventory retains the previous 0.01 rounding tolerance and checks computed CSS colors, not rasterized pixels.

Selection in the inventory means existing `aria-selected`, `aria-checked`, `aria-current`, `data-selected` and checked-input states; it does not fabricate every game, editor or data-dependent selection. The browser regression separately activates actual tab selections and follows the selected color/theme options.

This is not an exhaustive interaction certification. Other lazily created overlays, author overrides, arbitrary external content, SVG/canvas/image text, native form-control graphics and pseudo-elements require separate inspection. The stress test does not assess clipping, overlap or focus order. WebKit tests the engine; it is not a separate Safari application test.

## Reproduce

Run shared-palette and real-interaction regressions in Chromium, Firefox and WebKit:

```sh
pnpm test:a11y:colors
```

With the component development server running on port 4173:

```sh
TP_AUDIT_INTERACTIONS=1 node scripts/audit-component-theme-colors.mjs
```

Use `TP_AUDIT_URL` for another server, `TP_AUDIT_OUTPUT` for the output JSON file, and `TP_COMPONENTS=drawer,dropdown,color,theme` for a focused run. A measured failure, transition mismatch or incomplete example produces a failing exit status.
