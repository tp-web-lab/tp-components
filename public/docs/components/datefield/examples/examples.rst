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

      .. example:: Inline named field

         .. role:: example-tp-datefield-1(tp-datefield)
            :value: 2026-10-05
            :placeholder: Enter a value

         Value: :example-tp-datefield-1:`identifier`
