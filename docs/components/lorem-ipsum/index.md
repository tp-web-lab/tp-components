# <tp-icon name="lorem-ipsum" library="components" size="1.25em"></tp-icon> Lorem ipsum

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-lorem-ipsum>` element implements the Lorem ipsum functionality: generates placeholder sentences, titles, paragraphs or lists.

<tp-lorem-ipsum length="1" words-per-sentence="8" sentences-per-paragraph="2" seed="42"></tp-lorem-ipsum>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Generated text | Read, select or copy the placeholder text. There are no component-specific buttons or gestures. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Generated text | No component-specific keyboard shortcut or extra focus stop. |
| Ctrl+? | Open User Help for the component under the pointer, falling back to the focused component. Include Shift if needed to type ?. |

### Author directives

Choose `type="p"` (default) for paragraphs, `ul` or `ol` for lists, or `dl` for term/definition pairs. `sentence` and `title` produce inline text, not a paragraph or a heading element. A sentence ends with a period; a title capitalizes each word without final punctuation.

`length` controls the number of paragraphs or list entries and defaults to `3-5`. It is ignored for `sentence` and `title`, which produce one item. `words-per-sentence` defaults to `4-16` and also controls title length. `sentences-per-paragraph` defaults to `3-6` and applies only to paragraphs. Definition-list terms contain one to three words, followed by a sentence as their definition.

Counts accept a fixed integer or an inclusive range such as `2-4`; reversed bounds are accepted. Empty attributes use the published defaults. Other unparseable count strings resolve to one, following the Markdown extension. Zero paragraphs or list entries produce no entries. Requests whose maximum size exceeds 10,000 words or items show a warning instead of allocating excessive content.

`seed` is empty by default, so each generation draws fresh random values. Supply an integer, including zero, for repeatable output. Equal seeds and settings produce equal results across components and reloads. Changing a local attribute regenerates the content; changing presentation attributes such as `lang` does not. The public `regenerate()` method repeats generation without changing settings.

The dictionary and generation functions are copied from the `lorem-ipsum` extension of `@tp/tp-markdown`. The component does not invoke a Markdown parser: it generates the native HTML directly and reuses the library's paragraph and list styles. Tests compare seeded results with the extension for all six output types. Placeholder text is pseudo-Latin regardless of `lang`; replace it with meaningful content before publishing. Child content is replaced by the generated output.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read a generated paragraph with two eight-word sentences. The fixed seed makes the output repeatable in all four markup languages.

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

Set `type`, `length`, `wordsPerSentence`, `sentencesPerParagraph` or `seed` to update the content. Consecutive attribute changes are grouped into one render. Call `regenerate()` for an immediate refresh; with a fixed seed, the same output is reproduced.

### API

<!-- tp-docgen:api TpLoremIpsum -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>length</code> | <code>string</code> | <code>&quot;3-5&quot;</code> | Number or inclusive range of paragraphs or list entries; ignored for title and sentence. |
  | <code>seed</code> | <code>string</code> | <code>&quot;&quot;</code> | Integer seed for repeatable output; empty generates fresh random text. |
  | <code>sentences-per-paragraph</code> | <code>string</code> | <code>&quot;3-6&quot;</code> | Number or inclusive range of sentences per paragraph; applies only to p. |
  | <code>type</code> | <code>&quot;sentence&quot;\|&quot;title&quot;\|&quot;p&quot;\|&quot;dl&quot;\|&quot;ol&quot;\|&quot;ul&quot;</code> | <code>&quot;p&quot;</code> | Generated structure; title and sentence produce plain text. |
  | <code>words-per-sentence</code> | <code>string</code> | <code>&quot;4-16&quot;</code> | Number or inclusive range of words per sentence or title. |
  [Attributes of `<tp-lorem-ipsum>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>regenerate</code> | <code>regenerate(): void</code> | Generates new content; the same seed and parameters always reproduce the same output. |
  [Public methods of `TpLoremIpsum`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-lorem-ipsum>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-lorem-ipsum>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_lorem-ipsum.TpLoremIpsum.html)
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
  <script type="module" src="/path/to/components/lorem-ipsum/lorem-ipsum.js"></script>
  ```

import
: ```js
  import "/path/to/components/lorem-ipsum/lorem-ipsum.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/lorem-ipsum/lorem-ipsum.js";
  ```
:::



<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-lorem-ipsum>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
