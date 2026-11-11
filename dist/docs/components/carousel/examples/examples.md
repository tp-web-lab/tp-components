::::: tp-markdown-viewer { label="tp-carousel" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-carousel { aria-label="Outdoor activities" height="18rem" }
![Canoe](/docs/medias/images/canoe.svg)

![Basketball](/docs/medias/images/basketball.svg)

![Walking shoe](/docs/medias/images/walking-shoe.svg)
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/carousel/carousel.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-carousel");
element1.setAttribute("aria-label", "Outdoor activities");
element1.setAttribute("height", "18rem");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("img");
element2.setAttribute("src", "/docs/medias/images/canoe.svg");
element2.setAttribute("alt", "Canoe");
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element3 = document.createElement("img");
element3.setAttribute("src", "/docs/medias/images/basketball.svg");
element3.setAttribute("alt", "Basketball");
element1.append(element3);
element1.append(document.createTextNode("\n  "));

const element4 = document.createElement("img");
element4.setAttribute("src", "/docs/medias/images/walking-shoe.svg");
element4.setAttribute("alt", "Walking shoe");
element1.append(element4);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Vertical navigation"}
::: tp-carousel { orientation="vertical" aria-label="Outdoor activities" height="18rem" }
![Canoe](/docs/medias/images/canoe.svg)

![Basketball](/docs/medias/images/basketball.svg)

![Walking shoe](/docs/medias/images/walking-shoe.svg)
:::
```

``` example {label="Looping navigation"}
::: tp-carousel { loop index="2" aria-label="Outdoor activities" height="18rem" }
![Canoe](/docs/medias/images/canoe.svg)

![Basketball](/docs/medias/images/basketball.svg)

![Walking shoe](/docs/medias/images/walking-shoe.svg)
:::
```
::::
:::::
