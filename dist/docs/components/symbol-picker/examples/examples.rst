.. tp-restructuredtext-viewer::
   :label: tp-symbol-picker
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-symbol-picker::

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/symbol-picker/symbol-picker.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-symbol-picker");
            example.append(element1);

            document.body.append(example);
