::::: tp-markdown-viewer { label="tp-typescript-tracer" allow-script preserve-source }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-typescript-tracer { src="/docs/components/typescript-tracer/examples/nested-arrays.ts" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/typescript/typescript.js";
import "/components/typescript-tracer/typescript-tracer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-typescript-tracer");
element1.setAttribute("src", "/docs/components/typescript-tracer/examples/nested-arrays.ts");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Subexpressions on one line"}
::: tp-typescript-tracer { src="/docs/components/typescript-tracer/examples/same-line.ts" }
:::
```

``` example {label="Recursion"}
Record factorial(5), inspect the five call frames and follow return values up to 120.

::: tp-typescript-tracer { src="/docs/components/typescript-tracer/examples/recursion.ts" }
:::
```

``` example {label="Independent closures"}
Follow count in the two captured makeCounter environments. The first counter returns 1 then 2; the second returns 1.

::: tp-typescript-tracer { src="/docs/components/typescript-tracer/examples/closures.ts" }
:::
```

``` example {label="Class and shared instance"}
Follow this.value from 3 to 4 and check that counter and alias point to the same instance. The output is 4, 4, true.

::: tp-typescript-tracer { src="/docs/components/typescript-tracer/examples/classes.ts" }
:::
```

``` example {label="Inheritance and super"}
Follow StepCounter extending Counter, the super(value) constructor call and the overridden increment method calling super.increment(). Inspect the same instance through both classes; the output is 5, 7, true.

::: tp-typescript-tracer { src="/docs/components/typescript-tracer/examples/inheritance.ts" }
:::
```

``` example {label="Caught exception"}
Follow the exception from divide into catch, then continue through finally. The error event uses the danger color and execution continues.

::: tp-typescript-tracer { src="/docs/components/typescript-tracer/examples/caught-exception.ts" }
:::
```

``` example {label="Uncaught exception"}
Inspect the TypeError and its call stack. Recording ends at the error; previous steps remain available.

::: tp-typescript-tracer { src="/docs/components/typescript-tracer/examples/uncaught-exception.ts" }
:::
```

``` example {label="Loop and local variables"}
Step through the loop to inspect n and the growing squares array. The final output contains 1, 4, 9 and 16.

::: tp-typescript-tracer { src="/docs/components/typescript-tracer/examples/loops.ts" }
:::
```

``` example {label="Replay a saved trace"}
::: tp-typescript-tracer { trace="/docs/components/typescript-tracer/examples/nested-arrays.trace.json" }
:::
```

``` example {label="Nested calls and a separate query"}
Record execution, then choose Start at query to skip the warmup calculation and reach fact(4), whose result is 24. Use Next to enter a nested call: Step over completes that call without visiting its body, while Step out returns from the active function to its caller. Use Previous to revisit the skipped steps; First also restores access to initialization. All steps remain available after saving and reloading the trace.

::: tp-typescript-tracer { src="/docs/components/typescript-tracer/examples/nested-calls.ts" query="console.log(fact(4));" }
:::
```

``` example {label="Constant expressions and intermediate values"}
Record execution and use Next to follow the highlighted operations and their Expression value until the result is 57. Previous revisits each calculation; Save trace and Load trace preserve the intermediate values without running the program again.

::: tp-typescript-tracer { src="/docs/components/typescript-tracer/examples/constant-expressions.ts" }
:::
```
::::
:::::
