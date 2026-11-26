::::: tp-markdown-viewer { label="tp-include" allow-script preserve-source }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-include { src="/docs/components/include/examples/welcome.html" loading="Loading the shared notice…" }
:::
```

``` example {label="Raw HTML"}
::: tp-include { src="/docs/components/include/examples/welcome.html" mode="raw" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/include/include.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-include");
element1.setAttribute("src", "/docs/components/include/examples/welcome.html");
element1.setAttribute("loading", "Loading the shared notice…");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Converted Markdown"}
::: tp-include { src="/docs/components/include/examples/notice.md" }
:::
```

``` example {label="Raw Markdown"}
::: tp-include { src="/docs/components/include/examples/notice.md" mode="raw" }
:::
```

``` example {label="Converted AsciiDoc"}
::: tp-include { src="/docs/components/include/examples/notice.adoc" }
:::
```

``` example {label="Raw AsciiDoc"}
::: tp-include { src="/docs/components/include/examples/notice.adoc" mode="raw" }
:::
```

``` example {label="Converted LaTeX"}
::: tp-include { src="/docs/components/include/examples/notice.tex" }
:::
```

``` example {label="Raw LaTeX"}
::: tp-include { src="/docs/components/include/examples/notice.tex" mode="raw" }
:::
```

``` example {label="Converted reStructuredText"}
::: tp-include { src="/docs/components/include/examples/notice.rst" }
:::
```

``` example {label="Raw reStructuredText"}
::: tp-include { src="/docs/components/include/examples/notice.rst" mode="raw" }
:::
```
::::
:::::
