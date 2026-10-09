# Markdown music

[[toc]]

This example demonstrates the `Music` extension based on `abcjs`.

ABC notation is written as plain text and rendered dynamically as sheet music.

---

## Simple melody

:::music

X:1
T:Simple scale
C:Traditional
M:4/4
L:1/4
Q:1/4=120
K:C
C D E F | G A B c |]

:::

---

## Playable melody

:::music play

X: 1
T: Cooley's
M: 4/4
L: 1/8
R: reel
K: Emin
|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|
EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|
|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|
eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:|

:::

---

## Chords

:::music play

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

:::

---

## Two voices

:::music play

X:4
T:Two voices
M:4/4
L:1/4
K:C
V:1 clef=treble name="Melody"
V:2 clef=bass name="Bass"
[V:1] C D E F | G A B c |]
[V:2] C,,2 G,,2 | C,2 G,,2 |]

:::

---

## Rhythm example

:::music play

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

:::

---

## Guitar tablature

:::music play tablature instrument=guitar

X:6
T:Guitar tablature
M:4/4
L:1/4
K:C
C D E F |
G A B c |

:::

---

## Ukulele tablature

:::music play tablature instrument=ukulele

X:7
T:Ukulele example
M:4/4
L:1/4
K:G
G A B c |
d e f g |

:::

---

## Mandolin tablature

:::music play tablature instrument=mandolin

X:8
T:Mandolin example
M:2/4
L:1/8
K:D
D E F G |
A B c d |

:::

---

## Save options

Each playable score provides:

- audio playback
- synchronized note highlighting
- SVG export
- MIDI export
- PDF printing

through the `Save as...` menu.