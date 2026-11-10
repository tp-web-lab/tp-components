<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="glossary" library="components" size="1.25em"></tp-icon> Glossary

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-glossary>` element defines a hidden glossary entry for reference tooltips and generated lists.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<div data-tp-reference-scope="">
  <p>Read more <tp-ref href="%example"></tp-ref>.</p>
  <tp-glossary ref="example" title="Example"><p>Additional information with <strong>HTML content</strong>.</p></tp-glossary>
  <tp-listof selector="tp-glossary"></tp-listof>
</div>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-glossary" src="/docs/components/glossary/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `ref="identifier"` to identify this entry. Its HTML blocks remain hidden at their original location. A `tp-ref` shows them in a tooltip, and `tp-listof` displays their full content where the list is placed. Note numbers follow the first occurrence of each note in the text; repeated references reuse that number. Bibliography and glossary terms use their `ref` identifier.

The identifier does not include the prefix: use `^identifier` for `tp-note`, `@identifier` for `tp-biblio`, and `%identifier` for `tp-glossary` in a reference's `href`.

References and lists use the nearest `data-tp-reference-scope`, rendered markup document, `article` or `main`, falling back to the page body. Nested document scopes are independent. Identifiers should be unique within each reference kind and scope; the first matching definition is used for duplicates. Changes to definitions, labels and selected elements update existing tooltips and lists automatically.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/glossary/glossary.js"></script>
  ```

import
: ```js
  import "/path/to/components/glossary/glossary.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/glossary/glossary.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Hover or focus the reference to read its HTML content; inspect the same entry in the generated list.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-latex
: ::include{examples/examples-latex.html}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
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
