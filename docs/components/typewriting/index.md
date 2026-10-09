# <tp-icon name="typewriting" library="components" size="1.25em"></tp-icon> Typewriting

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-typewriting>` element implements the Typewriting functionality: progressively reveals text one letter or one word at a time.

<tp-typewriting speed="20">
  <p>Welcome to <strong>tp-components</strong>. Make your words appear progressively.</p>
</tp-typewriting>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Animated text | Watch the text appear progressively. Space is reserved for the complete content to avoid layout shifts. |
| Click the component | Reveal all text immediately and stop repetition. Embedded links and controls retain their own actions. |
| Linked speech controls | Speak starts the spoken reveal; Pause and Resume freeze and continue it. Stop shows all text. Clicking the text shows it without interrupting the audio. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab | Focus the animated component or a control inside it to reveal all text and stop repetition. No extra focus stop remains after completion. |
| Ctrl+? | Open User Help for the component under the pointer, falling back to the focused component. Include Shift if needed to type ?. |

### Author directives

Place the content directly inside the component. `speed` is the number of letters per second (default `20`), or words per second when `word` is present. Higher values reveal text faster: `speed="10"` is slower than `speed="40"`. Fractional values are accepted, for example `speed="0.5" word` reveals one word every two seconds. Letters are Unicode grapheme clusters: accents and combined emoji are not split apart. Word segmentation respects Unicode word boundaries, with adjacent punctuation attached to the word. Formatting boundaries are also segmentation boundaries.

`delay` remains a duration in milliseconds before the first reveal (default `0`). Add `loop` to repeat; the completed text stays visible for `delay` milliseconds, or at least one reveal interval (`1000 / speed` milliseconds), before restarting. `speed="0"` pauses the reveal; clicking or focusing still reveals everything. Changing speed restarts the animation from the beginning. Negative, empty or invalid values use their defaults. Boolean attributes follow presence=true, absence=false.

HTML formatting and author elements are retained, not recreated. Text in native controls, scripts, styles, editable regions, SVG and mathematical content is not animated. Images and other non-text content appear immediately. Changes to the content or animation attributes restart the effect; disconnecting stops timers and restores the original text structure.

Readers requesting reduced motion see the complete content immediately, even with `loop`. Assistive technology receives the full text from the start without repeated live announcements. Use this effect for short decorative passages, not to withhold essential instructions. Clicking or focusing the component stops the current animation; changing its settings can start it again once focus has left.

## Examples

Link a `tp-text-to-speech` with `for="spoken-text"` to a preceding `tp-typewriting` with `id="spoken-text"` in the same document. Its text becomes the single source for speech. While linked, `speed`, `delay`, `loop` and `word` do not drive the reveal: words follow the speech engine's [boundary events](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/boundary_event). Use the speech `rate` to adjust the next reading. Pause freezes the reveal; Resume continues it; Stop, completion and errors show everything.

The complete text stays visible until the first word boundary arrives. With voices that report none, it stays visible throughout; no timing estimate is used. Reduced motion or clicking/focusing the text also keeps it fully visible. Use one speech controller per target. Editing the linked text stops playback; press Speak to read the updated text. Removing `for` restores independent typewriting.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Watch the sentence appear letter by letter while its bold formatting is preserved. Click or focus the component to show everything immediately.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Synchronized speech
: Press Speak to reveal the words as the selected voice pronounces them. Try Pause, Resume and Stop; voices without word boundaries leave the full text visible.
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

Set `speed`, `delay`, `loop` or `word` through attributes or their corresponding JavaScript properties. Changes restart the animation asynchronously. No custom events are emitted.

### API

<!-- tp-docgen:api TpTypewriting -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>delay</code> | <code>number</code> | <code>0</code> | Milliseconds before the first reveal and between repetitions. |
  | <code>loop</code> | <code>boolean</code> | <code>false</code> | Repeats the reveal after the complete text has been displayed. |
  | <code>speed</code> | <code>number</code> | <code>20</code> | Letters per second, or words per second with word; zero pauses the reveal. |
  | <code>word</code> | <code>boolean</code> | <code>false</code> | Reveals whole words instead of Unicode grapheme clusters. |
  [Attributes of `<tp-typewriting>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>attachSpeech</code> | <code>attachSpeech(controller: HTMLElement): void</code> | Gives a speech component ownership; content remains visible until a word boundary arrives. |
  | <code>beginSpeech</code> | <code>beginSpeech(controller: HTMLElement): void</code> | Prepares a reading; unsupported boundary reporting leaves the complete text visible. |
  | <code>detachSpeech</code> | <code>detachSpeech(controller: HTMLElement): void</code> | Releases ownership without letting an obsolete controller affect a newer one. |
  | <code>endSpeech</code> | <code>endSpeech(controller: HTMLElement): void</code> | Restores the complete text after speech ends, stops or fails. |
  | <code>getSpeechText</code> | <code>getSpeechText(): string</code> | Returns the exact readable text, including separators between block elements. |
  | <code>revealSpeech</code> | <code>revealSpeech(controller: HTMLElement, charIndex: number): void</code> | Reveals through the word at a Web Speech UTF-16 character offset. |
  [Public methods of `TpTypewriting`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-typewriting>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-typewriting>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_typewriting.TpTypewriting.html)
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
  <script type="module" src="/path/to/components/typewriting/typewriting.js"></script>
  ```

import
: ```js
  import "/path/to/components/typewriting/typewriting.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/typewriting/typewriting.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-typewriting>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
