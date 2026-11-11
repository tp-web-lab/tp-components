<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="grid" library="components" size="1.25em"></tp-icon> Grid

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-grid>` element arranges content in a grid that adapts to the available width.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-grid min-width="12rem" gap="1rem">
  <tp-box>First column</tp-box>
  <tp-box>Second column</tp-box>
  <tp-box>Third column</tp-box>
</tp-grid>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-grid" src="/docs/components/grid/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `tp-grid` for a responsive collection of cards or panels with equal-width columns aligned across rows. It creates as many columns as fit, using `min-width` (default `250px`) as the minimum column width and distributing the remaining space equally. Columns can shrink below this minimum when the container itself is narrower. The default `gap` is `1rem`.

Unlike `tp-grid`, `tp-cluster` arranges items in a wrapping flex row: items normally keep their content-based widths, and each row is laid out independently. Use `tp-cluster` for buttons, tags or other differently sized items; use `tp-grid` when consistent columns matter.

```html
<tp-grid></tp-grid>
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
  <script type="module" src="/path/to/components/grid/grid.js"></script>
  ```

import
: ```js
  import "/path/to/components/grid/grid.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/grid/grid.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Resize the example and observe the arrangement of its three columns.

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
