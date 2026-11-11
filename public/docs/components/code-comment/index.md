<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="code-comment" library="components" size="1.25em"></tp-icon> Code comments

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-code-comment>` element associates an ordered annotation list with numbered comments in a code editor.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
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
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-code-comment" src="/docs/components/code-comment/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

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

### Programming notes

`htmlFor` reflects the `for` attribute. The component registers its list numbers and author items with the editor through `setCodeCommentNumbers(owner, numbers, comments)`; passing an empty array releases that owner's decorations. Number decorations use CodeMirror rather than modifying its managed DOM or the author's source. Syntax-tree changes and document edits update the icons automatically, while reconfiguration preserves editing history and selection.

The numbered code markers reuse `tp-tooltip` on hover and focus. Tooltips clone the current explanation, omit generated numbering, and update when the author item changes. Formatting and SVG references are preserved without duplicating IDs; interactive content remains usable in the original list. Tooltips and observers are removed when markers disappear or the component is disconnected. When several lists explain the same number, the last registered list supplies the tooltip.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Hover or focus a numbered code marker to read its explanation in a tooltip; press Escape to close it. Edit the code without changing how the original source is copied or saved.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-latex
: ::include{examples/examples-latex.html}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-callout>`](#/components/callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-code-editor>`](#/components/code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
