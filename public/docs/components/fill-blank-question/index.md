<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="fill-blank-question" library="components" size="1.25em"></tp-icon> Fill blank question

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-fill-blank-question>` element presents and grades a fill-in-the-blank question.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-fill-blank-question case-sensitive="">
  <dl>
    <dt>Answers</dt><dd><ol><li>Paris</li><li>Rome</li></ol></dd>
    <dt>Title</dt><dd>Geography</dd>
    <dt>Prompt</dt><dd>Complete both sentences.</dd>
    <dt>Form</dt>
    <dd>
      <p>The capital of France is <tp-blank name="france-capital" placeholder="Capital" aria-label="Capital of France" clearable=""></tp-blank>.</p>
      <p>The capital of Italy is <tp-blank name="italy-capital" placeholder="Capital" aria-label="Capital of Italy" clearable=""></tp-blank>.</p>
    </dd>
    <dt>Feedback</dt>
    <dd>
      <p>Check the spelling of each capital.</p>
      <ul>
        <li>The capital of France is home to the Eiffel Tower.</li>
        <li>The capital of Italy is home to the Colosseum.</li>
      </ul>
    </dd>
    <dt>Solution</dt><dd>The capital of France is Paris. The capital of Italy is Rome.</dd>
  </dl>
</tp-fill-blank-question>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-fill-blank-question" src="/docs/components/fill-blank-question/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

`src` selects the source format from the URL extension: `.json`, `.html`/`.htm`, `.md`/`.markdown`, `.rst`/`.rest`, or `.adoc`/`.asciidoc`. Extension matching ignores case, query parameters and fragments. URLs without a file extension retain the JSON behavior.

JSON uses this component's question schema. Other formats use the same definition list and native component syntax as an inline question, either as a bare definition list or inside the matching question component. For example, `src="/docs/exercises/general.md"` loads a Markdown definition. Attributes on the receiving question, such as `mode` and `partial`, remain authoritative. Changing `src` reloads the question; unsupported extensions and loading errors appear in the form.

### Authoring

Add the inherited boolean `score` attribute to display the numerical grade. It is hidden by default; correction messages and explanations remain available.

An audio recorder can fill an answer field with `transcript="#answer-id"`. The field is checked like typed text; recorder controls are omitted from the reconstructed answer below the form. See the [Audio recorder spoken-answer example](../audio-recorder/index.md).

Multiline `tp-textfield` controls and native `<textarea>` elements each count as one blank. A single empty answer prompts “Please fill in the blank.” For free writing with several valid answers and a self-assessment checklist, use [`tp-question`](../question/index.md); use `tp-fill-blank-question` when you provide an Answers list for automatic checking.

Add `partial` to allow feedback before every blank is filled. After submitting, filled blanks receive a 4px success or danger underline; empty blanks remain neutral. Editing or clearing an answer removes its grading until the next submission. Reset or removing `partial` clears all grading. The score counts correct answers out of all blanks, including unanswered ones. Without `partial` (the default), every blank must be filled before submitting.

Define an `Answers` section in the description list: its `dd` contains an `ol`, with one `li` per blank in field order. This source list is consumed internally, not displayed in answer order. Answers can contain commas. Use `tp-textfield` with a placeholder and a distinct name for each blank. An `aria-label` supplies an accessible name without a visible label. Fields inside the `Form` section are wrapped automatically by `tp-fill-blank`.

Feedback can combine general text (displayed after each submission) with a direct `ul` or `ol` containing one feedback item per blank. Only feedback items for incorrect blanks are shown; general text retains its formatting.

Comparison ignores letter case by default, so `paris` matches `Paris`. Add the boolean `case-sensitive` attribute to require the expected capitalization. Like all boolean attributes, presence enables it—even `case-sensitive="false"`; omit it to disable it. Leading and trailing whitespace is ignored in both modes.

When `case-sensitive` is present, the component automatically displays “Answers are case-sensitive: uppercase and lowercase letters must match.” in a `<tp-callout variant="warning">` immediately after the prompt, regardless of its content.

```html
<tp-fill-blank-question case-sensitive>
  <dl>
    <dt>Answers</dt><dd><ol><li>Paris</li></ol></dd>
    <dt>Form</dt><dd>The capital of France is <tp-blank name="capital" placeholder="Capital" aria-label="Capital" clearable></tp-blank>.</dd>
    <dt>Feedback</dt>
    <dd><p>Check the spelling and capitalization.</p><ul><li>Remember the capital of France.</li></ul></dd>
    <dt>Solution</dt><dd>Paris</dd>
  </dl>
</tp-fill-blank-question>
```

```html
<tp-fill-blank-question>
  <dl>
    <dt>Answers</dt><dd><ol><li>Paris</li></ol></dd>
    <dt>Title</dt><dd>Geography</dd>
    <dt>Prompt</dt><dd>Complete the sentence.</dd>
    <dt>Form</dt><dd>The capital of France is <tp-blank name="capital" placeholder="Capital" aria-placeholder="Capital" aria-label="Capital" clearable></tp-blank></dd>
    <dt>Feedback</dt><dd>Check the spelling.</dd>
    <dt>Solution</dt><dd>Paris</dd>
  </dl>
</tp-fill-blank-question>
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
  <script type="module" src="/path/to/components/fill-blank-question/fill-blank-question.js"></script>
  ```

import
: ```js
  import "/path/to/components/fill-blank-question/fill-blank-question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/fill-blank-question/fill-blank-question.js";
  ```
:::

<!-- -->
## Examples

### Closed answers

For text, SVG formulas or images, use [`tp-blank`](../blank/index.md) instead of a text field. Each rich blank stores the original one-based rank of its assigned answer from the ordered `Answers` list; shuffling only changes the display order. See the Blank page for a complete interactive example.

Set `mode="closed"` to close every `tp-blank`, `mode="opened"` to open every blank, or `mode="mixed"` (the default) to follow each blank's boolean `closed` attribute. Local attributes survive global overrides. The former question `closed` attribute is replaced by `mode`. The boolean `open` attribute only controls whether the question is expanded.

Every field generated by an open blank has `clearable`, so students can clear their answer without an additional author attribute.

Use `tp-blank type="text|number|math|date|time"` (default: `text`) for each response. Open blanks create the corresponding field and forward compatible attributes, for example `mathlive` or `regexp`. Keep one expected answer per blank in the ordered `Answers` list. The shuffled bank contains only the answers for closed blanks, retaining their original ranks. It appears to the right and wraps below on narrow screens. Existing directly authored fields remain supported; use `tp-blank` to make an exercise switchable.

Drag an answer to a field, or click/tap an answer and then a field. With the keyboard, Tab to the blank you want to fill, then press Right Arrow to reach the answer bank: that blank stays highlighted. Use Up/Down to choose a city, then Enter or Space to put it directly into the highlighted blank and return focus there. Escape cancels without changing the blank. Delete or Backspace clears a focused field. Reset clears the fields and reshuffles the bank.

Each listed answer is a separate token, including duplicates. Assigning the same token elsewhere moves it rather than copying it; replacing a field's answer releases the previous token. The bank remains visible so answers can be reassigned. Scoring, feedback, and `case-sensitive` work as in open mode. For a question loaded from a file, put `mode="closed"` on the component itself.

A reading preview beneath the form is available in all three modes (`opened`, `closed`, and `mixed`), even when no answer bank is present. It updates as answers are typed, selected, moved, cleared or reset. It reproduces the sentences with the selected text, formulas and images in place of the interactive blanks; unanswered blanks appear as `…`. Selected answers have an ivory background (`tp-ivory`). With `partial`, submitted answers use the `tp-success` background when correct and `tp-danger` when incorrect; editing clears that grading until the next submission. Empty blanks remain unhighlighted. It does not display assignment commentary.

<tp-html-viewer lite>
  <template>
    <tp-fill-blank-question mode="closed" lang="en">
      <dl>
        <dt>Answers</dt>
        <dd>
          <ol>
            <li>Tallinn</li>
            <li><tp-icon name="ee" library="flags" size="2em" role="img" aria-label="Flag of Estonia"></tp-icon></li>
            <li>Riga</li>
            <li><tp-icon name="lv" library="flags" size="2em" role="img" aria-label="Flag of Latvia"></tp-icon></li>
            <li>Vilnius</li>
            <li><tp-icon name="lt" library="flags" size="2em" role="img" aria-label="Flag of Lithuania"></tp-icon></li>
          </ol>
        </dd>
        <dt>Title</dt><dd>Baltic capitals and flags</dd>
        <dt>Prompt</dt><dd>Match each country with its capital and national flag.</dd>
        <dt>Form</dt>
        <dd>
          <p>Estonia has <tp-blank name="estonia-capital" aria-label="Capital of Estonia"></tp-blank> as its capital and <tp-blank name="estonia-flag" aria-label="Flag of Estonia"></tp-blank> as its national flag.</p>
          <p>Latvia has <tp-blank name="latvia-capital" aria-label="Capital of Latvia"></tp-blank> as its capital and <tp-blank name="latvia-flag" aria-label="Flag of Latvia"></tp-blank> as its national flag.</p>
          <p>Lithuania has <tp-blank name="lithuania-capital" aria-label="Capital of Lithuania"></tp-blank> as its capital and <tp-blank name="lithuania-flag" aria-label="Flag of Lithuania"></tp-blank> as its national flag.</p>
        </dd>
        <dt>Feedback</dt><dd>Check which country each capital and flag belongs to.</dd>
        <dt>Solution</dt>
        <dd>
          <p>Estonia: Tallinn <tp-icon name="ee" library="flags" size="2em" role="img" aria-label="Flag of Estonia"></tp-icon>.</p>
          <p>Latvia: Riga <tp-icon name="lv" library="flags" size="2em" role="img" aria-label="Flag of Latvia"></tp-icon>.</p>
          <p>Lithuania: Vilnius <tp-icon name="lt" library="flags" size="2em" role="img" aria-label="Flag of Lithuania"></tp-icon>.</p>
        </dd>
      </dl>
    </tp-fill-blank-question>
  </template>
</tp-html-viewer>

### Markup languages

All four languages provide the same examples: Geography, Irregular verbs, Baltic capitals and flags, and Square root. Switching language keeps the selected example when the viewers have matching example lists. Each submission displays the attempt number and time; with `score`, it also displays a `correct/total` badge, using the same format as single- and multi-choice questions. A fully correct answer displays “🎉 Congratulations, correct answer!”; general and per-blank feedback are reserved for incorrect answers.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Enter the capitals in the open blanks and submit the question to check the answers.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Geography
: Complete the three European capitals and submit the open question to check the answers.

Irregular verbs
: Enter the past simple forms of the three irregular verbs and submit the answers.

Baltic capitals and flags
: Match each Baltic country with its capital and flag using the closed blanks.

Square root
: Assign the mathematical expressions to the domain, differentiability domain and derivative blanks, then check the completed sentence.
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
@tp-dependency tp-blank
@summary Component `<tp-blank>`.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->
<!--
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->
<!--
@tp-dependency tp-dragdrop
@summary Generic drag-and-drop controller for content.
-->
<!--
@tp-dependency tp-fill-blank
@summary manages inline fields and rich blanks in the content.
-->
<!--
@tp-dependency tp-mathfield
@summary Mathematical expression field with live LaTeX or AsciiMath rendering.
-->
<!--
@tp-dependency tp-question
@summary Base description-list container for question components.
-->
<!--
@tp-dependency tp-sidebar
@summary Sidebar layout component.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->

- [`<tp-blank>`](#/components/blank/index.md) : Component `<tp-blank>`.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](#/components/button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-callout>`](#/components/callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dragdrop>`](#/components/dragdrop/index.md) : Generic drag-and-drop controller for content.
- [`<tp-fill-blank>`](#/components/fill-blank/index.md) : manages inline fields and rich blanks in the content.
- [`<tp-mathfield>`](#/components/mathfield/index.md) : Mathematical expression field with live LaTeX or AsciiMath rendering.
- [`<tp-question>`](#/components/question/index.md) : Base description-list container for question components.
- [`<tp-sidebar>`](#/components/sidebar/index.md) : Sidebar layout component.
- [`<tp-textfield>`](#/components/textfield/index.md) : Single-line and automatically growing multiline text field.

### External

<!--
@credit CortexJS Compute Engine https://mathlive.io/compute-engine/
@summary Symbolic comparison of mathematical answers, loaded on demand.
-->
<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [CortexJS Compute Engine](https://mathlive.io/compute-engine/) : Symbolic comparison of mathematical answers, loaded on demand.
- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
