<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="splitter" library="components" size="1.25em"></tp-icon> Splitter

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-splitter>` element divides content into two resizable panels.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-splitter position="40%">
  <dl>
    <dt>start</dt><dd><tp-box>Drag the divider to resize this panel.</tp-box></dd>
    <dt>end</dt><dd><tp-box>This panel uses the remaining space.</tp-box></dd>
  </dl>
</tp-splitter>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-splitter" src="/docs/components/splitter/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Declare two panels in a definition list, labelled `start` and `end`. Use `axis="horizontal"` for side-by-side panels (the default), or `axis="vertical"` for stacked panels. Give vertical splitters a height so the divider has room to move. A panel can contain another splitter with its own axis and position.

`storage-key` is the name of an entry in the browser's `localStorage`, not a file path. When set, it saves the position after resizing and restores it when the component is loaded again, including after a page reload. Its default is the empty string (`""`): nothing is saved or restored, so the empty field in Attributes is intentional. Use a distinct key for each independent splitter, such as `workspace-main-split`; reusing a key makes splitters read the same saved position. A saved position takes precedence over the declared `position`. If browser storage is unavailable, resizing still works without persistence.

```html
<tp-splitter position="40%" storage-key="workspace-main-split">
  <dl>
    <dt>start</dt><dd><tp-box>Navigation</tp-box></dd>
    <dt>end</dt><dd><tp-box>Content</tp-box></dd>
  </dl>
</tp-splitter>
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
  <script type="module" src="/path/to/components/splitter/splitter.js"></script>
  ```

import
: ```js
  import "/path/to/components/splitter/splitter.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/splitter/splitter.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Drag the divider to resize the two adjacent panels.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Nested splitters
: Resize the side-by-side panels, then resize the vertically stacked panels inside the right-hand panel. Each divider works independently, with both pointer and keyboard controls.
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
