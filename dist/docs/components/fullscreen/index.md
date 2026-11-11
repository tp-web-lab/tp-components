<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="fullscreen" library="components" size="1.25em"></tp-icon> Fullscreen

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-fullscreen>` element switches content between fullscreen and its normal display.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box>
      <tp-fullscreen></tp-fullscreen>
      <p>This box is the fullscreen target.</p>
      <p>Press Esc to exit fullscreen mode.</p>
    </tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-fullscreen" src="/docs/components/fullscreen/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

`<tp-fullscreen>` toggles fullscreen mode for an anchored element or, when `anchor` is omitted, for the component that contains it. It skips toolbar-like containers when resolving the containing component.

The controller behaves like an icon button. Use `variant`, `size`, and
`disabled` to configure the internal `<tp-icon-button>`:

```html
<tp-fullscreen variant="brand" size="s"></tp-fullscreen>
<tp-fullscreen disabled></tp-fullscreen>
```

Use `anchor` to target a specific element:

```html
<section id="preview">
  <p>This section can enter fullscreen mode.</p>
</section>

<tp-fullscreen anchor="#preview"></tp-fullscreen>
```

Place the button inside a component toolbar to control the containing component:

```html
<tp-box>
  <tp-toolbar>
    <tp-fullscreen></tp-fullscreen>
  </tp-toolbar>
  <p>The box is the fullscreen target.</p>
  <p>Press Esc to exit full-screen mode.</p>
</tp-box>
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
  <script type="module" src="/path/to/components/fullscreen/fullscreen.js"></script>
  ```

import
: ```js
  import "/path/to/components/fullscreen/fullscreen.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/fullscreen/fullscreen.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Enter fullscreen for the target box, then leave fullscreen using the control or Escape.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Toolbar control
: Enter and exit fullscreen from the toolbar while keeping the containing box as the target.

Change event
: Change the fullscreen setting and inspect the emitted tp-fullscreen-change event.
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
