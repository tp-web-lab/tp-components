<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="calculator" library="components" size="1.25em"></tp-icon> Calculator

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-calculator>` element provides a scientific calculator with an editable expression and degree/radian modes.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-calculator></tp-calculator>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-calculator" src="/docs/components/calculator/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use the icon button at the top right to switch orientation without clearing the calculation or changing Deg/Rad. The button updates the `orientation` attribute, and its icon and accessible label indicate the next orientation.

The calculator starts in degree mode. Use Deg/Rad to switch the angle unit for sin, cos and tan. Hyperbolic functions always use their numeric argument directly. Horizontal orientation places scientific and numeric keys side by side when space permits; vertical orientation stacks them. Narrow horizontal panels also stack automatically.

### Expressions and functions

Use parentheses and explicit multiplication (`2*pi`, not `2pi`). Powers are right-associative: `2^3^2` means `2^(3^2)`. Unary minus follows powers: `-2^2` is `-4`. Decimal numbers use a dot; the comma separates function arguments. Scientific notation such as `1e-3` is accepted.

| Key or expression | Meaning |
| --- | --- |
| `+`, `-`, `*`, `/`, `(`, `)`, `=` | Arithmetic, grouping and evaluation. |
| `%` | Divide by 100: `200*15%` is 30; `200+15%` is 200.15. |
| x², xⁿ | Square or raise to a chosen power. |
| eˣ, 10ⁿ, 1/x | Exponential, power of ten and reciprocal. |
| √x, `sqrt(x)` | Square root. |
| ʸ√x, `sqrt(x,y)` | The y-th root of x. For example, `sqrt(27,3)` is 3. |
| ln, log | Natural and base-ten logarithms. |
| n!, `fact(n)` | Factorial of an integer from 0 to 170. |
| sin, cos, tan | Trigonometric functions in the selected angle unit. |
| sinh, cosh, tanh | Hyperbolic functions. |
| e, π | Euler's number and pi. |
| Rand, `rand()` | A random number greater than or equal to 0 and less than 1. |

A function key wraps the selected text, or the whole expression when no text is selected. With an empty field it inserts a function with the caret inside its parentheses. For ʸ√x, enter x first, press the key, then enter the root degree. After a result, an operator continues the calculation; a digit or constant begins a new expression. AC clears the expression and messages without changing Deg/Rad.

Results use JavaScript floating-point arithmetic. Undefined real results, division by zero and overflow produce a message while preserving the expression for correction.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/calculator/calculator.js"></script>
  ```

import
: ```js
  import "/path/to/components/calculator/calculator.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/calculator/calculator.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Enter 2+3*4 and evaluate it, then try sin(30) in degree mode. Use the scientific keys to transform a selected expression.

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
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-textfield>`](#/components/textfield/index.md) : Single-line and automatically growing multiline text field.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
