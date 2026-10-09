<!-- tp-i18n: source="index.md" hash="3fd673138ad1f5e2" from="en" to="fr" provider="openai" model="gpt-4.1-mini" -->
# Plein écran

L'élément HTML personnalisé `<tp-fullscreen>` est un bouton de contrôle du mode plein écran.

<tp-fullscreen></tp-fullscreen>

`<tp-fullscreen>` bascule le mode plein écran pour un élément ancré ou, lorsque `anchor` est omis, pour le composant qui le contient. Il ignore les conteneurs de type barre d'outils lors de la résolution du composant contenant.

## Utilisation

Le contrôleur se comporte comme un bouton icône. Utilisez `variant`, `size`, et
`disabled` pour configurer le `<tp-icon-button>` interne :

```html
<tp-fullscreen variant="brand" size="s"></tp-fullscreen>
<tp-fullscreen disabled></tp-fullscreen>
```

Utilisez `anchor` pour cibler un élément spécifique :

```html
<section id="preview">
  <p>This section can enter fullscreen mode.</p>
</section>

<tp-fullscreen anchor="#preview"></tp-fullscreen>
```

Placez le bouton à l'intérieur d'une barre d'outils de composant pour contrôler le composant contenant :

```html
<tp-box>
  <tp-toolbar>
    <tp-fullscreen></tp-fullscreen>
  </tp-toolbar>
  <p>The box is the fullscreen target.</p>
  <p>Press Esc to exit full-screen mode.</p>
</tp-box>
```

## Exemples

<tp-html-viewer label="tp-fullscreen" allow-script>
<div role="example" label="Basic usage">
  <tp-box>
    <tp-fullscreen></tp-fullscreen>
    <p>Cette boîte est la cible du plein écran.</p>
    <p>Appuyez sur Échap pour quitter le mode plein écran.</p>
  </tp-box>
</div>

<div role="example" label="Explicit target">
  <tp-box id="fullscreen-example">
    <p>Cette boîte est la cible du plein écran.</p>
    <p>Appuyez sur Échap pour quitter le mode plein écran.</p>
  </tp-box>
  <tp-fullscreen anchor="#fullscreen-example"></tp-fullscreen>
</div>

<div role="example" label="Button attributes">
  <tp-box>
    <tp-fullscreen variant="brand" size="xl"></tp-fullscreen>
    <tp-fullscreen variant="danger"></tp-fullscreen>
    <tp-fullscreen size="s" disabled></tp-fullscreen>
    <p>Les contrôleurs transmettent <code>variant</code>, <code>size</code>, et <code>disabled</code> à leurs boutons icônes.</p>
  </tp-box>
</div>

<div role="example" label="Toolbar control">
  <tp-box>
    <tp-toolbar>
      <tp-fullscreen></tp-fullscreen>
    </tp-toolbar>
    <p>Le bouton plein écran est dans une barre d'outils.</p>
    <p>La boîte contenant est toujours la cible du plein écran.</p>
  </tp-box>
</div>

<div role="example" label="Change event">
  <tp-box id="fullscreen-event-target">
    <tp-fullscreen anchor="#fullscreen-event-target"></tp-fullscreen>
    <p>Entrez ou sortez du plein écran pour émettre <code>tp-fullscreen-change</code>.</p>
  </tp-box>
  <tp-console></tp-console>
  <script type="module">
    customElements.whenDefined('tp-console').then(() => {
      const section = document.querySelector('#fullscreen-event-target');
      const output = document.querySelector('tp-console');
      output.redirectConsoleToSelf();
      section?.addEventListener('tp-fullscreen-change', (event) => {
      console.info('tp-fullscreen-change', {
        fullscreen: event.detail.fullscreen,
        anchor: event.detail.anchor,
        target: event.detail.target?.id,
      });
      });
    });
  </script>
</div>
</tp-html-viewer>

## Programmation

### API
<!-- tp-docgen:api TpFullscreen -->
::: tp-tabs
Attributs
: | Attribut | Type | Par défaut | Description |
  | --- | --- | --- | --- |
  | <code>anchor</code> | <code>string</code> | <code>""</code> | Sélecteur CSS de l'élément pour basculer en plein écran. |
  | <code>variant</code> | <code>string</code> | <code>neutral</code> | Variante du bouton icône. |
  | <code>size</code> | <code>string</code> | <code>m</code> | Taille du bouton icône. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Désactive le déclencheur de plein écran. |
  [Attributes of `<tp-fullscreen>`]

Méthodes
: | Méthode | Signature | Description |
  | --- | --- | --- |
  | Aucune. |  |  |
  [Public methods of `TpFullscreen`]

Événements
: | Événement | Détail | Description |
  | --- | --- | --- |
  | <code>tp-fullscreen-change</code> | <code>{ fullscreen: boolean; anchor: string; target: HTMLElement }</code> | Émis lorsque l'état plein écran de la cible contrôlée change. |
  [Events emitted by `<tp-fullscreen>`]

Propriétés CSS
: | Propriété CSS | Par défaut | Description |
  | --- | --- | --- |
  | Aucune. |  |  |
  [Css properties of `<tp-fullscreen>`]
:::
<!-- /tp-docgen:api -->

### Imports
::: tp-tabs
script
: Chargement automatique :

  ```html
  <script type="module" src="tp-loader.js">
  ```

  Import sélectif :

  ```html
  <script type="module" src="/path/to/components/fullscreen/fullscreen.js">
  ```

import
: ```js`
  import "/path/to/components/fullscreen/fullscreen.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/fullscreen/fullscreen.js";
  ```
:::
