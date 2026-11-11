<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="code-editor" library="components" size="1.25em"></tp-icon> Code editor

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-code-editor>` element displays and edits source code.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-code-editor language="javascript" line-numbers="">
  <script type="tp/javascript">
const greeting = "Hello, tp-components!";
console.log(greeting);
  </script>
</tp-code-editor>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-code-editor" src="/docs/components/code-editor/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ``` html
  <tp-code-editor language="python"></tp-code-editor>
  ```
  If the `language` attribute is not specified, the language used is `html`.

`value` attribute
: ``` html
  <tp-code-editor value="<p>hello, world!</p>"></tp-code-editor>
  ```
  If the `language` attribute is not specified, the language used is `html`.

internal script
: ``` html
  <tp-code-editor>
    <script type="tp/javascript">
      console.log('hello, world!');
    </script>
  </tp-code-editor>
  ```
  The script must have a `type` attribute in the form `tp/language`, where `language` is the language used in the script.

external file
: ``` html
  <tp-code-editor src="/path/to/filename.ext"></tp-code-editor>
  ```
  The file extension specifies the language used.
:::

Add the boolean `toolbar` attribute to display the editor toolbar initially.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/code-editor/code-editor.js"></script>
  ```

import
: ```js
  import "/path/to/components/code-editor/code-editor.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/code-editor/code-editor.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit the sample code and try the editor controls.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Using an internal script
: Edit code initialized from an embedded script.

Read-only code
: Select and copy the code while editing is disabled.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> HTML
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_latex" library="languages" size="1.25em"></tp-icon> tp-latex
: ::include{examples/examples-latex.html}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md loading=lazy}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

<!--
@tp-dependency tp-badge
@summary Badge component for compact status labels.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-copy-code
@summary Copy-to-clipboard button component.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->
<!--
@tp-dependency tp-tooltip
@summary Tooltip component.
-->

- [`<tp-badge>`](#/components/badge/index.md) : Badge component for compact status labels.
- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-copy-code>`](#/components/copy-code/index.md) : Copy-to-clipboard button component.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-tooltip>`](#/components/tooltip/index.md) : Tooltip component.

### External

<!--
@credit CodeMirror https://codemirror.net/
@summary Code editing and language support.
-->
<!--
@credit Lezer https://lezer.codemirror.net/
@summary Syntax tree highlighting.
-->

- [CodeMirror](https://codemirror.net/) : Code editing and language support.
- [Lezer](https://lezer.codemirror.net/) : Syntax tree highlighting.
<!-- tp-docgen:dependencies:end -->
