.. tp-restructuredtext-viewer::
   :label: tp-clock
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-clock::

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/clock/clock.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-clock");
            example.append(element1);

            document.body.append(example);
