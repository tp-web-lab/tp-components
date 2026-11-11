<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="markdown" library="components" size="1.25em"></tp-icon> Markdown component

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-markdown>` element renders Markdown documents.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-markdown>
  <script type="tp/markdown">
## A short document

This paragraph uses **Markdown**.

- Write content
- Add components
- Publish the page
  </script>
</tp-markdown>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-markdown" src="/docs/components/markdown/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-markdown></tp-markdown>
  ```

internal script
: ```html
  <tp-markdown>
    <script type="tp/markdown">
      # Document title

      Hello, **Markdown**!
    </script>
  </tp-markdown>
  ```

external file
: ```html
  <tp-markdown src="./example.md"></tp-markdown>
  ```
:::

### Mathematics

AsciiMath
: Inline equation: :asciimath:`x=(-b +- sqrt(b^2 – 4ac))/(2a)`
: Display equation:
  ```asciimath
  sum_(i=1)^n i^3=((n(n+1))/2)^2
  ```

Latex
: Inline equation: :latexmath:`E = mc^2`
: Display equation:
  ```latexmath
  \begin{eqnarray}
  \hat{f}(\xi)&=&\frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}e^{-|x|}e^{-ix\xi}dx\\
  &=&\frac{1}{\sqrt{2\pi}}\int_{0}^{\infty}e^{-x-ix\xi}dx+\int_{-\infty}^0e^{x-ix\xi}dx\\
  &=&\frac{1}{\sqrt{2\pi}}\int_{0}^{\infty}(e^{-x-ix\xi}-e^{-x+ix\xi})dx\\
  &=&\frac{1}{\sqrt{2\pi}}[\frac{1}{-(1+i\xi)}(-1)-\frac{1}{-1+i\xi}(-1)]\\
  &=&\frac{1}{\sqrt{2\pi}}[\frac{1-i\xi}{1+\xi^2}+\frac{-(1+i\xi)}{1+\xi^2}]\\
  &=&\frac{1}{\sqrt{2\pi}}\frac{-2i\xi}{1+\xi^2}\\
  &=&-\sqrt{\frac{2}{\pi}}\frac{i\xi}{1+\xi^2}
  \end{eqnarray}
  ```

### Authoring

TeX and AsciiMath formulas use MathJax 4 with SVG output, matching the AsciiDoc and reStructuredText components. The math runtime is loaded on demand and reused on the same page.

### Extensions to markdown-it

`tp-markdown` uses markdown-it with additional plugins, TP syntax extensions and browser renderers. The syntax below is not part of unextended markdown-it or portable CommonMark. Ordinary headings, paragraphs, links and lists retain Markdown syntax.

The default plugins add heading anchors, definition lists, attribute blocks and extended tables (including multiline cells, row spans and headerless tables). TP extensions also provide component containers, tabs, examples, references, section numbering, tables of contents, layout helpers and syntax highlighting. These features are configured by the adapter rather than by the document author installing markdown-it plugins.

### Components and attributes

Use a colon fence to create a component whose body is parsed as Markdown:

```markdown
::: tp-callout {variant="info" heading="Information"}
The workshop starts at **9:00**.
:::
```

Attributes use `{name="value" disabled}`; `#notice` and `.highlight` are shortcuts for an ID and a class. Boolean attributes are written without a value. For nested containers, use a longer outer fence so each closing fence identifies its own container.

```markdown
::::: tp-box
::: tp-callout {variant="info"}
A **nested** component.
:::
:::::
```

Inline elements use `:tag:content{attributes}`. Keep the final braces even when there are no attributes. An icon can have no content:

```markdown
Status: :tp-badge:Ready{variant="success"}.
Choose :tp-icon:{name="check"} to confirm.
```

The same extension accepts standard HTML elements and third-party custom elements. It creates their markup; load custom-element definitions through the autoloader or explicit imports. Use an inline-capable component inside a paragraph.

### Literal source and raw HTML

A `script` container preserves its body without Markdown conversion. Use it to pass another language to a component, or JavaScript with `type="module"`:

```markdown
::::: tp-asciidoc
::: script {type="tp/asciidoc"}
A paragraph with *AsciiDoc* formatting.
:::
:::::
```

The block forms of `style`, `textarea` and `template` also preserve literal content. Their outer colon fences are delimiters, not part of the content; use fence lengths that do not collide with the embedded source.

A code fence labelled `raw html` or `raw-html` inserts HTML instead of displaying source. An ordinary `html` code fence still displays code. Prefer native component containers when the body should be parsed as Markdown. Literal script preservation and script execution are separate: the receiving viewer's `allow-script` setting controls executable examples.

### Front matter and optional extensions

A YAML front matter block at the beginning of the document supplies metadata, expression variables and optional extension names. For example:

```markdown
---
extensions:
  - math
---

An inline formula: :latexmath:`E = mc^2`.
```

Optional extensions include mathematical notation, diagrams, music, maps, handwriting, slides, speech and typewriting. Their parsing and browser runtimes are additional TP features; a generic markdown-it renderer will not reproduce them. The component runs the associated browser renderers after conversion. YAML front matter is configuration and is not displayed as document text.

### Included documents and tabs

`::include{chapter.md}` includes a source file. In `tp-markdown`, relative include URLs resolve from the containing source document; nested includes are supported with a depth limit. The files must be available through browser requests.

Tabs can contain a definition list, where each term names a tab and its definition supplies the content:

```markdown
::: tp-tabs
First
: Content of the first tab.

Second
: Content of the second tab.
:::
```

Includes, interactive tabs and document navigation require the TP rendering environment. The standalone component does not add the navigation shell of [`tp-markdown-multi-pages`](#/components/markdown-multi-pages/index.md).

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/markdown/markdown.js"></script>
  ```

import
: ```js
  import "/path/to/components/markdown/markdown.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/markdown/markdown.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect how the embedded markdown source is rendered as a formatted document.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Mathematical notation
: Compare inline and displayed mathematical notation written in AsciiMath and LaTeX.
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
@credit tp-markdown https://www.npmjs.com/package/@tp/tp-markdown
@summary Markdown parsing and rendering.
-->

- [tp-markdown](https://www.npmjs.com/package/@tp/tp-markdown) : Markdown parsing and rendering.
<!-- tp-docgen:dependencies:end -->
