::::::: tp-markdown-viewer { label="tp-typescript-viewer" allow-script preserve-source }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-typescript-viewer { src="/docs/components/_shared/intro-projects/typescript.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/typescript/typescript.js";
import "/components/typescript-viewer/typescript-viewer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-typescript-viewer");
element1.setAttribute("src", "/docs/components/_shared/intro-projects/typescript.json");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="src"}
::: tp-typescript-viewer { src="/docs/components/typescript-viewer/examples/example.json" }
:::
```

``` example {label="script"}
:::: tp-typescript-viewer
::: script { type="tp/typescript" }
const message: string = 'Hello TypeScript viewer';

document.querySelector('#app')!.textContent = message;
console.log(message);
:::
::::
```

``` example {label="error"}
:::: tp-typescript-viewer
::: script { type="tp/typescript" }
console.error(new Error('Intentional TypeScript error'));
:::
::::
```

``` example {label="Single source file"}
::: tp-typescript-viewer { src="/docs/components/_shared/single-source/example.ts" }
:::
```

``` example {label="Compare presentation modes"}
::::: section
### mode="default" — Standard controls

Open Code to edit the source, then click Run or press :kbd:Shift{}+:kbd:Enter{} in the editor.

Run to print a console message followed by an intentional error. In simple mode the console opens automatically. Comment out the message statements and run again to check that the error alone opens it; remove the error statement to try a successful run.

:::: tp-typescript-viewer { mode="default" }
::: script { type="tp/typescript" filename="main.ts" }
const message: string = "The program ran.";
document.body.innerHTML = `<p>${message}</p>`;
console.log("Console message before the intentional error.");
throw new Error("Intentional error: the simple-mode console opens automatically.");
:::
::::
:::::

::::: section
### mode="lite" — Compact controls

Open Code to edit the source, then click Run or press :kbd:Shift{}+:kbd:Enter{} in the editor.

Run to print a console message followed by an intentional error. In simple mode the console opens automatically. Comment out the message statements and run again to check that the error alone opens it; remove the error statement to try a successful run.

:::: tp-typescript-viewer { mode="lite" }
::: script { type="tp/typescript" filename="main.ts" }
const message: string = "The program ran.";
document.body.innerHTML = `<p>${message}</p>`;
console.log("Console message before the intentional error.");
throw new Error("Intentional error: the simple-mode console opens automatically.");
:::
::::
:::::

::::: section
### mode="simple" — Editor and rendered output only

Edit the code below, keep the cursor in the editor and press :kbd:Shift{}+:kbd:Enter{} (Return) to run it. This viewer has no Run button.

Run to print a console message followed by an intentional error. In simple mode the console opens automatically. Comment out the message statements and run again to check that the error alone opens it; remove the error statement to try a successful run.

:::: tp-typescript-viewer { mode="simple" }
::: script { type="tp/typescript" filename="main.ts" }
const message: string = "The program ran.";
document.body.innerHTML = `<p>${message}</p>`;
console.log("Console message before the intentional error.");
throw new Error("Intentional error: the simple-mode console opens automatically.");
:::
::::
:::::

Programming viewers already have compact controls, so default and lite look alike. The first run may load the language engine.
```
::::::
:::::::
