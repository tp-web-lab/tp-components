<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="sql-viewer" library="components" size="1.25em"></tp-icon> SQL Viewer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-sql-viewer>` element displays and runs one SQL example in a compact interface.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box>
  <p>The query lists three European capitals. Expand the query in the result panel to see its rows.</p>
  <tp-sql-viewer src="/docs/components/_shared/intro-projects/sql.json"></tp-sql-viewer>
</tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-sql-viewer" src="/docs/components/sql-viewer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-sql-viewer></tp-sql-viewer>
  ```
  Without explicit content, the viewer opens its default SQL example in two editors: `tables.sql` and `query.sql`.

script without filename
: ```html
  <tp-sql-viewer>
    <script type="tp/sql">
      CREATE TABLE users (name TEXT NOT NULL);
      INSERT INTO users (name) VALUES ('Ada'), ('Grace');
    </script>
  </tp-sql-viewer>
  ```
  A single script without `filename` initializes `tables.sql`; the viewer creates an empty `query.sql` editor.

scripts with filename
: ```html
  <tp-sql-viewer>
    <script type="tp/sql" filename="tables.sql">
      CREATE TABLE users (name TEXT NOT NULL);
      INSERT INTO users (name) VALUES ('Ada'), ('Grace');
    </script>
    <script type="tp/sql" filename="query.sql">
      SELECT name
      FROM users
      ORDER BY name;
    </script>
  </tp-sql-viewer>
  ```
  Internal scripts may use `type="tp/sql"` (recommended) or `type="tp/sql-viewer"`.
  Use `filename="tables.sql"` and `filename="query.sql"` to initialize the two editors. Their content is dedented before it is added to the project.

external project
: ```html
  <tp-sql-viewer src="./example.json"></tp-sql-viewer>
  ```
  The `src` file describes the complete project, including its entry point and files.

project directory
: ```html
  <tp-sql-viewer repository="./example/"></tp-sql-viewer>
  ```
  The `repository` directory contains the project metadata and files.
:::

The SQL viewer displays `tables.sql` and `query.sql` in two labeled editors. Define the database tables and initial data in `tables.sql`, then write the statement to execute in `query.sql`.

### Authoring

The `src` attribute accepts either a JSON project or a single sql source file (`.sql`). For a source file, the component creates a project using its filename as the entry point and adds an `index.html` containing `<main id="app"></main>`.

```html
<tp-sql-viewer src="/docs/components/_shared/single-source/example.sql"></tp-sql-viewer>
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
  <script type="module" src="/path/to/components/sql-viewer/sql-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/sql-viewer/sql-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/sql-viewer/sql-viewer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied sql example and open the source panel to compare it with the code.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

src
: Inspect the output produced by loading the external source file.

script without filename
: Inspect the output produced from the embedded source script.

scripts with filename
: Inspect the output produced from embedded scripts with explicit filenames.

error
: Run the intentionally failing example and inspect the reported error.

Single source file
: Load the standalone sql file through src and inspect its output. Open the source editor to inspect the file used as the generated project's entry point.
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
@tp-dependency tp-sql-playground
@summary SQL playground component.
-->

- [`<tp-sql-playground>`](#/components/sql-playground/index.md) : SQL playground component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
