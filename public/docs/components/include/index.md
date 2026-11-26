<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="include" library="components" size="1.25em"></tp-icon> Include

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-include>` element loads remote markup content and displays it as HTML.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-include src="/docs/components/include/examples/welcome.html" loading="Loading the shared notice…"></tp-include>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-include" src="/docs/components/include/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `src` to load a markup document into the current page. The introductory example loads a shared notice from a local file.

```html
<tp-include src="/docs/components/include/examples/welcome.html" loading="Loading the shared notice…"></tp-include>
```

### Automatic markup conversion

In the default `mode="auto"`, the file extension selects the source language: `.md`/`.markdown`, `.adoc`/`.asciidoc`, `.tex`/`.latex`, or `.rst`. The included content is converted to HTML before insertion, using the shared `convert` API. HTML files and URLs with other or no extensions retain the existing HTML inclusion behavior.

```html
<tp-include src="shared/notice.md"></tp-include>
<tp-include src="shared/notice.adoc"></tp-include>
<tp-include src="shared/notice.tex"></tp-include>
<tp-include src="shared/notice.rst"></tp-include>
```

Simple nested document inclusions are resolved relative to their source files and converted by extension. Missing files and circular inclusions use the normal fallback and `tp-include-error` event. Conversion finishes before `tp-include-load` fires; an obsolete response cannot replace a more recently requested document.

`mode="raw"` skips markup conversion. The existing `sanitize`, `allow-scripts` and `allow-styles` controls also apply to converted HTML.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/include/include.js"></script>
  ```

import
: ```js
  import "/path/to/components/include/include.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/include/include.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the content inserted from the external source file.

Raw HTML
: Display the original HTML notice without interpreting its tags and compare it with Basic usage.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Converted Markdown
: Load a Markdown notice and display its heading, emphasis and list as HTML.

Raw Markdown
: Load the same Markdown notice in raw mode to inspect its original syntax without conversion.

Converted AsciiDoc
: Load an AsciiDoc notice and display its heading, emphasis and list as HTML.

Raw AsciiDoc
: Display the original AsciiDoc notice without conversion and compare it with Converted AsciiDoc.

Converted LaTeX
: Load a LaTeX notice and display its heading, emphasis and itemize list as HTML.

Raw LaTeX
: Display the original LaTeX notice without conversion and compare it with Converted LaTeX.

Converted reStructuredText
: Load a reStructuredText notice and display its heading, emphasis and bullet list as HTML.

Raw reStructuredText
: Display the original reStructuredText notice without conversion and compare it with Converted reStructuredText.
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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@credit DOMPurify https://github.com/cure53/DOMPurify
@summary HTML sanitization.
-->

- [DOMPurify](https://github.com/cure53/DOMPurify) : HTML sanitization.
<!-- tp-docgen:dependencies:end -->
