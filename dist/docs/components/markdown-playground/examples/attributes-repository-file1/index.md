---
extensions:
  - math
math: asciimath
mathjax:
  tex:
    packages:
      - html
      - mhchem
      - texhtml
    allowTexHTML: true
---

# Markdown math

[[toc]]

## Introduction

This example demonstrates mathematical rendering in Markdown using the
`math` extension.

Both LaTeX and AsciiMath syntaxes are supported.

---

## Inline LaTeX

Einstein's famous equation:

:latexmath:`E = mc^2`

The quadratic formula:

:latexmath:`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`

Pythagorean theorem:

:latexmath:`a^2 + b^2 = c^2`

---

## Display LaTeX

::: latexmath
\int_0^1 x^2 \, dx = \frac{1}{3}
:::

::: latexmath
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
:::

::: latexmath
f(x)=\frac{1}{\sqrt{2\pi\sigma^2}}
e^{-\frac{(x-\mu)^2}{2\sigma^2}}
:::

---

## Matrices

::: latexmath
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
:::

::: latexmath
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
:::

---

## Greek letters

:latexmath:`\alpha + \beta + \gamma`

:latexmath:`\Delta x`

:latexmath:`\Omega`

---

## Fractions and roots

:latexmath:`\frac{a}{b}`

:latexmath:`\sqrt{2}`

:latexmath:`\sqrt[n]{x}`

---

## Inline AsciiMath

Simple equation:

:asciimath:`x^2 + y^2 = z^2`

Summation:

:asciimath:`sum_(i=1)^n i = (n(n+1))/2`

Integral:

:asciimath:`int_0^1 x^2 dx = 1/3`

---

## Display AsciiMath

:::asciimath
f(x) = x^2 + 2x + 1
:::

:::asciimath
sqrt(x^2 + y^2)
:::

:::asciimath
lim_(x->oo) 1/x = 0
:::

---

## Mixed examples

LaTeX:

::: latexmath
\forall x \in \mathbb{R},
\quad x^2 \ge 0
:::

AsciiMath:

:::asciimath
AA x in RR, x^2 >= 0
:::

---

## Physics formulas

Kinetic energy:

:latexmath:`E_k = \frac{1}{2}mv^2`

Wave equation:

::: latexmath
\lambda = \frac{v}{f}
:::

Ohm's law:

:latexmath::asciimath:`V = RI`

---

## Chemistry formulas

::: latexmath
\mathrm{H_2O}
:::

::: latexmath
\mathrm{CO_2}
:::

::: latexmath
\mathrm{NaCl}
:::

## Generic

### Inline
<!-- Here, `math` is defined in the `math: asciimath` header -->
Inline generic: :math:`sum_(i=1)^n i = (n(n+1))/2`

Inline explicite: :asciimath:`sum_(i=1)^n i = (n(n+1))/2`

Inline explicite: :latexmath:`\displaystyle\sum_{i=1}^{n} i = \frac{n(n+1)}{2}`

### Block
<!-- Here, `math` is defined in the `math: asciimath` header -->
Block generic: 

::: math
sum_(i=1)^n i = (n(n+1))/2
:::

Block explicite: 

::: asciimath
sum_(i=1)^n i = (n(n+1))/2
::: 

Block explicite: 

::: latexmath
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
:::

## Extensions LaTeX

Chemistry: :latexmath:`\ce{H2O + CO2}`

HTML link: :latexmath:`\href{https://fr.wikipedia.org/wiki/Th%C3%A9or%C3%A8me_de_Pythagore}{a^2+b^2=c^2}`

HTML in TeX: :latexmath:`{\mathrm when\ } x=3, x^2 + 3x + 1 =
<tex-html><input type="text" id="answer" size="5"/></tex-html>.`

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

<!--
@summary This component has no tp-components dependencies.
-->
No internal dependency

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
