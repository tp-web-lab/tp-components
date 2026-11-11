<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="icon-button" library="components" size="1.25em"></tp-icon> Icon button

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-icon-button>` element provides an icon action button with an accessible text label.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-box data-intro-action="counter" data-allow-script="">
  <p>Activate the heart button to add a like.</p>
  <tp-icon-button name="heart" label="Like this example" data-demo-trigger=""></tp-icon-button>
  <p data-demo-status="" role="status">Likes: 0</p>
  <script src="/docs/components/_shared/introduction-actions.js"></script>
</tp-box>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-icon-button" src="/docs/components/icon-button/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

<tp-icon-button name="delete" label="Delete" color="crimson"></tp-icon-button>

Like `tp-button`, this component supports `href`, `target`, `rel`, `download`, `disabled`, `loading`, `loading-mode`, `outlined`, `pill`, `type`, `variant`, and `size`. A nonempty `href` creates a native link; removing it restores a native button. `loading-mode="replace"` replaces the icon with a spinner; `inline` keeps both visible.

Always provide `label` for an accessible name. Icon attributes such as `library`, `color`, `size`, `scale`, `rotate`, `flip-h`, `flip-v`, and `spin` are forwarded to the internal icon.

```html
<tp-icon-button name="home" href="./" label="Home"></tp-icon-button>
<tp-icon-button name="delete" label="Delete" color="crimson"></tp-icon-button>
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
  <script type="module" src="/path/to/components/icon-button/icon-button.js"></script>
  ```

import
: ```js
  import "/path/to/components/icon-button/icon-button.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/icon-button/icon-button.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Activate the heart button and observe the updated like count.

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
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
