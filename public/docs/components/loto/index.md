<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="loto" library="components" size="1.25em"></tp-icon> Loto

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-loto>` element displays a playable French loto game.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-loto></tp-loto>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-loto" src="/docs/components/loto/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Add an empty `<tp-loto>` element for one ticket, which is the default. The ticket and the order of the 90-number draw are generated automatically.

```html
<tp-loto></tp-loto>
```

Set `cards` to an integer from 1 to 4 to display several independently generated tickets.

```html
<tp-loto cards="4"></tp-loto>
```

The chronometer starts with the first draw and pauses when the ticket is complete. Its controls are hidden. The refresh button resets the chronometer and generates both a new ticket and a new draw.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/loto/loto.js"></script>
  ```

import
: ```js
  import "/path/to/components/loto/loto.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/loto/loto.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the generated loto ticket and its arrangement of numbers.
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
@tp-dependency tp-chronometer
@summary Chronometer component with play, pause and stop controls.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-switcher
@summary Component `<tp-switcher>`.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-chronometer>`](#/components/chronometer/index.md) : Chronometer component with play, pause and stop controls.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-switcher>`](#/components/switcher/index.md) : Component `<tp-switcher>`.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
