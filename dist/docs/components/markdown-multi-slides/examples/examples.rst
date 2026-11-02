.. tp-restructuredtext-viewer::
   :label: tp-markdown-multi-slides
   :allow-script:
   :style: --tp-markup-viewer-frame-min-height: 32rem

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-markdown-multi-slides::
            :repository: /docs/components/markdown-multi-pages/docs

      .. example:: Automatic notes

         .. tp-markdown-multi-slides::
            :repository: /docs/components/markup-multi-slides/automatic/md
            :auto: notes
            :timing: 5000
            :label: Automatic notes

      .. example:: Timed steps

         .. tp-markdown-multi-slides::
            :repository: /docs/components/markup-multi-slides/automatic/md
            :auto: timing
            :timing: 5000
            :label: Timed steps
