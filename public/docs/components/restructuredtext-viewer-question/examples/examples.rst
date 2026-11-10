.. tp-restructuredtext-viewer::
   :label: tp-restructuredtext-viewer-question
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-restructuredtext-viewer-question::
            :open:
            :src: /docs/components/markup-viewer-question/examples/emphasis.rst
            :test: /docs/components/markup-viewer-question/examples/emphasis.test.js

            Title
               Semantic emphasis

            Prompt
               Mark Hello with strong emphasis. Open Code to edit, then submit.

            Solution
               Use the language's strong-emphasis syntax.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/restructuredtext/restructuredtext.js";
            import "/components/restructuredtext-viewer/restructuredtext-viewer.js";
            import "/components/restructuredtext-viewer-question/restructuredtext-viewer-question.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-restructuredtext-viewer-question");
            element1.setAttribute("open", "");
            element1.setAttribute("src", "/docs/components/markup-viewer-question/examples/emphasis.rst");
            element1.setAttribute("test", "/docs/components/markup-viewer-question/examples/emphasis.test.js");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("dl");
            element2.append(document.createTextNode("\n    "));

            const element3 = document.createElement("dt");
            element3.append(document.createTextNode("Title"));
            element2.append(element3);

            const element4 = document.createElement("dd");
            element4.append(document.createTextNode("Semantic emphasis"));
            element2.append(element4);
            element2.append(document.createTextNode("\n    "));

            const element5 = document.createElement("dt");
            element5.append(document.createTextNode("Prompt"));
            element2.append(element5);

            const element6 = document.createElement("dd");
            element6.append(document.createTextNode("Mark Hello with strong emphasis. Open Code to edit, then submit."));
            element2.append(element6);
            element2.append(document.createTextNode("\n    "));

            const element7 = document.createElement("dt");
            element7.append(document.createTextNode("Solution"));
            element2.append(element7);

            const element8 = document.createElement("dd");
            element8.append(document.createTextNode("Use the language's strong-emphasis syntax."));
            element2.append(element8);
            element2.append(document.createTextNode("\n  "));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);
