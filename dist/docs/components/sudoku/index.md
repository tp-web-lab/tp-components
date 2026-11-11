<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="sudoku" library="components" size="1.25em"></tp-icon> Sudoku

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-sudoku>` element displays an interactive Sudoku puzzle.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
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
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-sudoku" src="/docs/components/sudoku/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

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

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Fill the Sudoku grid while respecting its row, column and region constraints.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

sudoku ⭐⭐
: Try the sudoku puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.

sudoku ⭐⭐⭐
: Try the sudoku puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> HTML
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_latex" library="languages" size="1.25em"></tp-icon> tp-latex
: ::include{examples/examples-latex.html}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
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
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
