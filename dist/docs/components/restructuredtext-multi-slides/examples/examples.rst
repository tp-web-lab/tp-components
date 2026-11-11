.. tp-restructuredtext-viewer::
   :label: tp-restructuredtext-multi-slides
   :allow-script:
   :style: --tp-markup-viewer-frame-min-height: 32rem

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-restructuredtext-multi-slides::
            :repository: /docs/components/restructuredtext-multi-pages/docs

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/restructuredtext/restructuredtext.js";
            import "/components/restructuredtext-multi-slides/restructuredtext-multi-slides.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-restructuredtext-multi-slides");
            element1.setAttribute("repository", "/docs/components/restructuredtext-multi-pages/docs");
            example.append(element1);

            document.body.append(example);

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
