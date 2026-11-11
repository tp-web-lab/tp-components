<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="lsystem" library="components" size="1.25em"></tp-icon> L-system

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-lsystem>` element renders L-system fractals and explores their successive rewriting iterations.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-lsystem label="Koch curve">
  <script type="tp/lsystem">
    axiom: F
    iterations: 3
    angle: 60
    rule: F => F+F--F+F
  </script>
</tp-lsystem>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-lsystem" src="/docs/components/lsystem/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-lsystem></tp-lsystem>
  ```

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
  <tp-lsystem src="/docs/components/lsystem/examples/initial-content.txt"></tp-lsystem>
  ```
:::

### Authoring

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

### Programming notes

Use `step()`, `play()`, `pause()` and `reset()` to control progression. `exportSvg()` returns the current SVG, or an empty string before rendering or after an error. Listen for `tp-lsystem-rendered` to read `detail.iteration` and `detail.iterations`. Source requests and timers are cancelled when the component disconnects; reconnection restores the author definition.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the Koch curve produced by an internal definition. Reset to the initial segment, then use Step or Play to observe successive rewriting iterations; save the current drawing with Save image.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Branching tree
: Load a branching tree from a local definition file. Reset, then play its four iterations to observe how saved turtle positions create branches.

Preset gallery
: Compare a fern, a dragon curve and a Sierpinski triangle. Each drawing has independent playback controls and can be exported separately.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-latex
: ::include{examples/examples-latex.html}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](#/components/button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-callout>`](#/components/callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-save-image>`](#/components/save-image/index.md) : Downloads an anchored image as SVG, PNG or WebP.

### External

<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
