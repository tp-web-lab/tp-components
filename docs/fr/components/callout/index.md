<!-- tp-i18n: source="index.md" hash="b5e0e3416f12db9c" from="en" to="fr" provider="openai" model="gpt-4.1-mini" -->
# Callout

<tp-toc position="end" open expand-all></tp-toc>

L'élément HTML personnalisé `<tp-callout>` met en valeur son contenu de différentes manières.

<tp-callout heading="Info" variant="info">
L'élément HTML personnalisé <code>&lt;tp-callout&gt;</code> met en valeur son contenu de différentes manières.
</tp-callout>

## Utilisation
Pour mettre en valeur un morceau de HTML, il suffit de l'entourer de l'élément `<tp-callout>`.

``` html
<p>Here is a paragraph.</p>

<tp-callout>
  <p>Here is a paragraph enclosed within the <code>tp-callout</code> element.</p>
</tp-callout>
```

## Exemples
<tp-html-viewer label="tp-callout" allow-script>
<div role="example" label="Basic usage">
  <tp-callout>
    L'élément HTML personnalisé <code>&lt;tp-callout&gt;</code> met en valeur son contenu de différentes manières.
  </tp-callout>
  
  <p>Si l'attribut <code>variant</code> n'est pas spécifié, <code>"neutral"</code> est utilisé.</p>

  <script type="module">
    import '/tp-components/components/callout/callout.js';
  </script>
</div>

<div role="example" label="Attribute variant">
  <p>L'attribut <code>variant</code> vous permet de changer la couleur de la bordure et du fond.</p>

  <tp-callout variant="success">
    L'élément HTML personnalisé <code>&lt;tp-callout&gt;</code> met en valeur son contenu de différentes manières.
  </tp-callout>
  <tp-callout variant="warning">
    L'élément HTML personnalisé <code>&lt;tp-callout&gt;</code> met en valeur son contenu de différentes manières.
  </tp-callout>
  <tp-callout variant="danger">
    L'élément HTML personnalisé <code>&lt;tp-callout&gt;</code> met en valeur son contenu de différentes manières.
  </tp-callout>

  <p>
    Les différentes valeurs de l'attribut <code>variant</code> sont : <code>"brand"</code>, <code>"danger"</code>, <code>"info"</code>, <code>"neutral"</code>, <code>"success"</code>, et <code>"warning"</code>.
  </p>

  <script type="module">
    import '/tp-components/components/callout/callout.js';
  </script>
</div>

<div role="example" label="Attribute outlined">
  <p>L'attribut <code>outlined</code> supprime la couleur de fond.</p>

  <tp-callout variant="success" outlined>
    L'élément HTML personnalisé <code>&lt;tp-callout&gt;</code> met en valeur son contenu de différentes manières.
  </tp-callout>
  <tp-callout variant="warning" outlined>
    L'élément HTML personnalisé <code>&lt;tp-callout&gt;</code> met en valeur son contenu de différentes manières.
  </tp-callout>
  <tp-callout variant="danger" outlined>
    L'élément HTML personnalisé <code>&lt;tp-callout&gt;</code> met en valeur son contenu de différentes manières.
  </tp-callout>

  <script type="module">
    import '/tp-components/components/callout/callout.js';
  </script>
</div>

<div role="example" label="Attribute heading">
  <p>L'attribut <code>heading</code> ajoute un titre au callout.</p>

  <tp-callout variant="success" heading="Heading">
    L'élément HTML personnalisé <code>&lt;tp-callout&gt;</code> met en valeur son contenu de différentes manières.
  </tp-callout>
  <tp-callout variant="warning" heading="Heading">
    L'élément HTML personnalisé <code>&lt;tp-callout&gt;</code> met en valeur son contenu de différentes manières.
  </tp-callout>
  <tp-callout variant="danger" heading="Heading">
    L'élément HTML personnalisé <code>&lt;tp-callout&gt;</code> met en valeur son contenu de différentes manières.
  </tp-callout>

  <script type="module">
    import '/tp-components/components/callout/callout.js';
  </script>
</div>
</tp-html-viewer>

## Programmation

### API
<!-- tp-docgen:api TpCallout -->
::: tp-tabs
Attributs
: | Attribut | Type | Par défaut | Description |
  | --- | --- | --- | --- |
  | <code>heading</code> | <code>string</code> | <code>""</code> | Titre optionnel affiché au-dessus du contenu. |
  | <code>outlined</code> | <code>boolean</code> | <code>false</code> | Supprime le fond rempli. |
  | <code>variant</code> | <code>string</code> | <code>neutral</code> | Variante visuelle (`success`, `danger`, `warning`, `info`, `neutral`, ou `brand`). |
  [Attributes of `<tp-callout>`]

Méthodes
: | Méthode | Signature | Description |
  | --- | --- | --- |
  | Aucune. |  |  |
  [Public methods of `TpCallout`]

Événements
: | Événement | Détail | Description |
  | --- | --- | --- |
  | Aucun. |  |  |
  [Events emitted by `<tp-callout>`]

Propriétés CSS
: | Propriété CSS | Par défaut | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-callout-accent</code> | <code>var(--tp-neutral-text-colorful)</code> | Couleur d'accentuation. |
  | <code>&#45;&#45;tp-callout-background</code> | <code>var(--tp-neutral-fill-softer)</code> | Couleur de fond. |
  | <code>&#45;&#45;tp-callout-border-color</code> | <code>var(--tp-neutral-stroke-soft)</code> | Couleur de la bordure. |
  | <code>&#45;&#45;tp-callout-border-width</code> | <code>4px</code> | Largeur de la bordure principale. |
  | <code>&#45;&#45;tp-callout-foreground</code> | <code>var(--tp-text-body)</code> | Couleur du texte. |
  | <code>&#45;&#45;tp-callout-heading-font-size</code> | <code>1rem</code> | Taille de la police du titre. |
  | <code>&#45;&#45;tp-callout-heading-gap</code> | <code>0.625rem</code> | Espace sous le titre. |
  | <code>&#45;&#45;tp-callout-padding-block</code> | <code>0.875rem</code> | Rembourrage du bloc. |
  | <code>&#45;&#45;tp-callout-padding-inline</code> | <code>1rem</code> | Rembourrage en ligne. |
  | <code>&#45;&#45;tp-callout-radius</code> | <code>0.75rem</code> | Rayon de bordure. |
  [Css properties of `<tp-callout>`]
:::
<!-- /tp-docgen:api -->

### Importations
::: tp-tabs
script
: Chargement automatique : 

  ```html
  <script type="module" src="tp-loader.js">
  ```

  Sélection ciblée : 
  
  ```html
  <script type="module" src="/path/to/components/callout/callout.js">
  ```

  
import
: ```js
  import "/path/to/components/callout/callout.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/callout/callout.js";
  ```
:::
