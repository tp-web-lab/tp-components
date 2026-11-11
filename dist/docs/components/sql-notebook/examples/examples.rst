.. tp-restructuredtext-viewer::
   :label: tp-sql-notebook
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-sql-notebook::

            .. script::
               :type: tp/markdown

               # Interactive SQL

               Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.

            .. script::
               :type: tp/sql
               :filename: tables.sql

               CREATE TABLE language (name TEXT);
               INSERT INTO language VALUES ('SQL');

            .. script::
               :type: tp/sql
               :filename: query.sql

               SELECT * FROM language;

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/sql-notebook/sql-notebook.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-sql-notebook");
            element1.append(document.createTextNode("\n    "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/markdown");
            element2.textContent = "# Interactive SQL\n\nSelect **Run all cells** to execute the program. Use the code button in a cell to edit its source.";
            element1.append(element2);
            element1.append(document.createTextNode("\n    "));

            const element3 = document.createElement("script");
            element3.setAttribute("type", "tp/sql");
            element3.setAttribute("filename", "tables.sql");
            element3.textContent = "CREATE TABLE language (name TEXT);\nINSERT INTO language VALUES ('SQL');";
            element1.append(element3);
            element1.append(document.createTextNode("\n    "));

            const element4 = document.createElement("script");
            element4.setAttribute("type", "tp/sql");
            element4.setAttribute("filename", "query.sql");
            element4.textContent = "SELECT * FROM language;";
            element1.append(element4);
            element1.append(document.createTextNode("\n  "));
            example.append(element1);

            document.body.append(example);
