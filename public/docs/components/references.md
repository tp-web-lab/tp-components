# References

::: tp-callout {variant="info"}
Reference components connect inline citations to hidden HTML definitions. Read entries in tooltips or gather them into lists anywhere in a document.
:::

| Component | Purpose |
| --- | --- |
| [tp-note](note/index.md) | Hidden notes, referenced with `^identifier`. |
| [tp-bibtex](bibtex/index.md) | BibTeX or CSL-JSON conversion to tp-biblio or standard LaTeX source. |
| [tp-biblio](biblio/index.md) | Hidden bibliography entries, referenced with `@identifier`. |
| [tp-glossary](glossary/index.md) | Hidden glossary entries, referenced with `%identifier`. |
| [tp-equanum](equanum/index.md) | Numbered equations, referenced with `=identifier` and previewed on hover or focus. |
| [tp-index](index/index.md) | Alphabetical index entries, referenced with `!identifier`; silent references mark occurrences without visible text. |
| [tp-ref](ref/index.md) | Inline references with HTML tooltips on hover or keyboard focus. |
| [tp-listof](listof/index.md) | Full reference entries or links to selected labelled elements, in document order. |

<!-- family-introduction:end -->

## Reference scope

`data-tp-reference-scope` defines a local boundary for reference lookup and generated lists. Place it on a container holding the definitions, their `tp-ref` citations and any associated `tp-listof`.

The attribute is presence-based: `data-tp-reference-scope` and `data-tp-reference-scope=""` are equivalent. Its value does not name or connect scopes; even `data-tp-reference-scope="false"` still creates a boundary. It adds no visual styling and may be placed on an existing container instead of an extra `div`.

### Resolution rules

The nearest matching element determines the scope, including the component itself if it carries the attribute:

- an element with `data-tp-reference-scope`;
- a rendered TP Markdown, AsciiDoc, LaTeX or reStructuredText output;
- an `article` or `main`.

These boundaries have equal priority: the closest one wins. If none exists, the scope is the document body. An iframe has its own document and therefore its own references.

A reference only resolves definitions belonging to that same scope. Nested scopes are independent: an inner reference does not search the outer scope, and an outer list does not collect entries from an inner scope. Keep a definition and its reference within the same boundary; an intervening `article` or rendered markup output creates a separate scope even inside an explicit container.

Use unique identifiers within each reference kind and scope. Independent scopes may reuse identifiers. Note numbering restarts in each scope; `tp-listof` collects only entries from its own scope. A missing target leaves its reference disabled. Duplicate definitions within one kind and scope resolve to the first matching definition.

This applies to notes (`^`), bibliography entries (`@`), glossary entries (`%`), index entries (`!`) and numbered equations (`=`). The attribute controls reference lookup; it does not isolate CSS or make duplicate HTML `id` attributes valid. IDs must still be unique within the document.

### Two independent examples

Both examples below define `detail`. Each citation displays `[1]`, opens its own note, and its list contains only that note. Edit either definition to compare the results.

<tp-html-viewer lite>
  <template>
    <div data-tp-reference-scope>
      <tp-note ref="detail">This note belongs to the first example.</tp-note>
      <p>First example <tp-ref href="^detail"></tp-ref>.</p>
      <tp-listof selector="tp-note"></tp-listof>
    </div>

    <div data-tp-reference-scope>
      <tp-note ref="detail">This note belongs to the second example.</tp-note>
      <p>Second example <tp-ref href="^detail"></tp-ref>.</p>
      <tp-listof selector="tp-note"></tp-listof>
    </div>
  </template>
</tp-html-viewer>

### Nested scopes

The parent defines `detail`, so its reference displays `[1]` and opens that note. The inner scope has no definition for `detail`: its reference displays `[?]` and remains disabled. Lookup stops at the inner boundary; it does not fall back to the parent. The inner list is also empty.

In the editor, uncomment the inner `tp-note` to provide a local definition. The inner reference then displays `[1]` and opens the inner note; the parent reference and list remain unchanged.

<tp-html-viewer lite>
  <template>
    <div data-tp-reference-scope>
      <h3>Parent scope</h3>
      <tp-note ref="detail">This definition belongs to the parent scope.</tp-note>
      <p>Parent reference: <tp-ref href="^detail"></tp-ref>.</p>
      <tp-listof selector="tp-note"></tp-listof>

      <div data-tp-reference-scope>
        <h4>Inner scope</h4>
        <!-- <tp-note ref="detail">This definition belongs to the inner scope.</tp-note> -->
        <p>Inner reference: <tp-ref href="^detail"></tp-ref>.</p>
        <tp-listof selector="tp-note"></tp-listof>
      </div>
    </div>
  </template>
</tp-html-viewer>

### When to add it

Use an explicit scope for independent examples, widgets or document sections that may reuse reference identifiers. It is optional when an existing `article`, `main` or rendered TP markup document already provides the intended boundary. For references shared across several sections, place them and their definitions in one common scope without intermediate boundaries.
