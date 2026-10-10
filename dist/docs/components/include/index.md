# <tp-icon name="include" library="components" size="1.25em"></tp-icon> Include

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-include>` element implements the <tp-icon name="include" library="components" size="1.25em"></tp-icon> Include functionality: loads remote HTML into the light DOM.

<tp-include src="/docs/components/include/examples/welcome.html" loading="Loading the shared notice…"></tp-include>

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

Use `src` to load an HTML fragment into the current page. The introductory example loads a shared notice from a local file.

```html
<tp-include src="/docs/components/include/examples/welcome.html" loading="Loading the shared notice…"></tp-include>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the content inserted from the external source file.

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
<!-- tp-docgen:api TpInclude -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>allow-scripts</code> | <code>boolean</code> | <code>false</code> | Allows included scripts to run. |
  | <code>allow-styles</code> | <code>boolean</code> | <code>false</code> | Keeps included `<style>` and stylesheet links. |
  | <code>fallback</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector for fallback content displayed on error. |
  | <code>fetch-mode</code> | <code>string</code> | <code>&quot;cors&quot;</code> | Fetch mode (`cors`, `no-cors`, or `same-origin`). |
  | <code>loading</code> | <code>string</code> | <code>&quot;&quot;</code> | Text shown while loading. |
  | <code>mode</code> | <code>string</code> | <code>&quot;auto&quot;</code> | Inclusion mode (`auto` or `raw`). |
  | <code>sanitize</code> | <code>boolean</code> | <code>false</code> | Sanitizes included HTML with DOMPurify. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | HTML source URL. |
  [Attributes of `<tp-include>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>reload</code> | <code>reload(): Promise&lt;void&gt;</code> | Reloads the included content. |
  [Public methods of `TpInclude`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-include-error</code> | <code>&#123; src: string; fetchMode: &quot;cors&quot; \| &quot;no-cors&quot; \| &quot;same-origin&quot;; allowScripts: boolean; allowStyles: boolean; sanitize: boolean; scriptsExecuted: false; error: string &#125;</code> | Emitted when loading or injecting content fails. |
  | <code>tp-include-load</code> | <code>&#123; src: string; fetchMode: &quot;cors&quot; \| &quot;no-cors&quot; \| &quot;same-origin&quot;; allowScripts: boolean; allowStyles: boolean; sanitize: boolean; scriptsExecuted: boolean &#125;</code> | Emitted after content is loaded and injected. |
  [Events emitted by `<tp-include>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-include>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_include.TpInclude.html)
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
  <script type="module" src="/path/to/components/include/include.js"></script>
  ```

import
: ```js
  import "/path/to/components/include/include.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/include/include.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-include>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@credit DOMPurify https://github.com/cure53/DOMPurify
@summary HTML sanitization.
-->

- [DOMPurify](https://github.com/cure53/DOMPurify) : HTML sanitization.
<!-- tp-docgen:dependencies:end -->
