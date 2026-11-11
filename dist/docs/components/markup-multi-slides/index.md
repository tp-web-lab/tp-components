<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="markup-multi-slides" library="components" size="1.25em"></tp-icon> Markup multi-slides

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-markup-multi-slides>` element presents multi-format pages as a responsive slide deck.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-iframe src="/docs/components/markup-multi-slides/examples/introduction-frame.html" title="tp-markup-multi-slides — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-markup-multi-slides" src="/docs/components/markup-multi-slides/examples/introduction.html"></tp-component-viewer>

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

### Content sizing

All slide variants share content width and padding, paragraph spacing, brand-colored titles and emphasis, and responsive limits for images and included SVGs. These rules are scoped to slide content; toolbar and note controls retain their own sizing. Content-specific compositions (logo galleries, comparisons, positioned diagrams) stay in the presentation stylesheet.

Customize the shared defaults on the presentation with `--tp-slide-content-width`, `--tp-slide-content-padding`, `--tp-slide-font-size`, `--tp-slide-title-size`, `--tp-slide-image-height`, `--tp-slide-image-height-small` and `--tp-slide-svg-height`. The smaller image limit applies below 650px. Local figure and image styles can override these defaults.

Slide content uses relative `em` dimensions for headings, code, tables, content spacing, figure padding, rounded corners, shadows and the default grid, cluster and stack gaps. These dimensions follow the responsive slide font size in all markup variants. The toolbar, slide navigation and speaker notes keep their interface sizing.

For custom slide layouts, use `em` for image sizes, gaps and padding that should grow with the text, and `%` or viewport limits to keep content within the slide. Explicit author dimensions and component-specific sizes remain in effect; entering fullscreen does not replace them automatically. Global reset and design-token defaults remain unchanged outside slides.

### Authoring

`<tp-markup-multi-slides>` specializes `<tp-markup-multi-pages>`. It uses the same toolbar, splitter, sidebar, parsers, source display, fallback page, attributes, and full-window layout. Each linked document is one slide and can contain any markup supported by its format. The sidebar is hidden by default; add `menu` to show it initially.

Its only visual differences are the responsive font size and the bottom navigation made of a [`tp-numberfield`](../numberfield/index.md) in `range` mode without `clearable`, a slide counter, and previous/next arrow buttons. The HTML, Markdown, AsciiDoc and reStructuredText multi-slides variants inherit this navigation. The slider displays the current slide number after its # marker.

The slider has one native tick mark per slide, supplied by a `datalist` through the numberfield's `list` attribute. Marks update when the slide count changes; their appearance depends on the browser.

### Responsive content size

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

### Progressive content

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

### Shared document attributes

This component accepts the same attributes as [`tp-markup-multi-pages`](../markup-multi-pages/index.md): `repository`, `toolbar`, `menu`, `label`, `git`, `langs`, `logo`, `logo-href`, `brand` and `theme`. They are also available in the Component viewer's Attributes tab and Demo controls. `brand` and `theme` retain their legacy behavior; use the toolbar controls to change the appearance.

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Move between the slides rendered from the markup source.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Slides navigation menu
: Open the slide navigation menu and use it to move between the supplied slides.

Automatic notes
: Press Play to read the speaker notes; each clic trigger reveals a step or opens the next slide. Try Pause, Resume and Stop.

Timed steps
: Press Play to reveal each progressive step and change slides every five seconds. Pause preserves the remaining interval; manual navigation stops playback.
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
@tp-dependency tp-markup-multi-pages
@summary Multi-page documentation with support for multiple markup languages.
-->
<!--
@tp-dependency tp-menu
@summary Accessible menu component.
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

- [`<tp-markup-multi-pages>`](#/components/markup-multi-pages/index.md) : Multi-page documentation with support for multiple markup languages.
- [`<tp-menu>`](#/components/menu/index.md) : Accessible menu component.
- [`<tp-numberfield>`](#/components/numberfield/index.md) : Numeric field with an optional native range slider.
- [`<tp-slide-note>`](#/components/slide-note/index.md) : Collapsible speaker notes with speech playback and presentation docking.
- [`<tp-text-to-speech>`](#/components/text-to-speech/index.md) : Reads textual component content aloud with the Web Speech API.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
