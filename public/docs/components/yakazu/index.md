<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="yakazu" library="components" size="1.25em"></tp-icon> Yakazu

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-yakazu>` element presents a Yakazu number puzzle with pencil marks, validation and undo controls.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-yakazu>
      <ol>
      <li>25431#9#4!</li>
      <li>1#1524673</li>
      <li>#13!2#12#2</li>
      <li>2#563274!1</li>
      <li>12674385!#</li>
      <li>34!21!5#1!2#</li>
      <li>#1#412563</li>
      <li>2!31#2!#312</li>
      <li>1#21#2431</li>
      </ol>
      </tp-yakazu>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-yakazu" src="/docs/components/yakazu/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-yakazu>` as shown below.

```html
<tp-yakazu>
<ol>
<li>25431#9#4!</li>
<li>1#1524673</li>
<li>#13!2#12#2</li>
<li>2#563274!1</li>
<li>12674385!#</li>
<li>34!21!5#1!2#</li>
<li>#1#412563</li>
<li>2!31#2!#312</li>
<li>1#21#2431</li>
</ol>
</tp-yakazu>
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
  <script type="module" src="/path/to/components/yakazu/yakazu.js"></script>
  ```

import
: ```js
  import "/path/to/components/yakazu/yakazu.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/yakazu/yakazu.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Complete the number grid while respecting the constraints of its horizontal and vertical runs.
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
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
