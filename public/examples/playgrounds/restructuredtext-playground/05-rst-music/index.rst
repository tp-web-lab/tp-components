reStructuredText music
======================

.. info::

    `ABC notation <https://abcnotation.com/wiki/abc:standard:v2.1>`_ is written as plain text and rendered dynamically by the
    ``music`` extension using `abcjs <https://abcjs.net>`_.

.. contents:: Contents
   :depth: 3
   
Simple melody
--------------

.. music::

   X:1
   T:Simple scale
   C:Traditional
   M:4/4
   L:1/4
   Q:1/4=120
   K:C
   C D E F | G A B c |]

Playable melody
----------------
As regards tablature, only 'fiddle', 'fiveString', 'guitar' (default), 'mandolin' and 'violin' are supported.

.. music::
   :play:
   :tablature:
   :instrument: cello

   .. include:: melody.abc

Chords
------

.. music::
   :play:

   X:3
   T:Chords
   M:4/4
   L:1/4
   Q:1/4=90
   K:C
   "C" C E G c |
   "F" F A c A |
   "G" G B d B |
   "C" c G E C |]

Two voices
----------

.. music::
  :play:

   X:4
   T:Two voices
   M:4/4
   L:1/4
   K:C
   V:1 clef=treble name="Melody"
   V:2 clef=bass name="Bass"
   [V:1] C D E F | G A B c |]
   [V:2] C,,2 G,,2 | C,2 G,,2 |]

Rhythm example
--------------

.. music::
   :play:

   X:5
   T:Rhythm
   M:6/8
   L:1/8
   Q:3/8=120
   K:Dmin
   D2F A2d |
   f2e d2A |
   G2B A2F |
   D6 |]

Inline explanation
------------------

