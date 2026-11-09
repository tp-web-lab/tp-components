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
