<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="filesystem" library="components" size="1.25em"></tp-icon> Filesystem

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-filesystem>` element organizes project files and folders in an editable tree.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-box data-intro-action="filesystem" data-allow-script="">
  <p>Expand the folders and select a file in this in-memory example.</p>
  <tp-filesystem></tp-filesystem>
  <p data-demo-status="" role="status">Select a file to see its path.</p>
  <script src="/docs/components/_shared/introduction-actions.js"></script>
</tp-box>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-filesystem" src="/docs/components/filesystem/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-filesystem>` as shown below.

```html
<tp-filesystem></tp-filesystem>
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
  <script type="module" src="/path/to/components/filesystem/filesystem.js"></script>
  ```

import
: ```js
  import "/path/to/components/filesystem/filesystem.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/filesystem/filesystem.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Expand folders and select a file to display its path in the in-memory file system.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
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
@tp-dependency tp-file-tree
@summary Displays an interactive file and folder tree.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-file-tree>`](#/components/file-tree/index.md) : Displays an interactive file and folder tree.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
