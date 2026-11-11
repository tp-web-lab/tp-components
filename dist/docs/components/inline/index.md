<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="inline" library="components" size="1.25em"></tp-icon> Inline

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-inline>` element arranges content side by side in a single row.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-inline gap="1rem" align="center">
    <tp-button>Previous</tp-button><span>Page 2 of 5</span><tp-button>Next</tp-button>
  </tp-inline>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-inline" src="/docs/components/inline/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `gap`, `justify`, and `align` with CSS values. Add `stretch` when every direct child should share the available width.

```html
<tp-inline gap="1rem" align="center">
  <tp-button>Previous</tp-button><span>Page 2 of 5</span><tp-button>Next</tp-button>
</tp-inline>
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
  <script type="module" src="/path/to/components/inline/inline.js"></script>
  ```

import
: ```js
  import "/path/to/components/inline/inline.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/inline/inline.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the navigation controls and page indicator arranged inline.

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
