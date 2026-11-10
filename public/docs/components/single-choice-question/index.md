<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="single-choice-question" library="components" size="1.25em"></tp-icon> Single-choice question

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-single-choice-question>` element presents and grades a question with one selectable answer.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-single-choice-question answer="1" random="">
    <dl>
      <dt>Title</dt><dd>Geography</dd>
      <dt>Prompt</dt><dd>What is the capital of France?</dd>
      <dt>Form</dt><dd><ul><li>Paris</li><li>London</li><li>Berlin</li></ul></dd>
      <dt>Feedback</dt><dd><ul><li>Correct.</li><li>London is in the UK.</li><li>Berlin is in Germany.</li></ul></dd>
      <dt>Solution</dt><dd>Paris</dd>
    </dl>
  </tp-single-choice-question>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-single-choice-question" src="/docs/components/single-choice-question/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

`src` selects the source format from the URL extension: `.json`, `.html`/`.htm`, `.md`/`.markdown`, `.rst`/`.rest`, or `.adoc`/`.asciidoc`. Extension matching ignores case, query parameters and fragments. URLs without a file extension retain the JSON behavior.

JSON uses this component's question schema. Other formats use the same definition list and native component syntax as an inline question, either as a bare definition list or inside the matching question component. For example, `src="/docs/exercises/general.md"` loads a Markdown definition. Attributes on the receiving question, such as `mode` and `partial`, remain authoritative. Changing `src` reloads the question; unsupported extensions and loading errors appear in the form.

### Authoring

Add the inherited boolean `score` attribute to display the numerical grade. It is hidden by default; correction messages and explanations remain available.

The `answer` attribute is the one-based index of the correct item in the original list. Add `random` to shuffle choices. Each choice keeps its original answer and feedback association after shuffling, resetting or moving the question into an exercise. The selected choice’s authored feedback is shown for both correct and incorrect answers.

```html
<tp-single-choice-question answer="1">
  <dl>
    <dt>Title</dt><dd>Geography</dd>
    <dt>Prompt</dt><dd>What is the capital of France?</dd>
    <dt>Form</dt><dd><ul><li>Paris</li><li>London</li><li>Berlin</li></ul></dd>
    <dt>Feedback</dt><dd><ul><li>Correct.</li><li>London is in the UK.</li><li>Berlin is in Germany.</li></ul></dd>
    <dt>Solution</dt><dd>Paris</dd>
  </dl>
</tp-single-choice-question>
```

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/single-choice-question/single-choice-question.js"></script>
  ```

import
: ```js
  import "/path/to/components/single-choice-question/single-choice-question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/single-choice-question/single-choice-question.js";
  ```
:::

<!-- -->
## Examples

All three examples use `random`: choices are shuffled when the question initializes and after each reset. The `answer` index always refers to the original authored order, not the displayed order.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Choose the capital of France and submit the question to inspect its feedback and solution.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Derivative of tan(x)
: Choose the derivative of the tangent function from four MathJax-rendered LaTeX expressions, then submit the answer to inspect the feedback and solution.

Regular heptagon
: Identify the regular heptagon among five SVG polygons with five through nine sides, then submit your choice to check the number of sides.
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
@tp-dependency tp-markdown
@summary Markdown rendering component.
-->
<!--
@tp-dependency tp-question
@summary Base description-list container for question components.
-->
<!--
@tp-dependency tp-radio-list
@summary Transforms a list into a group of radio buttons.
-->

- [`<tp-markdown>`](#/components/markdown/index.md) : Markdown rendering component.
- [`<tp-question>`](#/components/question/index.md) : Base description-list container for question components.
- [`<tp-radio-list>`](#/components/radio-list/index.md) : Transforms a list into a group of radio buttons.

### External

<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
