.. tp-restructuredtext-viewer::
   :label: tp-cryptarithm
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-cryptarithm::
            :equation: SEND + MORE = MONEY
            :solution: 9567 + 1085 = 10652

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/cryptarithm/cryptarithm.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-cryptarithm");
            element1.setAttribute("equation", "SEND + MORE = MONEY");
            element1.setAttribute("solution", "9567 + 1085 = 10652");
            example.append(element1);

            document.body.append(example);

      .. example:: UN + UN + NEUF = ONZE

         .. tp-cryptarithm::
            :equation: UN + UN + NEUF = ONZE
            :solution: 81 + 81 + 1987 = 2149

      .. example:: CINQ + CINQ + VINGT = TRENTE

         .. tp-cryptarithm::
            :equation: CINQ + CINQ + VINGT = TRENTE
            :solution: 6483 + 6483 + 94851 = 107817

      .. example:: ZERO + NEUF + NEUF + DOUZE = TRENTE

         .. tp-cryptarithm::
            :equation: ZERO + NEUF + NEUF + DOUZE = TRENTE
            :solution: 9206 + 3257 + 3257 + 86592 = 102312
