<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="bibtex" library="components" size="1.25em"></tp-icon> BibTeX

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-bibtex>` element converts BibTeX or CSL-JSON entries into tp-biblio or standard LaTeX bibliography source code.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-bibtex src="/docs/components/bibtex/examples/books.bib"></tp-bibtex>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-bibtex" src="/docs/components/bibtex/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Input and output

Set `in="bibtex"` (default) or `in="clsjson"` for CSL-JSON records. Set `out="tp-biblio"` (default) or `out="latex"`. The component displays generated source in a readonly tp-code-editor; it does not insert bibliography entries into the document. All elements use Light DOM.

A nonempty `src` takes priority over an inline script. Relative URLs resolve against the containing document. BibTeX scripts use `type="tp/bibtex"` or `application/x-bibtex`; CSL-JSON scripts use `type="tp/clsjson"`, `application/vnd.citationstyles.csl+json` or `application/json`. The `in` attribute selects the parser; the filename does not override it. Updating src, in, out or the script updates the result.

### Retrieve the generated string

`getCode()` returns the latest generated source according to `out`, interpreted from the input according to `in`. Await `refresh()` when loading a remote source:

```javascript
import "/components/bibtex/bibtex.js";

const bibliography = document.createElement("tp-bibtex");
bibliography.in = "clsjson";
bibliography.out = "latex";
bibliography.src = "/docs/components/bibtex/examples/books.json";
document.body.append(bibliography);
await bibliography.refresh();
const code = bibliography.getCode();
console.log(code);
```

Listen for `tp-bibtex-load` to read `event.detail.code`, or `tp-bibtex-error` for the error message. Loading or errors clear stale output; getCode then returns an empty string. refresh reports failures through the error event and the visible message. An empty bibliography also produces an empty string.

### Render the LaTeX output

The generated bibliography can be passed directly to tp-latex. This example uses the output of the BibTeX books example, with a citation added before it:

<tp-latex-viewer lite src="/docs/components/bibtex/examples/bibliography.tex"></tp-latex-viewer>

The bibliography title and labelled entries use semantic HTML and shared TP styles. The print-width argument (99) does not impose a web width. The bibliography is visible; unlike tp-biblio definitions, it does not require tp-listof.

### Conversion rules and limits

Entries keep source order and citation keys. The default output contains one tp-biblio per entry, with ref, title and a paragraph. LaTeX output uses thebibliography, bibitem and emph, without a document wrapper or extra packages. The same output renders directly in tp-latex, including citation links. Paste the generated definitions into the destination document; tp-ref references use `@key` and LaTeX citations use `\cite{key}`.

BibTeX supports braced and quoted values, nested braces, numeric values, string macros declared before use, concatenation with #, month macros, comments and crossref inheritance. Duplicate keys/fields, missing macros, missing parents and cyclic crossrefs produce errors. Preambles are parsed but never executed. Common TeX text commands and accents become text in tp-biblio; other commands remain visible as text. Original TeX field commands are retained in LaTeX output.

CSL-JSON accepts an array of records or a single record with a unique id. Supported fields are author/editor names (including literal organization names), title, container-title, edition, volume, issue, page, publisher, publisher-place, issued, DOI, URL, ISBN, ISSN and note. Other CSL fields are not included. Fields are plain text, escaped for the target; embedded formatting is not interpreted.

This is a simple fixed-order bibliography, not a citation-style processor: no BST/CSL style files, locale-specific author formatting, bibliography sorting or automatic citation numbering are applied. The entry type does not select a different citation template.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/bibtex/bibtex.js"></script>
  ```

import
: ```js
  import "/path/to/components/bibtex/bibtex.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/bibtex/bibtex.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Load two BibTeX book entries and inspect their readable tp-biblio source code.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

BibTeX script
: Convert a BibTeX entry supplied by an inline script, without fetching a file.

LaTeX bibliography
: Load two BibTeX books and inspect their standard thebibliography and bibitem output.

CSL-JSON input
: Convert an inline CSL-JSON record into tp-biblio source.

CSL-JSON to LaTeX
: Load a CSL-JSON file and generate a standard LaTeX bibliography.
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
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-code-editor>`](#/components/code-editor/index.md) : CodeMirror-based code editor component.

### External

<!--
@credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
@summary LaTeX.js conversion and patched TikZJax assets.
-->

- [tp-latex](https://www.npmjs.com/package/@tp/tp-latex) : LaTeX.js conversion and patched TikZJax assets.
<!-- tp-docgen:dependencies:end -->
