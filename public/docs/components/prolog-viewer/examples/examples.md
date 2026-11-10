:::::: tp-markdown-viewer { label="tp-prolog-viewer" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-prolog-viewer { src="/docs/components/_shared/intro-projects/prolog.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/prolog-viewer/prolog-viewer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-prolog-viewer");
element1.setAttribute("src", "/docs/components/_shared/intro-projects/prolog.json");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="src"}
::: tp-prolog-viewer { src="/docs/components/prolog-viewer/examples/example.json" }
:::
```

``` example {label="script without filename"}
:::: tp-prolog-viewer
::: script { type="tp/prolog" }
parent(ada, byron).
parent(byron, charles).

grandparent(Grandparent, Grandchild) :-
  parent(Grandparent, Parent),
  parent(Parent, Grandchild).
:::
::::
```

``` example {label="scripts with filename"}
:::: tp-prolog-viewer
::: script { type="tp/prolog" filename="program.pl" }
parent(ada, byron).
parent(byron, charles).

grandparent(Grandparent, Grandchild) :-
  parent(Grandparent, Parent),
  parent(Parent, Grandchild).
:::

::: script { type="tp/prolog" filename="query.pl" }
grandparent(ada, Grandchild).
:::
::::
```

``` example {label="error"}
:::: tp-prolog-viewer
::: script { type="tp/prolog" filename="query.pl" }
unknown_predicate(X).
:::
::::
```

``` example {label="Single source file"}
::: tp-prolog-viewer { src="/docs/components/_shared/single-source/example.pl" }
:::
```
:::::
::::::
