.. tp-restructuredtext-viewer::
   :label: tp-include
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-include::
            :src: /docs/components/include/examples/welcome.html
            :loading: Loading the shared notice…

      .. example:: Raw HTML

         .. tp-include::
            :src: /docs/components/include/examples/welcome.html
            :mode: raw

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/include/include.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-include");
            element1.setAttribute("src", "/docs/components/include/examples/welcome.html");
            element1.setAttribute("loading", "Loading the shared notice…");
            example.append(element1);

            document.body.append(example);

      .. example:: Converted Markdown

         .. tp-include::
            :src: /docs/components/include/examples/notice.md

      .. example:: Raw Markdown

         .. tp-include::
            :src: /docs/components/include/examples/notice.md
            :mode: raw

      .. example:: Converted AsciiDoc

         .. tp-include::
            :src: /docs/components/include/examples/notice.adoc

      .. example:: Raw AsciiDoc

         .. tp-include::
            :src: /docs/components/include/examples/notice.adoc
            :mode: raw

      .. example:: Converted LaTeX

         .. tp-include::
            :src: /docs/components/include/examples/notice.tex

      .. example:: Raw LaTeX

         .. tp-include::
            :src: /docs/components/include/examples/notice.tex
            :mode: raw

      .. example:: Converted reStructuredText

         .. tp-include::
            :src: /docs/components/include/examples/notice.rst

      .. example:: Raw reStructuredText

         .. tp-include::
            :src: /docs/components/include/examples/notice.rst
            :mode: raw
