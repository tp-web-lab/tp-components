<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="iframe" library="components" size="1.25em"></tp-icon> Iframe

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-iframe>` element embeds a web page or HTML content within the current page.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-iframe src="/docs/components/iframe/examples/welcome.html" title="A document inside an iframe" style="height: 12rem;"></tp-iframe>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-iframe" src="/docs/components/iframe/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `src` for a remote document or `srcdoc` for inline HTML. `interaction`, `sandbox`, `referrerpolicy`, and `fullscreen` control browser capabilities.

Unlike `tp-frame`, which sizes and clips children within the current document to a fixed aspect ratio, `tp-iframe` embeds a separate HTML document with its own browsing context. Choose `tp-iframe` for an embedded page or HTML document; choose `tp-frame` to control the proportions of existing content, such as an image or video. A fixed aspect ratio does not itself provide document isolation.

```html
<tp-iframe
  srcdoc="<h1>Hello</h1><p>This document is rendered inside tp-iframe.</p>"
  zoom="1"
  loading="lazy">
</tp-iframe>
```

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/iframe/iframe.js"></script>
  ```

import
: ```js
  import "/path/to/components/iframe/iframe.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/iframe/iframe.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the external page displayed inside the embedded frame.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
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
