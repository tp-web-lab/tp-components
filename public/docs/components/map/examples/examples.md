::::: tp-markdown-viewer { label="tp-map" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-map { lat="48.3904" lon="-4.4861" zoom="13" title="Brest, Brittany, France" marker }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/map/map.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-map");
element1.setAttribute("lat", "48.3904");
element1.setAttribute("lon", "-4.4861");
element1.setAttribute("zoom", "13");
element1.setAttribute("title", "Brest, Brittany, France");
element1.setAttribute("marker", "");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Multiple markers"}
::: tp-map { title="Cities in Brittany" fit-markers }
Brest
:
  48.3904, -4.4861

Rennes
:
  48.1173, -1.6778
:::
```

``` example {label="GPX track"}
This illustrative Brest track has two separate recording segments. The gap is intentional; this synthetic route is not a navigation guide.

::: tp-map { title="Illustrative Brest track" src="/docs/components/map/examples/brest-track.gpx" fit-content }
Additional meeting point
:
  48.3920, -4.4840
:::
```

``` example {label="GPX route"}
This GPX file contains a recorded track in northeastern Ouessant with three recording segments. The profile plots elevation in metres against cumulative distance in kilometres, without joining recording gaps. The map does not provide navigation guidance.

::: tp-map { title="Northeastern Ouessant track" src="/docs/components/map/examples/ouessant-route.gpx" fit-content elevation-profile }
:::
```
::::
:::::
