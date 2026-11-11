.. tp-restructuredtext-viewer::
   :label: tp-emoji-picker
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-emoji-picker::

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/emoji-picker/emoji-picker.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-emoji-picker");
            example.append(element1);

            document.body.append(example);
