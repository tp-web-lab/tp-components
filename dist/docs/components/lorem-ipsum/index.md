<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="lorem-ipsum" library="components" size="1.25em"></tp-icon> Lorem ipsum

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-lorem-ipsum>` element generates placeholder sentences, titles, paragraphs or lists.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-lorem-ipsum length="1" words-per-sentence="8" sentences-per-paragraph="2" seed="42"></tp-lorem-ipsum>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-lorem-ipsum" src="/docs/components/lorem-ipsum/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Choose `type="p"` (default) for paragraphs, `ul` or `ol` for lists, or `dl` for term/definition pairs. `sentence` and `title` produce inline text, not a paragraph or a heading element. A sentence ends with a period; a title capitalizes each word without final punctuation.

`length` controls the number of paragraphs or list entries and defaults to `3-5`. It is ignored for `sentence` and `title`, which produce one item. `words-per-sentence` defaults to `4-16` and also controls title length. `sentences-per-paragraph` defaults to `3-6` and applies only to paragraphs. Definition-list terms contain one to three words, followed by a sentence as their definition.

Counts accept a fixed integer or an inclusive range such as `2-4`; reversed bounds are accepted. Empty attributes use the published defaults. Other unparseable count strings resolve to one, following the Markdown extension. Zero paragraphs or list entries produce no entries. Requests whose maximum size exceeds 10,000 words or items show a warning instead of allocating excessive content.

`seed` is empty by default, so each generation draws fresh random values. Supply an integer, including zero, for repeatable output. Equal seeds and settings produce equal results across components and reloads. Changing a local attribute regenerates the content; changing presentation attributes such as `lang` does not. The public `regenerate()` method repeats generation without changing settings.

The dictionary and generation functions are copied from the `lorem-ipsum` extension of `@tp/tp-markdown`. The component does not invoke a Markdown parser: it generates the native HTML directly and reuses the library's paragraph and list styles. Tests compare seeded results with the extension for all six output types. Placeholder text is pseudo-Latin regardless of `lang`; replace it with meaningful content before publishing. Child content is replaced by the generated output.

### Programming notes

Set `type`, `length`, `wordsPerSentence`, `sentencesPerParagraph` or `seed` to update the content. Consecutive attribute changes are grouped into one render. Call `regenerate()` for an immediate refresh; with a fixed seed, the same output is reproduced.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read a generated paragraph with two eight-word sentences. The fixed seed makes the output repeatable in all four markup languages.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
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
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-callout>`](#/components/callout/index.md) : Callout component for highlighted contextual content.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
