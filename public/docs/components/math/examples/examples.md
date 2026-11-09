:::::: tp-markdown-viewer { label="tp-math" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
The identity :tp-math:`…`{value="a^2 + b^2 = c^2" label="a squared plus b squared equals c squared"} describes a right triangle.
```

``` example {label="Script and display style"}
:::: tp-math
::: script { type="tp/math" }
\frac{1}{2\sqrt{x}}
:::
::::

:::: tp-math { displaystyle }
::: script { type="tp/math" }
\frac{1}{2\sqrt{x}}
:::
::::
```

``` example {label="AsciiMath"}
An inline expression: :tp-math:`…`{mode="asciimath" value="1/(2sqrt(x))" label="One divided by twice the square root of x"}.

::: tp-math { mode="asciimath" value="1/(2sqrt(x))" displaystyle label="One divided by twice the square root of x" }
:::
```

``` example {label="External expression"}
::: tp-math { src="/docs/components/math/examples/identity.txt" displaystyle }
:::
```
:::::
::::::
