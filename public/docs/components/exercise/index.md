# <tp-icon name="exercise" library="components" size="1.25em"></tp-icon> Exercise

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-exercise>` element groups a shared context and an ordered list of questions, with an optional countdown for the whole activity.

<tp-exercise open>
  <dl>
    <dt>Title</dt><dd>A day at the museum</dd>
    <dt>Context</dt><dd>The museum opens at 9 a.m. Admission costs 8 euros.</dd>
    <dt>Questions</dt><dd><ol class="questions">
      <li><tp-question open="input"><dl>
        <dt>Title</dt><dd>Opening time</dd>
        <dt>Prompt</dt><dd>When does the museum open?</dd>
        <dt>Form</dt><dd><tp-textfield label="Your answer"></tp-textfield></dd>
        <dt>Feedback</dt><dd>Compare your answer with the opening time in the context.</dd>
        <dt>Solution</dt><dd>At 9 a.m.</dd>
      </dl></tp-question></li>
      <li><tp-question open="input"><dl>
        <dt>Title</dt><dd>Admission</dd>
        <dt>Prompt</dt><dd>How much do two tickets cost?</dd>
        <dt>Form</dt><dd><tp-textfield label="Your answer"></tp-textfield></dd>
        <dt>Feedback</dt><dd>Multiply the price of one ticket by two.</dd>
        <dt>Solution</dt><dd>16 euros.</dd>
      </dl></tp-question></li>
    </ol></dd>
  </dl>
</tp-exercise>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Exercise title | Expand or collapse the context and questions. |
| Start | Reveal the context and questions and begin the shared countdown. |
| Continue | Reveal the context and questions after expiry, preserving answers. |

Question controls belong to each question and have their own User help.

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between available controls. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Expand or collapse the focused summary, or activate the focused Start or Continue button. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to the focused component. <kbd>Shift</kbd> may be needed to type ?. |

Successful automatically graded answers also show “Bonne réponse trouvée en hh:mm:ss.” in Feedback. Elapsed time is measured from Start on the question timer, or on the nearest enclosing exercise timer when the question has none.

### Author directives

Use a direct definition list with **Title**, **Context** and **Questions** entries. Put rich content in the Context description, and an ordered list of `tp-question` elements, specialized questions or nested `tp-exercise` elements in Questions. Questions and sub-exercises can be mixed in the same list. Each nested exercise has its own Title, Context, Questions, disclosure state and optional timer. The parent countdown gates the entire activity; collapsing a parent does not pause nested timers. The original content and question elements are retained. Each question handles its own submission, feedback and solution; the exercise does not combine scores or submit answers automatically.

The **Title** description supplies the summary beside the `exercise` icon from the `components` library. It supports rich content and defaults to Exercise when omitted. The exercise uses a native details/summary disclosure, initially collapsed unless the boolean `open` attribute is present. Collapsing it preserves answers and does not pause an active countdown.

Set `timing="00:05:00"` for a five-minute limit. As with questions, hours use two digits and minutes/seconds range from 00 to 59. Missing, invalid and zero durations disable timing. Start reveals the entire context and question list and begins a silent countdown. At expiry, the content is replaced by a message and Continue. Continue reveals the same content and answers without restarting the timer. Changing timing creates a new waiting session; removing it cancels the timer and reveals the content.

The exercise timer controls access to the whole activity. A verified correct answer gives access to that question’s solution immediately, including when the question has its own timer. All other questions keep their solutions locked until the exercise expires and Continue is selected. This shared restriction adds no timer to question headers. For nested exercises or questions with their own timer, all applicable deadlines must be released unless that question has a verified correct answer. Countdowns continue. Questions retain their optional timers; omit individual question timers when only a shared deadline is wanted. Removing and reconnecting the exercise starts a new waiting session.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the shared museum context, answer both questions and submit each answer to inspect its feedback and solution.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Timed exercise
: Select Start to reveal the context and both questions for ten seconds. After expiry, select Continue to recover the answers without restarting the countdown.

Nested exercises
: Answer a standalone question, then expand the nested exercise to read its own context and answer its question. Collapse and reopen either exercise: answers are preserved.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_rst" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API

<!-- tp-docgen:api TpExercise -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>open</code> | <code>boolean</code> | <code>false</code> | Initially expand the exercise. |
  | <code>timing</code> | <code>string</code> | <code>&quot;&quot;</code> | Optional nonzero time limit in strict hh:mm:ss format. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-exercise>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpExercise`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-exercise>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-exercise>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_exercise.TpExercise.html)
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
  <script type="module" src="/path/to/components/exercise/exercise.js"></script>
  ```

import
: ```js
  import "/path/to/components/exercise/exercise.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/exercise/exercise.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-exercise>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-mask
@summary Replaces an anchored element with a message while active.
-->
<!--
@tp-dependency tp-question
@summary Base description-list container for question components.
-->
<!--
@tp-dependency tp-timer
@summary Countdown timer with stop control and optional ring.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-mask>`](../mask/index.md) : Replaces an anchored element with a message while active.
- [`<tp-question>`](../question/index.md) : Base description-list container for question components.
- [`<tp-timer>`](../timer/index.md) : Countdown timer with stop control and optional ring.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
