# <tp-icon name="save-audio" library="components" size="1.25em"></tp-icon> Save audio

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-save-audio>` element provides an audio download menu with MP3, OGG and WAV formats.

<p>Audio saving is reserved for a future integration. No audio provider is currently connected.</p>
<tp-save-audio disabled></tp-save-audio>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Save audio | Open or close the format menu. |
| MP3 / OGG / WAV | Choose a filename and save in that format. A check marks the current format. |
| Outside the menu | Close the menu. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between controls. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate the focused control or format. |
| <kbd>Escape</kbd> | Close the menu. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to focus. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Author directives

Set `anchor` to the CSS selector of a component exposing `saveAudio(format, filename): Promise<boolean>`. The target generates and saves the file, returning true after success or false on cancellation. JavaScript can assign the same provider through the `target` property instead of a selector.

`format` selects the initial format (MP3 by default). Successful saves update the selected format. `filename` supplies a base name without the extension. `name`, `variant`, `size` and `disabled` configure the trigger. `save(format)` starts a download programmatically. The component prevents simultaneous requests and emits `tp-save-audio-save` on success or `tp-save-audio-error` on failure.

This component is retained for future use. It has no synthesis engine and is not integrated with `tp-text-to-speech`. The introductory control is intentionally disabled until a suitable audio provider is available.

## API

<!-- tp-docgen:api TpSaveAudio -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector of a component implementing saveAudio(format, filename). |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables the trigger. |
  | <code>filename</code> | <code>string</code> | <code>&quot;audio&quot;</code> | Download filename without its extension. |
  | <code>format</code> | <code>&quot;mp3&quot; \| &quot;ogg&quot; \| &quot;wav&quot;</code> | <code>&quot;mp3&quot;</code> | Initially selected audio format. |
  | <code>name</code> | <code>string</code> | <code>&quot;file-download&quot;</code> | Icon used by the trigger. |
  | <code>size</code> | <code>string</code> | <code>&quot;m&quot;</code> | Icon button size. |
  | <code>variant</code> | <code>string</code> | <code>&quot;neutral&quot;</code> | Icon button variant. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-save-audio>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>save</code> | <code>save(format: TpSaveAudioFormat = this.format): Promise&lt;void&gt;</code> | Save. |
  [Public methods of `TpSaveAudio`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-save-audio-error</code> | <code>&#123; format: &quot;mp3&quot; \| &quot;ogg&quot; \| &quot;wav&quot;; error: unknown; anchor: string &#125;</code> | Emitted when the target cannot be exported. |
  | <code>tp-save-audio-save</code> | <code>&#123; format: &quot;mp3&quot; \| &quot;ogg&quot; \| &quot;wav&quot;; filename: string; anchor: string; target: Element &#125;</code> | Emitted after an audio file has been saved. |
  [Events emitted by `<tp-save-audio>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-save-audio>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_save-audio.TpSaveAudio.html)
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

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the disabled audio saving control, retained for a future audio provider.

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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-save-audio>` are loaded automatically by this component if they have not already been loaded by another component.

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

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-dropdown>`](../dropdown/index.md) : Dropdown menu component.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
