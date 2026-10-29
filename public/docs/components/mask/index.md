# <tp-icon name="mask" library="components" size="1.25em"></tp-icon> Mask

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-mask>` element hides an anchored element and displays its own message in its place while active.

<tp-textfield id="mask-answer" label="Answer" value="Thursday" clearable></tp-textfield>
<tp-mask anchor="#mask-answer" active>The answer is hidden until the review.</tp-mask>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Mask message | Read the replacement message. The hidden target cannot be clicked. |
| Using the component | There is no built-in dismiss button or component-specific pointer gesture. Author-provided controls may change its state. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Skip the hidden target. Any interactive content supplied in the message remains reachable. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to the focused component. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Author directives

Set `anchor` to a CSS selector identifying one element in the same document, preferably a unique ID such as `#answer`. Put the replacement message inside the mask. Rich content and other components are supported.

`active` is a boolean attribute, absent by default. Add it to hide the target; remove it to reveal the target. In JavaScript, use `mask.active = true` or `mask.active = false`. Writing `active="false"` still activates the mask because the attribute is present.

The mask temporarily takes the target’s place in the document flow. Its height follows the message rather than reserving the target’s original height. The target is hidden with `display: none` and made inert and hidden from assistive technology. Focus inside it moves to the message on activation. Keep any control used to reveal the target outside that target.

Deactivation, changing the anchor or removing the mask restores the target’s previous display, inert and ARIA state. The target itself is not moved or recreated, preserving its input values and listeners. Its scripts and media are not paused automatically. This is a presentation control, not access control: the underlying content remains in the document.

An empty, invalid or missing selector displays nothing and changes no target. A target inserted later is detected automatically. A resolved target remains bound until it is removed, the anchor changes or the mask is deactivated. Self, ancestor and descendant targets are ignored to avoid hiding the mask itself. Multiple active masks keep their shared target hidden until the last one is released.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the replacement message hiding the answer field. The target remains in the document with its value preserved.

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

<!-- tp-docgen:api TpMask -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>active</code> | <code>boolean</code> | <code>false</code> | Hides the target and displays the mask content in its place. |
  | <code>anchor</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector of the element to mask in the same document. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-mask>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpMask`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-mask>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-mask>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_mask.TpMask.html)
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
  <script type="module" src="/path/to/components/mask/mask.js"></script>
  ```

import
: ```js
  import "/path/to/components/mask/mask.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/mask/mask.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-mask>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
