<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="save-audio" library="components" size="1.25em"></tp-icon> Save audio

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-save-audio>` element saves the associated audio in its original format.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<p>Listen to the sound of breaking glass, then save the MP3 file.</p>
<audio id="save-audio-example" controls="" preload="metadata" aria-label="Sound of breaking glass">
  <source src="/docs/medias/audios/glass-break.mp3" type="audio/mpeg">
</audio>
<tp-save-audio anchor="#save-audio-example" filename="glass-break"></tp-save-audio>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-save-audio" src="/docs/components/save-audio/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Set `anchor` to the CSS selector of an `<audio>` element or a component exposing `saveAudio(format, filename): Promise<boolean>`. The target generates and saves the file, returning true after success or false on cancellation. JavaScript can assign the same provider through the `target` property instead of a selector.

`format` selects the initial format (MP3 by default). Successful saves update the selected format. `filename` supplies a base name without the extension. `name`, `variant`, `size` and `disabled` configure the trigger. `save(format)` starts a download programmatically. The component prevents simultaneous requests and emits `tp-save-audio-save` on success or `tp-save-audio-error` on failure.

For an `<audio>` element, the component downloads an existing source in the chosen format. Declare its MIME type on a `<source>` element, or use a `.mp3`, `.ogg` or `.wav` extension on `src`. The menu shows only the format of the source selected by the audio player. Before a source is selected, it shows the supplied formats. This component does not transcode audio. The introduction supplies a local MP3 recording, so the menu contains only MP3.

The default trigger uses the `save-audio` icon from the components library, with the same lower-right download arrow as `tp-save-image`. An explicit `name` selects an icon from the standard library.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/save-audio/save-audio.js"></script>
  ```

import
: ```js
  import "/path/to/components/save-audio/save-audio.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/save-audio/save-audio.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Play the local sound of breaking glass, then open Save audio and choose MP3 to download it. Only MP3 is shown, matching the recording’s format.

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
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
