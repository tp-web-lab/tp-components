.. tp-restructuredtext-viewer::
   :label: tp-textfield
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-textfield::
            :label: Single line
            :placeholder: Type some text...
            :clearable:

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/textfield/textfield.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-textfield");
            element1.setAttribute("label", "Single line");
            element1.setAttribute("placeholder", "Type some text...");
            element1.setAttribute("clearable", "");
            example.append(element1);

            document.body.append(example);

      .. example:: Inline named field

         .. role:: example-tp-textfield-1(tp-textfield)
            :value: Ada
            :placeholder: Enter a value

         Value: :example-tp-textfield-1:`identifier`

      .. example:: Clearable search

         .. tp-textfield::
            :label: Search
            :value: Garden
            :clearable:
