.. tp-restructuredtext-viewer::
   :label: tp-javascript-playground-question
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-javascript-playground-question::
            :open:
            :src: /docs/components/playground-question/examples/javascript/double.js
            :test: /docs/components/playground-question/examples/javascript/double.test.js

            Title
               Double a number

            Prompt
               Complete double so it returns twice its argument. Edit the source, then submit to run the tests.

            Solution
               Return value * 2.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/javascript-playground/javascript-playground.js";
            import "/components/javascript-playground-question/javascript-playground-question.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-javascript-playground-question");
            element1.setAttribute("open", "");
            element1.setAttribute("src", "/docs/components/playground-question/examples/javascript/double.js");
            element1.setAttribute("test", "/docs/components/playground-question/examples/javascript/double.test.js");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("dl");
            element2.append(document.createTextNode("\n    "));

            const element3 = document.createElement("dt");
            element3.append(document.createTextNode("Title"));
            element2.append(element3);

            const element4 = document.createElement("dd");
            element4.append(document.createTextNode("Double a number"));
            element2.append(element4);
            element2.append(document.createTextNode("\n    "));

            const element5 = document.createElement("dt");
            element5.append(document.createTextNode("Prompt"));
            element2.append(element5);

            const element6 = document.createElement("dd");
            element6.append(document.createTextNode("Complete double so it returns twice its argument. Edit the source, then submit to run the tests."));
            element2.append(element6);
            element2.append(document.createTextNode("\n    "));

            const element7 = document.createElement("dt");
            element7.append(document.createTextNode("Solution"));
            element2.append(element7);

            const element8 = document.createElement("dd");
            element8.append(document.createTextNode("Return value * 2."));
            element2.append(element8);
            element2.append(document.createTextNode("\n  "));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);
