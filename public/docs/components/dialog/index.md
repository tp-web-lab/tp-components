<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="dialog" library="components" size="1.25em"></tp-icon> Dialog

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-dialog>` element displays a confirm/cancel dialog.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-box data-intro-action="dialog" data-allow-script="">
  <tp-button id="intro-dialog-trigger" data-demo-trigger="">Open the confirmation dialog</tp-button>
  <tp-dialog></tp-dialog>
  <p data-demo-status="" role="status">Try the dialog using its trigger.</p>
  <script src="/docs/components/_shared/introduction-actions.js"></script>
</tp-box>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-dialog" src="/docs/components/dialog/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-dialog>` as shown below.

```html
<tp-dialog></tp-dialog>
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
  <script type="module" src="/path/to/components/dialog/dialog.js"></script>
  ```

import
: ```js
  import "/path/to/components/dialog/dialog.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/dialog/dialog.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open the confirmation dialog and try its available actions.

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
@summary This component has no tp-components dependencies.
-->
No internal dependency

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
