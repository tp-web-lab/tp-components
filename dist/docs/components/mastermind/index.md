<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="mastermind" library="components" size="1.25em"></tp-icon> Mastermind

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-mastermind>` element displays an interactive Mastermind game.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-mastermind solution="red blue green yellow" attempts="8"></tp-mastermind>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-mastermind" src="/docs/components/mastermind/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Set `solution` to the secret sequence, with colors separated by spaces or commas. The default palette contains `red`, `blue`, `green`, `yellow`, `orange`, and `purple`.

```html
<tp-mastermind
  solution="red blue green yellow"
  attempts="8"
></tp-mastermind>
```

Use `colors` to customize the available palette. Supported colors are `red`, `blue`, `green`, `yellow`, `orange`, `purple`, `pink`, and `cyan`. A solution can contain between two and eight pegs, and the number of attempts can range from one to twenty.

Select colors to fill the current guess, then choose **Play** on the right of the active row. A filled peg can be replaced by selecting a color and clicking that peg.

The chronometer starts with the first peg and pauses when the code is cracked or the final attempt is used. Its controls are hidden. Undo and redo use icon buttons. Reset keeps the current secret code. The Help dropdown offers **Show next peg**, **Show the solution**, and **Start with another code**, which generates a new code of the same length.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Propose combinations and use the feedback to find the hidden code.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

mastermind ⭐⭐
: Try the mastermind puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.

mastermind ⭐⭐⭐
: Try the mastermind puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.
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
<!-- tp-docgen:dependencies:end -->
