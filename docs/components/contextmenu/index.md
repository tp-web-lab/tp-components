# <tp-icon name="contextmenu" library="components" size="1.25em"></tp-icon> Contextmenu

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-contextmenu>` element implements the <tp-icon name="contextmenu" library="components" size="1.25em"></tp-icon> Contextmenu functionality: affiche un menu contextuel accessible et réutilisable.

<tp-box data-intro-action="contextmenu" data-allow-script>
  <tp-button id="intro-contextmenu-trigger" data-demo-trigger>Right-click this button</tp-button>
  <tp-contextmenu anchor="#intro-contextmenu-trigger" outside-click><ul><li><a href="/#/components/button/index.md">Buttons</a></li><li><a href="/#/components/tree/index.md">Trees</a></li></ul></tp-contextmenu>
  <p data-demo-status role="status">Try the contextmenu using its trigger.</p>
  <script src="/tp-components/docs/components/_shared/introduction-actions.js"></script>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Open the context menu on its associated area, then choose an available action. |
| Using the component | Dismiss the menu to return to the content without choosing an action. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-contextmenu>` as shown below.

```html
<tp-contextmenu></tp-contextmenu>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open the context menu from its trigger and select a documentation link.

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
<!-- tp-docgen:api TpContextmenu -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | Sélecteur CSS de l’élément servant d’ancrage au clic droit. |
  | <code>open</code> | <code>boolean</code> | <code>false</code> | Ouvre ou ferme le menu. |
  [Attributes of `<tp-contextmenu>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>closeAll</code> | <code>closeAll(): void</code> | Réinitialise l’état d’ouverture des sous-menus. |
  | <code>hide</code> | <code>hide(): void</code> | Ferme explicitement le menu. |
  | <code>showAt</code> | <code>showAt(x: number, y: number): void</code> | Ouvre explicitement le menu à l’écran. |
  [Public methods of `TpContextmenu`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-contextmenu-select</code> | <code>&#123; action: string; item: HTMLLIElement; label: string &#125;</code> | Émis quand un item terminal portant `data-action` est sélectionné. |
  [Events emitted by `<tp-contextmenu>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-contextmenu-background</code> | <code>Canvas</code> | Background color of the menu and submenus. |
  | <code>&#45;&#45;tp-contextmenu-border-color</code> | <code>color-mix(in srgb, currentColor 18%, transparent)</code> | Border color of the menu and dividers. |
  | <code>&#45;&#45;tp-contextmenu-foreground</code> | <code>CanvasText</code> | Text color of the menu. |
  | <code>&#45;&#45;tp-contextmenu-hover</code> | <code>color-mix(in srgb, currentColor 10%, transparent)</code> | Hover background color for menu items. |
  | <code>&#45;&#45;tp-contextmenu-item-padding-block</code> | <code>0.5rem</code> | Block padding for menu items. |
  | <code>&#45;&#45;tp-contextmenu-item-padding-inline</code> | <code>0.75rem</code> | Inline padding for menu items. |
  | <code>&#45;&#45;tp-contextmenu-min-inline-size</code> | <code>12rem</code> | Minimum inline size of menus. |
  | <code>&#45;&#45;tp-contextmenu-padding</code> | <code>0.25rem</code> | Padding around menus. |
  | <code>&#45;&#45;tp-contextmenu-radius</code> | <code>0.5rem</code> | Menu and submenu border radius. |
  | <code>&#45;&#45;tp-contextmenu-shadow-1</code> | <code>color-mix(in srgb, black 18%, transparent)</code> | Primary menu shadow color. |
  | <code>&#45;&#45;tp-contextmenu-shadow-2</code> | <code>color-mix(in srgb, black 10%, transparent)</code> | Secondary menu shadow color. |
  | <code>&#45;&#45;tp-contextmenu-submenu-offset</code> | <code>calc(100% - 0.25rem)</code> | Inline offset used to position submenus. |
  | <code>&#45;&#45;tp-contextmenu-z-index</code> | <code>1000</code> | Stacking level of the context menu. |
  [CSS properties of `<tp-contextmenu>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_contextmenu.TpContextmenu.html)
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
  <script type="module" src="/path/to/components/contextmenu/contextmenu.js"></script>
  ```

import
: ```js
  import "/path/to/components/contextmenu/contextmenu.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/contextmenu/contextmenu.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-contextmenu>` are loaded automatically by this component if they have not already been loaded by another component.

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
