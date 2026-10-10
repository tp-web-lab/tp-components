<!-- tp-i18n: source="index.md" hash="70ae30d62f4000f4" from="en" to="fr" provider="openai" model="gpt-4.1-mini" -->
# Thème

L'élément HTML personnalisé `<tp-theme>` est un contrôleur de thème clair, sombre et automatique à portée parente.

<tp-theme></tp-theme>

`<tp-theme>` affiche un bouton de thème et applique soit `tp-light` soit `tp-dark` à sa cible. En mode `auto`, il suit le schéma de couleurs du système.

## Utilisation

Le contrôleur se comporte comme un bouton icône. Utilisez `variant`, `size`, et
`disabled` pour configurer le `<tp-icon-button>` interne :

```html
<tp-theme variant="brand" size="s"></tp-theme>
<tp-theme disabled></tp-theme>
```

Placez le composant à l'intérieur de l'élément dont le thème doit être contrôlé :

```html
<section>
  <tp-theme></tp-theme>
  <p>This section follows the selected theme.</p>
</section>
```

Utilisez `anchor` pour cibler un élément spécifique :

```html
<article id="preview">
  <p>The selected theme is applied here.</p>
</article>

<tp-theme anchor="#preview"></tp-theme>
```

Utilisez `ui-anchor` lorsque seul le menu déroulant doit être positionné ailleurs. Le
thème sélectionné est toujours appliqué à la cible `anchor` lorsqu'elle est fournie :

```html
<section>
  <span id="theme-position">Theme menu position</span>
  <tp-callout id="theme-preview">
    The selected theme is applied to this callout.
  </tp-callout>
</section>
<tp-theme ui-anchor="#theme-position" anchor="#theme-preview" style="float: right;"></tp-theme>
```

Dans cet exemple, `anchor="#theme-preview"` fait en sorte que le callout reçoive le
thème sélectionné. `ui-anchor="#theme-position"` positionne le menu déroulant à côté
du label. L'attribut `style` déplace uniquement le bouton de thème lui-même dans la
mise en page de la page.

## Exemples

<tp-html-viewer label="tp-theme" allow-script>
<div role="example" label="Basic usage">
  <section>
    <tp-theme></tp-theme>
    <p>Le thème sélectionné est limité à cette section.</p>
    <code>Inline code follows the selected theme.</code>
  </section>
</div>

<div role="example" label="Local theme scope">
  <tp-box>
    <tp-theme></tp-theme>
    <tp-callout>
      Le thème sélectionné est limité à cette boîte.
    </tp-callout>
  </tp-box>
</div>

<div role="example" label="Initial mode">
  <tp-box>
    <tp-theme mode="dark"></tp-theme>
    <tp-callout>
      Le contrôleur de thème démarre en mode sombre.
    </tp-callout>
  </tp-box>
</div>

<div role="example" label="Explicit target">
  <article id="theme-preview">
    <p>Le thème sélectionné est appliqué à cet article.</p>
    <tp-callout>
      Ce callout suit le thème sélectionné.
    </tp-callout>
  </article>
  <tp-theme anchor="#theme-preview"></tp-theme>
</div>

<div role="example" label="Button attributes">
  <section>
    <tp-theme variant="brand" size="xl"></tp-theme>
    <tp-theme variant="danger"></tp-theme>
    <tp-theme size="s" disabled></tp-theme>
    <p>Les contrôleurs transmettent <code>variant</code>, <code>size</code>, et <code>disabled</code> à leurs boutons icônes.</p>
  </section>
</div>

<div role="example" label="Dropdown anchor">
  <section>
    <span id="theme-position">Position du menu de thème</span>
    <tp-callout id="theme-callout">
      Le menu déroulant est ancré au label, mais ce callout reçoit le thème sélectionné.
    </tp-callout>
  </section>
  <tp-theme ui-anchor="#theme-position" anchor="#theme-callout" style="float: right;"></tp-theme>
</div>

<div role="example" label="Change event">
  <section id="theme-event-target">
    <tp-theme anchor="#theme-event-target"></tp-theme>
    <p>Choisissez un mode de thème différent pour émettre <code>tp-theme-change</code>.</p>
    <tp-callout>Cet encadré suit le thème sélectionné.</tp-callout>
  </section>
  <tp-console></tp-console>
  <script type="module">
    customElements.whenDefined('tp-console').then(() => {
      const section = document.querySelector('#theme-event-target');
      const output = document.querySelector('tp-console');
      output.redirectConsoleToSelf();
      section?.addEventListener('tp-theme-change', (event) => {
        console.info('tp-theme-change', {
          mode: event.detail.mode,
          theme: event.detail.theme,
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
<!-- tp-docgen:api TpTheme -->
::: tp-tabs
Attributs
: | Attribut | Type | Par défaut | Description |
  | --- | --- | --- | --- |
  | <code>mode</code> | <code>string</code> | <code>auto</code> | Mode de thème : <code>light</code>, <code>dark</code>, ou <code>auto</code>. |
  | <code>anchor</code> | <code>string</code> | <code>""</code> | Sélecteur CSS de la cible du thème. |
  | <code>ui-anchor</code> | <code>string</code> | <code>""</code> | Sélecteur CSS utilisé uniquement pour ancrer l'interface déroulante. |
  | <code>variant</code> | <code>string</code> | <code>neutral</code> | Variante du bouton icône. |
  | <code>size</code> | <code>string</code> | <code>m</code> | Taille du bouton icône. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Désactive le déclencheur de thème. |
  [Attributes of `<tp-theme>`]

Méthodes
: | Méthode | Signature | Description |
  | --- | --- | --- |
  | <code>syncToMode</code> | <code>syncToMode(mode: TpThemeMode): void</code> | Synchronise ce contrôleur avec un autre contrôleur sur la même cible. |
  [Public methods of `TpTheme`]

Événements
: | Événement | Détail | Description |
  | --- | --- | --- |
  | <code>tp-theme-change</code> | <code>{ mode: "light" &#124; "dark" &#124; "auto"; theme: "light" &#124; "dark"; anchor: string; target: HTMLElement }</code> | Émis lorsque le thème effectif appliqué à une cible change. |
  [Events emitted by `<tp-theme>`]

Propriétés CSS
: | Propriété CSS | Par défaut | Description |
  | --- | --- | --- |
  | Aucune. |  |  |
  [Css properties of `<tp-theme>`]
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
  <script type="module" src="/path/to/components/theme/theme.js">
  ```

import
: ```js
  import "/path/to/components/theme/theme.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/theme/theme.js";
  ```
:::
