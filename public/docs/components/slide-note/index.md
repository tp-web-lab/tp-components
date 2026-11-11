<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="slide-note" library="components" size="1.25em"></tp-icon> Slide note

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-slide-note>` element displays collapsible speaker notes for a presentation.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-slide-note legend="Speaker notes" lang="en-GB" show-text="">
  <script type="tp/txt">Introduce the idea. [trigger=clic] Explain the next step.</script>
</tp-slide-note>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-slide-note" src="/docs/components/slide-note/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-slide-note></tp-slide-note>
  ```

`value` attribute
: ```html
  <tp-slide-note value="Introduce the idea. [trigger=clic] Explain the next step."></tp-slide-note>
  ```

internal script
: ```html
  <tp-slide-note legend="Speaker notes" lang="en-GB" show-text="">
    <script type="tp/txt">Introduce the idea. [trigger=clic] Explain the next step.</script>
  </tp-slide-note>
  ```

external file
: ```html
  <tp-slide-note src="/docs/components/slide-note/examples/initial-content.txt"></tp-slide-note>
  ```
:::

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

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Expand Speaker notes, read the transcript and try the inherited speech controls. Collapse the panel while narration continues.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

External notes
: Expand the notes loaded from a text file and start reading. The standard speech settings and pauses apply to this source too.
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
@tp-dependency tp-text-to-speech
@summary Reads textual component content aloud with the Web Speech API.
-->

- [`<tp-text-to-speech>`](#/components/text-to-speech/index.md) : Reads textual component content aloud with the Web Speech API.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
