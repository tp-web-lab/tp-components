<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="emoji-picker" library="components" size="1.25em"></tp-icon> Emoji picker

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-emoji-picker>` element lets readers browse and select Unicode emoji.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-emoji-picker></tp-emoji-picker>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-emoji-picker" src="/docs/components/emoji-picker/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `filter` to search names, groups, subgroups, glyphs, or code points. Use `group` to select one of the official groups from `emoji-test.txt`.
Use `copy` to preselect the clipboard format; its default value is `emoji`.

```html
<tp-emoji-picker filter="heart"></tp-emoji-picker>
<tp-emoji-picker group="Smileys & Emotion"></tp-emoji-picker>
<tp-emoji-picker filter="copyright" copy="html-entity"></tp-emoji-picker>
<tp-emoji-picker compact filter="face"></tp-emoji-picker>
```

The component bundles the official Unicode Emoji 17.0 test data and uses its CLDR ordering. It includes all `fully-qualified` emoji sequences and standalone emoji `component` entries. Under the selected emoji, it displays the Unicode notation, hexadecimal HTML references, decimal HTML references, and a named HTML entity when one exists.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Browse the emoji choices and select one to try the picker’s output controls.

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
@tp-dependency tp-radio-list
@summary Transforms a list into a group of radio buttons.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-radio-list>`](#/components/radio-list/index.md) : Transforms a list into a group of radio buttons.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
