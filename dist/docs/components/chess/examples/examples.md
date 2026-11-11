::::: tp-markdown-viewer { label="tp-chess" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-chess { position="8/8/3k4/8/3PK3/8/8/8" draggable-pieces }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/chess/chess.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-chess");
element1.setAttribute("position", "8/8/3k4/8/3PK3/8/8/8");
element1.setAttribute("draggable-pieces", "");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Black to move"}
::: tp-chess { fen="8/8/3k4/8/3PK3/8/8/8 b - - 0 1" orientation="black" draggable-pieces }
:::
```

``` example {label="Pawn promotion"}
::: tp-chess { fen="7k/P7/8/8/8/8/8/4K3 w - - 0 1" draggable-pieces }
:::
```

``` example {label="Rook endgame"}
::: tp-chess { fen="7k/8/5K2/8/8/8/8/R7 w - - 0 1" draggable-pieces }
:::
```
::::
:::::
