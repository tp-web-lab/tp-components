# TikZJax v1 — local text, UTF-8 and font-metric corrections

Upstream project: https://github.com/kisonecat/tikzjax (Jim Fowler).
Bundle retrieved from https://tikzjax.com/v1/tikzjax.js on 2026-11-06.
Upstream SHA-256: `48917188eb3485e7a22954d979ea36414a2c8d4fd81a7c69cd90a78c2126b21c`.

The original bundle is retained unchanged in `vendor/tikzjax-v1.upstream.js`.
The build produces a distinct `dist/tikzjax-tp.js`. The SVG text correction adds `fill="${this.color || "inherit"}"` to SVG text in dvi2html's `putText`.
HTML text output and TeX source are unchanged. The generated file drops the
upstream source-map reference, which would not resolve at its new location.

TikZJax's license is reproduced in TikZJax-LICENSE.md. This is a modified
bundle, not an official TikZJax release. Its bundled dependencies retain their
respective upstream licenses. TeX WebAssembly, its snapshot and fonts are
still downloaded from the upstream endpoints; this is not an offline bundle.

Reproduce with `npm run build`; the patch verifies the upstream checksum and
requires exactly one match for each patched site before producing the output.

Text-font correction: the separate fonts/fonts.css overrides the 57 BaKoMa
text faces with Unicode cmap mappings matching dvi2html's output. Outlines,
glyph order, advance widths and kerning are retained. Original source:
https://tikzjax.com/bakoma/ttf/ and
https://www.ctan.org/tex-archive/fonts/cm/ps-type1/bakoma .
See BaKoMa-LICENSE.txt (also embedded in the modified font name tables).

UTF-8 correction: writeFileSync now serializes its input Buffer directly with
`toString("base64")`, preserving the UTF-8 bytes prepared by Buffer.from(input).
The former btoa(Buffer) implicitly decoded the bytes to text, corrupting Latin-1
characters and rejecting characters outside Latin-1. No source transliteration
or replacement is performed.

TFM correction: read_characters now includes largest_character_code (ec),
which is an inclusive bound in TFM. This restores the final glyph metrics,
including OT1 dieresis at code 127.

Directional fading extension (tp-latex, MIT): the build injects
`tp-directional-fadings.tex` before the authored input and applies
`tp-directional-fadings.js` after the SVG is inserted. These new files bridge
PGF's usefading interface to SVG alpha masks for the standard south/north/east/west
fades. PGF computes fitting and transformations; SVG scope markers preserve
replacement/restoration semantics. Natural mask size is 100bp with its linear
transition between 25bp and 75bp, matching PGF's standard directional library.
References:
https://github.com/pgf-tikz/pgf/blob/master/tex/generic/pgf/libraries/pgflibraryfadings.code.tex
https://github.com/pgf-tikz/pgf/blob/master/tex/generic/pgf/basiclayer/pgfcoretransparency.code.tex

Graph syntax: the virtual filesystem supplies the unmodified PGF 3.1.10
`tikzlibrarygraphs.code.tex`, absent from the upstream core, before each compilation.
Copyright Till Tantau and Jannis Pohlmann. Distributed under LPPL 1.3c;
see PGF-LPPL-1.3c.txt and vendor/pgf/LICENSE. Source:
https://github.com/pgf-tikz/pgf/blob/3.1.10/tex/generic/pgf/frontendlayer/tikz/libraries/graphs/tikzlibrarygraphs.code.tex

Decorations and animations: supplemental unmodified PGF 3.1.10 sources in
vendor/pgf provide text/path decorations and SVG animations with their dependencies.
These files retain the original copyright headers (Till Tantau, Mark Wibrow and
other credited contributors) and are distributed under LPPL 1.3c.
Sources: https://github.com/pgf-tikz/pgf/tree/3.1.10/tex/generic/pgf
The TP SVG postprocessor restores fill inheritance for PGF text groups targeted
by a fill animation, so explicit dvi2html glyph fills do not hide the animation.
Static text and drawings retain their colors.

Additional examples: the unmodified PGF 3.1.10 turtle, spy, Lindenmayer systems
and fractal decoration libraries are also supplied in the virtual filesystem.
They retain their original copyright headers and are distributed under the
same LPPL 1.3c license. Source paths follow the PGF repository linked above.
