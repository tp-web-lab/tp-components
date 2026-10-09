# <tp-icon name="menu" library="components" size="1.25em"></tp-icon> Menu

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-menu>` element implements the <tp-icon name="menu" library="components" size="1.25em"></tp-icon> Menu functionality: turns a nested list into a keyboard-accessible menu.

<tp-menu>
  <ul>
    <li><a href="/#/components/button/index.md">Buttons</a></li>
    <li><a href="/#/components/tabs/index.md">Tabs</a></li>
    <li><a href="/#/components/tree/index.md">Trees</a></li>
  </ul>
</tp-menu>
<script src="/docs/components/menu/examples/navigation.js"></script>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Open a menu branch to reveal its entries, then choose an available action or link. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-menu>` as shown below.

```html
<tp-menu></tp-menu>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Select a documentation entry from the menu.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Nested submenus
: Open Components, Layout and Rows to explore three submenu levels with the mouse or arrow keys. Arrow Left returns to the parent menu, and selecting a link opens its documentation page.
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
<!-- tp-docgen:api TpMenu -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>orientation</code> | <code>string</code> | <code>&quot;vertical&quot;</code> | Root menu orientation (`horizontal` or `vertical`). |
  [Attributes of `<tp-menu>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>closeAll</code> | <code>closeAll(): void</code> | Closes all expanded submenu items. |
  | <code>refresh</code> | <code>refresh(): void</code> | Refreshes the menu structure after content changes. |
  [Public methods of `TpMenu`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-menu-item-select</code> | <code>&#123; item: HTMLLIElement &#125;</code> | Emitted when a menu item without submenu is selected. |
  [Events emitted by `<tp-menu>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-menu-gap</code> | <code>0.25rem</code> | Gap between root menu items. |
  [CSS properties of `<tp-menu>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_menu_menu.TpMenu.html)
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
  <script type="module" src="/path/to/components/menu/menu.js"></script>
  ```

import
: ```js
  import "/path/to/components/menu/menu.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/menu/menu.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-menu>` are loaded automatically by this component if they have not already been loaded by another component.

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
