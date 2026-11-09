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
