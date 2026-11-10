<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="ref" library="components" size="1.25em"></tp-icon> Reference

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-ref>` element displays an inline reference with the corresponding HTML content in a tooltip.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<div data-tp-reference-scope="">
  <p>A useful detail <tp-ref href="^detail"></tp-ref>.</p>
  <tp-note ref="detail" title="Detail"><p>A note with <strong>formatted content</strong>.</p></tp-note>
</div>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-ref" src="/docs/components/ref/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

The `href` begins with `^` for a note, `@` for a bibliography entry, or `%` for a glossary entry, followed by the exact `ref` identifier. Identifiers may contain punctuation and are not interpreted as CSS selectors. Ordinary URLs are not supported.

Reference labels are generated from their kind: `^identifier` displays a superscript `[n]`, `@bib` displays `[bib]`, and `%entry` displays `entry` with a dotted underline. Authored child text does not override this format. Each distinct note receives a number at its first citation in the current document scope; later citations of the same note reuse it. Adding, moving, changing or removing citations updates both the numbers and the note lists. Missing entries display a disabled reference until a matching definition becomes available. Definitions can be placed before or after references. Their content is shown on hover, focus or activation, and Escape dismisses the tooltip. Keep interactive controls in a generated list rather than in a tooltip.

References and lists use the nearest `data-tp-reference-scope`, rendered markup document, `article` or `main`, falling back to the page body. Nested document scopes are independent. Identifiers should be unique within each reference kind and scope; the first matching definition is used for duplicates. Changes to definitions, labels and selected elements update existing tooltips and lists automatically.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/ref/ref.js"></script>
  ```

import
: ```js
  import "/path/to/components/ref/ref.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/ref/ref.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Hover or focus the reference to reveal a formatted note; press Escape to dismiss it.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Notes, bibliography and glossary
: Compare repeated note citations sharing one superscript number, bibliography citations and dotted glossary terms. Read the numbered notes and alphabetically sorted description lists at the end.
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
@tp-dependency tp-biblio
@summary Component `<tp-biblio>`.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-glossary
@summary Component `<tp-glossary>`.
-->
<!--
@tp-dependency tp-note
@summary Component `<tp-note>`.
-->
<!--
@tp-dependency tp-tooltip
@summary Tooltip component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-biblio>`](#/components/biblio/index.md) : Component `<tp-biblio>`.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-glossary>`](#/components/glossary/index.md) : Component `<tp-glossary>`.
- [`<tp-note>`](#/components/note/index.md) : Component `<tp-note>`.
- [`<tp-tooltip>`](#/components/tooltip/index.md) : Tooltip component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
