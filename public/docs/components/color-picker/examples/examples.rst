.. tp-restructuredtext-viewer::
   :label: tp-color-picker
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-color-picker::

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/color/color.js";
            import "/components/color-picker/color-picker.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-color-picker");
            example.append(element1);

            document.body.append(example);
