<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="box" library="components" size="1.25em"></tp-icon> Box

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-box>` element wraps content in a configurable bordered box.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box>
      The custom HTML element <code>&lt;tp-box&gt;</code> wraps its content in various ways.
    </tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-box" src="/docs/components/box/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

To border a fragment of HTML, simply wrap it in the `<tp-box>` element.

``` html
<p>Here is a paragraph.</p>

<tp-box>
  <p>Here is a paragraph enclosed within the <code>tp-box</code> element.</p>
</tp-box>
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
  <script type="module" src="/path/to/components/box/box.js"></script>
  ```

import
: ```js
  import "/path/to/components/box/box.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/box/box.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect how the box encloses its content with spacing and a border.

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
