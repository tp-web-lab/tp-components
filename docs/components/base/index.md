# <tp-icon name="base" library="components" size="1.25em"></tp-icon> Base

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-base>` element implements the <tp-icon name="base" library="components" size="1.25em"></tp-icon> Base functionality: shared base for `tp-*` components.

<tp-base>This element provides the common tp-components foundation.</tp-base>

`<tp-base>` installs the global reset, design tokens, and common tp-components styles once in the document. Every component that extends `TpBase` therefore starts from the same visual foundation without loading those styles again.

It also provides the shared user help system. Press Ctrl+? on a focused or hovered component to open “tp-NAME User Help”: a direct preview of the current element followed by mouse and keyboard interactions. The preview is independent of the original element. Authoring controls, API tables and class inheritance are not shown.

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Pointer over a component | Identifies the component whose help opens with Ctrl+?. This also works for non-focusable content such as boxes. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

`<tp-base>` is primarily an extension point for component authors. Application interfaces should normally use one of its specialized subclasses.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect a minimal element using the common component foundation.

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
<!-- tp-docgen:api TpBase -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. |
  [Attributes of `<tp-base>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>help</code> | <code>help(): Promise&lt;void&gt;</code> | Opens generated component help. |
  [Public methods of `TpBase`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-base>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-base>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_base.TpBase.html)
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
  <script type="module" src="/path/to/components/base/base.js"></script>
  ```

import
: ```js
  import "/path/to/components/base/base.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/base/base.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

<!--
@summary This component has no tp-components dependencies.
-->
No internal dependency

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
