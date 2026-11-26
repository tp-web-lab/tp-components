<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="python-interpreter-question" library="components" size="1.25em"></tp-icon> Python interpreter question

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-python-interpreter-question>` element presents and grades Python exercises in an interactive interpreter.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-python-interpreter-question query="double(3)" open="" src="/docs/components/python-interpreter-question/examples/double.py">
  <dl>
    <dt>Title</dt><dd>Double a number</dd>
    <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.</dd>
    <dt>Feedback</dt><dd>/docs/components/python-interpreter-question/examples/double.test.py</dd>
    <dt>Solution</dt><dd>Return value * 2.</dd>
  </dl>
</tp-python-interpreter-question>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-python-interpreter-question" src="/docs/components/python-interpreter-question/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### External source (`src`)

`src` is the URL of the initial program file. It takes precedence over `value` and an inline `script`; JSON projects are not accepted. The program is editable in the interpreter. `query` supplies the initial query. An optional Feedback filename supplies the test file; `test` is retained as an alternative.

The default is an empty string. Relative URLs are resolved from the containing document. Changing `src` loads a new exercise source and cancels the previous test report. A `.md` or `.markdown` file instead supplies the complete exercise as a definition list: **Title**, **Prompt**, **Solution**, plus **Program** (a fenced source block) or **Source** (a link to a program/project), **Query** and optionally **Feedback** (the test filename; **Test** remains a legacy alias). Without a test file, submission runs no tests and does not certify correctness. An optional **Context** link sets the original document base for resources in the prompt.

### Program, query and tests

Set `src` to a program file and `query` to an initial query. Add a Feedback filename when automated tests are available. Alternatively supply the program with `value` or a `script` with the language's `tp/` type. The question's description list provides Title, Prompt, an optional Feedback test filename and Solution.

The interpreter opens in simple mode with its source editor and query field. Edit the program, then press <kbd>Enter</kbd> or <kbd>Shift</kbd>+<kbd>Enter</kbd> in the query to reload changed source and run it. A reload prints `> Program reloaded.`. Prolog retains Next solution, All solutions and Accept.

Submit runs the current program, including unsaved edits, against the external tests in a separate execution session. The exploratory query is not the grading criterion. Reset restores the original program and query and clears the test report. The initial example deliberately fails: complete `double`, experiment with a query and submit again. The test syntax is the same as for the corresponding playground question.

### Optional test feedback

The Basic usage and Explicit Feedback file examples start with the same deliberate error in all six languages: `double(x)` computes `x + 1`. The tests check `double(3) = 6`, `double(0) = 0` and `double(-2) = -4`: all three initially fail, including zero. Change the calculation to `x * 2` and submit again; all three pass.

The **Explicit Feedback file** example provides the editable program directly in a `script` with its `tp/` language type. Its **Feedback** entry gives the test filename or path. It uses neither `src` nor a `test` attribute. Submit, correct `double`, then submit again to compare failing and passing results.

In the question's definition list, **Feedback** can contain the filename or path of an external test file. The file is optional. The existing `test` attribute and **Test** field are also accepted; the Feedback field takes precedence.

```html
<dt>Feedback</dt>
<dd>double.test.py</dd>
```

In a Markdown exercise loaded with `src`:

```markdown
Feedback
: double.test.py
```

Links are also accepted for compatibility. Relative filenames and links resolve from the document containing the question, or from the exercise file when it is loaded with `src`. Submit fetches the tests and runs them on a snapshot of the learner's current editor contents, including unsaved changes. It does not reload the initial program or use the Solution. Edits made while tests are loading belong to the next submission. Every submission starts a fresh test execution and replaces the previous report; Reset cancels an unfinished run.

Feedback displays the test results and final summary in the console, without an additional table. Each test occupies one console line: its name, status and a concise failure reason when applicable. A single final line summarizes the suite. Loading or execution errors are reported in Feedback. Without a test file, Submit displays “No tests provided.” and does not mark the answer as correct. The interpreter query remains a way to explore the program; it is not the test file.


### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/python-interpreter-question/python-interpreter-question.js"></script>
  ```

import
: ```js
  import "/path/to/components/python-interpreter-question/python-interpreter-question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/python-interpreter-question/python-interpreter-question.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit the program and run the query, then submit the current source to the external tests.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Passing solution
: Run the query with the completed function, then submit to observe passing tests. Modify the source and submit again to compare results.

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
@tp-dependency tp-python
@summary Provides an interactive Python interpreter.
-->
<!--
@tp-dependency tp-python-playground
@summary Python playground component.
-->
<!--
@tp-dependency tp-question
@summary Base description-list container for question components.
-->

- [`<tp-console>`](#/components/console/index.md) : Displays structured console output.
- [`<tp-iframe>`](#/components/iframe/index.md) : Controlled iframe component.
- [`<tp-python>`](#/components/python/index.md) : Provides an interactive Python interpreter.
- [`<tp-python-playground>`](#/components/python-playground/index.md) : Python playground component.
- [`<tp-question>`](#/components/question/index.md) : Base description-list container for question components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
