::::: tp-markdown-viewer { label="tp-formula-picker" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-formula-picker
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/formula-picker/formula-picker.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-formula-picker");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Selection event"}
::: tp-formula-picker { id="formula-event-picker" }
:::

::: tp-textfield { id="formula-event-result" label="Selected formula" placeholder="Select a formula" clearable }
:::

::: script { type="module" }
const picker = document.querySelector("#formula-event-picker");
const result = document.querySelector("#formula-event-result");
await customElements.whenDefined("tp-textfield");
picker.addEventListener("tp-formula-picker-select", (event) => {
  result.value = event.detail.formula;
});
:::
```
::::
:::::
