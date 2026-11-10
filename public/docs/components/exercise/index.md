<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="exercise" library="components" size="1.25em"></tp-icon> Exercise

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-exercise>` element groups a shared context and an ordered list of questions, with an optional countdown for the whole activity.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-exercise open="">
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
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-exercise" src="/docs/components/exercise/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use a direct definition list with **Title**, **Context** and **Questions** entries. Put rich content in the Context description, and an ordered list of `tp-question` elements, specialized questions or nested `tp-exercise` elements in Questions. Questions and sub-exercises can be mixed in the same list. Each nested exercise has its own Title, Context, Questions, disclosure state and optional timer. The parent countdown gates the entire activity; collapsing a parent does not pause nested timers. The original content and question elements are retained. Each question handles its own submission, feedback and solution; the exercise does not combine scores or submit answers automatically.

The **Title** description supplies the summary beside the `exercise` icon from the `components` library. It supports rich content and defaults to Exercise when omitted. The exercise uses a native details/summary disclosure, initially collapsed unless the boolean `open` attribute is present. Collapsing it preserves answers and does not pause an active countdown.

Set `timing="00:05:00"` for a five-minute limit. As with questions, hours use two digits and minutes/seconds range from 00 to 59. Missing, invalid and zero durations disable timing. Start reveals the entire context and question list and begins a silent countdown. At expiry, the content is replaced by a message and Continue. Continue reveals the same content and answers without restarting the timer. Changing timing creates a new waiting session; removing it cancels the timer and reveals the content.

The exercise timer controls access to the whole activity. A verified correct answer gives access to that question’s solution immediately, including when the question has its own timer. All other questions keep their solutions locked until the exercise expires and Continue is selected. This shared restriction adds no timer to question headers. For nested exercises or questions with their own timer, all applicable deadlines must be released unless that question has a verified correct answer. Countdowns continue. Questions retain their optional timers; omit individual question timers when only a shared deadline is wanted. Removing and reconnecting the exercise starts a new waiting session.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the shared museum context, answer both questions and submit each answer to inspect its feedback and solution.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Timed exercise
: Select Start to reveal the context and both questions for ten seconds. After expiry, select Continue to recover the answers without restarting the countdown.

Nested exercises
: Answer a standalone question, then expand the nested exercise to read its own context and answer its question. Collapse and reopen either exercise: answers are preserved.
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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-mask>`](#/components/mask/index.md) : Replaces an anchored element with a message while active.
- [`<tp-question>`](#/components/question/index.md) : Base description-list container for question components.
- [`<tp-timer>`](#/components/timer/index.md) : Countdown timer with stop control and optional ring.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
