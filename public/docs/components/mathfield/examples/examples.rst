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

      .. example:: Inline in prose

         .. role:: example-tp-mathfield-1(tp-mathfield)
            :value: E = mc^2

         Einstein's equation :example-tp-mathfield-1:`energy` relates mass and energy.

      .. example:: Inline named field

         .. role:: example-tp-mathfield-1(tp-mathfield)
            :value: E = mc^2
            :placeholder: Enter a value

         Value: :example-tp-mathfield-1:`identifier`
