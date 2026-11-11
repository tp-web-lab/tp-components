<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="multi-choice-question" library="components" size="1.25em"></tp-icon> Multi-choice question

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-multi-choice-question>` element presents and grades a question with multiple selectable answers.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-multi-choice-question answer="1,3,5" random="">
  <dl>
    <dt>Title</dt><dd>Web languages</dd>
    <dt>Prompt</dt><dd>Select the styling languages, including CSS preprocessors.</dd>
    <dt>Form</dt><dd><ul><li>CSS</li><li>HTML</li><li>Sass</li><li>JavaScript</li><li>Less</li></ul></dd>
    <dt>Feedback</dt><dd><ul><li>Correct. CSS describes presentation.</li><li>HTML structures content.</li><li>Correct. Sass is a CSS preprocessor.</li><li>JavaScript is a programming language.</li><li>Correct. Less is a CSS preprocessor.</li></ul></dd>
    <dt>Solution</dt><dd>CSS, Sass and Less are used to define styles.</dd>
  </dl>
</tp-multi-choice-question>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-multi-choice-question" src="/docs/components/multi-choice-question/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

`src` selects the source format from the URL extension: `.json`, `.html`/`.htm`, `.md`/`.markdown`, `.rst`/`.rest`, or `.adoc`/`.asciidoc`. Extension matching ignores case, query parameters and fragments. URLs without a file extension retain the JSON behavior.

JSON uses this component's question schema. Other formats use the same definition list and native component syntax as an inline question, either as a bare definition list or inside the matching question component. For example, `src="/docs/exercises/general.md"` loads a Markdown definition. Attributes on the receiving question, such as `mode` and `partial`, remain authoritative. Changing `src` reloads the question; unsupported extensions and loading errors appear in the form.

### Authoring

Add the inherited boolean `score` attribute to display the numerical grade. It is hidden by default; correction messages and explanations remain available.

Submitting without selecting a checkbox is allowed. Use `answer=""` when none of the choices is correct (or `attributes.answer: []` / `""` in an external JSON file). An empty submission is graded normally and counts as an attempt. Single-choice questions still require one selected answer.

The `answer` attribute contains comma-separated, one-based indexes in the original list order. Add `random` to shuffle choices.

```html
<tp-multi-choice-question answer="1,3">
  <dl>
    <dt>Title</dt><dd>Web languages</dd>
    <dt>Prompt</dt><dd>Select the styling languages.</dd>
    <dt>Form</dt><dd><ul><li>CSS</li><li>HTML</li><li>Sass</li></ul></dd>
    <dt>Feedback</dt><dd><ul><li>Correct.</li><li>HTML structures content.</li><li>Correct.</li></ul></dd>
    <dt>Solution</dt><dd>CSS and Sass</dd>
  </dl>
</tp-multi-choice-question>
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
  <script type="module" src="/path/to/components/multi-choice-question/multi-choice-question.js"></script>
  ```

import
: ```js
  import "/path/to/components/multi-choice-question/multi-choice-question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/multi-choice-question/multi-choice-question.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Select the styling languages and submit the question to inspect the feedback and solution.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Derivatives of tan(x)
: Select all correct derivatives of the tangent among five MathJax-rendered LaTeX expressions, then submit to compare the equivalent formulas and the distractors.

Markup languages
: Select the three markup languages among six SVG language logos, then submit to distinguish document markup from programming languages.

No correct choices
: Submit without checking a box to obtain full credit and unlock the solution. Reset, select a distractor and submit again to compare the feedback.
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
@tp-dependency tp-checkbox-list
@summary Transforms a list into a group of checkboxes.
-->
<!--
@tp-dependency tp-markdown
@summary Markdown rendering component.
-->
<!--
@tp-dependency tp-question
@summary Base description-list container for question components.
-->

- [`<tp-checkbox-list>`](#/components/checkbox-list/index.md) : Transforms a list into a group of checkboxes.
- [`<tp-markdown>`](#/components/markdown/index.md) : Markdown rendering component.
- [`<tp-question>`](#/components/question/index.md) : Base description-list container for question components.

### External

<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
