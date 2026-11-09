<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="asciidoc" library="components" size="1.25em"></tp-icon> AsciiDoc

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-asciidoc>` element renders AsciiDoc documents.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-asciidoc>
  <script type="tp/asciidoc">
== A short document

This paragraph uses *AsciiDoc*.

* Write content
* Add components
* Publish the page
  </script>
</tp-asciidoc>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-asciidoc" src="/docs/components/asciidoc/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-asciidoc></tp-asciidoc>
  ```

  Nothing’s happening.

internal script
: ``` html
  <tp-asciidoc>
    <script type="tp/asciidoc">
      |===
      | Language | Purpose
      | AsciiDoc | Technical writing
      | HTML     | Web documents
      |===
    </script>
  </tp-asciidoc>
  ```

  Place the AsciiDoc source in a `<script type="tp/asciidoc">` child. Keeping the source in a script
  element prevents the browser from interpreting it as HTML before the component is initialized.

external file
: ```html
  <tp-asciidoc src="./example.adoc"></tp-asciidoc>
  ```

  Set `src` to load an external `.adoc` or `.asciidoc` file. Relative URLs are resolved from the
  current documentation source.
:::

### Rendering from JavaScript

The module also exports helpers for rendering into an existing element or obtaining HTML directly.

```js
import {
  renderAsciidocInto,
  renderAsciidocToHtml,
} from '@tp/tp-components/components/asciidoc/asciidoc.js';

const html = await renderAsciidocToHtml('Hello, *Asciidoctor*!');
await renderAsciidocInto('== A section', document.querySelector('#output'));
```

### Authoring

TeX and AsciiMath formulas use MathJax 4 with SVG output, matching the Markdown and reStructuredText components. The component initializes MathJax for dynamically inserted content and reuses an already loaded instance.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/asciidoc/asciidoc.js"></script>
  ```

import
: ```js
  import "/path/to/components/asciidoc/asciidoc.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/asciidoc/asciidoc.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect how the embedded asciidoc source is rendered as a formatted document.

Advanced example
: Inspect the richer document supplied through the advanced asciidoc source example.
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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
