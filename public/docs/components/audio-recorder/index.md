# <tp-icon name="audio-recorder" library="components" size="1.25em"></tp-icon> Audio recorder

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-audio-recorder>` element records a spoken response locally for replay and download, with optional speech transcription into another element.

<tp-audio-recorder></tp-audio-recorder>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Record | Request microphone access, capture a new response and transcribe it when configured. |
| Stop | Finish capturing and prepare the audio for replay; allow final transcription results to arrive. |
| Clear | Remove the current recording and clear the written transcript. |
| Playback controls | Listen, pause and seek in the recorded response. |
| Download recording | Save the audio file on your device. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between available controls. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate a focused button. Native playback shortcuts depend on the browser. |
| <kbd>Enter</kbd> on Download recording | Save the audio file. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to the focused component. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Author directives

Place `<tp-audio-recorder></tp-audio-recorder>` where learners should record a spoken response. No attribute or child content is required for audio-only recording. The component creates its own recording controls, playback element, download link and status message.

Microphone permission is requested only after Record is selected. Use localhost or HTTPS and a browser supporting MediaRecorder. If permission is declined, a message explains how to retry; the rest of the document stays usable. The browser chooses the recording format (usually WebM or MP4).

Record again to replace a previous response after the new capture succeeds. Clear removes the current recording and clears its transcript target. Recordings stay in memory: download before leaving the page. Navigation, disconnection and page exit release the microphone and discard local audio. No grading or audio-file upload is performed by the component.

Simultaneous recording and transcription is temporarily enabled only in Safari. In other browsers, setting `transcript` displays a warning: recording remains available, but transcription does not start.

Set `transcript="#spoken-answer"` to transcribe speech into the first element matching that CSS selector in the recorder's document. A `tp-textfield`, input or textarea receives the text through its `value`; another element receives plain `textContent`. The target must exist when Record is pressed and must not contain the recorder or belong to its internal controls. Missing or invalid targets produce a status message without blocking audio recording.

Only final recognition results are written. Each new recording replaces the target text when its first final result arrives, then updates the complete transcript without duplicating earlier phrases. Both `input` and `change` events bubble from the target, so a textfield inside `tp-fill-blank-question` is collected and checked like a typed answer. Provide an Answers list for automatic correction; for free speech with self-assessment, use `tp-question` instead.

Use `lang="en-US"` (or another language tag) on the recorder or an ancestor to choose the recognition language. Stop allows pending final results; Clear cancels recognition and clears the transcript. Changing `transcript` or `lang`, disconnecting the recorder or starting another recording cancels the old recognition session. Review or edit the result after recognition finishes. Wait for “Listening…” before speaking. Provisional words appear in the status; only finalized words are written to the target. If the browser ends a session after producing finalized text while recording continues, recognition resumes and retains earlier segments. Sessions ending without finalized words, or with an error, are not retried automatically; the status explains how to continue.

Transcription uses the browser's Web Speech API, whose availability varies. Some browsers send audio to an online recognition service; optional transcription is therefore not guaranteed to stay on the device or work offline. When recognition is unavailable or denied, audio recording remains usable and learners can type their answers. See [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

When embedding the component in an iframe, its containing page must permit microphone access. Do not request permission on page load; the component requests it only after the user selects Record.

Listen for `tp-audio-recorded` to obtain the completed recording as `event.detail.blob`. The component does not upload this data. Its recording controls are user-facing; `start`, `stop` and `clear` are not public JavaScript methods.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Record a short response, stop, replay it and download the audio. Clear removes the local recording.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Spoken answer
: In Safari, record the word blue, then stop and review the transcription in the answer field. Other browsers record audio only and show a warning. Submit checks the editable answer as a single blank.
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

<!-- tp-docgen:api TpAudioRecorder -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>legend</code> | <code>string</code> | <code>&quot;Audio recorder&quot;</code> | Caption of the fieldset surrounding the controls. |
  | <code>transcript</code> | <code>string</code> | <code>&quot;&quot;</code> | Safari only (temporary): CSS selector of the element receiving recognized speech; fields receive their value, other elements receive text. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-audio-recorder>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>clear</code> | <code>clear(cancelTranscript = true): void</code> | Removes the recording and optionally clears transcription. |
  | <code>start</code> | <code>start(): Promise&lt;void&gt;</code> | Starts local recording after an explicit action. |
  | <code>stop</code> | <code>stop(): void</code> | Finishes the recording or cancels a pending microphone request. |
  [Public methods of `TpAudioRecorder`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-audio-recorded</code> | <code>&#123; blob: Blob &#125;</code> | Emitted when a recording is ready. |
  [Events emitted by `<tp-audio-recorder>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-audio-recorder>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_audio-recorder.TpAudioRecorder.html)
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
  <script type="module" src="/path/to/components/audio-recorder/audio-recorder.js"></script>
  ```

import
: ```js
  import "/path/to/components/audio-recorder/audio-recorder.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/audio-recorder/audio-recorder.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-audio-recorder>` are loaded automatically by this component if they have not already been loaded by another component.

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

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->

Uses the browser’s MediaRecorder API and, when `transcript` is configured, SpeechRecognition (or its prefixed implementation). Recognition may depend on an online service provided by the browser.
