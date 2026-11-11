<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="theme" library="components" size="1.25em"></tp-icon> Theme

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-theme>` element switches the visual theme of the surrounding content.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<section>
      <tp-theme></tp-theme>
      <p>The selected theme is scoped to this section.</p>
      <code>Inline code follows the selected theme.</code>
    </section>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-theme" src="/docs/components/theme/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

`<tp-theme>` displays a theme button and applies either `tp-light` or `tp-dark` to its target. In `auto` mode, it follows the system color scheme.

The controller behaves like an icon button. Use `variant`, `size`, and
`disabled` to configure the internal `<tp-icon-button>`:

```html
<tp-theme variant="brand" size="s"></tp-theme>
<tp-theme disabled></tp-theme>
```

Place the component inside the element whose theme should be controlled:

```html
<section>
  <tp-theme></tp-theme>
  <p>This section follows the selected theme.</p>
</section>
```

Use `anchor` to target a specific element:

```html
<article id="preview">
  <p>The selected theme is applied here.</p>
</article>

<tp-theme anchor="#preview"></tp-theme>
```

Use `ui-anchor` when only the dropdown should be positioned elsewhere. The
selected theme is still applied to the `anchor` target when it is provided:

```html
<section>
  <span id="theme-position">Theme menu position</span>
  <tp-callout id="theme-preview">
    The selected theme is applied to this callout.
  </tp-callout>
</section>
<tp-theme ui-anchor="#theme-position" anchor="#theme-preview" style="float: right;"></tp-theme>
```

In this example, `anchor="#theme-preview"` makes the callout receive the
selected theme. `ui-anchor="#theme-position"` positions the dropdown next to
the label. The `style` attribute only moves the theme button itself in the
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
  <script type="module" src="/path/to/components/theme/theme.js"></script>
  ```

import
: ```js
  import "/path/to/components/theme/theme.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/theme/theme.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Choose a theme and observe how the content inside its scope changes appearance.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Local theme scope
: Change the theme of the local box without targeting the whole page.

Change event
: Change the theme setting and inspect the emitted tp-theme-change event.
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
