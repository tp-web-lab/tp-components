<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="flip-card" library="components" size="1.25em"></tp-icon> Flip card

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-flip-card>` element displays a two-sided card.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-flip-card>
<dl>
  <dt>recto</dt><dd><p>This is the content <strong>recto...</strong></p></dd>
  <dt>verso</dt><dd><p>...and here is the content <strong>verso.</strong></p></dd>
</dl>
</tp-flip-card>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-flip-card" src="/docs/components/flip-card/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Place a definition list inside `<tp-flip-card>`. The `recto` and `verso` entries are both required. Their content can contain text, images, SVG, or other `tp-*` components.

```html
<tp-flip-card>
  <dl>
    <dt>recto</dt><dd>This is the content recto...</dd>
    <dt>verso</dt><dd>...and here is the content verso.</dd>
  </dl>
</tp-flip-card>
```

The flip button is overlaid on the card. Its position combines `top` or `bottom` with `start`, `center`, or `end`. The default is `bottom end`.

```html
<tp-flip-card button-position="top start">
  <dl>
    <dt>recto</dt><dd>This is the content recto...</dd>
    <dt>verso</dt><dd>...and here is the content verso.</dd>
  </dl>
</tp-flip-card>
```

Set `button-position="none"` to hide the button. The card can then be flipped by clicking anywhere on its surface, or with Enter and Space from the keyboard.

```html
<tp-flip-card button-position="none">
  <dl>
    <dt>recto</dt><dd>This is the content recto...</dd>
    <dt>verso</dt><dd>...and here is the content verso.</dd>
  </dl>
</tp-flip-card>
```

The boolean `flipped` attribute controls the visible side. The `flip()` method and the `tp-flip-card-change` event allow game logic to control each card independently. A `tp-grid` or `tp-slider` can therefore contain a 32-card or 52-card deck for a future patience or memory game.

Add the boolean `disabled` attribute to prevent the card from being flipped by the button or by the `flip()` method.

```html
<tp-flip-card disabled>
  <dl>
    <dt>recto</dt><dd>This is the content recto...</dd>
    <dt>verso</dt><dd>...and here is the content verso.</dd>
  </dl>
</tp-flip-card>
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
  <script type="module" src="/path/to/components/flip-card/flip-card.js"></script>
  ```

import
: ```js
  import "/path/to/components/flip-card/flip-card.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/flip-card/flip-card.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Flip the card to inspect its front and back content.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Hearts suit
: Flip each of the thirteen hearts cards in the cluster by clicking it, or using Enter or Space when focused. Each card turns independently and the cluster wraps to fit the available width.
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
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
