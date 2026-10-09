# <tp-icon name="base" library="components" size="1.25em"></tp-icon> Base

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-base>` element implements the <tp-icon name="base" library="components" size="1.25em"></tp-icon> Base functionality: shared base for `tp-*` components.

<tp-base>This element provides the common tp-components foundation.</tp-base>

`<tp-base>` installs the global reset, design tokens, and common tp-components styles once in the document. Every component that extends `TpBase` therefore starts from the same visual foundation without loading those styles again.

It also provides the shared component help system. Components inherit the `help()` method and the global help interaction, which builds the help panel from their API metadata and examples.

## Usage

### User interactions

Press Ctrl+? while a component has focus or is hovered to open its help panel. On keyboards that require Shift to type ?, include Shift. The shared foundation adds no other standalone control.

### Author directives

`<tp-base>` is primarily an extension point for component authors. Application interfaces should normally use one of its specialized subclasses.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect a minimal element using the common component foundation.

Attribute: data-tp-help-src
: Open the component help to inspect the API manifest supplied through this attribute.

Attribute: data-tp-markdown-source
: This URL establishes the base used to resolve relative resources in generated help; it does not load page content.

Attribute: dir
: Choose a value in the radio list to change dir and observe the preview. Initialization-only settings restart the preview.

Attribute: lang
: Inspect the language declared for this content, including its pronunciation with assistive technology.
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

## Accessibility

<!-- tp-docgen:accessibility:start -->
### Review status

Static implementation review completed. Browser, zoom/reflow, contrast, voice-control, and assistive-technology validation remain required unless stated otherwise.

### Static review observations

- The implementation uses native interactive HTML controls or accessible library button primitives.
- The implementation contains ARIA roles, states, or relationships that require browser and assistive-technology validation.
- The implementation contains explicit keyboard-event handling.
- The implementation manages focus or tab order.

### Consumer responsibilities

- Validate the component in its final content, language, layout, and interaction context.
- Preserve accessible names, document structure, reading order, and text alternatives supplied by the consuming page.
<!-- tp-docgen:accessibility:end -->

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
