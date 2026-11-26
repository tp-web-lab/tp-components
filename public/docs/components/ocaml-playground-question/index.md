<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="ocaml-playground-question" library="components" size="1.25em"></tp-icon> OCaml Playground Question

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-ocaml-playground-question>` element presents and grades OCaml programming exercises.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-ocaml-playground-question open src="/docs/components/ocaml-playground/examples/double.ml">
  <dl>
    <dt>Title</dt><dd>Double a number</dd>
    <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
    <dt>Feedback</dt><dd>/docs/components/ocaml-playground/examples/double.test.ml</dd>
    <dt>Solution</dt><dd>Return x * 2.</dd>
  </dl>
</tp-ocaml-playground-question>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-ocaml-playground-question" src="/docs/components/ocaml-playground-question/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### External source (`src`)

`src` is the URL of a source file or a JSON project to edit. It is forwarded to the embedded playground or viewer. `test` is the separate test file used when submitting the current program.

The default is an empty string. Relative URLs are resolved from the containing document. Changing `src` loads a new exercise source and cancels the previous test report. A `.md` or `.markdown` file instead supplies the complete exercise as a definition list: **Title**, **Prompt**, **Solution**, plus **Program** (a fenced source block) or **Source** (a link to a program/project), **Query** and optionally **Feedback** (the test filename; **Test** remains a legacy alias). Without a test file, submission runs no tests and does not certify correctness. An optional **Context** link sets the original document base for resources in the prompt.

Results, printed messages, JavaScript console calls (including `console.log`, warnings and errors), DOM event messages and asynchronous errors appear directly in the rendered output. There is no separate console.

### Exercise and tests

Set `src` to the learner's `.ml` file or project JSON and add an optional Feedback filename to an external `.test.ml` file. Use a description list for Title, Prompt, an optional Feedback test filename and Solution. The initial example intentionally fails; replace its function body with `x * 2` and submit again.

Tests execute after the current learner source in an isolated session. `test_equal` takes a label, expected value and actual value; `test_assert` takes a label and a condition. Each assertion is reported in the shared test-results table in Feedback. No assertions is an error, not a successful test run.

```ocaml
test_equal "Positive number" 6 (double 3);;
test_equal "Zero" 0 (double 0);;
test_assert "Negative number" (double (-2) = -4);;
```

### OCaml execution

The engine is an OCaml 5.5.2 toplevel compiled with [Js_of_ocaml 6.5.0](https://ocsigen.org/js_of_ocaml/). The runtime and standard library are distributed with tp-components and loaded on demand; a CDN is not required. Sessions are independent, except for cells in the same notebook. When rebundling the library into an application, copy the distributed `runtimes/ocaml` directory into the application’s public assets at the deployment root. Keep its license and source files alongside the runtime.

Expressions display their value and inferred type. `print_endline` and `Printf.printf` write to the output. Type errors and exceptions do not discard earlier definitions. Use `;;` to separate successive toplevel phrases. Sources can also use ordinary `.ml` file syntax.

Browser bindings are available through `Js_of_ocaml`. Use `Tp_dom.document ()` and `Tp_dom.window ()` to access the containing interpreter page or the active project/cell preview. Standard OCaml calls such as `Dom.appendChild` and `Dom_html.addEventListener` work without preprocessing. PPX syntax such as `##` is not enabled. This browser runtime does not install arbitrary opam packages or provide operating-system processes. Run trusted code: browser bindings can modify the page, and a synchronous infinite loop can block it.

### Optional test feedback

The Basic usage and Explicit Feedback file examples start with the same deliberate error in all six languages: `double(x)` computes `x + 1`. The tests check `double(3) = 6`, `double(0) = 0` and `double(-2) = -4`: all three initially fail, including zero. Change the calculation to `x * 2` and submit again; all three pass.

The **Explicit Feedback file** example provides the editable program directly in a `script` with its `tp/` language type. Its **Feedback** entry gives the test filename or path. It uses neither `src` nor a `test` attribute. Submit, correct `double`, then submit again to compare failing and passing results.

In the question's definition list, **Feedback** can contain the filename or path of an external test file. The file is optional. The existing `test` attribute and **Test** field are also accepted; the Feedback field takes precedence.

```html
<dt>Feedback</dt>
<dd>double.test.ml</dd>
```

In a Markdown exercise loaded with `src`:

```markdown
Feedback
: double.test.ml
```

Links are also accepted for compatibility. Relative filenames and links resolve from the document containing the question, or from the exercise file when it is loaded with `src`. Submit fetches the tests and runs them on a snapshot of the learner's current editor contents, including unsaved changes. It does not reload the initial program or use the Solution. Edits made while tests are loading belong to the next submission. Every submission starts a fresh test execution and replaces the previous report; Reset cancels an unfinished run.

Feedback displays the test results and final summary in the console, without an additional table. Scheme reports each test name and status, with failure details. Loading or execution errors are reported in Feedback. Without a test file, Submit displays “No tests provided.” and does not mark the answer as correct.


### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/ocaml-playground-question/ocaml-playground-question.js"></script>
  ```

import
: ```js
  import "/path/to/components/ocaml-playground-question/ocaml-playground-question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/ocaml-playground-question/ocaml-playground-question.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit double, then submit to run the three OCaml assertions.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Passing solution
: Submit the completed function to see three passing assertions. Modify it to compare with an incorrect answer.

Explicit Feedback file
: Edit the program supplied in an inline script; the Feedback field explicitly names its test file, without src or a test attribute. Submit the initial program, correct double in the editor and submit again to compare failing and passing results.
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
@tp-dependency tp-console
@summary Displays structured console output.
-->
<!--
@tp-dependency tp-iframe
@summary Controlled iframe component.
-->
<!--
@tp-dependency tp-ocaml-playground
@summary Edits and runs an OCaml project.
-->
<!--
@tp-dependency tp-question
@summary Base description-list container for question components.
-->

- [`<tp-console>`](#/components/console/index.md) : Displays structured console output.
- [`<tp-iframe>`](#/components/iframe/index.md) : Controlled iframe component.
- [`<tp-ocaml-playground>`](#/components/ocaml-playground/index.md) : Edits and runs an OCaml project.
- [`<tp-question>`](#/components/question/index.md) : Base description-list container for question components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
