# <tp-icon name="text-to-speech" library="components" size="1.25em"></tp-icon> Text to speech

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-text-to-speech>` element implements the <tp-icon name="text-to-speech" library="components" size="1.25em"></tp-icon> Text to speech functionality: reads inline or external text aloud with browser speech synthesis.

The component uses the browser [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API).

<tp-text-to-speech lang="en-GB" show-text>
  <script type="tp/txt">
    Welcome to tp-components. This example uses the browser speech synthesis service.
  </script>
</tp-text-to-speech>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Speak | Start reading the text aloud. |
| Pause | Suspend speech or freeze the remaining scheduled silence. |
| Resume | Continue paused speech or the remaining silence. |
| Stop | End reading and cancel pending segments or pauses. |
| Settings | Choose a voice for the text language; scroll the voice list when it exceeds the available space; Automatic lets the browser choose. Changing the voice stops reading. |
| Compact speaker / stop button | Start or stop reading. Pause, Resume and voice settings are not available in this presentation. |
| Status | Indicates whether speech is ready, playing, paused or unavailable. Voice availability depends on the browser and operating system. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate the focused button. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Voices in a dialogue

Insert `[voice=Name]` anywhere in the source to use a named browser voice for the following text. Names may contain spaces and are matched without regard to case; surrounding spaces are ignored. The selected voice remains active across pauses until the next voice command. `[voice=default]` restores the component voice selected through the settings menu or the `voice` attribute. Each new reading starts with that component voice.

Voice names depend on the browser and operating system. Open Speech voice settings to see names available for the current language. An unknown name falls back to the component voice, or to the browser default if none is selected. An explicitly named voice uses its own language. The command does not change the component's `voice` or `lang` attributes.

Voice commands are neither spoken nor shown with `show-text`. Empty, whitespace-only or unclosed commands remain literal text. Combine them with `[pause=…]` and `pause-between-lines`; a voice change itself does not add a timed pause. If the voice catalogue is initially empty, playback waits up to one second before falling back to the available browser voice.

### Showing selected passages

With the `show-text` attribute, `[hide-text]` hides the following transcript text until `[show-text]` restores its visibility. Text before the first command is visible. Repeated commands simply keep the requested state; an unmatched `[hide-text]` hides the rest of the transcript. These commands affect the displayed transcript immediately, independently of playback progress.

Unless disabled by `[speech-off]`, all passages are still read aloud, including hidden ones. The commands themselves are neither displayed nor spoken. Voice changes and pauses still apply inside hidden passages. Without the `show-text` attribute, the entire transcript remains hidden, even when it contains `[show-text]`. These commands only affect the component's own transcript, not a linked source element. Start/end events contain the enabled spoken text.

```html
<tp-text-to-speech lang="en-GB" show-text>
  <script type="tp/txt">
    Listen and answer the question.
    [hide-text]The workshop starts at nine.[pause=500]
    [show-text]What time does the workshop start?
  </script>
</tp-text-to-speech>
```

### Selecting spoken passages

`[speech-off]` excludes the following text from speech until `[speech-on]` re-enables it. Speech starts enabled on every reading. Repeated commands keep the requested state; an unmatched `[speech-off]` excludes the remainder. These commands are neither shown nor pronounced, and do not change transcript visibility: use `[hide-text]` and `[show-text]` independently for that.

Pauses and line breaks inside a speech-disabled passage do not add silence. Voice commands still select the voice to use when speech resumes. An explicit pause outside the disabled passage is retained. Source offsets are preserved for linked typewriting. If all text is disabled, no utterance or start/end event is produced. Malformed commands remain literal text.

```html
<tp-text-to-speech lang="en-GB" show-text>
  <script type="tp/txt">
    [speech-off]Instructions: listen, then select your answer.
    [speech-on][hide-text]The workshop starts at nine.
    [speech-off][show-text]What time does the workshop start?
  </script>
</tp-text-to-speech>
```

### Author directives

The source can be supplied through `value`, a `tp/txt` or `tp/text-to-speech` script, direct text, or an external file.

::: tp-tabs
value
: ```html
  <tp-text-to-speech value="Welcome to tp-components." lang="en-US" show-text></tp-text-to-speech>
  ```

internal script
: ```html
  <tp-text-to-speech lang="en-US">
    <script type="tp/txt">
      Welcome to tp-components.
    </script>
  </tp-text-to-speech>
  ```

external file
: ```html
  <tp-text-to-speech src="welcome.txt" lang="en-US"></tp-text-to-speech>
  ```

direct text
: ```html
  <tp-text-to-speech lang="en-US">Welcome to tp-components.</tp-text-to-speech>
  ```
:::

The source text is hidden by default; add `show-text` to display it beside the controls.

Set `pause-between-lines="800"` to insert 800 milliseconds of silence between nonempty lines. Its default is 0 (no added silence). Blank lines do not add extra pauses, and there is no automatic pause before the first or after the last line.

Insert `[pause=1500]` anywhere in the source for an explicit 1500-millisecond pause, even without `pause-between-lines`. At a line boundary, an explicit pause replaces the automatic line pause instead of adding to it. `[pause=0]` suppresses that automatic pause. Durations are nonnegative integer milliseconds, up to 2147483647; invalid line durations disable automatic pauses, and malformed commands remain literal text.

Valid pause commands are neither spoken nor displayed with `show-text`. Displayed text retains line breaks. Pause freezes both speech and the remaining silence; Resume continues from that point. Stop, a changed source, a changed `pause-between-lines` value, or removing the component cancels pending segments. Speak restarts from the beginning. Start/end events describe the entire reading, not each segment.


Add the boolean `lite` attribute for a compact version with a single `tp-icon-button`: `speakerphone` starts reading and `speakerphone-off` stops it. The settings menu and Pause/Resume buttons are omitted; `show-text` remains available. The accessible button label changes between Speak and Stop, and the status remains available to assistive technology.

```html
<tp-text-to-speech value="Welcome to tp-components." lang="en-US" lite></tp-text-to-speech>
```

A settings icon (`tp-icon-button`, `name="settings"`, `library="tp"`) before the playback buttons opens a `tp-dropdown` listing voices compatible with `lang` (including an inherited language). For example, `en` or `en-US` offers English voices, while `fr` or `fr-FR` offers French voices. Each entry shows the voice name and its locale. Selecting a voice updates `voice` and stops the current reading, without changing `lang` or starting playback. Automatic removes the explicit voice override and lets the browser choose. The list updates when the browser publishes additional voices.

The installed voices and their quality depend on the browser and operating system. Playback usually requires a user action; `autoplay` may therefore be rejected by browser policy.

By default, the browser chooses its voice for the component's language, including an inherited `lang`. Set `lang="en-US"` for English text or `lang="fr-FR"` for French text. The component selects a specific installed voice only when `voice` is explicitly supplied; an unmatched request leaves the browser's default selection unchanged.

Without `for`, the source order is imposed by the library: `src`, then `value`, then the internal script, then direct text. A loading error from `src` is reported instead of silently selecting a lower-priority source. With `for`, the referenced document element supplies the text instead.

`for` accepts an element ID, without `#`, whether the target is a paragraph, article, list, container or web component. Put the target in the same document before the speech component. Ordinary elements are read without modifying their DOM or animating their contents; only `tp-typewriting` enables synchronized revealing. Paragraphs, list items, table cells and line breaks retain text separators. Scripts, styles, templates, hidden content and form controls are excluded. Images are not described, and closed shadow roots or iframe documents are not traversed. A reference to the speech component itself is rejected; a container containing it is supported, with the speech controls excluded. Editing the target stops playback and refreshes the text for the next reading.

## Examples

Set `for="spoken-text"` to read and progressively reveal a preceding `<tp-typewriting id="spoken-text">` in the same document. The linked text overrides all local speech sources. Speak restarts the reading; Pause and Resume suspend and continue the reveal; Stop, completion or errors show everything. The speech `rate`, not typewriting `speed`, controls playback; the target's `speed`, `delay`, `loop` and `word` are ignored while linked.

Progress follows the browser's [word boundary events](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/boundary_event). Text remains fully visible until the first word boundary arrives, and throughout playback when the voice supplies none. Reduced motion and reader interaction keep it visible too. Use one controller per target and a unique ID. An invalid target displays an error; changing its text stops playback. Remove `for` to restore local sources and independent typewriting.

In the Attributes preview, enter `attributes-spoken-text` in the `for` field to use the synchronized target, or `attributes-reading` for a normal article. Clear it to restore the local source.

The same examples are available in every markup language. **Basic usage** reproduces the introductory example. **Attributes** combines the author controls, including show-text, lite and the linked target. **English voices** and **French voices** let you choose a regional variant and compare its voices with the browser's automatic choice. **Synchronized speech** links playback with typewriting; **Read an element** reads an ordinary article without changing its appearance. Voice availability depends on the browser and operating system.

In **English voices** and **French voices**, choose a regional language variant (locale), then a voice and press Speak. The initial `lang` attribute determines the language family: `en` or `en-*` offers available English locales, `fr` or `fr-*` offers available French locales, and so on. **English voices** starts with `lang="en-US"` and **French voices** with `lang="fr-FR"`. The initial locale remains available for Automatic selection even when no matching voice is listed. The voice list is filtered by the selected locale. English and French sample texts are supplied automatically; for other languages, enter your own text in the editable field. Changing the locale or voice stops the current reading without starting another one. Changing locale resets the voice to Automatic. The selected voice name can be reused in the `voice` attribute; choosing Automatic removes that override. The selector is an example helper, not an additional control in the component itself. Its [JavaScript source](examples/voice-comparison.js) is shared by the four markup examples.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Start reading the supplied text aloud and try the playback controls in a browser with speech synthesis.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

English voices
: Choose among available English voices and compare their readings of the same text.

French voices
: Choose among available French voices and compare their readings of the same text.

Synchronized speech
: Press Speak to reveal the words as the selected voice pronounces them. Try Pause, Resume and Stop; voices without word boundaries leave the full text visible.

Read an element
: Press Speak to read the article referenced by its ID. Its paragraphs and formatting stay unchanged; Pause, Resume and Stop control speech only.

Pauses
: Read the illustration prompt and four choices with 800-millisecond line pauses. The introduction uses a longer explicit pause and choice A adds a short inline pause. Try Pause, Resume and Stop during silence.

Dialogue
: Read a dialogue using named browser voices and pauses. Unavailable names fall back to the component voice; [voice=default] restores it explicitly.
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
<!-- tp-docgen:api TpTextToSpeech -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>autoplay</code> | <code>boolean</code> | <code>false</code> | Starts reading after the source is loaded when browser policy permits it. |
  | <code>for</code> | <code>string</code> | <code>&quot;&quot;</code> | ID of an element supplying readable text; overrides local sources and synchronizes word boundaries when the target is tp-typewriting. |
  | <code>legend</code> | <code>string</code> | <code>&quot;Text to speech&quot;</code> | Caption of the fieldset surrounding the controls. |
  | <code>lite</code> | <code>boolean</code> | <code>false</code> | Replaces playback controls with a single speak/stop icon button. |
  | <code>pause-between-lines</code> | <code>number</code> | <code>0</code> | Silence in milliseconds between nonempty lines; an explicit [pause=...] overrides it at a line boundary. |
  | <code>pitch</code> | <code>number</code> | <code>1</code> | Speech pitch from 0 to 2. |
  | <code>rate</code> | <code>number</code> | <code>1</code> | Speech rate from 0.1 to 10. |
  | <code>show-text</code> | <code>boolean</code> | <code>false</code> | Displays the source text alongside the playback controls. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Text file loaded relative to the containing document. |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Text supplied directly as an attribute. |
  | <code>voice</code> | <code>string</code> | <code>&quot;&quot;</code> | Preferred installed voice name or language tag. |
  | <code>volume</code> | <code>number</code> | <code>1</code> | Speech volume from 0 to 1. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-text-to-speech>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>pause</code> | <code>pause(): void</code> | Pauses speech or a scheduled silence. |
  | <code>resume</code> | <code>resume(): void</code> | Resumes speech or the remainder of a scheduled silence. |
  | <code>speak</code> | <code>speak(): Promise&lt;void&gt;</code> | Uses the browser's voice for the language unless a voice is explicitly requested. |
  | <code>stop</code> | <code>stop(): void</code> | Cancels speech, queued segments and scheduled silence. |
  [Public methods of `TpTextToSpeech`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-text-to-speech-end</code> | <code>&#123; text: string &#125;</code> | Emitted when speech ends or is stopped. |
  | <code>tp-text-to-speech-error</code> | <code>&#123; error: string &#125;</code> | Emitted when loading or speech synthesis fails. |
  | <code>tp-text-to-speech-start</code> | <code>&#123; text: string &#125;</code> | Emitted when speech starts. |
  [Events emitted by `<tp-text-to-speech>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-text-to-speech>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_text-to-speech.TpTextToSpeech.html)
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
  <script type="module" src="/path/to/components/text-to-speech/text-to-speech.js"></script>
  ```

import
: ```js
  import "/path/to/components/text-to-speech/text-to-speech.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/text-to-speech/text-to-speech.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-text-to-speech>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
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
@tp-dependency tp-typewriting
@summary progressively reveals text one letter or one word at a time.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-dropdown>`](../dropdown/index.md) : Dropdown menu component.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-typewriting>`](../typewriting/index.md) : progressively reveals text one letter or one word at a time.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
