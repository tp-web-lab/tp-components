# <tp-icon name="dropdown" library="components" size="1.25em"></tp-icon> Dropdown

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-dropdown>` element implements the <tp-icon name="dropdown" library="components" size="1.25em"></tp-icon> Dropdown functionality: displays an anchored dropdown menu.

<tp-box data-intro-action="dropdown" data-allow-script>
  <tp-button id="intro-dropdown-trigger" data-demo-trigger>Open the menu</tp-button>
  <tp-dropdown anchor="#intro-dropdown-trigger" outside-click><ul><li><a href="/#/components/button/index.md">Buttons</a></li><li><a href="/#/components/tree/index.md">Trees</a></li></ul></tp-dropdown>
  <p data-demo-status role="status">Try the dropdown using its trigger.</p>
  <script src="/tp-components/docs/components/_shared/introduction-actions.js"></script>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Activate the trigger to open the dropdown, then choose an item. |
| Using the component | Close the dropdown to leave without selecting an action. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| ArrowDown / ArrowUp | Moves focus between menu items. |
| ArrowRight / ArrowLeft | Opens or closes a submenu and moves focus appropriately. |
| Home / End | Moves focus to the first or last item. |
| Enter / Space | Activates an item or toggles its submenu. |
| Escape | Closes the menu. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-dropdown>` as shown below.

```html
<tp-dropdown></tp-dropdown>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open the dropdown and choose one of its documentation links.

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
<!-- tp-docgen:api TpDropdown -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector of the anchor element. |
  | <code>offset</code> | <code>string</code> | <code>&quot;8px&quot;</code> | Distance between the anchor and the dropdown. |
  | <code>open</code> | <code>boolean</code> | <code>false</code> | Opens the dropdown. |
  | <code>outside-click</code> | <code>boolean</code> | <code>false</code> | Closes the dropdown when the user clicks outside it. |
  | <code>placement</code> | <code>TpDropdownPlacement</code> | <code>&quot;bottom&quot;</code> | Dropdown placement relative to the anchor. |
  [Attributes of `<tp-dropdown>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>closeAll</code> | <code>closeAll(): void</code> | Closes all submenus. |
  | <code>show</code> | <code>show(): void</code> | Show. |
  | <code>toggle</code> | <code>toggle(): void</code> | Toggles the dropdown. |
  [Public methods of `TpDropdown`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-dropdown-toggle</code> | <code>&#123; backdrop: boolean; open: boolean; outsideClick: boolean; anchor: string; placement: &quot;top&quot; \| &quot;end&quot; \| &quot;bottom&quot; \| &quot;start&quot; &#125;</code> | Emitted when the dropdown open state changes. |
  [Events emitted by `<tp-dropdown>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-dropdown-gap</code> | <code>0.125rem</code> | Gap between menu items. |
  | <code>&#45;&#45;tp-dropdown-padding</code> | <code>0.25rem</code> | Padding around menus. |
  [CSS properties of `<tp-dropdown>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_dropdown.TpDropdown.html)
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
  <script type="module" src="/path/to/components/dropdown/dropdown.js"></script>
  ```

import
: ```js
  import "/path/to/components/dropdown/dropdown.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/dropdown/dropdown.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-dropdown>` are loaded automatically by this component if they have not already been loaded by another component.

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
