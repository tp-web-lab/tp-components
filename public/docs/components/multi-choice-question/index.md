# <tp-icon name="multi-choice-question" library="components" size="1.25em"></tp-icon> Multi-choice question

<tp-toc position="end" expand-all open brand></tp-toc>

<tp-multi-choice-question answer="1,3,5" random>
  <dl>
    <dt>Title</dt><dd>Web languages</dd>
    <dt>Prompt</dt><dd>Select the styling languages, including CSS preprocessors.</dd>
    <dt>Form</dt><dd><ul><li>CSS</li><li>HTML</li><li>Sass</li><li>JavaScript</li><li>Less</li></ul></dd>
    <dt>Feedback</dt><dd><ul><li>Correct. CSS describes presentation.</li><li>HTML structures content.</li><li>Correct. Sass is a CSS preprocessor.</li><li>JavaScript is a programming language.</li><li>Correct. Less is a CSS preprocessor.</li></ul></dd>
    <dt>Solution</dt><dd>CSS, Sass and Less are used to define styles.</dd>
  </dl>
</tp-multi-choice-question>

## Usage

`src` selects the source format from the URL extension: `.json`, `.html`/`.htm`, `.md`/`.markdown`, `.rst`/`.rest`, or `.adoc`/`.asciidoc`. Extension matching ignores case, query parameters and fragments. URLs without a file extension retain the JSON behavior.

JSON uses this component's question schema. Other formats use the same definition list and native component syntax as an inline question, either as a bare definition list or inside the matching question component. For example, `src="/docs/exercises/general.md"` loads a Markdown definition. Attributes on the receiving question, such as `mode` and `partial`, remain authoritative. Changing `src` reloads the question; unsupported extensions and loading errors appear in the form.

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | Select every answer you consider correct, or leave all boxes unchecked if none applies, then submit. |
| Using the component | Review Feedback to understand the result or open Solution for the explanation. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| <kbd>Space</kbd> | Select the focused answer; in a multiple-choice question, toggle its checkbox. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on Submit | Submit the current selection, including no checked boxes. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Author directives

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

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Select the styling languages and submit the question to inspect the feedback and solution.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Derivatives of tan(x)
: Select all correct derivatives of the tangent among five MathJax-rendered LaTeX expressions, then submit to compare the equivalent formulas and the distractors.

Markup languages
: Select the three markup languages among six SVG language logos, then submit to distinguish document markup from programming languages.

No correct choices
: Submit without checking a box to obtain full credit and unlock the solution. Reset, select a distractor and submit again to compare the feedback.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpMultiChoiceQuestion -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>answer</code> | <code>string</code> | <code>&quot;&quot;</code> | Comma-separated 1-based indexes of the correct answers in the original list order (e.g. `"1,3"`). An empty answer means none of the choices is correct. Not reflected back to the DOM when set via JS property — read from attribute only. |
  | <code>name</code> | <code>string</code> | <code>&quot;&quot;</code> | Form field name passed to the underlying choice list. |
  | <code>orientation</code> | <code>string</code> | <code>&quot;&quot;</code> | Arrangement of answer choices: horizontal or vertical. |
  | <code>random</code> | <code>boolean</code> | <code>false</code> | When present, items are shuffled on connect and after each reset. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of an external JSON, HTML, Markdown, AsciiDoc or reStructuredText question definition. Keeps the definition out of authored markup, but does not make downloaded answers confidential. |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Comma-separated 1-based indexes of the currently selected answers; empty means no selection. |
  | <code>ai-api</code> | <code>boolean</code> | <code>false</code> | Allows sending AI prompts to the selected provider; without it, prompts are only copied. *(inherited from <code>tp-question</code>)* |
  | <code>ai-assistant</code> | <code>string</code> | <code>&quot;openai&quot;</code> | AI provider, optionally followed by /model; without a model, uses the server configuration. Providers: openai, anthropic, google, mistral. *(inherited from <code>tp-question</code>)* |
  | <code>ai-explanation-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of a saved Markdown explanation; the companion .prompt.md must match the current prompt. *(inherited from <code>tp-question</code>)* |
  | <code>ai-help</code> | <code>&quot;none&quot;\|&quot;feedback&quot;\|&quot;solution&quot;\|&quot;both&quot;</code> | <code>&quot;none&quot;</code> | Optional AI assistance; solution and both enable solution explanations. Feedback assistance is reserved for a future release. *(inherited from <code>tp-question</code>)* |
  | <code>mode</code> | <code>string</code> | <code>&quot;mixed&quot;</code> | Blank mode: opened, closed, or mixed local choices. *(inherited from <code>tp-question</code>)* |
  | <code>open</code> | <code>string</code> | <code>&quot;&quot;</code> | Initial panels: both (also a bare attribute), input, or output. Absent or invalid values collapse the question.<br>  `detail: { value: unknown }` *(inherited from <code>tp-question</code>)* |
  | <code>score</code> | <code>boolean</code> | <code>false</code> | Displays the numerical score in submission feedback. *(inherited from <code>tp-question</code>)* |
  | <code>timing</code> | <code>string</code> | <code>&quot;&quot;</code> | Optional nonzero time limit in strict hh:mm:ss format. *(inherited from <code>tp-question</code>)* |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-multi-choice-question>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>randomize</code> | <code>randomize(): void</code> | Randomizes the order of answer items. |
  [Public methods of `TpMultiChoiceQuestion`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-multi-choice-question>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-multi-choice-question>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_multi-choice-question.TpMultiChoiceQuestion.html)
<!-- tp-docgen:typedoc:end -->































































































































































































































































































### Imports

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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-multi-choice-question>` are loaded automatically by this component if they have not already been loaded by another component.

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

- [`<tp-checkbox-list>`](../checkbox-list/index.md) : Transforms a list into a group of checkboxes.
- [`<tp-markdown>`](../markdown/index.md) : Markdown rendering component.
- [`<tp-question>`](../question/index.md) : Base description-list container for question components.

### External

<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
