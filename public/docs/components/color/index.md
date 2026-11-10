<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="color" library="components" size="1.25em"></tp-icon> Color

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-color>` element changes the color scheme of the surrounding content.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<section>
      <tp-color></tp-color>
      <p>The selected brand color is scoped to this section.</p>
      <code>Inline code uses the selected brand colour.</code>
    </section>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-color" src="/docs/components/color/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

<p>The selected brand color is scoped to this section.</p>
<p><code>Inline code</code> is displayed in the brand colour.</p>

### Authoring

`<tp-color>` displays a palette button and applies one of the built-in brand color classes to its target. By default, the target is the containing element. When `anchor` points to an element, that element is used instead.

The controller behaves like an icon button. Use `variant`, `size`, and
`disabled` to configure the internal `<tp-icon-button>`:

```html
<tp-color variant="brand" size="s"></tp-color>
<tp-color disabled></tp-color>
```

Place the component inside the element whose brand color should be controlled:

```html
<section>
  <tp-color></tp-color>
  <p>This section receives the selected brand color.</p>
</section>
```

Use `anchor` for an explicit target:

```html
<article id="preview">
  <p>The selected preset is applied here.</p>
</article>
<tp-color anchor="#preview"></tp-color>
```

Use `ui-anchor` when only the dropdown should be positioned elsewhere. The
selected preset is still applied to the `anchor` target when it is provided:

```html
<section>
  <span id="palette-position">Palette position</span>
  <tp-callout variant="brand" id="callout">
    The callout receives the selected preset.
  </tp-callout>
</section>
<tp-color ui-anchor="#palette-position" anchor="#callout" style="float: right;"></tp-color>
```

In this example, `anchor="#callout"` makes the callout receive the selected
brand preset. `ui-anchor="#palette-position"` positions the dropdown next to
the label. The `style` attribute only moves the palette button itself in the
page layout.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/color/color.js"></script>
  ```

import
: ```js
  import "/path/to/components/color/color.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/color/color.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Choose a brand color and observe the content inside its color scope.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Local color scope
: Change the brand color of the local box without targeting the whole page.

Change event
: Change the color setting and inspect the emitted tp-color-change event.
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
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
