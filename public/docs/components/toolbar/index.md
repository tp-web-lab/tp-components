<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="toolbar" library="components" size="1.25em"></tp-icon> Toolbar

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-toolbar>` element provides a sticky, zoned toolbar for tp-* components.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box padding="0">
<tp-toolbar>
  <tp-icon section="start" name="home" aria-label="Home"></tp-icon>
  <tp-icon section="start" name="menu" aria-label="Menu"></tp-icon>
  <span section="center">Document</span>
  <tp-icon section="end" name="github" aria-label="GitHub"></tp-icon>
  <tp-icon section="end" name="settings" aria-label="Settings"></tp-icon>
  <tp-icon section="end" name="help" aria-label="Help"></tp-icon>
</tp-toolbar>
  <tp-box border-width="0" style="min-block-size: 5rem; display: grid; place-items: center">Document area</tp-box>
</tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-toolbar" src="/docs/components/toolbar/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Assign children with `section="start"`, `section="center"`, or `section="end"`. Use `orientation` and `placement` to control the toolbar edge.

Use `top` or `bottom` with a horizontal toolbar, and `start` or `end` with a vertical toolbar. `placement` sets the sticky edge; the parent layout must place the toolbar on that side of the content. The Attributes example supplies this layout with a grid.

```html
<tp-toolbar style="inline-size: auto; min-inline-size: 0">
  <tp-icon section="start" name="home" aria-label="Home"></tp-icon>
  <tp-icon section="start" name="menu" aria-label="Menu"></tp-icon>
  <span section="center">Document</span>
  <tp-icon section="end" name="github" aria-label="GitHub"></tp-icon>
  <tp-icon section="end" name="settings" aria-label="Settings"></tp-icon>
  <tp-icon section="end" name="help" aria-label="Help"></tp-icon>
</tp-toolbar>
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
  <script type="module" src="/path/to/components/toolbar/toolbar.js"></script>
  ```

import
: ```js
  import "/path/to/components/toolbar/toolbar.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/toolbar/toolbar.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the document toolbar and the placement of its controls.

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
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
