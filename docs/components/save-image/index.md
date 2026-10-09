# <tp-icon name="save-image" library="components" size="1.25em"></tp-icon> Save image

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-save-image>` element implements the <tp-icon name="save-image" library="components" size="1.25em"></tp-icon> Save image functionality: saves an anchored image in several formats.

<tp-box>
  <p>Save this heart icon as an SVG, PNG or WebP image.</p>
  <tp-icon id="intro-save-diagram" name="heart" size="5rem" aria-label="Heart"></tp-icon>
  <tp-save-image anchor="#intro-save-diagram" filename="heart"></tp-save-image>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Save image button | Download the associated image. The browser handles the download. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Activate the focused button. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

`anchor` can reference an SVG, canvas, image, an element containing one of these images, or a component exposing an `exportSvg(): string` method. Use `name`, `variant`, `size`, and `disabled` to configure the internal icon button.

The component emits `tp-save-image-save` after preparing a download and `tp-save-image-error` when conversion fails.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Use the save control to export the heart icon in one of the offered image formats.

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
<!-- tp-docgen:api TpSaveImage -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector of the image or exportable component. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables the trigger. |
  | <code>filename</code> | <code>string</code> | <code>&quot;image&quot;</code> | Download filename without its extension. |
  | <code>name</code> | <code>string</code> | <code>&quot;image-download&quot;</code> | Icon used by the trigger. |
  | <code>size</code> | <code>string</code> | <code>&quot;m&quot;</code> | Icon button size. |
  | <code>variant</code> | <code>string</code> | <code>&quot;neutral&quot;</code> | Icon button variant. |
  [Attributes of `<tp-save-image>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>save</code> | <code>save(format: TpSaveImageFormat): Promise&lt;void&gt;</code> | Save. |
  [Public methods of `TpSaveImage`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-save-image-error</code> | <code>&#123; format: &quot;svg&quot; \| &quot;png&quot; \| &quot;webp&quot;; error: unknown; anchor: string &#125;</code> | Emitted when the target cannot be exported. |
  | <code>tp-save-image-save</code> | <code>&#123; format: &quot;svg&quot; \| &quot;png&quot; \| &quot;webp&quot;; filename: string; anchor: string; target: Element &#125;</code> | Emitted after an image has been prepared for download. |
  [Events emitted by `<tp-save-image>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-save-image>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_save-image.TpSaveImage.html)
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
  <script type="module" src="/path/to/components/save-image/save-image.js"></script>
  ```

import
: ```js
  import "/path/to/components/save-image/save-image.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/save-image/save-image.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-save-image>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-dropdown
@summary Displays an anchored dropdown menu.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-dropdown>`](../dropdown/index.md) : Displays an anchored dropdown menu.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
