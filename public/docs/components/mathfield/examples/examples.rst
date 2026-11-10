.. tp-restructuredtext-viewer::
   :label: tp-mathfield
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-mathfield::
            :label: Formula
            :value: E = mc^2
            :clearable:

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/math/math.js";
            import "/components/mathfield/mathfield.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-mathfield");
            element1.setAttribute("label", "Formula");
            element1.setAttribute("value", "E = mc^2");
            element1.setAttribute("clearable", "");
            example.append(element1);

            document.body.append(example);

      .. example:: Inline in prose

         .. role:: example-tp-mathfield-1(tp-mathfield)
            :value: E = mc^2

         Einstein's equation :example-tp-mathfield-1:`energy` relates mass and energy.

      .. example:: Inline named field

         .. role:: example-tp-mathfield-1(tp-mathfield)
            :value: E = mc^2
            :placeholder: Enter a value

         Value: :example-tp-mathfield-1:`identifier`
