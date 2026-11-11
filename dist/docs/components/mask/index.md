<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="mask" library="components" size="1.25em"></tp-icon> Mask

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-mask>` element hides an anchored element and displays its own message in its place while active.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-textfield id="mask-answer" label="Answer" value="Thursday" clearable=""></tp-textfield>
<tp-mask anchor="#mask-answer" active="">The answer is hidden until the review.</tp-mask>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-mask" src="/docs/components/mask/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Set `anchor` to a CSS selector identifying one element in the same document, preferably a unique ID such as `#answer`. Put the replacement message inside the mask. Rich content and other components are supported.

`active` is a boolean attribute, absent by default. Add it to hide the target; remove it to reveal the target. In JavaScript, use `mask.active = true` or `mask.active = false`. Writing `active="false"` still activates the mask because the attribute is present.

The mask temporarily takes the target’s place in the document flow. Its height follows the message rather than reserving the target’s original height. The target is hidden with `display: none` and made inert and hidden from assistive technology. Focus inside it moves to the message on activation. Keep any control used to reveal the target outside that target.

Deactivation, changing the anchor or removing the mask restores the target’s previous display, inert and ARIA state. The target itself is not moved or recreated, preserving its input values and listeners. Its scripts and media are not paused automatically. This is a presentation control, not access control: the underlying content remains in the document.

An empty, invalid or missing selector displays nothing and changes no target. A target inserted later is detected automatically. A resolved target remains bound until it is removed, the anchor changes or the mask is deactivated. Self, ancestor and descendant targets are ignored to avoid hiding the mask itself. Multiple active masks keep their shared target hidden until the last one is released.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/mask/mask.js"></script>
  ```

import
: ```js
  import "/path/to/components/mask/mask.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/mask/mask.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the replacement message hiding the answer field. The target remains in the document with its value preserved.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> HTML
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_latex" library="languages" size="1.25em"></tp-icon> tp-latex
: ::include{examples/examples-latex.html}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
