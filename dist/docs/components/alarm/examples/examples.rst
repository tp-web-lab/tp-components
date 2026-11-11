.. tp-restructuredtext-viewer::
   :label: tp-alarm
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-alarm::

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/alarm/alarm.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-alarm");
            example.append(element1);

            document.body.append(example);
