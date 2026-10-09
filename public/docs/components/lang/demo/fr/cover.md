# Démo de langue

Sélectionnez une langue dans le menu pour changer de dépôt documentaire.

Ceci est la version française de la page de démonstration.

Le dépôt courant est le sous-répertoire français.

## Utilisation de base

L'exemple est un composant `<tp-markup-multi-pages>` connecté à ce dépôt de démonstration.

## Mode auto

Le sélecteur de langue contient `auto` avant les codes de langue explicites. En mode auto, il utilise la langue du navigateur lorsqu'elle correspond à l'un des codes configurés.

## Sélecteur externe

`<tp-lang>` peut aussi être utilisé en dehors de `<tp-markup-multi-pages>` lorsqu'il pointe vers le même dépôt.

## Utilisation dans la barre d'outils

`<tp-markup-multi-pages>` place `<tp-lang>` dans sa barre d'outils et lui transmet la liste `langs` configurée.
