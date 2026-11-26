<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="sql-playground" library="components" size="1.25em"></tp-icon> SQL Playground

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-sql-playground>` element edits and runs a SQL project.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box>
  <p>The query lists three European capitals. Expand the query in the result panel to see its rows.</p>
  <tp-sql-playground src="/docs/components/_shared/intro-projects/sql.json"></tp-sql-playground>
</tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-sql-playground" src="/docs/components/sql-playground/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-sql-playground></tp-sql-playground>
  ```

internal project
: ```html
  <tp-sql-playground>
    <script type="tp/json">{"files":[]}</script>
  </tp-sql-playground>
  ```

external project
: ```html
  <tp-sql-playground src="./project.json"></tp-sql-playground>
  ```

repository
: ```html
  <tp-sql-playground repository="./project/"></tp-sql-playground>
  ```
:::

### Authoring

The `src` attribute accepts either a JSON project or a single sql source file (`.sql`). For a source file, the component creates a project using its filename as the entry point and adds an `index.html` containing `<main id="app"></main>`.

```html
<tp-sql-playground src="/docs/components/_shared/single-source/example.sql"></tp-sql-playground>
```

Source contents are preserved. URL query parameters do not affect extension detection. Dependencies and companion files are not fetched automatically: use a JSON project or `repository` for multiple files. Source priority remains `src`, then `repository`, then internal content. Missing or incompatible files produce a console error. Existing JSON sources, including extensionless URLs, remain supported.

### Query tests

Set the project's `test` path to a JSON file, for example `/query.test.json`. Without an explicit path, files ending in `.test.json`, `.tests.json` or `.spec.json` are detected. Use **Test** or the inherited `test()` method to run the suite.

```json
{
  "name": "Students",
  "tests": [
    {
      "name": "Current query",
      "expected": [
        {
          "columns": ["name", "score"],
          "values": [["Ada", 90], ["Bob", 80], ["Cara", null]]
        }
      ]
    },
    {
      "name": "Expected error",
      "query": "SELECT * FROM unknown_table;",
      "error": "no such table: unknown_table"
    }
  ]
}
```

Each test accepts these fields:

| Field | Meaning |
| --- | --- |
| `name` | Label in the common results table. |
| `query` | SQL to execute, optionally containing several statements. |
| `src` | SQL file already present in the project. Use `query` or `src`; when neither is set, the project's entry file is tested. |
| `expected` | Array of result sets, each with `columns` and `values`. Names, column order and value types are compared exactly. |
| `ordered` | `true` by default. With `false`, row order is ignored within each result set, while duplicate counts are preserved. Result-set order and column order still matter. |
| `error` | Nonempty, case-sensitive substring of an expected SQL error. Use this instead of `expected`. Errors in setup or file loading cannot satisfy this expectation. |
| `skip` | `true` or a reason string to report the case as skipped. |

Use `ORDER BY` when checking ordered rows. JSON numbers, strings and `null` retain their types; BLOB values use arrays of bytes. A SELECT returning no rows still has a result set with column names and `values: []`. Statements without result columns produce no result set (`expected: []`); follow a write with a SELECT to verify its effects. SQL statement boundaries are parsed by SQLite, including semicolons inside strings and comments.

Each case uses a new database. SQL projects replay the selected setup script for every case, including temporary tables and connection settings. The active SQL database file takes precedence over `setup`; otherwise `/tables.sql` and `/setup.sql` are the fallbacks. An active SQLite database uses an independent copy of its saved snapshot. Tests never save changes to the playground's persistent database and never depend on earlier cases.

The shared results table displays suite, test, status and details, including expected and actual results on mismatch. Expand **Engine output** for the complete test log. An empty suite, malformed expectations, missing files and unexpected errors fail the suite. Numeric comparisons use sql.js JavaScript numbers without tolerance; use a SQL text cast when exact representation of large integers is required.

### Programmatic toolbar actions

Toolbar and menu actions are also available as named methods. The API tab includes methods inherited from the shared playground.

| Action | Method |
| --- | --- |
| Run / Test / Reset | `run()` / `test()` / `reset()` |
| New / Clear project | `newProject()` / `clearProject()` |
| Open source file | `openSourceFile()` |
| Save / Save as | `saveFile()` / `saveFileAs()` |
| Import / Export project | `importProject()` / `exportProject()` |
| Save / Load / Clear browser memory | `saveInMemory()` / `loadFromMemory()` / `clearMemory()` |
| Load a bundled example | `loadExample(id)` |
| Language help | `showLanguageHelp()` |
| Show/hide the editor toolbar | `toggleEditorToolbar()` |

File choosers may require a user gesture. Await asynchronous methods to wait for completion. Browser memory stores one project per playground language.

Use `resetActiveDatabase()` for **DB > Reset DB**.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/sql-playground/sql-playground.js"></script>
  ```

import
: ```js
  import "/path/to/components/sql-playground/sql-playground.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/sql-playground/sql-playground.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit and run the supplied sql example, then compare the source with its output.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Single source file
: Load the standalone sql file through src and inspect its output. Open the source editor to inspect the file used as the generated project's entry point.

SQL query tests
: Run tests to compare columns and rows, including empty results, duplicates, multiple statements and an expected error. Change query.sql to reverse the ordering and inspect the mismatch; the delete case shows that each following test starts with a fresh database.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
:tp-icon:{name="file_type_html" library="languages" size="1.25em" aria-hidden="true"} HTML
: ::include{examples/examples.html}

:tp-icon:{name="file_type_asciidoc" library="languages" size="1.25em" aria-hidden="true"} tp-asciidoc
: ::include{examples/examples.adoc}

:tp-icon:{name="file_type_latex" library="languages" size="1.25em" aria-hidden="true"} tp-latex
: ::include{examples/examples-latex.html}

:tp-icon:{name="file_type_markdown" library="languages" size="1.25em" aria-hidden="true"} tp-markdown
: ::include{examples/examples.md}

:tp-icon:{name="file_type_restructuredtext" library="languages" size="1.25em" aria-hidden="true"} tp-restructuredtext
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
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->
<!--
@tp-dependency tp-console
@summary Displays structured console output.
-->
<!--
@tp-dependency tp-drawer
@summary Drawer overlay component.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-filesystem
@summary In-memory file system component.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
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
@tp-dependency tp-iframe
@summary Controlled iframe component.
-->
<!--
@tp-dependency tp-menu
@summary Accessible menu component.
-->
<!--
@tp-dependency tp-splitter
@summary Splitter component with two resizable panels.
-->
<!--
@tp-dependency tp-switcher
@summary Switches between horizontal and vertical layouts based on available space.
-->
<!--
@tp-dependency tp-tabs
@summary Accessible tabs component with keyboard and reorder support.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-code-editor>`](#/components/code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-console>`](#/components/console/index.md) : Displays structured console output.
- [`<tp-drawer>`](#/components/drawer/index.md) : Drawer overlay component.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-filesystem>`](#/components/filesystem/index.md) : In-memory file system component.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-iframe>`](#/components/iframe/index.md) : Controlled iframe component.
- [`<tp-menu>`](#/components/menu/index.md) : Accessible menu component.
- [`<tp-splitter>`](#/components/splitter/index.md) : Splitter component with two resizable panels.
- [`<tp-switcher>`](#/components/switcher/index.md) : Switches between horizontal and vertical layouts based on available space.
- [`<tp-tabs>`](#/components/tabs/index.md) : Accessible tabs component with keyboard and reorder support.
- [`<tp-toolbar>`](#/components/toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@credit es-module-lexer https://github.com/guybedford/es-module-lexer
@summary ECMAScript module import analysis.
-->
<!--
@credit Lit https://lit.dev/
@summary Web-component examples and import maps.
-->
<!--
@credit sql.js https://sql.js.org/
@summary SQLite execution in the browser.
-->
<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->
<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [es-module-lexer](https://github.com/guybedford/es-module-lexer) : ECMAScript module import analysis.
- [Lit](https://lit.dev/) : Web-component examples and import maps.
- [sql.js](https://sql.js.org/) : SQLite execution in the browser.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
