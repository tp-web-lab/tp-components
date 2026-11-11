.. tp-restructuredtext-viewer::
   :label: tp-markdown-single-page
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-markdown-single-page::

            .. script::
               :type: tp/markdown

               ## A short guide

               This document is rendered as a single page.

               ### Getting started

               - Read the introduction
               - Try a component

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/markdown/markdown.js";
            import "/components/markdown-single-page/markdown-single-page.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-markdown-single-page");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/markdown");
            element2.textContent = "\n## A short guide\n\nThis document is rendered as a single page.\n\n### Getting started\n\n- Read the introduction\n- Try a component\n  ";
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);
