<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="cluster" library="components" size="1.25em"></tp-icon> Cluster

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-cluster>` element arranges content in rows that wrap to fit the available width.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box>
      <tp-cluster justify="center" gap="0.5rem">
        <tp-button>Alpha</tp-button>
        <tp-button>Beta</tp-button>
        <tp-button>Gamma</tp-button>
      </tp-cluster>
    </tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-cluster" src="/docs/components/cluster/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Place related controls or labels inside `<tp-cluster>`. The children stay in a row while space is available and wrap automatically when the container becomes narrower.

Unlike `tp-grid`, `tp-cluster` uses a wrapping flex row: items normally keep their content-based widths, and each row is laid out independently, without shared column alignment. Use `tp-cluster` for buttons, tags or other differently sized items. Use `tp-grid` for cards or panels that should occupy equal-width columns aligned across rows; its minimum column width determines how many columns fit in the available space.

```html
<tp-cluster justify="center" gap="0.5rem">
  <tp-button>Alpha</tp-button>
  <tp-button>Beta</tp-button>
  <tp-button>Gamma</tp-button>
</tp-cluster>
```

Use `justify` for the main-axis distribution, `align` for cross-axis alignment, and `gap` for the distance between children.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/cluster/cluster.js"></script>
  ```

import
: ```js
  import "/path/to/components/cluster/cluster.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/cluster/cluster.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Resize the example to see how the items share a row and wrap when space runs out.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Space between
: Inspect the items placed at opposite ends of the available row.

Wrapping items
: Reduce the available width to see the items wrap onto additional rows.
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
