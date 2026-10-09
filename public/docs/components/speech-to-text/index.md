# Speech to text

<tp-toc position="end" expand-all open brand></tp-toc>

The custom **`<tp-speech-to-text>`** element implements the speech-to-text functionality: transcribes microphone speech into editable text using the Web Speech API.

The component uses the browser [**Web Speech API**](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API).

<tp-speech-to-text lang="en-US" interim-results></tp-speech-to-text>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Start | Request microphone access and begin listening. |
| Stop | Stop listening and let the browser finalize the transcript. |
| Clear | Cancel listening and remove the transcript. |
| Transcript | Click to edit finalized text. Provisional text may change while you speak. |
| Status | Read permission or service errors. Recognition depends on the browser and may send audio to an online service. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Activate the focused button. |
| Typing in the transcript | Edit the recognized text. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

The inherited `lang` attribute determines recognition language. `continuous` requests multiple results within a session; the browser can still end that session. `interim-results` displays provisional text separately; only final text is committed to `value`. Each new session appends to the existing value. Editing `value`, typing in the field, changing recognition settings or disabling the component cancels active recognition to prevent stale results from overwriting edits.

::: tp-tabs
HTML
: ```html
  <tp-speech-to-text lang="en-US" interim-results></tp-speech-to-text>
  ```

JavaScript
: ```js
  const speech = document.querySelector('tp-speech-to-text');
  speech.addEventListener('tp-speech-to-text-result', (event) => {
    console.log(event.detail.value, event.detail.interim);
  });
  ```
:::

Unlike `tp-text-to-speech`, this component acquires input from the microphone, not from a script or `src` file. `value` can supply initial editable text. The public methods are `start()`, `stop()`, `abort()` and `clear()`. Call `start()` from a user action. `abort()` discards provisional results but retains committed text; removing the component also releases its microphone session.

#### Browser support and privacy

Recognition depends on the browser, operating system, language and service availability. The component detects `SpeechRecognition` and the prefixed `webkitSpeechRecognition`; if neither is present, it disables Start and retains keyboard input. An exposed API does not guarantee that its recognition service is usable. Permission denial, unavailable microphones and service/network failures are reported in the status and the error event.

Use HTTPS or localhost and allow microphone access. Embedded examples may also need permission in their containing iframe. Depending on the browser, audio can be sent to a remote recognition service and an internet connection may be required. The component does not record or store an audio file and does not promise offline recognition. Inform users before they dictate sensitive content. See [SpeechRecognition compatibility and privacy notes](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Start recognition, allow microphone access when requested and speak to inspect the transcript in a supported browser.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Basic
: Start recognition, allow microphone access when requested and speak to inspect the transcript in a supported browser.

French
: Speak French and inspect the transcript with French recognition configured.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_rest" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpSpeechToText -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>continuous</code> | <code>boolean</code> | <code>false</code> | Requests multiple recognition results in one session. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables editing and recognition and stops any active session. |
  | <code>interim-results</code> | <code>boolean</code> | <code>false</code> | Displays provisional recognition separately from the final transcript. |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Final transcript, editable without microphone access. |
  [Attributes of `<tp-speech-to-text>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>abort</code> | <code>abort(): void</code> | Cancels recognition, discarding provisional text but retaining final text. |
  | <code>clear</code> | <code>clear(): void</code> | Clears the transcript after cancelling active recognition. |
  | <code>start</code> | <code>start(): void</code> | Starts recognition after an explicit user action; never retries automatically. |
  | <code>stop</code> | <code>stop(): void</code> | Stops listening while allowing the browser to deliver a final result. |
  [Public methods of `TpSpeechToText`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-speech-to-text-end</code> | <code>&#123; value: string &#125;</code> | Emitted when recognition ends or is aborted. |
  | <code>tp-speech-to-text-error</code> | <code>&#123; error: string &#125;</code> | Emitted when recognition fails or is unavailable. |
  | <code>tp-speech-to-text-result</code> | <code>&#123; value: string; interim: string &#125;</code> | Emitted when recognition updates its transcript. |
  | <code>tp-speech-to-text-start</code> | <code>&#123; value: string &#125;</code> | Emitted when recognition starts listening. |
  [Events emitted by `<tp-speech-to-text>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-speech-to-text>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_speech-to-text.TpSpeechToText.html)
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
  <script type="module" src="/path/to/components/speech-to-text/speech-to-text.js"></script>
  ```

import
: ```js
  import "/path/to/components/speech-to-text/speech-to-text.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/speech-to-text/speech-to-text.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-speech-to-text>` are loaded automatically by this component if they have not already been loaded by another component.

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
@tp-dependency tp-stack
@summary Vertical stack layout component.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-stack>`](../stack/index.md) : Vertical stack layout component.
- [`<tp-textfield>`](../textfield/index.md) : Single-line and automatically growing multiline text field.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
