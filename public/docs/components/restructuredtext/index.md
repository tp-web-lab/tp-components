# <tp-icon name="restructuredtext" library="components" size="1.25em"></tp-icon> reStructuredText

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-restructuredtext>` element implements the <tp-icon name="restructuredtext" library="components" size="1.25em"></tp-icon> reStructuredText functionality: reStructuredText rendering component.

<tp-restructuredtext>
  <script type="tp/restructuredtext">
    Hello, **Docutils**!
  </script>
</tp-restructuredtext>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | Read the displayed content and use its links and embedded controls. |
| Using the component | The component itself adds no editing or playback controls. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Mathematical formulas use MathJax 4 with SVG output, through the rendering runtime shared with `@tp/tp-markdown`. Inline and display formulas are rendered before nested components capture their content.

Use the `latexmath` role or directive for LaTeX and `asciimath` for AsciiMath; no extension flag is needed. The standard Docutils `math` role and directive remain available, and `latexmath` is their alias. Roles render inline within a sentence, while directives render a separate display formula.

```rst
Inline LaTeX: :latexmath:`\displaystyle \frac{1}{\cos^2(x)}`.
Inline AsciiMath: :asciimath:`1/(cos(x))^2`.

.. latexmath::

   f'(x) = \frac{1}{\cos^2(x)}

.. asciimath::

   f'(x) = 1/(cos(x))^2
```

#### Initial reStructuredText content

::: tp-tabs
no content
: ```html
  <tp-restructuredtext></tp-restructuredtext>
  ```

  An empty component produces an empty document.

internal script
: ```html
  <tp-restructuredtext>
    <script type="tp/restructuredtext">
      Document title
      ==============

      Hello, **Docutils**!
    </script>
  </tp-restructuredtext>
  ```

  Place the source in a direct `<script type="tp/restructuredtext">` child. The script prevents
  the browser from interpreting markup-like content before the component is initialized. Its
  indentation is removed before the source is passed to Docutils.

external file
: ```html
  <tp-restructuredtext src="./example.rst"></tp-restructuredtext>
  ```

  Set `src` to load an external `.rst`, `.rest`, or text file. Relative URLs are resolved from the
  current documentation source.
:::

#### Rendering from JavaScript

The module exports helpers for rendering into an existing element, obtaining HTML, or reading the
JSON-compatible Docutils syntax tree.

```js
import {
  parseRestructuredTextToAst,
  renderRestructuredTextInto,
  renderRestructuredTextToHtml,
} from '@tp/tp-components/components/restructuredtext/restructuredtext.js';

const html = await renderRestructuredTextToHtml('Hello, **Docutils**!');
const ast = await parseRestructuredTextToAst('A paragraph.');
await renderRestructuredTextInto('Another paragraph.', document.querySelector('#output'));
```

The first conversion loads the Pyodide runtime and the Docutils Python package. Later conversions
reuse the same browser runtime.

#### Python doctests

Add the boolean `doctest` attribute to run standard reStructuredText doctest blocks. The expected
output remains part of the source: Python executes the prompt and compares its actual output with
the following lines. The component marks every block as passed or failed; a failed result can be
opened to inspect the standard `Expected`/`Got` report.

<tp-html-viewer lite>
  <template>
    <tp-restructuredtext doctest>
      <script type="tp/restructuredtext">
        >>> print(6 * 7)
        42
      </script>
    </tp-restructuredtext>
  </template>
</tp-html-viewer>

Execution is opt-in because a doctest runs Python code. Variables are shared between the doctest
blocks of one document. After the checks, `tp-restructuredtext-doctest` exposes the totals and the
result of each block in `event.detail`.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect how the embedded restructuredtext source is rendered as a formatted document.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

External document
: Load a reStructuredText document through src instead of an internal script.
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
<!-- tp-docgen:api TpRestructuredText -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>doctest</code> | <code>boolean</code> | <code>false</code> | Runs standard Python doctest blocks and reports their result. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of an external reStructuredText source file. |
  [Attributes of `<tp-restructuredtext>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpRestructuredText`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-restructuredtext-doctest</code> | <code>TpRestructuredTextDoctestResult</code> | Emitted after the document doctests have run. |
  | <code>tp-restructuredtext-rendered</code> | <code>void</code> | Emitted after conversion completes. |
  [Events emitted by `<tp-restructuredtext>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-restructuredtext>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_restructuredtext.TpRestructuredText.html)
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
  <script type="module" src="/path/to/components/restructuredtext/restructuredtext.js"></script>
  ```

import
: ```js
  import "/path/to/components/restructuredtext/restructuredtext.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/restructuredtext/restructuredtext.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-restructuredtext>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@credit tp-restructuredtext https://www.npmjs.com/package/@tp/tp-restructuredtext
@summary reStructuredText parsing and rendering.
-->
<!--
@credit highlight.js https://highlightjs.org/
@summary Source-code syntax highlighting.
-->

- [tp-restructuredtext](https://www.npmjs.com/package/@tp/tp-restructuredtext) : reStructuredText parsing and rendering.
- [highlight.js](https://highlightjs.org/) : Source-code syntax highlighting.
<!-- tp-docgen:dependencies:end -->
