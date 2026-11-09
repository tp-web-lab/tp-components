:::::: tp-markdown-viewer { label="tp-object-tree" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-object-tree
::: script { type="tp/javascript" }
({
  course: {
    title: 'Web components',
    lessons: 12,
    published: true
  },
  topics: ['HTML', 'CSS', 'JavaScript']
})
:::
::::
```

``` example {label="Internal script"}
:::: tp-object-tree
::: script { type="tp/javascript" }
({
  component: 'tp-object-tree',
  stable: true,
  versions: [1, 2, 3]
})
:::
::::
```

``` example {label="JavaScript API"}
::: tp-object-tree
:::

::: script
{
const script = document.currentScript;
const output = script?.closest('[data-role="output"]');
const tree = output?.querySelector('tp-object-tree')
  ?? script?.previousElementSibling;

customElements.whenDefined('tp-object-tree').then(() => {
  tree?.setValue({
    component: 'tp-object-tree',
    stable: true,
    versions: [1, 2, 3]
  });
});
}
:::
```
:::::
::::::
