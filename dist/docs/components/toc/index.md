<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="toc" library="components" size="1.25em"></tp-icon> Table of contents

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-toc>` element provides a table of contents generated from page headings.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box data-tp-toc-scope="">
  <tp-toc label="On this page" open="" expand-all=""></tp-toc>
  <h2>Getting started</h2>
  <p>Choose a heading in the table of contents to jump to its section.</p>
  <h3>Installation</h3><p>Install the library in your project.</p>
  <h3>First component</h3><p>Add your first interactive component.</p>
</tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-toc" src="/docs/components/toc/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

The custom `<tp-toc>` element generates a table of contents from the headings in the current document and renders its hierarchy with `<tp-tree>`.

Place the component in a document containing headings. It assigns missing heading IDs and updates when the document structure changes.

Use `position` to place it at the start, at the end, or in the center. The `open` attribute opens the panel and `expand-all` expands every nested section.
Use `brand` to apply the soft brand background, contrasting brand text, and brand border colors.

```html
<tp-toc label="On this page" open position="start"></tp-toc>
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
  <script type="module" src="/path/to/components/toc/toc.js"></script>
  ```

import
: ```js
  import "/path/to/components/toc/toc.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/toc/toc.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Select a heading in the table of contents to jump to its section.

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
<!--
@tp-dependency tp-tree
@summary Generic tree component for interactive hierarchical editing.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-tree>`](#/components/tree/index.md) : Generic tree component for interactive hierarchical editing.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
