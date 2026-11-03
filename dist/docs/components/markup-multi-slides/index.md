# <tp-icon name="markup-multi-slides" library="components" size="1.25em"></tp-icon> Markup multi-slides

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-markup-multi-slides>` element implements the <tp-icon name="markup-multi-slides" library="components" size="1.25em"></tp-icon> Markup multi-slides functionality: presents multi-format pages as a responsive slide deck.

<tp-iframe src="/docs/components/markup-multi-slides/examples/introduction-frame.html" title="tp-markup-multi-slides — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
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

### Content sizing

Slide content uses relative `em` dimensions for headings, code, tables, content spacing, figure padding, rounded corners, shadows and the default grid, cluster and stack gaps. These dimensions follow the responsive slide font size in all markup variants. The toolbar, slide navigation and speaker notes keep their interface sizing.

For custom slide layouts, use `em` for image sizes, gaps and padding that should grow with the text, and `%` or viewport limits to keep content within the slide. Explicit author dimensions and component-specific sizes remain in effect; entering fullscreen does not replace them automatically. Global reset and design-token defaults remain unchanged outside slides.

### Author directives

`<tp-markup-multi-slides>` specializes `<tp-markup-multi-pages>`. It uses the same toolbar, splitter, sidebar, parsers, source display, fallback page, attributes, and full-window layout. Each linked document is one slide and can contain any markup supported by its format. The sidebar is hidden by default; add `menu` to show it initially.

Its only visual differences are the responsive font size and the bottom navigation made of a [`tp-numberfield`](../numberfield/index.md) in `range` mode without `clearable`, a slide counter, and previous/next arrow buttons. The HTML, Markdown, AsciiDoc and reStructuredText multi-slides variants inherit this navigation. The slider displays the current slide number after its # marker.

The slider has one native tick mark per slide, supplied by a `datalist` through the numberfield's `list` attribute. Marks update when the slide count changes; their appearance depends on the browser.

#### Responsive content size

The content font size adapts continuously to the width of the presentation viewport:

```css
font-size: clamp(1rem, calc(0.65rem + 1.15vw), 2.5rem);
```

The size is therefore limited to a minimum of `1rem` and a maximum of `2.5rem`. Between these limits, it is calculated from `0.65rem` plus `1.15%` of the viewport width. With a root font size of `16px`, the resulting values are approximately:

| Viewport width | Content font size |
| ---: | ---: |
| `500px` | `16px` |
| `1000px` | `21.9px` |
| `1440px` | `27px` |

CSS recalculates this value automatically whenever the presentation viewport changes size; no reload or JavaScript calculation is required. In an embedded example, `vw` follows the iframe viewport. In fullscreen mode, it follows the fullscreen viewport.

#### Progressive content

Add `data-slide-step` to content that must be revealed progressively. Elements without this attribute remain visible from the beginning. Step numbers determine the reveal order, and elements with the same number are revealed together.

```html
<h1>Always visible</h1>
<p data-slide-step="1">Revealed first.</p>
<p data-slide-step="2">Revealed second.</p>
<tp-callout data-slide-step="2">Revealed with the second step.</tp-callout>
```

A click in the slide content, the `Enter` key, the `Space` key, the right arrow key, or the footer right arrow reveals the next step. After the last step, the same action opens the next slide. `Backspace`, the left arrow key, a right click in the slide content, or the footer left arrow hides the previous step; from the first step, it returns to the preceding slide with that slide's steps already revealed. Interactive elements such as links, buttons, fields, the slide range, and code editors keep their normal pointer and keyboard behavior. The sidebar menu and the range navigate directly between slides and reset the selected slide's progressive content.

```html
<tp-markup-multi-slides
  repository="/slides"
  label="Presentation"
  git="https://example.com/presentation.git"
></tp-markup-multi-slides>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Move between the slides rendered from the markup source.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Slides navigation menu
: Open the slide navigation menu and use it to move between the supplied slides.

Automatic notes
: Press Play to read the speaker notes; each clic trigger reveals a step or opens the next slide. Try Pause, Resume and Stop.

Timed steps
: Press Play to reveal each progressive step and change slides every five seconds. Pause preserves the remaining interval; manual navigation stops playback.
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
<!-- tp-docgen:api TpMarkupMultiSlides -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>auto</code> | <code>&quot;&quot; \| &quot;notes&quot; \| &quot;timing&quot;</code> | <code>&quot;&quot;</code> | Enables automatic playback controls. notes follows the current tp-text-to-speech[data-slide-notes] and its [trigger=clic] commands; timing advances each progressive step on a clock. Absent or invalid values keep manual navigation. |
  | <code>timing</code> | <code>number</code> | <code>5000</code> | Positive integer milliseconds per progressive step in timing mode, also used when notes are absent or finished. |
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
  [Attributes of `<tp-markup-multi-slides>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>pauseAuto</code> | <code>pauseAuto(): void</code> | Freezes the current voice or the remaining clock interval. |
  | <code>playAuto</code> | <code>playAuto(): void</code> | Starts or resumes the configured automatic playback after user activation. |
  | <code>stopAuto</code> | <code>stopAuto(): void</code> | Cancels automatic playback while retaining the current slide and reveals. |
  [Public methods of `TpMarkupMultiSlides`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-markup-multi-slides>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-markup-multi-slides>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_markup-multi-slides.TpMarkupMultiSlides.html)
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
  <script type="module" src="/path/to/components/markup-multi-slides/markup-multi-slides.js"></script>
  ```

import
: ```js
  import "/path/to/components/markup-multi-slides/markup-multi-slides.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/markup-multi-slides/markup-multi-slides.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-markup-multi-slides>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-markup-multi-pages
@summary Multi-page documentation with support for multiple markup languages.
-->
<!--
@tp-dependency tp-numberfield
@summary Numeric field with an optional native range slider.
-->
<!--
@tp-dependency tp-slide-note
@summary Collapsible speaker notes with speech playback and presentation docking.
-->
<!--
@tp-dependency tp-text-to-speech
@summary Reads textual component content aloud with the Web Speech API.
-->

- [`<tp-markup-multi-pages>`](../markup-multi-pages/index.md) : Multi-page documentation with support for multiple markup languages.
- [`<tp-numberfield>`](../numberfield/index.md) : Numeric field with an optional native range slider.
- [`<tp-slide-note>`](../slide-note/index.md) : Collapsible speaker notes with speech playback and presentation docking.
- [`<tp-text-to-speech>`](../text-to-speech/index.md) : Reads textual component content aloud with the Web Speech API.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
