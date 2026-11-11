<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="kakuro" library="components" size="1.25em"></tp-icon> Kakuro

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-kakuro>` element displays an interactive Kakuro puzzle.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-kakuro>
  <ol>
    <li><code># 23/0 30/0 # # 27/0 12/0 16/0</code></li>
    <li><code>0/16 . . # 17/24 . . .</code></li>
    <li><code>0/17 . . 15/29 . . . .</code></li>
    <li><code>0/35 . . . . . 12/0 #</code></li>
    <li><code># 0/7 . . 7/8 . . 7/0</code></li>
    <li><code># 11/0 10/16 . . . . .</code></li>
    <li><code>0/21 . . . . 0/5 . .</code></li>
    <li><code>0/6 . . . # 0/3 . .</code></li>
  </ol>
</tp-kakuro>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-kakuro" src="/docs/components/kakuro/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
List
: Provide an ordered or unordered list with one row per item, as in Basic usage.

Attribute
: Set `puzzle` to rows separated by newlines. In an HTML attribute, use `&#10;` for each newline. This attribute takes precedence over the initial list.
:::

### Puzzle notation

Separate cells with whitespace and rows with newlines. All rows must have the same width. Grids can range from 3 × 3 to 30 × 30 cells, including clue cells.

| Token | Meaning |
| --- | --- |
| `#` | Solid blocked cell. |
| `.` | Empty playable cell. |
| `1`–`9` | Fixed visible digit, which the player cannot change. |
| `down/across` | Clue cell: sum below, then sum to the right. Use zero for a missing direction. |

For example, `23/0` gives a downward sum of 23, `0/16` gives an across sum of 16, and `17/24` gives both. The diagonal runs from top left to bottom right; the across sum appears at top right and the down sum at bottom left. The grid keeps this orientation in right-to-left documents.

Each white cell must belong to an across run and a down run. Each run contains 2 to 9 digits, from 1 to 9 without repetition, summing to its clue. Invalid shapes, missing clues, impossible sums and contradictory fixed digits display an error.

### Rules and assistance

Fill every white cell so both crossing sums are correct. Notes are pencil marks and do not count as entered digits. Check highlights all cells in a run whose entered digits cannot be completed to the required sum without repetition; it does not compare the grid against a hidden answer.

Reveal cell fills the selected editable cell, or the first empty cell when none is selected. Reveal solution fills the whole grid. Both compute a valid completion from the original clues and fixed digits, so they can correct mistaken entries. A puzzle is not required to have a unique solution; any completed grid satisfying every clue is accepted, and an assistance action may choose another valid completion. If no solution exists, assistance reports it. A bounded search prevents excessively difficult puzzles from blocking assistance indefinitely; they remain playable manually.

Undo and Redo include notes, reveal actions and Reset. Reset restores the original fixed digits and removes all notes. Changing `puzzle` starts a new game and clears its history. Removing that attribute restores the initial list, if one was supplied.

### JavaScript and events

Assign `element.puzzle` to replace the puzzle. Listen for `tp-kakuro-change` after edits and history actions, and `tp-kakuro-complete` when a move completes the grid. Their `detail` contains `values` (a row-by-row array, with zero for empty and blocked cells) and `complete`. Events bubble; editing the event data does not change the game.

Set `--tp-kakuro-cell-size` to adjust the maximum square width (3rem by default). The grid shrinks to fit its container and the controls wrap. Colors follow the inherited TP brand and theme.

### Example source

The introductory puzzle is transcribed from the grid illustrated in [Wikipedia's Kakuro article](https://fr.wikipedia.org/wiki/Kakuro). The [original diagram](https://commons.wikimedia.org/wiki/File:Kakuro_black_box.svg) and [solution](https://commons.wikimedia.org/wiki/File:Kakuro_black_box_solution.svg) are by Octahedron80, licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). This interactive transcription preserves the clues and changes the presentation. The transcribed example data is distributed under the same license.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/kakuro/kakuro.js"></script>
  ```

import
: ```js
  import "/path/to/components/kakuro/kakuro.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/kakuro/kakuro.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Complete the Wikipedia cross-sum grid with digits from 1 to 9, without repeating a digit within a run. Try Game/Note mode, Check and the reveal actions.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
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
@tp-dependency tp-chronometer
@summary Chronometer component with play, pause and stop controls.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->
<!--
@tp-dependency tp-drawer
@summary Drawer overlay component.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
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
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-chronometer>`](#/components/chronometer/index.md) : Chronometer component with play, pause and stop controls.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-drawer>`](#/components/drawer/index.md) : Drawer overlay component.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.

### External

<!--
@summary No external dependency.
-->
No external dependency

### See also

- [`<tp-crossword>`](#/components/crossword/index.md) : A word-based across and down puzzle.
- [`<tp-sudoku>`](#/components/sudoku/index.md) : Another numeric grid puzzle with pencil marks.
<!-- tp-docgen:dependencies:end -->
