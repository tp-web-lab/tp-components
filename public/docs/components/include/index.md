<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="include" library="components" size="1.25em"></tp-icon> Include

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-include>` element loads remote HTML content.

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

Use `src` to load an HTML fragment into the current page. The introductory example loads a shared notice from a local file.

```html
<tp-include src="/docs/components/include/examples/welcome.html" loading="Loading the shared notice…"></tp-include>
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
@credit DOMPurify https://github.com/cure53/DOMPurify
@summary HTML sanitization.
-->

- [DOMPurify](https://github.com/cure53/DOMPurify) : HTML sanitization.
<!-- tp-docgen:dependencies:end -->
