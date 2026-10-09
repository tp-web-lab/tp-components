Advanced example
================

reStructuredText supports paragraphs, *emphasis*, **strong text**, links_, lists,
tables, and custom components.

.. _links: https://docutils.sourceforge.io/rst.html

Features
--------

* Parsing takes place in the browser with Pyodide and Docutils.
* The resulting document is regular HTML.
* Directives can create standard and custom HTML elements.

========  =============================
Feature   Implementation
========  =============================
Parser    Docutils
Runtime   Pyodide
Output    HTML5
========  =============================

.. tp-callout::
   :variant: info
   :heading: Native component directive
   :closable:

   This ``tp-callout`` is generated directly from reStructuredText.

   .. tp-badge::
      :variant: success
      :pill:

      Ready
