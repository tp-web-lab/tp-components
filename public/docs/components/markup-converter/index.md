<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="markup-converter" library="components" size="1.25em"></tp-icon> Markup converter

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-markup-converter>` element provides bidirectional document conversion between HTML, [tp-asciidoc](http://127.0.0.1:4323/), [tp-latex](http://127.0.0.1:4325/), [tp-markdown](http://127.0.0.1:4322/) and [tp-restructuredtext](http://127.0.0.1:4324/), with editable code and rendered previews.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-markup-converter><script type="tp/markdown">
# Workshop

A **practical** introduction to markup.

| Formula | Image |
| :--- | :--- |
| :tp-math:`E = mc^2`{mode="latexmath"} | ![Canoe](/medias/image/canoe.svg){width=160} |
[Science and illustration]
</script></tp-markup-converter>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-markup-converter" src="/docs/components/markup-converter/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Numbered equations and previews

`tp-equanum` with a single LaTeX `tp-math` exports to native `equation`, `tag` and `label`; `tp-ref href="=…"` exports to `ref` or `eqref`. Native LaTeX equation labels become preview definitions in HTML, keeping MathJax tags intact. Aligned groups preserve all row labels and numbers; each align, alignat, flalign, gather or eqnarray reference previews only its labelled row. Markdown, AsciiDoc and reStructuredText retain the preview association in TP custom-element syntax. Complex wrappers, AsciiMath, duplicated scoped keys and targets without recoverable native source keep custom-element notation rather than losing their behavior.


### Initial content

::: tp-tabs
Inline source
: Place source in a child `script` with `type="tp/html"`, `tp/asciidoc`, `tp/latex`, `tp/markdown` or `tp/restructuredtext`. The script determines its language unless `language` is present.

Attributes
: Set `value` and `language`. An empty `value` intentionally clears the source.

External file
: Set `src` to an HTML, AsciiDoc, LaTeX, Markdown or reStructuredText file. The extension determines the language. Relative URLs resolve against the containing document.
:::

Source precedence is `src`, then `value`, then inline script content. Supported aliases are `adoc`, `tex`, `md` and `rst`. Unknown formats and failed conversions display an error. A source change selects its language tab.

### Configuration

Relative image candidates in `srcset` are resolved against the source document URL before conversion. Their descriptors and the `sizes` expression are preserved, so relocating an export does not redirect its images to the export folder.

### Conversion

#### HTML as the intermediate language

Conversion uses semantic HTML as its common intermediate representation:

```text
Source markup → source parser → normalized semantic HTML → target markup
```

The source parser produces HTML. Normalization removes parser-specific wrappers and presentation scaffolding while retaining document structure, author attributes and supported formatting. The target writer then translates this representation into the selected language. HTML input enters the same pipeline; HTML output is formatted for readability.

The converter therefore combines a shared HTML pivot with rules for each target language and document structure. It does not use a separate converter for every pair of languages. For example, a table originating in Markdown or LaTeX passes through an HTML table representation before being written as an AsciiDoc table. Tables, references, images, media and code blocks have specialized conversion rules.

The original language keeps its source instead of being regenerated from HTML. The standalone `convert` function returns the original code when source and target languages are identical; the component removes trailing blank lines in its HTML and LaTeX code panes.

#### Concrete example: Markdown to AsciiDoc

This example converts a heading, a paragraph with emphasis and a link, and a two-item list. The three code blocks show the actual conversion stages; the intermediate HTML is formatted for readability.

**1. Source — tp-markdown**

```markdown
## Workshop

Read the **guide** at [the course website](https://example.org/guide).

- Prepare the material.
- Run the examples.
```

**2. Pivot — normalized semantic HTML**

```html
<h2 id="workshop">Workshop</h2>

<p>Read the <strong>guide</strong> at <a href="https://example.org/guide">the course website</a>.</p>

<ul>
  <li>Prepare the material.</li>
  <li>Run the examples.</li>
</ul>
```

**3. Target — native tp-asciidoc syntax**

```asciidoc
[[workshop]]
== Workshop

Read the *guide* at link:https://example.org/guide[the course website].

* Prepare the material.
* Run the examples.
```

The target writer translates `h2` to `==`, `strong` to `*…*`, `a` to `link:…[…]`, and `ul`/`li` to `*` list items. The heading’s generated `id` becomes the native `[[workshop]]` anchor. No custom elements or raw HTML are needed in the AsciiDoc source. Parser-generated heading `tabindex` attributes are omitted from the HTML pivot; explicitly authored `tabindex` attributes are retained in it.

Rendering the target preserves the heading level, emphasis, link destination and list items. It does not preserve the Markdown spelling: the emphasis and list markers have changed to their native AsciiDoc equivalents.

#### Native syntax first

Target writers choose the first suitable representation in this order:

1. Native syntax of the target language for headings, formatting, lists, links, tables, media and other supported structures.
2. TP parser extensions to native constructs when additional information must be preserved.
3. TP custom-element notation when no suitable native construct exists.
4. Raw HTML or passthrough only when the other representations cannot preserve the content faithfully.

This priority applies to every conversion, regardless of the source language. Simple tables use Markdown pipe tables, AsciiDoc tables or reStructuredText `list-table`; custom attributes and layouts require a fallback only when native syntax and supported TP options cannot preserve them.

Native tables preserve absolute and mixed column widths. Markdown uses `column-widths` in the table attribute list, AsciiDoc uses named table attributes, and RST uses options on `list-table` or `table`. The companion `table-width` and `table-layout` options preserve explicit table dimensions. These are TP extensions to native tables. LaTeX uses `tblr` with fixed `Q[wd=...]` columns and weighted `X` columns. The TP host updates flexible widths when the container changes. RST also preserves horizontal and vertical cell alignment through the TP `cell-alignments` option, including merged cells. Custom cell borders also use native table syntax with TP options.

The [native syntax audit](native-syntax-audit.md) lists all documentation examples and explains the remaining exceptions. Generated syntax and rendered appearance are checked separately.

RST paragraphs and lists use native `.. class::` directives when class names and optional targets can be preserved. HTML directives remain for semantic containers and additional attributes that a native block cannot represent faithfully.

RST conversions add escaped spaces around interpreted-text roles only when required by the surrounding characters, following the [Docutils inline recognition rules](https://docutils.sourceforge.io/docs/ref/rst/restructuredtext.html#inline-markup-recognition-rules). Ordinary spaces and punctuation delimit roles directly; roles inside words keep zero-width separators. Literal code examples are preserved.

LaTeX output is a fragment: it omits `\documentclass` and the `document` environment, and declares only the packages required by its content.

#### Comments

Conversions preserve source comments without displaying their text. The HTML pivot retains them as comment nodes. Each export uses the target language's native comment syntax:

| Language | Comment syntax |
| --- | --- |
| HTML | `<!-- comment -->` |
| tp-markdown | `<!-- comment -->` |
| tp-asciidoc | `// comment` on each line; `////` comment blocks are also accepted on import. |
| tp-latex | `% comment` through the end of the line. |
| tp-restructuredtext | `..` followed by an indented comment body. |

HTML and Markdown keep comments between words; LaTeX uses a line comment while preserving the surrounding visible text. AsciiDoc and reStructuredText have no inline comment syntax: comments inside an HTML block are moved before its outer block. Nested list/table comments may therefore move before the enclosing list or table. Comment-only paragraphs are not added to the rendered result.

LaTeX comments inside command arguments or the explicit preamble are retained at the beginning of the HTML pivot. Comments inside mathematical expressions, tables and lists are moved immediately after their environment, so transport macros do not change its structure. Delimiter whitespace and the grouping of multiline comments may change between languages. Comment-looking text inside code blocks, script bodies or verbatim commands remains literal source, rather than becoming a document comment.

The **Native comments comparison** example includes comments before and after content, an inline comment and a commented-out component. Compare the Code panels: comments remain invisible in Render.

#### Automatic numbering

Section, figure, table and code counters remain automatic after conversion. The HTML pivot retains their rules separately from generated labels, so the target source contains unnumbered title and caption text. Numbers typed by the author remain ordinary text. Existing IDs and links are retained.

| Target | Representation |
| --- | --- |
| tp-markdown | YAML `sectionNumbering`, `figureNumbering`, `tableNumbering`, `codeNumbering`. |
| tp-asciidoc | Native `:sectnums:` and `:sectnumlevels:`, with TP `:sectnum-start:` and object-numbering attributes. Headings, images, tables and listings keep native syntax. |
| tp-latex | Native unstarred section commands, `\setcounter`, counter names and `\renewcommand`; packages precede their counter declarations. |
| tp-restructuredtext | Native `.. sectnum::` with TP `:start-at:`, plus TP `figure-numbering`, `table-numbering` and `code-numbering` directives. Content uses native headings, figures, list-tables and code. |
| HTML | A non-visible `template` stores the rules. An included script recomputes numbers on load and DOM edits, with no remote dependency or additional styles. |

The example starts at section 2.3 and figure 2.7. In any language, append a section and a captioned image, then run: they become 2.4 and 2.8. Convert back to Markdown: the YAML rules remain, rather than numbers being inserted in the source titles. Labels such as `Figure`, `Fig.` or an empty string, initial counters, object prefixes, heading depth and `.unnumbered` exclusions are retained.

The supported model uses document-local decimal counters, hierarchical headings and fixed object prefixes. Arbitrary TeX counter programs, alphabetic/Roman automatic formats, chapter-dependent figure resets and independent nested numbering scopes are not translated. Existing equation and theorem counters retain their separately documented conversion behavior. HTML requires its generated script for automatic updates outside the TP converter; without scripts, the already rendered numbers remain visible.

::: tp-markup-converter {src="/docs/components/markup-converter/examples/automatic-numbering.md"}
:::

Exercises and examples have independent automatic counters, with default labels `Exercise` and `Example`. Targets use `data-numbering="exercise"` or `data-numbering="example"`; their IDs remain stable. Markdown uses `exerciseNumbering` and `exampleNumbering` YAML, AsciiDoc and RST use TP counter declarations on native content, and LaTeX uses native `\newcounter`, `\setcounter` and `\renewcommand` declarations. Attribute metadata identifies targets where the language has no standard exercise/example construct. Interactive questions retain their component syntax.

::: tp-markup-converter {src="/docs/components/markup-converter/examples/exercises-examples-numbering.md"}
:::


#### HTML-to-markup mapping

Both tables describe the TP adaptations and are classified by their HTML/feature column. The first contains standard HTML elements and custom elements, which are part of the HTML standard, including those that require a TP directive in the target language. The second compares document features through their TP components and native target counterparts: inclusion, automatic tables of contents and TeX/AsciiMath formulas. This grouping does not classify custom elements as non-HTML. Native target syntax remains preferred wherever it preserves the requested information.

Block structures come first, followed by media and inline/phrasing elements. Images, audio and video remain consecutive; these elements can occur in flow content as well as inline. Script and stylesheet source is grouped with document structures, before visible inline content.

Examples show the essential syntax, not byte-for-byte generated output. Simple list items are compacted without blank lines. Real spaces are preserved in code, particularly the structural indentation in RST; `␠` denotes a required Markdown space.

##### Standard HTML elements

The six RST heading styles below illustrate one continuous hierarchy, in their order of first appearance. An underline character does not itself define an absolute HTML heading level. For an isolated RST level, prefix the heading with the supported directive `.. heading-level:: N` and a blank line. The grouped example starts at level 1 and therefore needs no such directive. AsciiDoc's level-one heading is a document title; `:showtitle:` makes it visible in the fragment. LaTeX headings follow the converter's chapter-to-subparagraph mapping.

| HTML / feature | tp-markdown | tp-asciidoc | tp-latex | tp-restructuredtext |
| --- | --- | --- | --- | --- |
| ` Paragraph — <p> `{style="white-space:pre-wrap"} | ` Text `{style="white-space:pre-wrap"} | ` Text `{style="white-space:pre-wrap"} | ` Text `{style="white-space:pre-wrap"} | ` Text `{style="white-space:pre-wrap"} |
| ` Paragraph attributes `{style="white-space:pre-wrap"}<br>` id (#), class (.) `{style="white-space:pre-wrap"}<br>` attr=val, boolAttr `{style="white-space:pre-wrap"} | ` Text `{style="white-space:pre-wrap"}<br>` {#part .note data-kind="example" hidden} `{style="white-space:pre-wrap"} | ` [#part.note%hidden,data-kind="example"] `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"} | ` \tpAttributes[id={part},class={note},data-kind={example},hidden={}]{Text} `{style="white-space:pre-wrap"} | ` .. attributes:: `{style="white-space:pre-wrap"}<br>`    :id: part `{style="white-space:pre-wrap"}<br>`    :class: note `{style="white-space:pre-wrap"}<br>`    :data-kind: example `{style="white-space:pre-wrap"}<br>`    :hidden: `{style="white-space:pre-wrap"}<br><br>` Text `{style="white-space:pre-wrap"} |
| ` Blockquote — <blockquote> `{style="white-space:pre-wrap"} | ` > Text `{style="white-space:pre-wrap"} | ` [quote] `{style="white-space:pre-wrap"}<br>` ____ `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ____ `{style="white-space:pre-wrap"} | ` \begin{displayquote} `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` \end{displayquote} `{style="white-space:pre-wrap"} | `     Text `{style="white-space:pre-wrap"} |
| ` Comment — <!-- note --> ` | ` <!-- note --> ` | ` // note ` | ` % note ` | ` .. `{style="white-space:pre-wrap"}<br>`    note `{style="white-space:pre-wrap"} |
| ` Thematic break — <hr> `{style="white-space:pre-wrap"} | ` --- `{style="white-space:pre-wrap"} | ` ''' `{style="white-space:pre-wrap"} | ` \hrule `{style="white-space:pre-wrap"} | ` Before. `{style="white-space:pre-wrap"}<br><br>` ---- `{style="white-space:pre-wrap"}<br><br>` After. `{style="white-space:pre-wrap"} |
| ` Headings `{style="white-space:pre-wrap"}<br>` <h1> through <h6> `{style="white-space:pre-wrap"} | ` # Title 1 `{style="white-space:pre-wrap"}<br>` ## Title 2 `{style="white-space:pre-wrap"}<br>` ### Title 3 `{style="white-space:pre-wrap"}<br>` #### Title 4 `{style="white-space:pre-wrap"}<br>` ##### Title 5 `{style="white-space:pre-wrap"}<br>` ###### Title 6 `{style="white-space:pre-wrap"} | ` :showtitle: `{style="white-space:pre-wrap"}<br><br>` = Title 1 `{style="white-space:pre-wrap"}<br><br>` == Title 2 `{style="white-space:pre-wrap"}<br><br>` === Title 3 `{style="white-space:pre-wrap"}<br><br>` ==== Title 4 `{style="white-space:pre-wrap"}<br><br>` ===== Title 5 `{style="white-space:pre-wrap"}<br><br>` ====== Title 6 `{style="white-space:pre-wrap"} | ` \chapter*{Title 1} `{style="white-space:pre-wrap"}<br>` \section*{Title 2} `{style="white-space:pre-wrap"}<br>` \subsection*{Title 3} `{style="white-space:pre-wrap"}<br>` \subsubsection*{Title 4} `{style="white-space:pre-wrap"}<br>` \paragraph*{Title 5} `{style="white-space:pre-wrap"}<br>` \subparagraph*{Title 6} `{style="white-space:pre-wrap"} | ` Title 1 `{style="white-space:pre-wrap"}<br>` ======= `{style="white-space:pre-wrap"}<br><br>` Title 2 `{style="white-space:pre-wrap"}<br>` ------- `{style="white-space:pre-wrap"}<br><br>` Title 3 `{style="white-space:pre-wrap"}<br>` ~~~~~~~ `{style="white-space:pre-wrap"}<br><br>` Title 4 `{style="white-space:pre-wrap"}<br>` ^^^^^^^ `{style="white-space:pre-wrap"}<br><br>` Title 5 `{style="white-space:pre-wrap"}<br>` """"""" `{style="white-space:pre-wrap"}<br><br>` Title 6 `{style="white-space:pre-wrap"}<br>` +++++++ `{style="white-space:pre-wrap"} |
| ` Unordered list — <ul>/<li> `{style="white-space:pre-wrap"} | ` - One `{style="white-space:pre-wrap"}<br>` - Two `{style="white-space:pre-wrap"} | ` * One `{style="white-space:pre-wrap"}<br>` * Two `{style="white-space:pre-wrap"} | ` \begin{itemize} `{style="white-space:pre-wrap"}<br>`   \item One `{style="white-space:pre-wrap"}<br>`   \item Two `{style="white-space:pre-wrap"}<br>` \end{itemize} `{style="white-space:pre-wrap"} | ` - One `{style="white-space:pre-wrap"}<br>` - Two `{style="white-space:pre-wrap"} |
| ` Ordered list — <ol>/<li> `{style="white-space:pre-wrap"} | ` 1. One `{style="white-space:pre-wrap"}<br>` 2. Two `{style="white-space:pre-wrap"} | ` . One `{style="white-space:pre-wrap"}<br>` . Two `{style="white-space:pre-wrap"} | ` \begin{enumerate} `{style="white-space:pre-wrap"}<br>`   \item One `{style="white-space:pre-wrap"}<br>`   \item Two `{style="white-space:pre-wrap"}<br>` \end{enumerate} `{style="white-space:pre-wrap"} | ` 1. One `{style="white-space:pre-wrap"}<br>` 2. Two `{style="white-space:pre-wrap"} |
| ` Definition list — <dl>/<dt>/<dd> `{style="white-space:pre-wrap"} | ` Term `{style="white-space:pre-wrap"}<br>` : Meaning `{style="white-space:pre-wrap"} | ` Term:: Meaning `{style="white-space:pre-wrap"} | ` \begin{description} `{style="white-space:pre-wrap"}<br>`   \item[{Term}] Meaning `{style="white-space:pre-wrap"}<br>` \end{description} `{style="white-space:pre-wrap"} | ` Term `{style="white-space:pre-wrap"}<br>`    Meaning `{style="white-space:pre-wrap"} |
| ` Code block — <pre><code class="language-python"> `{style="white-space:pre-wrap"} | ```` ```python ````{style="white-space:pre-wrap"}<br>` print(1) `{style="white-space:pre-wrap"}<br>```` ``` ````{style="white-space:pre-wrap"} | ` [source,python] `{style="white-space:pre-wrap"}<br>` ---- `{style="white-space:pre-wrap"}<br>` print(1) `{style="white-space:pre-wrap"}<br>` ---- `{style="white-space:pre-wrap"} | ` \begin{lstlisting}[language=python] `{style="white-space:pre-wrap"}<br>` print(1) `{style="white-space:pre-wrap"}<br>` \end{lstlisting} `{style="white-space:pre-wrap"} | ` .. code:: python `{style="white-space:pre-wrap"}<br><br>`    print(1) `{style="white-space:pre-wrap"} |
| ` Code whitespace — <pre><code> `{style="white-space:pre-wrap"} | ```` ```python {literal-tail="-"} ````{style="white-space:pre-wrap"}<br>` print(1) `{style="white-space:pre-wrap"}<br>```` ``` ````{style="white-space:pre-wrap"} | ` [source,python,literal-tail="-"] `{style="white-space:pre-wrap"}<br>` ---- `{style="white-space:pre-wrap"}<br>` print(1) `{style="white-space:pre-wrap"}<br>` ---- `{style="white-space:pre-wrap"} | ` \begin{lstlisting}[language=python,literal-tail=-] `{style="white-space:pre-wrap"}<br>` print(1) `{style="white-space:pre-wrap"}<br>` \end{lstlisting} `{style="white-space:pre-wrap"} | ` .. code:: python `{style="white-space:pre-wrap"}<br>`    :literal-indent: 3 `{style="white-space:pre-wrap"}<br>`    :literal-lines: 1 `{style="white-space:pre-wrap"}<br><br>`    print(1) `{style="white-space:pre-wrap"} |
| ` Disclosure — <details>/<summary> `{style="white-space:pre-wrap"} | ` :::: details `{style="white-space:pre-wrap"}<br>` ::: summary `{style="white-space:pre-wrap"}<br>` Title `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"}<br><br>` Text `{style="white-space:pre-wrap"}<br>` :::: `{style="white-space:pre-wrap"} | ` [details] `{style="white-space:pre-wrap"}<br>` ===== `{style="white-space:pre-wrap"}<br>` [summary] `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br>` Title `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br><br>` Text `{style="white-space:pre-wrap"}<br>` ===== `{style="white-space:pre-wrap"} | ` \wcDetails{\wcSummary{Title}Text} `{style="white-space:pre-wrap"} | ` .. details:: `{style="white-space:pre-wrap"}<br><br>`    .. summary:: `{style="white-space:pre-wrap"}<br><br>`       Title `{style="white-space:pre-wrap"}<br><br>`    Text `{style="white-space:pre-wrap"} |
| ` Header — <header> `{style="white-space:pre-wrap"} | ` ::: header `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"} | ` [header] `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"} | ` \wcHeader{Text} `{style="white-space:pre-wrap"} | ` .. html-header:: `{style="white-space:pre-wrap"}<br><br>`    Text `{style="white-space:pre-wrap"} |
| ` Footer — <footer> `{style="white-space:pre-wrap"} | ` ::: footer `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"} | ` [footer] `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"} | ` \wcFooter{Text} `{style="white-space:pre-wrap"} | ` .. html-footer:: `{style="white-space:pre-wrap"}<br><br>`    Text `{style="white-space:pre-wrap"} |
| ` Section — <section> `{style="white-space:pre-wrap"} | ` ::: section `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"} | ` [section] `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"} | ` \wcSection{Text} `{style="white-space:pre-wrap"} | ` .. section:: `{style="white-space:pre-wrap"}<br><br>`    Text `{style="white-space:pre-wrap"} |
| ` Article — <article> `{style="white-space:pre-wrap"} | ` ::: article `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"} | ` [article] `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"} | ` \wcArticle{Text} `{style="white-space:pre-wrap"} | ` .. article:: `{style="white-space:pre-wrap"}<br><br>`    Text `{style="white-space:pre-wrap"} |
| ` Aside — <aside> `{style="white-space:pre-wrap"} | ` ::: aside `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"} | ` **** `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` **** `{style="white-space:pre-wrap"} | ` \wcAside{Text} `{style="white-space:pre-wrap"} | ` .. aside:: `{style="white-space:pre-wrap"}<br><br>`    Text `{style="white-space:pre-wrap"} |
| ` Block group — <div class="note"> `{style="white-space:pre-wrap"} | ` ::: div {.note} `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"} | ` [div,class="note"] `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"} | ` \wcDiv[class={note}]{Text} `{style="white-space:pre-wrap"} | ` .. container:: note `{style="white-space:pre-wrap"}<br><br>`    Text `{style="white-space:pre-wrap"} |
| ` Figure with caption — <figure>/<figcaption> `{style="white-space:pre-wrap"} | ` ![Image](image.svg) `{style="white-space:pre-wrap"}<br>` [Caption] `{style="white-space:pre-wrap"} | ` .Caption `{style="white-space:pre-wrap"}<br>` [caption=""] `{style="white-space:pre-wrap"}<br>` image::image.svg[Image] `{style="white-space:pre-wrap"} | ` \begin{figure} `{style="white-space:pre-wrap"}<br>`   \includegraphics{image.svg} `{style="white-space:pre-wrap"}<br>`   \caption{Caption} `{style="white-space:pre-wrap"}<br>` \end{figure} `{style="white-space:pre-wrap"} | ` .. figure:: image.svg `{style="white-space:pre-wrap"}<br>`    :alt: Image `{style="white-space:pre-wrap"}<br><br>`    Caption `{style="white-space:pre-wrap"} |
| ` Table — <table> `{style="white-space:pre-wrap"} | ` | A | B | `{style="white-space:pre-wrap"}<br>` | --- | --- | `{style="white-space:pre-wrap"}<br>` | 1 | 2 | `{style="white-space:pre-wrap"} | ` [options="header"] `{style="white-space:pre-wrap"}<br>` |=== `{style="white-space:pre-wrap"}<br>` |A |B `{style="white-space:pre-wrap"}<br>` |1 |2 `{style="white-space:pre-wrap"}<br>` |=== `{style="white-space:pre-wrap"} | ` \begin{tblr}{colspec={Q[l] Q[l]}} `{style="white-space:pre-wrap"}<br>` A & B \\ `{style="white-space:pre-wrap"}<br>` 1 & 2 \\ `{style="white-space:pre-wrap"}<br>` \end{tblr} `{style="white-space:pre-wrap"} | ` .. list-table:: `{style="white-space:pre-wrap"}<br>`    :header-rows: 1 `{style="white-space:pre-wrap"}<br><br>`    * - A `{style="white-space:pre-wrap"}<br>`      - B `{style="white-space:pre-wrap"}<br>`    * - 1 `{style="white-space:pre-wrap"}<br>`      - 2 `{style="white-space:pre-wrap"} |
| ` Module script — <script type="module"> `{style="white-space:pre-wrap"} | ` ::: script { type="module" } `{style="white-space:pre-wrap"}<br>` console.log("Hello"); `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"} | ` [script,type="module"] `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br>` console.log("Hello"); `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"} | ` \wcScript[type={module}]|console.log("Hello");| `{style="white-space:pre-wrap"} | ` .. script:: `{style="white-space:pre-wrap"}<br>`    :type: module `{style="white-space:pre-wrap"}<br><br>`    console.log("Hello"); `{style="white-space:pre-wrap"} |
| ` Stylesheet — <style> `{style="white-space:pre-wrap"} | ` ::: style `{style="white-space:pre-wrap"}<br>` .note { color: red; } `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"} | ` [style] `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br>` .note { color: red; } `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"} | ` \wcStyle{.note \{ color: red; \}} `{style="white-space:pre-wrap"} | ` .. style:: `{style="white-space:pre-wrap"}<br><br>`    .note { color: red; } `{style="white-space:pre-wrap"} |
| ` Custom elements — block `{style="white-space:pre-wrap"}<br>` <tp-callout variant="info"> `{style="white-space:pre-wrap"}<br>` <sl-alert variant="primary"> `{style="white-space:pre-wrap"} | ` ::: tp-callout { variant="info" } `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"}<br><br>` ::: sl-alert { variant="primary" } `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"} | ` [tp-callout,variant="info"] `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br><br>` [sl-alert,variant="primary"] `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"} | ` \wcTpCallout[variant={info}]{Text} `{style="white-space:pre-wrap"}<br><br>` \wcSlAlert[variant={primary}]{Text} `{style="white-space:pre-wrap"} | ` .. tp-callout:: `{style="white-space:pre-wrap"}<br>`    :variant: info `{style="white-space:pre-wrap"}<br><br>`    Text `{style="white-space:pre-wrap"}<br><br>` .. sl-alert:: `{style="white-space:pre-wrap"}<br>`    :variant: primary `{style="white-space:pre-wrap"}<br><br>`    Text `{style="white-space:pre-wrap"} |
| ` Image — <img> `{style="white-space:pre-wrap"} | ` ![Image](image.svg) `{style="white-space:pre-wrap"} | ` image::image.svg[Image] `{style="white-space:pre-wrap"} | ` \includegraphics[alt={Image}]{image.svg} `{style="white-space:pre-wrap"} | ` .. image:: image.svg `{style="white-space:pre-wrap"}<br>`    :alt: Image `{style="white-space:pre-wrap"} |
| ` Video — <video> `{style="white-space:pre-wrap"} | ` ![](movie.mp4){media=video controls="true"} `{style="white-space:pre-wrap"} | ` video::movie.mp4[tp-media=true,controls="true"] `{style="white-space:pre-wrap"} | ` \movie[showcontrols=true,preload=unset]{}{movie.mp4} `{style="white-space:pre-wrap"} | ` .. media:: video `{style="white-space:pre-wrap"}<br>`    :src: movie.mp4 `{style="white-space:pre-wrap"}<br>`    :controls: true `{style="white-space:pre-wrap"} |
| ` Audio — <audio> `{style="white-space:pre-wrap"} | ` ![](sound.ogg){media=audio controls="true"} `{style="white-space:pre-wrap"} | ` audio::sound.ogg[tp-media=true,controls="true"] `{style="white-space:pre-wrap"} | ` \sound[showcontrols=true,preload=unset]{}{sound.ogg} `{style="white-space:pre-wrap"} | ` .. media:: audio `{style="white-space:pre-wrap"}<br>`    :src: sound.ogg `{style="white-space:pre-wrap"}<br>`    :controls: true `{style="white-space:pre-wrap"} |
| ` Line break — <br> `{style="white-space:pre-wrap"} | ` First␠␠ `{style="white-space:pre-wrap"}<br>` Second `{style="white-space:pre-wrap"} | ` First + `{style="white-space:pre-wrap"}<br>` Second `{style="white-space:pre-wrap"} | ` First\\ Second `{style="white-space:pre-wrap"} | ` | First `{style="white-space:pre-wrap"}<br>` | Second `{style="white-space:pre-wrap"} |
| ` Link — <a href="…"> `{style="white-space:pre-wrap"} | ` [Site](https://example.org) `{style="white-space:pre-wrap"} | ` link:https://example.org[Site] `{style="white-space:pre-wrap"} | ` \usepackage{hyperref} `{style="white-space:pre-wrap"}<br>` \href{https://example.org}{Site} `{style="white-space:pre-wrap"} | `` `Site <https://example.org>`__ ``{style="white-space:pre-wrap"} |
| ` Bold — <strong>, <b> `{style="white-space:pre-wrap"} | ` **Text** `{style="white-space:pre-wrap"} | ` *Text* `{style="white-space:pre-wrap"} | ` \textbf{Text} `{style="white-space:pre-wrap"} | ` **Text** `{style="white-space:pre-wrap"} |
| ` Emphasis — <em>, <i> `{style="white-space:pre-wrap"} | ` *Text* `{style="white-space:pre-wrap"} | ` _Text_ `{style="white-space:pre-wrap"} | ` \textit{Text} `{style="white-space:pre-wrap"} | ` *Text* `{style="white-space:pre-wrap"} |
| ` Inline code — <code> `{style="white-space:pre-wrap"} | `` `x` ``{style="white-space:pre-wrap"} | `` `x` ``{style="white-space:pre-wrap"} | ` \texttt{x} `{style="white-space:pre-wrap"} | ``` ``x`` ```{style="white-space:pre-wrap"} |
| ` Keyboard key — <kbd> `{style="white-space:pre-wrap"} | ` :kbd:Ctrl{} `{style="white-space:pre-wrap"} | ` :experimental: `{style="white-space:pre-wrap"}<br><br>` kbd:[Ctrl] `{style="white-space:pre-wrap"} | ` \wcKbd*{Ctrl} `{style="white-space:pre-wrap"} | ` .. role:: example-kbd-1(kbd) `{style="white-space:pre-wrap"}<br><br>`` :example-kbd-1:`Ctrl` ``{style="white-space:pre-wrap"} |
| ` Highlight — <mark> `{style="white-space:pre-wrap"} | ` ==Text== `{style="white-space:pre-wrap"} | ` #Text# `{style="white-space:pre-wrap"} | ` \wcMark*{Text} `{style="white-space:pre-wrap"} | ` .. role:: example-mark-1(mark) `{style="white-space:pre-wrap"}<br><br>`` :example-mark-1:`Text` ``{style="white-space:pre-wrap"} |
| ` Strikethrough — <s> `{style="white-space:pre-wrap"} | ` ~~Text~~ `{style="white-space:pre-wrap"} | ` [.line-through]#Text# `{style="white-space:pre-wrap"} | ` \sout{Text} `{style="white-space:pre-wrap"} | ` .. role:: example-s-1(s) `{style="white-space:pre-wrap"}<br><br>`` :example-s-1:`Text` ``{style="white-space:pre-wrap"} |
| ` Superscript — <sup> `{style="white-space:pre-wrap"} | ` x^2^ `{style="white-space:pre-wrap"} | ` x^2^ `{style="white-space:pre-wrap"} | ` x\textsuperscript{2} `{style="white-space:pre-wrap"} | `` x\ :sup:`2` ``{style="white-space:pre-wrap"} |
| ` Subscript — <sub> `{style="white-space:pre-wrap"} | ` x~2~ `{style="white-space:pre-wrap"} | ` x~2~ `{style="white-space:pre-wrap"} | ` x\textsubscript{2} `{style="white-space:pre-wrap"} | `` x\ :sub:`2` ``{style="white-space:pre-wrap"} |
| ` Inline group — <span class="note"> `{style="white-space:pre-wrap"} | ` [Text]{.note} `{style="white-space:pre-wrap"} | ` [.note]#Text# `{style="white-space:pre-wrap"} | ` \wcSpan*[class={note}]{Text} `{style="white-space:pre-wrap"} | ` .. role:: note `{style="white-space:pre-wrap"}<br>`    :class: note `{style="white-space:pre-wrap"}<br><br>`` :note:`Text` ``{style="white-space:pre-wrap"} |
| ` Custom elements — inline `{style="white-space:pre-wrap"}<br>` <tp-icon name="star"> `{style="white-space:pre-wrap"}<br>` <sl-badge variant="success"> `{style="white-space:pre-wrap"} | ` Rating :tp-icon:{name="star"}. `{style="white-space:pre-wrap"}<br><br>` Status :sl-badge:Ready{variant="success"}. `{style="white-space:pre-wrap"} | ` Rating [tp-icon,name="star"]#star#. `{style="white-space:pre-wrap"}<br><br>` Status [sl-badge,variant="success"]#Ready#. `{style="white-space:pre-wrap"} | ` Rating \wcTpIcon*[name={star}]{}. `{style="white-space:pre-wrap"}<br><br>` Status \wcSlBadge*[variant={success}]{Ready}. `{style="white-space:pre-wrap"} | ` .. role:: example-tp-icon-1(tp-icon) `{style="white-space:pre-wrap"}<br>`    :name: star `{style="white-space:pre-wrap"}<br><br>`` Rating :example-tp-icon-1:`star`. ``{style="white-space:pre-wrap"}<br><br>` .. role:: example-sl-badge-1(sl-badge) `{style="white-space:pre-wrap"}<br>`    :variant: success `{style="white-space:pre-wrap"}<br><br>`` Status :example-sl-badge-1:`Ready`. ``{style="white-space:pre-wrap"} |

The paragraph-attributes row combines all four cases on one paragraph: `#part` is its ID, `.note` its class, `data-kind="example"` a valued attribute and `hidden` a boolean attribute. In tp-markdown, a trailing attribute list handles all four without a `p` directive. tp-asciidoc also uses a native paragraph attribute list: `[#part.note%hidden,data-kind="example"]`. Empty values such as `data-kind=""` are preserved. For ID-only or class-only paragraphs, native anchors/roles and RST targets/`.. class::` remain preferred. LaTeX and RST use element notation for the combined example. `hidden` would hide a live paragraph; it is shown here only as source code. RST uses a blank line after directive options and before indented content; definition bodies and quotations are indented without introducing an HTML directive.

Standard LaTeX packages used here are `hyperref` (links/anchors), `csquotes` (quotations), `listings` (code), `graphicx` (images), `tabularray` (tables) and `multimedia` (audio/video). The writer declares only the packages needed by the document. Native syntax does not imply that every HTML attribute can be retained without additional options.

##### TP components and document features

This table compares document features rather than generic HTML element syntax. Block forms precede inline formulas. Native counterparts are used where the target adaptation provides them; TP notation is used otherwise.

| HTML / feature | tp-markdown | tp-asciidoc | tp-latex | tp-restructuredtext |
| --- | --- | --- | --- | --- |
| ` Automatic TOC / <tp-toc> counterpart `{style="white-space:pre-wrap"} | ` [[toc]] `{style="white-space:pre-wrap"} | ` :toc: macro `{style="white-space:pre-wrap"}<br><br>` toc::[] `{style="white-space:pre-wrap"} | ` \tableofcontents `{style="white-space:pre-wrap"} | ` .. contents:: Contents `{style="white-space:pre-wrap"} |
| ` Cross-language include — <tp-include src="part.md"> `{style="white-space:pre-wrap"} | ` ::include{part.md} `{style="white-space:pre-wrap"} | ` include::part.md[] `{style="white-space:pre-wrap"} | ` \input{part.md} `{style="white-space:pre-wrap"} | ` .. include:: part.md `{style="white-space:pre-wrap"} |
| ` <tp-theorem type="theorem" heading="Result" number="1" variant="none" qed="◆"> `{style="white-space:pre-wrap"}<br>`   <p>Text</p> `{style="white-space:pre-wrap"}<br>` </tp-theorem> `{style="white-space:pre-wrap"} | ` ::: tp-theorem { type="theorem" heading="Result" number="1" variant="none" qed="◆" } `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"} | ` [tp-theorem,type="theorem",heading="Result",number="1",variant="none",qed="◆"] `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"} | ` \usepackage{amsthm} `{style="white-space:pre-wrap"}<br>` \theoremstyle{plain} `{style="white-space:pre-wrap"}<br>` \newtheorem*{theorem}{Theorem} `{style="white-space:pre-wrap"}<br>` \tpAttributes[type={theorem},heading={Result},number={1},variant={none},qed={◆}]{ `{style="white-space:pre-wrap"}<br>` \begin{theorem}[{Result}] `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` \end{theorem} `{style="white-space:pre-wrap"}<br>` } `{style="white-space:pre-wrap"} | ` .. tp-theorem:: `{style="white-space:pre-wrap"}<br>`    :type: theorem `{style="white-space:pre-wrap"}<br>`    :heading: Result `{style="white-space:pre-wrap"}<br>`    :number: 1 `{style="white-space:pre-wrap"}<br>`    :variant: none `{style="white-space:pre-wrap"}<br>`    :qed: ◆ `{style="white-space:pre-wrap"}<br><br>`    Text `{style="white-space:pre-wrap"} |
| ` <tp-theorem type="proof" number="" variant="none" qed="□"> `{style="white-space:pre-wrap"}<br>`   <p>Text</p> `{style="white-space:pre-wrap"}<br>` </tp-theorem> `{style="white-space:pre-wrap"} | ` ::: tp-theorem { type="proof" number variant="none" qed="□" } `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ::: `{style="white-space:pre-wrap"} | ` [tp-theorem%number,type="proof",variant="none",qed="□"] `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` ==== `{style="white-space:pre-wrap"} | ` \usepackage{amsthm} `{style="white-space:pre-wrap"}<br>` \tpAttributes[type={proof},number={},variant={none},qed={□}]{ `{style="white-space:pre-wrap"}<br>` \begin{proof}[{Proof}] `{style="white-space:pre-wrap"}<br>` Text `{style="white-space:pre-wrap"}<br>` \end{proof} `{style="white-space:pre-wrap"}<br>` } `{style="white-space:pre-wrap"} | ` .. tp-theorem:: `{style="white-space:pre-wrap"}<br>`    :type: proof `{style="white-space:pre-wrap"}<br>`    :number: `{style="white-space:pre-wrap"}<br>`    :variant: none `{style="white-space:pre-wrap"}<br>`    :qed: □ `{style="white-space:pre-wrap"}<br><br>`    Text `{style="white-space:pre-wrap"} |
| ` Display TeX — <tp-math mode="latexmath" displaystyle> `{style="white-space:pre-wrap"} | ```` ```latexmath ````{style="white-space:pre-wrap"}<br>` x^2 `{style="white-space:pre-wrap"}<br>```` ``` ````{style="white-space:pre-wrap"} | ` [latexmath] `{style="white-space:pre-wrap"}<br>` ++++ `{style="white-space:pre-wrap"}<br>` x^2 `{style="white-space:pre-wrap"}<br>` ++++ `{style="white-space:pre-wrap"} | ` \[x^2\] `{style="white-space:pre-wrap"} | ` .. math:: `{style="white-space:pre-wrap"}<br><br>`    x^2 `{style="white-space:pre-wrap"} |
| ` Display AsciiMath — <tp-math mode="asciimath" displaystyle> `{style="white-space:pre-wrap"} | ```` ```asciimath ````{style="white-space:pre-wrap"}<br>` sqrt(x) `{style="white-space:pre-wrap"}<br>```` ``` ````{style="white-space:pre-wrap"} | ` [asciimath] `{style="white-space:pre-wrap"}<br>` ++++ `{style="white-space:pre-wrap"}<br>` sqrt(x) `{style="white-space:pre-wrap"}<br>` ++++ `{style="white-space:pre-wrap"} | ` \wcTpMath[mode={asciimath},displaystyle={},value={sqrt(x)}]{} `{style="white-space:pre-wrap"} | ` .. asciimath:: `{style="white-space:pre-wrap"}<br><br>`    sqrt(x) `{style="white-space:pre-wrap"} |
| ` Inline TeX — <tp-math mode="latexmath"> `{style="white-space:pre-wrap"} | `` :latexmath:`x^2` ``{style="white-space:pre-wrap"} | ` latexmath:[x^2] `{style="white-space:pre-wrap"} | ` \(x^2\) `{style="white-space:pre-wrap"} | `` :math:`x^2` ``{style="white-space:pre-wrap"} |
| ` Inline AsciiMath — <tp-math mode="asciimath"> `{style="white-space:pre-wrap"} | `` :asciimath:`sqrt(x)` ``{style="white-space:pre-wrap"} | ` asciimath:[sqrt(x)] `{style="white-space:pre-wrap"} | ` \wcTpMath[mode={asciimath},value={sqrt(x)}]{} `{style="white-space:pre-wrap"} | `` :asciimath:`sqrt(x)` ``{style="white-space:pre-wrap"} |

**Verification.** `node scripts/check-markup-mapping-browser.mjs` checks every language cell in both tables against its actual parser, then converts the resulting HTML back to native markup and renders it again. It compares text and structural elements, including media, custom elements and literal script/style content. The include example uses a Markdown fixture. Set `TP_TEST_BASE_URL` for a different documentation server. TP RST also accepts native transitions at fragment boundaries; LaTeX links require `hyperref`.

**Theorems and proofs.** [`tp-theorem`](#/components/theorem/index.md) supports `theorem`, `lemma`, `proposition`, `corollary`, `definition`, `example`, `remark` and `proof`. The first statement row illustrates the theorem-like types; the second illustrates `proof`. Markdown, AsciiDoc and RST use their custom-element syntax. LaTeX uses native `amsthm` declarations and environments; `\tpAttributes` preserves explicit numbers and component settings without replacing the native body with a `wc` command. The starred declaration avoids recalculating an explicit number. The writer selects the appropriate theorem style and declares only the packages needed.

`variant="none"` is the default, without border or background. The `qed` attribute works for every type: when omitted, it is empty except for `proof`, which uses `□`. Any explicit value takes priority, including `qed=""`. In the proof row, `number=""` intentionally suppresses numbering; the Markdown and AsciiDoc writers use their equivalent empty-attribute forms. RST option indentation and the blank line before the body are significant. Generated light-DOM headings and ending symbols are excluded from the pivot and regenerated by the component.

**Custom elements.** The same HTML element notations work for `tp-*` and other valid custom-element names. The block row compares `tp-callout` with Shoelace's `sl-alert`; the inline row embeds `tp-icon` and Shoelace's `sl-badge` inside sentences. In LaTeX, the starred `wc` form explicitly selects inline content; RST declares a role and its attributes before using it in prose. Markdown's empty `tp-icon` form needs no placeholder; AsciiDoc and RST use `star` as role content, which the icon component replaces. These are source notations, not guarantees of a component's CSS display mode. The component's JavaScript definition must also be loaded to obtain its behavior; converting a custom tag does not load an external library.

**Semantic containers.** `details` includes its `summary` trigger. Explicit `header`, `footer`, `section` and `article` elements use TP element directives: a document heading is not a substitute for an arbitrary HTML container. RST `html-header` and `html-footer` deliberately differ from its native page-decoration directives `header` and `footer`. AsciiDoc sidebar blocks and RST containers provide native counterparts for simple `aside` and `div` content; the element directives remain available to preserve the exact tag and additional attributes. Equivalent forms supported by the TP parsers are not a guarantee that every source spelling shown is emitted by the writer.

**Inline semantics.** Highlight, strikeout, superscript and subscript Markdown forms belong to established dialect extensions rather than CommonMark. `~~Text~~` usually produces `del`, while `s` means text that is no longer accurate; this preserves the strikeout appearance, not that distinction. AsciiDoc roles can produce a styled `span` rather than the original inline tag. LaTeX strikeout uses `\usepackage[normalem]{ulem}`. RST superscript/subscript examples retain the necessary escaped space after `x`; it separates the role without inserting a visible space. The TP role examples preserve `kbd`, `mark`, `s` and `span` as explicit elements.

**Figures and literal content.** A simple image with a caption uses a native figure in AsciiDoc, LaTeX and RST; Markdown's `[Caption]` line is a TP extension. More complex figure contents can require an element directive. `script` and `style` examples are literal source, not executable documentation examples. LaTeX `\wcScript` uses a delimiter around JavaScript so its braces remain literal; `\wcStyle` escapes CSS braces in its braced argument. Converting or previewing content does not imply that scripts are executed.

**Attributes and headings.** Native anchors and classes remain preferred when they preserve the source exactly. Arbitrary attributes use a supported attribute list or, where necessary, the TP element syntax; Markdown's short `#` and `.` forms are equivalent to `id` and `class`. RST `heading-level` preserves an isolated HTML heading level without changing the native heading syntax.

**Indexes.** [`tp-index`](#/components/index/index.md) defines terms; `tp-ref href="!term"` marks visible occurrences, or invisible occurrences with `silent`. `tp-listof selector="tp-index"` builds their alphabetical index. The converter turns native LaTeX imakeidx output into these declarative components. Conversion back uses `\makeindex`, `\index` and `\printindex`, supplemented by TP commands for authored identities, interactive labels and descriptions. Independent reference scopes retain TP commands to avoid merging indexes. See the [native syntax audit](#/components/markup-converter/native-syntax-audit.md#imakeidx-indexes) for verified cases and limits.

**Table of contents.** Markdown `[[toc]]` is a TP extension. The converter regenerates native TOC constructs from a recognized automatic TOC in the pivot rather than copying its links. An explicitly authored `tp-toc` remains a custom-element directive so its interactive options are retained.

**Includes.** HTML uses `tp-include`. The inclusion-preservation step of `convert`/`convertMarkup` keeps the original path, including its extension. TP detects the included file's language and converts its contents to the containing language when rendered: this cross-language behavior is a TP adaptation even where the directive is native. See [Included documents](#included-documents) for supported simple standalone inclusions.

**Mathematics and media.** Markdown math roles/fences and RST AsciiMath roles/directives are TP extensions. LaTeX has no native AsciiMath notation; `\wcTpMath` preserves the original notation. TP media options preserve web-player properties beyond the minimal native macros. Additional media options emitted by the converter are omitted here for clarity.

**Literal code and tables.** The TP `literal-tail`, `literal-indent` and `literal-lines` options preserve exact code whitespace. Absolute/mixed column widths, per-cell alignment and custom borders use the TP options described in [Native syntax first](#native-syntax-first). Their placement in the first table follows the standard HTML element they preserve, rather than whether their target spelling is a TP extension.

Additional attributes and nested content can require a different representation. HTML output retains the formatted HTML pivot. See [Information preservation and limits](#information-preservation-and-limits) for the limits of each conversion.

#### Cleaning the HTML pivot

Normalization removes parser-generated presentation scaffolding before writing the target language: automatic heading `tabindex`, Markdown table decoration classes, AsciiDoc image/quotation wrappers and redundant code-language attributes, Docutils link/code classes, and LaTeX listing markers. Semantic elements replace wrappers where appropriate.

Author-provided attributes are identified before normalization and restored afterward. An explicitly written class such as `highlight`, `reference`, `head` or `imageblock` is not discarded merely because a parser uses the same name. Explicit HTML wrappers, styles, identifiers, `data-*` attributes and `tabindex` values are retained. Temporary provenance attributes do not appear in the returned HTML.

Meaningful information is kept: link targets, code languages, line numbering, mathematical notation, table spans and supported layout settings. Cleanup is not a blanket removal of classes, styles or `data-*` attributes. Preservation in the pivot does not guarantee that every target syntax can express every attribute.

#### Theorems and proofs

The HTML pivot uses [`tp-theorem`](#/components/theorem/index.md) for theorem, lemma, proposition, corollary, definition, example, remark and proof. LaTeX input uses native `amsthm` declarations and environments, including shared counters, section resets and forward references. The output preserves statement type, label, complementary title, resolved number, reference target, body, background `variant` and counter metadata.

Conversion to LaTeX uses native theorem/proof environments. TP attribute metadata retains values that a newly declared counter would otherwise recalculate. Markdown, AsciiDoc and reStructuredText use their custom-element syntax because their base languages have no equivalent theorem semantics. The “LaTeX theorems and references comparison” example demonstrates the complete round trip. Generated headings and proof symbols are component presentation, not duplicated author content. Original macro definitions and custom counter expressions are not reconstructed.

#### Information preservation and limits

A conversion can preserve information only if the source parser carries it into the intermediate representation and the target writer knows how to express it. Standard HTML elements carry common semantics; attributes or dedicated markers retain supported details that HTML alone does not express. Information discarded during parsing cannot be reconstructed by a later conversion step.

The goal is to preserve meaning, structure and supported behavior, rather than the original spelling of the markup. Equivalent source constructs may produce the same HTML and therefore the same target syntax. Converting to another language and back does not guarantee the original source text, comments, whitespace, macro definitions, metadata or arbitrary presentation styles. Unsupported constructs may lose information or cause a conversion error.

Conversions use the features supported by the TP parsers; they do not reproduce every package, directive or extension supported by desktop publishing tools. Some generated options therefore require the corresponding TP parser, even when the surrounding construct is native. Shared TP base styles provide the default rendered appearance; conversion does not copy a screenshot or freeze the page’s current theme into the output.

[Included documents](#included-documents) have a separate preservation step: supported inclusion directives retain their file paths and are rewritten in the target syntax, with cross-language content conversion performed when rendered.

Inspect both the generated code and rendered output before saving. The [native syntax audit](native-syntax-audit.md) records the documented examples and remaining exceptions. JavaScript in HTML source is not executed by the converter.

### Editing and previews

Each language tab contains its matching `tp-*-viewer` in `lite` mode. Add the boolean `show-code` attribute to initially display code and rendered output together in every language tab. Show code and Show output display either pane or both together. Edit any format, then choose Run to use that code as the source and update all five formats. Reset restores the original loaded document and refreshes all previews immediately, even after conversions. Save as downloads the current edited code, including changes not yet converted. Viewers load on demand and grow with their content.

The global toolbar provides Files on the left, the comparison source language in the center, and color, theme and fullscreen controls on the right. The source label updates after a conversion or import; Reset restores the original source language. Save source code using Save as in the code editor toolbar, or use the global Files → Export as menu.

### JavaScript API

The standalone asynchronous function converts text without mounting a component:

```javascript
import { convert, convertFile } from "@tp/tp-components/components/markup-converter/markup-converter.js";

const fromFile = await convertFile("chapter.adoc", "asciidoc", "latex");
const inferred = await convertFile("chapter.adoc", "auto", "markdown");

const latex = await convert("## Preparation\n\nRead the **guide**.", "markdown", "latex");
const markdown = await convert(html, "html", "markdown", {
  baseURL: new URL("chapter.html", document.baseURI).href,
});
```

`baseURL` identifies the source document for resolving relative resources. The function returns the converted source; it does not change the viewer or write files. Identical source and target languages preserve the original code.

`convertFile(filename, from, to, options)` fetches the document and calls `convert` with its URL as the source base. Use `"auto"` as `from` to infer the language from the extension. Failed requests and unsupported languages reject the promise.

#### Included documents

Simple standalone inclusions retain the original file path in the target syntax: `include::fragment.adoc[]`, `::include{fragment.adoc}`, `\input{fragment.adoc}`, or `.. include:: fragment.adoc`. HTML uses `<tp-include src="fragment.adoc"></tp-include>` because it has no native document inclusion directive.

In the converter, markup viewers, and the direct `tp-markdown`, `tp-asciidoc`, `tp-latex` and `tp-restructuredtext` components, rendering fetches the included file, infers its language from its extension, and converts its content to the containing language. The code pane and saved source retain the inclusion directive. Nested inclusions resolve relative to their own files; missing files, circular inclusions and nesting beyond 20 levels report errors. This cross-language behavior is a TP runtime adaptation, not a feature of desktop LaTeX or Docutils. It currently covers standalone, complete-file inclusions without filtering or literal-code options; language-specific include options are not translated.

`await convert(language)` applies the code edited in that language. `setSource(value, language)` replaces the document and selects its source tab. `await getMarkup(language)` returns the current conversion and rejects if loading failed. Changes to `value`, `language` and `src` also reload the document.

`tp-markup-converter-change` reports `{ language, value }` after loading and conversion; `tp-markup-converter-error` reports `{ message }` on failure.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/markup-converter/markup-converter.js"></script>
  ```

import
: ```js
  import "/path/to/components/markup-converter/markup-converter.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/markup-converter/markup-converter.js";
  ```
:::

<!-- -->
## Examples

The comparison examples below reuse the inputs from the [conversion regression tests](../../appendices/tests.md). Select an example, then compare code and rendered output using the lite viewer in its HTML, tp-asciidoc, tp-latex, tp-markdown and tp-restructuredtext tabs. The initial tab identifies the source language. Choose Run in another language to test the reverse direction; Reset restores the original document. Test placeholders for media have been replaced with local demonstration files.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit a Markdown document containing a formula and an image in a table, choose Run and compare all five formats.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Markdown source
: Edit the source document, choose Run and compare the formula and image table across the five formats.

HTML source
: Edit the source document, choose Run and compare the formula and image table across the five formats.

AsciiDoc source
: Edit the source document, choose Run and compare the formula and image table across the five formats.

LaTeX source
: Edit the source document, choose Run and compare the formula and image table across the five formats.

reStructuredText source
: Edit the source document, choose Run and compare the formula and image table across the five formats.

Rich text
: Convert formatted text, a quotation, a list, an image, a video and an audio player; inspect their code and rendering.

External source
: Load an AsciiDoc file and observe that its source tab is selected initially.

Native HTML comparison
: Start with the native HTML test document and compare headings, references, numbered lists, tables, formulas, code and images in all five formats.

Native Markdown comparison
: Start with the native Markdown test document and compare its code and rendering in all five formats.

Native AsciiDoc comparison
: Start with the native AsciiDoc test document and compare its code and rendering in all five formats.

Native reStructuredText comparison
: Start with the native reStructuredText test document and compare its code and rendering in all five formats.

Media and subtitles comparison
: Compare formatting, a quotation, an image, audio and video with subtitle tracks. Both alternative video sources use the same local MP4 clip.

Merged table comparison
: Compare the caption, fixed column widths, merged cells, alignment and formatted cell content.

Math and code comparison
: Compare inline LaTeX and AsciiMath, display math, Python highlighting and preserved code indentation.

LaTeX text environments comparison
: Compare alignment, quotations, verse, verbatim, a minipage, tabbing, a figure and a table; inspect the native LaTeX returned from each format.

LaTeX flexible table comparison
: Compare a tabularray table with a fixed-width column, a flexible column, alignment and a bold heading.

LaTeX table rules comparison
: Compare booktabs top, middle, bottom and partial rules with the other four formats.

LaTeX lists comparison
: Compare custom enumitem labels, nested lists, a starting index and resumed numbering.

LaTeX theorems and references comparison
: Compare a definition, theorem and proof with shared counters, formulas and forward references. The definition uses the plain default appearance; the theorem has a brand background and a custom ◆ ending, while the proof keeps its default □ ending.

LaTeX units comparison
: Compare siunitx quantities, French decimal formatting, units and ranges.

LaTeX image transformations comparison
: Compare graphicx dimensions, aspect ratio, rotation and clipping on the canoe image.

LaTeX code listings comparison
: Compare an external JavaScript listing with a line range and numbering starting at 20, followed by an indented Python listing.

LaTeX array and tabularx comparison
: Compare custom column types, fixed and flexible widths, merged cells and top/middle/bottom alignment. Convert to another language, run it, then return to LaTeX to check that the table layout is preserved.

LaTeX indexes comparison
: Compare two alphabetical indexes with repeated occurrences, three-level entries, sort keys and see/see also links. Follow the occurrence links, then convert back to LaTeX to recover native makeindex, index and printindex commands.

LaTeX core math environments comparison
: Compare inline math, displaymath with a matrix, numbered eqnarray rows with references and an unnumbered eqnarray*. Switch among the five languages to compare the formulas, display mode and equation numbering.

LaTeX AMS equations comparison
: Compare numbered equations, aligned lines, an unnumbered line, cases and gathered equations. Follow the equation references and convert back to LaTeX to check the formulas and numbering.

LaTeX multilingual quotations comparison
: Compare quotation marks in English, French, German, Spanish, Italian, Portuguese and Dutch, with three nesting levels and a block quotation with bold text. Convert in both directions to check language scopes, punctuation and emphasis.

Index components comparison
: Start with tp-index definitions and visible or silent tp-ref occurrences. Compare the five languages, including native imakeidx commands supplemented by TP commands for interactive labels and descriptions.

Native comments comparison
: Compare native comment syntax across all five languages, including inline comments, multiline text and a commented-out component.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
:tp-icon:{name="file_type_html" library="languages" size="1.25em" aria-hidden="true"} HTML
: ::include{examples/examples.html}

:tp-icon:{name="file_type_asciidoc" library="languages" size="1.25em" aria-hidden="true"} tp-asciidoc
: ::include{examples/examples.adoc}

:tp-icon:{name="file_type_latex" library="languages" size="1.25em" aria-hidden="true"} tp-latex
: ::include{examples/examples-latex.html}

:tp-icon:{name="file_type_markdown" library="languages" size="1.25em" aria-hidden="true"} tp-markdown
: ::include{examples/examples.md}

:tp-icon:{name="file_type_restructuredtext" library="languages" size="1.25em" aria-hidden="true"} tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

<!--
@tp-dependency tp-asciidoc-viewer
@summary Interactive AsciiDoc viewer with editable source and parser outputs.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-html-viewer
@summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-latex-viewer
@summary Editable LaTeX documents with rendered HTML and generated source views.
-->
<!--
@tp-dependency tp-markdown-viewer
@summary Interactive Markdown viewer with editable source and parser outputs.
-->
<!--
@tp-dependency tp-menu
@summary Accessible menu component.
-->
<!--
@tp-dependency tp-restructuredtext-viewer
@summary Interactive reStructuredText viewer with editable source and parser outputs.
-->
<!--
@tp-dependency tp-tabs
@summary Accessible tabs component with keyboard and reorder support.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->

- [`<tp-asciidoc-viewer>`](#/components/asciidoc-viewer/index.md) : Interactive AsciiDoc viewer with editable source and parser outputs.
- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-html-viewer>`](#/components/html-viewer/index.md) : Interactive HTML viewer with editable source, live rendering, and DOM inspection.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-latex-viewer>`](#/components/latex-viewer/index.md) : Editable LaTeX documents with rendered HTML and generated source views.
- [`<tp-markdown-viewer>`](#/components/markdown-viewer/index.md) : Interactive Markdown viewer with editable source and parser outputs.
- [`<tp-menu>`](#/components/menu/index.md) : Accessible menu component.
- [`<tp-restructuredtext-viewer>`](#/components/restructuredtext-viewer/index.md) : Interactive reStructuredText viewer with editable source and parser outputs.
- [`<tp-tabs>`](#/components/tabs/index.md) : Accessible tabs component with keyboard and reorder support.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-toolbar>`](#/components/toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
@summary LaTeX.js conversion and patched TikZJax assets.
-->
<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-latex](https://www.npmjs.com/package/@tp/tp-latex) : LaTeX.js conversion and patched TikZJax assets.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.

### See also

- [`<tp-prose-editor>`](#/components/prose-editor/index.md) : Edit rich documents before converting them.
- [`<tp-table-editor>`](#/components/table-editor/index.md) : Build and convert tables interactively.
<!-- tp-docgen:dependencies:end -->
