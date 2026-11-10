<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="typescript-viewer" library="components" size="1.25em"></tp-icon> TypeScript Viewer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-typescript-viewer>` element displays and runs one TypeScript example in a compact interface.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-typescript-viewer src="/docs/components/_shared/intro-projects/typescript.json"></tp-typescript-viewer>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-typescript-viewer" src="/docs/components/typescript-viewer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-typescript-viewer></tp-typescript-viewer>
  ```
  Without explicit content, the viewer opens its default TypeScript example.

internal script
: ```html
  <tp-typescript-viewer>
    <script type="tp/typescript">
      const message: string = 'Hello TypeScript';
      console.log(message);
    </script>
  </tp-typescript-viewer>
  ```
  The internal script may use `type="tp/typescript"` (recommended) or
  `type="tp/typescript-viewer"`. Its content is dedented before it replaces the project's main file.

external project
: ```html
  <tp-typescript-viewer src="./example.json"></tp-typescript-viewer>
  ```
  The `src` file describes the complete project, including its entry point and files.

project directory
: ```html
  <tp-typescript-viewer repository="./example/"></tp-typescript-viewer>
  ```
  The `repository` directory contains the project metadata and files.
:::

### Authoring

The `src` attribute accepts either a JSON project or a single typescript source file (`.ts`). For a source file, the component creates a project using its filename as the entry point and adds an `index.html` containing `<main id="app"></main>`.

```html
<tp-typescript-viewer src="/docs/components/_shared/single-source/example.ts"></tp-typescript-viewer>
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
  <script type="module" src="/path/to/components/typescript-viewer/typescript-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/typescript-viewer/typescript-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/typescript-viewer/typescript-viewer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied typescript example and open the source panel to compare it with the code.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

src
: Inspect the output produced by loading the external source file.

script
: Inspect the output produced from the embedded source script.

error
: Run the intentionally failing example and inspect the reported error.

Single source file
: Load the standalone typescript file through src and inspect its output. Open the source editor to inspect the file used as the generated project's entry point.
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
@tp-dependency tp-typescript-playground
@summary TypeScript playground component.
-->

- [`<tp-typescript-playground>`](#/components/typescript-playground/index.md) : TypeScript playground component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
