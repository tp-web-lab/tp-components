<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="html-multi-slides" library="components" size="1.25em"></tp-icon> HTML multi-slides

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-html-multi-slides>` element presents HTML documents as a slide deck.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-iframe src="/docs/components/html-multi-slides/examples/introduction-frame.html" title="tp-html-multi-slides — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-html-multi-slides" src="/docs/components/html-multi-slides/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

The presentation always includes a horizontal **Manual / Timing / Narration / Note** menu, including in fullscreen. The selected mode follows the `auto` attribute: Manual removes it, Timing sets `auto="timing"`, and Narration sets `auto="notes"`. The URL parameter `mode=manual`, `mode=timing` or `mode=notes` restores the selected mode on loading; changing it through the menu updates this parameter without reloading. Other URL parameters and the slide route are preserved. Automatic playback still starts with Play. Note toggles only the current slide's `tp-slide-note` and is disabled when that slide has no note. Notes remain hidden until opened.

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

### Authoring

```html
<tp-html-multi-slides repository="/slides"></tp-html-multi-slides>
```

### Shared document attributes

This component accepts the same attributes as [`tp-html-multi-pages`](../html-multi-pages/index.md): `repository`, `toolbar`, `menu`, `label`, `git`, `langs`, `logo`, `logo-href`, `brand` and `theme`. They are also available in the Component viewer's Attributes tab and Demo controls. `brand` and `theme` retain their legacy behavior; use the toolbar controls to change the appearance.

The additional `auto` and `timing` attributes configure automatic slide playback.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Move between the slides rendered from the html source.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Automatic notes
: Press Play to read the speaker notes; each clic trigger reveals a step or opens the next slide. Try Pause, Resume and Stop.

Timed steps
: Press Play to reveal each progressive step and change slides every five seconds. Pause preserves the remaining interval; manual navigation stops playback.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-latex
: ::include{examples/examples-latex.html}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

<!--
@tp-dependency tp-markup-multi-slides
@summary presents multi-format pages as a responsive slide deck.
-->

- [`<tp-markup-multi-slides>`](#/components/markup-multi-slides/index.md) : presents multi-format pages as a responsive slide deck.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
