# <tp-icon name="stack" library="components" size="1.25em"></tp-icon> Stack

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-stack>` element implements the <tp-icon name="stack" library="components" size="1.25em"></tp-icon> Stack functionality: stacks child elements vertically with an optional recursive gap and split point.

<tp-stack>
  <tp-box>Step 1: Write a draft.</tp-box>
  <tp-box>Step 2: Review the content.</tp-box>
  <tp-box>Step 3: Publish the document.</tp-box>
</tp-stack>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | This component organizes or presents content. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| Embedded controls, when present | Use their normal keyboard interactions. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

`recursive` applies the stack spacing to nested siblings as well as direct children. Without it, only the direct children are spaced.

`split-after` is a one-based child index: `1` inserts flexible space after the first child, `2` after the second. By default the attribute is absent (`""` in the attribute table), so there is no split; the JavaScript property `splitAfter` returns `null`. Leave the Attributes field empty to keep this default. The stack needs extra available height for the effect to be visible, and the index must precede another child.

In Attributes, enable `recursive` to separate the three lines inside the first box. Enter `1` or `2` in `split-after` to push the following boxes toward the bottom of the fixed-height preview. Clear the field to restore normal spacing.

```html
<tp-stack split-after="2" style="height: 30rem">
  <tp-box>Header</tp-box>
  <tp-box>Content</tp-box>
  <tp-box>Footer pushed toward the bottom</tp-box>
</tp-stack>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the vertical spacing between the three publishing steps.

Attributes
: Enable recursive to space the nested lines inside the first box. Set split-after to 1 or 2 to push the following boxes toward the bottom of the fixed-height stack, then clear it to restore normal spacing.
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
<!-- tp-docgen:api TpStack -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>recursive</code> | <code>boolean</code> | <code>false</code> | Applies the stack gap recursively to descendant siblings instead of direct children only. |
  | <code>split-after</code> | <code>number \| null</code> | <code>&quot;&quot;</code> | One-based child index after which the stack inserts a flexible split. Absent by default: no flexible split (the splitAfter property returns null). Requires available height to separate the groups. |
  [Attributes of `<tp-stack>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpStack`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-stack>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;stack-gap</code> | <code>1rem</code> | Gap inserted between stacked items. |
  [CSS properties of `<tp-stack>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_stack.TpStack.html)
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
  <script type="module" src="/path/to/components/stack/stack.js"></script>
  ```

import
: ```js
  import "/path/to/components/stack/stack.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/stack/stack.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-stack>` are loaded automatically by this component if they have not already been loaded by another component.

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
