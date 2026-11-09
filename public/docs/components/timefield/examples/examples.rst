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

      .. example:: Inline named field

         .. role:: example-tp-timefield-1(tp-timefield)
            :value: 14:30
            :placeholder: Enter a value

         Value: :example-tp-timefield-1:`identifier`
