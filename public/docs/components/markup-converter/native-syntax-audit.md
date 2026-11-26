# Native syntax audit

The documentation now contains 29 examples. The earlier full-corpus check covered 26 examples in five language views (104 conversions and 26 original sources); the additional core-math comparison has its own five-language check described below. The original source remains unchanged. Generated code is checked separately from its rendered appearance.

Headings, ordinary formatting, numbered lists, links, image dimensions, figures and representable tables use the target parser's native syntax. Parser-generated classes and wrappers do not justify a fallback. Named LaTeX anchors use `\hypertarget`; first-level headings use `\chapter*` with the `report` document class.

The example inventory below distinguishes native syntax, TP options on native structures, and explicit-element fallbacks. The remaining exceptions preserve information that the current conversion cannot yet represent faithfully in native syntax. Some are implementation limits rather than limits of the target language. HTML itself needs no fallback. Mathematical components and the numbered code editor are functional elements, not substitutes for ordinary tables or headings.

| Example | Remaining extensions and reason |
| --- | --- |
| Basic usage | None for headings, lists, images or tables. |
| Javascript API | Same checks as Basic usage. |
| Markdown source | None for headings, lists, images or tables. |
| HTML source | None for headings, lists, images or tables. |
| AsciiDoc source | Tables remain native: TP Markdown column-widths, AsciiDoc cols, LaTeX tblr and RST list-table preserve the column dimensions. |
| LaTeX source | Markdown uses a native headerless MultiMarkdown table. RST retains the level-two heading using a native title and the TP heading-level directive. |
| reStructuredText source | None for headings, lists, images or tables. |
| Rich text | Markdown uses a native image followed by a caption line. Audio and video use native media syntax with TP options for preload and accessible labels; RST uses the semantic media directive. No standard-element fallback remains. |
| External source | RST uses native headings with the TP heading-level directive. |
| Native HTML comparison | Markdown uses native per-cell horizontal and vertical alignment markers. RST keeps the cell alignments in native list-table options; the heading level is retained using the TP heading-level directive. The alphabetic list and image are native. |
| Native Markdown comparison | Right-aligned cells use native list-table with TP cell-alignments. RST uses native headings with the TP heading-level directive. |
| Native AsciiDoc comparison | Column dimensions remain native in Markdown and LaTeX. RST keeps right-aligned cells and headings native with TP options. Markdown retains the image figure through the figure attribute. |
| Native reStructuredText comparison | RST alias anchors use adjacent native targets. Markdown uses the TP aliases heading attribute; AsciiDoc uses native inline targets in the heading. The list, image and table are native. |
| Media and subtitles comparison | Native media syntax retains multiple sources and subtitle tracks through TP sources/tracks options, including their order, language, label and default selection. No standard-element fallback remains. |
| Merged table comparison | Markdown and AsciiDoc keep widths, merges and individual alignments in native tables with TP width options. LaTeX uses tblr. RST uses a native grid table with TP cell-alignments and width options, including the merged cell and multiline rich text. |
| LaTeX indexes comparison | Native imakeidx commands are reconstructed from semantic section/span metadata. Other languages use native lists, links and attributed span/role syntax; a section directive preserves the index definition. TP empty-span options retain invisible occurrence markers without raw HTML. |
| LaTeX core math environments comparison | Inline math, displaymath, eqnarray and eqnarray* retain formulas, display mode, resolved numbers and links in all five languages. Native math syntax is used; inline/display delimiters may replace the equivalent LaTeX environment names. |
| Math and code comparison | AsciiMath retains its mathematical TP component in LaTeX. The explicit local code theme uses the TP theme option on native lstlisting; no standard HTML-element fallback remains. |
| LaTeX flexible table comparison | Markdown and AsciiDoc keep the fixed 9em column and flexible column in native tables with TP width options. RST also uses native list-table with TP cell-alignments and width options. No table fallback remains. |
| LaTeX table rules comparison | Partial horizontal rules remain native in Markdown, AsciiDoc and RST using the TP cell-borders option. No table fallback remains. |
| LaTeX lists comparison | Custom marker punctuation, spacing, nested lists and continuation use native list items with TP list options in Markdown, AsciiDoc and RST. LaTeX uses enumitem. No element fallback remains in this example. |
| LaTeX theorems and references comparison | Native amsthm definition, theorem and proof environments convert through the semantic tp-theorem pivot. LaTeX exports reconstruct native environments and declarations; TP attribute metadata preserves resolved numbers, counter settings, variant and qed. Markdown, AsciiDoc and RST use their custom-element notation because they have no equivalent native theorem environment. The example retains a plain definition, a brand theorem ending in ◆, a proof ending in □, shared numbering and resolved references. Original counter expressions and declaration spelling are not reconstructed. |
| LaTeX units comparison | No HTML-element fallback. |
| LaTeX image transformations comparison | Rotation, scaling and trimming/clipping use native images with TP image options in Markdown, AsciiDoc and RST; LaTeX uses graphicx. No element fallback remains in this example. |
| LaTeX code listings comparison | AsciiDoc uses `[source,language,linenums,start=N]`, RST uses `.. code::` with `:number-lines: N`, and LaTeX uses `lstlisting` with `numbers=left,firstnumber=N`. Their numbered renderings use the read-only code editor. Markdown uses native fences with the TP numbers=left and firstnumber options. Unnumbered listings use native code blocks. |
| LaTeX array and tabularx comparison | Native tables retain fixed and flexible widths, merged cells, line breaks, bold cells, borders and vertical alignment. Returning to LaTeX uses native tabularray rather than reconstructing custom column definitions. |
| LaTeX AMS equations comparison | Native AsciiDoc stem blocks and RST math directives retain the AMS environments and explicit equation tags. Markdown uses native latexmath fences. Native anchors retain equation references. Returning to LaTeX restores AMS environments directly. |
| LaTeX multilingual quotations comparison | No standard-element fallback remains. Markdown uses attributed spans/blocks, AsciiDoc named attributes, RST generic roles and native-block metadata, and LaTeX Babel/csquotes with TP attributes where needed. The example covers English, French, German, Spanish, Italian, Portuguese and Dutch, with three nesting levels. Language scopes, punctuation, quotation metadata and block emphasis are retained. |


The automated policy rejects any additional standard HTML-element directive in these examples unless it is explicitly reviewed. The browser audit also parses the RST inputs and compares headings, tables, horizontal positions and code presentation in both themes. Its detailed report includes all generated sources.

## Native syntax improvements

The converter now uses the existing MultiMarkdown extension for headerless tables and cell-specific alignment (`[:-]`, `[-:]`, `[:-:]`, combined with `^`, `=` or `v` for vertical alignment). Row and column spans remain native. AsciiDoc tables keep their native span and alignment specifiers; relative column widths use `cols` without discarding the column proportions through `autowidth`.

RST heading aliases are emitted as adjacent `.. _name:` targets. Numbered listings use the native AsciiDoc, RST and LaTeX forms listed above, preserving literal code and the starting number. Explicit editor options with no faithful mapping remain explicit; RST retains common indentation, tabs and final lines through the literal-indent and literal-lines options.

The browser audit additionally checks RST alias targets and numbered-code round trips through AsciiDoc and LaTeX. These checks complement the five-language presentation comparisons.

## Absolute and mixed widths

The TP `column-widths`, `table-width` and `table-layout` options preserve fixed lengths, percentages, automatic columns and weighted flexible columns while keeping native table structure. Markdown uses a trailing attribute list, AsciiDoc named table attributes, and RST directive options on `list-table` or `table` around a grid table. LaTeX uses `tblr`, fixed `Q` columns and weighted `X` columns. These TP options are not claimed as standard CommonMark, Asciidoctor or Docutils features.

Weighted columns are recalculated by the TP host when their container changes. The native HTML table layout algorithm still applies: fixed columns can expand when an explicit wider table has spare space, and content can impose minimum widths. Unsupported formatting remains a reason for a fallback; ordinary custom cell borders and horizontal/vertical alignment no longer require one.

The width matrix at `/scripts/fixtures/converter-width-audit.html` checks four width combinations through all five languages in both directions. It compares retained width specifications, cell content and measured column geometry at 800px and 400px, including an explicit 2:1 proportion and shrink check.

## RST cell alignments

Native `list-table` and grid `table` directives accept the TP option `:cell-alignments:`, for example `2,3=right/middle; 3,1=center/bottom`. Coordinates are one-based logical row/column pairs, including header rows; merged cells are addressed by their top-left origin. The parser validates both values and coordinates, then writes the explicitly requested alignment on semantic `th`/`td` cells.

The comparison examples no longer fall back to HTML-element table directives for alignment. Merged multiline cells remain native grid cells, and flat RST line blocks inside table cells retain their line breaks during cross-language conversion. Ordinary custom borders are also retained through the TP option described below.

The browser fixture `/scripts/fixtures/converter-rst-alignment-audit.html` checks all nine horizontal/vertical combinations through HTML, Markdown, AsciiDoc and LaTeX and back to RST, plus merged cells, widths, rich line breaks and invalid options.

## Custom cell borders

Native Markdown tables, AsciiDoc tables and RST `list-table`/grid `table` directives accept the TP option `cell-borders`. It preserves explicit author borders without replacing the table by HTML-element directives. Markdown uses a trailing attribute list, AsciiDoc a named table attribute, and RST `:cell-borders:`.

For example, `1,1/border-bottom=2px solid #356a87; 2,2/border-right=3px dashed #a34b22` addresses logical cells, including header rows. Merged cells use their top-left origin. Borders retain their side, width, line style and color; `none` and `hidden` remain explicit. CSS token references remain references rather than being frozen to the current theme. These are TP options, not standard CommonMark, Asciidoctor or Docutils syntax.

Borders coexist with spans, cell alignments and absolute/mixed widths. The parsers emit semantic cells with only the requested border declarations; default presentation stays in `tp-base`. Border images, corner radii, `!important`, advanced color functions and other unsupported CSS retain the explicit-element fallback.

The fixture `/scripts/fixtures/converter-border-audit.html` checks all nine directed conversions between the three languages in both themes, merged and unmerged tables, widths, colors, line styles, and invalid options. The LaTeX partial-rule example is also covered by the documentation audit and return-conversion tests.

## Headings, aliases, figures and numbered fences

RST `.. heading-level:: 2` sets the first section heading to `h2` while preserving native underlined titles. It disables document-title promotion for that document. Levels 1–6 are accepted. Conversion uses this option for contiguous hierarchies starting below `h1`; irregular or skipped levels use the TP heading-levels sequence while keeping native underlined headings.

Markdown headings accept `{#main aliases="alias other"}`. AsciiDoc retains the primary `[[main]]` target and writes additional native inline targets in the title. RST retains adjacent native targets. All identifiers remain linkable during round trips; extra target elements in rendered HTML are semantic anchors, not authored HTML fallbacks.

Markdown figures use an image on its own line immediately followed by `[Caption with **formatting**]`. `{figure}` after an image explicitly keeps a figure without a caption. Compound image figures now retain multiple caption paragraphs, additional images, legend paragraphs/lists and figure/caption attributes through the TP figure-layout option described below.

Numbered Markdown fences use `{numbers=left firstnumber=20}` after the language. They render as read-only code editors and preserve literal source text and the first line number. Unnumbered fences remain `pre/code`. Extra editor behavior without a matching fence option remains explicit; RST code blocks use literal-indent and literal-lines to preserve common indentation, tabs and final lines.

The browser fixture `/scripts/fixtures/converter-structure-audit.html` checks 64 directed conversions across Markdown, AsciiDoc, RST and LaTeX, starting from HTML references: heading levels and aliases, captioned and captionless figures, and numbered code. Unit tests additionally cover literal whitespace, fence delimiters and preservation of unsupported figure content.

## Custom lists and image transformations

Native lists accept TP presentation options: `list-label`, `list-start`, `list-resume`, `list-itemsep`, `list-topsep` and `list-leftmargin`. Marker templates use `@1`, `@a`, `@A`, `@i` and `@I` for decimal, alphabetic and Roman counters; `@@` inserts a literal at sign. For example, `list-label="(@A)"` gives `(A)`, `(B)`, etc. Spacing accepts nonnegative CSS lengths. `list-resume="true"` resumes the preceding list of the same kind and nesting depth; an explicit start remains available when the preceding list is absent.

Markdown puts these options in the list's trailing attribute list; AsciiDoc uses named attributes before its native list. RST uses `.. list-options::` around one indented native bullet or enumerated list. LaTeX conversion uses `enumitem` options. These are TP extensions, not standard CommonMark, Asciidoctor or Docutils features. Ordinary lists keep their existing rendering. Plain-text per-item markers use list-item-labels; rich per-item markers use list-item-markup with target-language inline syntax.

Native image attributes/directive options preserve `image-angle` (degrees, positive counterclockwise), `image-scale` (positive multiplier), `image-trim` (left, bottom, right, top lengths), `image-clip=true` and `image-fit=contain`. Width, height and alternative text remain native. LaTeX uses the corresponding `graphicx` options. Parsers emit semantic images with only the explicitly requested transformations. The image-origin option preserves explicit transform origins. Inline RST images use native substitutions. Transformed images in supported native table cells use the same image options. Compound CSS transforms and unrelated unsupported formatting retain an explicit fallback.

The fixture `/scripts/fixtures/converter-presentation-audit.html` verifies 48 directed conversions across Markdown, AsciiDoc, RST and LaTeX, comparing list labels, counters, nesting, spacing and image dimensions, rotation, clipping and fit. The focused unit suite also validates invalid options and return conversion to LaTeX. The documentation-wide audit rejects element fallbacks for both comparison examples.

## Item markers, inline images, origins, table images and listing themes

`list-item-labels="1=Special; 3=!"` overrides the markers of the first and third items while keeping native list items. Positions are one-based within that list, independent of its starting counter. Other items retain the list's normal marker template. Separators and special characters in a label are percent-encoded; ordinary words remain readable. Nested lists have their own options. LaTeX uses native `\item[Special]`. Rich markers now use list-item-markup with native inline formatting; LaTeX retains optional item labels.

`image-origin="left top"` or `image-origin="25% 75%"` sets the explicit rotation/scaling origin. Native Markdown image attributes, AsciiDoc image attributes and RST image/figure directive options retain it. LaTeX accepts the corresponding `origin` option on `\includegraphics`; CSS coordinate pairs are a TP extension to the existing graphicx origin codes.

Inline RST images use `|tp-image-N|` with a native substitution image directive, including dimensions and transformation options. The same shared image conversion is used in native Markdown pipe tables, AsciiDoc tables and RST list-tables. Ordinary image wrappers introduced by AsciiDoc inside cells no longer force an element-table fallback. Unsupported CSS transforms and unrelated image attributes remain explicit. Compound image figures are covered by the figure-layout adaptation below.

Native LaTeX listings accept the TP option `theme=light` or `theme=dark`, including numbered listings. Without the option, they follow their surrounding theme. Conversion retains the local theme through Markdown fence classes, AsciiDoc source roles and RST code classes. Default styling continues to come from the shared TP styles.

`/scripts/fixtures/converter-presentation-next-audit.html` checks 96 directed conversions through Markdown, AsciiDoc, RST and LaTeX: item labels, inline images, transformation origins, images in tables, and unnumbered/numbered listing themes. Unit tests cover the same cases with the three JavaScript renderers; the browser matrix exercises the actual RST engine. The documentation-wide policy no longer permits a div fallback for the Math and code comparison.

## Simple and advanced media

Markdown uses its image-shaped media extension, for example `![](clip.mp4){media=video controls="true" preload="metadata"}`. AsciiDoc keeps `video::` and `audio::`, with `tp-media=true` to enable exact semantic media options. RST uses `.. media:: video` or `.. media:: audio` with indented options. LaTeX keeps `\movie` and `\sound` from multimedia. These TP adaptations emit semantic audio/video elements; they are not claims of portable CommonMark, Docutils or PDF multimedia support.

The options retain controls, autoplay, loop, muted, preload, poster, accessible labels and supported dimensions. `sources` and `tracks` are JSON arrays. Sources retain src/type/media; tracks retain src/kind/srclang/label/default. Their order within each collection is preserved. An element with sources but no src keeps that distinction. In LaTeX, title maps to the accessible label and preload=unset preserves an absent preload attribute. Unsupported media attributes, complex CSS or rich fallback children still require an explicit representation.

## Literal code and arbitrary heading levels

RST native `code` directives accept `:literal-indent: 3` and `:literal-lines: N`. These TP options preserve the original source after removing only the structural indentation, including tabs, blank lines and common leading spaces. Numbered code retains its first line number and local theme. Converted Markdown fences, AsciiDoc source blocks and LaTeX listings also carry `literal-tail` when needed to preserve terminal whitespace exactly: whitespace is percent-encoded, and `-` denotes an empty tail.

For a document whose headings are h2, h4, h3 and h6, conversion emits `.. heading-levels:: 2,4,3,6` before native RST headings. The parser retains those HTML levels and disables document-title promotion. Identifiers remain linkable. The simpler heading-level option remains available for contiguous hierarchies.

`/scripts/fixtures/converter-media-rst-audit.html` checks 56 directed conversions: simple/advanced media across the four markup languages, and RST code, numbered code and irregular headings in both directions. It compares semantic media attributes, sources, tracks, exact literal code, numbering, themes, heading levels and anchors.

## Mapping-table corrections — 2026/11/19

The two [HTML-to-markup mapping tables](index.md#html-to-markup-mapping) now have an additional executable audit covering all 45 rows and their four markup columns. Each of the 180 checks parses the documented syntax, converts its HTML pivot back to the same markup language, then renders that generated source. The comparison covers text, heading levels, structural elements, media and custom-element attributes, and literal script/style content. The second table now includes theorem-like statements and proofs, with native amsthm environments and checks of type, title, number, variant and qed. It is a semantic round-trip check, not a requirement for byte-identical source or a pixel comparison.

| Corrected case | Current conversion |
| --- | --- |
| Paragraph attributes | Markdown uses a trailing attribute list for identifiers, classes, named and boolean attributes. AsciiDoc uses a native block attribute list, including `[lang="en"]`; a paragraph directive is no longer needed for these supported attributes. |
| Class-only spans | AsciiDoc uses `[.note]#Text#`; RST declares a native generic role with `:class: note` instead of a role based on the HTML span element. Markdown retains bracketed spans. |
| Keyboard keys | AsciiDoc uses `kbd:[Ctrl]` with `:experimental:`. |
| Simple sidebars and containers | An unadorned AsciiDoc aside uses `****`; a class-only RST div uses `.. container:: note`. |
| Simple lists | Markdown, AsciiDoc and RST place consecutive items on consecutive lines. Structural indentation and paragraph separation inside complex items remain significant. |
| Inline custom elements | LaTeX uses the starred wc form for custom elements inside phrasing contexts, including third-party elements such as `sl-badge`. Block custom elements keep the block form. |
| Stylesheets | Standalone style elements survive HTML pivot parsing. Their braces remain literal in AsciiDoc instead of becoming character references inside CSS. |
| LaTeX block quotations | Source-line whitespace no longer adds an invisible character on each displayquote round trip. |
| AsciiDoc sidebars and display mathematics | Generated sidebar classes and untitled formula wrappers no longer cause explicit-element fallbacks or accumulating nested figures. Authored attributes remain protected. |
| Context-sensitive snippets | The LaTeX link example declares hyperref. TP RST now accepts the native transition even at the beginning or end of a fragment; the explicit hr directive is no longer needed for this case. |

## Native metadata, languages and RST fragments — 2026/11/19

Native headings, paragraphs and quotations now preserve IDs, classes, language, named and boolean attributes. Markdown quotes place their attribute list after a blank line. AsciiDoc uses named attributes on native headings, paragraphs, quoted spans and quote blocks; attributed level-one headings use a native discrete title. RST uses a TP metadata directive before the next native block and generic roles with options. An empty comment separates the metadata directive from an indented quotation.

LaTeX uses Babel otherlanguage/foreignlanguage and csquotes. The TP command `\tpAttributes[...]{...}` attaches attributes to one native block without replacing its structure. It is deliberately identified as a TP addition, not standard LaTeX syntax. Supported language nesting is preserved, and no default styles are introduced. RST explicit targets retain their exact spelling, while native transitions can occur at fragment boundaries.

The fixture `src/utilities/markup-native-metadata-fixtures.ts` covers six heading levels, an attributed paragraph, an attributed quotation, nested language scopes, quotation metadata, an exact anchor/link and an isolated separator. `node scripts/check-markup-native-metadata-browser.mjs` checks all 16 source/target combinations for each fixture, including same-language round trips through the pivot: **192 cross-language round trips**. Every leg is rendered and checked for semantic selectors, attributes, text and link destinations; element fallbacks are rejected. Set `TP_METADATA_REPORT` to save detailed results.

## Attributed spans, compound figures, rich markers and exact targets — 2026/11/19

LaTeX uses the TP inline command `\tpAttributes*[...]{...}` for attributed spans, with native formatting inside. The unstarred form applies attributes to a native figure or caption. Native figure environments retain paragraph boundaries, additional images and legend lists; native enumitem item labels retain inline formatting.

The TP figure-layout option groups native content into a semantic figure. Its value starts with caption-index:count:inline or caption-index:count:blocks. The index is zero-based among the figure children, including the leading content blocks; count is the number of caption blocks. Optional figure.NAME=VALUE and caption.NAME=VALUE entries follow, separated by semicolons. Attribute values are percent-encoded. Content stays in native image, paragraph and list syntax; the option contains no HTML. The image-led form remains available; general figures and mixed captions use the native container forms described below.

Markdown uses an image with `figure-layout` and `figure-lines` followed by a four-space-indented native body. AsciiDoc uses a native compound example block with the `figure-layout` option. RST uses the native `figure` directive with the same option. For example, `1:2:blocks;figure.id=plot;caption.class=description` groups the two blocks after the first image into the caption. These are documented TP parser extensions, not upstream syntax claims.

Rich per-item markers use list-item-markup instead of list-item-labels. Each value contains inline markup in the current language, percent-encoded when needed to protect attribute syntax (for example, Markdown bold uses 1=%2A%2AA%2A%2A). The marker is rendered by the same parser as the list. Plain labels remain literal. Positions are one-based, and nested lists have independent labels.

RST targets are distinguished before Docutils registers normalized names. Exact references preserve case, underscores and hyphens; duplicate exact names are errors. Ambiguous non-exact references do not silently choose a target.

The fixture `src/utilities/markup-native-complex-fixtures.ts` covers attributed spans, a multi-paragraph caption with a legend, two-image figures with a list legend, rich per-item markers, and colliding anchor names. `node scripts/check-markup-native-complex-browser.mjs` renders 80 directed source/target round trips through the four parsers and checks semantic structure and attributes on both legs. Set `TP_COMPLEX_REPORT` to save the source and error report. These structural checks do not certify arbitrary HTML, CSS or all figure layouts.

## General figures, multiline attributes, nested titles and media replacement — 2026/11/19

General figures can start with a code block, a list or another native block instead of an image. Mixed captions retain both phrasing content and paragraphs. The figure-layout option keeps the caption range; unwrap=N,M identifies temporary paragraph positions whose phrasing content must remain directly inside the figure or caption. These are TP options on native structures, not raw HTML payloads. Default presentation remains the responsibility of the host styles.

The tp-attributes option carries a percent-encoded JSON object when an attribute contains line breaks or tabs. This preserves LF, CRLF, blank lines and tabs exactly; the option is consumed by the parser and does not remain in the HTML pivot. Ordinary single-line attributes keep their usual native notation. The same envelope preserves additional attributes on native audio/video elements. It contains attribute values only, never document content.

Native headings retain their levels and attributes inside quotations and list items. AsciiDoc uses discrete titles in these contexts. RST explicitly marked heading contexts have independent title-adornment scopes; heading-levels preserves the document-wide sequence. Duplicate exact anchors and ambiguous references remain errors.

Native audio/video can retain rich replacement content: text, links, emphasis, paragraphs and lists. The replacement body is parsed in the source language. It is not automatically used as the accessible label or poster. Source and track children keep their existing validated options.

Markdown uses a native blockquote with figure-layout or media-container metadata. AsciiDoc uses a compound example block; nested headings use discrete titles. RST uses a native container with figure-layout, and an indented replacement body on media. LaTeX retains figure/caption and multimedia commands with TP attribute/fallback options. These grouping options are consumed; no technical wrapper remains in the HTML pivot.

The initial `markup-native-general-fixtures.ts` matrix checked eight fixtures in all 16 source/target combinations: general and mixed-caption figures, exact multiline attributes, headings inside quotations/lists and combined contexts, and inline/block media replacement. `node scripts/check-markup-native-general-browser.mjs` checked the initial 128 round trips (extended below). `TP_GENERAL_REPORT` saves sources and failures. Four combined, executable demos are included in the parser documentation.

## Nested and empty figures, media child attributes and order — 2026/11/19

Nested figures, empty figures and empty captions now use native compound structures with TP grouping metadata. Empty captions retain their position. LaTeX accepts nested figure environments without introducing float-layout styles. Markdown and AsciiDoc use nested native block containers; RST uses nested native containers.

Source and track children preserve valid HTML attributes, including named data attributes, empty values and multiline values. Their order relative to one another and to block or inline replacement content is retained by children-order. No source/track element fallback or raw HTML payload is needed for these cases. Temporary grouping attributes are consumed by the parsers.

The general matrix now contains 14 fixtures, including six new regression cases, for **224 cross-language round trips** across all 16 source/target pairs. Each leg verifies native output, rendered structure, child positions, text and attributes. The eight focused converter suites pass **190 tests**, including rejection of invalid media-child references and attribute names. Four executable native-nested demos accompany the parser documentation.

## Semantic theorems and proofs — 2026/11/19

The `tp-theorem` pivot covers theorem, lemma, proposition, corollary, definition, example, remark and proof. Native LaTeX theorem environments no longer require styled div/span fallbacks. The renderer generates no presentation styles or duplicate headings in the author body. The component renders exclusively in light DOM; marked generated headings and proof symbols are omitted from conversion. The component uses TP theme tokens, with a plain default (variant="none") and optional neutral, brand, info, success, warning and danger backgrounds. The qed ending symbol is optional for every type and defaults to empty, except that proof uses □ when qed is omitted. Explicit values, including empty, take priority. Native LaTeX proofs explicitly carry qed="□".

LaTeX exports use native amsthm environments, `\theoremstyle` and `\newtheorem*` declarations, with native text and math. The TP `\tpAttributes` wrapper carries settings that those environments do not represent directly. Markdown, AsciiDoc and reStructuredText retain `tp-theorem` through their custom-element syntax; HTML keeps the element itself. These forms preserve the component identity without raw HTML escapes.

| Setting | Conservation across conversions |
| --- | --- |
| `variant` | Explicit values are retained, including `none`, neutral, brand, info, success, warning and danger. An omitted value keeps the plain default: no border or background. The color remains a TP variant, not a frozen CSS color. LaTeX uses TP attribute metadata on the native environment. |
| `qed` | Explicit ending text or symbols are retained for every statement type. An explicit empty value remains empty, including for proofs. Without an attribute, proof uses □ and other types use no ending; LaTeX exports materialize that effective default in the metadata. Omission and an explicit default therefore need not remain textually distinct, but the ending is preserved. |
| Numbering and references | Displayed numbers, IDs, link targets and known shared/reset counter settings are retained. Theorem numbering is resolved before conversion; these theorem exports use explicit numbers rather than reconstructing the original theorem counter program. Section, figure, table and code rules follow the automatic numbering model documented below. References retain their resolved text and destination, not necessarily their original `\ref` or `\cref` spelling. |

The editable **LaTeX theorems and references comparison** keeps only a definition, a theorem and a proof. The definition demonstrates the plain default; `\tpAttributes[variant={brand},qed={◆}]{...}` decorates the native theorem; the native proof keeps its default □ ending. The eight-type coverage belongs to the regression matrix, not to this introductory comparison.

`node scripts/check-markup-theorem-browser.mjs` checks all eight types plus a native amsthm document with shared counters and forward references in all 16 source/target pairs: **144 cross-language round trips**. The checks cover semantic structure, paragraphs, titles, numbers, reference targets, counter settings, all seven appearance modes, and explicit or empty ending symbols. The existing theorem package comparison remains an editable documentation example.

## Compound images and additional quotation languages — 2026/11/19

Native images now preserve ordered 2D transformations: translate, scale, rotate, skew, their supported X/Y forms, and matrix. Markdown, AsciiDoc and RST use the TP image-transform option; LaTeX uses the TP transform option on includegraphics. The order is kept exactly, rather than decomposing or rearranging the transformations. Existing simple scale/angle options remain available. Invalid arguments and conflicting transform options are rejected.

Explicit image attributes (including title, id, class, loading, decoding, fetchpriority, srcset, sizes, ARIA and data attributes) use the image-attributes envelope in Markdown, AsciiDoc and RST, and attributes on includegraphics in LaTeX. Both contain URI-encoded JSON attribute values, not escaped HTML content. This keeps native image syntax for inline images and images inside native tables.

Babel and csquotes now support German (german/ngerman), Spanish, Italian, Portuguese and Dutch in addition to French and English. Language scopes, standard captions, dates and outer/inner quotation marks are supported. Conversion emits the required Babel language declarations. Nested quotes retain their identity through Markdown spans, AsciiDoc attributed spans and RST interpreted roles; converting back reconstructs foreignquote and its starred inner form. Redundant inherited language spans need not survive as separate elements.

The presentation matrix includes three new cases: an inline image with composed transforms and responsive/accessibility attributes, a matrix-transformed image inside a table, and five additional languages with nested quotations and local language scopes. All **48/48 new directed language-pair checks** pass. They parse each generated language, compare semantic results and convert back to the starting language. They do not test responsive image resource selection, network requests or pixel rendering across browsers.

## Nested per-item list markers — 2026/11/19

The 12 previous native-syntax failures are resolved. A nested list with individual marker overrides no longer needs a list-wide label option to remain native. Markdown uses native list items with list-item-labels/list-item-markup attributes, AsciiDoc uses native lists with named options, and RST uses native lists within list-options. LaTeX retains enumerate/itemize and optional item labels. Ordinary sibling items retain their default markers; an override does not impose custom labels or spacing on the whole list.

Marker presentation is excluded from the item body before export, including markers inside an item's paragraph. This fixes the duplicated marker in the previous LaTeX return path. The regression fixture checks Special, D) and ! exactly once, the ordered/unordered nesting, and the text of each item.

The strengthened matrix verifies source → target → source, checking native syntax at all three stages and comparing markers, list structure and item text in both rendered directions. All **16/16 nested-list language pairs** and **144/144 complete presentation round trips** pass. No observed failure remains in this presentation matrix; the untested cases and deliberate limits below are still distinct from this result.

## Multilingual references, three-level quotations and responsive URLs — 2026/11/19

Cleveref now localizes standard section/subsection/subsubsection, chapter, figure, table and equation reference names using the main Babel language: French, English, German, Spanish, Italian, Portuguese and Dutch. Cref capitalizes the label; explicit crefname/Crefname settings take priority. Author-defined theorem labels remain author-defined. Forward/backward references keep their resolved wording and destination through the HTML pivot; original reference-command spelling is not reconstructed.

All seven quotation languages are exercised at three nested levels. AsciiDoc uses progressively longer hash delimiters on attributed native spans (one, two, then three hashes); more than two is a TP parser extension. RST uses native interpreted roles with one escaping layer per nesting level. Markdown keeps bracketed spans and LaTeX keeps native foreignquote/enquote commands. Code blocks, inline code and escaped extended AsciiDoc delimiters are protected from interpretation.

The converter resolves relative srcset URLs against the source base URL, just as it does src. Each candidate is parsed separately while retaining commas inside URLs, data URLs and width/density descriptors. The resulting absolute URLs survive exports opened under another base URL. The sizes expression remains unchanged. This resolution applies to img and source elements in the HTML pivot; native-markup round trips here exercise img. It is URL preservation, not image downloading or a browser resource-selection simulation.

The expanded matrix now passes **224/224 source → target → source checks**, with independent export base URLs at each stage. This includes five additional cleveref source documents, three-level quotations in seven languages, and responsive images whose candidates contain relative paths and commas. The focused conversion suite passes **101 tests**, and the LaTeX parser passes **20 focused tests**. No observed failure remains in this matrix.

## Cleveref plurals, ranges and 3D image expressions — 2026/11/19

Cleveref now groups reference types, removes duplicate labels, sorts numeric references and compresses three or more consecutive values. Explicit crefrange/Crefrange ranges preserve their endpoint links. Singular/plural overrides, mixed groups and seven localized conjunctions are tested. RST attributes preceding successive section headings now attach to the following section correctly.

Native image syntax retains ordered 3D transformations and restricted CSS expressions through the existing TP image-transform/graphicx transform options. These are documented TP extensions, not upstream markup or TeX graphics operations. Invalid function arities, unbalanced expressions and declaration injection are rejected.

## Standard LaTeX text environments — 2026/11/19

The new comparison covers center, flushleft, flushright, quote, quotation, verse, verbatim, minipage, tabbing, figure and table/tabular. The native LaTeX return conversion preserves paragraph/stanza boundaries, explicit alignment classes, minipage dimensions and positions, guide rows and literal code. The shared appearance belongs to tp-base.

The 44 LaTeX → HTML/Markdown/AsciiDoc/RST → LaTeX checks pass. A meaningful distinction remains: Markdown and AsciiDoc have no native minipage or general aligned block, so attributed HTML-container directives remain appropriate there; RST uses native containers. Tabbing guide rows require structural table directives where native table syntax cannot retain their hidden sizing metadata. These are deliberate fallbacks, not conversion failures. Print float placement, exact TeX tab stops, minipage stretching and unimplemented tabbing commands are outside the supported web subset.

## Remaining exceptions

The statuses below distinguish an observed failure of the native-syntax criterion, a deliberately retained explicit representation, and an untested case. TP options on native structures are intentional extensions, not raw HTML fallbacks or claims of compatibility with unmodified upstream parsers.

| Case | Status | Remaining representation and reason |
| --- | --- | --- |
| Custom theorem declarations and counter expressions | Deliberate limit | Native amsthm environments preserve type, title, resolved numbers, IDs, references, shared/reset metadata, variant and qed, including empty endings. Original declaration spelling, arbitrary macros and dynamic counter programs are not reconstructed from their rendered output. Unsupported custom styles still require explicit metadata/representation. |
| Additional language conventions | Untested / deliberate limit | Seven language scopes and their documented quotation pairs are tested. Regional variants, other languages and arbitrary custom quotation styles are not implemented. Hyphenation, font configuration and Babel active-character behavior are outside the web subset. Cleveref standard reference names now cover all seven languages; explicit crefname/Crefname overrides and author-defined theorem titles remain authoritative. Plural grouping, numeric sorting/deduplication, automatic consecutive ranges and explicit crefrange/Crefrange are now supported; custom irregular theorem plurals require crefname/Crefname. Rendered wording and endpoint links survive conversion, not live cleveref counters. |
| Attributes and deeper nesting | Untested | Multiline attributes and the documented block contexts are covered. Arbitrary combinations beyond those fixtures are not claimed to fail, but need dedicated tests. Attributed quotations are verified at three levels in all seven languages, including AsciiDoc extended hash delimiters and escaped nested RST roles. Arbitrary greater depths and mixed unsupported contexts remain untested. |
| Additional figure combinations | Untested / deliberate limit | Nested/empty figures, captions and the documented mixed blocks are covered. Other parser-specific combinations remain untested. TeX float-placement behavior has no equivalent promise in the browser layout. |
| Other image CSS | Deliberate explicit fallback / untested rendering | Ordered 2D/3D transforms, perspective, matrix3d and balanced calc/min/max/clamp/var arguments remain native through TP image options. Border images, corner radii, important declarations, custom-property declarations on the image and unrelated CSS retain an explicit representation. Variables depend on the destination scope or a fallback. Computed dimensions, browser-specific 3D appearance and arbitrary CSS functions are not covered by the semantic round-trip tests. |
| Responsive image behavior | Untested | Relative srcset candidates now resolve against the source document URL before conversion; moving the exported document is tested. Descriptors, URL-internal commas, data URLs and sizes are retained. Actual browser candidate selection, downloading and origin policies remain untested. |
| Additional media nesting | Untested | Multiple sources/tracks, their ordering and tested replacement bodies are covered. Nested players and arbitrary replacement-content grammars remain outside the matrix. Native options intentionally require source/track URLs and validate known values. |
| Additional code-editor behavior | Deliberate explicit representation | Native code syntax preserves language, line numbers, starting number, theme and whitespace. Interactive editor behavior without a corresponding source option stays on its component. |
| AsciiMath in LaTeX | Deliberate explicit representation | tp-math retains the AsciiMath source. No general translation into TeX mathematics is implemented; TeX and AMS mathematics already use native syntax. |
| Ambiguous RST references | Deliberate rejection / untested contexts | Exact target collisions and ambiguous references are rejected. General Docutils nesting constraints still apply; contexts beyond the verified cases are untested, not universally unsupported. |
| Custom elements without native equivalents | Deliberate representation | The target's custom-element notation preserves identity and behavior when there is no faithful native equivalent. Loading the component definition remains necessary. |

Original sources remain unchanged when the target language is the source language. A round trip through HTML preserves represented content and supported attributes; it does not promise to reconstruct original macros, declarations, comments, authoring choices or arbitrary dynamically evaluated counter programs. Standard section/figure/table/code counters are covered by the automatic-numbering checks below.

## Verification status

Text-environment update, 2026/11/19: **44/44 browser round trips**, **132 focused converter tests**, **73 LaTeX tests** and **5 targeted AsciiDoc tests** pass. Twelve documentation sources render successfully, and the new shared alignment, minipage, quotation and tabbing styles are verified in light and dark. TypeScript, Biome and the component build pass. The reproducible browser check is `scripts/check-latex-text-environments-browser.mjs` (`TP_TEST_BASE_URL` selects the server).

Multilingual quotation example, 2026/11/19: the published comparison now demonstrates all seven supported languages with three nesting levels. All four LaTeX → target → LaTeX checks (HTML, Markdown, AsciiDoc and RST) preserve quotation text, punctuation, language metadata and block emphasis. The focused package/role suites pass 88 tests. Nested emphasis in RST now parses its inline roles instead of displaying their source.

Current plurals/ranges/3D update, 2026/11/19: **272/272 browser source → target → source checks** pass across 17 fixtures and all 16 ordered pairs of the four markup languages, using HTML as pivot. **112 focused conversion tests** and **22 LaTeX parser tests** pass. No observed failure remains in this expanded matrix. These are semantic and native-syntax checks; they do not assert pixel-identical 3D rendering or evaluate destination CSS variables.

Previous reference/quotation/URL update, 2026/11/19: **224/224 browser round trips**, **101 focused conversion tests**, **20 LaTeX tests** and **47 AsciiDoc tests** pass. The three updated documentation demos render successfully. The prior presentation results below are historical subsets of this expanded matrix.

Image/language update, 2026/11/19: **48/48 new presentation checks** pass; the complete expanded matrix now reports **144/144 passing round trips**, including the **16/16 nested-list pairs**. The 12 previously failing native-syntax cases are fixed, and return conversions are now checked explicitly. The focused conversion suite passes **81 tests**, the LaTeX parser passes **19 focused tests**, and the AsciiDoc parser passes **44 focused tests**. All **5 updated parser documentation demos** render successfully. The audit records semantic preservation separately from native-policy compliance and from untested browser appearance.

Theorem comparison update, 2026/11/19: **144/144 cross-language browser round trips** and **64/64 focused package-conversion tests** passed. The native amsthm comparison explicitly checks `variant="brand"`, `qed="◆"` and the proof ending `qed="□"`; the broader theorem matrix covers all seven variants and explicit empty endings. Documentation descriptions, matching example labels and native-markup checks also pass. These checks verify semantic preservation, not byte-identical LaTeX source.

Current general-structure verification, 2026/11/19: **128/128 new cross-language browser round trips**, **80/80 previous compound-structure round trips**, **192/192 metadata round trips**, **172/172 mapping checks**, **4/4 exact-target checks** and **4/4 combined documentation demos** passed. The targeted component suite passes **170 tests**, including **26 new tests**. Exact replacement text, code text, caption text and multiline attribute values are checked alongside the semantic structure. Parser regressions pass **73 AsciiDoc**, **22 RST**, **7 Markdown span** and **23 LaTeX** tests. TypeScript, Biome and the component build pass. This is structural verification; it is not a new comprehensive visual comparison in every theme/browser.

Previous compound-structure verification, 2026/11/19: **80/80 new cross-language browser round trips**, **4/4 exact-target checks** (including rejected duplicate/ambiguous references), **192/192 metadata round trips**, **172/172 mapping-table checks** and **4/4 new documentation demos** passed. The focused component suite passes **144 tests**, including **15 new compound-structure tests**. Parser regressions pass **73 AsciiDoc**, **22 RST**, **7 Markdown span** and **20 LaTeX** tests. TypeScript, Biome and the component build pass. The cover inventory is synchronized separately; its test badge counts collected tests, not this run's passing tests.

Previous native-metadata verification, 2026/11/19: **192/192 cross-language browser round trips**, **172/172 mapping-table browser checks**, and **4/4 documentation demos** passed. The focused component suite passes **187 tests**; parser checks pass **73 AsciiDoc**, **22 RST**, **7 Markdown span** and **18 LaTeX** tests. The new metadata matrix includes bold text inside an inline language scope. The example policy now rejects standard-element fallbacks for the multilingual quotations comparison and no longer permits heading/paragraph fallbacks in the theorem comparison.

Previous mapping verification, 2026/11/19: **172/172 browser round trips passed**, **156 focused component tests passed**, and **9 LaTeX native-package tests passed**. TypeScript, Biome and the component build passed. The documentation corpus contains **26 examples**, with 104 cross-language outputs and 26 unchanged original sources.

Run `node scripts/check-markup-mapping-browser.mjs` against the development server. `TP_TEST_BASE_URL` selects another server; `TP_MAPPING_REPORT` saves the generated sources and rendered HTML as JSON. The include row uses a served Markdown fixture rather than a nonexistent documentation file. The checker fails if either mapping table is missing or if the content/structure checks fail. Focused regression cases live in `src/utilities/markup-mapping.test.ts`; the example fallback policy remains in `src/utilities/markup-native-policy.js`.

The older matrices described above cover widths, alignment, borders, figures, lists, media and presentation. Their historical results are separate from this latest mapping run: it does not rerun every visual comparison or certify all possible inputs. In particular, the former 46 light/dark comparisons covered the earlier 23-example corpus, not all 26 current examples.

## Core LaTeX math environments

`math` and `displaymath` normalize to native inline/display delimiters on return to LaTeX. `eqnarray` and `eqnarray*` remain native environments, with explicit resolved tags. Markdown math delimiters, AsciiDoc `latexmath` and RST math roles/directives preserve formulas and inline/display mode. Reference text and destinations are retained. Original counter commands and label declarations are not reconstructed from the HTML pivot.

Run `scripts/check-latex-math-environments-browser.mjs` against the local development server (`TP_TEST_BASE_URL`). It checks MathJax SVG output for all four forms, plus the published “LaTeX core math environments comparison” source and 20 bidirectional conversions through HTML, Markdown, AsciiDoc and RST, including resolved reference destinations. This focused audit does not test arbitrary MathJax macros or TeX page layout.

## imakeidx indexes

The converter represents indexes with hidden `tp-index` definitions, `tp-ref href="!term"` occurrences and `tp-listof selector="tp-index"`. Native LaTeX imakeidx markers become silent occurrences. Named indexes, repeated occurrences, parent entries, sort keys, displayed labels and see/see-also links survive conversion. Occurrence links replace printed page numbers.

LaTeX output uses `\makeindex`, `\index` and `\printindex`. Authored reference identities, visible labels and descriptive content additionally use TP commands: imakeidx has no equivalent for an interactive reference or its preview. Markdown, AsciiDoc and reStructuredText use component directives and inline roles. Empty references use the consumed `tp-empty` option where a role requires nonempty content. Rendered tooltips and generated list contents are not exported.

The reproducible check is `scripts/check-imakeidx-browser.mjs` with `TP_TEST_BASE_URL`. On 2026/11/19, **16/16 browser round trips passed**, including reStructuredText through Docutils: the published LaTeX example, an empty index, an index printed before its occurrences, and the authored component introduction, each through the four other languages and back. Checks compare definitions, labels, nesting, prose and link destinations. Component tests also cover dynamic updates, silent references, named groups and independent scopes.

Remaining exceptions and deliberate limits:

- Multiple independent reference scopes retain explicit TP commands in LaTeX, because a single imakeidx namespace would merge their definitions.
- Rich descriptions and visible interactive labels require TP commands alongside native commands; they are not plain imakeidx features.
- Custom `tp-listof` selectors retain component syntax. The native conversion recognizes `selector="tp-index"`.
- TeX pagination, external sorting engines, formatted index terms and arbitrary encapsulators are outside the supported imakeidx subset. Reserved characters in plain index terms and unresolved cross-references fail explicitly.
- External TeX compilation and identical locale-dependent sorting across browsers have not been tested. The browser checks establish semantic round trips, not printed page layout or full imakeidx compatibility.


## Rich theorem headings and bibliographic citations

The `tp-theorem` heading slot preserves inline markup and interactive references without moving them into the statement body. Native LaTeX optional titles containing commands or formulas use this slot. Generated prefixes and proof symbols are excluded from exports; the authored slot content remains.

Bibliographies in the TP conversion pipeline use `tp-biblio`, `tp-ref` and `tp-listof`. Stable keys are distinct from displayed numeric/custom labels. Recognized bibliography and citation metadata reconstruct native `thebibliography`, `bibitem` and `cite`, including the citation note. The standalone tp-latex API still offers semantic HTML output.

Focused tests cover rich-heading node preservation, label updates, tooltip activation and native LaTeX round trips. The Math OpenAI example keeps its citation in the title of Proposition 2.1. Arbitrary BibTeX styles and unrecognized hand-authored bibliography structures are not reconstructed by this metadata bridge; independent original source spelling is not retained.

### Semantic document titles

LaTeX `\maketitle` becomes `header.document-title` with an `h1` and author/date paragraphs. The converter restores native `\title`, `\author`, `\date` and `\maketitle` commands, including inline emphasis and title anchors. Markdown, AsciiDoc and reStructuredText preserve the header through element syntax and use native headings and paragraphs inside it. Shared presentation belongs to `tp-base`. Extra attributes or a different header structure deliberately retain element syntax rather than dropping information. Printed page geometry is outside the conversion scope.

## Numbered equation previews

`tp-equanum` and `tp-ref href="=…"` now preserve numbered equations and their references across HTML, TP Markdown, TP AsciiDoc, TP LaTeX and TP reStructuredText. The browser check `scripts/check-equanum-browser.mjs` covers a simple equation and a two-row align group, returns every language to native LaTeX, and verifies the rendered MathJax preview.

Native LaTeX exports use equation/align, tag, label and ref/eqref. Tagged MathJax content is kept once; target definitions add neither a formula nor another displayed number. Align, alignat, flalign, gather and eqnarray previews show only the labelled row and its tag; row previews survive the five-language roundtrip. The alignat column-pair count is preserved in each preview. A multline equation still shows its complete group. Other markup languages retain the interactive association using custom elements with literal mathematical script bodies. Complex or AsciiMath wrappers, duplicated scoped keys, custom reference labels and targets without recoverable native source remain component syntax. Those fallbacks have not been exhaustively tested across every nested document layout.

The browser check `scripts/check-equanum-rows-browser.mjs` verifies 20 roundtrips (four environments × five languages), native LaTeX labels and references, and MathJax previews without errors. Parser tests also cover explicit tags, aliases and row spacing.

A flalign row uses compact align notation only for the tooltip; its original flalign environment is retained in the document and native exports.

## Native comments

Updated on **2026/11/20**. Comments are retained as comment nodes in the HTML pivot, without rendered wrappers or leftover transport markers. Their text is preserved using native target syntax; this is not a byte-for-byte source round trip.

| Target | Native export | Position of inline or nested comments |
| --- | --- | --- |
| HTML | `<!-- note -->` | Retained at their position in the pivot. |
| tp-markdown | `<!-- note -->` | Retained at their position in the pivot. |
| tp-asciidoc | `// note`, one line per comment line | Moved before the outermost containing HTML block, not merely before the nearest paragraph. |
| tp-latex | `% note`, one line per comment line | Ordinary inline comments remain between the surrounding text fragments. The percent comment consumes the source newline. A following prose space is exported as the native explicit-space command `\ `, so it survives the consumed newline. |
| tp-restructuredtext | `..` followed by indented comment content | Moved before the outermost containing HTML block. Leading/trailing blank comment lines are removed so the content cannot become a visible blockquote. |

Import accepts HTML/Markdown comments, AsciiDoc line and block comments, LaTeX percent comments and native RST comments. LaTeX preamble comments and comments inside command arguments move to the beginning of the pivot. Comments inside mathematical, table or list environments move after that environment. Literal comments in code blocks, scripts and verbatim content remain code, rather than becoming document comments.

### Verified cases

- All **25 source/target combinations and their return conversions**, with simple and multiline comments and invisible rendered content: `scripts/check-markup-comments-browser.mjs`.
- Inline prose, literal code, escaped LaTeX percent signs, URLs, TP component options, preamble/argument comments and comments in mathematics, tables and lists.
- The expanded cheatsheet example in **all five target languages**: comments before and after content, an inline comment and a multiline comment containing an inactive HTML element. Its visible paragraphs are identical in the five outputs.
- The RST multiline-comment regression is corrected: a blank first comment line no longer ends the native comment and exposes its remaining content. Covered by `src/utilities/markup-comments.test.ts` and checked through Docutils in the browser.

### Remaining limits and exceptions

- **Intentional displacement:** conversions through AsciiDoc or RST lose the original inline/nested comment position. Converting back to HTML does not restore that position. The LaTeX import relocations described above are likewise irreversible.
- **Source normalization:** indentation, blank boundary lines, delimiter spacing and grouping into one multiline comment or several single-line comments are not preserved exactly. AsciiDoc block comments are exported as line comments.
- **Corrected LaTeX spacing regression:** `text<!-- note --> continues` now retains its separating space through HTML → LaTeX → HTML and repeated round trips. The export uses native `\ ` after the percent-comment line. Tests cover spaces before/after comments, no space, a newline separator, consecutive comments, and a comment before emphasis. LaTeX → HTML → LaTeX checks distinguish an explicit space from indentation after `%`: native indentation remains ignored. Browser text comparisons disregard the zero-width character emitted by LaTeX.js, but retain and compare visible word spaces. These cases pass alongside the 25-pair comment matrix and 505 converter tests.
- **Not exhaustively tested:** comment payloads incompatible with an HTML comment (such as an embedded closing delimiter), comments generated by arbitrary LaTeX macros, and every combination of deeply nested extension blocks. These cases are not claimed to be supported losslessly.
- **Literal content:** a comment-looking sequence inside a listing remains part of that listing and is not translated into the target document-comment syntax.

The documentation corpus also records existing container exceptions explicitly: RST minipages retain a div directive for dimensions and vertical position; Index-component examples retain an explicit div for their reference scope in all four target languages, with wcP paragraphs in LaTeX. These exceptions are unrelated to comment syntax. Plain blockquotes use the built-in LaTeX quote environment without csquotes; arbitrary valid media-child attribute names remain supported.

## Automatic document numbering

Updated on **2026/11/23**.

Section, figure, table and code rules are retained in the semantic pivot and reconstructed in each target. Generated labels are identified separately and removed from author text before serialization. Markdown uses YAML; AsciiDoc uses native section attributes and TP counter options; LaTeX uses native counters, names and unstarred headings; RST uses sectnum plus TP numbering directives. Native content syntax remains preferred. HTML includes a standalone script using the same shared engine.

Verified by scripts/check-markup-numbering-browser.mjs: the five language outputs and their returns to Markdown retain section 2.3, subsection 2.3.1, figure 2.7, table 1, code 1 and the heading anchor. Adding a native section and figure in each target produces 2.4 and 2.8, including after return. Standalone exported HTML also renumbers live DOM insertions. Unit tests additionally cover insertion of tables and code listings, exclusions, empty and abbreviated labels, repeat rendering and declarations displayed as literal code. No failures remain in these checks.

Deliberate limits: decimal document-local counters, hierarchical headings and fixed caption prefixes only. Arbitrary TeX counter-format macros, automatic Roman/alphabetic formats, per-chapter object resets and multiple independently configured scopes inside one document are not translated. Existing equation/theorem counters are outside this change. HTML without script execution displays the current numbers but cannot recompute them. Cross-browser validation of the new autonomous HTML observer beyond Chromium has not been performed.

Native LaTeX code captions use `lstlisting` when the figure contains only an ordinary listing and a plain caption. Rich captions or additional figure content retain a figure container. The native `\counterwithout` declarations preserve document-local object counters in report documents. Mid-document counter resets and arbitrary counter programs are not covered by these conversions.

Validation also passed against the compiled converter, including the standalone HTML script. The 47 focused converter tests, 175 LaTeX tests, 79 AsciiDoc tests and 22 RST tests passed. SICP structure/navigation/numbering unit checks passed (28 tests). A previous full SICP run hit a timeout in Scheme example 110. Rechecked on 2026/11/23: the timeout policy is now shared with verification and test-file concurrency is limited to two; the complete 52-test suite passes. The unchanged example returns the exact five book results in the worker (18.71 s) and in tp-scheme (15.49 s). The SICP audit and execution-regression-verification.json document the correction and measured results.

On the compiled SICP book, browser checks passed for all 130 headings on 27 pages and all 95 figures, with original links and browser Back navigation. The four language documentation builds passed.

## Exercise and example counters

Updated on **2026/11/23**. `exerciseNumbering` and `exampleNumbering` are independent opt-in counters with `start`, `prefix`, `label`, `.unnumbered` exclusions and `data-number` overrides. Semantic targets carry `data-numbering="exercise"` or `data-numbering="example"`. Generated labels and computed question titles are removed before native serialization; rules remain in the pivot. Question summaries and local/global lists use computed labels even after asynchronous source loading.

Markdown uses YAML, AsciiDoc uses TP document attributes, RST uses TP numbering directives and LaTeX uses native newcounter/setcounter/renewcommand declarations. Target attributes use the parsers’ attributed inline syntax; interactive questions retain component syntax. There is no claim that these TP extensions work in unmodified upstream Markdown, Asciidoctor or Docutils.

Verified: 25 language pairs and their return conversions preserve exercise 2.7, example 1, exercise 2.8, rules and IDs (`scripts/check-exercise-numbering-browser.mjs`). The 20 numbering tests pass, including insertion, exclusions, explicit counter resumes and empty labels. AsciiDoc’s 81 tests pass, including new regressions for attributed inline content after entity escaping. The compiled SICP book verifies all 357 exercise numbers, asynchronous question summaries and global-list links. The book’s 29 focused checks pass.

Limits: the same decimal document-local model as other object counters; no inference from numbers in authored prose and no arbitrary counter programs. SICP keeps page-specific starts and chapter prefixes; IDs and source filenames are unchanged. Its examples intentionally remain unnumbered. The audio-table test reported during that check is now resolved; see Audio inside native tables below.

## Audio inside native tables

Updated on **2026/11/23**. The failing LaTeX audio test had an outdated expectation: its input used `<audio><source src="sound.wav" type="audio/wav"></audio>`, but it asserted an `src` attribute on `<audio>`. The renderer correctly preserves the child source and MIME type. The test now checks that structure, the absence of a promoted audio `src`, and the controls attribute. Direct `src` and multiple ordered sources have separate regression coverage. No parser change or source flattening is needed for this case.

The expanded conversion matrix exposed an additional export defect: an AsciiDoc table without an authored header could have its first row inferred as a header. The audio macro then remained literal text and broke a subsequent LaTeX conversion. The native table exporter now explicitly emits `options="noheader,..."` when the source table has no header, and retains `header` when one is present. The audio remains native `audio::` in AsciiDoc and `\sound` from `multimedia` in LaTeX; alternative-source metadata retains the source elements.

Verified: **62 focused unit tests pass**, including the corrected original test, three HTML/LaTeX audio round trips and the headerless AsciiDoc regression. `scripts/check-table-audio-browser.mjs` checks three fixtures (direct URL, one typed source, two ordered typed sources) across all 25 ordered pairs of HTML, tp-markdown, tp-asciidoc, tp-latex and tp-restructuredtext: **75 forward conversions and 75 returns pass**. Checks require exactly one table and audio element in a body cell, preserve source URLs, MIME types, source order, controls and loop, and reject RST system messages. LaTeX outputs use native multimedia commands, not an audio custom-element fallback. Results are recorded in `scripts/table-audio-browser-results.json`. Component build and TypeScript validation pass.

No failure remains in this audio-table matrix. These are semantic rendering checks in Chromium, including the real Docutils parser; they do not test playback, codec support, network availability of audio files, or Safari/Firefox media behavior.
