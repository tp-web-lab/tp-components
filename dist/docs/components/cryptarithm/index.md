# <tp-icon name="cryptarithm" library="components" size="1.25em"></tp-icon> Cryptarithm

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-cryptarithm>` element implements the <tp-icon name="cryptarithm" library="components" size="1.25em"></tp-icon> Cryptarithm functionality: displays an interactive cryptarithm puzzle.

<details class="tp-game-rules">
<summary>Rules of the game</summary>

<p>Replace each letter with a digit from 0 to 9 so that the addition is correct.</p>

<p>The same letter always represents the same digit, and different letters must represent different digits. The first digit of a number cannot be zero.</p>

<p>All assignments must satisfy the equation, including any carries between columns.</p>

</details>

<tp-cryptarithm equation="SEND + MORE = MONEY" solution="9567 + 1085 = 10652"></tp-cryptarithm>

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
| Tab / Shift+Tab | Moves among assignments, assistance options, undo and redo controls. |
| Number keys | Enters a digit in the focused letter assignment. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Set `equation` to an addition written with letters and `solution` to the matching numeric addition. Both attributes must contain the same number of terms, and every word and its numeric value must have the same length.

```html
<tp-cryptarithm
  equation="SEND + MORE = MONEY"
  solution="9567 + 1085 = 10652">
</tp-cryptarithm>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Assign digits to letters so that the displayed arithmetic equation is correct.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

UN + UN + NEUF = ONZE
: Assign digits to letters to solve the equation UN + UN + NEUF = ONZE.

CINQ + CINQ + VINGT = TRENTE
: Assign digits to letters to solve the equation CINQ + CINQ + VINGT = TRENTE.

ZERO + NEUF + NEUF + DOUZE = TRENTE
: Assign digits to letters to solve the equation ZERO + NEUF + NEUF + DOUZE = TRENTE.
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
<!-- tp-docgen:api TpCryptarithm -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>equation</code> | <code>string</code> | <code>&quot;&quot;</code> | Equation to solve. |
  | <code>solution</code> | <code>string</code> | <code>&quot;&quot;</code> | Numeric solution matching the equation. |
  [Attributes of `<tp-cryptarithm>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpCryptarithm`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-cryptarithm>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-cryptarithm>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_cryptarithm.TpCryptarithm.html)
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
  <script type="module" src="/path/to/components/cryptarithm/cryptarithm.js"></script>
  ```

import
: ```js
  import "/path/to/components/cryptarithm/cryptarithm.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/cryptarithm/cryptarithm.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-cryptarithm>` are loaded automatically by this component if they have not already been loaded by another component.

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
