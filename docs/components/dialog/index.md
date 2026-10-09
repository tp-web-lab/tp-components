# <tp-icon name="dialog" library="components" size="1.25em"></tp-icon> Dialog

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-dialog>` element implements the <tp-icon name="dialog" library="components" size="1.25em"></tp-icon> Dialog functionality: displays a confirm/cancel dialog.

<tp-box data-intro-action="dialog" data-allow-script>
  <tp-button id="intro-dialog-trigger" data-demo-trigger>Open the confirmation dialog</tp-button>
  <tp-dialog></tp-dialog>
  <p data-demo-status role="status">Try the dialog using its trigger.</p>
  <script src="/tp-components/docs/components/_shared/introduction-actions.js"></script>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Activate the page's trigger to open the panel. |
| Using the component | Use its controls or links, then close it with the available dismissal control. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Escape | Dismiss the panel when its settings allow it. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-dialog>` as shown below.

```html
<tp-dialog></tp-dialog>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open the confirmation dialog and try its available actions.
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
<!-- tp-docgen:api TpDialog -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-dialog>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>close</code> | <code>close(action: &#39;confirm&#39; \| &#39;cancel&#39; = &#39;cancel&#39;): void</code> | Closes the dialog. |
  | <code>setContent</code> | <code>setContent(options: &#123;&lt;br&gt;    title?: string;&lt;br&gt;    body?: Node[];&lt;br&gt;    confirmText?: string;&lt;br&gt;    cancelText?: string;&lt;br&gt;  &#125;): void</code> | Replaces the dialog content. |
  | <code>show</code> | <code>show(): void</code> | Opens the dialog. |
  [Public methods of `TpDialog`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-dialog-close</code> | <code>&#123; action: &quot;confirm&quot; \| &quot;cancel&quot; &#125;</code> | Emitted when the dialog is closed from one of its actions. |
  [Events emitted by `<tp-dialog>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-dialog>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_dialog_dialog.TpDialog.html)
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
  <script type="module" src="/path/to/components/dialog/dialog.js"></script>
  ```

import
: ```js
  import "/path/to/components/dialog/dialog.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/dialog/dialog.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-dialog>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->

- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
