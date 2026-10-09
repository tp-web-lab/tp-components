# <tp-icon name="icon" library="components" size="1.25em"></tp-icon> Icons

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-icon>` element implements the <tp-icon name="icon" library="components" size="1.25em"></tp-icon> Icons functionality: aPI documentation summary.

<tp-icon name="heart" size="3rem" aria-label="Heart"></tp-icon>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | This component displays information and has no control to operate. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-icon>` as shown below.

```html
<tp-icon></tp-icon>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the icon loaded from the configured icon library.

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
<!-- tp-docgen:api TpIcon -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>color</code> | <code>string</code> | <code>&quot;&quot;</code> | Attribute `color`. |
  | <code>fallback</code> | <code>string</code> | <code>&quot;&quot;</code> | Attribute `fallback`. |
  | <code>fallback-icon</code> | <code>string</code> | <code>&quot;&quot;</code> | Attribute `fallback-icon`. |
  | <code>flip-h</code> | <code>boolean</code> | <code>false</code> | Attribute `flip-h`. |
  | <code>flip-v</code> | <code>boolean</code> | <code>false</code> | Attribute `flip-v`. |
  | <code>library</code> | <code>string</code> | <code>tp</code> | Attribute `library`. |
  | <code>name</code> | <code>string</code> | <code>&quot;&quot;</code> | Attribute `name`. |
  | <code>rotate</code> | <code>string</code> | <code>0deg</code> | Attribute `rotate`. |
  | <code>scale</code> | <code>number</code> | <code>1</code> | Attribute `scale`. |
  | <code>size</code> | <code>string</code> | <code>1em</code> | Attribute `size`. |
  | <code>spin</code> | <code>boolean</code> | <code>false</code> | Attribute `spin`. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Attribute `src`. |
  [Attributes of `<tp-icon>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpIcon`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-icon>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-icon-size</code> | <code>1em</code> | Controls the size. |
  [CSS properties of `<tp-icon>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_icon.TpIcon.html)
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
  <script type="module" src="/path/to/components/icon/icon.js"></script>
  ```

import
: ```js
  import "/path/to/components/icon/icon.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/icon/icon.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-icon>` are loaded automatically by this component if they have not already been loaded by another component.

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
