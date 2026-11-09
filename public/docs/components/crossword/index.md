<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="crossword" library="components" size="1.25em"></tp-icon> Crossword

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-crossword>` element displays an interactive crossword puzzle.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-crossword>
  <dl>
    <dt>solution</dt><dd><ol><li>BALL</li><li>AREA</li><li>LEAD</li><li>LADY</li></ol></dd>
    <dt>across</dt><dd><ol><li>A. A round toy used in many sports</li><li>B. The size of a surface</li><li>C. A heavy metal</li><li>D. A polite word for a woman</li></ol></dd>
    <dt>down</dt><dd><ol><li>1. A round toy used in many sports</li><li>2. The size of a surface</li><li>3. A heavy metal</li><li>4. A polite word for a woman</li></ol></dd>
  </dl>
</tp-crossword>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-crossword" src="/docs/components/crossword/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-crossword>` as shown below.

```html
<tp-crossword>
<dl>
<dt>solution</dt>
<dd>
<ol>
<li>CHAT</li>
<li>HIER</li>
<li>AIRE</li>
<li>TRES</li>
</ol>
</dd>
<dt>across</dt>
<dd>
<ol>
<li>A. Félin domestique</li>
<li>B. Le jour précédent</li>
<li>C. Surface</li>
<li>D. Beaucoup</li>
</ol>
</dd>
<dt>down</dt>
<dd>
<ol>
<li>1. Félin domestique</li>
<li>2. Le jour précédent</li>
<li>3. Purifie</li>
<li>4. Beaucoup</li>
</ol>
</dd>
</dl>
</tp-crossword>
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
  <script type="module" src="/path/to/components/crossword/crossword.js"></script>
  ```

import
: ```js
  import "/path/to/components/crossword/crossword.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/crossword/crossword.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Use the across and down clues to complete the crossword grid.
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
