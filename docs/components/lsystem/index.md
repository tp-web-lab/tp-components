# <tp-icon name="lsystem" library="components" size="1.25em"></tp-icon> L-system

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-lsystem>` element renders L-system fractals and explores their successive rewriting iterations.
It reuses the grammar, presets, turtle interpreter and SVG renderer of `@tp/tp-utilities`, also used by the L-system extension of `@tp/tp-markdown`.

<tp-lsystem label="Koch curve">
  <script type="tp/lsystem">
    axiom: F
    iterations: 3
    angle: 60
    rule: F => F+F--F+F
  </script>
</tp-lsystem>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Step | Pause and advance one rewriting iteration. After the final iteration, return to iteration zero. |
| Play / Pause | Play successive iterations or pause on the current one. Starting from the final iteration restarts at zero; playback stops at the final iteration. |
| Reset | Pause and display the axiom at iteration zero. |
| Save image | Choose SVG, PNG or WebP to download the current drawing. |
| Iteration counter | Read the current iteration and the definition's maximum. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between playback and export controls. |
| Enter / Space | Activate the focused button. |
| Escape | Close the image export menu. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

::: tp-tabs
internal script
: ```html
  <tp-lsystem label="Koch curve">
    <script type="tp/lsystem">
      axiom: F
      iterations: 3
      angle: 60
      rule: F => F+F--F+F
    </script>
  </tp-lsystem>
  ```

external file
: ```html
  <tp-lsystem src="tree.lsys" label="Branching tree"></tp-lsystem>
  ```

preset
: ```html
  <tp-lsystem preset="barnsley-fern" label="Barnsley fern"></tp-lsystem>
  ```
:::

A nonempty `src` takes precedence over an internal script. The script uses the inert type `tp/lsystem` (also accepted: `tp/l-system`), so the browser preserves the definition without executing it as JavaScript. If neither source is supplied, `preset` selects a built-in definition, defaulting to `koch-curve`. Relative source URLs follow the containing document. A failed source file reports an error rather than silently switching to a preset.

`iterations`, `angle` and `step` optionally override the definition; leaving them empty retains its values. `interval` is the delay in milliseconds between iterations, not the drawing speed of individual segments. The initial view shows the final iteration, without autoplay; Reset shows the axiom. Attribute changes pause playback and reload the definition. The responsive SVG fits the available width.

### Definition language

| Directive | Meaning | Default when omitted |
| --- | --- | --- |
| `axiom: F` | Initial word; required for textual definitions. | None |
| `iterations: 3` | Number of parallel rewriting steps. | `4` |
| `angle: 60` | Turning angle in degrees. | `90` |
| `step: 10` | Forward distance in drawing units. | `10` |
| `orientation: north` | Initial direction: east, north, west or south. | `east` |
| `draw: F,G` | Symbols that move and draw. | `F,G` |
| `move: M` | Symbols that move without drawing. | `M` |
| `rule: F => F+F--F+F` | Replacement applied in parallel at each iteration; repeat for multiple symbols. | None |
| `seed: 42` | Reproducible seed for weighted rules supported by the engine. | `0` |

`+` and `-` turn the turtle, while `[` saves its position and direction and `]` restores them to create branches. `#` starts a comment. Unknown directives and invalid definitions produce a visible warning. The engine also supports its parametric and weighted rule syntax; no JavaScript script execution is needed.

To keep interactive rendering bounded, the component accepts at most 20,000 source characters, 256 characters per rule replacement, and 12 iterations. The shared engine additionally rejects expansions exceeding 200,000 characters. Complex combinations may reach this limit before iteration 12. Provide a descriptive `label` and nearby explanatory text for meaningful fractals.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the Koch curve produced by an internal definition. Reset to the initial segment, then use Step or Play to observe successive rewriting iterations; save the current drawing with Save image.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Branching tree
: Load a branching tree from a local definition file. Reset, then play its four iterations to observe how saved turtle positions create branches.

Preset gallery
: Compare a fern, a dragon curve and a Sierpinski triangle. Each drawing has independent playback controls and can be exported separately.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

Asciidoc
: ::include{examples/examples.adoc}

Markdown
: ::include{examples/examples.md}

RST
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

Use `step()`, `play()`, `pause()` and `reset()` to control progression. `exportSvg()` returns the current SVG, or an empty string before rendering or after an error. Listen for `tp-lsystem-rendered` to read `detail.iteration` and `detail.iterations`. Source requests and timers are cancelled when the component disconnects; reconnection restores the author definition.

### API

<!-- tp-docgen:api TpLsystem -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>angle</code> | <code>string</code> | <code>&quot;&quot;</code> | Optional turning-angle override in degrees; empty uses the definition. |
  | <code>interval</code> | <code>number</code> | <code>1000</code> | Milliseconds between playback iterations, at least 100. |
  | <code>iterations</code> | <code>string</code> | <code>&quot;&quot;</code> | Optional iteration override from 0 to 12; empty uses the source or preset value. |
  | <code>label</code> | <code>string</code> | <code>&quot;L-system&quot;</code> | Visible caption and accessible SVG name. |
  | <code>preset</code> | <code>&quot;fractal-tree&quot;\|&quot;barnsley-fern&quot;\|&quot;koch-curve&quot;\|&quot;dragon-curve&quot;\|&quot;hilbert-curve&quot;\|&quot;peano-curve&quot;\|&quot;levy-c-curve&quot;\|&quot;gosper-curve&quot;\|&quot;pythagoras-tree&quot;\|&quot;sierpinski-triangle&quot;\|&quot;sierpinski-carpet&quot;\|&quot;sierpinski-arrowhead&quot;\|&quot;sierpinski-gasket&quot;\|&quot;sierpinski-tetrahedron&quot;</code> | <code>&quot;koch-curve&quot;</code> | Built-in definition used when no source is supplied. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Source file; takes precedence over the internal script and preset. |
  | <code>step</code> | <code>string</code> | <code>&quot;&quot;</code> | Optional positive drawing-step override; empty uses the definition. |
  [Attributes of `<tp-lsystem>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>exportSvg</code> | <code>exportSvg(): string</code> | Returns the current standalone SVG for export integrations. |
  | <code>pause</code> | <code>pause(): void</code> | Pauses playback without changing the displayed iteration. |
  | <code>play</code> | <code>play(): void</code> | Starts user-requested playback, stopping at the final iteration without looping. |
  | <code>reset</code> | <code>reset(): void</code> | Pauses and restores iteration zero, the unexpanded axiom. |
  | <code>step</code> | <code>step(): void</code> | Advances one iteration; reaching the limit restarts at the axiom on the next step. |
  [Public methods of `TpLsystem`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-lsystem-rendered</code> | <code>&#123; iteration: number; iterations: number &#125;</code> | Emitted after an iteration has been drawn. |
  [Events emitted by `<tp-lsystem>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-lsystem>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_lsystem.TpLsystem.html)
<!-- tp-docgen:typedoc:end -->




















































































































### Imports

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/lsystem/lsystem.js"></script>
  ```

import
: ```js
  import "/path/to/components/lsystem/lsystem.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/lsystem/lsystem.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-lsystem>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->
<!--
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->
<!--
@tp-dependency tp-save-image
@summary Downloads an anchored image as SVG, PNG or WebP.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-save-image>`](../save-image/index.md) : Downloads an anchored image as SVG, PNG or WebP.

### External

<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
