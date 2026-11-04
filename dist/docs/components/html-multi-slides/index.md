# HTML multi-slides

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-html-multi-slides>` element implements the HTML multi-slides functionality: presents a navigable repository of native HTML slides.

<tp-iframe src="/docs/components/html-multi-slides/examples/introduction-frame.html" title="tp-html-multi-slides — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>

## Usage

The presentation always includes a horizontal **Manual / Timing / Narration / Note** menu, including in fullscreen. The selected mode follows the `auto` attribute: Manual removes it, Timing sets `auto="timing"`, and Narration sets `auto="notes"`. The URL parameter `mode=manual`, `mode=timing` or `mode=notes` restores the selected mode on loading; changing it through the menu updates this parameter without reloading. Other URL parameters and the slide route are preserved. Automatic playback still starts with Play. Note toggles only the current slide's `tp-slide-note` and is disabled when that slide has no note. Notes remain hidden until opened.

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Manual / Timing / Narration | Select manual navigation, timed steps or narrated notes; the active mode is highlighted. |
| Note | Open or close the current slide's notes; unavailable on slides without notes. |
| Next arrow / click in slide content | Reveal the next progressive step, then advance to the next slide. |
| Previous arrow / right-click in slide content | Hide the previous step, or return to the preceding slide with its steps revealed. |
| Play automatically / Pause automatic playback | When automatic mode is enabled, start playback or pause it without losing the current voice or remaining interval. |
| Stop automatic playback | Cancel automatic playback and keep the current slide. |
| Speaker notes, when supplied | Open the notes panel or use its speech controls without advancing the slide. |
| Slide slider | Drag to select a slide directly; its progressive content starts again from the beginning. |
| Navigation menu, when shown | Choose a slide directly and stop automatic playback. |
| Links, buttons and fields inside slides | Keep their usual behavior; interacting with them does not advance the slide. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> / <kbd>ArrowRight</kbd> outside editing controls | Reveal the next step or advance to the next slide. |
| <kbd>ArrowLeft</kbd> / <kbd>Backspace</kbd> outside editing controls | Hide the preceding step or return to the previous slide. |
| <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd> on the slide slider | Choose a slide. |
| <kbd>Home</kbd> / <kbd>End</kbd> on the slide slider | Choose the first or last slide. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Automatic playback

Leave `auto` absent for ordinary manual navigation. `auto="notes"` and `auto="timing"` add Play/Pause and Stop buttons. Playback starts only after Play; enabling the attribute alone does not start sound or a clock. These attributes and the `playAuto()`, `pauseAuto()`, `stopAuto()` methods are inherited by all four markup variants.

In notes mode, place a `tp-slide-note` in each slide. It supplies the collapsible panel, inherits all speech attributes and automatically identifies itself as the notes. Mark the presentation mode menu with `data-slide-mode-menu` to dock notes immediately above it; without that menu they dock above slide navigation. An existing `tp-text-to-speech` marked `data-slide-notes` remains supported. Its text can be inline or external. A reached `[trigger=clic]` emits `tp-text-to-speech-trigger` with `detail.name === "clic"`; the presentation reveals the next progressive step, or loads the next slide after the last step. Other trigger names do not navigate. Speaker notes can be inside a `details` panel marked `data-slide-notes-panel`; interacting with that panel does not advance the slide.

In timing mode, `timing="5000"` specifies 5,000 milliseconds **per progressive step**, including slide transitions. Positive integer values up to 2,147,483,647 are accepted; absent or invalid values use 5,000. No speech is started in this mode. If notes are absent or their reading has finished, the same delay paces the remaining steps instead of leaving the presentation stuck. Loading time is not counted: playback waits for the new markup and notes to be ready.

Pause freezes speech or the remaining clock interval; Play resumes it. Stop cancels queued work and retains the current slide. Restarting notes after Stop replays that slide from its beginning and resets its reveals; resuming after Pause preserves both positions. Changing modes or manually navigating by arrows, slide content, links, slider or keyboard stops automation. Playback stops at the end and when the presentation is removed. Speech availability and browser voice policies still apply.

```html
<tp-asciidoc-multi-slides repository="/slides" auto="notes" timing="5000"></tp-asciidoc-multi-slides>
```

A slide declares its own notes, for example in HTML:

```html
<p data-slide-step="1">The next idea.</p>
<tp-text-to-speech data-slide-notes lang="en-GB">
  <script type="tp/txt">Introduction. [trigger=clic] Explanation.</script>
</tp-text-to-speech>
```

Use the equivalent native component syntax in Markdown, AsciiDoc and reStructuredText; the examples below supply each format.

### Author directives

```html
<tp-html-multi-slides repository="/slides"></tp-html-multi-slides>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Move between the slides rendered from the html source.

Automatic notes
: Press Play to read the speaker notes; each clic trigger reveals a step or opens the next slide. Try Pause, Resume and Stop.

Timed steps
: Press Play to reveal each progressive step and change slides every five seconds. Pause preserves the remaining interval; manual navigation stops playback.
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
<!-- tp-docgen:api TpHtmlMultiSlides -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>auto</code> | <code>&quot;&quot; \| &quot;notes&quot; \| &quot;timing&quot;</code> | <code>&quot;&quot;</code> | Enables automatic playback controls. notes follows the current tp-text-to-speech[data-slide-notes] and its [trigger=clic] commands; timing advances each progressive step on a clock. Absent or invalid values keep manual navigation. *(inherited from <code>tp-markup-multi-slides</code>)* |
  | <code>timing</code> | <code>number</code> | <code>5000</code> | Positive integer milliseconds per progressive step in timing mode, also used when notes are absent or finished. *(inherited from <code>tp-markup-multi-slides</code>)* |
  | <code>brand</code> | <code>string</code> | <code>&quot;tp-default&quot;</code> | Legacy brand preset property, such as tp-default. Attribute-driven styling is currently inactive; use the toolbar color control. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>git</code> | <code>string</code> | <code>&quot;&quot;</code> | Repository URL assigned to the toolbar source link when the document shell is created. Set before connecting the component. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Title displayed in the center of the document toolbar. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>langs</code> | <code>string</code> | <code>&quot;&quot;</code> | Comma-separated language codes. The selector is hidden unless at least two distinct codes are declared. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>logo</code> | <code>string</code> | <code>&quot;&quot;</code> | Logo URL displayed at the start of the toolbar, at the default icon-button size. Empty hides the logo. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>menu</code> | <code>boolean</code> | <code>false</code> | Opens the navigation sidebar when present; the toolbar Menu button toggles this attribute. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>repository</code> | <code>string</code> | <code>&quot;/docs&quot;</code> | Root path containing the sidebar, cover and linked documents. The component selects the corresponding HTML, Markdown, AsciiDoc or reStructuredText files. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>theme</code> | <code>TpMarkupMultiPagesTheme</code> | <code>&quot;&quot;</code> | Legacy light, dark or auto property. Attribute-driven styling is currently inactive; use the toolbar theme control. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-html-multi-slides>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpHtmlMultiSlides`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-html-multi-slides>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-html-multi-slides>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_html-multi-slides.TpHtmlMultiSlides.html)
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
  <script type="module" src="/path/to/components/html-multi-slides/html-multi-slides.js"></script>
  ```

import
: ```js
  import "/path/to/components/html-multi-slides/html-multi-slides.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/html-multi-slides/html-multi-slides.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-html-multi-slides>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-markup-multi-slides
@summary presents multi-format pages as a responsive slide deck.
-->

- [`<tp-markup-multi-slides>`](../markup-multi-slides/index.md) : presents multi-format pages as a responsive slide deck.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
