# <tp-icon name="asciidoc" library="components" size="1.25em"></tp-icon> AsciiDoc

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-asciidoc>` element implements the <tp-icon name="asciidoc" library="components" size="1.25em"></tp-icon> AsciiDoc functionality: semantic AsciiDoc rendering component.

<tp-asciidoc>
  <script type="tp/asciidoc">
== A short document

This paragraph uses *AsciiDoc*.

* Write content
* Add components
* Publish the page
  </script>
</tp-asciidoc>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | Read the displayed content and use its links and embedded controls. |
| Using the component | The component itself adds no editing or playback controls. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

TeX and AsciiMath formulas use MathJax 4 with SVG output, matching the Markdown and reStructuredText components. The component initializes MathJax for dynamically inserted content and reuses an already loaded instance.

#### Initial AsciiDoc content
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

#### Rendering from JavaScript

The module also exports helpers for rendering into an existing element or obtaining HTML directly.

```js
import {
  renderAsciidocInto,
  renderAsciidocToHtml,
} from '@tp/tp-components/components/asciidoc/asciidoc.js';

const html = await renderAsciidocToHtml('Hello, *Asciidoctor*!');
await renderAsciidocInto('== A section', document.querySelector('#output'));
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect how the embedded asciidoc source is rendered as a formatted document.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Advanced example
: Inspect the richer document supplied through the advanced asciidoc source example.
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
<!-- tp-docgen:api TpAsciidoc -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of an external AsciiDoc source file. |
  [Attributes of `<tp-asciidoc>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpAsciidoc`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-asciidoc-rendered</code> | <code>void</code> | Emitted after conversion and runtime initialization complete. |
  [Events emitted by `<tp-asciidoc>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-asciidoc>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_asciidoc.TpAsciidoc.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-asciidoc>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@credit tp-asciidoc https://www.npmjs.com/package/@tp/tp-asciidoc
@summary AsciiDoc parsing and rendering.
-->

- [tp-asciidoc](https://www.npmjs.com/package/@tp/tp-asciidoc) : AsciiDoc parsing and rendering.
<!-- tp-docgen:dependencies:end -->
