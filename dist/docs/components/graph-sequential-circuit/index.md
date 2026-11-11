<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="graph-sequential-circuit" library="components" size="1.25em"></tp-icon> Sequential logical circuit

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-graph-sequential-circuit>` element edits and simulates synchronous sequential logic circuits.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-graph-sequential-circuit id="sequential-counter" grid="" grid-size="20" message="Hubs distribute CLK, Q0, and Q1 along separate orthogonal lanes." src="/docs/components/graph-sequential-circuit/examples/two-bit-counter.json"></tp-graph-sequential-circuit>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-graph-sequential-circuit" src="/docs/components/graph-sequential-circuit/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-graph-sequential-circuit>` as shown below.

```html
<tp-graph-sequential-circuit id="sequential-counter" grid grid-size="20" message="Hubs distribute CLK, Q0, and Q1 along separate orthogonal lanes." src="/docs/components/graph-sequential-circuit/examples/two-bit-counter.json"></tp-graph-sequential-circuit>
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
  <script type="module" src="/path/to/components/graph-sequential-circuit/graph-sequential-circuit.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-sequential-circuit/graph-sequential-circuit.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-sequential-circuit/graph-sequential-circuit.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied sequential logic circuit and try the simulator’s available controls.

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
@tp-dependency tp-graph-logical-circuit
@summary Interactive combinational logic circuit editor and simulator.
-->

- [`<tp-graph-logical-circuit>`](#/components/graph-logical-circuit/index.md) : Interactive combinational logic circuit editor and simulator.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
