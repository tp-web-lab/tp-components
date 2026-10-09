# Shoelace web components

[[toc]]

# HTML web components

::: web-component tag=audio attributes='src="/medias/audio/glass-break.mp3" controls'
Your browser does not support the audio element.
:::

::: web-component tag=video attributes='src="/medias/video/chute-eau.mp4" controls '
Your browser does not support the video element.
:::

## Shoelace web components

This example demonstrates the `web-component`, `slot`, `script` and `style`
directives with Shoelace web components.

### Card

:::::::: web-component tag=sl-card attributes='class="card-overview"'
:::: slot image
::: web-component tag=img attributes='src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80" alt="A kitten sits patiently between a terracotta pot and decorative grasses."'
:::
::::

:::: slot header
**Shoelace Card**
::::

This card uses named slots generated from Markdown directives.

- `image`
- `header`
- default slot
- `footer`

The content you are currently reading belongs to the default slot.

::::: slot footer
:::: web-component tag=div attributes='style="display:flex; gap:0.5rem; flex-wrap:wrap;"'
::: web-component tag=sl-button attributes='variant="primary"'
Primary action
:::
::: web-component tag=sl-button attributes='variant="default"'
Secondary
:::
::::
:::::
::::::::

::: style
.card-overview {
  max-width: 300px;
}

.card-overview [slot='image'] {
  display: block;
}

.card-overview [slot='image'] img {
  display: block;
  width: 100%;
}

.card-overview [slot='footer'] {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:::

### Divider

::: web-component tag=sl-divider
:::

### Details

:::: web-component tag=sl-details attributes='summary="Expandable panel"'

This content is rendered inside a Shoelace details component.

It can contain standard Markdown formatting:

- lists
- **bold**
- *italic*
- links

::::

### Alert

:::: web-component tag=sl-alert attributes='variant="primary" open'

This is a Shoelace alert component rendered from Markdown.

::::

### Badges

:::: web-component tag=div attributes='style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;"'

::: web-component tag=sl-badge attributes='variant="primary"'
Primary
:::

::: web-component tag=sl-badge attributes='variant="success"'
Success
:::

::: web-component tag=sl-badge attributes='variant="warning"'
Warning
:::

::: web-component tag=sl-badge attributes='variant="danger"'
Danger
:::

::::

### Image comparer

:::: web-component tag=sl-image-comparer

::: web-component tag=img attributes='slot="before" src="https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80&sat=-100&bri=-5" alt="Grayscale version of kittens in a basket looking around."'
:::

::: web-component tag=img attributes='slot="after" src="https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80" alt="Color version of kittens in a basket looking around."'
:::

::::

### Dialog trigger

::: web-component tag=sl-button attributes='id="open-dialog-button" variant="outline"'

Open dialog

:::

:::::: web-component tag=sl-dialog attributes='label="Shoelace dialog"'

This dialog is declared directly inside Markdown.

:::: slot footer

::: web-component tag=sl-button attributes='variant="primary" id="close-dialog-button"'

Close

:::

::::

::::::

:::: script type=module

const dialog = document.querySelector('sl-dialog');
const openButton = document.getElementById('open-dialog-button');
const closeButton = document.getElementById('close-dialog-button');

openButton?.addEventListener('click', () => {
  console.log('Opening dialog');
  dialog?.show();
});

closeButton?.addEventListener('click', () => {
  console.log('Closing dialog');
  dialog?.hide();
});

::::


