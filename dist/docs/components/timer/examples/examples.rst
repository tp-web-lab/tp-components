.. tp-restructuredtext-viewer::
   :label: tp-timer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-timer::

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/timer/timer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-timer");
            example.append(element1);

            document.body.append(example);
