.. tp-restructuredtext-viewer::
   :label: tp-calculator
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-calculator::

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/calculator/calculator.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-calculator");
            example.append(element1);

            document.body.append(example);
