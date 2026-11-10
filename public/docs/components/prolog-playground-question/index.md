<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="prolog-playground-question" library="components" size="1.25em"></tp-icon> Prolog playground question

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-prolog-playground-question>` element presents and grades Prolog programming exercises.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-prolog-playground-question open="" src="/docs/components/playground-question/examples/prolog/double.pl" test="/docs/components/playground-question/examples/prolog/double.test.pl">
  <dl>
    <dt>Title</dt><dd>Double a number</dd>
    <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
    <dt>Solution</dt><dd>Use Result is Value * 2.</dd>
  </dl>
</tp-prolog-playground-question>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-prolog-playground-question" src="/docs/components/prolog-playground-question/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

The inherited `timing="hh:mm:ss"` attribute enables the [timed-question flow](../question/index.md). Start begins the countdown; Continue restores access after expiry without clearing the response.

The language and interface are fixed by the tag: this component always creates [`tp-prolog-playground`](../prolog-playground/index.md). There are no `language` or `mode` attributes. For the other interface, use [`tp-prolog-viewer-question`](../prolog-viewer-question/index.md).

Inherit `src` and `test` from [TpPlaygroundQuestion](../playground-question/index.md): `src` is a Prolog source file or JSON project, and `test` is a Prolog test file. Both default to an empty string. Inherited `open` controls the initial disclosure state (closed when absent). Declare Title, Prompt and optional Solution with a definition list; Form and test Feedback are generated.

Tests use the existing Prolog `:- test(Name, Goal).` directives. The introductory source intentionally adds 1 instead of multiplying by 2: correct it and submit again to compare failing and passing reports.

Each submission fetches fresh tests and executes a project snapshot without replacing the learner's source or preview. Changing src or test recreates the form and discards unsaved edits. Reset, reconfiguration and disconnection invalidate pending reports. These are browser-side formative tests, not secure grading; use trusted sources. There is no execution-time limit for infinite loops.

### Programming notes

This class extends `TpPlaygroundQuestion<TpPrologPlayground>` and implements only the factory for its response control. Test loading, repeated submission, Feedback and cleanup are shared by the generic base. The inherited `tp-question-submit` event exposes a project snapshot in `detail.value`.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/prolog-playground-question/prolog-playground-question.js"></script>
  ```

import
: ```js
  import "/path/to/components/prolog-playground-question/prolog-playground-question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/prolog-playground-question/prolog-playground-question.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit double and submit to inspect failing tests, then correct addition to multiplication and submit again. Reset restores the initial code.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-latex
: ::include{examples/examples-latex.html}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
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
@tp-dependency tp-prolog-playground
@summary Prolog playground component.
-->
<!--
@tp-dependency tp-question
@summary Base description-list container for question components.
-->

- [`<tp-console>`](#/components/console/index.md) : Displays structured console output.
- [`<tp-iframe>`](#/components/iframe/index.md) : Controlled iframe component.
- [`<tp-prolog-playground>`](#/components/prolog-playground/index.md) : Prolog playground component.
- [`<tp-question>`](#/components/question/index.md) : Base description-list container for question components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
