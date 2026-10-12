# <tp-icon name="matching-question" library="components" size="1.25em"></tp-icon> Matching question

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-matching-question>` element implements the Matching question functionality: checks groups across two or more optionally titled lists using tp-matching.

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

## Usage

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

### User interactions

An initial info callout in the Feedback panel explains how to form a group with the mouse or keyboard. Close it when you no longer need the instructions; resetting the answer does not reopen it.

#### Mouse interactions

Associated cards share a color and a group number, including incomplete groups. Colors cycle through blue, violet, amber, cyan, orange and indigo; they indicate membership, never correctness. The number remains the identifier when colors repeat. Completing or editing a group preserves its color.

Click a card or its link icon to select it, then click a card in another column to associate them. Clicking the selected card again cancels the selection. Embedded links, fields, media players and other controls retain their own interactions without selecting the card. The link icon also remains the keyboard selection control and drag handle.

| Control or gesture | Result |
| --- | --- |
| Close callout | Dismiss the introductory instructions without changing the associations. |
| Click a card | Select it or associate it with the selected item from another column. Clicking it again cancels selection. Embedded controls do not select the card. |
| Select | Select one item, then select its partner in the other list. Selecting the same item again cancels the pending selection. |
| Drag a Select button | Drop it on an item in the opposite list to associate the pair. |
| Remove pair / Remove from group (close icon) | Remove this member; the remaining group is retained if it still contains at least two members. Select any existing member to extend or revise a group. |
| Embedded media or components | Use their controls normally; they do not select an answer. |
| Submit | Submit all associations for checking. An incomplete response is rejected without counting an attempt. The result reports the number of correct pairs and, when needed, the author's feedback. An unchanged submission is not counted twice. |
| Reset | Clear associations and independently reshuffle every list. |
| Feedback / Solution tabs | Switch between the last result and the solution. The solution is available before submission; an empty solution displays a warning. |
| Input / Output buttons beside Prompt | Show or hide the answer form or output panel, keeping at least one panel visible. |
| Title | Expand or collapse the question. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move through association controls, embedded content, question actions and output tabs. |
| Enter / Space | Activate the focused Select, Remove pair, Close callout, Reset, Submit or panel-toggle button. |
| Escape inside an item | Cancel the pending selection without removing existing pairs. |
| Arrow keys, Home / End on output tabs | Navigate the Feedback and Solution tabs using the standard tab controls. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use the same description-list sections as [tp-question](../question/index.md): Title, Prompt, Form, Feedback and Solution. In Form, provide two or more nonempty direct `ul`/`ol` lists with equal numbers of `li` items. The author must order all lists correctly: first with first, second with second, and so on. An explicitly authored `tp-matching` is also accepted in Form. To title the columns, use a `dl` inside it: each `dt` is a heading and its following `dd` contains a `ul` or `ol`. A bare titled `dl` is also accepted. Each complete group contains one item per column; incomplete groups cannot be submitted.

The question automatically wraps bare lists in [tp-matching](../matching/index.md). Items may contain text, images, SVG, audio, video and `tp-*` components. The underlying form keeps the original rank of each item, so scoring is independent of presentation order. Use an unordered list followed by an ordered list in native markup to keep the two lists distinct without HTML passthrough.

Every list is independently shuffled on initialization and Reset by `tp-matching`. Randomization is always active; there is no `random` attribute. Reconnecting the same question preserves the current order and associations. A random shuffle can occasionally produce the same order.

An answer is correct only when every complete group joins equal original ranks across all columns. Wrong answers show the score and general Feedback; fully correct answers show the score and congratulations without repeating remedial feedback. Supply Solution explicitly; it is not generated from item contents. This is a learning activity, not a secure examination mechanism: expected pairings remain available in the authored content or source file.

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

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Associate the English expressions with their French translations, then submit to check the score. Try an incorrect response, correct it and compare the feedback; Reset clears and reshuffles the lists.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

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

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

The inherited `tp-question-submit` event exposes `event.detail.value` as an array of `{ left, right }` objects. Both ranks refer to the original author lists and are one-based. Only complete, changed responses emit this event, whether correct or incorrect. Read or restore the embedded `tp-matching.value` when needed; assigning it does not submit the question.

### API

<!-- tp-docgen:api TpMatchingQuestion -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>heading</code> | <code>boolean</code> | <code>false</code> | Passes heading to the matching widget; the first list supplies column titles. |
  [Attributes of `<tp-matching-question>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpMatchingQuestion`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-matching-question>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-matching-question>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_matching-question.TpMatchingQuestion.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-matching-question>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->
<!--
@tp-dependency tp-matching
@summary associates rich content from two or more optionally titled lists without grading the groups.
-->
<!--
@tp-dependency tp-question
@summary Base description-list container for question components.
-->

- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-matching>`](../matching/index.md) : associates rich content from two or more optionally titled lists without grading the groups.
- [`<tp-question>`](../question/index.md) : Base description-list container for question components.

### External

<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
