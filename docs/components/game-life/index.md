# <tp-icon name="game-life" library="components" size="1.25em"></tp-icon> Game of Life

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-game-life>` element implements the <tp-icon name="game-life" library="components" size="1.25em"></tp-icon> Game of Life functionality: conway's Game of Life component.

<details class="tp-game-rules">
<summary>Rules of the game</summary>

<p>This is a cellular simulation rather than a competitive game. Choose an initial pattern of living cells, then advance through generations.</p>

<p>Each cell has up to eight neighbours, including diagonals. A living cell survives with two or three living neighbours and dies otherwise. A dead cell becomes alive with exactly three living neighbours.</p>

<p>All cells change simultaneously using the previous generation. Outside the board, cells are treated as dead; when wrapping is enabled, opposite edges are connected. Observe whether the pattern disappears, stabilizes, oscillates or keeps evolving.</p>

</details>

<tp-game-life preset="glider" label="Glider" cell-size="14"></tp-game-life>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Toggle cells to prepare a pattern. |
| Using the component | Step advances one generation; Play starts continuous evolution and changes to Pause. |
| Using the component | Reset restores the starting state. |
| Play / Pause | Starts or pauses the simulation. |
| Step | Advances the simulation by one generation. |
| Reset | Restores the initial pattern. |
| Download | Saves the current pattern as a file. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Start with `glider`, `blinker`, `toad`, `beacon`, or `gosper-gun`, or provide a program in `<script type="tp/game-life">`.

```html
<tp-game-life preset="glider" label="Glider" cell-size="14"></tp-game-life>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the cellular simulation and observe how the initial pattern evolves.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpGameLife -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>alive-color</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the alive color. |
  | <code>autoplay</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the autoplay. |
  | <code>background</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the background. |
  | <code>cell-radius</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the cell radius. |
  | <code>cell-size</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the cell size. |
  | <code>dead-color</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the dead color. |
  | <code>grid-color</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the grid color. |
  | <code>grid-stroke-width</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the grid stroke width. |
  | <code>interval</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the interval. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the label. |
  | <code>padding</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the padding. |
  | <code>preset</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the preset. |
  | <code>preset-height</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the preset height. |
  | <code>preset-width</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the preset width. |
  | <code>preset-x</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the preset x. |
  | <code>preset-y</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the preset y. |
  | <code>steps</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the steps. |
  | <code>wrap</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the wrap. |
  [Attributes of `<tp-game-life>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpGameLife`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-game-life>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-game-life>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_game-life.TpGameLife.html)
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
  <script type="module" src="/path/to/components/game-life/game-life.js"></script>
  ```

import
: ```js
  import "/path/to/components/game-life/game-life.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/game-life/game-life.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-game-life>` are loaded automatically by this component if they have not already been loaded by another component.

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

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.

### External

<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
