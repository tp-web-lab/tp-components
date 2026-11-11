<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="dropdown" library="components" size="1.25em"></tp-icon> Dropdown

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-dropdown>` element displays an anchored dropdown menu.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-box data-intro-action="dropdown" data-allow-script="">
  <tp-button id="intro-dropdown-trigger" data-demo-trigger="">Open the menu</tp-button>
  <tp-dropdown anchor="#intro-dropdown-trigger" outside-click=""><ul><li><a href="/#/components/button/index.md">Buttons</a></li><li><a href="/#/components/tree/index.md">Trees</a></li></ul></tp-dropdown>
  <p data-demo-status="" role="status">Try the dropdown using its trigger.</p>
  <script src="/docs/components/_shared/introduction-actions.js"></script>
</tp-box>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-dropdown" src="/docs/components/dropdown/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-dropdown>` as shown below.

```html
<tp-dropdown></tp-dropdown>
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
  <script type="module" src="/path/to/components/dropdown/dropdown.js"></script>
  ```

import
: ```js
  import "/path/to/components/dropdown/dropdown.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/dropdown/dropdown.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open the dropdown and choose one of its documentation links.

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
