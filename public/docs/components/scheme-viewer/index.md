<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="scheme-viewer" library="components" size="1.25em"></tp-icon> Scheme Viewer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-scheme-viewer>` element displays and runs one Scheme example in a compact interface.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-scheme-viewer src="/docs/components/_shared/intro-projects/scheme.json"></tp-scheme-viewer>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-scheme-viewer" src="/docs/components/scheme-viewer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

Results, printed messages, JavaScript `console.log`/`console.info`/`console.warn`/`console.error` calls and errors appear in the rendered output. There is no separate console or Console button. This also applies to executable cells in exported HTML notebooks.

### Projects and sources

Set `src` to a project JSON or `.scm`, `.ss` or `.sld` file, or `repository` to a project directory. Projects can contain `/index.html`, a Scheme entry file and a test file. Select the entry with the standard project controls. The viewer additionally accepts inline `<script type="tp/scheme" filename="main.scm">` content.

Run executes the entry in a fresh session. The optional `execution-scope` shares a queued session, as used by notebooks. Local helper files can be evaluated with `(load-project "helpers.scm")`; this helper resolves paths from the project root. Standard LIPS `load` remains available for URLs.

### Tests

Set the project's `test` path to a `.test.scm` file. Test runs use an isolated session, execute the entry first and then provide `(test-equal label expected actual)` and `(test-assert label condition)`. Passed and failed checks appear in the output; an empty test file is reported as an error. The corresponding question component uses the same runner on submission.

### LIPS execution

Scheme runs with [LIPS](https://lips.js.org/docs/intro), pinned to `1.0.0-beta.23.1`, including its standard library. The first execution downloads the runtime and standard library. Run trusted code only: Scheme can access JavaScript and the DOM. A synchronous infinite loop can block the page.

`display` and `newline` produce output; the last result uses Scheme notation, including lists and exact rational numbers. Exceptions are reported without preventing subsequent executions. The implementation aims at R7RS compatibility through LIPS; this is not a native operating-system Scheme installation.

Use `document` to access the containing interpreter page or the current project preview. JavaScript methods can be called with dot notation, and a Scheme `lambda` can handle a DOM event. The interface uses light DOM and shared TP components.

### Presentation mode

Set `mode="default"` for the standard viewer, `mode="lite"` for the compact presentation, or `mode="simple"` for only the source editor and rendered output. Simple mode always shows both panes, hides the viewer toolbar and uses <kbd>Shift</kbd>+<kbd>Enter</kbd> to run the edited source. The panes adapt to the available width.

The historical boolean `lite` attribute remains an alias for `mode="lite"` when `mode` is absent. An explicit `mode` takes precedence; unsupported values use `default`. Changing the mode preserves the current editable source.

Programming viewers already use a compact toolbar, so `lite` retains their standard controls. In all three modes, messages and errors appear directly in the output.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/scheme-viewer/scheme-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/scheme-viewer/scheme-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/scheme-viewer/scheme-viewer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied scheme example and open the source panel to compare it with the code.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Scheme tests
: Run tests to see three passing assertions. Change double to return x and run tests again to see the failed checks.

Compare presentation modes
: Compare the three modes and use <kbd>Shift</kbd>+<kbd>Return</kbd> to display messages and errors directly in the output, without a separate console.
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
@tp-dependency tp-scheme-playground
@summary Edits and runs a Scheme project with LIPS.
-->

- [`<tp-scheme-playground>`](#/components/scheme-playground/index.md) : Edits and runs a Scheme project with LIPS.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
