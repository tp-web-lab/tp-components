::::: tp-markdown-viewer { label="tp-crossword" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-crossword
solution
:
  1. BALL

  2. AREA

  3. LEAD

  4. LADY

across
:
  1. A. A round toy used in many sports

  2. B. The size of a surface

  3. C. A heavy metal

  4. D. A polite word for a woman

down
:
  1. 1. A round toy used in many sports

  2. 2. The size of a surface

  3. 3. A heavy metal

  4. 4. A polite word for a woman
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/crossword/crossword.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-crossword");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("dl");
element2.append(document.createTextNode("\n    "));

const element3 = document.createElement("dt");
element3.append(document.createTextNode("solution"));
element2.append(element3);

const element4 = document.createElement("dd");

const element5 = document.createElement("ol");

const element6 = document.createElement("li");
element6.append(document.createTextNode("BALL"));
element5.append(element6);

const element7 = document.createElement("li");
element7.append(document.createTextNode("AREA"));
element5.append(element7);

const element8 = document.createElement("li");
element8.append(document.createTextNode("LEAD"));
element5.append(element8);

const element9 = document.createElement("li");
element9.append(document.createTextNode("LADY"));
element5.append(element9);
element4.append(element5);
element2.append(element4);
element2.append(document.createTextNode("\n    "));

const element10 = document.createElement("dt");
element10.append(document.createTextNode("across"));
element2.append(element10);

const element11 = document.createElement("dd");

const element12 = document.createElement("ol");

const element13 = document.createElement("li");
element13.append(document.createTextNode("A. A round toy used in many sports"));
element12.append(element13);

const element14 = document.createElement("li");
element14.append(document.createTextNode("B. The size of a surface"));
element12.append(element14);

const element15 = document.createElement("li");
element15.append(document.createTextNode("C. A heavy metal"));
element12.append(element15);

const element16 = document.createElement("li");
element16.append(document.createTextNode("D. A polite word for a woman"));
element12.append(element16);
element11.append(element12);
element2.append(element11);
element2.append(document.createTextNode("\n    "));

const element17 = document.createElement("dt");
element17.append(document.createTextNode("down"));
element2.append(element17);

const element18 = document.createElement("dd");

const element19 = document.createElement("ol");

const element20 = document.createElement("li");
element20.append(document.createTextNode("1. A round toy used in many sports"));
element19.append(element20);

const element21 = document.createElement("li");
element21.append(document.createTextNode("2. The size of a surface"));
element19.append(element21);

const element22 = document.createElement("li");
element22.append(document.createTextNode("3. A heavy metal"));
element19.append(element22);

const element23 = document.createElement("li");
element23.append(document.createTextNode("4. A polite word for a woman"));
element19.append(element23);
element18.append(element19);
element2.append(element18);
element2.append(document.createTextNode("\n  "));
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
