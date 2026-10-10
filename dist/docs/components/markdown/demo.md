---
extensions:
  - math
---
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
