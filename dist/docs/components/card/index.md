# <tp-icon name="card" library="components" size="1.25em"></tp-icon> Card

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-card>` element implements the <tp-icon name="card" library="components" size="1.25em"></tp-icon> Card functionality: displays a structured card.

<tp-card>
        <dl>
          <dt>header</dt><dd>content header</dd>
          <dt>footer</dt><dd>content footer</dd>
          <dt>main</dt><dd>content body</dd>
        </dl>
      </tp-card>

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

Place a definition list inside `<tp-card>`. Use the terms `header`, `main`, and `footer` to identify each section. Their order in the list does not affect the rendered order of the card.

```html
<tp-card>
  <dl>
    <dt>header</dt><dd>content header</dd>
    <dt>footer</dt><dd>content footer</dd>
    <dt>main</dt><dd>content body</dd>
  </dl>
</tp-card>
```

Sections are optional, but at least one recognized section must be present. Content inside each `<dd>` can contain text, HTML elements, or other `tp-*` components.

When a card has neither a header nor a footer and its `main` section contains only an `<img>` or an `<svg>`, the card adapts to the visual's intrinsic width. The visual fills the body without margin or padding while retaining its proportions. The card never exceeds the available width.

```html
<tp-card>
  <dl>
    <dt>main</dt><dd><img src="landscape.jpg" alt="Landscape"></dd>
  </dl>
</tp-card>
```

The card dimensions can also be set explicitly. The header and footer retain their content height, while the main section alone grows to fill the available space.

```html
<tp-card style="width: 20rem; height: 25rem">
  <dl>
    <dt>header</dt><dd>Card header</dd>
    <dt>footer</dt><dd>Card footer</dd>
    <dt>main</dt><dd><img src="landscape.jpg" alt="Landscape"></dd>
  </dl>
</tp-card>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the placement of the card header, main content and footer.

Image card
: Inspect the image and main content inside the card.

Icon card
: Inspect the icon and main content inside the card.
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
<!-- tp-docgen:api TpCard -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-card>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpCard`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-card>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-card-background</code> | <code>var(&#45;&#45;tp-paper-color, #fff)</code> | Card background. |
  | <code>&#45;&#45;tp-card-border-color</code> | <code>var(&#45;&#45;tp-neutral-stroke-soft, #d6d9df)</code> | Card border color. |
  | <code>&#45;&#45;tp-card-border-radius</code> | <code>var(&#45;&#45;tp-border-radius-lg, 0.5625rem)</code> | Card border radius. |
  | <code>&#45;&#45;tp-card-footer-background</code> | <code>var(&#45;&#45;tp-neutral-fill-softer, #f5f6f8)</code> | Footer background. |
  | <code>&#45;&#45;tp-card-header-background</code> | <code>var(&#45;&#45;tp-neutral-fill-softer, #f5f6f8)</code> | Header background. |
  | <code>&#45;&#45;tp-card-padding</code> | <code>1rem</code> | Section padding. |
  [CSS properties of `<tp-card>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_card.TpCard.html)
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
  <script type="module" src="/path/to/components/card/card.js"></script>
  ```

import
: ```js
  import "/path/to/components/card/card.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/card/card.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-card>` are loaded automatically by this component if they have not already been loaded by another component.

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
