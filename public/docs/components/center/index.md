<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="center" library="components" size="1.25em"></tp-icon> Center

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-center>` element centers content within a page or container.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-center intrinsic="">
      <tp-box>Centered content</tp-box>
    </tp-center>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-center" src="/docs/components/center/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Wrap intrinsically sized content in `<tp-center intrinsic>` to center it within the available inline space.

```html
<tp-center intrinsic>
  <tp-box>Centered content</tp-box>
</tp-center>
```

Use `max-inline-size` to constrain and center a wider region. Use `center-text` to center inline text inside that region.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/center/center.js"></script>
  ```

import
: ```js
  import "/path/to/components/center/center.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/center/center.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Resize the available area and observe how the content remains centered.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Constrained region
: Compare the same text in two visibly outlined containers with centered regions limited to 18rem and 36rem. The narrower region wraps onto more lines; resize the preview to see both regions adapt to the available width.
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
