:::::: tp-markdown-viewer { label="tp-python-viewer" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-python-viewer { src="/docs/components/_shared/intro-projects/python.json" }
:::
```

``` example {label="src"}
::: tp-python-viewer { src="/docs/components/python-viewer/examples/example.json" }
:::
```

``` example {label="script"}
:::: tp-python-viewer
::: script { type="tp/python" }
message = "Hello Python viewer"
print(message)
:::
::::
```

``` example {label="matplotlib"}
::: tp-python-viewer { src="/docs/components/python-viewer/examples/matplotlib.json" }
:::
```

``` example {label="error"}
:::: tp-python-viewer
::: script { type="tp/python" }
raise RuntimeError("Intentional Python error")
:::
::::
```

``` example {label="Single source file"}
::: tp-python-viewer { src="/docs/components/_shared/single-source/example.py" }
:::
```
:::::
::::::
