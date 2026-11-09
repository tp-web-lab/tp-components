::::::: tp-markdown-viewer { label="tp-splitter" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-splitter { position="40%" }
start
:
  ::: tp-box
  Drag the divider to resize this panel.
  :::

end
:
  ::: tp-box
  This panel uses the remaining space.
  :::
::::
```

``` example {label="Nested splitters"}
Drag the outer divider left or right, then drag the inner divider up or down. Focus either divider to resize its panels with the arrow keys.

::::: tp-splitter { axis="horizontal" position="30%" style="height: 20rem" }
start
:
  ::: tp-box
  ### Navigation

  This panel is resized by the outer divider.
  :::

end
:
  :::: tp-splitter { axis="vertical" position="55%" style="height: 100%" }
  start
  :
    ::: tp-box
    ### Editor

    The inner divider changes the height of this panel.
    :::

  end
  :
    ::: tp-box
    ### Preview

    This panel uses the remaining height.
    :::
  ::::
:::::
```
::::::
:::::::
