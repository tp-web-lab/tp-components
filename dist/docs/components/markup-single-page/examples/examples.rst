.. tp-restructuredtext-viewer::
   :label: tp-markup-single-page
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-markup-single-page::

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

            import "/components/markup-single-page/markup-single-page.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-markup-single-page");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/markdown");
            element2.textContent = "\n## A short guide\n\nThis document is rendered as a single page.\n\n### Getting started\n\n- Read the introduction\n- Try a component\n  ";
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Toolbar controls

         .. h3::

            Complete toolbar

         .. tp-markup-single-page::
            :toolbar:

            .. script::
               :type: tp/markdown

               ## Reading tools
               Open the source, calculator or annotations; try the color and theme controls.

         .. h3::

            Selected controls

         .. tp-markup-single-page::
            :toolbar: code,calc,theme

            .. script::
               :type: tp/markdown

               ## A smaller toolbar
               Only Code, Calculator and Theme are available here.
