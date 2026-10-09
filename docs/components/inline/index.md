# <tp-icon name="inline" library="components" size="1.25em"></tp-icon> Inline

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-inline>` element implements the <tp-icon name="inline" library="components" size="1.25em"></tp-icon> Inline functionality: inline flex layout component.

<tp-inline gap="1rem" align="center">
    <tp-button>Previous</tp-button><span>Page 2 of 5</span><tp-button>Next</tp-button>
  </tp-inline>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | This component organizes or presents content. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| Embedded controls, when present | Use their normal keyboard interactions. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `gap`, `justify`, and `align` with CSS values. Add `stretch` when every direct child should share the available width.

```html
<tp-inline gap="1rem" align="center">
  <tp-button>Previous</tp-button><span>Page 2 of 5</span><tp-button>Next</tp-button>
</tp-inline>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the navigation controls and page indicator arranged inline.

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
<!-- tp-docgen:api TpInline -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>align</code> | <code>&quot;normal&quot; \| &quot;stretch&quot; \| &quot;center&quot; \| &quot;start&quot; \| &quot;end&quot; \| &quot;flex-start&quot; \| &quot;flex-end&quot; \| &quot;self-start&quot; \| &quot;self-end&quot; \| &quot;baseline&quot; \| &quot;first baseline&quot; \| &quot;last baseline&quot;</code> | <code>&quot;center&quot;</code> | Cross-axis alignment applied to align-items. |
  | <code>gap</code> | <code>string</code> | <code>&quot;0.5rem&quot;</code> | Gap between children. When absent, uses the --tp-inline-gap CSS default. |
  | <code>justify</code> | <code>&quot;normal&quot; \| &quot;start&quot; \| &quot;end&quot; \| &quot;flex-start&quot; \| &quot;flex-end&quot; \| &quot;center&quot; \| &quot;left&quot; \| &quot;right&quot; \| &quot;space-between&quot; \| &quot;space-around&quot; \| &quot;space-evenly&quot; \| &quot;stretch&quot;</code> | <code>&quot;flex-start&quot;</code> | Main-axis alignment applied to justify-content. |
  | <code>stretch</code> | <code>boolean</code> | <code>false</code> | Indicates whether children can stretch. |
  [Attributes of `<tp-inline>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpInline`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-inline>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-inline-gap</code> | <code>0.5rem</code> | Controls the gap. |
  [CSS properties of `<tp-inline>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_inline.TpInline.html)
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
  <script type="module" src="/path/to/components/inline/inline.js"></script>
  ```

import
: ```js
  import "/path/to/components/inline/inline.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/inline/inline.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-inline>` are loaded automatically by this component if they have not already been loaded by another component.

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
