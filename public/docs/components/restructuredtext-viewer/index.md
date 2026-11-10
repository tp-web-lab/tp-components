<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="restructuredtext-viewer" library="components" size="1.25em"></tp-icon> reStructuredText viewer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-restructuredtext-viewer>` element provides an interactive reStructuredText viewer with editable source and parser outputs.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-restructuredtext-viewer>
        <script type="tp/restructuredtext">
          Live reStructuredText
          =====================

          Edit this source and select **Run**.

          * First item
          * Second item
        </script>
      </tp-restructuredtext-viewer>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-restructuredtext-viewer" src="/docs/components/restructuredtext-viewer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-restructuredtext-viewer></tp-restructuredtext-viewer>
  ```

internal script
: ```html
  <tp-restructuredtext-viewer>
    <script type="tp/restructuredtext">
      Live reStructuredText
      =====================

      Edit this source and select **Run**.

      * First item
      * Second item
    </script>
  </tp-restructuredtext-viewer>
  ```
  The internal script may use `type="tp/restructuredtext"` (recommended) or
  `type="tp/restructuredtext-viewer"`. It prevents the browser from
  interpreting the source as HTML before the component is initialized.

  Consecutive `.. example:: Label` directives become independently selectable examples. The
  directive argument is used as the selector label and its content becomes the editable source.

  ```html
  <tp-restructuredtext-viewer>
    <script type="tp/restructuredtext">
      .. example:: Paragraph and list

         A paragraph with **strong text** and *emphasis*.

         * Alpha
         * Beta

      .. example:: Table

         ================  =================
         Language          Purpose
         ================  =================
         reStructuredText  Technical writing
         HTML              Web documents
         ================  =================
    </script>
  </tp-restructuredtext-viewer>
  ```

external file
: ```html
  <tp-restructuredtext-viewer src="./example.rst"></tp-restructuredtext-viewer>
  ```
  Relative URLs are resolved from the current documentation source.

  The **src** attribute also accepts a comma-separated list of files. Each file becomes a
  selectable example and its file name is used as the label.

  ```html
  <tp-restructuredtext-viewer
    src="./introduction.rst, ./tables.rst"
  ></tp-restructuredtext-viewer>
  ```
:::

### Lite viewer

Add `lite` for a compact viewer that processes only the first example and initially displays
only its rendered HTML. Its single toolbar toggles the code and output panes independently and
provides Reset and Run commands.

```html
<tp-restructuredtext-viewer lite>
  <script type="tp/restructuredtext">
    Hello **reStructuredText**.
  </script>
</tp-restructuredtext-viewer>
```

<tp-restructuredtext-viewer lite>
  <script type="tp/restructuredtext">
    Hello **reStructuredText**.
  </script>
</tp-restructuredtext-viewer>

### Python doctests

Add `doctest` to execute standard Python doctest blocks in the rendered panel. The check remains
opt-in because it executes the Python prompts contained in the reStructuredText source.

```html
<tp-restructuredtext-viewer lite doctest>
  <script type="tp/restructuredtext">
    >>> print(6 * 7)
    42
  </script>
</tp-restructuredtext-viewer>
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
  <script type="module" src="/path/to/components/restructuredtext-viewer/restructuredtext-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/restructuredtext-viewer/restructuredtext-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/restructuredtext-viewer/restructuredtext-viewer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied restructuredtext example and open the source panel to compare it with the code.

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
@tp-dependency tp-html-viewer
@summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
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
@tp-dependency tp-restructuredtext
@summary reStructuredText rendering component.
-->
<!--
@tp-dependency tp-switcher
@summary Component `<tp-switcher>`.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-html-viewer>`](#/components/html-viewer/index.md) : Interactive HTML viewer with editable source, live rendering, and DOM inspection.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-object-tree>`](#/components/object-tree/index.md) : Specialized tree for inspecting JavaScript values.
- [`<tp-restructuredtext>`](#/components/restructuredtext/index.md) : reStructuredText rendering component.
- [`<tp-switcher>`](#/components/switcher/index.md) : Component `<tp-switcher>`.

### External

<!--
@credit tp-restructuredtext https://www.npmjs.com/package/@tp/tp-restructuredtext
@summary reStructuredText parsing and rendering.
-->

- [tp-restructuredtext](https://www.npmjs.com/package/@tp/tp-restructuredtext) : reStructuredText parsing and rendering.
<!-- tp-docgen:dependencies:end -->
