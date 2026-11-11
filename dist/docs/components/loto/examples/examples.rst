.. tp-restructuredtext-viewer::
   :label: tp-loto
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-loto::

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/loto/loto.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-loto");
            example.append(element1);

            document.body.append(example);
