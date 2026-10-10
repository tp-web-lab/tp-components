# <tp-icon name="mastermind" library="components" size="1.25em"></tp-icon> Mastermind

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-mastermind>` element implements the <tp-icon name="mastermind" library="components" size="1.25em"></tp-icon> Mastermind functionality: displays an interactive Mastermind game.

<details class="tp-game-rules">
<summary>Rules of the game</summary>

<p>Find the hidden sequence of colours before using all available attempts. Fill every position of a guess, then submit it. A colour may appear more than once.</p>

<p>An exact match means a correct colour in the correct position. A misplaced match means a correct colour in a different position. Each occurrence is counted at most once; the feedback counts do not identify the corresponding positions.</p>

<p>Use the feedback from earlier guesses to refine the next one. You win when every position is an exact match.</p>

</details>

<tp-mastermind solution="red blue green yellow" attempts="8"></tp-mastermind>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Choose colors for an attempt and check it. |
| Using the component | Exact matches and misplaced colors help you refine the next attempt. |
| Using the component | Use Undo or Redo to revisit changes, assistance for help, and the reset button to start with another code. |
| Color | Selects the color used for the next peg. |
| Play | Submits the current guess. |
| :tp-icon:{name="undo" size="1.25em"} :tp-icon:{name="redo" size="1.25em"} Undo / Redo | Navigates changes made to the current game. |
| :tp-icon:{name="refresh" size="1.25em"} Reset | Starts a game with a newly generated secret code. |
| Reset the game | Restarts while retaining the current secret code. |
| Show next peg | Reveals the next peg of the secret code. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Set `solution` to the secret sequence, with colors separated by spaces or commas. The default palette contains `red`, `blue`, `green`, `yellow`, `orange`, and `purple`.

```html
<tp-mastermind
  solution="red blue green yellow"
  attempts="8"
></tp-mastermind>
```

Use `colors` to customize the available palette. Supported colors are `red`, `blue`, `green`, `yellow`, `orange`, `purple`, `pink`, and `cyan`. A solution can contain between two and eight pegs, and the number of attempts can range from one to twenty.

Select colors to fill the current guess, then choose **Play** on the right of the active row. A filled peg can be replaced by selecting a color and clicking that peg.

The chronometer starts with the first peg and pauses when the code is cracked or the final attempt is used. Its controls are hidden. Undo and redo use icon buttons. The help icon opens an assistance dropdown: **Reset the game** keeps the current secret code, while the visible refresh button resets the game with a newly generated code of the same length.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Propose combinations and use the feedback to find the hidden code.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

mastermind ⭐⭐
: Try the mastermind puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.

mastermind ⭐⭐⭐
: Try the mastermind puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.
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
<!-- tp-docgen:api TpMastermind -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>attempts</code> | <code>number</code> | <code>10</code> | Maximum number of guesses. |
  | <code>colors</code> | <code>string</code> | <code>&quot;red blue green yellow orange purple&quot;</code> | Available colors separated by spaces or commas. |
  | <code>solution</code> | <code>string</code> | <code>&quot;&quot;</code> | Secret color sequence separated by spaces or commas. |
  [Attributes of `<tp-mastermind>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpMastermind`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-mastermind>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-mastermind>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_mastermind.TpMastermind.html)
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
  <script type="module" src="/path/to/components/mastermind/mastermind.js"></script>
  ```

import
: ```js
  import "/path/to/components/mastermind/mastermind.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/mastermind/mastermind.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-mastermind>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-chronometer
@summary Chronometer component with play, pause and stop controls.
-->
<!--
@tp-dependency tp-dropdown
@summary Displays an anchored dropdown menu.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-chronometer>`](../chronometer/index.md) : Chronometer component with play, pause and stop controls.
- [`<tp-dropdown>`](../dropdown/index.md) : Displays an anchored dropdown menu.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
