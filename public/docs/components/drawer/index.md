# <tp-icon name="drawer" library="components" size="1.25em"></tp-icon> Drawer

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-drawer>` element implements the <tp-icon name="drawer" library="components" size="1.25em"></tp-icon> Drawer functionality: displays a sliding drawer panel.

<tp-box data-intro-action="drawer" data-allow-script>
  <tp-button id="intro-drawer-trigger" data-demo-trigger>Open the drawer</tp-button>
  <tp-drawer label="Example drawer" backdrop outside-click><p>This panel contains additional information.</p><tp-button data-demo-close>Close</tp-button></tp-drawer>
  <p data-demo-status role="status">Try the drawer using its trigger.</p>
  <script src="/docs/components/_shared/introduction-actions.js"></script>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Open trigger | Open the drawer. |
| Close | Close the drawer. |
| Expand / Collapse | Switch between expanded and normal presentation. |
| Free edge of a left or right drawer | Drag to resize its width within the available space. |
| Outside the drawer | Close it only when outside-click dismissal is enabled. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Activate the focused button. |
| Escape | Close the drawer at any time. |
| ArrowLeft / ArrowRight | Moves the focused resize edge by 10 pixels; hold Shift for 50 pixels. |
| Home / End | Sets the focused resize edge to the minimum or maximum drawer width. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-drawer>` as shown below.

```html
<tp-drawer></tp-drawer>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open the drawer from its trigger, then close the additional-information panel.

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
<!-- tp-docgen:api TpDrawer -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>backdrop</code> | <code>boolean</code> | <code>false</code> | Displays a backdrop behind the drawer. |
  | <code>contained</code> | <code>boolean</code> | <code>false</code> | Keeps the drawer and backdrop inside the parent element. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Text displayed in the drawer header. |
  | <code>open</code> | <code>boolean</code> | <code>false</code> | Opens the drawer. |
  | <code>outside-click</code> | <code>boolean</code> | <code>false</code> | Closes the drawer when the user clicks outside it. |
  | <code>placement</code> | <code>TpDrawerPlacement</code> | <code>&quot;end&quot;</code> | Edge from which the drawer appears. |
  | <code>width</code> | <code>string</code> | <code>&quot;min(24rem, 100vw)&quot;</code> | Drawer width when opened from the start or end edge. When absent, uses the --tp-drawer-size CSS default. |
  [Attributes of `<tp-drawer>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>setContent</code> | <code>setContent(content: string \| Node \| readonly Node[]): void</code> | Replaces the drawer body content. |
  [Public methods of `TpDrawer`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-drawer-toggle</code> | <code>&#123; backdrop: boolean; open: boolean; outsideClick: boolean; contained: boolean; placement: &quot;top&quot; \| &quot;end&quot; \| &quot;bottom&quot; \| &quot;start&quot; &#125;</code> | Emitted when the drawer open state changes. |
  [Events emitted by `<tp-drawer>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-drawer-duration</code> | <code>200ms</code> | Drawer transition duration. |
  | <code>&#45;&#45;tp-drawer-size</code> | <code>min(24rem, 100vw)</code> | Drawer size on the sliding axis. |
  [CSS properties of `<tp-drawer>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_drawer.TpDrawer.html)
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
  <script type="module" src="/path/to/components/drawer/drawer.js"></script>
  ```

import
: ```js
  import "/path/to/components/drawer/drawer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/drawer/drawer.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-drawer>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-divider>`](../divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
