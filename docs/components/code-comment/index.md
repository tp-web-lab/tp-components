# <tp-icon name="code-comment" library="components" size="1.25em"></tp-icon> Code comments

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-code-comment>` element implements the code annotation functionality: associates an ordered annotation list with numbered comments in a code editor.

<tp-code-editor id="commented-function" language="typescript">
  <script type="tp/typescript">
    function f(x: number): number {
      if (x > 0) { return 2 * x; } // <1>
      else { return 4 * x; } // <2>
    }
  </script>
</tp-code-editor>
<tp-code-comment for="commented-function">
  <ol>
    <li>Positive values are doubled.</li>
    <li>Zero and negative values are multiplied by four.</li>
  </ol>
</tp-code-comment>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Hover a numbered icon in the code | Show its explanation in a tooltip, preserving the list item's formatting. |
| Numbered icons in the explanation list | Match each explanation to the code marker with the same number. |
| Editing the linked code | Update the markers as the source changes; the annotation list does not change the source text. |
| Copy or save in the linked editor | Keep the original comments, including literal numbered markers. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Escape, then Tab from the editor | Leave code indentation mode and focus a numbered marker. Its explanation opens as on hover; Tab and Shift+Tab move between focusable controls. |
| Escape while a tooltip is open | Close the tooltip without changing the source. |
| Typing in the linked editor | Edit code using the editor's normal keyboard behavior. |
| Ctrl+? | Open User help for the component under the pointer, falling back to the focused component. Include Shift if needed to type ?. |

### Author directives

The explanation list is hidden by default. Add the boolean `open` attribute to display it, or remove it to hide it again. Numbered code markers and their tooltips remain available in both states; hiding the list does not remove its content or its association with the editor. Configuration warnings remain visible. The `open` JavaScript property reflects this attribute.

Set `for` to the exact ID of a `tp-code-editor`, without a leading `#`. Both components must be in the same document. The default is an empty string and displays a configuration warning until a matching editor is supplied. The editor may appear before or after the annotation list; changing its ID, replacing it or changing `for` updates the association.

Supply one direct ordered list. Its first item explains `<1>`, its second explains `<2>`, and so on, using sequential numbering from one. Keep standard list numbering rather than overriding start, reversed or individual item values. Rich inline content inside each item is preserved. The same number may appear more than once in the code, and several numbers may appear in one comment. Missing explanations leave unmatched markers as ordinary source text.

Markers must occur inside comments recognized by the editor's language parser: for example `// <1>` or `/* <1> */` in TypeScript/JavaScript/CSS as applicable, `# <1>` in Python, or `<!-- <1> -->` in HTML. Strings, expressions and unparsed plain text are not interpreted. Set the editor language correctly, or supply a typed source script. Unlike [Asciidoctor callouts](https://docs.asciidoctor.org/asciidoc/latest/verbatim/callouts/), this component does not remove comment prefixes or source markers, and does not implement automatic `<.>` numbering.

Both locations reuse `tp-icon` with `library="numbers"`. SVG numbers 1–99 are available; larger lists keep native numbering beyond 99 and show a warning. Decoration is visual only: `getValue()`, clipboard content, saved files and program execution retain the original source. Removing the annotation component restores the editor's plain markers. Multiple lists can reference one editor; removing one does not clear markers still requested by another.

A typed script preserves literal source without HTML parsing:

```html
<tp-code-editor id="my-editor" language="typescript">
  <script type="tp/typescript">const value = 2; // <1></script>
</tp-code-editor>
<tp-code-comment for="my-editor">
  <ol><li>The initial value.</li></ol>
</tp-code-comment>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Hover or focus a numbered code marker to read its explanation in a tooltip; press Escape to close it. Edit the code without changing how the original source is copied or saved.

Attributes
: Set for to commented-function to connect the list to the visible editor; toggle open to show or hide the list while its tooltips remain available. Clear for or enter an unknown ID to show the warning; Reset defaults restores the defaults.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

`htmlFor` reflects the `for` attribute. The component registers its list numbers and author items with the editor through `setCodeCommentNumbers(owner, numbers, comments)`; passing an empty array releases that owner's decorations. Number decorations use CodeMirror rather than modifying its managed DOM or the author's source. Syntax-tree changes and document edits update the icons automatically, while reconfiguration preserves editing history and selection.

The numbered code markers reuse `tp-tooltip` on hover and focus. Tooltips clone the current explanation, omit generated numbering, and update when the author item changes. Formatting and SVG references are preserved without duplicating IDs; interactive content remains usable in the original list. Tooltips and observers are removed when markers disappear or the component is disconnected. When several lists explain the same number, the last registered list supplies the tooltip.

### API

<!-- tp-docgen:api TpCodeComment -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>for</code> | <code>string</code> | <code>&quot;&quot;</code> | Exact ID, without #, of the tp-code-editor to annotate. |
  | <code>open</code> | <code>boolean</code> | <code>false</code> | Show the explanation list; code markers and tooltips remain available when absent. |
  [Attributes of `<tp-code-comment>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpCodeComment`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-code-comment>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-code-comment>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_code-comment.TpCodeComment.html)
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
  <script type="module" src="/path/to/components/code-comment/code-comment.js"></script>
  ```

import
: ```js
  import "/path/to/components/code-comment/code-comment.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/code-comment/code-comment.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-code-comment>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->
<!--
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-code-editor>`](../code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
