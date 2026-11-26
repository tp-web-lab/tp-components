.. tp-restructuredtext-viewer::
   :label: tp-carousel
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-carousel::
            :aria-label: Outdoor activities
            :height: 18rem

            .. image:: /docs/medias/images/canoe.svg
               :alt: Canoe

            .. image:: /docs/medias/images/basketball.svg
               :alt: Basketball

            .. image:: /docs/medias/images/walking-shoe.svg
               :alt: Walking shoe

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/carousel/carousel.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-carousel");
            element1.setAttribute("aria-label", "Outdoor activities");
            element1.setAttribute("height", "18rem");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("img");
            element2.setAttribute("src", "/docs/medias/images/canoe.svg");
            element2.setAttribute("alt", "Canoe");
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element3 = document.createElement("img");
            element3.setAttribute("src", "/docs/medias/images/basketball.svg");
            element3.setAttribute("alt", "Basketball");
            element1.append(element3);
            element1.append(document.createTextNode("\n  "));

            const element4 = document.createElement("img");
            element4.setAttribute("src", "/docs/medias/images/walking-shoe.svg");
            element4.setAttribute("alt", "Walking shoe");
            element1.append(element4);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Vertical navigation

         .. tp-carousel::
            :orientation: vertical
            :aria-label: Outdoor activities
            :height: 18rem

            .. image:: /docs/medias/images/canoe.svg
               :alt: Canoe

            .. image:: /docs/medias/images/basketball.svg
               :alt: Basketball

            .. image:: /docs/medias/images/walking-shoe.svg
               :alt: Walking shoe

      .. example:: Looping navigation

         .. tp-carousel::
            :loop:
            :index: 2
            :aria-label: Outdoor activities
            :height: 18rem

            .. image:: /docs/medias/images/canoe.svg
               :alt: Canoe

            .. image:: /docs/medias/images/basketball.svg
               :alt: Basketball

            .. image:: /docs/medias/images/walking-shoe.svg
               :alt: Walking shoe

      .. example:: Automatic scrolling and hover pause

         Hover over the carousel to pause the movement. Move the pointer away to resume from the same position.

         .. tp-carousel::
            :auto: 3000
            :transition: start-to-end
            :hide-controls:
            :aria-label: TP markup languages
            :height: 3em

            .. html-figure::

               .. role:: carousel-logo-html(tp-icon)
                  :name: tp-html-logo
                  :library: tp
                  :size: 3em
                  :role: img
                  :aria-label: TP HTML

               :carousel-logo-html:`HTML`

            .. html-figure::

               .. role:: carousel-logo-asciidoc(tp-icon)
                  :name: tp-asciidoc-logo
                  :library: tp
                  :size: 3em
                  :role: img
                  :aria-label: TP AsciiDoc

               :carousel-logo-asciidoc:`AsciiDoc`

            .. html-figure::

               .. role:: carousel-logo-latex(tp-icon)
                  :name: tp-latex-logo
                  :library: tp
                  :size: 3em
                  :role: img
                  :aria-label: TP LaTeX

               :carousel-logo-latex:`LaTeX`

            .. html-figure::

               .. role:: carousel-logo-markdown(tp-icon)
                  :name: tp-markdown-logo
                  :library: tp
                  :size: 3em
                  :role: img
                  :aria-label: TP Markdown

               :carousel-logo-markdown:`Markdown`

            .. html-figure::

               .. role:: carousel-logo-restructuredtext(tp-icon)
                  :name: tp-restructuredtext-logo
                  :library: tp
                  :size: 3em
                  :role: img
                  :aria-label: TP reStructuredText

               :carousel-logo-restructuredtext:`reStructuredText`
