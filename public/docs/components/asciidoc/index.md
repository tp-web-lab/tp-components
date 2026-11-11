<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="asciidoc" library="components" size="1.25em"></tp-icon> AsciiDoc

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-asciidoc>` element renders AsciiDoc documents.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-asciidoc>
  <script type="tp/asciidoc">
== A short document

This paragraph uses *AsciiDoc*.

* Write content
* Add components
* Publish the page
  </script>
</tp-asciidoc>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-asciidoc" src="/docs/components/asciidoc/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-asciidoc></tp-asciidoc>
  ```

  Nothing’s happening.

internal script
: ``` html
  <tp-asciidoc>
    <script type="tp/asciidoc">
      |===
      | Language | Purpose
      | AsciiDoc | Technical writing
      | HTML     | Web documents
      |===
    </script>
  </tp-asciidoc>
  ```

  Place the AsciiDoc source in a `<script type="tp/asciidoc">` child. Keeping the source in a script
  element prevents the browser from interpreting it as HTML before the component is initialized.

external file
: ```html
  <tp-asciidoc src="./example.adoc"></tp-asciidoc>
  ```

  Set `src` to load an external `.adoc` or `.asciidoc` file. Relative URLs are resolved from the
  current documentation source.
:::

### Rendering from JavaScript

The module also exports helpers for rendering into an existing element or obtaining HTML directly.

```js
import {
  renderAsciidocInto,
  renderAsciidocToHtml,
} from '@tp/tp-components/components/asciidoc/asciidoc.js';

const html = await renderAsciidocToHtml('Hello, *Asciidoctor*!');
await renderAsciidocInto('== A section', document.querySelector('#output'));
```

### Authoring

TeX and AsciiMath formulas use MathJax 4 with SVG output, matching the Markdown and reStructuredText components. The component initializes MathJax for dynamically inserted content and reuses an already loaded instance.

### Extensions to Asciidoctor.js

`tp-asciidoc` uses Asciidoctor.js with a semantic HTML converter and TP extensions. Ordinary AsciiDoc headings, lists, links, attributes and formatting remain available. The component syntax below is provided by the adapter and should not be assumed to work with an unextended Asciidoctor.js instance.

The converter removes presentational wrappers or replaces them with semantic elements. Its HTML structure therefore differs from the default Asciidoctor HTML5 output; styles that depend on Asciidoctor's wrapper hierarchy may need adapting. A CSS `style` attribute on a paragraph is preserved:

```asciidoc
[style="margin-bottom:1rem;"]
A paragraph with *AsciiDoc* formatting.
```

### Components and attributes

Name an element in the block attribute list, followed by a delimited body parsed as AsciiDoc:

```asciidoc
[tp-callout,variant=info,heading=Information]
--
The workshop starts at *9:00*.
--
```

Use named attributes such as `variant=info`, `.notice` for a class, `#notice` for an ID, and `%closable` for a boolean option. A bare open block without an element name becomes a `div`. Both standard HTML tags and custom-element names are supported.

Inline elements use `[tag,attributes]#content#`:

```asciidoc
Status: [tp-badge,variant=success,pill]#Ready#.
Choose [tp-icon,name=check]#icon# to confirm.
```

Inline syntax requires content between the `#` delimiters. For `tp-icon`, use a placeholder such as `icon`; the component replaces it with its icon. HTML void elements such as `input` and `img` discard their placeholder rather than producing child content.

Creating component markup does not import its JavaScript definition. Load the components with the autoloader or explicit imports.

### Nested components and literal source

Use distinct delimiters for nested blocks. A `script` element preserves source literally instead of applying AsciiDoc substitutions:

```asciidoc
[tp-asciidoc]
--
[script,type="tp/asciidoc"]
------
== A section

A paragraph with *AsciiDoc* formatting.
------
--
```

The same literal handling applies to block `style`, `textarea` and `template` elements. Use `[script,type=module]` for JavaScript. The delimiter lines do not become part of the source, and must not collide with lines inside it.

Standard AsciiDoc passthrough blocks (`++++`) remain useful for authored HTML; prefer native component blocks when their bodies should be parsed as AsciiDoc. Preserving a script does not itself grant permission to execute it in a viewer; executable examples use the viewer's `allow-script` option.

### Mathematics and source viewers

AsciiDoc STEM syntax is retained, with rendering supplied by the shared MathJax runtime. Explicit `latexmath` and `asciimath` forms select the notation:

```asciidoc
Inline: latexmath:[E = mc^2].

[asciimath]
++++
sum_(i=1)^n i
++++
```

The `adocviewer` extension displays source together with its rendered result:

```asciidoc
[adocviewer]
....
A paragraph with *strong text*.
....
```

Its viewer and math behavior require the browser runtime that `tp-asciidoc` initializes. They are not produced by the default Asciidoctor.js converter alone. For a component viewer with the usual TP controls, use [`tp-asciidoc-viewer`](#/components/asciidoc-viewer/index.md).

### Generated placeholder text

The added `lorem` block macro generates placeholder text or lists. Its target selects `sentence`, `title`, `p`, `dl`, `ol` or `ul`; `length` controls the amount and `seed` makes repeated generation reproducible.

```asciidoc
lorem::p[length=2,seed=42]
```

This macro is registered by the TP adapter, not by standard Asciidoctor.js.

### Browser rendering limits

The component renders an HTML fragment in the current page. It does not run a local Asciidoctor command, generate a PDF or provide access to the user's filesystem. Source files and linked resources must be available to the browser. Document navigation is provided separately by [`tp-asciidoc-multi-pages`](#/components/asciidoc-multi-pages/index.md).

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/asciidoc/asciidoc.js"></script>
  ```

import
: ```js
  import "/path/to/components/asciidoc/asciidoc.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/asciidoc/asciidoc.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect how the embedded asciidoc source is rendered as a formatted document.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Advanced example
: Inspect the richer document supplied through the advanced asciidoc source example.
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
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
