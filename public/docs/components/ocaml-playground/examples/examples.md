::::: tp-markdown-viewer { label="tp-ocaml-playground" allow-script preserve-source }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-ocaml-playground { src="/docs/components/_shared/intro-projects/ocaml.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/ocaml/ocaml.js";
import "/components/ocaml-playground/ocaml-playground.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-ocaml-playground");
element1.setAttribute("src", "/docs/components/_shared/intro-projects/ocaml.json");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="OCaml tests"}
::: tp-ocaml-playground { src="/docs/components/ocaml-playground/examples/test-project.json" }
:::
```

``` example {label="Alcotest tests"}
::: tp-ocaml-playground { src="/docs/components/ocaml-playground/examples/framework-tests.json" }
:::
```
::::
:::::
