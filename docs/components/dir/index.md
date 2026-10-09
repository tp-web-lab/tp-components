# <tp-icon name="dir" library="components" size="1.25em"></tp-icon> Direction switcher

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-dir>` element implements the <tp-icon name="dir" library="components" size="1.25em"></tp-icon> Direction switcher functionality: parent-scoped reading-direction switcher.

<p>The reading direction of this section can be changed.</p>
<p>اس حصے کی پڑھنے کی سمت تبدیل کی جا سکتی ہے۔</p>
<tp-box>
  <tp-dir></tp-dir>
  <p>Use the direction button to switch this paragraph between left-to-right and right-to-left layout.</p>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Activate the direction button to change the reading direction of the associated content. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

`<tp-dir>` displays a direction button and applies `dir="ltr"` or `dir="rtl"` to its target. In `auto` mode, it follows the document direction resolved from the root `<html>` `dir` and `lang` attributes. RTL detection supports language tags such as `ar` or `he`, and documentation region codes used as folders or flag codes, such as `ma`.

The controller behaves like an icon button. Use `variant`, `size`, and
`disabled` to configure the internal `<tp-icon-button>`:

```html
<tp-dir variant="brand" size="s"></tp-dir>
<tp-dir disabled></tp-dir>
```

Place the component inside the element whose reading direction should be controlled:

```html
<section>
  <tp-dir></tp-dir>
  <p>The reading direction of this section can be changed.</p>
</section>
```

Use `anchor` to target a specific element:

```html
<article id="direction-preview">
  <p>The selected direction is applied here.</p>
</article>
<tp-dir anchor="#direction-preview"></tp-dir>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Switch the reading direction and observe the layout of the example text.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Auto mode
: Observe the controller following the document’s reading direction in automatic mode.

Change event
: Change the dir setting and inspect the emitted tp-dir-change event.
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
<!-- tp-docgen:api TpDir -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector used as the explicit element that receives the selected direction. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables the direction trigger. |
  | <code>mode</code> | <code>string</code> | <code>&quot;auto&quot;</code> | Reading-direction mode (`ltr`, `rtl`, `auto`). In `auto`, RTL is inferred from language or supported region codes. |
  | <code>size</code> | <code>string</code> | <code>&quot;m&quot;</code> | Icon button size. |
  | <code>variant</code> | <code>string</code> | <code>&quot;neutral&quot;</code> | Icon button variant. |
  [Attributes of `<tp-dir>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpDir`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-dir-change</code> | <code>&#123; mode: &quot;ltr&quot; \| &quot;rtl&quot; \| &quot;auto&quot;; dir: &quot;ltr&quot; \| &quot;rtl&quot;; anchor: string; target: HTMLElement &#125;</code> | Emitted when the reading direction applied to a target changes. |
  [Events emitted by `<tp-dir>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-dir>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_dir.TpDir.html)
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
  <script type="module" src="/path/to/components/dir/dir.js"></script>
  ```

import
: ```js
  import "/path/to/components/dir/dir.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/dir/dir.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-dir>` are loaded automatically by this component if they have not already been loaded by another component.

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
