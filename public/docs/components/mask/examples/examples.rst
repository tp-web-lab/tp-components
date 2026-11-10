.. tp-restructuredtext-viewer::
   :label: tp-mask
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-textfield::
            :id: mask-answer
            :label: Answer
            :value: Thursday
            :clearable:

         .. tp-mask::
            :anchor: #mask-answer
            :active:

            The answer is hidden until the review.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/mask/mask.js";
            import "/components/textfield/textfield.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-textfield");
            element1.setAttribute("id", "mask-answer");
            element1.setAttribute("label", "Answer");
            element1.setAttribute("value", "Thursday");
            element1.setAttribute("clearable", "");
            example.append(element1);
            example.append(document.createTextNode("\n"));

            const element2 = document.createElement("tp-mask");
            element2.setAttribute("anchor", "#mask-answer");
            element2.setAttribute("active", "");
            element2.append(document.createTextNode("The answer is hidden until the review."));
            example.append(element2);

            document.body.append(example);
