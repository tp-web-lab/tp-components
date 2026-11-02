# <tp-icon name="video-player" library="components" size="1.25em"></tp-icon> Video player

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-video-player>` element plays native video files and YouTube videos with a common playback API.

<tp-video-player src="/docs/components/video-player/examples/clip-1.mp4" controls label="Moving shapes"></tp-video-player>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Play / Pause in the video | Start or pause playback. |
| Progress bar in the video | Seek to another time when the provider allows seeking. |
| Volume / Mute in the video | Change or mute the sound when the provider exposes this control. |
| Fullscreen in the video | Show the video using the provider's fullscreen mode. |
| Open video / Watch on YouTube | Open the source in a new browser tab. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available playback controls and the source link. |
| Focused playback controls | Use the browser's or YouTube's standard keyboard interactions. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to the focused component. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. Move focus out of the YouTube iframe first. |

### Author directives

Set `src` to a media URL such as an MP4, WebM or blob URL, or a YouTube watch, share or embed link. YouTube short and live links are also recognized. The component uses a native `video` element for media files and the official IFrame Player API for YouTube. A YouTube watch URL cannot be used as a native video source.

Add `controls` to expose the provider's controls. Boolean attributes are enabled by presence: remove `muted`, `loop` or `autoplay` to disable them. `controls="false"` still enables controls, following native boolean-attribute semantics. The defaults do not autoplay or loop.

`poster` and `preload` apply to native files. YouTube supplies its own preview and loading policy. `muted` and `label` can change during playback. Changing `src` starts a new source from the beginning; changing YouTube `controls` or `loop` rebuilds its iframe.

Autoplay and scripted playback can require an additional user gesture. Native `play()` returns the browser playback promise. For YouTube, `play()` queues the request until readiness; listen for `tp-video-player-autoplay-blocked` if the browser requires the user to press Play. A successful call does not guarantee playback has started: `tp-video-player-play` reports that transition.

Use public or unlisted YouTube videos with embedding enabled. The page requires network access to YouTube and a normal HTTP(S) origin/referrer. Local files must be served by a web server or supplied as blob URLs; a file-system path is not a public media URL. The Open video / Watch on YouTube link remains available if embedding fails. Provide captions or an accompanying transcript appropriate to your source.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Play the three-second moving-shapes clip, pause it and seek with the native video controls.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

YouTube video
: Play the author’s French virtual-reality introduction with the YouTube controls. Internet access and an embeddable video are required.
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

<!-- tp-docgen:api TpVideoPlayer -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>autoplay</code> | <code>boolean</code> | <code>false</code> | Requests playback when the source loads; browser autoplay restrictions still apply. |
  | <code>controls</code> | <code>boolean</code> | <code>false</code> | Shows the provider's playback controls. YouTube may still display its initial Play button. |
  | <code>label</code> | <code>string</code> | <code>&quot;Video&quot;</code> | Accessible name for the native video or YouTube iframe. |
  | <code>loop</code> | <code>boolean</code> | <code>false</code> | Repeats the video; a looping video does not normally emit ended. |
  | <code>muted</code> | <code>boolean</code> | <code>false</code> | Mutes the video, including when changed during playback. |
  | <code>poster</code> | <code>string</code> | <code>&quot;&quot;</code> | Image shown before native video playback; YouTube supplies its own preview. |
  | <code>preload</code> | <code>&quot;none&quot; \| &quot;metadata&quot; \| &quot;auto&quot;</code> | <code>&quot;metadata&quot;</code> | Native video preload hint. YouTube loading is controlled by its embedded player. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Native media URL or YouTube watch, share, shorts, live or embed URL. Changing it loads the new video from the beginning. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-video-player>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>pause</code> | <code>pause(): void</code> | Pauses playback and cancels a queued playback request. |
  | <code>play</code> | <code>play(): Promise&lt;void&gt;</code> | Requests playback. YouTube requests made before readiness are queued; its autoplay-blocked event reports browser refusal. |
  | <code>seekTo</code> | <code>seekTo(seconds: number): void</code> | Seeks to a nonnegative position, queuing the request while a provider loads. |
  [Public methods of `TpVideoPlayer`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-video-player-autoplay-blocked</code> | <code>&#123; src: string; provider: &quot;native&quot; \| &quot;youtube&quot; \| &quot;&quot; &#125;</code> | Emitted when YouTube blocks a playback request. Native play() rejects its promise when blocked. |
  | <code>tp-video-player-ended</code> | <code>&#123; src: string; provider: &quot;native&quot; \| &quot;youtube&quot; \| &quot;&quot; &#125;</code> | Emitted when a non-looping video reaches its end. |
  | <code>tp-video-player-error</code> | <code>&#123; src: string; provider: &quot;native&quot; \| &quot;youtube&quot; \| &quot;&quot;; message: string; code?: number &#125;</code> | Emitted when a source is invalid, unavailable or playback fails. |
  | <code>tp-video-player-pause</code> | <code>&#123; src: string; provider: &quot;native&quot; \| &quot;youtube&quot; \| &quot;&quot; &#125;</code> | Emitted when playback pauses. |
  | <code>tp-video-player-play</code> | <code>&#123; src: string; provider: &quot;native&quot; \| &quot;youtube&quot; \| &quot;&quot; &#125;</code> | Emitted when playback starts. |
  | <code>tp-video-player-ready</code> | <code>&#123; src: string; provider: &quot;native&quot; \| &quot;youtube&quot; \| &quot;&quot; &#125;</code> | Emitted when native metadata or the YouTube player is ready. |
  [Events emitted by `<tp-video-player>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-video-player>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_video-player_video-player.TpVideoPlayer.html)
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

## Credits

The two three-second MP4 fixtures were generated for this library from simple moving shapes. The YouTube example is the author's French introduction to virtual reality. YouTube is an external service.

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-video-player>` are loaded automatically by this component if they have not already been loaded by another component.

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
@summary displays content in a fixed-aspect-ratio frame.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-frame>`](../frame/index.md) : displays content in a fixed-aspect-ratio frame.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
