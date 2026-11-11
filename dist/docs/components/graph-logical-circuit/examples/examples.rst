.. tp-restructuredtext-viewer::
   :label: tp-graph-logical-circuit
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-graph-logical-circuit::
            :id: logic-example
            :grid:
            :grid-size: 20
            :src: /docs/components/graph-logical-circuit/examples/xor.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/graph-logical-circuit/graph-logical-circuit.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-graph-logical-circuit");
            element1.setAttribute("id", "logic-example");
            element1.setAttribute("grid", "");
            element1.setAttribute("grid-size", "20");
            element1.setAttribute("src", "/docs/components/graph-logical-circuit/examples/xor.json");
            example.append(element1);

            document.body.append(example);
