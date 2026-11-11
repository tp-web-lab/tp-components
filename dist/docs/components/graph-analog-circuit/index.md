<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="graph-analog-circuit" library="components" size="1.25em"></tp-icon> Analog circuits

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-graph-analog-circuit>` element provides an interactive analog-circuit editor and transient simulator.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-graph-analog-circuit grid="" grid-size="20" message="Run the transient analysis and inspect Vin and Vout." src="/docs/components/graph-analog-circuit/examples/rc-filter.json"></tp-graph-analog-circuit>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-graph-analog-circuit" src="/docs/components/graph-analog-circuit/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-graph-analog-circuit>` as shown below.

```html
<tp-graph-analog-circuit grid grid-size="20" message="Run the transient analysis and inspect Vin and Vout." src="/docs/components/graph-analog-circuit/examples/rc-filter.json"></tp-graph-analog-circuit>
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
  <script type="module" src="/path/to/components/graph-analog-circuit/graph-analog-circuit.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-analog-circuit/graph-analog-circuit.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-analog-circuit/graph-analog-circuit.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied analog circuit and try the simulator’s available controls.

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
@tp-dependency tp-graph-editor
@summary Extensible interactive graph editor.
-->
<!--
@tp-dependency tp-markdown
@summary Markdown rendering component.
-->

- [`<tp-graph-editor>`](#/components/graph-editor/index.md) : Extensible interactive graph editor.
- [`<tp-markdown>`](#/components/markdown/index.md) : Markdown rendering component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
