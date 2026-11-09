<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="solitaire" library="components" size="1.25em"></tp-icon> Solitaire

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-solitaire>` element displays a playable Klondike solitaire.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-solitaire></tp-solitaire>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-solitaire" src="/docs/components/solitaire/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Choose `deck-size="32"` or `deck-size="52"`. The default is 52. Choose the bundled OpenDecks back with `back="blue"` or `back="red"`.

```html
<tp-solitaire deck-size="52" back="blue"></tp-solitaire>
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
  <script type="module" src="/path/to/components/solitaire/solitaire.js"></script>
  ```

import
: ```js
  import "/path/to/components/solitaire/solitaire.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/solitaire/solitaire.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Play the card layout using the game’s available moves and controls.

32 cards with red back
: Play solitaire using the 32-card red-backed deck.
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
@tp-dependency tp-dragdrop
@summary Generic drag-and-drop controller for content.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-chronometer>`](#/components/chronometer/index.md) : Chronometer component with play, pause and stop controls.
- [`<tp-dragdrop>`](#/components/dragdrop/index.md) : Generic drag-and-drop controller for content.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
