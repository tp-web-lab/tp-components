# <tp-icon name="binary" library="components" size="1.25em"></tp-icon> Binary

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-binary>` element implements the <tp-icon name="binary" library="components" size="1.25em"></tp-icon> Binary functionality: displays an interactive Binary puzzle.

<details class="tp-game-rules">
<summary>Rules of the game</summary>

<p>Fill every empty cell with 0 or 1. The starting clues cannot be changed.</p>

<p>Each row and each column must contain equally many zeros and ones. Three identical digits must never be adjacent horizontally or vertically.</p>

<p>No two completed rows may be identical, and no two completed columns may be identical. Complete the grid using these constraints; the component checks entries against the supplied solution.</p>

</details>

<tp-binary>
        <ol>
          <li>1010110!0</li>
          <li>01!01!0011!</li>
          <li>0010101!1!</li>
          <li>11!01!0100</li>
          <li>10011001!</li>
          <li>0!110!1010</li>
          <li>0110!0!101</li>
          <li>10!0101!10</li>
        </ol>
      </tp-binary>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Complete the puzzle using the editable cells; fixed clues cannot be changed. |
| Using the component | Use the displayed assistance controls to check or reveal information when available. |
| Using the component | The puzzle's messages indicate progress and completion. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Set `puzzle` to an even number of rows separated by line breaks. The number of rows and columns must be identical. In HTML attributes, use `&#10;` to preserve each line break.

Digits `0` and `1` define the solution. Add `!` after a digit to display it as a fixed clue when the game starts; digits without `!` remain hidden and must be found by the player.

```html
<tp-binary
  puzzle="1010110!0&#10;01!01!0011!&#10;0010101!1!&#10;11!01!0100&#10;10011001!&#10;0!110!1010&#10;0110!0!101&#10;10!0101!10"
></tp-binary>
```

The same puzzle can also be provided as an ordered or unordered list:

```html
<tp-binary>
  <ol>
    <li>1010110!0</li>
    <li>01!01!0011!</li>
    <li>0010101!1!</li>
    <li>11!01!0100</li>
    <li>10011001!</li>
    <li>0!110!1010</li>
    <li>0110!0!101</li>
    <li>10!0101!10</li>
  </ol>
</tp-binary>
```

Click an editable square, then enter `0` or `1`. The controls let you undo or redo moves and request assistance.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Complete the binary grid while respecting its row and column constraints.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

binary ⭐⭐
: Try the binary puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.

binary ⭐⭐⭐
: Try the binary puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.
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
<!-- tp-docgen:api TpBinary -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>puzzle</code> | <code>string</code> | <code>&quot;&quot;</code> | Puzzle rows separated by newlines. |
  [Attributes of `<tp-binary>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpBinary`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-binary>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-binary>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_binary.TpBinary.html)
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
  <script type="module" src="/path/to/components/binary/binary.js"></script>
  ```

import
: ```js
  import "/path/to/components/binary/binary.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/binary/binary.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-binary>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
