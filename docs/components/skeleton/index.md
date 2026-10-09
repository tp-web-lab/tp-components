# <tp-icon name="skeleton" library="components" size="1.25em"></tp-icon> Skeleton

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-skeleton>` element implements the Skeleton functionality: renders selected HTML elements as fixed shaded skeleton patterns without executing the source.

<tp-skeleton label="Article layout preview">
  <script type="tp/html">
    <main>
      <nav>Home · Articles · About</nav>
      <h1>Building accessible interfaces</h1>
      <p>An introduction to the article.</p>
      <figure><img src="portrait.jpg" alt="Portrait"><figcaption>Caption</figcaption></figure>
      <h2>Key ideas</h2>
      <ul><li>Clear structure</li><li>Consistent interactions</li></ul>
      <table><tr><th>Feature</th><th>Status</th></tr><tr><td>Keyboard</td><td>Ready</td></tr></table>
      <blockquote>A useful quotation.</blockquote>
    </main>
  </script>
</tp-skeleton>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | This is a static preview of a document's structure. Shaded patterns stand for headings, paragraphs, lists and other recognized elements. The preview has no mouse or keyboard controls, does not animate, and does not automatically replace itself with the original content. Screen readers announce the preview description rather than the decorative shapes. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Supply HTML in a `script` of type `tp/html` or `tp/skeleton`, through the `value` attribute, or through a `src` URL. The library's precedence is `src`, then nonempty `value`, then the preserved inline script. The script stores HTML as inert source data; it is not executable JavaScript. There is no need to declare rectangles, shapes or individual skeleton bars.

Only the following elements are recognized:

| Element | Fixed representation | Inspect descendants? |
| --- | --- | --- |
| `p` | Three text bars, the last one shorter | No |
| `ul`, `ol` | Three list rows, with round or square markers | No |
| `dl` | Two term-and-description pairs | No |
| `h1`–`h6` | One bar with a level-dependent height and width | No |
| `blockquote` | Three bars with a leading border | No |
| `figure` | An image area and a caption bar | No |
| `nav` | Three horizontal navigation bars | No |
| `table` | A fixed grid of four rows and three columns | No |
| `main` | A container for the recognized child patterns | Yes |
| `iframe` | A framed nested preview, or an image-area placeholder | Yes, when HTML is available |

The same tag always receives the same pattern, regardless of text length, item count, table dimensions, inline styles or classes. For example, neither list items nor table cells are traversed. Unrecognized elements are ignored **with their entire subtree**: a paragraph inside a `div` is therefore skipped; place recognized elements at the source root or inside `main`.

An iframe's `srcdoc` takes precedence over its `src`. For `src`, only HTTP(S) documents from the same origin as the preview page are fetched; relative URLs resolve against the containing HTML file. Cross-origin, missing, cyclic or unreadable frames keep a fixed placeholder. Nesting is limited to eight container levels. The HTML is parsed in an inert template: no author scripts run, no images load and no author custom elements are instantiated. An iframe is never mounted as a live browsing context.

Use `label` to describe the overall preview. Changing `src`, `value` or `label` updates it. Missing or empty HTML displays a heading-sized shaded rectangle with “No HTML source provided.” A failed source request displays the same rectangle with “Unable to load HTML.” and the error details. These messages remain readable and are exposed as status text to assistive technology. Obsolete requests are cancelled when the source changes or the component disconnects. The preview uses shared neutral theme colors.

When the source contains no representable elements, the rectangle says “No supported HTML content found.” This also covers development servers that return an unrelated fallback page instead of a missing-file error.

In Attributes, “Inline HTML” previews the introduction with navigation, a figure, a list, a table and a quotation. “Article HTML” is deliberately simpler: two headings and three paragraphs. “Reference HTML with iframe” shows lists and an embedded document. Changing only the text would not change the skeleton: the recognized element sequence determines its appearance.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the fixed shaded patterns generated from the article HTML. Text, images and nested list content are not rendered.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
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

<!-- tp-docgen:api TpSkeleton -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>label</code> | <code>string</code> | <code>&quot;Content layout preview&quot;</code> | Accessible description of the skeleton. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | HTML source URL, taking precedence over value and inline scripts. |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | HTML source string, taking precedence over an inline script. |
  [Attributes of `<tp-skeleton>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpSkeleton`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-skeleton>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-skeleton>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_skeleton.TpSkeleton.html)
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
  <script type="module" src="/path/to/components/skeleton/skeleton.js"></script>
  ```

import
: ```js
  import "/path/to/components/skeleton/skeleton.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/skeleton/skeleton.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-skeleton>` are loaded automatically by this component if they have not already been loaded by another component.

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
