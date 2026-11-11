.. tp-restructuredtext-viewer::
   :label: tp-list-table
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-list-table::
            :heading:

            -

              - Country

              - Capital

            -

              - Estonia

              - Tallinn

            -

              - Latvia

              - Riga

            -

              - Lithuania

              - Vilnius

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/list-table/list-table.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-list-table");
            element1.setAttribute("heading", "");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("ul");
            element2.append(document.createTextNode("\n    "));

            const element3 = document.createElement("li");

            const element4 = document.createElement("ul");

            const element5 = document.createElement("li");
            element5.append(document.createTextNode("Country"));
            element4.append(element5);

            const element6 = document.createElement("li");
            element6.append(document.createTextNode("Capital"));
            element4.append(element6);
            element3.append(element4);
            element2.append(element3);
            element2.append(document.createTextNode("\n    "));

            const element7 = document.createElement("li");

            const element8 = document.createElement("ul");

            const element9 = document.createElement("li");
            element9.append(document.createTextNode("Estonia"));
            element8.append(element9);

            const element10 = document.createElement("li");
            element10.append(document.createTextNode("Tallinn"));
            element8.append(element10);
            element7.append(element8);
            element2.append(element7);
            element2.append(document.createTextNode("\n    "));

            const element11 = document.createElement("li");

            const element12 = document.createElement("ul");

            const element13 = document.createElement("li");
            element13.append(document.createTextNode("Latvia"));
            element12.append(element13);

            const element14 = document.createElement("li");
            element14.append(document.createTextNode("Riga"));
            element12.append(element14);
            element11.append(element12);
            element2.append(element11);
            element2.append(document.createTextNode("\n    "));

            const element15 = document.createElement("li");

            const element16 = document.createElement("ul");

            const element17 = document.createElement("li");
            element17.append(document.createTextNode("Lithuania"));
            element16.append(element17);

            const element18 = document.createElement("li");
            element18.append(document.createTextNode("Vilnius"));
            element16.append(element18);
            element15.append(element16);
            element2.append(element15);
            element2.append(document.createTextNode("\n  "));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Single column

         .. tp-list-table::
            :heading:

            1. Workshop steps

            2. Read the instructions

            3. Try the example

            4. Compare the results
