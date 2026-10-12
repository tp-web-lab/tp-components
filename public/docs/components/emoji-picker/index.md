# <tp-icon name="emoji-picker" library="components" size="1.25em"></tp-icon> Emoji picker

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-emoji-picker>` element implements the <tp-icon name="emoji-picker" library="components" size="1.25em"></tp-icon> Emoji picker functionality: unicode Emoji 17.0 picker.

<tp-emoji-picker></tp-emoji-picker>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Browse or search the available items, then select one to copy it in the chosen format. |
| Using the component | Use the displayed filters and format selector, when available, to narrow the list or change the copied representation. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `filter` to search names, groups, subgroups, glyphs, or code points. Use `group` to select one of the official groups from `emoji-test.txt`.
Use `copy` to preselect the clipboard format; its default value is `emoji`.

```html
<tp-emoji-picker filter="heart"></tp-emoji-picker>
<tp-emoji-picker group="Smileys & Emotion"></tp-emoji-picker>
<tp-emoji-picker filter="copyright" copy="html-entity"></tp-emoji-picker>
<tp-emoji-picker compact filter="face"></tp-emoji-picker>
```

The component bundles the official Unicode Emoji 17.0 test data and uses its CLDR ordering. It includes all `fully-qualified` emoji sequences and standalone emoji `component` entries. Under the selected emoji, it displays the Unicode notation, hexadecimal HTML references, decimal HTML references, and a named HTML entity when one exists.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Browse the emoji choices and select one to try the picker’s output controls.

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
<!-- tp-docgen:api TpEmojiPicker -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>compact</code> | <code>boolean</code> | <code>false</code> | Shows only the title, filters, and a compact 2em glyph grid. |
  | <code>copy</code> | <code>string</code> | <code>&quot;emoji&quot;</code> | Clipboard format: `emoji`, `unicode`, `hexadecimal-html`, `decimal-html`, or `html-entity`. |
  | <code>filter</code> | <code>string</code> | <code>&quot;&quot;</code> | Free-text filter applied to emoji names and metadata. |
  | <code>group</code> | <code>string</code> | <code>&quot;all&quot;</code> | Active Unicode emoji group (`all` by default). |
  [Attributes of `<tp-emoji-picker>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpEmojiPicker`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-emoji-picker-copy-error</code> | <code>&#123; copy: unknown; value: string; error: unknown &#125;</code> | Emitted when the clipboard rejects a copy operation. |
  | <code>tp-emoji-picker-select</code> | <code>&#123; copy: unknown; value: string &#125;</code> | Emitted after an emoji is selected and copied. |
  [Events emitted by `<tp-emoji-picker>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-emoji-picker>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_emoji-picker.TpEmojiPicker.html)
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
  <script type="module" src="/path/to/components/emoji-picker/emoji-picker.js"></script>
  ```

import
: ```js
  import "/path/to/components/emoji-picker/emoji-picker.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/emoji-picker/emoji-picker.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-emoji-picker>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-radio-list
@summary Transforms a list into a group of radio buttons.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-radio-list>`](../radio-list/index.md) : Transforms a list into a group of radio buttons.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
