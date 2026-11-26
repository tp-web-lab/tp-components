:::::: tp-markdown-viewer { label="tp-javascript" allow-script preserve-source }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-javascript { query="square(7)" }
::: script { type="tp/javascript" }
function square(x) {
  return x * x;
}
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/javascript/javascript.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-javascript");
element1.setAttribute("query", "square(7)");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/javascript");
element2.textContent = "\n    function square(x) {\n      return x * x;\n    }\n  ";
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Persistent session"}
:::: tp-javascript { query="++count" }
::: script { type="tp/javascript" }
let count = 0;
:::
::::
```

``` example {label="Promises and console"}
:::: tp-javascript { query="await answer()" }
::: script { type="tp/javascript" }
async function answer() {
  console.log("Computing the answer");
  return Promise.resolve(42);
}
:::
::::
```

``` example {label="External JavaScript file"}
::: tp-javascript { src="/docs/components/javascript/examples/squares.js" query="square(9)" }
:::
```

``` example {label="DOM elements and click events"}
::: script { type="module" }
import "/components/button/button.js";
import "/components/javascript/javascript.js";
:::

:::: tp-javascript { query="setupDom()" }
::: script { type="tp/javascript" filename="dom-demo.js" }
function setupDom() {
  const host = parent.document.getElementById("javascript-dom-demo");
  const button = parent.document.createElement("tp-button");
  button.textContent = "Click me";
  const message = parent.document.createElement("p");
  message.textContent = "Waiting for a click.";
  let clicks = 0;
  button.addEventListener("click", () => {
    clicks += 1;
    message.textContent = `JavaScript handled ${clicks} click(s).`;
    console.log("Clicks:", clicks);
  });
  host.replaceChildren(button, message);
  return "Button ready";
}
:::
::::

::: div { id="javascript-dom-demo" aria-live="polite" }
:::
```

``` example {label="Errors and recovery"}
:::: tp-javascript { query="divide(12, 0)" }
::: script { type="tp/javascript" filename="errors.js" }
function divide(numerator, denominator) {
  if (denominator === 0) {
    throw new Error("The denominator must not be zero.");
  }
  return numerator / denominator;
}
:::
::::
```

``` example {label="Presentation modes and automatic reload"}
Each interpreter has its own session. Default and lite show the normal controls; simple opens the editor and hides the header and welcome information. Its query buttons are hidden.

In default and lite, open Edit source. Run the prefilled query to obtain 10. Change 10 to 20 in the source, then click Run or press Return in the query field. In simple, use Return in the query field. Shift+Return works too.

The result becomes 20 and “\> Program reloaded.” appears before the query. Run again without editing: the result remains 20, with no new reload message. Merely editing the source does not execute it.

### Default

:::: tp-javascript { mode="default" query="answer()" }
::: script { type="tp/javascript" filename="answer.js" }
function answer() {
  return 10;
}
:::
::::

### Lite

:::: tp-javascript { mode="lite" query="answer()" }
::: script { type="tp/javascript" filename="answer.js" }
function answer() {
  return 10;
}
:::
::::

### Simple

:::: tp-javascript { mode="simple" query="answer()" }
::: script { type="tp/javascript" filename="answer.js" }
function answer() {
  return 10;
}
:::
::::
```

``` example {label="Execution trace drawer"}
:::: tp-javascript { tracer filename="factorial.js" query="console.log(factorial(5))" }
::: script { type="tp/javascript" }
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}
:::
::::
```
:::::
::::::
