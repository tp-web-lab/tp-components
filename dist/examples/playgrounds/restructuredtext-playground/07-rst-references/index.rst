reStructuredText references
===========================

.. contents:: Contents
   :depth: 2

Introduction
------------

This document demonstrates bibliography, glossary and hierarchical index
references.

The playground uses :glossary-entry:`Docutils` to parse reStructuredText.
:index:`Docutils`

It also runs inside :glossary-entry:`Pyodide`, which brings Python to the
browser. :index:`Pyodide`

The :glossary-entry:`directive` mechanism is central to this playground.
:index:`reStructuredText,directives`

A :glossary-entry:`directive` can create blocks such as bibliographies,
glossaries, maps, diagrams and music scores.
:index:`reStructuredText,directives,custom`

Docutils is cited several times: :cite:`docutils`.
It is also useful to cite it again when discussing parsing: :cite:`docutils`.

Pyodide is also cited multiple times: :cite:`pyodide`.
For music rendering, the example refers to :cite:`abcjs` and :cite:`abcnotation`.

This paragraph adds more index entries.
:index:`Docutils,parser`
:index:`Docutils,roles`
:index:`Docutils,directives`
:index:`Pyodide,WebAssembly`
:index:`ABC notation`
:index:`ABC notation,music`
:index:`ABC notation,music,abcjs`

Web bibliography
----------------

.. bibliography::

   .. include:: references/web.rst

Music bibliography
------------------

.. bibliography::

   .. include:: references/music.rst

Glossary
--------

.. glossary::

   .. include:: references/glossary.rst

More references
---------------

The :glossary-entry:`Docutils` processor supports custom roles and directives.
:index:`Docutils`
:index:`Docutils,roles,custom`
:index:`Docutils,directives,custom`

The :glossary-entry:`Pyodide` runtime allows this conversion to happen without
a server.
:index:`Pyodide`
:index:`Pyodide,browser runtime`

The :glossary-entry:`directive` concept appears again here so that the glossary
term is referenced several times.
:index:`reStructuredText,directives`

Music support is based on :glossary-entry:`ABC notation`.
:index:`ABC notation`
:index:`ABC notation,music`

Index
-----

.. index::