.. tp-restructuredtext-viewer::
   :label: tp-chronometer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-chronometer::

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/chronometer/chronometer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-chronometer");
            example.append(element1);

            document.body.append(example);
