<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="callout" library="components" size="1.25em"></tp-icon> Callout

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-callout>` element highlights a short message with an optional heading, icon and close button.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-callout variant="info" heading="Information">
  The workshop starts at 9:00.
</tp-callout>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-callout" src="/docs/components/callout/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

To highlight a fragment of HTML, simply wrap it in the `<tp-callout>` element.

``` html
<p>Here is a paragraph.</p>

<tp-callout>
  <p>Here is a paragraph enclosed within the <code>tp-callout</code> element.</p>
</tp-callout>
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
  <script type="module" src="/path/to/components/callout/callout.js"></script>
  ```

import
: ```js
  import "/path/to/components/callout/callout.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/callout/callout.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the highlighted workshop notice and its heading.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Dismissible notice
: Dismiss the saved confirmation with its Close button.

Outlined warning
: Compare the outlined warning with the filled introductory notice.
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
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
