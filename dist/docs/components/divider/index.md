<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="divider" library="components" size="1.25em"></tp-icon> Divider

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-divider>` element provides a visual separator.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box>
      <p>Primary content group.</p>
      <tp-divider></tp-divider>
      <p>Secondary content group.</p>
    </tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-divider" src="/docs/components/divider/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

<p>Below the divider.</p>
</tp-box>

`<tp-divider>` draws a horizontal or vertical line. It is useful in menus,
dropdowns, toolbars, and compact layouts where a real separator is preferable
to an empty list item or decorative text.

Use the default horizontal divider between blocks:

```html
<p>First group</p>
<tp-divider></tp-divider>
<p>Second group</p>
```

Use `orientation="vertical"` between inline controls:

```html
<tp-toolbar>
  <tp-icon-button name="copy" label="Copy"></tp-icon-button>
  <tp-divider orientation="vertical"></tp-divider>
  <tp-icon-button name="paste" label="Paste"></tp-icon-button>
</tp-toolbar>
```

The divider exposes CSS properties for its color, thickness, and margins.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/divider/divider.js"></script>
  ```

import
: ```js
  import "/path/to/components/divider/divider.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/divider/divider.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the horizontal separation between two content groups.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Custom style
: Inspect a divider with customized visual styling.

Dropdown menu
: Open the dropdown to inspect the divider separating menu actions.
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
