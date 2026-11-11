<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="matching-question" library="components" size="1.25em"></tp-icon> Matching question

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-matching-question>` element presents and grades a question that matches related items across lists.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-matching-question>
  <dl>
    <dt>Title</dt><dd>English and French</dd>
    <dt>Prompt</dt><dd>Match each English expression with its French translation.</dd>
    <dt>Form</dt><dd>
      <ul><li>Hello</li><li>Thank you</li><li>Goodbye</li></ul>
      <ol><li>Bonjour</li><li>Merci</li><li>Au revoir</li></ol>
    </dd>
    <dt>Feedback</dt><dd>Distinguish greetings, thanks and farewells.</dd>
    <dt>Solution</dt><dd>Hello — Bonjour; Thank you — Merci; Goodbye — Au revoir.</dd>
  </dl>
</tp-matching-question>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-matching-question" src="/docs/components/matching-question/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

`src` selects the source format from the URL extension: `.json`, `.html`/`.htm`, `.md`/`.markdown`, `.rst`/`.rest`, or `.adoc`/`.asciidoc`. Extension matching ignores case, query parameters and fragments. URLs without a file extension retain the JSON behavior.

JSON uses this component's question schema. Other formats use the same definition list and native component syntax as an inline question, either as a bare definition list or inside the matching question component. For example, `src="/docs/exercises/general.md"` loads a Markdown definition. Attributes on the receiving question, such as `mode` and `partial`, remain authoritative. Changing `src` reloads the question; unsupported extensions and loading errors appear in the form.

With the boolean `heading` attribute (absent by default), the first list contains one title per following column. It is excluded from shuffling, associations and scoring; item ranks start at 1 in each remaining list. The title count must equal the number of columns, independently of their item count. Rich title content is preserved. Changing `heading` reinterprets the original lists and clears existing associations. A `dl` with named columns remains supported and already supplies its own headings.

The question passes `heading` to its internal `tp-matching`. With a JSON source, the first `form` array supplies titles when `heading` is present and no separate `headers` array is supplied.

```html
<tp-matching-question heading>
<dl><dt>Prompt</dt><dd>Match each expression with its translation.</dd><dt>Form</dt><dd>
<ul><li>English</li><li>French</li></ul>
<ul><li>Hello</li><li>Thank you</li><li>Goodbye</li></ul>
<ol><li>Bonjour</li><li>Merci</li><li>Au revoir</li></ol>
</dd><dt>Solution</dt><dd>Hello — Bonjour; Thank you — Merci; Goodbye — Au revoir.</dd></dl>
</tp-matching-question>
```

### Authoring

Add the inherited boolean `score` attribute to display the numerical grade. It is hidden by default; correction messages and explanations remain available.

Use the same description-list sections as [tp-question](../question/index.md): Title, Prompt, Form, Feedback and Solution. In Form, provide two or more nonempty direct `ul`/`ol` lists with equal numbers of `li` items. The author must order all lists correctly: first with first, second with second, and so on. An explicitly authored `tp-matching` is also accepted in Form. To title the columns, use a `dl` inside it: each `dt` is a heading and its following `dd` contains a `ul` or `ol`. A bare titled `dl` is also accepted. Each complete group contains one item per column; incomplete groups cannot be submitted.

The question automatically wraps bare lists in [tp-matching](../matching/index.md). Items may contain text, images, SVG, audio, video and `tp-*` components. The underlying form keeps the original rank of each item, so scoring is independent of presentation order. Use an unordered list followed by an ordered list in native markup to keep the two lists distinct without HTML passthrough.

Every list is independently shuffled on initialization and Reset by `tp-matching`. Randomization is always active; there is no `random` attribute. Reconnecting the same question preserves the current order and associations. A random shuffle can occasionally produce the same order.

An answer is correct only when every complete group joins equal original ranks across all columns. Wrong answers show general Feedback; fully correct answers show congratulations. The numerical grade is added only with `score` without repeating remedial feedback. Supply Solution explicitly; it is not generated from item contents. This is a learning activity, not a secure examination mechanism: expected pairings remain available in the authored content or source file.

The inherited `src` attribute can load a reviewed JSON definition at initialization. Use two or more equally sized arrays for `form`; their corresponding entries define the correct groups. Optional `headers` contains one heading per list, in the same order. Optional `markup` accepts `markdown` (default), `md`, `html` or `none` and applies to strings. Only load trusted HTML. Recreate or reload the question to change its source definition.

```json
{
  "title": "Translations",
  "prompt": "Match each word with its translation.",
  "markup": "none",
  "form": [["Hello", "Goodbye"], ["Bonjour", "Au revoir"]],
  "feedback": "Distinguish greetings and farewells.",
  "solution": "Hello — Bonjour; Goodbye — Au revoir."
}
```

### Programming notes

The inherited `tp-question-submit` event exposes `event.detail.value` as an array of `{ left, right }` objects. Both ranks refer to the original author lists and are one-based. Only complete, changed responses emit this event, whether correct or incorrect. Read or restore the embedded `tp-matching.value` when needed; assigning it does not submit the question.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/matching-question/matching-question.js"></script>
  ```

import
: ```js
  import "/path/to/components/matching-question/matching-question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/matching-question/matching-question.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Associate the English expressions with their French translations, then submit to check the answer. Try an incorrect response, correct it and compare the feedback; Reset clears and reshuffles the lists.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Rich content
: Identify the flag, sound and video, associate each with its description and submit your answer. Media controls remain independent of association controls.

External definition
: Complete an animal-translation question loaded from a local JSON file. Submit to check the pairs and open the Solution tab to compare your answer.

Irregular verbs
: Associate each base form with its past simple, past participle and French translation across four headed columns. Complete or revise a group one member at a time.

Header list
: Use the first list as English and French column headings. Match the three expressions; headings remain fixed and do not count as answers.
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
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->
<!--
@tp-dependency tp-matching
@summary Component `<tp-matching>`.
-->
<!--
@tp-dependency tp-question
@summary Base description-list container for question components.
-->

- [`<tp-callout>`](#/components/callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-matching>`](#/components/matching/index.md) : Component `<tp-matching>`.
- [`<tp-question>`](#/components/question/index.md) : Base description-list container for question components.

### External

<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
