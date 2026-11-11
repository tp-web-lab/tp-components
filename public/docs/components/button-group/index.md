<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="button-group" library="components" size="1.25em"></tp-icon> Button group

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-button-group>` element groups related buttons with optional attached borders and vertical layout.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-box data-page-navigation="" data-allow-script="">
  <p>Use the grouped buttons to change the current page.</p>
  <tp-button-group attached="" aria-label="Page navigation">
    <tp-button data-previous="" disabled="">Previous</tp-button>
    <tp-button data-next="">Next</tp-button>
  </tp-button-group>
  <p data-page-status="" role="status">Page 1 of 5</p>
  <script src="/docs/components/button-group/examples/page-navigation.js"></script>
</tp-box>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-button-group" src="/docs/components/button-group/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `orientation="vertical"` for a column, `attached` to join adjacent controls, and `stretch` to fill the available width.

```html
<tp-button-group attached>
  <tp-button>Previous</tp-button>
  <tp-button variant="primary">Next</tp-button>
</tp-button-group>
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
  <script type="module" src="/path/to/components/button-group/button-group.js"></script>
  ```

import
: ```js
  import "/path/to/components/button-group/button-group.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/button-group/button-group.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Use Previous and Next to change the displayed page number.

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
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
