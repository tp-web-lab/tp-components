reStructuredText basic example
==============================

.. contents:: Table of contents
   :depth: 3

Introduction
------------

This document demonstrates the main reStructuredText features.

This paragraph contains **bold text**, *italic text* and
``inline code``.

You can also combine **bold and *italic*** formatting.

Links
-----

External links:

- https://docutils.sourceforge.io/
- https://www.sphinx-doc.org/

Named links:

- `Python <https://www.python.org/>`_
- `Pyodide <https://pyodide.org/>`_

Admonitions
-----------

.. note::

   This is a standard note admonition.

.. warning::

   This is a warning admonition.

.. success::

   Custom success admonition.

.. info::

   Custom info admonition.

.. danger::

   Custom danger admonition.

Lists
-----

Unordered list
~~~~~~~~~~~~~~

- HTML
- CSS
- JavaScript

  - DOM
  - Events
  - Fetch API

Ordered list
~~~~~~~~~~~~

1. Install dependencies
2. Start the dev server
3. Open the browser

Definition list
~~~~~~~~~~~~~~~

HTML
  Structures the document.

CSS
  Styles the document.

JavaScript
  Adds behavior to the document.

Tables
------

Simple table
~~~~~~~~~~~~

======= ======= ==========
Name    Type    Language
======= ======= ==========
index   file    HTML
main    file    JavaScript
style   file    CSS
======= ======= ==========

List table
~~~~~~~~~~

.. list-table:: Technologies
   :header-rows: 1

   * - Name
     - Category
     - Purpose
   * - Lit
     - Library
     - Web components
   * - Vite
     - Tool
     - Development server
   * - Vitest
     - Tool
     - Testing

CSV table
~~~~~~~~~

.. csv-table:: Browser support
   :header: "Browser", "Engine", "Supported"

   "Firefox", "Gecko", "Yes"
   "Chrome", "Blink", "Yes"
   "Safari", "WebKit", "Yes"

Code blocks
-----------

JavaScript
~~~~~~~~~~

.. code-block:: javascript

   function greet(name) {
       console.log(`Hello ${name}`);
   }

   greet('world');

Python
~~~~~~

.. code-block:: python

   def greet(name: str) -> None:
       print(f"Hello {name}")

   greet("world")

HTML
~~~~

.. code-block:: html

   <section class="card">
     <h2>Hello</h2>
   </section>

Sections
--------

Level 2 section
~~~~~~~~~~~~~~~~

Lorem ipsum dolor sit amet.

Level 3 section
^^^^^^^^^^^^^^^

Nested section content.

Include
-------

The following file is included dynamically:

.. include:: includes/example.rst