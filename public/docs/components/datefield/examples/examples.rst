.. tp-restructuredtext-viewer::
   :label: tp-datefield
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-datefield::
            :label: Date
            :value: 2026-09-03
            :clearable:

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/datefield/datefield.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-datefield");
            element1.setAttribute("label", "Date");
            element1.setAttribute("value", "2026-09-03");
            element1.setAttribute("clearable", "");
            example.append(element1);

            document.body.append(example);

      .. example:: Inline named field

         .. role:: example-tp-datefield-1(tp-datefield)
            :value: 2026-10-05
            :placeholder: Enter a value

         Value: :example-tp-datefield-1:`identifier`
