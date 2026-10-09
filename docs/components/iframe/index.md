# <tp-icon name="iframe" library="components" size="1.25em"></tp-icon> Iframe

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-iframe>` element implements the <tp-icon name="iframe" library="components" size="1.25em"></tp-icon> Iframe functionality: controlled iframe component.

<tp-iframe src="/tp-components/docs/components/iframe/examples/welcome.html" title="A document inside an iframe" style="height: 12rem;"></tp-iframe>

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
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

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
  | <code>controls</code> | <code>boolean</code> | <code>false</code> | Affiche la barre de contrôles interne. |
  | <code>fullscreen</code> | <code>boolean</code> | <code>false</code> | Autorise le mode plein écran. |
  | <code>interaction</code> | <code>boolean</code> | <code>true</code> | Active ou désactive l’interaction pointeur avec l’iframe. Par défaut : `true`. |
  | <code>loading</code> | <code>string</code> | <code>&quot;&quot;</code> | Politique de chargement : `lazy` ou `eager`. |
  | <code>referrerpolicy</code> | <code>string</code> | <code>&quot;&quot;</code> | Politique `referrerpolicy`. |
  | <code>sandbox</code> | <code>string</code> | <code>&quot;&quot;</code> | Valeur de l’attribut `sandbox` de l’iframe. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL du document à charger. |
  | <code>srcdoc</code> | <code>string</code> | <code>&quot;&quot;</code> | Document HTML inline à afficher. |
  | <code>zoom</code> | <code>number</code> | <code>1</code> | Niveau de zoom. Par défaut : `1`. |
  | <code>zoom-levels</code> | <code>string</code> | <code>25% 50% 75% 100% 125% 150% 175% 200%</code> | Liste des niveaux de zoom disponibles. Par défaut : `25% 50% 75% 100% 125% 150% 175% 200%`. |
  [Attributes of `<tp-iframe>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>getContentHeight</code> | <code>getContentHeight(): number</code> | Mesure la hauteur du contenu interne de l’iframe. |
  | <code>resetZoom</code> | <code>resetZoom(value = 1): void</code> | Réinitialise le zoom. |
  | <code>zoomIn</code> | <code>zoomIn(): void</code> | Augmente le zoom. |
  | <code>zoomOut</code> | <code>zoomOut(): void</code> | Réduit le zoom. |
  [Public methods of `TpIframe`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-iframe-change</code> | <code>&#123; interaction: unknown; overflowWidth: unknown; scrollPosition: unknown; zoom: unknown; zoomText: unknown &#125;</code> | Émis quand l’état visible de l’iframe change. |
  | <code>tp-iframe-load</code> | <code>&#123; contentHeight: unknown; hasSrcdoc: unknown; src: unknown &#125;</code> | Émis après le chargement de l’iframe interne. |
  [Events emitted by `<tp-iframe>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-iframe-zoom</code> | <code>1</code> | Controls the zoom. |
  [CSS properties of `<tp-iframe>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_iframe.TpIframe.html)
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
