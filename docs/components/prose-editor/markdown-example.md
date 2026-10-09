---
extensions:
  - math
  - yakazu
---
# From the `markdown-example.md` file

This example is based on the content of the `markdown-example.md` file.
The content is converted to HTML by `tp-markdown` and then inserted into `<tp-prose-editor>` as a Markdown block.

## Extension `math`

AsciiMath
: Inline equation: :asciimath:`x=(-b +- sqrt(b^2 – 4ac))/(2a)`
: Display equation: 
  ```asciimath
  sum_(i=1)^n i^3=((n(n+1))/2)^2
  ```

Latex
: Inline equation: :latexmath:`E = mc^2`
: Display equation:
  ```latexmath
  \begin{eqnarray}
  \hat{f}(\xi)&=&\frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}e^{-|x|}e^{-ix\xi}dx\\
  &=&\frac{1}{\sqrt{2\pi}}\int_{0}^{\infty}e^{-x-ix\xi}dx+\int_{-\infty}^0e^{x-ix\xi}dx\\
  &=&\frac{1}{\sqrt{2\pi}}\int_{0}^{\infty}(e^{-x-ix\xi}-e^{-x+ix\xi})dx\\
  &=&\frac{1}{\sqrt{2\pi}}[\frac{1}{-(1+i\xi)}(-1)-\frac{1}{-1+i\xi}(-1)]\\
  &=&\frac{1}{\sqrt{2\pi}}[\frac{1-i\xi}{1+\xi^2}+\frac{-(1+i\xi)}{1+\xi^2}]\\
  &=&\frac{1}{\sqrt{2\pi}}\frac{-2i\xi}{1+\xi^2}\\
  &=&-\sqrt{\frac{2}{\pi}}\frac{i\xi}{1+\xi^2}
  \end{eqnarray}
  ```

## Extension `yakazu`

``` yakazu
- 25431#9#4!
- 1#1524673
- #13!2#12#2
- 2#563274!1
- 12674385!#
- 34!21!5#1!2#
- #1#412563
- 2!31#2!#312
- 1#21#2431
```