# <tp-icon name="fill-blank-question" library="components" size="1.25em"></tp-icon> Fill blank question

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-fill-blank-question>` element implements the <tp-icon name="fill-blank-question" library="components" size="1.25em"></tp-icon> Fill blank question functionality: fill-in-the-blank question: wraps tp-question with input/select validation.


<tp-fill-blank-question case-sensitive>
  <dl>
    <dt>Answers</dt><dd><ol><li>Paris</li><li>Rome</li></ol></dd>
    <dt>Title</dt><dd>Geography</dd>
    <dt>Prompt</dt><dd>Complete both sentences.</dd>
    <dt>Form</dt>
    <dd>
      <p>The capital of France is <tp-textfield name="france-capital" placeholder="Capital" aria-label="Capital of France" clearable></tp-textfield>.</p>
      <p>The capital of Italy is <tp-textfield name="italy-capital" placeholder="Capital" aria-label="Capital of Italy" clearable></tp-textfield>.</p>
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

<tp-fill-blank-question closed lang="en">
  <dl>
    <dt>Answers</dt>
    <dd>
      <ol>
        <li><tp-math aria-label="Nonnegative real numbers" label="Nonnegative real numbers" value="\mathbb{R}_{+}"></tp-math></li>
        <li><tp-math aria-label="Positive real numbers" label="Positive real numbers" value="\mathbb{R}_{+}^{*}"></tp-math></li>
        <li><tp-math aria-label="One over twice the square root of x" label="One over twice the square root of x" value="\frac{1}{2\sqrt{x}}"></tp-math></li>
      </ol>
    </dd>
    <dt>Title</dt>
    <dd>The square root function</dd>
    <dt>Prompt</dt>
    <dd>Complete the sentence with the mathematical expressions.</dd>
    <dt>Form</dt>
    <dd>
      <p>
        The square root function <tp-math value="f(x) = \sqrt{x}"></tp-math> is defined on
        <tp-blank name="domain" aria-label="Domain"></tp-blank>
        , differentiable on
        <tp-blank name="differentiability" aria-label="Domain of differentiability"></tp-blank>
        , and <tp-math value="f'(x) ="></tp-math>
        <tp-blank name="derivative" aria-label="Derivative"></tp-blank>
        .
      </p>
    </dd>
    <dt>Feedback</dt>
    <dd>Consider whether zero belongs to the domain and whether the derivative exists there.</dd>
    <dt>Solution</dt>
    <dd>The domain is <tp-math value="\mathbb{R}_{+} = [0, +\infty)"></tp-math>. The function is differentiable on <tp-math value="\mathbb{R}_{+}^{*} = (0, +\infty)"></tp-math>, with <tp-math value="f'(x) = \frac{1}{2\sqrt{x}}"></tp-math>.</dd>
  </dl>
</tp-fill-blank-question>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Open-answer field | Click the field and enter an answer. |
| Closed answer bank | Drag an answer to a blank, or select an answer then click a blank. |
| Clear button | Remove the assigned answer. |
| Submit | Check the answers. A correct answer displays a congratulatory message. |
| Feedback / Solution tabs | Read feedback or view the solution. |
| Case warning | When shown after the prompt, uppercase and lowercase letters must match. |
| Input / Output buttons | Show or hide the answer form or result panel without losing their contents. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Right Arrow from a closed blank | Move to the answer bank. |
| Up / Down in the answer bank | Choose an answer. |
| Enter / Space in the answer bank | Place the chosen answer into the highlighted blank. |
| Escape | Cancel answer selection. |
| Delete on a blank | Clear its answer. |
| Enter / Space | Activate the focused button. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Add `partial` to allow feedback before every blank is filled. After submitting, filled blanks receive a 4px success or danger underline; empty blanks remain neutral. Editing or clearing an answer removes its grading until the next submission. Reset or removing `partial` clears all grading. The score counts correct answers out of all blanks, including unanswered ones. Without `partial` (the default), every blank must be filled before submitting.

Define an `Answers` section in the description list: its `dd` contains an `ol`, with one `li` per blank in field order. This source list is consumed internally, not displayed in answer order. Answers can contain commas. Use `tp-textfield` with a placeholder and a distinct name for each blank. An `aria-label` supplies an accessible name without a visible label. Fields inside the `Form` section are wrapped automatically by `tp-fill-blank`.

Feedback can combine general text (displayed after each submission) with a direct `ul` or `ol` containing one feedback item per blank. Only feedback items for incorrect blanks are shown; general text retains its formatting.

Comparison ignores letter case by default, so `paris` matches `Paris`. Add the boolean `case-sensitive` attribute to require the expected capitalization. Like all boolean attributes, presence enables it—even `case-sensitive="false"`; omit it to disable it. Leading and trailing whitespace is ignored in both modes.

When `case-sensitive` is present, the component automatically displays “Answers are case-sensitive: uppercase and lowercase letters must match.” in a `<tp-callout variant="warning">` immediately after the prompt, regardless of its content.

```html
<tp-fill-blank-question case-sensitive>
  <dl>
    <dt>Answers</dt><dd><ol><li>Paris</li></ol></dd>
    <dt>Form</dt><dd>The capital of France is <tp-textfield name="capital" placeholder="Capital" aria-label="Capital" clearable></tp-textfield>.</dd>
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
    <dt>Form</dt><dd>The capital of France is <tp-textfield name="capital" placeholder="Capital" aria-placeholder="Capital" aria-label="Capital" clearable></tp-textfield></dd>
    <dt>Feedback</dt><dd>Check the spelling.</dd>
    <dt>Solution</dt><dd>Paris</dd>
  </dl>
</tp-fill-blank-question>
```

## Examples

### Closed answers

For text, SVG formulas or images, use [`tp-blank`](../blank/index.md) instead of a text field. Each rich blank stores the original one-based rank of its assigned answer from the ordered `Answers` list; shuffling only changes the display order. See the Blank page for a complete interactive example.

Add the boolean `closed` attribute to display the answers from the `Answers` ordered list in a shuffled bank to the right of the blanks. On narrow screens, the bank wraps below the form. Use `tp-textfield` for each blank: fields become readonly in this mode. The default remains an open question.

Drag an answer to a field, or click/tap an answer and then a field. With the keyboard, Tab to the blank you want to fill, then press Right Arrow to reach the answer bank: that blank stays highlighted. Use Up/Down to choose a city, then Enter or Space to put it directly into the highlighted blank and return focus there. Escape cancels without changing the blank. Delete or Backspace clears a focused field. Reset clears the fields and reshuffles the bank.

Each listed answer is a separate token, including duplicates. Assigning the same token elsewhere moves it rather than copying it; replacing a field's answer releases the previous token. The bank remains visible so answers can be reassigned. Scoring, feedback, and `case-sensitive` work as in open mode. For a question loaded from a file, put `closed` on the component itself.

A reading preview beneath the form updates as answers are assigned, moved or cleared. It reproduces the sentences with the selected text, formulas and images in place of the interactive blanks; unanswered blanks appear as `…`. It does not display assignment commentary.

<tp-html-viewer lite>
  <template>
    <tp-fill-blank-question closed lang="en">
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

All four languages provide the same examples: Geography, Irregular verbs, Baltic capitals and flags, and Square root. Switching language keeps the selected example when the viewers have matching example lists. Each submission displays the attempt number, time and current score as a `correct/total` badge, using the same format as single- and multi-choice questions. A fully correct answer displays a success score and “🎉 Congratulations, correct answer!”; general and per-blank feedback are reserved for incorrect answers.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Enter the capitals in the open blanks and submit the question to check the answers.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

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
<!-- tp-docgen:api TpFillBlankQuestion -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>case-sensitive</code> | <code>boolean</code> | <code>false</code> | Requires matching uppercase and lowercase letters in answers. |
  | <code>closed</code> | <code>boolean</code> | <code>false</code> | Provides shuffled answers to assign to readonly tp-textfield blanks. |
  | <code>partial</code> | <code>boolean</code> | <code>false</code> | Allows incomplete submissions and marks filled blanks as correct or incorrect after feedback. |
  [Attributes of `<tp-fill-blank-question>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpFillBlankQuestion`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-fill-blank-question>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-fill-blank-question>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_fill-blank-question.TpFillBlankQuestion.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-fill-blank-question>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-blank
@summary displays a text, SVG or image answer in a focusable blank.
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
@tp-dependency tp-markdown
@summary Markdown rendering component.
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

- [`<tp-blank>`](../blank/index.md) : displays a text, SVG or image answer in a focusable blank.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-divider>`](../divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dragdrop>`](../dragdrop/index.md) : Generic drag-and-drop controller for content.
- [`<tp-fill-blank>`](../fill-blank/index.md) : manages inline fields and rich blanks in the content.
- [`<tp-markdown>`](../markdown/index.md) : Markdown rendering component.
- [`<tp-question>`](../question/index.md) : Base description-list container for question components.
- [`<tp-sidebar>`](../sidebar/index.md) : Sidebar layout component.
- [`<tp-textfield>`](../textfield/index.md) : Single-line and automatically growing multiline text field.

### External

<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
