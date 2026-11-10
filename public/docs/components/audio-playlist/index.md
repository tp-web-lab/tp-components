<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="audio-playlist" library="components" size="1.25em"></tp-icon> Audio playlist

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-audio-playlist>` element provides an audio playlist with playback controls and an elapsed-time seek bar.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
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
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-audio-playlist" src="/docs/components/audio-playlist/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

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

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Select a melody, use the native audio controls and advance with Previous or Next. Playback stops at the end of the list.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
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
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-typewriting
@summary progressively reveals text one letter or one word at a time.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button-group>`](#/components/button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-typewriting>`](#/components/typewriting/index.md) : progressively reveals text one letter or one word at a time.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
