<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="restructuredtext" library="components" size="1.25em"></tp-icon> reStructuredText

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-restructuredtext>` element renders reStructuredText documents.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-restructuredtext>
  <script type="tp/restructuredtext">
    Hello, **Docutils**!
  </script>
</tp-restructuredtext>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-restructuredtext" src="/docs/components/restructuredtext/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

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

### Rendering from JavaScript

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

### Authoring

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

### Python doctests

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

### Extensions to Docutils

`tp-restructuredtext` runs the Python Docutils parser in the browser through Pyodide. It adds HTML and custom-element directives and roles, mathematical notation aliases, source viewers and optional doctest execution. These additions are not automatically available in an ordinary Docutils installation or in Sphinx.

The generated result is an embeddable HTML fragment without Docutils' automatic `main` wrapper. Document titles, subtitles and content are preserved, as is an explicitly authored `main` element. Shared TP styles control its presentation.

### Component directives and attributes

Use the component's tag name as a directive. Write attributes as options and leave a blank line before the indented body:

```rst
.. tp-callout::
   :variant: info
   :heading: Information
   :closable:

   The workshop starts at **9:00**.
```

An option without a value creates a boolean HTML attribute. The body is parsed as reStructuredText and can contain nested directives. Keep all options and body lines indented relative to their directive; inconsistent indentation can produce Docutils errors or unintended block quotes.

Standard HTML elements and third-party custom elements can use the same syntax. The directive creates markup; load the required custom-element definitions with the autoloader or explicit imports.

### Inline roles

Use a direct role for a simple inline component. Define a derived role when attributes are needed:

```rst
A badge: :tp-badge:`Ready`.

.. role:: success-badge(tp-badge)
   :variant: success
   :pill:

Status: :success-badge:`Ready`.

.. role:: check-icon(tp-icon)
   :name: check

Choose :check-icon:`icon` to confirm.
```

Interpreted-text roles require nonempty content. Use a placeholder such as `icon` for `tp-icon`, which replaces that content when rendered. Use inline-capable components inside paragraphs; block structure belongs in directives.

### Literal scripts and source data

A `script` directive preserves its indented body literally rather than parsing it as reStructuredText:

```rst
.. tp-asciidoc::

   .. script::
      :type: tp/asciidoc

      == A section

      A paragraph with *AsciiDoc* formatting.
```

The indentation identifies the body and is removed by the directive parser; indentation inside the source remains meaningful. Block `style`, `textarea` and `template` elements also preserve literal content. Use `:type: module` for JavaScript source. Script preservation and script execution are separate: executable viewer examples require the viewer's `allow-script` option.

For authored HTML, the standard `raw` directive remains available. Prefer component directives when the body should be parsed as reStructuredText.

### Directive names and compatibility

Native directives such as `note`, `code-block`, `list-table` and `csv-table` keep their Docutils meaning. However, the adapter prioritizes recognized HTML tag names: `figure` and `table`, for example, become HTML element directives rather than the native Docutils directives of those names. Do not pass an image filename as an argument to `.. figure::` in this syntax; put an `image` directive inside the element instead:

```rst
.. figure::

   .. image:: landscape.jpg
      :alt: Landscape
```

Use `list-table` or `csv-table` when Docutils should construct a table from source data. Sphinx-only directives and roles are not supplied merely because Docutils is available.

### Source viewers and browser runtime

The `rstviewer` directive presents literal source with its rendered output and can contain named examples:

```rst
.. rstviewer::
   :label: reStructuredText

   .. example:: Paragraph

      A paragraph with **strong text**.

   .. example:: List

      * First item
      * Second item
```

This is an adapter extension, not a native Docutils directive. For the usual TP viewer controls, use [`tp-restructuredtext-viewer`](#/components/restructuredtext-viewer/index.md).

Conversion is asynchronous because the first render loads Python and Docutils. Browser execution does not provide access to local Python installations, arbitrary installed Sphinx extensions or the user's filesystem. Linked resources must be available to the browser. The `doctest` attribute described below adds execution of Python examples; ordinary document conversion does not run doctests.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect how the embedded restructuredtext source is rendered as a formatted document.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

External document
: Load a reStructuredText document through src instead of an internal script.
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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@credit highlight.js https://highlightjs.org/
@summary Source-code syntax highlighting.
-->
<!--
@credit tp-restructuredtext https://www.npmjs.com/package/@tp/tp-restructuredtext
@summary reStructuredText parsing and rendering.
-->
<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [highlight.js](https://highlightjs.org/) : Source-code syntax highlighting.
- [tp-restructuredtext](https://www.npmjs.com/package/@tp/tp-restructuredtext) : reStructuredText parsing and rendering.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
