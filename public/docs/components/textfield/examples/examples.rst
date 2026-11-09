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
