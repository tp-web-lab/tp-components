::::: tp-markdown-viewer { label="tp-matching" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-matching
- Hello

- Thank you

- Goodbye

1. Bonjour

2. Merci

3. Au revoir
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/matching/matching.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-matching");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("ul");

const element3 = document.createElement("li");
element3.append(document.createTextNode("Hello"));
element2.append(element3);

const element4 = document.createElement("li");
element4.append(document.createTextNode("Thank you"));
element2.append(element4);

const element5 = document.createElement("li");
element5.append(document.createTextNode("Goodbye"));
element2.append(element5);
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element6 = document.createElement("ol");

const element7 = document.createElement("li");
element7.append(document.createTextNode("Bonjour"));
element6.append(element7);

const element8 = document.createElement("li");
element8.append(document.createTextNode("Merci"));
element6.append(element8);

const element9 = document.createElement("li");
element9.append(document.createTextNode("Au revoir"));
element6.append(element9);
element1.append(element6);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Rich content"}
::: tp-matching
- :tp-icon:{name="lt" library="flags" size="3em" role="img" aria-label="Flag to identify"}

- Listen to the sound.

  :audio:{controls src="/docs/medias/audios/glass-break.mp3" aria-label="Sound to identify"}

- Watch the scene.

  :video:{controls width="240" src="/docs/medias/videos/chute-eau.mp4" aria-label="Scene to identify"}

1. Lithuania

2. Breaking glass

3. A waterfall
:::
```

``` example {label="Irregular verbs"}
::: tp-matching
Base form
:
  - be

  - have

  - do

Past simple
:
  1. was

  2. had

  3. did

Past participle
:
  - been

  - had

  - done

French
:
  1. être

  2. avoir

  3. faire
:::
```

``` example {label="Header list"}
::: tp-matching { heading }
- English

- French

- Hello

- Thank you

- Goodbye

1. Bonjour

2. Merci

3. Au revoir
:::
```
::::
:::::
