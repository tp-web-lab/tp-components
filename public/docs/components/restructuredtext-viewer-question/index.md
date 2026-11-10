<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="restructuredtext-viewer-question" library="components" size="1.25em"></tp-icon> reStructuredText viewer question

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-restructuredtext-viewer-question>` element presents and grades exercises based on rendered reStructuredText documents.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-restructuredtext-viewer-question open="" src="/docs/components/markup-viewer-question/examples/emphasis.rst" test="/docs/components/markup-viewer-question/examples/emphasis.test.js">
  <dl>
    <dt>Title</dt><dd>Semantic emphasis</dd>
    <dt>Prompt</dt><dd>Mark Hello with strong emphasis. Open Code to edit, then submit.</dd>
    <dt>Solution</dt><dd>Use the language's strong-emphasis syntax.</dd>
  </dl>
</tp-restructuredtext-viewer-question>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-restructuredtext-viewer-question" src="/docs/components/restructuredtext-viewer-question/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

The inherited `timing="hh:mm:ss"` attribute enables the [timed-question flow](../question/index.md). Start begins the countdown; Continue restores access after expiry without clearing the response.

The tag fixes the language to reStructuredText and embeds [tp-restructuredtext-viewer](../restructuredtext-viewer/index.md). Inherited `src` is one markup file, `test` is a trusted JavaScript test file; both default to an empty string. Inherited `open` is false when absent. Declare Title, Prompt and optional Solution with a definition list. Form and test Feedback are generated.

Tests use Mocha/Chai through `@tp/test` and query `document` in an isolated rendering of the current markup, including edits not yet previewed with Run. They check semantic HTML, not exact source spelling. See the [shared markup question contract](../markup-viewer-question/index.md).

The initial paragraph deliberately fails both tests. Give Hello strong emphasis and submit again. Reset restores the paragraph. Every submission rerenders a snapshot without changing the visible viewer. Changing src or test discards edits. Browser-side tests are formative, not secure grading, and have no timeout for infinite loops. Source scripts are not executed in the test document.

### Programming notes

Extends `TpMarkupViewerQuestion<TpRestructuredTextViewer>`. The inherited `tp-question-submit` event carries the current markup string in `detail.value`. Test loading, cancellation, output isolation and repeated submissions are shared with programming questions.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/restructuredtext-viewer-question/restructuredtext-viewer-question.js"></script>
  ```

import
: ```js
  import "/path/to/components/restructuredtext-viewer-question/restructuredtext-viewer-question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/restructuredtext-viewer-question/restructuredtext-viewer-question.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Submit the initial paragraph to see two failures. Use the source editor to mark Hello with strong emphasis, then submit again to pass both DOM tests.

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
@tp-dependency tp-question
@summary Base description-list container for question components.
-->
<!--
@tp-dependency tp-restructuredtext-viewer
@summary Interactive reStructuredText viewer with editable source and parser outputs.
-->

- [`<tp-console>`](#/components/console/index.md) : Displays structured console output.
- [`<tp-iframe>`](#/components/iframe/index.md) : Controlled iframe component.
- [`<tp-question>`](#/components/question/index.md) : Base description-list container for question components.
- [`<tp-restructuredtext-viewer>`](#/components/restructuredtext-viewer/index.md) : Interactive reStructuredText viewer with editable source and parser outputs.

### External

<!--
@credit Chai https://www.chaijs.com/
@summary Assertions in browser tests.
-->
<!--
@credit es-module-lexer https://github.com/guybedford/es-module-lexer
@summary ECMAScript module import analysis.
-->
<!--
@credit Lit https://lit.dev/
@summary Web-component examples and import maps.
-->
<!--
@credit Mocha https://mochajs.org/
@summary Browser test execution.
-->
<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [Chai](https://www.chaijs.com/) : Assertions in browser tests.
- [es-module-lexer](https://github.com/guybedford/es-module-lexer) : ECMAScript module import analysis.
- [Lit](https://lit.dev/) : Web-component examples and import maps.
- [Mocha](https://mochajs.org/) : Browser test execution.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
