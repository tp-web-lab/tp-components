# Reference

The custom `<tp-ref>` element displays an inline reference with the corresponding HTML content in a tooltip.

<div data-tp-reference-scope="">
  <p>A useful detail <tp-ref href="^detail"></tp-ref>.</p>
  <tp-note ref="detail" title="Detail"><p>A note with <strong>formatted content</strong>.</p></tp-note>
</div>

## Usage

The `href` begins with `^` for a note, `@` for a bibliography entry, or `%` for a glossary entry, followed by the exact `ref` identifier. Identifiers may contain punctuation and are not interpreted as CSS selectors. Ordinary URLs are not supported.

Reference labels are generated from their kind: `^identifier` displays a superscript `[n]`, `@bib` displays `[bib]`, and `%entry` displays `entry` with a dotted underline. Authored child text does not override this format. Each distinct note receives a number at its first citation in the current document scope; later citations of the same note reuse it. Adding, moving, changing or removing citations updates both the numbers and the note lists. Missing entries display a disabled reference until a matching definition becomes available. Definitions can be placed before or after references. Their content is shown on hover, focus or activation, and Escape dismisses the tooltip. Keep interactive controls in a generated list rather than in a tooltip.

References and lists use the nearest `data-tp-reference-scope`, rendered markup document, `article` or `main`, falling back to the page body. Nested document scopes are independent. Identifiers should be unique within each reference kind and scope; the first matching definition is used for duplicates. Changes to definitions, labels and selected elements update existing tooltips and lists automatically.

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reference | Hover or click to read its content in a tooltip. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Focus a reference and show its tooltip. |
| Enter / Space | Show the focused reference tooltip. |
| Escape | Close the tooltip. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Hover or focus the reference to reveal a formatted note; press Escape to dismiss it.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Notes, bibliography and glossary
: Compare repeated note citations sharing one superscript number, bibliography citations and dotted glossary terms. Read the numbered notes and alphabetically sorted description lists at the end.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
html
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpRef -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>href</code> | <code>string</code> | <code>&quot;&quot;</code> | Prefixed identifier selecting a note, bibliography or glossary entry. |
  [Attributes of `<tp-ref>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpRef`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-ref>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-ref>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_ref_ref.TpRef.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-ref>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-biblio
@summary Defines a bibliography entry referenced by tp-ref.
-->
<!--
@tp-dependency tp-glossary
@summary Defines a glossary entry referenced by tp-ref.
-->
<!--
@tp-dependency tp-note
@summary Defines an HTML note referenced by tp-ref.
-->
<!--
@tp-dependency tp-tooltip
@summary Displays anchored tooltip content.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-biblio>`](../biblio/index.md) : Defines a bibliography entry referenced by tp-ref.
- [`<tp-glossary>`](../glossary/index.md) : Defines a glossary entry referenced by tp-ref.
- [`<tp-note>`](../note/index.md) : Defines an HTML note referenced by tp-ref.
- [`<tp-tooltip>`](../tooltip/index.md) : Displays anchored tooltip content.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
