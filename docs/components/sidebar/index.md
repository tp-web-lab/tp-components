# <tp-icon name="sidebar" library="components" size="1.25em"></tp-icon> Sidebar

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-sidebar>` element implements the <tp-icon name="sidebar" library="components" size="1.25em"></tp-icon> Sidebar functionality: creates a two-column sidebar and content layout.

<tp-sidebar side-width="12rem" gap="1rem">
  <tp-box><h3>Navigation</h3><p>Overview</p><p>Examples</p></tp-box>
  <tp-box><h3>Main content</h3><p>The sidebar stays beside this content while there is enough space.</p></tp-box>
</tp-sidebar>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | Read or use the content in the side panel. Any links and controls inside it retain their usual actions. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| Embedded controls, when present | Use their normal keyboard interactions. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-sidebar>` as shown below.

Without `right-sidebar`, place the sidebar first and the main content second. With `right-sidebar`, place the main content first and the sidebar second. The attribute changes which child receives the sidebar sizing; it does not reorder the children. The Attributes example swaps its two panels when you toggle this option, so Navigation remains the sidebar on either side.

```html
<tp-sidebar></tp-sidebar>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Resize the example to observe how the navigation and main content share the available space.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
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
<!-- tp-docgen:api TpSidebar -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>content-width</code> | <code>string</code> | <code>&quot;50%&quot;</code> | Minimum percentage of the container width reserved for the content column. When absent, uses the --tp-sidebar-content-width CSS default. |
  | <code>gap</code> | <code>string</code> | <code>&quot;1rem&quot;</code> | Gap between sidebar and content. When absent, uses --tp-sidebar-gap, with a fallback of 1rem. |
  | <code>right-sidebar</code> | <code>boolean</code> | <code>false</code> | Uses the last child as the sidebar instead of the first child. |
  | <code>side-width</code> | <code>string</code> | <code>&quot;auto&quot;</code> | Preferred sidebar width before flex space is distributed. By default, uses the item's own width or content-based size through --tp-sidebar-side-width. |
  [Attributes of `<tp-sidebar>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpSidebar`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-sidebar>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-sidebar-content-width</code> | <code>50%</code> | Default content column width. |
  | <code>&#45;&#45;tp-sidebar-gap</code> | <code>1rem</code> | Default gap between sidebar and content. |
  | <code>&#45;&#45;tp-sidebar-side-width</code> | <code>auto</code> | Default sidebar column width. |
  [CSS properties of `<tp-sidebar>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_sidebar_sidebar.TpSidebar.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

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
