<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="card" library="components" size="1.25em"></tp-icon> Card

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-card>` element displays a structured card.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-card>
        <dl>
          <dt>header</dt><dd>content header</dd>
          <dt>footer</dt><dd>content footer</dd>
          <dt>main</dt><dd>content body</dd>
        </dl>
      </tp-card>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-card" src="/docs/components/card/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

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

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the placement of the card header, main content and footer.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Image card
: Inspect the image and main content inside the card.

Icon card
: Inspect the icon and main content inside the card.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> HTML
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_latex" library="languages" size="1.25em"></tp-icon> tp-latex
: ::include{examples/examples-latex.html}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
