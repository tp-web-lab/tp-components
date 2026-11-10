<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="animation" library="components" size="1.25em"></tp-icon> Animation

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-animation>` element animates a target element and provides playback controls.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-animation in="fadeIn" trigger="load" duration="800ms">
    <tp-box>Animated content</tp-box>
  </tp-animation>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-animation" src="/docs/components/animation/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Choose an animate.css name with `in` or `out`, then select a `load`, `click`, `hover`, `manual`, or `intersection` trigger.

```html
<tp-animation in="fadeIn" trigger="load" duration="800ms">
  <tp-box>Animated content</tp-box>
</tp-animation>
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
  <script type="module" src="/path/to/components/animation/animation.js"></script>
  ```

import
: ```js
  import "/path/to/components/animation/animation.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/animation/animation.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Watch the content fade in when the example loads.

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
