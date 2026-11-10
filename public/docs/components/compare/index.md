<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="compare" library="components" size="1.25em"></tp-icon> Compare

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-compare>` element compares two views of content with an adjustable dividing line.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-compare position="50%" before-label="Before" after-label="After" style="height: 12rem;">
  <tp-box slot="before" style="height: 100%; background: var(--tp-neutral-100);">Before: the original design</tp-box>
  <tp-box slot="after" style="height: 100%; background: var(--tp-brand-100);">After: the updated design</tp-box>
</tp-compare>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-compare" src="/docs/components/compare/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Provide two overlapping children marked with `slot="before"` and `slot="after"`. The handle updates the percentage in `position`.

```html
<tp-compare position="50%" before-label="Before" after-label="After" style="height: 12rem">
  <div slot="before" style="width:100%;height:100%;background:#88b1a1"></div>
  <div slot="after" style="width:100%;height:100%;background:#e08d79"></div>
</tp-compare>
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
  <script type="module" src="/path/to/components/compare/compare.js"></script>
  ```

import
: ```js
  import "/path/to/components/compare/compare.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/compare/compare.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Move the comparison handle to reveal more of the before or after content.

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
