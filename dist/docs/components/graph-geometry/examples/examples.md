::::::: tp-markdown-viewer { label="tp-graph-geometry" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-graph-geometry
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- built-in

- canvas-only

- grid

- readonly
:::

::: tp-radio-list { data-setting="src" label="src" label-position="top" orientation="horizontal" value="1" }
- Default

- file1

- file2

- file-unknown
:::

::: tp-cluster
:::

:::: tp-button-group
::: tp-button { id="attributes-reset" type="button" }
Reset defaults
:::

::: tp-button { id="attributes-reload" type="button" }
Reload preview
:::
::::
:::::

::: tp-divider
:::

### Preview

::: tp-iframe { id="attributes-frame" title="graph-geometry attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

::: script { type="module" src="/docs/components/graph-geometry/examples/attributes.js" }
:::
```

``` example {label="Attached points"}
:::: tp-graph-geometry
::: script { type="tp/geometry" }
point O = (0, 0)
point A = (6, 0)
circle c = circle(O, 5)
point P = on(c, angle=60deg)
line d = line(O, A)
point Q = on(d, t=0.5)
:::
::::
```

``` example {label="Arc only"}
:::: tp-graph-geometry
::: script { type="tp/geometry" }
point O = (0, 0)
circle c = circle(O, 5) hidden
arc a = arc(c, start=20deg, end=140deg)
:::
::::
```

``` example {label="From a file"}
::: tp-graph-geometry { src="/docs/components/graph-geometry/examples/circle.geometry" }
:::
```

``` example {label="Ruler primitives"}
:::: tp-graph-geometry { grid }
::: script { type="tp/geometry" }
point A = (-4, 0)
point B = (0, 3)
point O = (4, 0)
segment s = segment(A, B)
segment fixed = segment(A, B, length=3)
point E = on(fixed, t=1)
line d = line(B, O)
ray r = ray(A, O)
vector v = vector(O, B)
circle c = circle(O, 2)
circle through = circle(A, through=B) hidden
sector w = sector(c, start=20deg, end=100deg)
comment note = comment(E, "AE = 3 units")
:::
::::
```

``` example {label="Direct constructions"}
:::: tp-graph-geometry { built-in grid }
::: script { type="tp/geometry" }
point A = (-4, -2)
point B = (2, -2)
point O = (0, 1)
point P = (5, 4)
segment s = segment(A, B)
circle c = circle(O, 2)
point M = midpoint(s)
line m = perpendicularBisector(s)
line p = parallel(O, s)
line q = perpendicular(A, s)
line b = bisector(A, O, B)
line t0 = tangent(P, c, branch=0)
line t1 = tangent(P, c, branch=1)
comment note = comment(P, "Move P")
:::
::::
```

``` example {label="Styles and export"}
:::: tp-graph-geometry { grid }
::: script { type="tp/geometry" }
point O = (0, 0)
point A = (-3, -2)
point B = (3, 2)
segment s = segment(A, B) style=dashed color=blue
circle c = circle(O, 3) style=dotted color=red
vector v = vector(O, B) color=green
circle hiddenCircle = circle(A, 2) style=hidden color=violet
comment note = comment(A, "Select an object to style it") color=blue
:::
::::
```

``` example {label="Polygons"}
:::: tp-graph-geometry { built-in grid }
::: script { type="tp/geometry" }
point A = (-5, -2)
point B = (-2, -2)
point C = (-3, 0)
point D = (-5, 2)
point E = (1, -2)
point F = (4, -2)
polygon irregular = polygon(A, B, C, D) color=blue
polygon regular = regularPolygon(E, F, sides=5) color=green
:::
::::
```

``` example {label="Transformations"}
:::: tp-graph-geometry { built-in grid }
::: script { type="tp/geometry" }
point O = (0, 0)
point X = (0, 3)
point A = (1, -1)
point B = (2, -1)
point C = (1, 0)
point T = (3, 2)
line axis = line(O, X) style=dashed color=zinc
vector v = vector(O, T) color=zinc
polygon original = polygon(A, B, C) color=orange
polygon reflected = axialSymmetry(original, axis) color=blue
polygon opposite = centralSymmetry(original, O) color=violet
polygon enlarged = homothety(original, O, ratio=2) color=green
polygon turned = rotation(original, O, angle=90deg) color=red
polygon shifted = translation(original, v) color=teal
:::
::::
```

``` example {label="Transform in place"}
:::: tp-graph-geometry { built-in grid }
::: script { type="tp/geometry" }
point O = (0, 0)
point A = (3, 0)
circle c = circle(A, 1) color=blue
point Q = on(c, angle=30deg)
:::
::::
```

``` example {label="Measurements"}
:::: tp-graph-geometry { grid }
::: script { type="tp/geometry" }
point A = (-4, -1)
point B = (0, -1)
point C = (0, 2)
segment AB = segment(A, B) color=blue
segment BC = segment(B, C) color=green
polygon triangle = polygon(A, B, C) color=blue
point O = (4, 1)
circle c = circle(O, 2) color=orange
comment side = length(AB) color=blue
comment corner = angle(AB, BC) color=green
segment AC = segment(A, C) color=blue
comment slope = angle(AB, AC) color=blue
comment surface = area(c) color=orange
:::
::::
```

``` example {label="Interactive figure"}
::: tp-graph-geometry { canvas-only grid src="/docs/components/graph-geometry/examples/circle.geometry" }
:::
```
::::::
:::::::
