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

The chronometer starts with the first peg and pauses when the code is cracked or the final attempt is used. Its controls are hidden. Undo and redo use icon buttons. The help icon opens an assistance dropdown: **Reset the game** keeps the current secret code, while the visible refresh button resets the game with a newly generated code of the same length.

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
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-chronometer>`](#/components/chronometer/index.md) : Chronometer component with play, pause and stop controls.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
