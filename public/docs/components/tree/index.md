<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="tree" library="components" size="1.25em"></tp-icon> Tree

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-tree>` element provides an interactive hierarchical tree.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-tree selectable="" guides="" level="2">
  <ul>
    <li>Project
      <ul>
        <li>Documentation
          <ul><li>Getting started</li><li>Examples</li></ul>
        </li>
        <li>Source code</li>
        <li>README.md</li>
      </ul>
    </li>
  </ul>
</tp-tree>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-tree" src="/docs/components/tree/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Set `draggable` to enable node reordering. The tree creates an internal [`tp-dragdrop`](../dragdrop/index.md) controller automatically; do not add another controller to its nodes. The tree continues to manage hierarchy constraints, node permissions, drop markers, and the `tp-tree-node-move-request` event. This integration does not add keyboard grab/drop interactions.

Use `<tp-tree>` as shown below.

```html
<tp-tree></tp-tree>
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
  <script type="module" src="/path/to/components/tree/tree.js"></script>
  ```

import
: ```js
  import "/path/to/components/tree/tree.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/tree/tree.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Expand and collapse the project folders and navigate the tree entries.

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
@tp-dependency tp-dragdrop
@summary Generic drag-and-drop controller for content.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-dragdrop>`](#/components/dragdrop/index.md) : Generic drag-and-drop controller for content.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
