<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="javascript-viewer" library="components" size="1.25em"></tp-icon> JavaScript Viewer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-javascript-viewer>` element displays and runs one JavaScript example in a compact interface.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-javascript-viewer src="/docs/components/_shared/intro-projects/javascript.json"></tp-javascript-viewer>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-javascript-viewer" src="/docs/components/javascript-viewer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-javascript-viewer></tp-javascript-viewer>
  ```
  Without explicit content, the viewer opens its default JavaScript example.

internal script
: ```html
  <tp-javascript-viewer>
    <script type="tp/javascript">
      const message = 'Hello JavaScript';
      console.log(message);
    </script>
  </tp-javascript-viewer>
  ```
  The internal script may use `type="tp/javascript"` (recommended) or
  `type="tp/javascript-viewer"`. Its content is dedented before it replaces the project's main file.

external project
: ```html
  <tp-javascript-viewer src="./example.json"></tp-javascript-viewer>
  ```
  The `src` file describes the complete project, including its entry point and files.

project directory
: ```html
  <tp-javascript-viewer repository="./example/"></tp-javascript-viewer>
  ```
  The `repository` directory contains the project metadata and files.
:::

### Authoring

The `src` attribute accepts either a JSON project or a single javascript source file (`.js`). For a source file, the component creates a project using its filename as the entry point and adds an `index.html` containing `<main id="app"></main>`.

```html
<tp-javascript-viewer src="/docs/components/_shared/single-source/example.js"></tp-javascript-viewer>
```

Source contents are preserved. URL query parameters do not affect extension detection. Dependencies and companion files are not fetched automatically: use a JSON project or `repository` for multiple files. Source priority remains `src`, then `repository`, then internal content. Missing or incompatible files produce a console error. Existing JSON sources, including extensionless URLs, remain supported.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/javascript-viewer/javascript-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/javascript-viewer/javascript-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/javascript-viewer/javascript-viewer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied javascript example and open the source panel to compare it with the code.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

src
: Inspect the output produced by loading the external source file.

script
: Inspect the output produced from the embedded source script.

error
: Run the intentionally failing example and inspect the reported error.

Single source file
: Load the standalone javascript file through src and inspect its output. Open the source editor to inspect the file used as the generated project's entry point.
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
@tp-dependency tp-javascript-playground
@summary JavaScript playground component.
-->

- [`<tp-javascript-playground>`](#/components/javascript-playground/index.md) : JavaScript playground component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
