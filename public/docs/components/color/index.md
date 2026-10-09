# <tp-icon name="color" library="components" size="1.25em"></tp-icon> Color

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-color>` element implements the <tp-icon name="color" library="components" size="1.25em"></tp-icon> Color functionality: preset-based color controller.

<section>
      <tp-color></tp-color>
      <p>The selected brand color is scoped to this section.</p>
      <code>Inline code uses the selected brand colour.</code>
    </section>
<p>The selected brand color is scoped to this section.</p>
<p><code>Inline code</code> is displayed in the brand colour.</p>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Palette button | Open the color choices for the associated content. |
| Color choice | Apply the selected brand color. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Activate the focused button. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

`<tp-color>` displays a palette button and applies one of the built-in brand color classes to its target. By default, the target is the containing element. When `anchor` points to an element, that element is used instead.

The controller behaves like an icon button. Use `variant`, `size`, and
`disabled` to configure the internal `<tp-icon-button>`:

```html
<tp-color variant="brand" size="s"></tp-color>
<tp-color disabled></tp-color>
```

Place the component inside the element whose brand color should be controlled:

```html
<section>
  <tp-color></tp-color>
  <p>This section receives the selected brand color.</p>
</section>
```

Use `anchor` for an explicit target:

```html
<article id="preview">
  <p>The selected preset is applied here.</p>
</article>
<tp-color anchor="#preview"></tp-color>
```

Use `ui-anchor` when only the dropdown should be positioned elsewhere. The
selected preset is still applied to the `anchor` target when it is provided:

```html
<section>
  <span id="palette-position">Palette position</span>
  <tp-callout variant="brand" id="callout">
    The callout receives the selected preset.
  </tp-callout>
</section>
<tp-color ui-anchor="#palette-position" anchor="#callout" style="float: right;"></tp-color>
```

In this example, `anchor="#callout"` makes the callout receive the selected
brand preset. `ui-anchor="#palette-position"` positions the dropdown next to
the label. The `style` attribute only moves the palette button itself in the
page layout.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Choose a brand color and observe the content inside its color scope.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Local color scope
: Change the brand color of the local box without targeting the whole page.

Change event
: Change the color setting and inspect the emitted tp-color-change event.
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
<!-- tp-docgen:api TpColor -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector used as the explicit element that receives the selected preset. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables the color trigger. |
  | <code>preset</code> | <code>string</code> | <code>&quot;tp-default&quot;</code> | Preset class name (e.g. `tp-default`, `tp-red`) |
  | <code>size</code> | <code>string</code> | <code>&quot;m&quot;</code> | Icon button size. |
  | <code>ui-anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector used only to anchor the dropdown UI. |
  | <code>variant</code> | <code>string</code> | <code>&quot;neutral&quot;</code> | Icon button variant. |
  [Attributes of `<tp-color>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>syncToPreset</code> | <code>syncToPreset(preset: TpColorPreset): void</code> | Synchronizes the preset from another controller. |
  [Public methods of `TpColor`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-color-change</code> | <code>&#123; preset: string; brand: string; anchor: string; target: HTMLElement &#125;</code> | Emitted when the selected brand preset is applied to a target. |
  [Events emitted by `<tp-color>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-color>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_color.TpColor.html)
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
  <script type="module" src="/path/to/components/color/color.js"></script>
  ```

import
: ```js
  import "/path/to/components/color/color.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/color/color.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-color>` are loaded automatically by this component if they have not already been loaded by another component.

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
