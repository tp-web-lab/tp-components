# <tp-icon name="iframe" library="components" size="1.25em"></tp-icon> Iframe

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-iframe>` element implements the <tp-icon name="iframe" library="components" size="1.25em"></tp-icon> Iframe functionality: controlled iframe component.

<tp-iframe src="/docs/components/iframe/examples/welcome.html" title="A document inside an iframe" style="height: 12rem;"></tp-iframe>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | Read the displayed content and use its links and embedded controls. |
| Using the component | The component itself adds no editing or playback controls. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Author directives

Use `src` for a remote document or `srcdoc` for inline HTML. `interaction`, `sandbox`, `referrerpolicy`, and `fullscreen` control browser capabilities.

Unlike `tp-frame`, which sizes and clips children within the current document to a fixed aspect ratio, `tp-iframe` embeds a separate HTML document with its own browsing context. Choose `tp-iframe` for an embedded page or HTML document; choose `tp-frame` to control the proportions of existing content, such as an image or video. A fixed aspect ratio does not itself provide document isolation.

```html
<tp-iframe
  srcdoc="<h1>Hello</h1><p>This document is rendered inside tp-iframe.</p>"
  zoom="1"
  loading="lazy">
</tp-iframe>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the external page displayed inside the embedded frame.

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
<!-- tp-docgen:api TpIframe -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>controls</code> | <code>boolean</code> | <code>false</code> | Shows the internal toolbar for zoom and frame actions; controls="false" hides it. |
  | <code>fullscreen</code> | <code>boolean</code> | <code>false</code> | Allows the embedded document to request fullscreen when present. |
  | <code>interaction</code> | <code>boolean</code> | <code>true</code> | Enables pointer interaction with the embedded document; interaction="false" blocks pointer events. Enabled by default. |
  | <code>loading</code> | <code>string</code> | <code>&quot;&quot;</code> | Browser iframe loading policy: lazy defers offscreen loading; eager requests immediate loading. Absent leaves the browser default. |
  | <code>referrerpolicy</code> | <code>string</code> | <code>&quot;&quot;</code> | Referrer policy forwarded to the iframe, for example no-referrer or strict-origin-when-cross-origin. Empty leaves the browser default. |
  | <code>sandbox</code> | <code>string</code> | <code>&quot;&quot;</code> | Space-separated iframe sandbox permissions, for example allow-scripts. In this component, empty or absent removes the sandbox; an empty attribute does not enable the fully restricted native sandbox. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the document to embed; a nonempty srcdoc takes precedence. |
  | <code>srcdoc</code> | <code>string</code> | <code>&quot;&quot;</code> | Inline HTML document to embed, taking precedence over src. |
  | <code>zoom</code> | <code>number</code> | <code>1</code> | Nonnegative numeric magnification factor: 1 is 100%, 0.5 is 50%, and 2 is 200%. Invalid values use 1. |
  | <code>zoom-levels</code> | <code>string</code> | <code>25% 50% 75% 100% 125% 150% 175% 200%</code> | Space-separated zoom choices offered in the toolbar, expressed as percentages, for example 50% 100% 150%. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-iframe>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>getContentHeight</code> | <code>getContentHeight(): number</code> | Returns the maximum scroll/offset height of the embedded document in CSS pixels. Returns 0 if its document is unavailable, including inaccessible cross-origin content. |
  | <code>resetZoom</code> | <code>resetZoom(value = 1): void</code> | Sets the magnification factor to value; 1 restores 100%. Rejects negative or nonfinite values with TypeError. |
  | <code>zoomIn</code> | <code>zoomIn(): void</code> | Selects the next larger configured zoom level, capped at the largest available level. |
  | <code>zoomOut</code> | <code>zoomOut(): void</code> | Selects the next smaller configured zoom level, capped at the smallest available level. |
  [Public methods of `TpIframe`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-iframe-change</code> | <code>&#123; interaction: boolean; overflowWidth: number; scrollPosition: number; zoom: number; zoomText: string &#125;</code> | Emitted when zoom, interaction or horizontal viewport state is refreshed. overflowWidth and scrollPosition are in CSS pixels, zoom is a scale factor, and zoomText is its percentage label. |
  | <code>tp-iframe-load</code> | <code>&#123; contentHeight: number; hasSrcdoc: boolean; src: string &#125;</code> | Emitted after the inner iframe loads and its layout is refreshed. contentHeight is in CSS pixels (0 when inaccessible), hasSrcdoc indicates inline content, and src is the configured URL. |
  [Events emitted by `<tp-iframe>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-iframe-zoom</code> | <code>1</code> | Unitless scale factor applied to iframe content (1 means 100%); synchronized with the zoom attribute. |
  [CSS properties of `<tp-iframe>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_iframe.TpIframe.html)
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
  <script type="module" src="/path/to/components/iframe/iframe.js"></script>
  ```

import
: ```js
  import "/path/to/components/iframe/iframe.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/iframe/iframe.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-iframe>` are loaded automatically by this component if they have not already been loaded by another component.

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
