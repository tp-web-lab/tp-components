# <tp-icon name="cluster" library="components" size="1.25em"></tp-icon> Cluster

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-cluster>` element implements the <tp-icon name="cluster" library="components" size="1.25em"></tp-icon> Cluster functionality: groups child elements in a wrapping flex row with configurable alignment and gap.

<tp-box>
      <tp-cluster justify="center" gap="0.5rem">
        <tp-button>Alpha</tp-button>
        <tp-button>Beta</tp-button>
        <tp-button>Gamma</tp-button>
      </tp-cluster>
    </tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | This component organizes or presents content. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| Embedded controls, when present | Use their normal keyboard interactions. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Place related controls or labels inside `<tp-cluster>`. The children stay in a row while space is available and wrap automatically when the container becomes narrower.

Unlike `tp-grid`, `tp-cluster` uses a wrapping flex row: items normally keep their content-based widths, and each row is laid out independently, without shared column alignment. Use `tp-cluster` for buttons, tags or other differently sized items. Use `tp-grid` for cards or panels that should occupy equal-width columns aligned across rows; its minimum column width determines how many columns fit in the available space.

```html
<tp-cluster justify="center" gap="0.5rem">
  <tp-button>Alpha</tp-button>
  <tp-button>Beta</tp-button>
  <tp-button>Gamma</tp-button>
</tp-cluster>
```

Use `justify` for the main-axis distribution, `align` for cross-axis alignment, and `gap` for the distance between children.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Resize the example to see how the items share a row and wrap when space runs out.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Space between
: Inspect the items placed at opposite ends of the available row.

Wrapping items
: Reduce the available width to see the items wrap onto additional rows.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpCluster -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>align</code> | <code>&quot;normal&quot; \| &quot;stretch&quot; \| &quot;center&quot; \| &quot;start&quot; \| &quot;end&quot; \| &quot;flex-start&quot; \| &quot;flex-end&quot; \| &quot;self-start&quot; \| &quot;self-end&quot; \| &quot;baseline&quot; \| &quot;first baseline&quot; \| &quot;last baseline&quot;</code> | <code>&quot;center&quot;</code> | Cross-axis alignment applied to `align-items`. |
  | <code>gap</code> | <code>string</code> | <code>&quot;1rem&quot;</code> | Gap between clustered items. When absent, uses the --tp-cluster-gap CSS default. |
  | <code>justify</code> | <code>&quot;normal&quot; \| &quot;start&quot; \| &quot;end&quot; \| &quot;flex-start&quot; \| &quot;flex-end&quot; \| &quot;center&quot; \| &quot;left&quot; \| &quot;right&quot; \| &quot;space-between&quot; \| &quot;space-around&quot; \| &quot;space-evenly&quot; \| &quot;stretch&quot;</code> | <code>&quot;flex-start&quot;</code> | Main-axis alignment applied to `justify-content`. |
  [Attributes of `<tp-cluster>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpCluster`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-cluster>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-cluster-gap</code> | <code>1rem</code> | Default gap between clustered items. |
  [CSS properties of `<tp-cluster>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_cluster.TpCluster.html)
<!-- tp-docgen:typedoc:end -->







































































































































































































































































### Imports

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/cluster/cluster.js"></script>
  ```

import
: ```js
  import "/path/to/components/cluster/cluster.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/cluster/cluster.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-cluster>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
