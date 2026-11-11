::::: tp-markdown-viewer { label="tp-binary" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-binary
1. 1010110!0

2. 01!01!0011!

3. 0010101!1!

4. 11!01!0100

5. 10011001!

6. 0!110!1010

7. 0110!0!101

8. 10!0101!10
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/binary/binary.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-binary");
element1.append(document.createTextNode("\n        "));

const element2 = document.createElement("ol");
element2.append(document.createTextNode("\n          "));

const element3 = document.createElement("li");
element3.append(document.createTextNode("1010110!0"));
element2.append(element3);
element2.append(document.createTextNode("\n          "));

const element4 = document.createElement("li");
element4.append(document.createTextNode("01!01!0011!"));
element2.append(element4);
element2.append(document.createTextNode("\n          "));

const element5 = document.createElement("li");
element5.append(document.createTextNode("0010101!1!"));
element2.append(element5);
element2.append(document.createTextNode("\n          "));

const element6 = document.createElement("li");
element6.append(document.createTextNode("11!01!0100"));
element2.append(element6);
element2.append(document.createTextNode("\n          "));

const element7 = document.createElement("li");
element7.append(document.createTextNode("10011001!"));
element2.append(element7);
element2.append(document.createTextNode("\n          "));

const element8 = document.createElement("li");
element8.append(document.createTextNode("0!110!1010"));
element2.append(element8);
element2.append(document.createTextNode("\n          "));

const element9 = document.createElement("li");
element9.append(document.createTextNode("0110!0!101"));
element2.append(element9);
element2.append(document.createTextNode("\n          "));

const element10 = document.createElement("li");
element10.append(document.createTextNode("10!0101!10"));
element2.append(element10);
element2.append(document.createTextNode("\n        "));
element1.append(element2);
element1.append(document.createTextNode("\n      "));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="binary ⭐⭐"}
::: tp-binary
1. 0110!11!00
2. 001!100!11
3. 11001100!
4. 00!11!01!10!
5. 1!00!10!011
6. 1!1001001
7. 01100110!
8. 1!0011001
:::
```

``` example {label="binary ⭐⭐⭐"}
::: tp-binary
1. 0!0!101!10!10!1
2. 10!0100!110!1
3. 1100110010
4. 0011!011!001
5. 0!101!1!01100!
6. 110!010!011!0
7. 1!0100100!11
8. 0101001101
9. 011!0!101!010
10. 101!10!10010
:::
```
::::
:::::
