.. tp-restructuredtext-viewer::
   :label: tp-html-multi-slides
   :allow-script:
   :style: --tp-markup-viewer-frame-min-height: 32rem

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-html-multi-slides::
            :repository: /docs/components/html-multi-pages/docs

      .. example:: Automatic notes

         .. tp-html-multi-slides::
            :repository: /docs/components/markup-multi-slides/automatic/html
            :auto: notes
            :timing: 5000
            :label: Automatic notes

      .. example:: Timed steps

         .. tp-html-multi-slides::
            :repository: /docs/components/markup-multi-slides/automatic/html
            :auto: timing
            :timing: 5000
            :label: Timed steps
