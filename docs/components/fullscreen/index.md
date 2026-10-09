# <tp-icon name="fullscreen" library="components" size="1.25em"></tp-icon> Fullscreen

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-fullscreen>` element implements the <tp-icon name="fullscreen" library="components" size="1.25em"></tp-icon> Fullscreen functionality: fullscreen controller button.

<tp-box>
      <tp-fullscreen></tp-fullscreen>
      <p>This box is the fullscreen target.</p>
      <p>Press Esc to exit fullscreen mode.</p>
    </tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Fullscreen button | Expand the associated content; activate again to leave fullscreen. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Activate the focused button. |
| Browser fullscreen exit command | Leave fullscreen. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

`<tp-fullscreen>` toggles fullscreen mode for an anchored element or, when `anchor` is omitted, for the component that contains it. It skips toolbar-like containers when resolving the containing component.

The controller behaves like an icon button. Use `variant`, `size`, and
`disabled` to configure the internal `<tp-icon-button>`:

```html
<tp-fullscreen variant="brand" size="s"></tp-fullscreen>
<tp-fullscreen disabled></tp-fullscreen>
```

Use `anchor` to target a specific element:

```html
<section id="preview">
  <p>This section can enter fullscreen mode.</p>
</section>

<tp-fullscreen anchor="#preview"></tp-fullscreen>
```

Place the button inside a component toolbar to control the containing component:

```html
<tp-box>
  <tp-toolbar>
    <tp-fullscreen></tp-fullscreen>
  </tp-toolbar>
  <p>The box is the fullscreen target.</p>
  <p>Press Esc to exit full-screen mode.</p>
</tp-box>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Enter fullscreen for the target box, then leave fullscreen using the control or Escape.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Toolbar control
: Enter and exit fullscreen from the toolbar while keeping the containing box as the target.

Change event
: Change the fullscreen setting and inspect the emitted tp-fullscreen-change event.
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
<!-- tp-docgen:api TpFullscreen -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector of the element to toggle fullscreen. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables the fullscreen trigger. |
  | <code>size</code> | <code>string</code> | <code>&quot;m&quot;</code> | Icon button size. |
  | <code>variant</code> | <code>string</code> | <code>&quot;neutral&quot;</code> | Icon button variant. |
  [Attributes of `<tp-fullscreen>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpFullscreen`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-fullscreen-change</code> | <code>&#123; fullscreen: boolean; anchor: string; target: HTMLElement &#125;</code> | Emitted when the fullscreen state of the controlled target changes. |
  [Events emitted by `<tp-fullscreen>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-fullscreen>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_fullscreen.TpFullscreen.html)
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
  <script type="module" src="/path/to/components/fullscreen/fullscreen.js"></script>
  ```

import
: ```js
  import "/path/to/components/fullscreen/fullscreen.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/fullscreen/fullscreen.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-fullscreen>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
