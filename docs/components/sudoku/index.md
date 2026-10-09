# <tp-icon name="sudoku" library="components" size="1.25em"></tp-icon> Sudoku

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-sudoku>` element implements the <tp-icon name="sudoku" library="components" size="1.25em"></tp-icon> Sudoku functionality: displays an interactive Sudoku puzzle.

<details class="tp-game-rules">
<summary>Rules of the game</summary>

<p>Fill each empty square with a digit from 1 to 9. The given digits are fixed.</p>

<p>Every row, every column and each of the nine 3 × 3 boxes must contain every digit from 1 to 9 exactly once.</p>

<p>Use the intersecting constraints to complete the grid. Pencil marks are reminders of possible values, not final answers.</p>

</details>

<tp-sudoku>
        <ol>
          <li>39465!7!1!8!2</li>
          <li>2!85913!4!67</li>
          <li>6!718!4!2395</li>
          <li>7!2!63!8!95!41!</li>
          <li>4!38!5612!79!</li>
          <li>159!27483!6!</li>
          <li>8674!2!5!913!</li>
          <li>9127!38654!</li>
          <li>54!3!1!9!6728</li>
        </ol>
      </tp-sudoku>

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

Set `puzzle` to nine rows separated by line breaks. Each row must describe nine cells. In HTML attributes, use `&#10;` to preserve each line break.

Digits from `1` to `9` define the solution. Add `!` after a digit to display it as a fixed clue when the game starts; digits without `!` remain hidden and must be found by the player.

```html
<tp-sudoku
  puzzle="39465!7!1!8!2&#10;2!85913!4!67&#10;6!718!4!2395&#10;7!2!63!8!95!41!&#10;4!38!5612!79!&#10;159!27483!6!&#10;8674!2!5!913!&#10;9127!38654!&#10;54!3!1!9!6728"
></tp-sudoku>
```

The same puzzle can also be provided as an ordered or unordered list:

```html
<tp-sudoku>
  <ol>
    <li>39465!7!1!8!2</li>
    <li>2!85913!4!67</li>
    <li>6!718!4!2395</li>
    <li>7!2!63!8!95!41!</li>
    <li>4!38!5612!79!</li>
    <li>159!27483!6!</li>
    <li>8674!2!5!913!</li>
    <li>9127!38654!</li>
    <li>54!3!1!9!6728</li>
  </ol>
</tp-sudoku>
```

Click an editable square, then enter a digit. The controls let you change entry mode, undo or redo moves, and request assistance.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Fill the Sudoku grid while respecting its row, column and region constraints.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

sudoku ⭐⭐
: Try the sudoku puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.

sudoku ⭐⭐⭐
: Try the sudoku puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.
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
<!-- tp-docgen:api TpSudoku -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>puzzle</code> | <code>string</code> | <code>&quot;&quot;</code> | Puzzle rows separated by newlines. |
  [Attributes of `<tp-sudoku>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpSudoku`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-sudoku>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-sudoku>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_sudoku.TpSudoku.html)
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
  <script type="module" src="/path/to/components/sudoku/sudoku.js"></script>
  ```

import
: ```js
  import "/path/to/components/sudoku/sudoku.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/sudoku/sudoku.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-sudoku>` are loaded automatically by this component if they have not already been loaded by another component.

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
