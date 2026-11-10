<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="button" library="components" size="1.25em"></tp-icon> Button

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-button>` element provides an action button or navigation link, with configurable appearance and loading feedback.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-button href="/#/components/button/index.md#usage">Read the usage guide</tp-button>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-button" src="/docs/components/button/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

<tp-button outlined>Cancel</tp-button>
<tp-button href="#programming">Read the API</tp-button>

Without `href`, the component creates a native button. With `href`, it creates a link and forwards `target`, `rel`, and `download`.

```html
<tp-button variant="primary">Continue</tp-button>
<tp-button outlined>Cancel</tp-button>
<tp-button href="#programming">Read the API</tp-button>
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
  <script type="module" src="/path/to/components/button/button.js"></script>
  ```

import
: ```js
  import "/path/to/components/button/button.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/button/button.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Activate the button to follow its documentation link.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Navigation link
: Open the destination in a new tab using a button rendered as a link.

Unavailable action
: Compare the disabled action with the active introductory button.
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
