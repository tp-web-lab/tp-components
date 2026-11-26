<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="ocaml-viewer" library="components" size="1.25em"></tp-icon> OCaml Viewer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-ocaml-viewer>` element displays and runs one OCaml example in a compact interface.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-ocaml-viewer src="/docs/components/_shared/intro-projects/ocaml.json"></tp-ocaml-viewer>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-ocaml-viewer" src="/docs/components/ocaml-viewer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

Results, printed messages, JavaScript `console.log`/`console.info`/`console.warn`/`console.error` calls and errors appear in the rendered output. There is no separate console or Console button. This also applies to executable cells in exported HTML notebooks.

Execution displays expression values without OCaml toplevel declarations or type prefixes: `square 7;;` displays `49`. Explicit printed messages and errors are preserved. This presentation also applies to executable cells in exported HTML notebooks. The OCaml interpreter and playground retain their typed toplevel output; the playground displays it directly in the output without a separate console.

### Projects and sources

Set `src` to a project JSON or `.ml` file, or `repository` to a project directory. Projects can contain `/index.html`, an OCaml entry file and a test file. Select the entry with the standard project controls. The viewer additionally accepts inline `<script type="tp/ocaml" filename="main.ml">` content.

Use the native `#use "helpers.ml";;` directive to evaluate a project file in the current session, or `#mod_use "helpers.ml";;` to load it as a module. Project files are registered in the virtual filesystem before execution.

### Tests

Set the project's `test` path to a `.test.ml` file. Test runs use an isolated session, execute the entry first and then provide `test_equal label expected actual;;` and `test_assert label condition;;`. Passed and failed checks appear in the output; an empty test file is reported as an error. The corresponding question component uses the same runner on submission.

### OCaml execution

The engine is an OCaml 5.5.2 toplevel compiled with [Js_of_ocaml 6.5.0](https://ocsigen.org/js_of_ocaml/). The runtime and standard library are distributed with tp-components and loaded on demand; a CDN is not required. Sessions are independent, except for cells in the same notebook. When rebundling the library into an application, copy the distributed `runtimes/ocaml` directory into the application’s public assets at the deployment root. Keep its license and source files alongside the runtime.

Expressions display their value and inferred type. `print_endline` and `Printf.printf` write to the output. Type errors and exceptions do not discard earlier definitions. Use `;;` to separate successive toplevel phrases. Sources can also use ordinary `.ml` file syntax.

Browser bindings are available through `Js_of_ocaml`. Use `Tp_dom.document ()` and `Tp_dom.window ()` to access the containing interpreter page or the active project/cell preview. Standard OCaml calls such as `Dom.appendChild` and `Dom_html.addEventListener` work without preprocessing. PPX syntax such as `##` is not enabled. This browser runtime does not install arbitrary opam packages or provide operating-system processes. Run trusted code: browser bindings can modify the page, and a synchronous infinite loop can block it.

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
  <script type="module" src="/path/to/components/ocaml-viewer/ocaml-viewer.js"></script>
  ```

import
: ```js
  import "/path/to/components/ocaml-viewer/ocaml-viewer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/ocaml-viewer/ocaml-viewer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the rendered output of the supplied ocaml example and open the source panel to compare it with the code.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

OCaml tests
: Run tests to see three passing assertions. Replace x * 2 with x and run tests again to see failed checks.

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
@tp-dependency tp-ocaml-playground
@summary Edits and runs an OCaml project.
-->

- [`<tp-ocaml-playground>`](#/components/ocaml-playground/index.md) : Edits and runs an OCaml project.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
