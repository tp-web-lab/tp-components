<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="popover" library="components" size="1.25em"></tp-icon> Popover

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-popover>` element displays anchored popover content.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-box data-intro-action="popover" data-allow-script="">
  <tp-button id="intro-popover-trigger" data-demo-trigger="">Show more information</tp-button>
  <tp-popover anchor="#intro-popover-trigger" outside-click=""><p>This panel contains additional information.</p><tp-button data-demo-close="">Close</tp-button></tp-popover>
  <p data-demo-status="" role="status">Try the popover using its trigger.</p>
  <script src="/docs/components/_shared/introduction-actions.js"></script>
</tp-box>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-popover" src="/docs/components/popover/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-popover>` as shown below.

```html
<tp-popover></tp-popover>
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
  <script type="module" src="/path/to/components/popover/popover.js"></script>
  ```

import
: ```js
  import "/path/to/components/popover/popover.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/popover/popover.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open the information popover from its trigger, then close it.

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
