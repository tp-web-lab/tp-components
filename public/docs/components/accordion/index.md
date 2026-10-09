# <tp-icon name="accordion" library="components" size="1.25em"></tp-icon> Accordion

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-accordion>` element implements the <tp-icon name="accordion" library="components" size="1.25em"></tp-icon> Accordion functionality: collapsible multi-panels element.

<tp-accordion open-indexes="1">
  <dl>
    <dt>What is HTML?</dt><dd>The language used to structure web pages.</dd>
    <dt>What is CSS?</dt><dd>The language used to style web pages.</dd>
    <dt>What is Javascript?</dt><dd>The language used to define the behaviour of web pages.</dd>
  </dl>
</tp-accordion>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Section heading | Click to expand or collapse its content. Opening a section may close the previous section. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Focus a section heading. |
| ArrowDown | Moves focus to the next header. |
| ArrowUp | Moves focus to the previous header. |
| Home | Moves focus to the first header. |
| End | Moves focus to the last header. |
| Enter / Space | Expands or collapses the focused section. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `multiple` to keep several sections open and `open-indexes` with space-separated, zero-based indexes to choose the initially open sections. Use `appearance="default"` for items separated by horizontal rules, `appearance="outlined"` for framed items, or `appearance="filled"` for framed items filled with the brand color.

```html
<tp-accordion appearance="filled" open-indexes="1">
  <dl>
    <dt>What is HTML?</dt><dd>The language used to structure web pages.</dd>
    <dt>What is CSS?</dt><dd>The language used to style web pages.</dd>
    <dt>What is Javascript?</dt><dd>The language used to define the behaviour of web pages.</dd>
  </dl>
</tp-accordion>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Expand and collapse the questions to reveal their answers.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpAccordion -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>appearance</code> | <code>TpAccordionAppearance</code> | <code>&quot;default&quot;</code> | Visual treatment of accordion items. |
  | <code>multiple</code> | <code>boolean</code> | <code>false</code> | Allows several sections to remain open simultaneously. |
  | <code>open-indexes</code> | <code>string</code> | <code>&quot;&quot;</code> | Space-separated, zero-based indexes of the open sections. |
  [Attributes of `<tp-accordion>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>close</code> | <code>close(index: number): void</code> | Closes a section by index. |
  | <code>open</code> | <code>open(index: number): void</code> | Opens a section by index.<br><br>In single mode, this replaces the current open section. |
  | <code>toggle</code> | <code>toggle(index: number): void</code> | Toggles open/closed state for a section by index. |
  [Public methods of `TpAccordion`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-accordion>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-accordion-content-gap</code> | <code>0</code> | Gap between an accordion heading and its content. |
  | <code>&#45;&#45;tp-accordion-item-gap</code> | <code>0</code> | Gap between consecutive accordion items. |
  [CSS properties of `<tp-accordion>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_accordion.TpAccordion.html)
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
  <script type="module" src="/path/to/components/accordion/accordion.js"></script>
  ```

import
: ```js
  import "/path/to/components/accordion/accordion.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/accordion/accordion.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-accordion>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
