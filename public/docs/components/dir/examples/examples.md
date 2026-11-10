:::::: tp-markdown-viewer { label="tp-dir" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box
::: tp-dir
:::

Use the direction button to switch this paragraph between left-to-right and right-to-left layout.
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/box/box.js";
import "/components/dir/dir.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-box");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("tp-dir");
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element3 = document.createElement("p");
element3.append(document.createTextNode("Use the direction button to switch this paragraph between left-to-right and right-to-left layout."));
element1.append(element3);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Auto mode"}
:::: tp-box
::: tp-dir { mode="auto" }
:::

Auto mode follows the document direction.
::::
```

``` example {label="Change event"}
:::: section { id="dir-event-target" }
::: tp-dir { anchor="#dir-event-target" }
:::

Choose a direction to emit
`tp-dir-change`
.

يمكن تغيير اتجاه القراءة في هذا القسم.
::::

::: tp-console
:::

::: script { type="module" }
customElements.whenDefined('tp-console').then(() => {
  const section = document.querySelector('#dir-event-target');
  const output = document.querySelector('tp-console');
  output.redirectConsoleToSelf();
  section?.addEventListener('tp-dir-change', (event) => {
  console.info('tp-dir-change', {
    mode: event.detail.mode,
    dir: event.detail.dir,
    anchor: event.detail.anchor,
    target: event.detail.target?.id,
  });
  });
});
:::
```
:::::
::::::
