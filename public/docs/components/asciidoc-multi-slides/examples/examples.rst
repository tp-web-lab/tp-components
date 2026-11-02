.. tp-restructuredtext-viewer::
   :label: tp-asciidoc-multi-slides
   :allow-script:
   :style: --tp-markup-viewer-frame-min-height: 32rem

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-asciidoc-multi-slides::
            :repository: /docs/components/asciidoc-multi-pages/docs

      .. example:: Automatic notes

         .. tp-asciidoc-multi-slides::
            :repository: /docs/components/markup-multi-slides/automatic/adoc
            :auto: notes
            :timing: 5000
            :label: Automatic notes

      .. example:: Timed steps

         .. tp-asciidoc-multi-slides::
            :repository: /docs/components/markup-multi-slides/automatic/adoc
            :auto: timing
            :timing: 5000
            :label: Timed steps
