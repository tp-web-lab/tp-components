.. tp-restructuredtext-viewer::
   :label: tp-graph-petri
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-graph-petri::
            :id: petri-intro
            :grid:
            :grid-size: 20
            :src: /docs/components/graph-petri/examples/petri-intro.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/graph-petri/graph-petri.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-graph-petri");
            element1.setAttribute("id", "petri-intro");
            element1.setAttribute("grid", "");
            element1.setAttribute("grid-size", "20");
            element1.setAttribute("src", "/docs/components/graph-petri/examples/petri-intro.json");
            example.append(element1);

            document.body.append(example);
