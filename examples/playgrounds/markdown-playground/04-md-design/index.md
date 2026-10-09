# Markdown design

[[toc]]

This example demonstrates layout and design helpers inspired by
`sphinx-design`.

---

## Simple cards

:::grid columns=3

:::card title="HTML"
HTML structures the content of a web page.
:::

:::card title="CSS"
CSS controls layout, colors and typography.
:::

:::card title="JavaScript"
JavaScript adds interactivity and dynamic behavior.
:::

:::

---

## Feature cards

:::grid columns=2

:::card title="Markdown"
- Simple syntax
- Easy to read
- Portable format
- Good for documentation
:::

:::card title="reStructuredText"
- Rich directives
- Advanced references
- Native Docutils support
- Sphinx ecosystem
:::

:::

---

## Mixed content

:::grid columns=2

:::card title="Code example"

```js
function hello(name) {
  return `Hello ${name}`;
}
```

:::

:::card title="Formatted text"

Markdown supports:

- **bold**
- *italic*
- `inline code`

And even tables:

| Name | Role |
|---|---|
| Alice | Developer |
| Bob | Designer |

:::

:::

---

## Four-column grid

:::grid columns=4

:::card title="One"
First card.
:::

:::card title="Two"
Second card.
:::

:::card title="Three"
Third card.
:::

:::card title="Four"
Fourth card.
:::

:::

---

## Nested cards

:::grid columns=2

:::card title="Outer card"

This card contains another grid.

:::grid columns=2

:::card title="Nested A"
Nested content A.
:::

:::card title="Nested B"
Nested content B.
:::

:::

:::

:::card title="Another card"

Mathematical notation can also appear here:

`E = mc²`

:::

:::

---

## Responsive layout

Resize the preview area to see the grid adapt automatically on smaller screens.

:::grid columns=3

:::card title="Responsive"
Cards stack vertically on narrow layouts.
:::

:::card title="Adaptive"
The grid uses CSS Grid internally.
:::

:::card title="Reusable"
The same concepts can be shared across markup languages.
:::

:::