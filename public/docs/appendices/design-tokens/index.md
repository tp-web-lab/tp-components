# Design tokens

<tp-toc position="end" expand-all open brand></tp-toc>

Design tokens are the shared visual contract of `tp-components`. They keep components consistent, make light and dark themes predictable, and centralize accessibility-sensitive decisions such as text contrast and focus visibility. The source of truth is `src/components/base/tp-tokens.css`.

## Principles

Components should consume tokens by semantic role, not copy literal values or use an arbitrary palette step. A component that needs text on a soft brand surface should therefore combine `--tp-brand-fill-soft` with `--tp-brand-text-on-soft`, rather than choosing two unrelated colors.

The retained principles are:

- use shared tokens before introducing a component-specific value;
- expose a component token when consumers need controlled customization, and make it fall back to a shared semantic token;
- use `rem` or `em` for typography and dimensions that must scale with text;
- preserve the visible focus-ring contract;
- treat foreground and background colors as tested pairs;
- use `tp-light` and `tp-dark` for nested theme scopes;
- never assume that a seed or palette color is readable as text;
- validate any customized palette with `pnpm test:a11y:colors` and the composed components with `pnpm test:a11y`.

## Typography and spacing

| Token | Retained value | Purpose |
| --- | --- | --- |
| `--tp-font-family` | `system-ui, sans-serif` | Interface and body text |
| `--tp-font-family-heading` | `var(--tp-font-family)` | Headings |
| `--tp-font-family-code` | `SFMono-Regular, Consolas, Menlo, Monaco, liberation mono, Courier New, monospace` | Code and fixed-width content |
| `--tp-font-size` | `16px` | Root component text size |
| `--tp-font-weight-normal` | `400` | Regular text |
| `--tp-font-weight-semibold` | `500` | Intermediate emphasis |
| `--tp-font-weight-bold` | `700` | Strong emphasis and headings |
| `--tp-line-height` | `1.6` | Default readable line height |
| `--tp-content-spacing` | `1.75rem` | Vertical rhythm between content blocks |

Components may define local spacing tokens, but their defaults should be derived from this scale or expressed in relative units.

## Borders and shapes

| Token | Retained value |
| --- | --- |
| `--tp-border-style` | `solid` |
| `--tp-border-width` | `1px` |
| `--tp-border-radius-xs` | `0.1875rem` (3px) |
| `--tp-border-radius-sm` | `0.25rem` (4px) |
| `--tp-border-radius-md` | `0.375rem` (6px) |
| `--tp-border-radius-lg` | `0.5625rem` (9px) |
| `--tp-border-radius-xl` | `0.75rem` (12px) |
| `--tp-border-radius-pill` | `9999px` |
| `--tp-border-radius-circle` | `50%` |

## Focus

The common focus indicator is a `3px` ring with a `1px` offset:

| Token | Retained value |
| --- | --- |
| `--tp-focus-width` | `3px` |
| `--tp-focus-offset` | `1px` |
| `--tp-focus-color` | `var(--tp-brand-fill-mid)` |
| `--tp-focus-ring` | `var(--tp-border-style) var(--tp-focus-width) var(--tp-focus-color)` |

A component may adapt the ring color to its surface, but removing the outline without an equally visible replacement is not allowed.

## Form controls

| Size | Minimum height | Font size |
| --- | ---: | ---: |
| `xs` | `1.75rem` | `0.75rem` |
| `sm` | `2.25rem` | `0.875rem` |
| `md` | `2.75rem` | `1rem` |
| `lg` | `3.25rem` | `1.25rem` |
| `xl` | `3.75rem` | `1.5rem` |

The required-field marker is `*`. Placeholder text uses `--tp-text-muted` without additional opacity so that its contrast remains measurable and predictable.

## Color foundations

Six seed tokens generate the default color families:

| Family | Seed token | Default |
| --- | --- | --- |
| Brand | `--tp-brand-seed` | `#88B1A1` |
| Neutral | `--tp-neutral-seed` | `#918c87` |
| Success | `--tp-success-seed` | `#5dbb55` |
| Danger | `--tp-danger-seed` | `#ef5655` |
| Warning | `--tp-warning-seed` | `#e89a26` |
| Information | `--tp-info-seed` | `#4a97f4` |

Each family provides steps `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, and `950`. Step `500` is the seed. Lighter steps mix the seed with white and darker steps mix it with black in OKLab. These scale tokens are palette construction material; component text should normally use semantic tokens instead.

### Built-in brand color classes

The built-in `tp-*` color classes replace `--tp-brand-seed` in their scope and regenerate the complete `--tp-brand-50` to `--tp-brand-950` scale and its semantic brand tokens. They are thematic brand alternatives: `tp-red`, for example, does not replace the functional `danger` family, and `tp-green` does not replace `success`.

| Class | Brand seed | Description |
| --- | --- | --- |
| `tp-default` | `#88B1A1` | Default muted blue-green brand |
| `tp-red` | `#ef5655` | Red |
| `tp-orange` | `#f08039` | Orange |
| `tp-amber` | `#e89a26` | Amber |
| `tp-yellow` | `#dcb31e` | Yellow |
| `tp-lime` | `#9abb28` | Lime |
| `tp-green` | `#5dbb55` | Green |
| `tp-emerald` | `#47b873` | Emerald |
| `tp-teal` | `#37b995` | Teal |
| `tp-glaz` | `#88B1A1` | Glaz, a well-established traditional color term in Brittany, France, covering blue-green and sometimes gray nuances; identical to the default seed |
| `tp-cyan` | `#20b8bc` | Cyan |
| `tp-sky` | `#1caedd` | Sky blue |
| `tp-blue` | `#4a97f4` | Blue |
| `tp-indigo` | `#6e85f8` | Indigo |
| `tp-violet` | `#927cfb` | Violet |
| `tp-purple` | `#ae75f6` | Purple |
| `tp-fuchsia` | `#d26ae8` | Fuchsia |
| `tp-pink` | `#e468b0` | Pink |
| `tp-rose` | `#ee6383` | Rose |
| `tp-zinc` | `#8b8c93` | Cool neutral gray |
| `tp-ivory` | `#fffff0` | Ivory |
| `tp-stone` | `#918c87` | Warm neutral gray; identical to the default neutral seed |

Apply a class to the smallest container that should receive the alternative brand:

```html
<section class="tp-blue">
  <tp-button variant="brand">Blue brand action</tp-button>
</section>
```

The classes can be nested inside `tp-light` or `tp-dark`; their semantic brand tokens are recalculated for the active mode. Components must still use tokens such as `--tp-brand-fill-soft` and `--tp-brand-text-on-soft`, not the seed itself. A custom seed is possible, but it is not automatically guaranteed to meet the library contrast contract and must be validated with the accessibility commands.

`Glaz` is not an invented library name: it is a well-defined traditional color term in Brittany, France. Its meaning spans colors perceived around blue and green and, depending on the context, gray. The retained `#88B1A1` seed represents the muted blue-green interpretation used as the default identity of `tp-components`.

## Semantic colors

### Applying a palette color to text

Every palette above also has a `tp-COLOR-style` class, including `tp-default-style` and `tp-glaz-style`. It applies the corresponding palette and `color: var(--tp-brand-text-colorful)` together. Unlike `tp-COLOR`, which only defines the palette, this shortcut directly colors text without an inline style. It reuses the existing light/dark semantic tokens rather than the raw seed; choose an appropriate background and do not use color as the only way to convey meaning.

```html
<span class="tp-red-style">What is a derivative?</span>
```

With the native inline syntax of `@tp/tp-markdown`:

```markdown
:span:What is a derivative?{.tp-red-style}
```

### Semantic roles

Every color family exposes the same roles:

| Role | Intended use |
| --- | --- |
| `fill-softer` | Very subtle background |
| `fill-soft` | Soft background paired with `text-on-soft` |
| `fill-mid` | Strong intermediate fill and focus/accent use |
| `fill-loud` | High-emphasis background paired with `text-on-loud` |
| `fill-louder` | Strongest family surface |
| `text-on-soft` | Text on `fill-soft` or `fill-softer` surfaces |
| `text-on-mid` | Text on `fill-mid` where that pair is explicitly contracted |
| `text-on-loud` | Text on `fill-loud` surfaces |
| `text-colorful` | Family-colored text on the page or paper surface |
| `stroke-softer`, `stroke-soft`, `stroke-mid` | Borders, separators, icons, and graphical details |

Light themes use dark text on pale soft surfaces and white text on loud surfaces. Dark themes reverse that relationship: soft surfaces are dark with pale text, while loud surfaces are pale with black text. Buttons deliberately use the guaranteed `fill-loud` / `text-on-loud` pair. Inline `code`, `samp`, and `tt` inherit their contextual foreground so they remain readable inside callouts, cards, buttons, and inverted surfaces.

## Page and theme tokens

| Role | `tp-light` | `tp-dark` |
| --- | --- | --- |
| `--tp-background-color` | `white` | `--tp-neutral-950` |
| `--tp-paper-color` | `white` | neutral 950 mixed with 2.5% white |
| `--tp-text-body` | `--tp-neutral-900` | `--tp-neutral-200` |
| `--tp-text-muted` | `--tp-neutral-600` | `--tp-neutral-500` |
| `--tp-selection-background-color` | `--tp-brand-300` | `--tp-brand-700` |
| `--tp-backdrop-color` | black at 25% | black at 50% |

The theme classes can be placed on a subtree. Components must inherit the nearest theme rather than assuming that the complete document uses one mode.

## Syntax colors

CodeMirror and Highlight.js share the `--tp-syntax-*` family. It defines the editor surface, foreground, muted text, caret, selection, active line, gutters, folding indicator, and semantic colors for keywords, strings, numbers, comments, variables, properties, types, functions, and links.

The light palette uses sufficiently dark family steps on the pale syntax surface. The dark palette uses lighter mixed colors on the dark syntax surface. Placeholders use the editor foreground at full opacity. This palette is tested both directly and inside composed editor states such as active lines.

## Contrast contract

The machine-readable contract is `config/accessibility-color-contract.json`. It enumerates semantic foreground/background pairs and their required ratios. The automated test renders each pair in `tp-light` and `tp-dark`, reads the browser-computed colors, and delegates the assessment to axe-core on Chromium, Firefox, and WebKit.

The retained WCAG 2.2 thresholds are:

- `4.5:1` for ordinary text;
- `3:1` for large text;
- `3:1` for essential graphical objects and user-interface boundaries.

Arbitrary preview swatches in the color and icon inspectors choose whichever of black or white provides the higher contrast. Other components do not silently rewrite author colors at runtime: a failing shared pair must be corrected at token level and visually reviewed.

See the [transversal accessibility report](../accessibility/index.md) for the current browser matrix and the meaning of automated and incomplete checks.

## Extending the system

Before adding a new shared token, verify that an existing semantic role cannot express the same decision. A new color surface intended to carry text must be introduced together with its foreground token and added to `config/accessibility-color-contract.json`. A future component is expected to document its public component tokens, reuse these shared defaults, and pass both accessibility commands.
