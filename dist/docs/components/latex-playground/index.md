<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="latex-playground" library="components" size="1.25em"></tp-icon> LaTeX playground

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-latex-playground>` element edits and previews LaTeX projects.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-latex-playground><script type="tp/latex">\section{Hello}A formula $x^2$.</script></tp-latex-playground>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-latex-playground" src="/docs/components/latex-playground/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::::: tp-tabs
Inline source
: Put literal LaTeX in a child `script[type="tp/latex"]` to preserve backslashes.

External file
: Set `src` to a `.tex` or `.latex` document. A JSON project or a repository directory can also provide files and an entry point.
:::::

Each `.tex` file can be selected as the entry document. Inline scripts may use `filename` to provide several documents; the first is the initial entry. File imports, project loading, reset, editor controls and console use the shared playground infrastructure.

LaTeX renders as HTML with MathJax formulas, interactive components and TikZ figures. This uses the packages and commands supported by `@tp/tp-latex`; it does not run a general-purpose PDF compiler. Use `\input{sections/introduction}` to assemble project files into one document. Paths are relative to the entry document directory, and the `.tex` extension may be omitted. Nested inputs are supported; missing files and circular inputs are reported in the console. Inputs use only files already loaded in the project. Filenames must be literal; macro-generated paths and `\include` are not supported. Commands inside comments, verbatim regions, `\wcScript` and `\rawhtml` remain literal.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/latex-playground/latex-playground.js"></script>
  ```

import
: ```js
  import "/path/to/components/latex-playground/latex-playground.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/latex-playground/latex-playground.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit main.tex, then run the project to update the heading and MathJax formula. Reset restores the original source.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

A document in sections
: Edit the introduction, calculation or conclusion file, then run main.tex to assemble the document with input commands.

A document with a TikZ figure
: Edit the explanation and the separate TikZ figure, then run main.tex to render both in one document.
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
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->
<!--
@tp-dependency tp-console
@summary Displays structured console output.
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
@tp-dependency tp-filesystem
@summary In-memory file system component.
-->
<!--
@tp-dependency tp-html-viewer
@summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
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
@tp-dependency tp-iframe
@summary Controlled iframe component.
-->
<!--
@tp-dependency tp-menu
@summary Accessible menu component.
-->
<!--
@tp-dependency tp-splitter
@summary Splitter component with two resizable panels.
-->
<!--
@tp-dependency tp-switcher
@summary Switches between horizontal and vertical layouts based on available space.
-->
<!--
@tp-dependency tp-tabs
@summary Accessible tabs component with keyboard and reorder support.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-code-editor>`](#/components/code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-console>`](#/components/console/index.md) : Displays structured console output.
- [`<tp-drawer>`](#/components/drawer/index.md) : Drawer overlay component.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-filesystem>`](#/components/filesystem/index.md) : In-memory file system component.
- [`<tp-html-viewer>`](#/components/html-viewer/index.md) : Interactive HTML viewer with editable source, live rendering, and DOM inspection.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-iframe>`](#/components/iframe/index.md) : Controlled iframe component.
- [`<tp-menu>`](#/components/menu/index.md) : Accessible menu component.
- [`<tp-splitter>`](#/components/splitter/index.md) : Splitter component with two resizable panels.
- [`<tp-switcher>`](#/components/switcher/index.md) : Switches between horizontal and vertical layouts based on available space.
- [`<tp-tabs>`](#/components/tabs/index.md) : Accessible tabs component with keyboard and reorder support.
- [`<tp-toolbar>`](#/components/toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@credit es-module-lexer https://github.com/guybedford/es-module-lexer
@summary ECMAScript module import analysis.
-->
<!--
@credit Lit https://lit.dev/
@summary Web-component examples and import maps.
-->
<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->
<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [es-module-lexer](https://github.com/guybedford/es-module-lexer) : ECMAScript module import analysis.
- [Lit](https://lit.dev/) : Web-component examples and import maps.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
- [Zod](https://zod.dev/) : Runtime schema validation.

### See also

- [`<tp-latex>`](#/components/latex/index.md) : Render LaTeX directly in a page.
- [`<tp-latex-viewer>`](#/components/latex-viewer/index.md) : Present editable examples with rendered and generated HTML views.
<!-- tp-docgen:dependencies:end -->
