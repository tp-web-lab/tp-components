<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="turtle" library="components" size="1.25em"></tp-icon> Turtle

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-turtle>` element provides a turtle DSL rendering component.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-turtle width="420" height="220" label="A square">
    <script type="tp/turtle">
      turtle x=0 y=0 heading=0 speed=6
      forward 80
      right 90
      forward 80
      right 90
      forward 80
      right 90
      forward 80
    </script>
  </tp-turtle>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-turtle" src="/docs/components/turtle/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-turtle></tp-turtle>
  ```

internal script
: ```html
  <tp-turtle width="420" height="220" label="A square">
    <script type="tp/turtle">
      turtle x=0 y=0 heading=0 speed=6
      forward 80
      right 90
      forward 80
    </script>
  </tp-turtle>
  ```

external file
: ```html
  <tp-turtle src="./drawing.turtle"></tp-turtle>
  ```
:::

### Authoring

Write the drawing program in `<script type="tp/turtle">` or load it with `src`. The generated SVG can be replayed and downloaded.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/turtle/turtle.js"></script>
  ```

import
: ```js
  import "/path/to/components/turtle/turtle.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/turtle/turtle.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the drawing produced by the supplied turtle instructions.

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
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
