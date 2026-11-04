# <tp-icon name="audio-playlist" library="components" size="1.25em"></tp-icon> Audio playlist

<tp-toc position="end" expand-all open brand></tp-toc>

Play audio tracks from a list of links. Select a track or use the Resume control to begin; playback advances automatically and stops after the last track.

<tp-audio-playlist>
<ol>
<li>
<a href="/docs/components/audio-playlist/examples/track-1.wav">Morning melody</a>
</li>
<li>
<a href="/docs/components/audio-playlist/examples/track-2.wav">Evening melody</a>
</li>
</ol>
</tp-audio-playlist>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Play | Start from the first track in list order. |
| Random | Start a newly shuffled playlist without repeating tracks. |
| Track link | Play the selected track from the beginning. |
| Previous / Next | Play the adjacent track in the current playback order. Disabled at the ends. |
| Resume / Pause | Resume or pause the current track. |
| Playback position | Seek within the current track. Dark indicates elapsed time; light indicates remaining time, independently of buffering. |
| Mute / Unmute and Volume | Toggle sound or adjust its volume. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between track links and playback controls. |
| <kbd>Enter</kbd> on a track | Play that track. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on a button | Activate Play, Random, Previous or Next. Use the arrow keys on the position and volume sliders; Home and End select their minimum and maximum. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to the focused component. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Author directives

Provide a direct child `ul` or `ol`. Each `li` contains a link whose `href` points to a browser-supported audio file and whose text names the track. The first link in each item is used; other text may provide a description or transcript. Relative URLs resolve using the document's base URL. Streaming service pages and YouTube page URLs are not audio files.

Use `src="playlist.html"` to load an HTML fragment or document containing a `ul` or `ol`. The first list is used. A nonempty `src` takes precedence over inline content, which is restored when `src` is removed or cleared. Relative track links resolve against the loaded file URL (including redirects), and `src` uses the usual component source base (`data-tp-source` / containing document).

The file supplies track links and plain-text titles only: scripts, styles, event handlers and extra markup are not imported. Changing `src` stops playback and loads the new list without autoplay. Failed requests or invalid files display an error; empty lists display the empty-playlist message. Late responses from an earlier request are ignored. Remote files require the server to allow cross-origin access.

```html
<tp-audio-playlist src="audio/playlist.html" random></tp-audio-playlist>
```

Example `audio/playlist.html`:

```html
<ol>
  <li><a href="first.mp3">First track</a></li>
  <li><a href="second.mp3">Second track</a></li>
</ol>
```

The player appears above the list. The current title is progressively revealed by `tp-typewriting` below the audio controls. Hovering or focusing a list item highlights its row using the brand colors.

Play restarts from the first track in list order; Random starts a new shuffle. These buttons also update the `random` attribute.

Without `random`, tracks follow document order. With the boolean `random` attribute, a shuffled order is generated without repeating tracks during automatic progression. The visible list keeps its original order and highlights the current track. Previous and Next follow the playback order. Choosing a track manually resumes from its position in that order. There is no automatic looping.

Changing `random` keeps the current track: enabling it puts that track first and shuffles the others; removing it restores document order. List edits rebuild the order and keep the current track when possible. Removing the current track selects a replacement without starting playback. An empty list displays an explanatory message. Disconnecting pauses playback.

Playback never starts merely because the component is loaded. Browser restrictions and network errors are reported in the status area; a failed track is not silently skipped. Select another track or use the Resume control to retry.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Select a melody, use the audio controls and advance with Previous or Next. Playback stops at the end of the list.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
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

<!-- tp-docgen:api TpAudioPlaylist -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>random</code> | <code>boolean</code> | <code>false</code> | Shuffle tracks without repetition; changing this attribute preserves the current track. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | HTML file containing a ul or ol playlist; overrides inline content. Track URLs resolve relative to the file. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-audio-playlist>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpAudioPlaylist`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-audio-playlist>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-audio-playlist>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_audio-playlist.TpAudioPlaylist.html)
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
  <script type="module" src="/path/to/components/audio-playlist/audio-playlist.js"></script>
  ```

import
: ```js
  import "/path/to/components/audio-playlist/audio-playlist.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/audio-playlist/audio-playlist.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-audio-playlist>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
