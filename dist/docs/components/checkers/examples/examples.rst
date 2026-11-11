.. tp-restructuredtext-viewer::
   :label: tp-checkers
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-checkers::
            :position: W:W32,34,K46:B17,19,K5
            :draggable-pieces:

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/checkers/checkers.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-checkers");
            element1.setAttribute("position", "W:W32,34,K46:B17,19,K5");
            element1.setAttribute("draggable-pieces", "");
            example.append(element1);

            document.body.append(example);

      .. example:: Majority capture

         .. tp-checkers::
            :position: W:W32,34:B17,27,29
            :draggable-pieces:

      .. example:: Flying kings

         .. tp-checkers::
            :position: W:WK32:B27,38
            :draggable-pieces:

      .. example:: Crowning a man

         .. tp-checkers::
            :position: W:W7:B40
            :draggable-pieces:
