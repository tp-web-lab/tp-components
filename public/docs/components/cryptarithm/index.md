<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="cryptarithm" library="components" size="1.25em"></tp-icon> Cryptarithm

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-cryptarithm>` element displays an interactive cryptarithm puzzle.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-cryptarithm equation="SEND + MORE = MONEY" solution="9567 + 1085 = 10652"></tp-cryptarithm>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-cryptarithm" src="/docs/components/cryptarithm/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Set `equation` to an addition written with letters and `solution` to the matching numeric addition. Both attributes must contain the same number of terms, and every word and its numeric value must have the same length.

```html
<tp-cryptarithm
  equation="SEND + MORE = MONEY"
  solution="9567 + 1085 = 10652">
</tp-cryptarithm>
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
  <script type="module" src="/path/to/components/cryptarithm/cryptarithm.js"></script>
  ```

import
: ```js
  import "/path/to/components/cryptarithm/cryptarithm.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/cryptarithm/cryptarithm.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Assign digits to letters so that the displayed arithmetic equation is correct.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

UN + UN + NEUF = ONZE
: Assign digits to letters to solve the equation UN + UN + NEUF = ONZE.

CINQ + CINQ + VINGT = TRENTE
: Assign digits to letters to solve the equation CINQ + CINQ + VINGT = TRENTE.

ZERO + NEUF + NEUF + DOUZE = TRENTE
: Assign digits to letters to solve the equation ZERO + NEUF + NEUF + DOUZE = TRENTE.
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
