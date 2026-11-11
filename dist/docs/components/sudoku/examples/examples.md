::::: tp-markdown-viewer { label="tp-sudoku" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-sudoku
1. 39465!7!1!8!2

2. 2!85913!4!67

3. 6!718!4!2395

4. 7!2!63!8!95!41!

5. 4!38!5612!79!

6. 159!27483!6!

7. 8674!2!5!913!

8. 9127!38654!

9. 54!3!1!9!6728
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/sudoku/sudoku.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-sudoku");
element1.append(document.createTextNode("\n        "));

const element2 = document.createElement("ol");
element2.append(document.createTextNode("\n          "));

const element3 = document.createElement("li");
element3.append(document.createTextNode("39465!7!1!8!2"));
element2.append(element3);
element2.append(document.createTextNode("\n          "));

const element4 = document.createElement("li");
element4.append(document.createTextNode("2!85913!4!67"));
element2.append(element4);
element2.append(document.createTextNode("\n          "));

const element5 = document.createElement("li");
element5.append(document.createTextNode("6!718!4!2395"));
element2.append(element5);
element2.append(document.createTextNode("\n          "));

const element6 = document.createElement("li");
element6.append(document.createTextNode("7!2!63!8!95!41!"));
element2.append(element6);
element2.append(document.createTextNode("\n          "));

const element7 = document.createElement("li");
element7.append(document.createTextNode("4!38!5612!79!"));
element2.append(element7);
element2.append(document.createTextNode("\n          "));

const element8 = document.createElement("li");
element8.append(document.createTextNode("159!27483!6!"));
element2.append(element8);
element2.append(document.createTextNode("\n          "));

const element9 = document.createElement("li");
element9.append(document.createTextNode("8674!2!5!913!"));
element2.append(element9);
element2.append(document.createTextNode("\n          "));

const element10 = document.createElement("li");
element10.append(document.createTextNode("9127!38654!"));
element2.append(element10);
element2.append(document.createTextNode("\n          "));

const element11 = document.createElement("li");
element11.append(document.createTextNode("54!3!1!9!6728"));
element2.append(element11);
element2.append(document.createTextNode("\n        "));
element1.append(element2);
element1.append(document.createTextNode("\n      "));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="sudoku ⭐⭐"}
::: tp-sudoku
1. 837!45!92!1!6!
2. 5!2!6!7!13498
3. 9!41826537
4. 6!7498!5!32!1!
5. 2!8364!1759!
6. 1!5!92!3!7684!
7. 3921648!75!
8. 415378!9!6!2!
9. 7!6!8!59!21!43
:::
```

``` example {label="sudoku ⭐⭐⭐"}
::: tp-sudoku
1. 34!2!9!567!81!
2. 765481923
3. 8!912374!5!6
4. 4!5!67!1329!8!
5. 93!762!8!145
6. 12!859!4367
7. 6!1!487!9532!
8. 579!367814
9. 28!3145!679!
:::
```
::::
:::::
