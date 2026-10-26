# <tp-icon name="question" library="components" size="1.25em"></tp-icon> Question

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-question>` element implements the <tp-icon name="question" library="components" size="1.25em"></tp-icon> Question functionality: semantic base container for question content.

<tp-question>
    <dl>
      <dt>Title</dt><dd>Reflection</dd>
      <dt>Prompt</dt><dd>Describe one benefit of web components.</dd>
    <dt>Form</dt><dd><tp-textfield multiline="" rows="3" placeholder="Type your answer..."></tp-textfield></dd>
      <dt>Feedback</dt><dd>Think about encapsulation and reuse.</dd>
      <dt>Solution</dt><dd>They package reusable behavior behind a custom element.</dd>
    </dl>
  </tp-question>

## Usage

`src` selects the source format from the URL extension: `.json`, `.html`/`.htm`, `.md`/`.markdown`, `.rst`/`.rest`, or `.adoc`/`.asciidoc`. Extension matching ignores case, query parameters and fragments. URLs without a file extension retain the JSON behavior.

JSON uses this component's question schema. Other formats use the same definition list and native component syntax as an inline question, either as a bare definition list or inside the matching question component. For example, `src="/docs/exercises/general.md"` loads a Markdown definition. Attributes on the receiving question, such as `mode` and `partial`, remain authoritative. Changing `src` reloads the question; unsupported extensions and loading errors appear in the form.

### User interactions

The user-help button legend groups commands by their location in the component and describes their effect briefly. Detailed gestures and keyboard behavior remain in the interaction tables below.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Question title | Expand or collapse the question. Questions start collapsed; answers are retained when collapsed. |
| Input button | Show or hide the answer form without losing answers. At least one panel stays visible. |
| Output button | Show or hide the output without losing feedback or the solution. Highlighted buttons indicate visible panels. |
| Start | Reveal the timed question and begin its countdown. |
| Continue | Reveal the question again after the time limit, keeping existing answers. |
| Submit | Check the completed answer form. |
| Feedback tab | Read feedback, or the message indicating that none is available. |
| Solution tab | Read the solution, or the message indicating that none is available. For timed questions, it becomes accessible only after Continue. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on the question title | Expand or collapse the question. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate the focused button. |
| <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd> in Output tabs | Move between Feedback and Solution. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Author directives

Numerical scores are hidden by default. Add the boolean `score` attribute to show them in graded questions, for example `<tp-fill-blank-question score>`. Correctness messages, explanations and attempt counters remain available without it. Adding or removing `score` also updates existing feedback without submitting again. As with other boolean attributes, `score="false"` still enables it; omit the attribute to disable it.

The header pairs `--tp-brand-fill-softer` with `--tp-brand-text-on-soft`, and uses `--tp-brand-stroke-soft` for the border. Its title, icon and disclosure arrow follow the same foreground in light and dark themes. Custom palettes should keep these background and foreground tokens coordinated.

Set `timing="00:05:00"` to allow five minutes. The strict `hh:mm:ss` format accepts hours from `00` to `99` and minutes/seconds from `00` to `59`. Missing, invalid and `00:00:00` values disable the time limit. A silent timer without controls appears beside the title, before the disclosure arrow.

Opening a timed question shows a centered message and **Start**. The countdown begins only after Start reveals the content. At zero, a mask replaces the content with “Time limit has expired.” and **Continue**. The Solution tab is disabled during the timed session, including keyboard navigation and solution links in feedback, until automatic grading confirms a correct answer. A correct answer unlocks only that question’s solution immediately; the countdown continues. Continue restores access to the question and its solution without restarting the timer or clearing answers. Collapsing and reopening a question does not pause or restart its countdown. Changing `timing` starts a new waiting session; removing it reveals the content. These rules also apply to specialized questions.

`mode="mixed"` is the default policy for descendant `tp-blank` elements. Each blank follows its boolean `closed` attribute. Set `mode="closed"` to close every blank or `mode="opened"` to open every blank without changing those local choices. This policy does not convert other question widgets, such as radio lists.


Structure the content as a definition list with `Title`, `Prompt`, `Form`, `Feedback`, and `Solution` entries. Specialized question components add validation.

Questions are collapsed when `open` is absent or invalid. Use `open="both"` (or a bare `open`) to show both panels, `open="input"` to show only the answer form, or `open="output"` to show only the output panel initially. This also applies to specialized questions inheriting from `tp-question`. The panel buttons remain available. Activating Submit (the play/run action) reveals the output panel and selects Feedback immediately, including while an asynchronous check is running, without hiding the input panel or clearing the answer. Changing the attribute updates the disclosure and panel selection without clearing answers. Closing and reopening the title retains the current panel selection.

The Output panel groups Feedback and Solution in a `tp-tabs` component. Feedback is initially selected; For untimed questions, Solution is accessible immediately, without submitting an answer first. The author-friendly definition list is converted internally into accessible tabs and tab panels.

After submission, the generic question displays the author-provided Feedback content, preserving its formatting. The compact status beside the submit control still confirms the submission. Specialized questions can provide feedback specific to the submitted answer.

When no solution is provided, its panel displays “No solution is available for this question.” in a `tp-callout`, like the missing-feedback notice. Loading a solution replaces this notice.

```html
<tp-question>
  <dl>
    <dt>Title</dt><dd>Reflection</dd>
    <dt>Prompt</dt><dd>Describe one benefit of web components.</dd>
    <dt>Form</dt><dd><tp-textfield multiline rows="3" placeholder="Type your answer..."></tp-textfield></dd>
    <dt>Feedback</dt><dd>Think about encapsulation and reuse.</dd>
    <dt>Solution</dt><dd>They package reusable behavior behind a custom element.</dd>
  </dl>
</tp-question>
```

Successful automatically graded answers also show “Bonne réponse trouvée en hh:mm:ss.” in Feedback. Elapsed time is measured from Start on the question timer, or on the nearest enclosing exercise timer when the question has none.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Write an answer, submit it and inspect the feedback and solution panels.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Timed question
: Open the question and select Start to reveal its content for ten seconds. The Solution tab stays disabled during the countdown unless automatic grading confirms a correct answer. After expiry, select Continue to recover your answer and access the solution.

Optional score
: Type blue and submit to see the numerical grade enabled by score. Remove score in the source and submit again: correction remains available, but the grade is hidden.
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
<!-- tp-docgen:api TpQuestion -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>mode</code> | <code>string</code> | <code>&quot;mixed&quot;</code> | Blank mode: opened, closed, or mixed local choices. |
  | <code>open</code> | <code>string</code> | <code>&quot;&quot;</code> | Initial panels: both (also a bare attribute), input, or output. Absent or invalid values collapse the question. |
  | <code>score</code> | <code>boolean</code> | <code>false</code> | Displays the numerical score in submission feedback. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of a JSON, HTML, Markdown, reStructuredText, or AsciiDoc question definition. |
  | <code>timing</code> | <code>string</code> | <code>&quot;&quot;</code> | Optional nonzero time limit in strict hh:mm:ss format. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-question>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpQuestion`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-question-submit</code> | <code>&#123; value: string &#125;</code> | - Fired when the submit icon button is activated.<br>`detail: { value: unknown }` |
  [Events emitted by `<tp-question>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-question>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_question.TpQuestion.html)
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
  <script type="module" src="/path/to/components/question/question.js"></script>
  ```

import
: ```js
  import "/path/to/components/question/question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/question/question.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-question>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-badge
@summary Badge component for compact status labels.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
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
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-mask
@summary Replaces an anchored element with a message while active.
-->
<!--
@tp-dependency tp-switcher
@summary Switches between horizontal and vertical layouts based on available space.
-->
<!--
@tp-dependency tp-tabs
@summary Accessible tabs component with keyboard and reorder support.
-->
<!--
@tp-dependency tp-timer
@summary Countdown timer with stop control and optional ring.
-->

- [`<tp-badge>`](../badge/index.md) : Badge component for compact status labels.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-mask>`](../mask/index.md) : Replaces an anchored element with a message while active.
- [`<tp-switcher>`](../switcher/index.md) : Switches between horizontal and vertical layouts based on available space.
- [`<tp-tabs>`](../tabs/index.md) : Accessible tabs component with keyboard and reorder support.
- [`<tp-timer>`](../timer/index.md) : Countdown timer with stop control and optional ring.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
