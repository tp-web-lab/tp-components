<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="speech-to-text" library="components" size="1.25em"></tp-icon> Speech to text

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-speech-to-text>` element transcribes speech from the microphone into editable text.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-speech-to-text lang="en-US" interim-results=""></tp-speech-to-text>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-speech-to-text" src="/docs/components/speech-to-text/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Add the boolean `record` attribute to capture audio alongside recognition. This combination is temporarily enabled only in Safari. Other browsers show a warning and keep transcription alone, when their recognition API is available. Start begins recognition first and then requests audio capture when listening starts. Wait for the recording status before speaking. Stop, recognition ending, or disabling the component stops capture. Clear removes both outputs. Recording failure does not cancel transcription. Audio stays local and can be replayed or downloaded; recognition may use the browser’s online service. The attribute is absent by default.

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

### Browser support and privacy

Recognition depends on the browser, operating system, language and service availability. The component detects `SpeechRecognition` and the prefixed `webkitSpeechRecognition`; if neither is present, it disables Start and retains keyboard input. An exposed API does not guarantee that its recognition service is usable. Permission denial, unavailable microphones and service/network failures are reported in the status and the error event.

Use HTTPS or localhost and allow microphone access. Embedded examples may also need permission in their containing iframe. Depending on the browser, audio can be sent to a remote recognition service and an internet connection may be required. Without `record`, the component does not store an audio file. Recognition is not guaranteed to work offline. Inform users before they dictate sensitive content. See [SpeechRecognition compatibility and privacy notes](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Start recognition, allow microphone access when requested and speak to inspect the transcript in a supported browser.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

French
: Speak French and inspect the transcript with French recognition configured.

Recording
: In Safari, select Start, wait for audio capture, then speak and select Stop. Review the transcript and replay the recording. Other browsers show a warning and offer transcription alone.
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
@tp-dependency tp-audio-recorder
@summary Records microphone audio locally for replay and download.
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
@tp-dependency tp-stack
@summary Vertical stack layout component.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->

- [`<tp-audio-recorder>`](#/components/audio-recorder/index.md) : Records microphone audio locally for replay and download.
- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](#/components/button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-stack>`](#/components/stack/index.md) : Vertical stack layout component.
- [`<tp-textfield>`](#/components/textfield/index.md) : Single-line and automatically growing multiline text field.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
