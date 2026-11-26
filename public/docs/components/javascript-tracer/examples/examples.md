::::: tp-markdown-viewer { label="tp-javascript-tracer" allow-script preserve-source }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-javascript-tracer { src="/docs/components/javascript-tracer/examples/nested-arrays.js" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/javascript/javascript.js";
import "/components/javascript-tracer/javascript-tracer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-javascript-tracer");
element1.setAttribute("src", "/docs/components/javascript-tracer/examples/nested-arrays.js");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Subexpressions on one line"}
::: tp-javascript-tracer { src="/docs/components/javascript-tracer/examples/same-line.js" }
:::
```

``` example {label="Recursion"}
Record factorial(5), inspect the five call frames and follow return values up to 120.

::: tp-javascript-tracer { src="/docs/components/javascript-tracer/examples/recursion.js" }
:::
```

``` example {label="Independent closures"}
Follow count in the two captured makeCounter environments. The first counter returns 1 then 2; the second returns 1.

::: tp-javascript-tracer { src="/docs/components/javascript-tracer/examples/closures.js" }
:::
```

``` example {label="Class and shared instance"}
Follow this.value from 3 to 4 and check that counter and alias point to the same instance. The output is 4, 4, true.

::: tp-javascript-tracer { src="/docs/components/javascript-tracer/examples/classes.js" }
:::
```

``` example {label="Inheritance and super"}
Follow StepCounter extending Counter, the super(value) constructor call and the overridden increment method calling super.increment(). Inspect the same instance through both classes; the output is 5, 7, true.

::: tp-javascript-tracer { src="/docs/components/javascript-tracer/examples/inheritance.js" }
:::
```

``` example {label="Caught exception"}
Follow the exception from divide into catch, then continue through finally. The error event uses the danger color and execution continues.

::: tp-javascript-tracer { src="/docs/components/javascript-tracer/examples/caught-exception.js" }
:::
```

``` example {label="Uncaught exception"}
Inspect the TypeError and its call stack. Recording ends at the error; previous steps remain available.

::: tp-javascript-tracer { src="/docs/components/javascript-tracer/examples/uncaught-exception.js" }
:::
```

``` example {label="Loop and local variables"}
Step through the loop to inspect n and the growing squares array. The final output contains 1, 4, 9 and 16.

::: tp-javascript-tracer { src="/docs/components/javascript-tracer/examples/loops.js" }
:::
```

``` example {label="Replay a saved trace"}
::: tp-javascript-tracer { trace="/docs/components/javascript-tracer/examples/nested-arrays.trace.json" }
:::
```
::::
:::::
