:::::: tp-markdown-viewer { label="tp-typescript-viewer" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-typescript-viewer { src="/docs/components/_shared/intro-projects/typescript.json" }
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
:::::
::::::
