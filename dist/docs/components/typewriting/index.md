<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="typewriting" library="components" size="1.25em"></tp-icon> Typewriting

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-typewriting>` element progressively reveals text one letter or one word at a time.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-typewriting speed="20">
  <p>Welcome to <strong>tp-components</strong>. Make your words appear progressively.</p>
</tp-typewriting>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-typewriting" src="/docs/components/typewriting/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Place the content directly inside the component. `speed` is the number of letters per second (default `20`), or words per second when `word` is present. Higher values reveal text faster: `speed="10"` is slower than `speed="40"`. Fractional values are accepted, for example `speed="0.5" word` reveals one word every two seconds. Letters are Unicode grapheme clusters: accents and combined emoji are not split apart. Word segmentation respects Unicode word boundaries, with adjacent punctuation attached to the word. Formatting boundaries are also segmentation boundaries.

`delay` remains a duration in milliseconds before the first reveal (default `0`). Add `loop` to repeat; the completed text stays visible for `delay` milliseconds, or at least one reveal interval (`1000 / speed` milliseconds), before restarting. `speed="0"` pauses the reveal; clicking or focusing still reveals everything. Changing speed restarts the animation from the beginning. Negative, empty or invalid values use their defaults. Boolean attributes follow presence=true, absence=false.

HTML formatting and author elements are retained, not recreated. Text in native controls, scripts, styles, editable regions, SVG and mathematical content is not animated. Images and other non-text content appear immediately. Changes to the content or animation attributes restart the effect; disconnecting stops timers and restores the original text structure.

Readers requesting reduced motion see the complete content immediately, even with `loop`. Assistive technology receives the full text from the start without repeated live announcements. Use this effect for short decorative passages, not to withhold essential instructions. Clicking or focusing the component stops the current animation; changing its settings can start it again once focus has left.

### Programming notes

Set `speed`, `delay`, `loop` or `word` through attributes or their corresponding JavaScript properties. Changes restart the animation asynchronously. No custom events are emitted.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/typewriting/typewriting.js"></script>
  ```

import
: ```js
  import "/path/to/components/typewriting/typewriting.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/typewriting/typewriting.js";
  ```
:::

<!-- -->
## Examples

Link a `tp-text-to-speech` with `for="spoken-text"` to a preceding `tp-typewriting` with `id="spoken-text"` in the same document. Its text becomes the single source for speech. While linked, `speed`, `delay`, `loop` and `word` do not drive the reveal: words follow the speech engine's [boundary events](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/boundary_event). Use the speech `rate` to adjust the next reading. Pause freezes the reveal; Resume continues it; Stop, completion and errors show everything.

The complete text stays visible until the first word boundary arrives. With voices that report none, it stays visible throughout; no timing estimate is used. Reduced motion or clicking/focusing the text also keeps it fully visible. Use one speech controller per target. Editing the linked text stops playback; press Speak to read the updated text. Removing `for` restores independent typewriting.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Watch the sentence appear letter by letter while its bold formatting is preserved. Click or focus the component to show everything immediately.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Synchronized speech
: Press Speak to reveal the words as the selected voice pronounces them. Try Pause, Resume and Stop; voices without word boundaries leave the full text visible.
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
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
