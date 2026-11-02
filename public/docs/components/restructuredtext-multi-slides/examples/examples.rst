.. tp-restructuredtext-viewer::
   :label: tp-restructuredtext-multi-slides
   :allow-script:
   :style: --tp-markup-viewer-frame-min-height: 32rem

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-restructuredtext-multi-slides::
            :repository: /docs/components/restructuredtext-multi-pages/docs

      .. example:: Automatic notes

         .. tp-restructuredtext-multi-slides::
            :repository: /docs/components/markup-multi-slides/automatic/rst
            :auto: notes
            :timing: 5000
            :label: Automatic notes

      .. example:: Timed steps

         .. tp-restructuredtext-multi-slides::
            :repository: /docs/components/markup-multi-slides/automatic/rst
            :auto: timing
            :timing: 5000
            :label: Timed steps
