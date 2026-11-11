<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="html-viewer" library="components" size="1.25em"></tp-icon> HTML viewer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-html-viewer>` element provides an interactive HTML viewer with editable source, live rendering, and DOM inspection.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-html-viewer>
  <script type="tp/html">
<h2>Hello, HTML!</h2>
<p>This preview renders <strong>HTML content</strong>.</p>
  </script>
</tp-html-viewer>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-html-viewer" src="/docs/components/html-viewer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-html-viewer></tp-html-viewer>
  ```

internal script
: ```html
  <tp-html-viewer>
    <script type="tp/html">
      <h2>Live HTML</h2>
      <p>Edit this source and select <strong>Run</strong>.</p>
    </script>
  </tp-html-viewer>
  ```
  The internal script may use `type="tp/html"` (recommended) or its viewer-specific alias
  `type="tp/html-viewer"`.

  Consecutive `div[role="example"]` elements become independently selectable examples. Use the
  `label` attribute to define the selector label.

  ```html
  <tp-html-viewer>
    <script type="tp/html">
      <div role="example" label="Paragraph">
        <p>A paragraph with <strong>strong text</strong>.</p>
      </div>

      <div role="example" label="Button">
        <button type="button">Continue</button>
      </div>
    </script>
  </tp-html-viewer>
  ```

external file
: ```html
  <tp-html-viewer src="./example.html"></tp-html-viewer>
  ```
  Relative URLs inside the loaded document are resolved from the external file directory.
:::

### Lite viewer

Add `lite` for a compact viewer that processes only the first example and initially displays
only its rendered HTML. Its single toolbar toggles the code and output panes independently and
provides Reset and Run commands.

```html
<tp-html-viewer lite>
  <script type="tp/html"><p>Hello <strong>HTML</strong>.</p></script>
</tp-html-viewer>
```

<tp-html-viewer lite>
  <script type="tp/html"><p>Hello <strong>HTML</strong>.</p></script>
</tp-html-viewer>

### Manually imported components

Add `no-loader` when an executable example imports every dependency itself or defines a tutorial-only `tp-*` element in its script. This prevents the viewer from asking `tp-loader` to locate a production component module for that local tag.

```html
<tp-html-viewer allow-script no-loader>
  <!-- The example script imports or defines every component it uses. -->
</tp-html-viewer>
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
  <script type="module" src="/path/to/components/html-viewer/html-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/html-viewer/html-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/html-viewer/html-viewer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied html example and open the source panel to compare it with the code.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Multiple examples
: Switch between the named examples and compare their source and rendered output.
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
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-object-tree
@summary Specialized tree for inspecting JavaScript values.
-->
<!--
@tp-dependency tp-switcher
@summary Component `<tp-switcher>`.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-object-tree>`](#/components/object-tree/index.md) : Specialized tree for inspecting JavaScript values.
- [`<tp-switcher>`](#/components/switcher/index.md) : Component `<tp-switcher>`.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
