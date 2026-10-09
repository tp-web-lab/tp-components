::::::: tp-markdown-viewer { label="tp-code-editor" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-code-editor { language="javascript" line-numbers }
::: script { type="tp/javascript" }
const greeting = "Hello, tp-components!";
console.log(greeting);
:::
::::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- fold-gutter

- line-numbers

- readonly

- toolbar

- word-wrap
:::

::: tp-radio-list { data-setting="dir" label="dir" label-position="top" orientation="horizontal" value="1" }
- inherited

- ltr

- rtl

- auto
:::

::: tp-radio-list { data-setting="src" label="src" label-position="top" orientation="horizontal" value="1" }
- Default

- file1

- file2

- file-unknown
:::

:::: tp-cluster
::: tp-textfield { data-setting="filename" label="filename" value placeholder clearable }
:::

::: tp-textfield { data-setting="lang" label="lang" value="inherited" placeholder="inherited" clearable }
:::

::: tp-textfield { data-setting="language" label="language" value="html" placeholder="html" clearable }
:::

::: tp-textfield { data-setting="placeholder" label="placeholder" value="Type some LANGUAGE code... or F1 to toggle the toolbar" placeholder="Type some LANGUAGE code... or F1 to toggle the toolbar" clearable }
:::

::: tp-textfield { data-setting="value" label="value" value placeholder clearable }
:::
::::

:::: tp-button-group
::: tp-button { id="attributes-reset" type="button" }
Reset defaults
:::

::: tp-button { id="attributes-reload" type="button" }
Reload preview
:::
::::
:::::

::: tp-divider
:::

### Preview

::: tp-iframe { id="attributes-frame" title="code-editor attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

::: script { type="module" src="/tp-components/docs/components/code-editor/examples/attributes.js" }
:::
```

``` example {label="Using an internal script"}
:::: tp-code-editor { line-numbers }
::: script { type="tp/typescript" }
function f(x: number): string {
  if (x < 0) { x = x + 1 }
  else { x = x - 1 }
  return `${2*x}`;
}
:::
::::

::: script { type="module" }
import '/tp-components/components/code-editor/code-editor.js';
:::
```
::::::
:::::::
