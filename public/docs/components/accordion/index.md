<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="accordion" library="components" size="1.25em"></tp-icon> Accordion

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-accordion>` element organizes content into sections that readers can expand and collapse.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-accordion open-indexes="1">
    <dl>
      <dt>What is HTML?</dt><dd>The language used to structure web pages.</dd>
      <dt>What is CSS?</dt><dd>The language used to style web pages.</dd>
      <dt>What is Javascript?</dt><dd>The language used to define the behaviour of web pages.</dd>
    </dl>
    </tp-accordion>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-accordion" src="/docs/components/accordion/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `multiple` to keep several sections open and `open-indexes` with space-separated, zero-based indexes to choose the initially open sections. Use `appearance="default"` for items separated by horizontal rules, `appearance="outlined"` for framed items, or `appearance="filled"` for framed items filled with the brand color.

```html
<tp-accordion appearance="filled" open-indexes="1">
  <dl>
    <dt>What is HTML?</dt><dd>The language used to structure web pages.</dd>
    <dt>What is CSS?</dt><dd>The language used to style web pages.</dd>
    <dt>What is Javascript?</dt><dd>The language used to define the behaviour of web pages.</dd>
  </dl>
</tp-accordion>
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
  <script type="module" src="/path/to/components/accordion/accordion.js"></script>
  ```

import
: ```js
  import "/path/to/components/accordion/accordion.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/accordion/accordion.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Expand and collapse the questions to reveal their answers.

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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
