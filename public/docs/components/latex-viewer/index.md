<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="latex-viewer" library="components" size="1.25em"></tp-icon> LaTeX viewer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-latex-viewer>` element presents editable LaTeX examples with rendered and generated HTML views.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-latex-viewer><script type="tp/latex">\section{Hello}A formula $x^2$.</script></tp-latex-viewer>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-latex-viewer" src="/docs/components/latex-viewer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::::: tp-tabs
Inline source
: Put literal LaTeX in a child `script[type="tp/latex"]` to preserve backslashes.

External file
: Set `src` to a `.tex` or `.latex` document.
:::::

Separate selectable examples with a comment line `% !tp-example Example title`. Each document is converted independently. The source editor, rendered output and generated HTML use the shared markup viewer controls.

LaTeX renders as HTML with MathJax formulas, interactive components and TikZ figures. This uses the packages and commands supported by `@tp/tp-latex`; it does not run a general-purpose PDF compiler. Project files are independent documents: automatic `\input` and `\include` resolution is not implemented.

Use `allow-script` for authored examples that contain executable JavaScript. The generated HTML is loaded in the preview iframe, preserving scripts from both `\wcScript` and `\rawhtml`.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/latex-viewer/latex-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/latex-viewer/latex-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/latex-viewer/latex-viewer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Show the source, edit the section or formula and run it. Switch to Generated HTML to inspect the conversion.

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
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
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
@tp-dependency tp-switcher
@summary Switches between horizontal and vertical layouts based on available space.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-html-viewer>`](#/components/html-viewer/index.md) : Interactive HTML viewer with editable source, live rendering, and DOM inspection.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-switcher>`](#/components/switcher/index.md) : Switches between horizontal and vertical layouts based on available space.

### External

<!--
@credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
@summary LaTeX.js conversion and patched TikZJax assets.
-->

- [tp-latex](https://www.npmjs.com/package/@tp/tp-latex) : LaTeX.js conversion and patched TikZJax assets.

### See also

- [`<tp-latex>`](#/components/latex/index.md) : Render LaTeX directly in a page.
- [`<tp-latex-playground>`](#/components/latex-playground/index.md) : Edit file-based LaTeX projects with a console.
<!-- tp-docgen:dependencies:end -->
