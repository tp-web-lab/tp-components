# <tp-icon name="icon-button" library="components" size="1.25em"></tp-icon> Icon button

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-icon-button>` element implements the <tp-icon name="icon-button" library="components" size="1.25em"></tp-icon> Icon button functionality: button icon accessible.

<tp-box data-intro-action="counter" data-allow-script>
  <p>Activate the heart button to add a like.</p>
  <tp-icon-button name="heart" label="Like this example" data-demo-trigger></tp-icon-button>
  <p data-demo-status role="status">Likes: 0</p>
  <script src="/docs/components/_shared/introduction-actions.js"></script>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Button | Click to perform the action identified by its label. Disabled controls cannot be activated. |
| Navigation button | Click to open its destination. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter | Activate the focused button or link. |
| Space | Activate a focused action button; links use Enter. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

<tp-icon-button name="delete" label="Delete" color="crimson"></tp-icon-button>

Always provide `label` for an accessible name. Icon attributes such as `library`, `color`, `size`, `scale`, `rotate`, `flip-h`, `flip-v`, and `spin` are forwarded to the internal icon.

```html
<tp-icon-button name="refresh" label="Refresh"></tp-icon-button>
<tp-icon-button name="delete" label="Delete" color="crimson"></tp-icon-button>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Activate the heart button and observe the updated like count.

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
<!-- tp-docgen:api TpIconButton -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>color</code> | <code>string</code> | <code>&quot;&quot;</code> | Color forwarded to the internal `<tp-icon>`. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Attribute `disabled`. |
  | <code>flip-h</code> | <code>boolean</code> | <code>false</code> | Horizontal flip forwarded to the internal `<tp-icon>`. |
  | <code>flip-v</code> | <code>boolean</code> | <code>false</code> | Vertical flip forwarded to the internal `<tp-icon>`. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Attribute `label`. |
  | <code>library</code> | <code>string</code> | <code>&quot;&quot;</code> | Attribute `library`. |
  | <code>name</code> | <code>string</code> | <code>&quot;&quot;</code> | Attribute `name`. |
  | <code>rotate</code> | <code>string</code> | <code>&quot;0deg&quot;</code> | Rotation forwarded to the internal `<tp-icon>`. |
  | <code>scale</code> | <code>number</code> | <code>1</code> | Scale forwarded to the internal `<tp-icon>`. |
  | <code>size</code> | <code>TpSizeType</code> | <code>m</code> | Attribute `size`. |
  | <code>spin</code> | <code>boolean</code> | <code>false</code> | Continuous spin forwarded to the internal `<tp-icon>`. |
  | <code>type</code> | <code>TpIconButtonNativeType</code> | <code>button</code> | Attribute `type`. |
  | <code>variant</code> | <code>TpVariantType</code> | <code>neutral</code> | Attribute `variant`. |
  [Attributes of `<tp-icon-button>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>focus</code> | <code>focus(): void</code> | API documentation summary. |
  [Public methods of `TpIconButton`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>click</code> | <code>void</code> | Event. |
  [Events emitted by `<tp-icon-button>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-icon-button-focus-ring</code> | <code>currentColor</code> | Controls the focus ring. |
  | <code>&#45;&#45;tp-icon-button-hover-background</code> | <code>color-mix( in srgb, currentColor 10%, transparent )</code> | Controls the hover background. |
  | <code>&#45;&#45;tp-icon-button-icon-size</code> | <code>1.75em</code> | Controls the icon size. |
  | <code>&#45;&#45;tp-icon-button-radius</code> | <code>999rem</code> | Controls the radius. |
  | <code>&#45;&#45;tp-icon-button-size</code> | <code>3.25em</code> | Controls the size. |
  [CSS properties of `<tp-icon-button>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_icon-button.TpIconButton.html)
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
  <script type="module" src="/path/to/components/icon-button/icon-button.js"></script>
  ```

import
: ```js
  import "/path/to/components/icon-button/icon-button.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/icon-button/icon-button.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-icon-button>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
