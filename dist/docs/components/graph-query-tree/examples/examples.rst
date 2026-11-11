.. tp-restructuredtext-viewer::
   :label: tp-graph-query-tree
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-graph-query-tree::
            :grid:
            :grid-size: 20
            :message: Select an operator to edit its relational expression.
            :src: /docs/components/graph-query-tree/examples/employees-departments.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/graph-query-tree/graph-query-tree.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-graph-query-tree");
            element1.setAttribute("grid", "");
            element1.setAttribute("grid-size", "20");
            element1.setAttribute("message", "Select an operator to edit its relational expression.");
            element1.setAttribute("src", "/docs/components/graph-query-tree/examples/employees-departments.json");
            example.append(element1);

            document.body.append(example);
