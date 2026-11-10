<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="graph-geometric-optics" library="components" size="1.25em"></tp-icon> Geometric optics

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-graph-geometric-optics>` element edits and simulates a paraxial geometric-optics bench.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-graph-geometric-optics id="optics-example" grid="" grid-size="20" message="Move the lens or screen and inspect the paraxial analysis." src="/docs/components/graph-geometric-optics/examples/converging-lens.json"></tp-graph-geometric-optics>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-graph-geometric-optics" src="/docs/components/graph-geometric-optics/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-graph-geometric-optics>` as shown below.

```html
<tp-graph-geometric-optics id="optics-example" grid grid-size="20" message="Move the lens or screen and inspect the paraxial analysis." src="/docs/components/graph-geometric-optics/examples/converging-lens.json"></tp-graph-geometric-optics>
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
  <script type="module" src="/path/to/components/graph-geometric-optics/graph-geometric-optics.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-geometric-optics/graph-geometric-optics.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-geometric-optics/graph-geometric-optics.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied optical system and try the simulator’s available controls.

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
