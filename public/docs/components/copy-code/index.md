# <tp-icon name="copy-code" library="components" size="1.25em"></tp-icon> Copy code

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-copy-code>` element implements the <tp-icon name="copy-code" library="components" size="1.25em"></tp-icon> Copy code functionality: copies the textual content of a target component to the clipboard.

<tp-box>
  <tp-box id="intro-copy-code"><pre><code>const answer = 6 * 7;</code></pre></tp-box>
  <tp-copy-code for="intro-copy-code"></tp-copy-code>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Copy button | Copy the associated text. On code blocks, the button appears at the top right on hover or keyboard focus. |
| Check mark | Temporarily confirms that the copy succeeded. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate the focused button. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Author directives

All `pre > code` blocks automatically receive a copy button when the library foundations are initialized, including dynamically loaded content. It appears in the top-right corner on hover or keyboard focus, and remains visible on touch devices. Only the code text is copied. Existing copy controls are preserved; editable content is not enhanced. No additional author markup is required.

Set `for` to the target element ID. The component reports success or failure through `tp-copy-code-success` and `tp-copy-code-error`.

Successful copying temporarily replaces the copy icon with a check mark. No tooltip appears on hover or after copying. The `copied-text` attribute supplies the accessible success label; the idle button is labelled “Copy code”.

```html
<pre id="copy-example"><code>const answer = 42;</code></pre>
<tp-copy-code for="copy-example"></tp-copy-code>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Copy the displayed code and observe the button’s confirmation state.

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
<!-- tp-docgen:api TpCopyCode -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>copied-text</code> | <code>string</code> | <code>Copied!</code> | Accessible feedback text after a successful copy; defaults to Copied!. |
  | <code>error-icon</code> | <code>string</code> | <code>warning</code> | Icon name displayed after a failed clipboard copy; defaults to warning. |
  | <code>for</code> | <code>string</code> | <code>&quot;&quot;</code> | ID of the element whose source text is copied, without a leading #. |
  | <code>icon</code> | <code>string</code> | <code>copy</code> | Icon name displayed before copying; defaults to copy. |
  | <code>success-icon</code> | <code>string</code> | <code>check</code> | Icon name displayed after a successful copy; defaults to check. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-copy-code>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>copy</code> | <code>copy(): Promise&lt;boolean&gt;</code> | Copies the target source text to the clipboard. Resolves to true on success, or false when the target is missing or copying fails; updates feedback and emits the corresponding result event. |
  [Public methods of `TpCopyCode`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-copy-code-error</code> | <code>&#123; message: string &#125;</code> | Emitted when the target cannot be resolved or its contents cannot be copied; message explains the failure. |
  | <code>tp-copy-code-success</code> | <code>&#123; length: number; target: HTMLElement &#125;</code> | Emitted after clipboard writing succeeds. The detail gives the copied text length in UTF-16 code units and the source element. |
  [Events emitted by `<tp-copy-code>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-copy-code-error-color</code> | <code>red</code> | Color of the copy control while reporting a failed clipboard operation. |
  | <code>&#45;&#45;tp-copy-code-success-color</code> | <code>green</code> | Color of the copy control while confirming a successful clipboard operation. |
  [CSS properties of `<tp-copy-code>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_copy-code.TpCopyCode.html)
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
  <script type="module" src="/path/to/components/copy-code/copy-code.js"></script>
  ```

import
: ```js
  import "/path/to/components/copy-code/copy-code.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/copy-code/copy-code.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-copy-code>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-animation
@summary Applies an animation to a target element.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->

- [`<tp-animation>`](../animation/index.md) : Applies an animation to a target element.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
