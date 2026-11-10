.. tp-restructuredtext-viewer::
   :label: tp-puzzle
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-puzzle::
            :src: /docs/components/puzzle/examples/landscape.svg
            :pieces: 12
            :alt: Mountain lake at sunrise

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/puzzle/puzzle.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-puzzle");
            element1.setAttribute("src", "/docs/components/puzzle/examples/landscape.svg");
            element1.setAttribute("pieces", "12");
            element1.setAttribute("alt", "Mountain lake at sunrise");
            example.append(element1);

            document.body.append(example);

      .. example:: Square pieces

         .. tp-puzzle::
            :src: /docs/components/puzzle/examples/landscape.svg
            :pieces: 9
            :shape: square
            :exact-orientation:
            :alt: Mountain lake at sunrise

      .. example:: Triangular pieces

         .. tp-puzzle::
            :src: /docs/components/puzzle/examples/landscape.svg
            :pieces: 12
            :shape: triangle
            :alt: Mountain lake at sunrise

      .. example:: Hexagonal pieces

         .. tp-puzzle::
            :src: /docs/components/puzzle/examples/landscape.svg
            :pieces: 13
            :shape: hexagon
            :alt: Mountain lake at sunrise
