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
| Explain the solution | Copy a pedagogical prompt and request an explanation when ai-api is enabled and AI is configured. |
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
| <kbd>Enter</kbd> / <kbd>Space</kbd> on Explain the solution | Copy the prompt and request an explanation when ai-api is enabled and AI is configured. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### AI solution assistance

Set `ai-help="solution"` (or `"both"`) to append **Explain the solution** to the Solution panel. The default is `"none"`; absent and unrecognized values disable assistance. `"feedback"` is reserved for future feedback assistance and currently adds no button.

The generated prompt includes the exercise context, current question, answer choices and proposed solution. Mathematical sources are preserved for tp-math, Markdown/MathJax, math fields and MathML. Code editors supply their full current source, including off-screen lines; line breaks and indentation are preserved. Detected loading errors, pending resources or rendered formulas without recoverable sources prevent copying and submission and display a retry message. It asks for a concise pedagogical explanation of the reasoning in the exercise language, without repeating the visible solution, ending with the equivalent of “D’où la solution proposée.” A short extension is optional. Set `lang` on the exercise or question when its language differs from the page.

The button respects the timed solution lock. Every click copies the prompt; when the boolean `ai-api` attribute is present and the selected provider has an API key configured, it also requests an explanation and displays it below the button. An AI failure keeps the copied prompt available. Results use two tp-tabs panels: AI explanation (with the provider model) and Prompt. The exact generated prompt is always available in the Prompt panel. A copy button at the top right of its text area copies the prompt again. Copy confirmation and preparation messages appear above the tabs; clipboard or prompt errors appear in Prompt, while relay and API errors appear in AI explanation. AI explanations are requested in Markdown and displayed through tp-markdown in restricted mode: paragraphs, lists, code blocks and source-backed mathematical formulas are supported; scripts, includes and interactive components are not executed.

#### Saved explanations

Set `ai-explanation-src="./explanations/slope.md"` to reuse an explanation. The path is relative to the source document, like other component resources. On each click, the component first fetches `slope.prompt.md` and compares it with the current prompt, normalizing only line endings. A matching pair displays `slope.md` through restricted Markdown, without contacting the relay and without requiring `ai-api`. Missing, empty or outdated files fall back to the API when authorized, or the copied prompt. The Prompt tab remains available and timed solution locks still apply.

In Vite development, the first successful API response creates or refreshes both files. Use a unique file per question: `public/docs/explanations/slope.md` and `slope.prompt.md`, for example. Only same-origin `.md` destinations inside an `explanations` directory under Vite's public directory can be written; symlinks are rejected. API failures leave existing files unchanged. A save failure is reported next to the generated explanation. Preview and published sites never write files. Review and commit both files before publication; do not store secrets in exercise content or prompts.

```html
<tp-question ai-help="solution" ai-api ai-explanation-src="./explanations/slope.md">
  <!-- Question definition list, including Solution -->
</tp-question>
```

For local Vite development and preview, add `questionAiPlugin()` from `@tp/tp-components/vite-ai` to the Vite plugins. This is already enabled in the component documentation and TOEIC example. The server reads `.env` files in the project and its ancestor directories (including the shared `@tp/.env`); local configuration takes priority. Restart the server after changing configuration.

`ai-api` is false by default: without the attribute, no relay request is made and the prompt is only copied. Boolean attributes are enabled by presence; do not write `ai-api="false"`.

`ai-assistant` selects `openai` (default), `anthropic`, `google`, or `mistral`. Invalid values fall back to `openai`. Prompts are neutral and identical for all assistants, preserving the pedagogical, language, Markdown, mathematical and code-preservation instructions. Append `/model` to select a specific model, for example `openai/gpt-6-luna`. Only the first slash separates the provider from the model. Without a model (including a trailing slash), the relay uses that provider’s server-configured model, then its built-in fallback. An explicit model takes priority over the server configuration; the relay does not retry with another model if it is unavailable.

```html
<tp-question ai-help="solution" ai-api ai-assistant="openai/gpt-6-luna">
  <!-- Question definition list, including Solution -->
</tp-question>
```

Configure each provider independently in the server `.env`:

| ai-assistant | API key | Optional base URL | Optional model (default) |
| --- | --- | --- | --- |
| openai | OPENAI_API_KEY | OPENAI_BASE_URL | OPENAI_MODEL (`gpt-4.1-mini`) |
| anthropic | ANTHROPIC_API_KEY | ANTHROPIC_BASE_URL | ANTHROPIC_MODEL (`claude-sonnet-4-6`) |
| google | GOOGLE_API_KEY | GOOGLE_BASE_URL | GOOGLE_MODEL (`gemini-2.5-flash-lite`) |
| mistral | MISTRAL_API_KEY | MISTRAL_BASE_URL | MISTRAL_MODEL (`mistral-small-latest`) |

The legacy `AI_API_KEY`, `AI_BASE_URL`, and `AI_MODEL` override the OpenAI settings only. Google also accepts `GEMINI_API_KEY`, `GEMINI_BASE_URL`, and `GEMINI_MODEL`. A missing provider key never falls back to another provider's key. Restart Vite after changing server settings.

Default base URLs are `https://api.openai.com/v1`, `https://api.anthropic.com/v1`, `https://generativelanguage.googleapis.com/v1beta`, and `https://api.mistral.ai/v1`. The relay adapts requests to each provider's API.

The key is never included in browser bundles. The local bridge accepts loopback clients only. A static published site uses clipboard mode; direct AI requests in production require a separately authenticated server implementing the same `/api/tp-question-ai` endpoint. GET with `?assistant=openai|anthropic|google|mistral` returns `{ "available": true|false }`; POST accepts `{ "prompt": "...", "assistant": "openai", "model": "gpt-6-luna", "aiApi": true }` and returns `{ "text": "...", "model": "..." }`. The explanation heading includes the model reported by the provider, falling back to the configured model when omitted.

 Without an AI service, it copies the prompt for pasting into an assistant; if clipboard access is denied, a selectable prompt is displayed.

### Author directives

Numerical scores are hidden by default. Add the boolean `score` attribute to show them in graded questions, for example `<tp-fill-blank-question score>`. Correctness messages, explanations and attempt counters remain available without it. Adding or removing `score` also updates existing feedback without submitting again. As with other boolean attributes, `score="false"` still enables it; omit the attribute to disable it.

The header pairs `--tp-brand-fill-softer` with `--tp-brand-text-on-soft`, and uses `--tp-brand-stroke-soft` for the border. Its title, icon and disclosure arrow follow the same foreground in light and dark themes. Custom palettes should keep these background and foreground tokens coordinated.

Set `timing="00:05:00"` to allow five minutes. The strict `hh:mm:ss` format accepts hours from `00` to `99` and minutes/seconds from `00` to `59`. Missing, invalid and `00:00:00` values disable the time limit. A silent timer without controls appears beside the title, before the disclosure arrow.

Opening a timed question shows a centered message and **Start**. The countdown begins only after Start reveals the content. At zero, a mask replaces the content with “Time limit has expired.” and **Continue**. The Solution tab is disabled during the timed session, including keyboard navigation and solution links in feedback, until automatic grading confirms a correct answer. A correct answer unlocks only that question’s solution immediately; the countdown continues. Continue restores access to the question and its solution without restarting the timer or clearing answers. Collapsing and reopening a question does not pause or restart its countdown. Changing `timing` starts a new waiting session; removing it reveals the content. These rules also apply to specialized questions. Questions inside a timed `tp-exercise` inherit its solution lock without displaying an additional timer. The public `setExerciseTiming(exercise, pending)` method applies or releases one exercise’s lock; a verified correct answer overrides the locks for that question only.

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
  | <code>ai-api</code> | <code>boolean</code> | <code>false</code> | Allows sending AI prompts to the selected provider; without it, prompts are only copied. |
  | <code>ai-assistant</code> | <code>string</code> | <code>&quot;openai&quot;</code> | AI provider, optionally followed by /model; without a model, uses the server configuration. Providers: openai, anthropic, google, mistral. |
  | <code>ai-explanation-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of a saved Markdown explanation; the companion .prompt.md must match the current prompt. |
  | <code>ai-help</code> | <code>&quot;none&quot;\|&quot;feedback&quot;\|&quot;solution&quot;\|&quot;both&quot;</code> | <code>&quot;none&quot;</code> | Optional AI assistance; solution and both enable solution explanations. Feedback assistance is reserved for a future release. |
  | <code>mode</code> | <code>string</code> | <code>&quot;mixed&quot;</code> | Blank mode: opened, closed, or mixed local choices. |
  | <code>open</code> | <code>string</code> | <code>&quot;&quot;</code> | Initial panels: both (also a bare attribute), input, or output. Absent or invalid values collapse the question.<br>  `detail: { value: unknown }` |
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
  | <code>setExerciseTiming</code> | <code>setExerciseTiming(exercise: HTMLElement, pending: boolean): void</code> | Sets an enclosing exercise's solution gate without displaying a local timer. |
  [Public methods of `TpQuestion`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-question-submit</code> | <code>&#123; value: unknown &#125;</code> | Emitted after an answer passes submission validation and preparation. value is the response widget value, whose type depends on the question; invalid or blocked repeated submissions do not emit it. |
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
@tp-dependency tp-copy-code
@summary Copy-to-clipboard button component.
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
- [`<tp-copy-code>`](../copy-code/index.md) : Copy-to-clipboard button component.
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
