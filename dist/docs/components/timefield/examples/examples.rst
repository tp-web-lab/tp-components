.. tp-restructuredtext-viewer::
   :label: tp-timefield
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-timefield::
            :label: Time
            :value: 14:30
            :clearable:

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/timefield/timefield.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-timefield");
            element1.setAttribute("label", "Time");
            element1.setAttribute("value", "14:30");
            element1.setAttribute("clearable", "");
            example.append(element1);

            document.body.append(example);

      .. example:: Inline named field

         .. role:: example-tp-timefield-1(tp-timefield)
            :value: 14:30
            :placeholder: Enter a value

         Value: :example-tp-timefield-1:`identifier`
