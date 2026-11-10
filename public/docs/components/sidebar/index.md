<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="sidebar" library="components" size="1.25em"></tp-icon> Sidebar

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-sidebar>` element creates a two-column sidebar and content layout.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-sidebar side-width="12rem" gap="1rem">
  <tp-box><h3>Navigation</h3><p>Overview</p><p>Examples</p></tp-box>
  <tp-box><h3>Main content</h3><p>The sidebar stays beside this content while there is enough space.</p></tp-box>
</tp-sidebar>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-sidebar" src="/docs/components/sidebar/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-sidebar>` as shown below.

Without `right-sidebar`, place the sidebar first and the main content second. With `right-sidebar`, place the main content first and the sidebar second. The attribute changes which child receives the sidebar sizing; it does not reorder the children. The Attributes example swaps its two panels when you toggle this option, so Navigation remains the sidebar on either side.

```html
<tp-sidebar></tp-sidebar>
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
  <script type="module" src="/path/to/components/sidebar/sidebar.js"></script>
  ```

import
: ```js
  import "/path/to/components/sidebar/sidebar.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/sidebar/sidebar.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Resize the example to observe how the navigation and main content share the available space.

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
@summary This component has no tp-components dependencies.
-->
No internal dependency

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
