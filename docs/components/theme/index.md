# <tp-icon name="theme" library="components" size="1.25em"></tp-icon> Theme

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-theme>` element implements the <tp-icon name="theme" library="components" size="1.25em"></tp-icon> Theme functionality: parent-scoped theme switcher.

<section>
      <tp-theme></tp-theme>
      <p>The selected theme is scoped to this section.</p>
      <code>Inline code follows the selected theme.</code>
    </section>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Theme button | Choose the light or dark appearance of the associated content. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Activate the focused button. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

`<tp-theme>` displays a theme button and applies either `tp-light` or `tp-dark` to its target. In `auto` mode, it follows the system color scheme.

The controller behaves like an icon button. Use `variant`, `size`, and
`disabled` to configure the internal `<tp-icon-button>`:

```html
<tp-theme variant="brand" size="s"></tp-theme>
<tp-theme disabled></tp-theme>
```

Place the component inside the element whose theme should be controlled:

```html
<section>
  <tp-theme></tp-theme>
  <p>This section follows the selected theme.</p>
</section>
```

Use `anchor` to target a specific element:

```html
<article id="preview">
  <p>The selected theme is applied here.</p>
</article>

<tp-theme anchor="#preview"></tp-theme>
```

Use `ui-anchor` when only the dropdown should be positioned elsewhere. The
selected theme is still applied to the `anchor` target when it is provided:

```html
<section>
  <span id="theme-position">Theme menu position</span>
  <tp-callout id="theme-preview">
    The selected theme is applied to this callout.
  </tp-callout>
</section>
<tp-theme ui-anchor="#theme-position" anchor="#theme-preview" style="float: right;"></tp-theme>
```

In this example, `anchor="#theme-preview"` makes the callout receive the
selected theme. `ui-anchor="#theme-position"` positions the dropdown next to
the label. The `style` attribute only moves the theme button itself in the
page layout.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Choose a theme and observe how the content inside its scope changes appearance.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Local theme scope
: Change the theme of the local box without targeting the whole page.

Change event
: Change the theme setting and inspect the emitted tp-theme-change event.
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
<!-- tp-docgen:api TpTheme -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector used as the explicit element that receives the selected theme. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables the theme trigger. |
  | <code>mode</code> | <code>string</code> | <code>&quot;auto&quot;</code> | Theme mode (`light`, `dark`, `auto`) |
  | <code>size</code> | <code>string</code> | <code>&quot;m&quot;</code> | Icon button size. |
  | <code>ui-anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector used only to anchor the dropdown UI. |
  | <code>variant</code> | <code>string</code> | <code>&quot;neutral&quot;</code> | Icon button variant. |
  [Attributes of `<tp-theme>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>syncToMode</code> | <code>syncToMode(mode: TpThemeMode): void</code> | Synchronizes the mode from another controller. |
  [Public methods of `TpTheme`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-theme-change</code> | <code>&#123; mode: &quot;light&quot; \| &quot;dark&quot; \| &quot;auto&quot;; theme: &quot;light&quot; \| &quot;dark&quot;; anchor: string; target: HTMLElement &#125;</code> | Emitted when the effective theme applied to a target changes. |
  [Events emitted by `<tp-theme>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-theme>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_theme.TpTheme.html)
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
  <script type="module" src="/path/to/components/theme/theme.js"></script>
  ```

import
: ```js
  import "/path/to/components/theme/theme.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/theme/theme.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-theme>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->
<!--
@tp-dependency tp-dropdown
@summary Displays an anchored dropdown menu.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-divider>`](../divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dropdown>`](../dropdown/index.md) : Displays an anchored dropdown menu.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
