# <tp-icon name="callout" library="components" size="1.25em"></tp-icon> Callout

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-callout>` element implements the <tp-icon name="callout" library="components" size="1.25em"></tp-icon> Callout functionality: highlighted contextual content block.

<tp-callout variant="info" heading="Information">
  The workshop starts at 9:00.
</tp-callout>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Message | Read the highlighted information. |
| Close, when shown | Dismiss the message. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Activate the Close button when available. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

To highlight a fragment of HTML, simply wrap it in the `<tp-callout>` element.

``` html
<p>Here is a paragraph.</p>

<tp-callout>
  <p>Here is a paragraph enclosed within the <code>tp-callout</code> element.</p>
</tp-callout>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the highlighted workshop notice and its heading.

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
<!-- tp-docgen:api TpCallout -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>closable</code> | <code>boolean</code> | <code>false</code> | Shows a close button. |
  | <code>heading</code> | <code>string</code> | <code>&quot;&quot;</code> | Optional heading displayed above the content. |
  | <code>icon</code> | <code>string</code> | <code>&quot;&quot;</code> | Optional icon displayed before the heading. |
  | <code>library</code> | <code>string</code> | <code>&quot;&quot;</code> | Optional icon library used by `icon`. |
  | <code>outlined</code> | <code>boolean</code> | <code>false</code> | Removes the filled background. |
  | <code>title</code> | <code>string</code> | <code>&quot;&quot;</code> | Native title text observed for authored callouts. |
  | <code>variant</code> | <code>TpVariantType</code> | <code>neutral</code> | Visual variant (`success`, `danger`, `warning`, `info`, `neutral`, or `brand`). |
  [Attributes of `<tp-callout>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>toast</code> | <code>toast(delay = 3000): void</code> | Displays the callout as a toast. |
  [Public methods of `TpCallout`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-callout>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-callout-accent</code> | <code>var(&#45;&#45;tp-brand-text-colorful)</code> | Accent color. Default: `var(--tp-neutral-text-colorful)`. |
  | <code>&#45;&#45;tp-callout-background</code> | <code>transparent</code> | Background color. Default: `var(--tp-neutral-fill-softer)`. |
  | <code>&#45;&#45;tp-callout-border-color</code> | <code>var(&#45;&#45;tp-brand-stroke-soft)</code> | Border color. Default: `var(--tp-neutral-stroke-soft)`. |
  | <code>&#45;&#45;tp-callout-border-width</code> | <code>4px</code> | Leading border width. Default: `4px`. |
  | <code>&#45;&#45;tp-callout-foreground</code> | <code>var(&#45;&#45;tp-brand-text-on-soft)</code> | Text color. Default: `var(--tp-text-body)`. |
  | <code>&#45;&#45;tp-callout-heading-font-size</code> | <code>1rem</code> | Heading font size. Default: `1rem`. |
  | <code>&#45;&#45;tp-callout-heading-gap</code> | <code>0.625rem</code> | Gap below the heading. Default: `0.625rem`. |
  | <code>&#45;&#45;tp-callout-padding-block</code> | <code>0.875rem</code> | Block padding. Default: `0.875rem`. |
  | <code>&#45;&#45;tp-callout-padding-inline</code> | <code>1rem</code> | Inline padding. Default: `1rem`. |
  | <code>&#45;&#45;tp-callout-radius</code> | <code>0.75rem</code> | Border radius. Default: `0.75rem`. |
  [CSS properties of `<tp-callout>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_callout.TpCallout.html)
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
  <script type="module" src="/path/to/components/callout/callout.js"></script>
  ```

import
: ```js
  import "/path/to/components/callout/callout.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/callout/callout.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-callout>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
