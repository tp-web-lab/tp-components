reStructuredText Mermaid
========================

.. contents:: Contents
   :depth: 3

Flowchart
---------

.. mermaid::

   graph TD
     A[Start] --> B{Choice}
     B -->|Yes| C[Continue]
     B -->|No| D[Stop]

Sequence diagram
----------------

.. mermaid::

   sequenceDiagram
     participant User
     participant Browser
     participant Playground
     User->>Browser: Click Run
     Browser->>Playground: Build document
     Playground-->>Browser: Render iframe

Class diagram
-------------

.. mermaid::

   classDiagram
     class TpProject {
       +name
       +entry
       +files
     }

     class TpRestructuredTextProject {
       +libs
       +extensions
     }

     TpProject <|-- TpRestructuredTextProject

State diagram
-------------

.. mermaid::

   stateDiagram-v2
     [*] --> Editing
     Editing --> Running: run()
     Running --> Preview
     Preview --> Editing: edit
     Preview --> [*]

Gantt diagram
-------------

.. mermaid::

   gantt
     title Playground roadmap
     dateFormat  YYYY-MM-DD
     section Core
     Filesystem      :done,    a1, 2026-01-01, 10d
     Playground base :done,    a2, after a1, 10d
     section Languages
     Markdown        :active,  b1, 2026-02-01, 7d
     reStructuredText:         b2, after b1, 7d