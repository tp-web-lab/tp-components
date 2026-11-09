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
