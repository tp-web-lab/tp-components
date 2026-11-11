<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="dir" library="components" size="1.25em"></tp-icon> Direction switcher

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-dir>` element switches the reading direction of the surrounding content.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box>
  <tp-dir></tp-dir>
  <p>Use the direction button to switch this paragraph between left-to-right and right-to-left layout.</p>
</tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-dir" src="/docs/components/dir/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

`<tp-dir>` displays a direction button and applies `dir="ltr"` or `dir="rtl"` to its target. In `auto` mode, it follows the document direction resolved from the root `<html>` `dir` and `lang` attributes. RTL detection supports language tags such as `ar` or `he`, and documentation region codes used as folders or flag codes, such as `ma`.

The controller behaves like an icon button. Use `variant`, `size`, and
`disabled` to configure the internal `<tp-icon-button>`:

```html
<tp-dir variant="brand" size="s"></tp-dir>
<tp-dir disabled></tp-dir>
```

Place the component inside the element whose reading direction should be controlled:

```html
<section>
  <tp-dir></tp-dir>
  <p>The reading direction of this section can be changed.</p>
</section>
```

Use `anchor` to target a specific element:

```html
<article id="direction-preview">
  <p>The selected direction is applied here.</p>
</article>
<tp-dir anchor="#direction-preview"></tp-dir>
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
  <script type="module" src="/path/to/components/dir/dir.js"></script>
  ```

import
: ```js
  import "/path/to/components/dir/dir.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/dir/dir.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Switch the reading direction and observe the layout of the example text.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Auto mode
: Observe the controller following the document’s reading direction in automatic mode.

Change event
: Change the dir setting and inspect the emitted tp-dir-change event.
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
