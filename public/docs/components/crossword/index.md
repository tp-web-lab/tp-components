# <tp-icon name="crossword" library="components" size="1.25em"></tp-icon> Crossword

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-crossword>` element implements the <tp-icon name="crossword" library="components" size="1.25em"></tp-icon> Crossword functionality: displays an interactive crossword puzzle.

<details class="tp-game-rules">
<summary>Rules of the game</summary>

<p>Fill the white squares with letters to answer the Across and Down clues. Each square holds one letter; black squares separate entries.</p>

<p>Across answers read from left to right and Down answers from top to bottom. At each intersection, both answers must use the same letter.</p>

<p>The puzzle is complete when every answer matches its clue and all letters match the supplied solution.</p>

</details>

<tp-crossword>
  <dl>
    <dt>solution</dt><dd><ol><li>BALL</li><li>AREA</li><li>LEAD</li><li>LADY</li></ol></dd>
    <dt>across</dt><dd><ol><li>A. A round toy used in many sports</li><li>B. The size of a surface</li><li>C. A heavy metal</li><li>D. A polite word for a woman</li></ol></dd>
    <dt>down</dt><dd><ol><li>1. A round toy used in many sports</li><li>2. The size of a surface</li><li>3. A heavy metal</li><li>4. A polite word for a woman</li></ol></dd>
  </dl>
</tp-crossword>

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

Use `<tp-crossword>` as shown below.

```html
<tp-crossword>
<dl>
<dt>solution</dt>
<dd>
<ol>
<li>CHAT</li>
<li>HIER</li>
<li>AIRE</li>
<li>TRES</li>
</ol>
</dd>
<dt>across</dt>
<dd>
<ol>
<li>A. Félin domestique</li>
<li>B. Le jour précédent</li>
<li>C. Surface</li>
<li>D. Beaucoup</li>
</ol>
</dd>
<dt>down</dt>
<dd>
<ol>
<li>1. Félin domestique</li>
<li>2. Le jour précédent</li>
<li>3. Purifie</li>
<li>4. Beaucoup</li>
</ol>
</dd>
</dl>
</tp-crossword>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Use the across and down clues to complete the crossword grid.

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
<!-- tp-docgen:api TpCrossword -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>data-crossword-puzzle</code> | <code>string</code> | <code>&quot;&quot;</code> | Crossword puzzle definition. |
  | <code>data-crossword-silent</code> | <code>string</code> | <code>false</code> | Enables silent mode when set to `true`. |
  | <code>silent</code> | <code>boolean</code> | <code>false</code> | Enables silent mode. |
  [Attributes of `<tp-crossword>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpCrossword`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-crossword>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-crossword>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_crossword.TpCrossword.html)
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
  <script type="module" src="/path/to/components/crossword/crossword.js"></script>
  ```

import
: ```js
  import "/path/to/components/crossword/crossword.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/crossword/crossword.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-crossword>` are loaded automatically by this component if they have not already been loaded by another component.

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
