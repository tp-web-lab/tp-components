<!-- tp-i18n: source="index.md" hash="bb2603415d47745f" from="en" to="fr" provider="openai" model="gpt-4.1-mini" -->
# Couleur

L'élément HTML personnalisé `<tp-color>` est un contrôleur de préréglage de couleur de marque.

<tp-box>
    <tp-color></tp-color>
    <code>Inline code</code> est affiché dans la couleur de la marque.
</tp-box>


`<tp-color>` affiche un bouton palette et applique l'une des classes de couleur de marque intégrées à sa cible. Par défaut, la cible est l'élément contenant. Lorsque `anchor` pointe vers un élément, cet élément est utilisé à la place.

## Utilisation

Le contrôleur se comporte comme un bouton icône. Utilisez `variant`, `size`, et
`disabled` pour configurer le `<tp-icon-button>` interne :

```html
<tp-color variant="brand" size="s"></tp-color>
<tp-color disabled></tp-color>
```

Placez le composant à l'intérieur de l'élément dont la couleur de marque doit être contrôlée :

```html
<section>
  <tp-color></tp-color>
  <p>This section receives the selected brand color.</p>
</section>
```

Utilisez `anchor` pour une cible explicite :

```html
<article id="preview">
  <p>The selected preset is applied here.</p>
</article>
<tp-color anchor="#preview"></tp-color>
```

Utilisez `ui-anchor` lorsque seul le menu déroulant doit être positionné ailleurs. Le
préréglage sélectionné est toujours appliqué à la cible `anchor` lorsqu'elle est fournie :

```html
<section>
  <span id="palette-position">Palette position</span>
  <tp-callout variant="brand" id="callout">
    The callout receives the selected preset.
  </tp-callout>
</section>
<tp-color ui-anchor="#palette-position" anchor="#callout" style="float: right;"></tp-color>
```

Dans cet exemple, `anchor="#callout"` fait en sorte que le callout reçoive le préréglage
de marque sélectionné. `ui-anchor="#palette-position"` positionne le menu déroulant à côté
de l'étiquette. L'attribut `style` déplace uniquement le bouton palette lui-même dans la
mise en page de la page.

## Exemples

<tp-html-viewer label="tp-color" allow-script>
<div role="example" label="Basic usage">
  <section>
    <tp-color></tp-color>
    <p>La couleur de marque sélectionnée est limitée à cette section.</p>
    <code>Inline code uses the selected brand colour.</code>
  </section>
</div>

<div role="example" label="Local color scope">
  <tp-box>
    <tp-color></tp-color>
    <tp-callout variant="brand">
      La couleur de marque sélectionnée est limitée à cette boîte.
    </tp-callout>
  </tp-box>
</div>

<div role="example" label="Initial preset">
  <tp-box>
    <tp-color preset="tp-emerald"></tp-color>
    <tp-callout variant="brand">
      Le contrôleur de couleur commence avec le préréglage <code>tp-emerald</code>.
    </tp-callout>
  </tp-box>
</div>

<div role="example" label="Explicit target">
  <article id="color-preview">
    <p>Le préréglage sélectionné est appliqué à cet article.</p>
    <tp-callout variant="brand">
      Ce callout suit la couleur de marque sélectionnée.
    </tp-callout>
  </article>
  <tp-color anchor="#color-preview"></tp-color>
</div>

<div role="example" label="Button attributes">
  <section>
    <tp-color variant="brand" size="xl"></tp-color>
    <tp-color variant="dander"></tp-color>
    <tp-color size="s" disabled></tp-color>
    <p>Les contrôleurs transmettent <code>variant</code>, <code>size</code>, et <code>disabled</code> à leurs boutons icônes.</p>
  </section>
</div>

<div role="example" label="Dropdown anchor">
  <section>
    <span id="palette-position">Position de la palette</span>
    <tp-callout variant="brand" id="callout">
      Le menu déroulant est ancré à l'étiquette, mais ce callout reçoit la couleur de marque sélectionnée.
    </tp-callout>
  </section>
  <tp-color ui-anchor="#palette-position" anchor="#callout" style="float: right;"></tp-color>
</div>

<div role="example" label="Change event">
  <section id="color-event-target">
    <tp-color anchor="#color-event-target"></tp-color>
    <p>Choisissez une couleur de marque à émettre <code>tp-color-change</code>.</p>
    <tp-callout variant="brand">Ce callout suit la couleur de marque sélectionnée.</tp-callout>
  </section>
  <tp-console></tp-console>
  <script type="module">
    customElements.whenDefined('tp-console').then(() => {
      const section = document.querySelector('#color-event-target');
      const output = document.querySelector('tp-console');
      output.redirectConsoleToSelf();
      section?.addEventListener('tp-color-change', (event) => {
      console.info('tp-color-change', {
        preset: event.detail.preset,
        brand: event.detail.brand,
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
<!-- tp-docgen:api TpColor -->
::: tp-tabs
Attributs
: | Attribut | Type | Défaut | Description |
  | --- | --- | --- | --- |
  | <code>preset</code> | <code>string</code> | <code>tp-default</code> | Nom de classe prédéfini, par exemple <code>tp-default</code>, <code>tp-red</code>, ou <code>tp-emerald</code>. |
  | <code>anchor</code> | <code>string</code> | <code>""</code> | Sélecteur CSS utilisé comme élément explicite qui reçoit le préréglage sélectionné. |
  | <code>ui-anchor</code> | <code>string</code> | <code>""</code> | Sélecteur CSS utilisé uniquement pour ancrer l'interface déroulante. |
  | <code>variant</code> | <code>string</code> | <code>neutral</code> | Variante du bouton icône. |
  | <code>size</code> | <code>string</code> | <code>m</code> | Taille du bouton icône. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Désactive le déclencheur de couleur. |
  [Attributes of `<tp-color>`]

Méthodes
: | Méthode | Signature | Description |
  | --- | --- | --- |
  | <code>syncToPreset</code> | <code>syncToPreset(preset: TpColorPreset): void</code> | Synchronise ce contrôleur avec un autre contrôleur sur la même cible. |
  [Public methods of `TpColor`]

Événements
: | Événement | Détail | Description |
  | --- | --- | --- |
  | <code>tp-color-change</code> | <code>{ preset: string; brand: string; anchor: string; target: HTMLElement }</code> | Émis lorsque le préréglage de marque sélectionné est appliqué à une cible. |
  [Events emitted by `<tp-color>`]

Propriétés CSS
: | Propriété CSS | Par défaut | Description |
  | --- | --- | --- |
  | Aucune. |  |  |
  [Css properties of `<tp-color>`]
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
  <script type="module" src="/path/to/components/color/color.js">
  ```

import
: ```js
  import "/path/to/components/color/color.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/color/color.js";
  ```
:::
