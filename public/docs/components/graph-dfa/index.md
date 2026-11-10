<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="graph-dfa" library="components" size="1.25em"></tp-icon> Deterministic finite automaton

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-graph-dfa>` element edits and simulates deterministic finite automata.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-graph-dfa id="dfa-starts-with-ab" grid="" grid-size="20" src="/docs/components/graph-dfa/examples/starts-with-ab.json"></tp-graph-dfa>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-graph-dfa" src="/docs/components/graph-dfa/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-graph-dfa>` as shown below.

```html
<tp-graph-dfa id="dfa-starts-with-ab" grid grid-size="20" src="/docs/components/graph-dfa/examples/starts-with-ab.json"></tp-graph-dfa>
```

Programmatically, `run()` consumes the complete remaining input.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/graph-dfa/graph-dfa.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-dfa/graph-dfa.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-dfa/graph-dfa.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied deterministic finite automaton and try the simulator’s available controls.

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

- [`<tp-graph-editor>`](#/components/graph-editor/index.md) : Extensible interactive graph editor.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
