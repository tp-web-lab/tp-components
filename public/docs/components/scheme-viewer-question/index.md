<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="scheme-viewer-question" library="components" size="1.25em"></tp-icon> Scheme Viewer Question

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-scheme-viewer-question>` element presents and grades Scheme programming exercises.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-scheme-viewer-question open src="/docs/components/scheme-playground/examples/double.scm">
  <dl>
    <dt>Title</dt><dd>Double a number</dd>
    <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
    <dt>Feedback</dt><dd>/docs/components/scheme-playground/examples/double.test.scm</dd>
    <dt>Solution</dt><dd>Return (* x 2).</dd>
  </dl>
</tp-scheme-viewer-question>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-scheme-viewer-question" src="/docs/components/scheme-viewer-question/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### External source (`src`)

`src` is the URL of a source file or a JSON project to edit. It is forwarded to the embedded playground or viewer. `test` is the separate test file used when submitting the current program.

The default is an empty string. Relative URLs are resolved from the containing document. Changing `src` loads a new exercise source and cancels the previous test report. It does not load the question’s Title, Prompt or Solution: these remain in the question’s description list.

Results, printed messages, JavaScript `console.log`/`console.info`/`console.warn`/`console.error` calls and errors appear in the rendered output. There is no separate console or Console button. This also applies to executable cells in exported HTML notebooks.

### Exercise and tests

Set `src` to the learner's `.scm` file or project JSON and add an optional Feedback filename to an external `.test.scm` file. Use a description list for Title, Prompt, an optional Feedback test filename and Solution. The initial example intentionally fails; replace its function body with `(* x 2)` and submit again.

Tests execute after the current learner source in an isolated session. `test-equal` takes a label, expected value and actual value; `test-assert` takes a label and a condition. Each assertion is reported in the shared test-results table in Feedback. No assertions is an error, not a successful test run.

```scheme
(test-equal "Positive number" 6 (double 3))
(test-equal "Zero" 0 (double 0))
(test-assert "Negative number" (= -4 (double -2)))
```

### LIPS execution

Scheme runs with [LIPS](https://lips.js.org/docs/intro), pinned to `1.0.0-beta.23.1`, including its standard library. The first execution downloads the runtime and standard library. Run trusted code only: Scheme can access JavaScript and the DOM. A synchronous infinite loop can block the page.

`display` and `newline` produce output; the last result uses Scheme notation, including lists and exact rational numbers. Exceptions are reported without preventing subsequent executions. The implementation aims at R7RS compatibility through LIPS; this is not a native operating-system Scheme installation.

Use `document` to access the containing interpreter page or the current project preview. JavaScript methods can be called with dot notation, and a Scheme `lambda` can handle a DOM event. The interface uses light DOM and shared TP components.

### Optional test feedback

The Basic usage and Explicit Feedback file examples start with the same deliberate error in all six languages: `double(x)` computes `x + 1`. The tests check `double(3) = 6`, `double(0) = 0` and `double(-2) = -4`: all three initially fail, including zero. Change the calculation to `x * 2` and submit again; all three pass.

The **Explicit Feedback file** example provides the editable program directly in a `script` with its `tp/` language type. Its **Feedback** entry gives the test filename or path. It uses neither `src` nor a `test` attribute. Submit, correct `double`, then submit again to compare failing and passing results.

In the question's definition list, **Feedback** can contain the filename or path of an external test file. The file is optional. The existing `test` attribute and **Test** field are also accepted; the Feedback field takes precedence.

```html
<dt>Feedback</dt>
<dd>double.test.scm</dd>
```

In a Markdown exercise loaded with `src`:

```markdown
Feedback
: double.test.scm
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
  <script type="module" src="/path/to/components/scheme-viewer-question/scheme-viewer-question.js"></script>
  ```

import
: ```js
  import "/path/to/components/scheme-viewer-question/scheme-viewer-question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/scheme-viewer-question/scheme-viewer-question.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open Code, edit double, then submit to run the Scheme assertions.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Passing solution
: Submit the completed function: all three assertions pass. Modify its body and submit again to observe failures.

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
@tp-dependency tp-question
@summary Base description-list container for question components.
-->
<!--
@tp-dependency tp-scheme-viewer
@summary Compact Scheme code viewer and runner.
-->

- [`<tp-console>`](#/components/console/index.md) : Displays structured console output.
- [`<tp-iframe>`](#/components/iframe/index.md) : Controlled iframe component.
- [`<tp-question>`](#/components/question/index.md) : Base description-list container for question components.
- [`<tp-scheme-viewer>`](#/components/scheme-viewer/index.md) : Compact Scheme code viewer and runner.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
