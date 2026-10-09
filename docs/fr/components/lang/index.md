<!-- tp-i18n: source="index.md" hash="04d504abfacda3df" from="en" to="fr" provider="openai" model="gpt-4.1-mini" -->
# Langue

L'élément HTML personnalisé `<tp-lang>` est un sélecteur de langue pour la documentation.

<tp-lang langs="en,fr"></tp-lang>

`<tp-lang>` affiche un bouton avec un drapeau et un menu déroulant pour changer la langue de la documentation. Il est principalement conçu pour `<tp-markdown-multi-pages>` et modifie le dépôt de documentation utilisé par la page.

La première langue listée dans `langs` est la langue par défaut. Elle utilise directement le dépôt de base. Les autres langues utilisent un sous-répertoire nommé d'après le code de la langue.

## Utilisation

Le contrôleur se comporte comme un bouton icône. Utilisez `variant`, `size`, et
`disabled` pour configurer le `<tp-icon-button>` interne :

```html
<tp-lang langs="en,fr" variant="brand" size="s"></tp-lang>
<tp-lang langs="en,fr" disabled></tp-lang>
```

### Dépôt de documentation fixe

```html
<tp-lang langs="en,fr" repository="/tp-components/docs"></tp-lang>
<tp-markdown-multi-pages repository="/tp-components/docs"></tp-markdown-multi-pages>
```

Avec `repository="/tp-components/docs"` et `langs="en,fr"` :

| Langue | Dépôt |
| --- | --- |
| `en` | `/tp-components/docs` |
| `fr` | `/tp-components/docs/fr` |

Le composant met à jour l'attribut `repository` du `<tp-markdown-multi-pages>` le plus proche. S'il n'est pas à l'intérieur d'un `<tp-markdown-multi-pages>`, il met à jour le premier `<tp-markdown-multi-pages>` trouvé dans le document.

### Modes de langue

Le menu déroulant expose toujours `auto` avant les langues explicites. `auto` utilise la langue du navigateur depuis `navigator.language`.

| Mode | Résolution |
| --- | --- |
| `auto` | Utilise la langue du navigateur lorsque son code de base est listé dans `langs` ; sinon utilise la première langue. |
| `en`, `fr`, ... | Utilise directement la langue sélectionnée. |

Par exemple, avec `langs="en,fr,es"` et `navigator.language` définis sur `fr-FR`, `auto` résout en `fr`.

### Dépôt déduit

Lorsque `repository` est omis, le chemin de base est déduit du répertoire contenant le `index.html` actuel.

```html
<tp-lang langs="en,fr"></tp-lang>
<tp-markdown-multi-pages></tp-markdown-multi-pages>
```

Pour une page servie à `/guide/index.html`, la documentation française est résolue comme `/guide/fr`.

### Organisation des répertoires

Pour `langs="en,fr"` et une documentation anglaise par défaut, une organisation typique est :

```txt
docs/
  index.html
  sidebar.md
  cover.md
  components/
    callout/
      index.md
  fr/
    sidebar.md
    cover.md
    components/
      callout/
        index.md
```

L'arborescence traduite doit conserver les mêmes chemins relatifs que la documentation par défaut.

### Page actuelle

Lorsque la navigation `<tp-markdown-multi-pages>` utilise des URL avec des hash comme `#/components/callout/index.md`, changer la langue conserve le chemin markdown actuel et ne modifie que le dépôt.

```txt
/tp-components/docs + #/components/callout/index.md
/tp-components/docs/fr + #/components/callout/index.md
```

## Exemples

<tp-html-viewer label="tp-lang" allow-script>
<div role="example" label="Basic usage">
  <tp-markdown-multi-pages repository="/tp-components/docs/components/lang/demo" langs="en,fr,es,ma,ru,cn"></tp-markdown-multi-pages>
</div>

<div role="example" label="Auto mode">
  <tp-markdown-multi-pages repository="/tp-components/docs/components/lang/demo" langs="en,fr,es,ma,ru,cn"></tp-markdown-multi-pages>
</div>

<div role="example" label="External selector">
  <tp-lang
    langs="en,fr,es,ma,ru,cn"
    repository="/tp-components/docs/components/lang/demo"
    style="--tp-icon-button-size: 2.75rem; --tp-icon-button-icon-size: 1.6rem; position: fixed; inset-block-start: 4rem; inset-inline-end: 2rem; z-index: 10020;"
  ></tp-lang>
  <tp-markdown-multi-pages repository="/tp-components/docs/components/lang/demo" langs="en,fr,es,ma,ru,cn"></tp-markdown-multi-pages>
</div>

<div role="example" label="Button attributes">
  <tp-lang langs="en,fr,es,ma,ru,cn" variant="brand" size="s"></tp-lang>
  <tp-lang langs="en,fr,es,ma,ru,cn" variant="neutral" size="s" disabled></tp-lang>
</div>

<div role="example" label="Toolbar usage">
  <tp-markdown-multi-pages repository="/tp-components/docs/components/lang/demo" langs="en,fr,es,ma,ru,cn"></tp-markdown-multi-pages>
</div>

</tp-html-viewer>

`<tp-markdown-multi-pages>` place déjà `<tp-lang>` dans sa barre d'outils lorsque le changement de langue est activé par la configuration du composant :
## Programmation

```html
<tp-markdown-multi-pages repository="/tp-components/docs" langs="en,fr"></tp-markdown-multi-pages>
```

### API

Attributs
<!-- tp-docgen:api TpLang -->
::: tp-tabs
: | Attribut | Type | Défaut | Description |
  | __TP_DOCGEN_TOKEN_0__ | __TP_DOCGEN_TOKEN_1__ | __TP_DOCGEN_TOKEN_2__ | Codes de langue séparés par des virgules. |
  | --- | --- | --- | --- |
  | <code>langs</code> | <code>string</code> | <code>en</code> | Racine du dépôt de documentation. |
  | <code>repository</code> | <code>string</code> | <code>""</code> | Variante du bouton icône. |
  | <code>variant</code> | <code>string</code> | <code>neutral</code> | Taille du bouton icône. |
  | <code>size</code> | <code>string</code> | <code>m</code> | Désactive le déclencheur de langue. |
Méthodes
  [Attributes of `<tp-lang>`]

: | Méthode | Signature | Description |
  | Aucune. |  |  |
  | --- | --- | --- |
Événements
  [Public methods of `TpLang`]

Events
: | Événement | Détail | Description |
  | --- | --- | --- |
  | <code>tp-lang-change</code> | <code>{ choice: string; lang: string; repository: string; anchor: null; target: HTMLElement &#124; null }</code> | Émis lorsque la langue de documentation sélectionnée change. |
  [Events emitted by `<tp-lang>`]

Propriétés CSS
: | Propriété CSS | Par défaut | Description |
  | --- | --- | --- |
  | Aucun. |  |  |
  [Css properties of `<tp-lang>`]
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
  <script type="module" src="/path/to/components/lang/lang.js">
  ```

import
: ```js
  import "/path/to/components/lang/lang.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/lang/lang.js";
  ```
:::
