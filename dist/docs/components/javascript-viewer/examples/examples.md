:::::: tp-markdown-viewer { label="tp-javascript-viewer" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-javascript-viewer { src="/docs/components/_shared/intro-projects/javascript.json" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/javascript-viewer/javascript-viewer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-javascript-viewer");
element1.setAttribute("src", "/docs/components/_shared/intro-projects/javascript.json");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="src"}
::: tp-javascript-viewer { src="/docs/components/javascript-viewer/examples/example.json" }
:::
```

``` example {label="script"}
:::: tp-javascript-viewer
::: script { type="tp/javascript" }
const app = document.querySelector('#app');

if (app instanceof HTMLElement) {
  app.textContent = 'Hello JavaScript viewer';
}

console.log('Hello JavaScript');
:::
::::
```

``` example {label="error"}
:::: tp-javascript-viewer
::: script { type="tp/javascript" }
console.error(new Error('Intentional JavaScript error'));
:::
::::
```

``` example {label="Single source file"}
::: tp-javascript-viewer { src="/docs/components/_shared/single-source/example.js" }
:::
```
:::::
::::::
