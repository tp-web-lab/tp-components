<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="diff-code-editor" library="components" size="1.25em"></tp-icon> Diff code editor

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-diff-code-editor>` element compares and edits two source documents side by side.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-diff-code-editor>
  <dl>
    <dt>left</dt>
    <dd><script type="tp/javascript" filename="before.js">
const message = "Hello";
const count = 3;
const prefix = "Greeting:";
console.log(prefix, message, count);
console.log("Done");
    </script></dd>
    <dt>right</dt>
    <dd><script type="tp/javascript" filename="after.js">
const message = "Hello world";
const count = 3;
const prefix = "Greeting:";
console.log(prefix, message);
console.log("Done");
    </script></dd>
  </dl>
</tp-diff-code-editor>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-diff-code-editor" src="/docs/components/diff-code-editor/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

```
<!-- tp-docgen:introduction:end -->

### Height and shared scrolling

Set `style="--tp-diff-max-height:65vh"` on the component to limit the comparison viewport. Both sources share its vertical scrollbar, so corresponding lines remain aligned, including around additions and deletions. The common comparison toolbar stays above the viewport. Without this CSS property, the editor grows with its content.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/diff-code-editor/diff-code-editor.js"></script>
  ```

import
: ```js
  import "/path/to/components/diff-code-editor/diff-code-editor.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/diff-code-editor/diff-code-editor.js";
  ```
:::

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/diff-code-editor/diff-code-editor.js"></script>
  ```

import
: ```js
  import "/path/to/components/diff-code-editor/diff-code-editor.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/diff-code-editor/diff-code-editor.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Compare two JavaScript versions, edit either side and apply a selected difference in either direction.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Read-only files
: Compare two JavaScript files without editing them; navigate differences and save either source.

Wrapped Markdown
: Compare Markdown sources with wrapped lines, heading colors and list markers.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
:tp-icon:{name="file_type_html" library="languages" size="1.25em" aria-hidden="true"} HTML
: ::include{examples/examples.html}

:tp-icon:{name="file_type_asciidoc" library="languages" size="1.25em" aria-hidden="true"} tp-asciidoc
: ::include{examples/examples.adoc}

:tp-icon:{name="file_type_latex" library="languages" size="1.25em" aria-hidden="true"} tp-latex
: ::include{examples/examples-latex.html}

:tp-icon:{name="file_type_markdown" library="languages" size="1.25em" aria-hidden="true"} tp-markdown
: ::include{examples/examples.md}

:tp-icon:{name="file_type_restructuredtext" library="languages" size="1.25em" aria-hidden="true"} tp-restructuredtext
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
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
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
- [`<tp-code-editor>`](#/components/code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.

### External

<!--
@credit CodeMirror https://codemirror.net/
@summary Code editing and language support.
-->
<!--
@credit Lezer https://lezer.codemirror.net/
@summary Syntax tree highlighting.
-->

- [CodeMirror](https://codemirror.net/) : Code editing and language support.
- [Lezer](https://lezer.codemirror.net/) : Syntax tree highlighting.

### See also

- [`<tp-code-editor>`](#/components/code-editor/index.md) : Edits a single source document.
<!-- tp-docgen:dependencies:end -->
