# <tp-icon name="question" library="components" size="1.25em"></tp-icon> Question

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-question>` element implements the <tp-icon name="question" library="components" size="1.25em"></tp-icon> Question functionality: semantic base container for question content.

<tp-question>
    <dl>
      <dt>Title</dt><dd>Reflection</dd>
      <dt>Prompt</dt><dd>Describe one benefit of web components.</dd>
    <dt>Form</dt><dd><tp-textfield multiline="" rows="3" placeholder="Type your answer..."></tp-textfield></dd>
      <dt>Feedback</dt><dd>Think about encapsulation and reuse.</dd>
      <dt>Solution</dt><dd>They package reusable behavior behind a custom element.</dd>
    </dl>
  </tp-question>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Question title | Expand or collapse the question. Questions start collapsed; answers are retained when collapsed. |
| Input button | Show or hide the answer form without losing answers. At least one panel stays visible. |
| Output button | Show or hide the output without losing feedback or the solution. Highlighted buttons indicate visible panels. |
| Submit | Check the completed answer form. |
| Feedback tab | Read feedback, or the message indicating that none is available. |
| Solution tab | Read the solution, available even before submission, or the message indicating that none is available. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space on the question title | Expand or collapse the question. |
| Enter / Space | Activate the focused button. |
| Arrow keys in Output tabs | Move between Feedback and Solution. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Structure the content as a definition list with `Title`, `Prompt`, `Form`, `Feedback`, and `Solution` entries. Specialized question components add validation.

Questions are collapsed by default. Add the boolean `open` attribute to expand them initially; its presence enables it, regardless of its value. This also applies to specialized question components inheriting from `tp-question`. Clicking the title synchronizes the attribute, and adding or removing it dynamically updates the disclosure without clearing answers.

The Output panel groups Feedback and Solution in a `tp-tabs` component. Feedback is initially selected; Solution is accessible immediately, without submitting an answer first. The author-friendly definition list is converted internally into accessible tabs and tab panels.

After submission, the generic question displays the author-provided Feedback content, preserving its formatting. The compact status beside the submit control still confirms the submission. Specialized questions can provide feedback specific to the submitted answer.

When no solution is provided, its panel displays “No solution is available for this question.” in a `tp-callout`, like the missing-feedback notice. Loading a solution replaces this notice.

```html
<tp-question>
  <dl>
    <dt>Title</dt><dd>Reflection</dd>
    <dt>Prompt</dt><dd>Describe one benefit of web components.</dd>
    <dt>Form</dt><dd><tp-textfield multiline rows="3" placeholder="Type your answer..."></tp-textfield></dd>
    <dt>Feedback</dt><dd>Think about encapsulation and reuse.</dd>
    <dt>Solution</dt><dd>They package reusable behavior behind a custom element.</dd>
  </dl>
</tp-question>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Write an answer, submit it and inspect the feedback and solution panels.

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
<!-- tp-docgen:api TpQuestion -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>open</code> | <code>boolean</code> | <code>false</code> | Expands the question; absent by default, leaving only its title visible. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of an external question definition. |
  [Attributes of `<tp-question>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpQuestion`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-question-submit</code> | <code>&#123; value: string &#125;</code> | - Fired when the submit icon button is activated.<br>`detail: { value: unknown }` |
  [Events emitted by `<tp-question>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-question>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_question.TpQuestion.html)
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
  <script type="module" src="/path/to/components/question/question.js"></script>
  ```

import
: ```js
  import "/path/to/components/question/question.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/question/question.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-question>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-badge
@summary Badge component for compact status labels.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->
<!--
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
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
@tp-dependency tp-markdown
@summary Markdown rendering component.
-->
<!--
@tp-dependency tp-switcher
@summary Switches between horizontal and vertical layouts based on available space.
-->
<!--
@tp-dependency tp-tabs
@summary Accessible tabs component with keyboard and reorder support.
-->

- [`<tp-badge>`](../badge/index.md) : Badge component for compact status labels.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-markdown>`](../markdown/index.md) : Markdown rendering component.
- [`<tp-switcher>`](../switcher/index.md) : Switches between horizontal and vertical layouts based on available space.
- [`<tp-tabs>`](../tabs/index.md) : Accessible tabs component with keyboard and reorder support.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
