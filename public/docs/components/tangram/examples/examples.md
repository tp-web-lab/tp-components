:::::: tp-markdown-viewer { label="tp-tangram" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-tangram
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/tangram/tangram.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-tangram");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Named vertices"}
:::: tp-tangram
::: script { type="tp/tangram" }
# Corners of a square of side 4
point A = (0, 0)
point B = (4, 0)
point C = (4, 4)
point D = (0, 4)

# Shared landmarks
point O = midpoint(A, C)
point E = midpoint(B, C)
point F = midpoint(C, D)
point G = midpoint(B, O)
point H = midpoint(O, C)
point I = midpoint(O, D)

# The seven pieces, described by their boundary vertices
triangle A B O
triangle A O D
triangle E C F
triangle B E G
triangle O H I
square O G E H
parallelogram D F H I
:::
::::
```

``` example {label="Exact orientation"}
::: tp-tangram { exact-orientation src="/docs/components/tangram/examples/convex-01.txt" }
:::
```

``` example {label="Convex 01"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-01.txt" }
:::
```

``` example {label="Convex 02"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-02.txt" }
:::
```

``` example {label="Convex 03"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-03.txt" }
:::
```

``` example {label="Convex 04"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-04.txt" }
:::
```

``` example {label="Convex 05"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-05.txt" }
:::
```

``` example {label="Convex 06"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-06.txt" }
:::
```

``` example {label="Convex 07"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-07.txt" }
:::
```

``` example {label="Convex 08"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-08.txt" }
:::
```

``` example {label="Convex 09"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-09.txt" }
:::
```

``` example {label="Convex 10"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-10.txt" }
:::
```

``` example {label="Convex 11"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-11.txt" }
:::
```

``` example {label="Convex 12"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-12.txt" }
:::
```

``` example {label="Convex 13"}
::: tp-tangram { src="/docs/components/tangram/examples/convex-13.txt" }
:::
```
:::::
::::::
