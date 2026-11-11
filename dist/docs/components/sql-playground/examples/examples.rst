.. tp-restructuredtext-viewer::
   :label: tp-sql-playground
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            The query lists three European capitals. Expand the query in the result panel to see its rows.

            .. tp-sql-playground::
               :src: /docs/components/_shared/intro-projects/sql.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/box/box.js";
            import "/components/sql-playground/sql-playground.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-box");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("p");
            element2.append(document.createTextNode("The query lists three European capitals. Expand the query in the result panel to see its rows."));
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element3 = document.createElement("tp-sql-playground");
            element3.setAttribute("src", "/docs/components/_shared/intro-projects/sql.json");
            element1.append(element3);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Single source file

         .. tp-sql-playground::
            :src: /docs/components/_shared/single-source/example.sql
