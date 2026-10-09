# <tp-icon name="calculator" library="components" size="1.25em"></tp-icon> Calculator

<tp-toc position="end" expand-all open brand></tp-toc>

Calculate arithmetic and scientific expressions using the keypad or an editable expression field.

<tp-calculator></tp-calculator>

## Usage

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

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Orientation icon, top right | Switch between horizontal and vertical layouts. |
| Expression field | Edit the expression or select a part to transform. |
| Digits, dot, comma, parentheses and operators | Insert at the caret or replace the selection. |
| Scientific function | Wrap the selection or expression in the chosen function. |
| e / π / Rand | Insert a constant or a random number. |
| Deg / Rad | Toggle the trigonometric angle unit. |
| = | Evaluate and display the result, or explain an error. |
| AC | Clear the expression and result message. |
| ⌫ | Delete the selection or character before the caret. |
| ± | Negate the selection or expression. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the expression and keypad buttons. |
| Enter / = in the expression | Evaluate the expression. |
| Escape in the expression | Clear the expression and message. |
| Arrow keys, Backspace, Delete in the expression | Move the caret or edit text normally. |
| Enter / Space on a button | Activate that key. |
| Ctrl+? | Open User help for the component under the pointer, falling back to the focused component. Shift may be needed to type ?. |

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Enter 2+3*4 and evaluate it, then try sin(30) in degree mode. Use the scientific keys to transform a selected expression.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
html
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## API

<!-- tp-docgen:api TpCalculator -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>orientation</code> | <code>&quot;horizontal&quot; \| &quot;vertical&quot;</code> | <code>&quot;horizontal&quot;</code> | Arrangement of the scientific and numeric keypads. |
  [Attributes of `<tp-calculator>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpCalculator`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-calculator-result</code> | <code>&#123; expression: string; result: number &#125;</code> | Emitted after a successful calculation. |
  [Events emitted by `<tp-calculator>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-calculator>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_calculator.TpCalculator.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-calculator>` are loaded automatically by this component if they have not already been loaded by another component.

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

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-textfield>`](../textfield/index.md) : Single-line and automatically growing multiline text field.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
