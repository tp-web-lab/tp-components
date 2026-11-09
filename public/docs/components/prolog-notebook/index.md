<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="prolog-notebook" library="components" size="1.25em"></tp-icon> Prolog Notebook

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-prolog-notebook>` element combines written explanations and executable Prolog code in an interactive notebook.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-prolog-notebook>
      <script type="tp/markdown">
        # Family relations

        Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.
      </script>
      <script type="tp/prolog" filename="program.pl">
        parent(ada, byron).
        parent(byron, charles).

        grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
      </script>
      <script type="tp/prolog" filename="query.pl">
        grandparent(ada, Grandchild).
      </script>
  </tp-prolog-notebook>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-prolog-notebook" src="/docs/components/prolog-notebook/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-prolog-notebook></tp-prolog-notebook>
  ```

inline scripts
: ```html
  <tp-prolog-notebook>
    <script type="tp/markdown"># Family relations</script>
    <script type="tp/prolog" filename="program.pl">
      parent(ada, byron).
    </script>
    <script type="tp/prolog" filename="query.pl">
      parent(ada, X).
    </script>
  </tp-prolog-notebook>
  ```

external file
: ```html
  <tp-prolog-notebook src="./notebook.json"></tp-prolog-notebook>
  ```

  ```json
  {
    "name": "Family relations",
    "cells": [
      { "type": "markup", "language": "markdown", "content": "# Family relations" },
      {
        "type": "code",
        "language": "prolog",
        "files": [
          { "filename": "program.pl", "content": "parent(ada, byron)." },
          { "filename": "query.pl", "content": "parent(ada, X)." }
        ]
      }
    ]
  }
  ```

repository
: ```html
  <tp-prolog-notebook repository="./notebook/"></tp-prolog-notebook>
  ```

  The directory contains `project.json`, `.files.json`, and the files referenced by the cells. In `project.json`, a cell `content` or file `content` may contain a repository path instead of inline content.
:::

The same interface is available as `<tp-javascript-notebook>`, `<tp-typescript-notebook>`, `<tp-python-notebook>`, and `<tp-sql-notebook>`.

### Authoring

The notebook remains a complete block editor. Preview and Export HTML turn markup cells into rendered HTML while preserving the interactive Prolog viewers.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/prolog-notebook/prolog-notebook.js"></script>
  ```

import
: ```js
  import "/path/to/components/prolog-notebook/prolog-notebook.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/prolog-notebook/prolog-notebook.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Run the prolog notebook cells and inspect their outputs.
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
@tp-dependency tp-notebook
@summary Interactive notebook combining markup and executable code cells.
-->

- [`<tp-notebook>`](#/components/notebook/index.md) : Interactive notebook combining markup and executable code cells.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
