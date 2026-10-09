# <tp-icon name="blank" library="components" size="1.25em"></tp-icon> Blank

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-blank>` element implements the blank functionality: displays a text, SVG or image answer in a focusable blank.

<tp-fill-blank-question closed>
  <dl>
    <dt>Title</dt><dd>Match the answers</dd>
    <dt>Prompt</dt><dd>Choose an answer for each blank.</dd>
    <dt>Answers</dt>
    <dd><ol>
      <li>Paris</li>
      <li><svg xmlns="http://www.w3.org/2000/svg" width="48" height="40" viewBox="0 0 48 40" role="img" aria-label="Triangle"><path d="M24 3 45 37H3Z" fill="none" stroke="currentColor" stroke-width="3"/></svg></li>
      <li><img src="/tp-components/docs/medias/logos/logo-tp.svg" alt="tp-components logo" width="40" height="40"></li>
    </ol></dd>
    <dt>Form</dt>
    <dd>
      <p>The capital of France: <tp-blank name="capital" aria-label="Capital of France"></tp-blank></p>
      <p>A shape with three sides: <tp-blank name="shape" aria-label="Three-sided shape"></tp-blank></p>
      <p>The library logo: <tp-blank name="logo" aria-label="Library logo"></tp-blank></p>
    </dd>
    <dt>Feedback</dt><dd>Match each answer to its description.</dd>
    <dt>Solution</dt><dd>Paris; the triangle; the tp-components logo.</dd>
  </dl>
</tp-fill-blank-question>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Answer destination | Displays an assigned answer; it is not a typing field. |
| Answer then blank | Select an answer and click the destination, or drag the answer onto it. |
| Clear | Release the assigned answer; unavailable when empty or disabled. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab | Focus a target blank. |
| Right Arrow | Move from the blank to the answer bank. |
| Up / Down | Choose an answer. |
| Enter / Space | Assign the chosen answer to the highlighted blank. |
| Escape | Cancel. |
| Delete / Backspace | Clear the focused blank. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

A dashed border distinguishes a closed-answer blank from editable fields. Its trailing controls show a clear button followed by `…`; they stay visible alongside assigned text, SVG or image content. Clearing a blank releases its answer in the bank. The clear button is disabled when the blank is empty or disabled.

The bottom border stays 2px thick: neutral when empty and brand-colored when filled. Set `--tp-blank-filled-border-color` to override the filled color, for example `var(--tp-success-stroke-mid)` or `var(--tp-danger-stroke-mid)` when grading answers. Clearing the blank restores its neutral border. The color change indicates that an answer is present; it does not grade the answer.

Use `tp-blank` for a closed-answer destination. Unlike `tp-textfield`, it does not allow free typing. Answer nodes are placed directly inside `tp-blank`, without a button wrapper: SVG formulas retain their natural rendering. The blank itself receives keyboard focus and uses shared design tokens for its outline.

In `tp-fill-blank-question closed`, write the correct answers in an `Answers` section containing an ordered list. The first item belongs to the first blank, and so on. No author-supplied identifier is required. The answer bank is shuffled, but each item's **one-based original rank** is retained as the rich blank's `value`. The display is cloned from the corresponding list item, so text, SVG formulas and images are supported without comparing their markup.

Use one answer per blank. Give SVGs an accessible name (`role="img"` and `aria-label`) and images an `alt`. Avoid scripts, interactive controls and duplicate document IDs in answer content. Visually identical items still have distinct ranks: do not use indistinguishable alternatives when rank determines correctness.

`tp-blank` and `tp-textfield` can coexist: rich blanks are evaluated by rank, text fields retain text comparison. This does not add symbolic mathematical equivalence or change `tp-mathfield` integration.

#### Programmatic use

```ts
const blank = document.querySelector('tp-blank');
if (blank) {
  blank.setAnswer('1', document.createTextNode('Paris'));
  // For SVG or images, pass an existing Node instead of a text node.
  blank.clear();
}
```

`setAnswer()` clones the supplied node and emits a bubbling `input` event. `clear()` empties the blank and emits the same event. Assigning `value` programmatically is silent; a previously assigned value restores its associated visual content. Unknown values display as plain text. `tp-fill-blank` includes the value under `name` in its `FormData` and clears the display on reset.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Assign text and image answers to the blanks in a closed question, then clear or replace them.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-markdown
: ::include{examples/examples.md}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API

<!-- tp-docgen:api TpBlank -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>aria-label</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the aria label. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables interaction. |
  | <code>name</code> | <code>string</code> | <code>&quot;&quot;</code> | Name used by tp-fill-blank form data. |
  | <code>placeholder</code> | <code>string</code> | <code>&quot;…&quot;</code> | Text displayed while the blank is empty. |
  [Attributes of `<tp-blank>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>clear</code> | <code>clear(): void</code> | Empties the blank and notifies its form. |
  | <code>setAnswer</code> | <code>setAnswer(value: string, content: Node): void</code> | Assigns an identity and clones its visual content without moving the source. |
  [Public methods of `TpBlank`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>input</code> | <code>void</code> | - Emitted when an answer is assigned or cleared. |
  [Events emitted by `<tp-blank>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-blank>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_blank_blank.TpBlank.html)
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
  <script type="module" src="/path/to/components/blank/blank.js"></script>
  ```

import
: ```js
  import "/path/to/components/blank/blank.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/blank/blank.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-blank>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
