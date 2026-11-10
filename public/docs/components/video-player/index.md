<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="video-player" library="components" size="1.25em"></tp-icon> Video player

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-video-player>` element plays video files and YouTube videos.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-video-player src="/docs/components/video-player/examples/clip-1.mp4" controls="" label="Moving shapes"></tp-video-player>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-video-player" src="/docs/components/video-player/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Set `src` to a media URL such as an MP4, WebM or blob URL, or a YouTube watch, share or embed link. YouTube short and live links are also recognized. The component uses a native `video` element for media files and the official IFrame Player API for YouTube. A YouTube watch URL cannot be used as a native video source.

Add `controls` to expose the provider's controls. Boolean attributes are enabled by presence: remove `muted`, `loop` or `autoplay` to disable them. `controls="false"` still enables controls, following native boolean-attribute semantics. The defaults do not autoplay or loop.

`poster` and `preload` apply to native files. YouTube supplies its own preview and loading policy. `muted` and `label` can change during playback. Changing `src` starts a new source from the beginning; changing YouTube `controls` or `loop` rebuilds its iframe.

Autoplay and scripted playback can require an additional user gesture. Native `play()` returns the browser playback promise. For YouTube, `play()` queues the request until readiness; listen for `tp-video-player-autoplay-blocked` if the browser requires the user to press Play. A successful call does not guarantee playback has started: `tp-video-player-play` reports that transition.

Use public or unlisted YouTube videos with embedding enabled. The page requires network access to YouTube and a normal HTTP(S) origin/referrer. Local files must be served by a web server or supplied as blob URLs; a file-system path is not a public media URL. The Open video / Watch on YouTube link remains available if embedding fails. Provide captions or an accompanying transcript appropriate to your source.

### React to the end of a video

Keep application-specific navigation outside the player. Change the source and request playback from a click handler; show your own menu after the ended event.

```js
const player = document.querySelector('tp-video-player');
player.addEventListener('tp-video-player-ended', () => {
  player.hidden = true;
  document.querySelector('#choices').hidden = false;
});
nextButton.addEventListener('click', async () => {
  document.querySelector('#choices').hidden = true;
  player.hidden = false;
  player.src = nextButton.dataset.src;
  await player.play();
});
```

`currentTime`, `duration`, `paused` and `provider` expose the active provider's state. `seekTo(seconds)` queues a seek if metadata or the YouTube player is not ready. Unsupported or unavailable sources emit `tp-video-player-error` with a message and, when available, a provider error code. Playback events bubble and include the configured `src` and inferred `provider`.

### Credits

The two three-second MP4 fixtures were generated for this library from simple moving shapes. The YouTube example is the author's French introduction to virtual reality. YouTube is an external service.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/video-player/video-player.js"></script>
  ```

import
: ```js
  import "/path/to/components/video-player/video-player.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/video-player/video-player.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Play the three-second moving-shapes clip, pause it and seek with the native video controls.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

YouTube video
: Play the author’s French virtual-reality introduction with the YouTube controls. Internet access and an embeddable video are required.
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
@tp-dependency tp-frame
@summary Component `<tp-frame>`.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-frame>`](#/components/frame/index.md) : Component `<tp-frame>`.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
