.. tp-restructuredtext-viewer::
   :label: tp-sql-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            The query lists three European capitals. Expand the query in the result panel to see its rows.

            .. tp-sql-viewer::
               :src: /docs/components/_shared/intro-projects/sql.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/box/box.js";
            import "/components/sql-viewer/sql-viewer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-box");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("p");
            element2.append(document.createTextNode("The query lists three European capitals. Expand the query in the result panel to see its rows."));
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element3 = document.createElement("tp-sql-viewer");
            element3.setAttribute("src", "/docs/components/_shared/intro-projects/sql.json");
            element1.append(element3);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: src

         .. tp-sql-viewer::
            :src: /docs/components/sql-viewer/examples/example.json

      .. example:: script without filename

         .. tp-sql-viewer::

            .. script::
               :type: tp/sql

               CREATE TABLE users (name TEXT NOT NULL);
               INSERT INTO users (name) VALUES ('Ada'), ('Grace');

      .. example:: scripts with filename

         .. tp-sql-viewer::

            .. script::
               :type: tp/sql
               :filename: tables.sql

               CREATE TABLE users (name TEXT NOT NULL);
               INSERT INTO users (name) VALUES ('Ada'), ('Grace');

            .. script::
               :type: tp/sql
               :filename: query.sql

               SELECT name
               FROM users
               ORDER BY name;

      .. example:: error

         .. tp-sql-viewer::

            .. script::
               :type: tp/sql
               :filename: query.sql

               SELECT * FROM missing_table;

      .. example:: Single source file

         .. tp-sql-viewer::
            :src: /docs/components/_shared/single-source/example.sql

      .. example:: Compare presentation modes

         .. role:: example-kbd-1(kbd)

         .. role:: example-kbd-2(kbd)

         .. role:: example-kbd-3(kbd)

         .. role:: example-kbd-4(kbd)

         .. role:: example-kbd-5(kbd)

         .. role:: example-kbd-6(kbd)

         .. section::

            .. heading-level:: 3

            mode="default" — Standard controls
            ==================================

            Open Code to edit the source, then click Run or press :example-kbd-1:`Shift`\ +\ :example-kbd-2:`Enter` in the editor.

            Run the query to trigger an intentional missing-table error and open the console. Comment out the final SELECT and run again to display the successful query.

            .. tp-sql-viewer::
               :mode: default

               .. script::
                  :type: tp/sql
                  :filename: tables.sql

                  -- No setup is needed for this calculation.

               .. script::
                  :type: tp/sql
                  :filename: query.sql

                  SELECT 6 * 7 AS answer;

                  -- Intentional error: comment out the next line to display the calculation.
                  SELECT * FROM intentional_viewer_error;

         .. section::

            .. heading-level:: 3

            mode="lite" — Compact controls
            ==============================

            Open Code to edit the source, then click Run or press :example-kbd-3:`Shift`\ +\ :example-kbd-4:`Enter` in the editor.

            Run the query to trigger an intentional missing-table error and open the console. Comment out the final SELECT and run again to display the successful query.

            .. tp-sql-viewer::
               :mode: lite

               .. script::
                  :type: tp/sql
                  :filename: tables.sql

                  -- No setup is needed for this calculation.

               .. script::
                  :type: tp/sql
                  :filename: query.sql

                  SELECT 6 * 7 AS answer;

                  -- Intentional error: comment out the next line to display the calculation.
                  SELECT * FROM intentional_viewer_error;

         .. section::

            .. heading-level:: 3

            mode="simple" — Editor and rendered output only
            ===============================================

            Edit the code below, keep the cursor in the editor and press :example-kbd-5:`Shift`\ +\ :example-kbd-6:`Enter` (Return) to run it. This viewer has no Run button.

            Run the query to trigger an intentional missing-table error and open the console. Comment out the final SELECT and run again to display the successful query.

            .. tp-sql-viewer::
               :mode: simple

               .. script::
                  :type: tp/sql
                  :filename: tables.sql

                  -- No setup is needed for this calculation.

               .. script::
                  :type: tp/sql
                  :filename: query.sql

                  SELECT 6 * 7 AS answer;

                  -- Intentional error: comment out the next line to display the calculation.
                  SELECT * FROM intentional_viewer_error;

         Programming viewers already have compact controls, so default and lite look alike. The first run may load the language engine.
