.. tp-restructuredtext-viewer::
   :label: tp-switcher
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-switcher::
            :threshold: 35rem
            :gap: 1rem

            .. tp-box::

               1. Plan the content.

            .. tp-box::

               2. Write a draft.

            .. tp-box::

               3. Review the text.

            .. tp-box::

               4. Add illustrations.

            .. tp-box::

               5. Publish the result.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/box/box.js";
            import "/components/switcher/switcher.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-switcher");
            element1.setAttribute("threshold", "35rem");
            element1.setAttribute("gap", "1rem");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("tp-box");
            element2.append(document.createTextNode("1. Plan the content."));
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element3 = document.createElement("tp-box");
            element3.append(document.createTextNode("2. Write a draft."));
            element1.append(element3);
            element1.append(document.createTextNode("\n  "));

            const element4 = document.createElement("tp-box");
            element4.append(document.createTextNode("3. Review the text."));
            element1.append(element4);
            element1.append(document.createTextNode("\n  "));

            const element5 = document.createElement("tp-box");
            element5.append(document.createTextNode("4. Add illustrations."));
            element1.append(element5);
            element1.append(document.createTextNode("\n  "));

            const element6 = document.createElement("tp-box");
            element6.append(document.createTextNode("5. Publish the result."));
            element1.append(element6);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);
