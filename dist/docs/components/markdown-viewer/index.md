<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="markdown-viewer" library="components" size="1.25em"></tp-icon> Markdown viewer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-markdown-viewer>` element provides an interactive Markdown viewer with editable source and parser outputs.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-markdown-viewer>
      <script type="tp/markdown">
        # Live Markdown

        Edit this source and select **Run**.
      </script>
    </tp-markdown-viewer>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-markdown-viewer" src="/docs/components/markdown-viewer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-markdown-viewer></tp-markdown-viewer>
  ```

internal script
: ```html
  <tp-markdown-viewer>
    <script type="tp/markdown">
      # Live Markdown

      Edit this source and select **Run**.

      - First item
      - Second item
    </script>
  </tp-markdown-viewer>
  ```
  The internal script may use `type="tp/markdown"` (recommended) or
  `type="tp/markdown-viewer"`.

  Consecutive fenced `example` blocks become independently selectable examples. Use `label` to
  define the selector label.

  ````html
  <tp-markdown-viewer>
    <script type="tp/markdown">
      ``` example {label="Paragraph and list"}
      A paragraph with **strong text** and *emphasis*.

      - Alpha
      - Beta
      ```

      ``` example {label="Table"}
      | Language | Purpose |
      | --- | --- |
      | Markdown | Technical writing |
      | HTML | Web documents |
      ```
    </script>
  </tp-markdown-viewer>
  ````

external file
: ```html
  <tp-markdown-viewer src="./example.md"></tp-markdown-viewer>
  ```
  Relative URLs are resolved from the current documentation source.

  The **src** attribute also accepts a comma-separated list of files. Each file becomes a
  selectable example and its file name is used as the label.

  ```html
  <tp-markdown-viewer src="./introduction.md, ./tables.md"></tp-markdown-viewer>
  ```
:::

### Lite viewer

Add `lite` for a compact viewer that processes only the first example and initially displays
only its rendered HTML. Its single toolbar toggles the code and output panes independently and
provides Reset and Run commands.

```html
<tp-markdown-viewer lite>
  <script type="tp/markdown">
    Hello **Markdown**.
  </script>
</tp-markdown-viewer>
```

<tp-markdown-viewer lite>
  <script type="tp/markdown">
    Hello **Markdown**.
  </script>
</tp-markdown-viewer>

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/markdown-viewer/markdown-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/markdown-viewer/markdown-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/markdown-viewer/markdown-viewer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied markdown example and open the source panel to compare it with the code.

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
@tp-dependency tp-markdown
@summary Markdown rendering component.
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
- [`<tp-html-viewer>`](#/components/html-viewer/index.md) : Interactive HTML viewer with editable source, live rendering, and DOM inspection.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-markdown>`](#/components/markdown/index.md) : Markdown rendering component.
- [`<tp-object-tree>`](#/components/object-tree/index.md) : Specialized tree for inspecting JavaScript values.
- [`<tp-switcher>`](#/components/switcher/index.md) : Component `<tp-switcher>`.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
