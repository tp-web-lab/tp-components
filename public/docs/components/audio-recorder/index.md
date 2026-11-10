<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="audio-recorder" library="components" size="1.25em"></tp-icon> Audio recorder

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-audio-recorder>` element records audio for playback, download and optional speech transcription.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-audio-recorder></tp-audio-recorder>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-audio-recorder" src="/docs/components/audio-recorder/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

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

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Record a short response, stop, replay it and download the audio. Clear removes the local recording.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Spoken answer
: In Safari, record the word blue, then stop and review the transcription in the answer field. Other browsers record audio only and show a warning. Submit checks the editable answer as a single blank.
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
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](#/components/button-group/index.md) : Button group component for organizing multiple buttons.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
