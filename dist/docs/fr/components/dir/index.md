<!-- tp-i18n: source="index.md" hash="1c2d53d3f4188ecf" from="en" to="fr" provider="openai" model="gpt-4.1-mini" -->
# Commutateur de direction

L'élément HTML personnalisé `<tp-dir>` est un commutateur de direction de lecture à portée parente.

<tp-box>
  <tp-dir></tp-dir>
  <p>La direction de lecture de cette section peut être modifiée.</p>
  <p>اس حصے کی پڑھنے کی سمت تبدیل کی جا سکتی ہے۔</p>
</tp-box>

`<tp-dir>` affiche un bouton de direction et applique `dir="ltr"` ou `dir="rtl"` à sa cible. En mode `auto`, il suit la direction du document résolue à partir des attributs racine `<html>` `dir` et `lang`. La détection RTL prend en charge les balises de langue telles que `ar` ou `he`, ainsi que les codes de région de documentation utilisés comme dossiers ou codes de drapeau, tels que `ma`.

## Utilisation

Le contrôleur se comporte comme un bouton icône. Utilisez `variant`, `size`, et
`disabled` pour configurer le `<tp-icon-button>` interne :

```html
<tp-dir variant="brand" size="s"></tp-dir>
<tp-dir disabled></tp-dir>
```

Placez le composant à l'intérieur de l'élément dont la direction de lecture doit être contrôlée :

```html
<section>
  <tp-dir></tp-dir>
  <p>The reading direction of this section can be changed.</p>
</section>
```

Utilisez `anchor` pour cibler un élément spécifique :

```html
<article id="direction-preview">
  <p>The selected direction is applied here.</p>
</article>
<tp-dir anchor="#direction-preview"></tp-dir>
```

## Exemples

<tp-html-viewer label="tp-dir" allow-script>
<div role="example" label="Basic usage">
  <section>
    <tp-dir></tp-dir>
    <p>La direction de lecture de cette section peut être modifiée.</p>
    <p>اس حصے کی پڑھنے کی سمت تبدیل کی جا سکتی ہے۔</p>
  </section>
</div>

<div role="example" label="Right-to-left content">
  <tp-box>
    <tp-dir mode="rtl"></tp-dir>
    <p>La direction de lecture de cette section peut être modifiée.</p>
    <p>اس حصے کی پڑھنے کی سمت تبدیل کی جا سکتی ہے۔</p>
    <p>ניתן לשנות את כיוון הקריאה של קטע זה.</p>
    <p>يمكن تغيير اتجاه القراءة في هذا القسم.</p>
  </tp-box>
</div>

<div role="example" label="Auto mode">
  <tp-box>
    <tp-dir mode="auto"></tp-dir>
    <p>Le mode automatique suit la direction du document.</p>
  </tp-box>
</div>

<div role="example" label="Explicit target">
  <article id="direction-preview">
    <p>La direction sélectionnée est appliquée à cet article.</p>
    <p>يمكن تغيير اتجاه القراءة في هذا المقال.</p>
  </article>
  <tp-dir anchor="#direction-preview"></tp-dir>
</div>

<div role="example" label="Button attributes">
  <section>
    <tp-dir variant="danger" size="xl"></tp-dir>
    <tp-dir variant="brand"></tp-dir>
    <tp-dir size="s" disabled></tp-dir>
    <p>Les contrôleurs transmettent <code>variant</code>, <code>size</code>, et <code>disabled</code> à leurs boutons icônes.</p>
  </section>
</div>

<div role="example" label="Change event">
  <section id="dir-event-target">
    <tp-dir anchor="#dir-event-target"></tp-dir>
    <p>Choisissez une direction pour émettre <code>tp-dir-change</code>.</p>
    <p>يمكن تغيير اتجاه القراءة في هذا القسم.</p>
  </section>
  <tp-console></tp-console>
  <script type="module">
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
  </script>
</div>
</tp-html-viewer>

## Programmation

### API
<!-- tp-docgen:api TpDir -->
::: tp-tabs
Attributs
: | Attribut | Type | Par défaut | Description |
  | --- | --- | --- | --- |
  | <code>anchor</code> | <code>string</code> | <code>""</code> | Sélecteur CSS utilisé comme élément explicite qui reçoit la direction sélectionnée. |
  | <code>mode</code> | <code>string</code> | <code>auto</code> | Mode de direction de lecture : <code>ltr</code>, <code>rtl</code>, ou <code>auto</code>. En <code>auto</code>, le RTL est déduit à partir de la langue ou des codes de région pris en charge. |
  | <code>variant</code> | <code>string</code> | <code>neutral</code> | Variante du bouton icône. |
  | <code>size</code> | <code>string</code> | <code>m</code> | Taille du bouton icône. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Désactive le déclencheur de direction. |
  [Attributes of `<tp-dir>`]

Méthodes
: | Méthode | Signature | Description |
  | --- | --- | --- |
  | Aucune. |  |  |
  [Public methods of `TpDir`]

Événements
: | Événement | Détail | Description |
  | --- | --- | --- |
  | <code>tp-dir-change</code> | <code>{ mode: "ltr" &#124; "rtl" &#124; "auto"; dir: "ltr" &#124; "rtl"; anchor: string; target: HTMLElement }</code> | Émis lorsque la direction de lecture appliquée à une cible change. |
  [Events emitted by `<tp-dir>`]

Propriétés CSS
: | Propriété CSS | Par défaut | Description |
  | --- | --- | --- |
  | Aucune. |  |  |
  [Css properties of `<tp-dir>`]
:::
<!-- /tp-docgen:api -->

### Imports
::: tp-tabs
script
: Chargement automatique :

  ```html
  <script type="module" src="tp-loader.js">
  ```

  Sélection ciblée :

  ```html
  <script type="module" src="/path/to/components/dir/dir.js">
  ```

import
: ```js
  import "/path/to/components/dir/dir.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/dir/dir.js";
  ```
:::
