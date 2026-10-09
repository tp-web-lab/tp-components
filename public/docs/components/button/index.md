# <tp-icon name="button" library="components" size="1.25em"></tp-icon> Button

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-button>` element implements the <tp-icon name="button" library="components" size="1.25em"></tp-icon> Button functionality: an action button or navigation link with shared sizes, variants and loading states.

<tp-button href="/#/components/button/index.md#usage">Read the usage guide</tp-button>

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

<tp-button outlined>Cancel</tp-button>
<tp-button href="#programming">Read the API</tp-button>

Without `href`, the component creates a native button. With `href`, it creates a link and forwards `target`, `rel`, and `download`.

```html
<tp-button variant="primary">Continue</tp-button>
<tp-button outlined>Cancel</tp-button>
<tp-button href="#programming">Read the API</tp-button>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Activate the button to follow its documentation link.

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
<!-- tp-docgen:api TpButton -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Attribute `disabled`. |
  | <code>download</code> | <code>string</code> | <code>&quot;&quot;</code> | Attribute `download`. |
  | <code>href</code> | <code>string</code> | <code>&quot;&quot;</code> | Attribute `href`. |
  | <code>loading</code> | <code>boolean</code> | <code>false</code> | Attribute `loading`. |
  | <code>loading-mode</code> | <code>TpButtonLoadingMode</code> | <code>replace</code> | API documentation summary. |
  | <code>outlined</code> | <code>boolean</code> | <code>false</code> | Attribute `outlined`. |
  | <code>pill</code> | <code>boolean</code> | <code>false</code> | Attribute `pill`. |
  | <code>rel</code> | <code>string</code> | <code>&quot;&quot;</code> | Attribute `rel`. |
  | <code>size</code> | <code>TpSizeType</code> | <code>m</code> | Attribute `size`. |
  | <code>target</code> | <code>string</code> | <code>&quot;&quot;</code> | Attribute `target`. |
  | <code>type</code> | <code>TpButtonNativeType</code> | <code>button</code> | Attribute `type`. |
  | <code>variant</code> | <code>TpVariantType</code> | <code>neutral</code> | Attribute `variant`. |
  [Attributes of `<tp-button>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpButton`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>click</code> | <code>void</code> | Event.<br>Colors are derived from the shared `tp.css` semantic tokens. |
  [Events emitted by `<tp-button>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-button-accent</code> | <code>var(&#45;&#45;tp-brand-text-colorful)</code> | Controls the accent. |
  | <code>&#45;&#45;tp-button-background</code> | <code>transparent</code> | Controls the background. |
  | <code>&#45;&#45;tp-button-border-color</code> | <code>var(&#45;&#45;tp-brand-stroke-mid)</code> | Controls the border color. |
  | <code>&#45;&#45;tp-button-focus-ring-color</code> | <code>var(&#45;&#45;tp-focus-color)</code> | Controls the focus ring color. |
  | <code>&#45;&#45;tp-button-font-size</code> | <code>1.125em</code> | Controls the font size. |
  | <code>&#45;&#45;tp-button-foreground</code> | <code>var(&#45;&#45;tp-button-accent)</code> | Controls the foreground. |
  | <code>&#45;&#45;tp-button-outline-background</code> | <code>var(&#45;&#45;tp-brand-fill-softer)</code> | Controls the outline background. |
  | <code>&#45;&#45;tp-button-padding-block</code> | <code>0.6em</code> | Controls the padding block. |
  | <code>&#45;&#45;tp-button-padding-inline</code> | <code>1em</code> | Controls the padding inline. |
  | <code>&#45;&#45;tp-button-radius</code> | <code>999px</code> | Controls the radius. |
  | <code>&#45;&#45;tp-button-spinner-border-width</code> | <code>1.5px</code> | Controls the spinner border width. |
  | <code>&#45;&#45;tp-button-spinner-size</code> | <code>1.15em</code> | Controls the spinner size. |
  [CSS properties of `<tp-button>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_button.TpButton.html)
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
  <script type="module" src="/path/to/components/button/button.js"></script>
  ```

import
: ```js
  import "/path/to/components/button/button.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/button/button.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-button>` are loaded automatically by this component if they have not already been loaded by another component.

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
