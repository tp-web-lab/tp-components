# <tp-icon name="loto" library="components" size="1.25em"></tp-icon> Loto

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-loto>` element implements the <tp-icon name="loto" library="components" size="1.25em"></tp-icon> Loto functionality: displays a playable French loto game.

<details class="tp-game-rules">
<summary>Rules of the game</summary>

<p>Numbers from 1 to 90 are drawn at random without replacement. Each ticket contains 15 numbers arranged in three rows; blank spaces are not numbers to collect.</p>

<p>Follow the draws and the matching numbers highlighted on the tickets. A row is filled when all of its numbers have been drawn; a ticket is filled when all 15 have been drawn.</p>

<p>In this component, the game ends when every number on every displayed ticket has been drawn. Reset generates new tickets and a new draw order.</p>

</details>

<tp-loto></tp-loto>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Draw numbers using the game control and compare them with the tickets. |
| Using the component | The history shows numbers already drawn; the reset button starts a new game. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Add an empty `<tp-loto>` element for one ticket, which is the default. The ticket and the order of the 90-number draw are generated automatically.

```html
<tp-loto></tp-loto>
```

Set `cards` to an integer from 1 to 4 to display several independently generated tickets.

```html
<tp-loto cards="4"></tp-loto>
```

The chronometer starts with the first draw and pauses when the ticket is complete. Its controls are hidden. The refresh button resets the chronometer and generates both a new ticket and a new draw.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the generated loto ticket and its arrangement of numbers.

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
<!-- tp-docgen:api TpLoto -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>cards</code> | <code>number</code> | <code>1</code> | Number of loto tickets displayed, from 1 to 4. |
  [Attributes of `<tp-loto>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>draw</code> | <code>draw(): number \| null</code> | Draws and returns the next number, or null when the game is over. |
  | <code>reset</code> | <code>reset(): void</code> | Generates a new ticket and resets the draw and chronometer. |
  [Public methods of `TpLoto`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-loto-draw</code> | <code>&#123; number: number &#125;</code> | Emitted after a number is drawn. |
  | <code>tp-loto-reset</code> | <code>void</code> | Emitted after a new ticket and draw are generated. |
  | <code>tp-loto-win</code> | <code>void</code> | Emitted when every displayed ticket number has been drawn. |
  [Events emitted by `<tp-loto>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-game-cell-size</code> | <code>3.25rem</code> | Size of a ticket cell. |
  [CSS properties of `<tp-loto>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_loto.TpLoto.html)
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
  <script type="module" src="/path/to/components/loto/loto.js"></script>
  ```

import
: ```js
  import "/path/to/components/loto/loto.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/loto/loto.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-loto>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-chronometer
@summary Chronometer component with play, pause and stop controls.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-switcher
@summary Switches between horizontal and vertical layouts based on available space.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-chronometer>`](../chronometer/index.md) : Chronometer component with play, pause and stop controls.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-switcher>`](../switcher/index.md) : Switches between horizontal and vertical layouts based on available space.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
