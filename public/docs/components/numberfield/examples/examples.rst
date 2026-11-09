.. tp-restructuredtext-viewer::
   :label: tp-numberfield
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-cluster::

            .. tp-numberfield::
               :label: Quantity
               :value: 3
               :min: 0
               :max: 10
               :clearable:

            .. tp-numberfield::
               :label: Level
               :value: 40
               :min: 0
               :max: 100
               :step: 5
               :range:
               :clearable:

      .. example:: Inline named field

         .. role:: example-tp-numberfield-1(tp-numberfield)
            :value: 12
            :placeholder: Enter a value

         Value: :example-tp-numberfield-1:`identifier`
