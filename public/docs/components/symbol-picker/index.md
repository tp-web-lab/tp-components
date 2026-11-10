<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="symbol-picker" library="components" size="1.25em"></tp-icon> Symbol picker

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-symbol-picker>` element lets readers browse and select HTML symbols.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-symbol-picker></tp-symbol-picker>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-symbol-picker" src="/docs/components/symbol-picker/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `filter` to search symbol names, entities, groups, glyphs, or code points. Use `group` to restrict the list and `copy` to preselect the clipboard format.

```html
<tp-symbol-picker filter="arrow"></tp-symbol-picker>
<tp-symbol-picker group="Mathematics" copy="html-entity"></tp-symbol-picker>
<tp-symbol-picker compact filter="arrow"></tp-symbol-picker>
```

The picker exposes each symbol’s Unicode notation, hexadecimal and decimal HTML references, and canonical named HTML entity. Aliases are also searchable and shown beside the selected symbol.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/symbol-picker/symbol-picker.js"></script>
  ```

import
: ```js
  import "/path/to/components/symbol-picker/symbol-picker.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/symbol-picker/symbol-picker.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Browse the symbols and select one using the picker controls.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
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
<!--
@tp-dependency tp-radio-list
@summary Transforms a list into a group of radio buttons.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-radio-list>`](#/components/radio-list/index.md) : Transforms a list into a group of radio buttons.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
