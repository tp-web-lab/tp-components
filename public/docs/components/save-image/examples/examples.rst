.. tp-restructuredtext-viewer::
   :label: tp-save-image
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-icon-1(tp-icon)
            :id: intro-save-diagram
            :name: heart
            :size: 5rem
            :aria-label: Heart

         .. tp-box::

            Save this heart icon as an SVG, PNG or WebP image.

            :example-tp-icon-1:`heart`

            .. tp-save-image::
               :anchor: #intro-save-diagram
               :filename: heart
