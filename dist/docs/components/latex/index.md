<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="latex" library="components" size="1.25em"></tp-icon> LaTeX

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-latex>` element renders LaTeX documents, mathematical formulas and TikZ drawings.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-latex><script type="tp/latex">\section{A first document}
The area of a circle is $A=\pi r^2$.</script></tp-latex>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-latex" src="/docs/components/latex/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
Inline source
: Use a `script` with `type="tp/latex"` to preserve backslashes and literal source.

Attribute
: Set `value` with a source string. An empty value clears the output.

External file
: Set `src` to a `.tex` file. A nonempty `src` takes precedence over the other inputs.
:::

### Configuration

Provide a literal source in a `script[type="tp/latex"]`, set `value`, or load a file with `src`. Source precedence is `src`, then `value`, then inline content. An empty `value` clears the output. Relative file URLs resolve against the containing document. Source changes replace the previous result; stale requests are discarded.

Use the supported LaTeX.js subset, generic \wc… commands and \rawhtml for authored HTML. Formulas use MathJax. This is an HTML renderer, not a full TeX distribution; arbitrary packages, BibTeX and PDF pagination are not supported. The rendered event signals document conversion; nested components can finish later.

### Web components and HTML elements

The commands in this section are extensions provided by `tp-latex`; they are not standard LaTeX commands. Their bodies remain LaTeX, so they can contain formatting, lists, formulas and nested components.

Use `\webcomponent[attributes]{tag-name}{LaTeX content}` for a block element, or its shorter `\wc…` alias:

| Command | Generated element |
| --- | --- |
| `\wcTpCallout` | `tp-callout` |
| `\wcTpCodeEditor` | `tp-code-editor` |
| `\wcArticle` | `article` |
| `\wcInput` | `input` |

```latex
\wcTpCallout[variant=info,heading=Information]{
  The workshop starts at \textbf{9:00}.
}
```

Attributes go in optional square brackets, with comma-separated `name=value` pairs or bare boolean names, such as `[id=notice,hidden]`. They use LaTeX.js key/value syntax, not HTML attribute syntax; do not assume that arbitrary quoted or brace-grouped values behave like HTML attributes.

Alias names contain letters only. After `wc`, each capital letter begins a new tag-name segment: use `\wcTpHtmlViewer` for `tp-html-viewer`, not `\wcTpHTMLViewer`. For names that cannot use this convention, use the full form, such as `\webcomponent{h1}{Title}`. The aliases also work for third-party custom elements.

These commands create elements; they do not import their JavaScript definitions. Load the required components with the TP autoloader or explicit component imports. `tp-latex` itself loads its mathematical and TikZ renderers.

### Inline components

Add `*` immediately after the command name to keep an element in the current paragraph. Both `\webcomponent*` and `\wc…*` accept this form.

```latex
Choose \wcTpIcon*[name=check]{} to confirm.
Your name: \wcInput*[type=text,aria-label=Name]{}.
```

Inline bodies accept inline LaTeX, not sections or multiple paragraphs. Standard block elements cannot use the starred form; a custom component must also support inline layout. Elements without children, such as `input`, `img` and `br`, still require an empty `{}` body.

### Counter numbering

Use `\renewcommand{\thesubsection}{\Alph{subsection}}` to number subsections A, B, C. The adapter supports counter presentation with `Alph`, `alph`, `Roman`, `roman` and `arabic`, in the preamble or document body. Native labels and references use the same presentation; group scope and counter resets are preserved. Starred headings remain unnumbered. This supports counter-format declarations, not arbitrary macro redefinitions.

For answers nested under an unnumbered problem heading:

```latex
\renewcommand{\thesubsubsection}{\Alph{subsubsection}}
\subsection*{Problem 1}
\setcounter{subsubsection}{0}
\subsubsection{First answer}
\subsubsection{Second answer}
```

### TP references

TP reference prefixes are accepted directly in the `href` attribute of component commands:

```latex
\wcTpRef*[href=^note-1]{}
\wcTpRef*[href=%term]{}
\wcTpRef*[href=@MS19]{}
```

These refer to a note, a glossary entry and a bibliography entry respectively. The same syntax works with `\webcomponent`. Outside these `href` values, `%` still starts a LaTeX comment and `^` retains its mathematical meaning.

### Literal HTML

Prefer standard LaTeX and `\wc…` commands. Extend the adapter when a useful syntax is missing; reserve `\rawhtml` for content that genuinely requires literal HTML. For example, use `\wcSpan*[class=highlight]{highlighted word}` for an inline span and `\lbrack` / `\rbrack` for literal square brackets.

`\rawhtml{...}` inserts a block of HTML without LaTeX interpretation. `\rawhtml*{...}` inserts HTML in the current paragraph. Characters such as `%`, `$`, `&`, `_`, `#` and backslashes are preserved.

With braces, the body must have balanced braces. For content with unbalanced braces, choose a punctuation delimiter absent from the body:

```latex
\rawhtml|<span>{unfinished</span>|
```

The first `|` opens the literal body and the next `|` closes it. The delimiter is not part of the generated content. This resembles `\verb` syntax, but inserts HTML rather than displaying code. Raw HTML and component attributes are intended for authored, trusted content; they are not sanitized by this conversion.

### Literal scripts and delimiters

`\wcScript[attributes]{source}` creates a `script` element and preserves its body literally. Unlike an ordinary `\wc…` body, it is not interpreted as LaTeX or parsed as HTML. This is useful for JavaScript and for source passed to viewers or playgrounds.

```latex
\wcTpLatexViewer{
  \wcScript[type=tp/latex]{\section{Hello}A formula $x^2$.}
}
```

Use balanced braces, or surround the complete source with the same punctuation character, as in the Javascript API examples:

```latex
\wcScript[type=module]|
import "/components/callout/callout.js";

const notice = document.createElement("tp-callout");
notice.setAttribute("variant", "info");
notice.textContent = "The workshop starts at 9:00.";
document.body.append(notice);
|
```

Here the two `|` characters delimit the script; they are neither JavaScript operators nor output characters. The first subsequent occurrence closes the body, so the delimiter must not appear anywhere inside it, including strings and comments. If the JavaScript uses `|` or `||`, choose another delimiter absent from the source, for example `\wcScript[type=module]!...!`, or use balanced braces.

The `type` attribute determines the script's purpose: `tp/latex` stores LaTeX source, while `module` declares JavaScript. Literal preservation does not itself guarantee execution: the receiving viewer controls execution. In [`tp-latex-viewer`](#/components/latex-viewer/index.md), enable `allow-script` for executable examples.

### HTML layout and mathematical formulas

Generated headings, paragraphs and standard lists inherit the shared TP styles. Native `itemize`, `enumerate` and `description` lists are converted to semantic HTML throughout the document, including component bodies. Explicit item labels and authored raw HTML are preserved. The same conversion is used by LaTeX viewers, playgrounds and notebook cells.

Formulas written as `$...$`, `\(...\)` and `\[...\]` become `tp-math` elements rendered asynchronously with MathJax. Use `\[...\]` for display mathematics. This differs from a TeX engine producing a paginated PDF; supported mathematical commands depend on MathJax, while the surrounding document uses LaTeX.js.

```latex
\[
  \begin{aligned}
    A &= \pi r^2 \\
    C &= 2\pi r
  \end{aligned}
\]
```

The document-level `equation` environment is not supported by the current document parser. Use display math as above; accepting a package declaration does not add every environment from that package.

### Images and links

Use `\includegraphics` for browser-readable images and `\href` for links:

```latex
\usepackage{graphicx}
\usepackage{hyperref}

\includegraphics[width=240px,alt=Landscape]{landscape.jpg}

\href{chapter.tex}{Read the next chapter}
```

The adapted `\includegraphics` creates an HTML `img`. Its supported options are `width` and `height` as CSS lengths, `alt` as alternative text, and `keepaspectratio` to contain the image within its dimensions. TeX dimension expressions such as `0.5\textwidth`, cropping and rotation are not implemented by this adapter. Use formats supported by the browser rather than EPS or TeX image conversion workflows.

`\href` creates an HTML link. In a LaTeX multi-pages component, document links can navigate between pages of the guide; `tp-latex` alone does not add that navigation shell.

### TikZ drawings

A `tikzpicture` environment becomes a `tp-tikz` component, which compiles the drawing to SVG in the browser. Declare `\usepackage{tikz}` as usual; `\usetikzlibrary{...}` declarations are passed to the drawings, with availability depending on the bundled TikZJax environment.

```latex
\usepackage{tikz}

\begin{tikzpicture}
  \draw[blue,thick] (0,0) circle (1);
\end{tikzpicture}
```

Local `\def`, `\newcommand`, `\renewcommand` and `\providecommand` definitions immediately before a drawing are transferred with it. Definitions scattered elsewhere in the preamble are not automatically collected. Place drawing-specific definitions immediately before or inside `tikzpicture`. The short `\tikz` command and `tikzcd` environments are not extracted by this adapter. See [`tp-tikz`](#/components/tikz/index.md) for drawing-specific behavior.

### Text encoding and package compatibility

Write accented characters directly in UTF-8, for example `Café` or `français`; `\usepackage[utf8]{inputenc}` is not needed to decode browser text. This does not make every Unicode character available in the fonts used by mathematical or TikZ renderers.

Package support comes from LaTeX.js and the specific adaptations described here. A `\usepackage` declaration does not install or load an arbitrary TeX package. Likewise, a document class does not reproduce a full TeX layout engine: use the dedicated [`tp-latex-multi-slides`](#/components/latex-multi-slides/index.md), [`tp-latex-multi-pages`](#/components/latex-multi-pages/index.md) and [`tp-latex-single-page`](#/components/latex-single-page/index.md) components for Web presentations and document navigation, rather than expecting Beamer or PDF pagination.

### AMS package declarations

`\usepackage{amsmath}`, `\usepackage{amssymb}` and the combined `\usepackage{amsmath,amssymb}` are accepted without attempting to load these packages in LaTeX.js. Mathematical expressions are handled by MathJax. Package options are not forwarded to MathJax. This compatibility does not add document-level AMS environments: use, for example, `aligned` inside `\[...\]`.

### French and English (Babel)

Use `\usepackage[english,french]{babel}` to declare both languages, with French as the main language. The last listed language is the default; `main=english` or `main=french` overrides that choice. `french`, `francais` and `frenchb` refer to French; `english` refers to English.

- `\selectlanguage{english}` changes the active language within the current TeX group.
- `\foreignlanguage{english}{...}` marks an inline passage and restores the previous language afterwards.
- `\begin{otherlanguage}{english}...\end{otherlanguage}` does the same for a block, including nested blocks.
- `\today` and standard captions such as `\contentsname`, `\abstractname`, `\figurename`, `\tablename` and `\chaptername` use the active language.

Generated content carries HTML `lang` metadata. Unsupported languages, options and undeclared language switches produce an error. This is a partial Babel implementation: French punctuation spacing, active-character shortcuts, Babel font configuration and automatic language-specific hyphenation are not implemented. The default remains unhyphenated text. Code, raw HTML and mathematical source are preserved.

```latex
\documentclass{article}
\usepackage[english,french]{babel}
\begin{document}
\begin{abstract}
Un document en français avec un passage en anglais.
\end{abstract}
\today

\foreignlanguage{english}{English date: \today.}

\begin{otherlanguage}{english}
\section*{English passage}
This passage is marked as English in the generated HTML.
\end{otherlanguage}

Retour au français : \today.
\end{document}
```

### Fragments with a preamble

A fragment can start with package declarations, such as `\usepackage{hyperref}`, followed directly by its content. When needed, `tp-latex` supplies the default `article` class and encloses the content in a document environment. Complete documents are preserved. An explicitly opened document environment must still be closed by the author.

```latex
\usepackage{hyperref}

\section*{Getting started}
\href{cover.tex}{Back to the introduction}
```

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/latex/latex.js"></script>
  ```

import
: ```js
  import "/path/to/components/latex/latex.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/latex/latex.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read a section with an inline MathJax formula.

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
@tp-dependency tp-math
@summary renders LaTeX or AsciiMath expressions as inline or display-style SVG.
-->
<!--
@tp-dependency tp-tikz
@summary Compiles TikZ drawings into SVG with Unicode text, colors and directional fading.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-math>`](#/components/math/index.md) : renders LaTeX or AsciiMath expressions as inline or display-style SVG.
- [`<tp-tikz>`](#/components/tikz/index.md) : Compiles TikZ drawings into SVG with Unicode text, colors and directional fading.

### External

<!--
@credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
@summary LaTeX.js conversion and patched TikZJax assets.
-->

- [tp-latex](https://www.npmjs.com/package/@tp/tp-latex) : LaTeX.js conversion and patched TikZJax assets.

### See also

- [`<tp-tikz>`](#/components/tikz/index.md) : Render a standalone TikZ drawing.
<!-- tp-docgen:dependencies:end -->
