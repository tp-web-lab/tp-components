<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="typescript-playground-question" library="components" size="1.25em"></tp-icon> TypeScript playground question

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-typescript-playground-question>` element presents and grades TypeScript programming exercises.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-typescript-playground-question open="" src="/docs/components/playground-question/examples/typescript/double.ts">
  <dl>
    <dt>Title</dt><dd>Double a number</dd>
    <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
    <dt>Feedback</dt><dd>/docs/components/playground-question/examples/typescript/double.test.ts</dd>
    <dt>Solution</dt><dd>Return value * 2.</dd>
  </dl>
</tp-typescript-playground-question>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-typescript-playground-question" src="/docs/components/typescript-playground-question/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### External source (`src`)

`src` is the URL of a source file or a JSON project to edit. It is forwarded to the embedded playground or viewer. `test` is the separate test file used when submitting the current program.

The default is an empty string. Relative URLs are resolved from the containing document. Changing `src` loads a new exercise source and cancels the previous test report. A `.md` or `.markdown` file instead supplies the complete exercise as a definition list: **Title**, **Prompt**, **Solution**, plus **Program** (a fenced source block) or **Source** (a link to a program/project), **Query** and optionally **Feedback** (the test filename; **Test** remains a legacy alias). Without a test file, submission runs no tests and does not certify correctness. An optional **Context** link sets the original document base for resources in the prompt.

### Authoring

The inherited `timing="hh:mm:ss"` attribute enables the [timed-question flow](../question/index.md). Start begins the countdown; Continue restores access after expiry without clearing the response.

The language and interface are fixed by the tag: this component always creates [`tp-typescript-playground`](../typescript-playground/index.md). There are no `language` or `mode` attributes. For the other interface, use [`tp-typescript-viewer-question`](../typescript-viewer-question/index.md).

Inherit `src` and `test` from [TpPlaygroundQuestion](../playground-question/index.md): `src` is a TypeScript source file or JSON project, and `test` is a TypeScript test file. Both default to an empty string. Inherited `open` controls the initial disclosure state (closed when absent). Declare Title, Prompt, an optional Feedback test filename and optional Solution with a definition list; the response editor and test report are generated.

Tests use Mocha/Chai through `@tp/test`; imports must match the project filenames. The introductory source intentionally adds 1 instead of multiplying by 2: correct it and submit again to compare failing and passing reports.

Each submission fetches fresh tests and executes a project snapshot without replacing the learner's source or preview. Changing src or test recreates the form and discards unsaved edits. Reset, reconfiguration and disconnection invalidate pending reports. These are browser-side formative tests, not secure grading; use trusted sources. There is no execution-time limit for infinite loops.

### Programming notes

This class extends `TpPlaygroundQuestion<TpTypescriptPlayground>` and implements only the factory for its response control. Test loading, repeated submission, Feedback and cleanup are shared by the generic base. The inherited `tp-question-submit` event exposes a project snapshot in `detail.value`.

### Optional test feedback

The Basic usage and Explicit Feedback file examples start with the same deliberate error in all six languages: `double(x)` computes `x + 1`. The tests check `double(3) = 6`, `double(0) = 0` and `double(-2) = -4`: all three initially fail, including zero. Change the calculation to `x * 2` and submit again; all three pass.

The **Explicit Feedback file** example provides the editable program directly in a `script` with its `tp/` language type. Its **Feedback** entry gives the test filename or path. It uses neither `src` nor a `test` attribute. Submit, correct `double`, then submit again to compare failing and passing results.

In the question's definition list, **Feedback** can contain the filename or path of an external test file. The file is optional. The existing `test` attribute and **Test** field are also accepted; the Feedback field takes precedence.

```html
<dt>Feedback</dt>
<dd>double.test.ts</dd>
```

In a Markdown exercise loaded with `src`:

```markdown
Feedback
: double.test.ts
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
  <script type="module" src="/path/to/components/typescript-playground-question/typescript-playground-question.js"></script>
  ```

import
: ```js
  import "/path/to/components/typescript-playground-question/typescript-playground-question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/typescript-playground-question/typescript-playground-question.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit double and submit to inspect failing tests, then correct addition to multiplication and submit again. Reset restores the initial code.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

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
@tp-dependency tp-typescript-playground
@summary TypeScript playground component.
-->

- [`<tp-console>`](#/components/console/index.md) : Displays structured console output.
- [`<tp-iframe>`](#/components/iframe/index.md) : Controlled iframe component.
- [`<tp-question>`](#/components/question/index.md) : Base description-list container for question components.
- [`<tp-typescript-playground>`](#/components/typescript-playground/index.md) : TypeScript playground component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
