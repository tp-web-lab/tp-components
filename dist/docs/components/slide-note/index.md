# Slide note

<tp-toc position="end" expand-all open brand></tp-toc>

Collapsible speaker notes reuse all text-to-speech sources, attributes, playback methods and events.

<tp-slide-note legend="Speaker notes" lang="en-GB" show-text>
  <script type="tp/txt">Introduce the idea. [trigger=clic] Explain the next step.</script>
</tp-slide-note>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Notes summary | Expand or collapse the transcript and speech controls. Closing the panel keeps narration running. |
| Speech controls | Use the text-to-speech component's Speak, Pause, Resume, Stop and voice settings. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Focus the notes summary and available speech controls. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on the summary | Expand or collapse the panel. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Sources and speech settings

Supply a `script` of type `tp/txt`, or a text file through `src`. Relative files resolve from the slide's source context. All attributes of `tp-text-to-speech` are inherited, including `lang`, `voice`, `rate`, `pitch`, `volume`, `show-text`, `lite`, `autoplay` and every pause setting. Its methods and `tp-text-to-speech-*` events retain their names. Set `legend` to name the disclosure and speech controls. The title appears only in the summary; the speech fieldset retains a visually hidden legend for assistive technology. The disclosure otherwise reads “Notes”.

```asciidoc
[tp-slide-note%show-text,src="notes/slide-02.txt",data-tp-source="./",lang="fr",legend="Notes — 2. Plan"]
--
--
```

### Presentation placement

Inside any `tp-*-multi-slides`, notes dock above the mode menu. Mark that menu with `data-slide-mode-menu`; its measured top edge determines the notes' position even when links wrap or the viewport changes. Without a marked mode menu, notes dock above the slide navigation. Outside a presentation, notes stay in the document flow.

```html
<tp-asciidoc-multi-slides repository="/slides" auto="notes"></tp-asciidoc-multi-slides>
<nav data-slide-mode-menu aria-label="Presentation mode">…</nav>
```

The component identifies itself as the slide's notes automatically: no `data-slide-notes` or `details` wrapper is required. In `auto="notes"`, `[trigger=clic]` advances the presentation. Interacting with notes does not advance slides; leaving a slide stops its speech. Keep one note per slide. For several presentations on a page, give each presentation and its menu their own shared container.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Expand Speaker notes, read the transcript and try the inherited speech controls. Collapse the panel while narration continues.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

External notes
: Expand the notes loaded from a text file and start reading. The standard speech settings and pauses apply to this source too.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

AsciiDoc
: ::include{examples/examples.adoc}

Markdown
: ::include{examples/examples.md}

reStructuredText
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API

<!-- tp-docgen:api TpSlideNote -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>open</code> | <code>boolean</code> | <code>false</code> | Expands the notes panel; closing it does not stop narration. |
  | <code>autoplay</code> | <code>boolean</code> | <code>false</code> | Starts reading after the source is loaded when browser policy permits it. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>for</code> | <code>string</code> | <code>&quot;&quot;</code> | ID of an element supplying readable text; overrides local sources and synchronizes word boundaries when the target is tp-typewriting. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>legend</code> | <code>string</code> | <code>&quot;Text to speech&quot;</code> | Caption of the fieldset surrounding the controls. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>lite</code> | <code>boolean</code> | <code>false</code> | Replaces playback controls with a single speak/stop icon button. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>pause-after-colon</code> | <code>number</code> | <code>400</code> | Additional silence in milliseconds after colons at a word boundary; zero preserves browser prosody without adding a timer. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>pause-after-comma</code> | <code>number</code> | <code>200</code> | Additional silence in milliseconds after commas at a word boundary; zero preserves browser prosody without adding a timer. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>pause-after-semicolon</code> | <code>number</code> | <code>400</code> | Additional silence in milliseconds after semicolons at a word boundary; zero preserves browser prosody without adding a timer. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>pause-after-sentence</code> | <code>number</code> | <code>600</code> | Additional silence in milliseconds after sentence punctuation (. ! ? and ellipses) at a word boundary; zero preserves browser prosody without adding a timer. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>pause-between-lines</code> | <code>number</code> | <code>0</code> | Silence in milliseconds between nonempty lines; an explicit [pause=...] overrides it at a line boundary. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>pause-per-blank-line</code> | <code>number</code> | <code>1000</code> | Additional milliseconds for each blank or whitespace-only line between spoken passages; consecutive blank lines accumulate. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>pitch</code> | <code>number</code> | <code>1</code> | Speech pitch from 0 to 2. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>rate</code> | <code>number</code> | <code>1</code> | Speech rate from 0.1 to 10. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>show-text</code> | <code>boolean</code> | <code>false</code> | Displays the source text alongside the playback controls. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Text file loaded relative to the containing document. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Text supplied directly as an attribute. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>voice</code> | <code>string</code> | <code>&quot;&quot;</code> | Preferred installed voice name or language tag. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>volume</code> | <code>number</code> | <code>1</code> | Speech volume from 0 to 1. *(inherited from <code>tp-text-to-speech</code>)* |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-slide-note>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpSlideNote`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-slide-note>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-slide-note-anchor-bottom</code> | <code>0px</code> | Controls the anchor bottom. |
  | <code>&#45;&#45;tp-slide-note-gap</code> | <code>.5rem</code> | = .5rem - Space between docked notes and the presentation menu. |
  | <code>&#45;&#45;tp-slide-note-width</code> | <code>36rem</code> | = 36rem - Maximum width of docked notes. |
  [CSS properties of `<tp-slide-note>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_slide-note.TpSlideNote.html)
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
  <script type="module" src="/path/to/components/slide-note/slide-note.js"></script>
  ```

import
: ```js
  import "/path/to/components/slide-note/slide-note.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/slide-note/slide-note.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-slide-note>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-text-to-speech
@summary Reads textual component content aloud with the Web Speech API.
-->

- [`<tp-text-to-speech>`](../text-to-speech/index.md) : Reads textual component content aloud with the Web Speech API.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
