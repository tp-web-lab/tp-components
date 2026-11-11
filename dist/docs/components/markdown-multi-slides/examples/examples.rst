.. tp-restructuredtext-viewer::
   :label: tp-markdown-multi-slides
   :allow-script:
   :style: --tp-markup-viewer-frame-min-height: 32rem

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-markdown-multi-slides::
            :repository: /docs/components/markdown-multi-pages/docs

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/markdown/markdown.js";
            import "/components/markdown-multi-slides/markdown-multi-slides.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-markdown-multi-slides");
            element1.setAttribute("repository", "/docs/components/markdown-multi-pages/docs");
            example.append(element1);

            document.body.append(example);

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
