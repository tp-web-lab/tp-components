# <tp-icon name="single-choice-question" library="components" size="1.25em"></tp-icon> Single-choice question

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-single-choice-question>` element implements the <tp-icon name="single-choice-question" library="components" size="1.25em"></tp-icon> Single-choice question functionality: single-choice question: wraps tp-question with radio-list validation.

<tp-single-choice-question answer="1" random>
    <dl>
      <dt>Title</dt><dd>Geography</dd>
      <dt>Prompt</dt><dd>What is the capital of France?</dd>
      <dt>Form</dt><dd><ul><li>Paris</li><li>London</li><li>Berlin</li></ul></dd>
      <dt>Feedback</dt><dd><ul><li>Correct.</li><li>London is in the UK.</li><li>Berlin is in Germany.</li></ul></dd>
      <dt>Solution</dt><dd>Paris</dd>
    </dl>
  </tp-single-choice-question>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | Read the prompt, choose one answer and submit it. |
| Using the component | Review Feedback to understand the result or open Solution for the explanation. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Arrow keys | Move between radio answers in a single-choice question. |
| Enter / Space on Submit | Submit the selected answers. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

The `answer` attribute is the one-based index of the correct item in the original list. Add `random` to shuffle choices.

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

## Examples

All three examples use `random`: choices are shuffled when the question initializes and after each reset. The `answer` index always refers to the original authored order, not the displayed order.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Choose the capital of France and submit the question to inspect its feedback and solution.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Derivative of tan(x)
: Choose the derivative of the tangent function from four MathJax-rendered LaTeX expressions, then submit the answer to inspect the feedback and solution.

Regular heptagon
: Identify the regular heptagon among five SVG polygons with five through nine sides, then submit your choice to check the number of sides.
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
<!-- tp-docgen:api TpSingleChoiceQuestion -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>answer</code> | <code>number</code> | <code>0</code> | 1-based index of the correct answer in the original list order. Not reflected back to the DOM when set via JS property — read from attribute only. |
  | <code>name</code> | <code>string</code> | <code>&quot;&quot;</code> | Name attribute passed to the underlying tp-radio-list. |
  | <code>orientation</code> | <code>string</code> | <code>&quot;&quot;</code> | Orientation attribute passed to the underlying tp-radio-list. |
  | <code>random</code> | <code>boolean</code> | <code>false</code> | When present, items are shuffled on connect and after each reset. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL to an external JSON file describing items, answer, and feedback. When present, the answer is never exposed in the HTML source. Inherited from TpQuestion. |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Value attribute passed to the underlying tp-radio-list. |
  [Attributes of `<tp-single-choice-question>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>randomize</code> | <code>randomize(): void</code> | Randomizes the order of answer items. |
  [Public methods of `TpSingleChoiceQuestion`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-single-choice-question>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-single-choice-question>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_single-choice-question.TpSingleChoiceQuestion.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-single-choice-question>` are loaded automatically by this component if they have not already been loaded by another component.

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

- [`<tp-markdown>`](../markdown/index.md) : Markdown rendering component.
- [`<tp-question>`](../question/index.md) : Base description-list container for question components.
- [`<tp-radio-list>`](../radio-list/index.md) : Transforms a list into a group of radio buttons.

### External

<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
