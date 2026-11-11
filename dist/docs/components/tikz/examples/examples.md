:::::: tp-markdown-viewer { label="tp-tikz" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-tikz { scale="1.8" label="Linear, sine and exponential functions" }
::: script { type="tp/tikz" }
\begin{tikzpicture}[domain=0:4]
  \draw[very thin,color=gray] (-0.1,-1.1) grid (3.9,3.9);

  \draw[->] (-0.2,0) -- (4.2,0) node[right] {$x$};
  \draw[->] (0,-1.2) -- (0,4.2) node[above] {$f(x)$};

  \draw[color=red]    plot (\x,\x)             node[right] {$f(x) =x$};
  % \x r means to convert '\x' from degrees to _r_adians:
  \draw[color=blue]   plot (\x,{sin(\x r)})    node[right] {$f(x) = \sin x$};
  \draw[color=orange] plot (\x,{0.05*exp(\x)}) node[right] {$f(x) = \frac{1}{20} \mathrm e^x$};
\end{tikzpicture}
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/tikz/tikz.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-tikz");
element1.setAttribute("scale", "1.8");
element1.setAttribute("label", "Linear, sine and exponential functions");

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/tikz");
element2.textContent = "\\begin{tikzpicture}[domain=0:4]\n  \\draw[very thin,color=gray] (-0.1,-1.1) grid (3.9,3.9);\n\n  \\draw[->] (-0.2,0) -- (4.2,0) node[right] {$x$};\n  \\draw[->] (0,-1.2) -- (0,4.2) node[above] {$f(x)$};\n\n  \\draw[color=red]    plot (\\x,\\x)             node[right] {$f(x) =x$};\n  % \\x r means to convert '\\x' from degrees to _r_adians:\n  \\draw[color=blue]   plot (\\x,{sin(\\x r)})    node[right] {$f(x) = \\sin x$};\n  \\draw[color=orange] plot (\\x,{0.05*exp(\\x)}) node[right] {$f(x) = \\frac{1}{20} \\mathrm e^x$};\n\\end{tikzpicture}";
element1.append(element2);
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Trie graph"}
:::: tp-tikz { scale="1.8" label="Trie graph with a highlighted path" libraries="graphs,arrows.meta" }
::: script { type="tp/tikz" }
\colorlet{graphicbackground}{yellow!10}
\tikz [>={To[sep]}, rotate=90, xscale=-1,
       mark/.style={fill=black!50}, mark/.default=]
  \graph [trie, simple,
          nodes={circle,draw},
          edges={nodes={
              inner sep=1pt, anchor=mid,
              fill=graphicbackground}}, % yellowish background
          put node text on incoming edges]
    {
      root[mark] -> {
        a -> n -> {
          g [mark],
          f -> a -> n -> g [mark]
        },
        f -> a -> n -> g [mark],
        g[mark],
        n -> {
          g[mark],
          f -> a -> n -> g[mark]
        }
      },
      { [edges=red] % highlight one path
        root -> f -> a -> n
      }
    };
:::
::::
```

``` example {label="Text decoration"}
:::: tp-tikz { scale="1.8" label="Text decoration" libraries="decorations.pathmorphing,decorations.text,shapes.geometric" }
::: script { type="tp/tikz" }
\begin{tikzpicture}[decoration=zigzag]
  \node at (1.5,1) [inner sep=6mm,fill=red!20,ellipse,
    postaction={decorate,decoration=
    {text along path,text={This is getting silly}}}] {Ellipse};
\end{tikzpicture}
:::
::::
```

``` example {label="Path intersections"}
:::: tp-tikz { scale="1.8" label="Path intersections" libraries="intersections" }
::: script { type="tp/tikz" }
\begin{tikzpicture}[every node/.style={opacity=1, black, above left}]
  \draw [help lines] grid (3,2);
  \draw [name path=ellipse] (2,0.5) ellipse [x radius=0.75cm, y radius=1cm];
  \draw [name path=rectangle, rotate=10] (0.5,0.5) rectangle +(2,1);
  \fill [red, opacity=0.5, name intersections={of=ellipse and rectangle}]
    (intersection-1) circle [radius=2pt] node {1}
    (intersection-2) circle [radius=2pt] node {2};
\end{tikzpicture}
:::
::::
```

``` example {label="Orbital animation"}
:::: tp-tikz { scale="1.8" label="Orbital animation" libraries="animations" }
::: script { type="tp/tikz" }
\begin{tikzpicture}[
    animate/orbit/.style 2 args = {
        myself:shift = {
          along = {
            (0,0) circle [radius=#1]
          } sloped in #2s/10,
          repeats }} ]

 \node :color = {0s = "orange",
                 2s = "red",
                 4s = "orange",
                 repeats}
       {Sun};

  \begin{scope}[animate={orbit={2.5cm}{365}}]
    \node {Earth};
    \node [animate={orbit={1cm}{28}}] {Moon};
  \end{scope}

  \useasboundingbox (-3.8,-3.8) (3.8,3.8);
\end{tikzpicture}
:::
::::
```

``` example {label="Turtle star"}
:::: tp-tikz { scale="1.8" label="Turtle star" libraries="turtle" }
::: script { type="tp/tikz" }
\tikz \filldraw [thick,blue,fill=blue!20]
  [turtle=home]
  \foreach \i in {1,...,5}
  {
    [turtle={forward,right=144}]
  };
:::
::::
```

``` example {label="Spy magnification"}
:::: tp-tikz { scale="1.8" label="Spy magnification" libraries="decorations.fractals,spy" }
::: script { type="tp/tikz" }
\begin{tikzpicture}
  \begin{scope}
    [spy using outlines={circle, magnification=3, size=2cm, connect spies}]

    \draw [decoration=Koch curve type 1]
      decorate{ decorate{ decorate{ (0,0) -- (2,0) }}};

    \spy [red] on (1.6,0.3) in node (a) [left] at (3.5,-1.25);

    \spy [blue, size=1cm] on (1,1) in node (b) [right] at (0,-1.25);
  \end{scope}
  \draw [ultra thick, green!50!black] (b) -- (a.north west);
\end{tikzpicture}
:::
::::
```

``` example {label="Lindenmayer tree"}
:::: tp-tikz { scale="1.8" label="Lindenmayer tree" libraries="lindenmayersystems" }
::: script { type="tp/tikz" }
\begin{tikzpicture}
\draw [green!50!black, rotate=90]
  [l-system={rule set={F -> FF-[-F+F]+[+F-F]}, axiom=F, order=4, step=2pt,
   randomize step percent=25, angle=30, randomize angle percent=5}]
  lindenmayer system;
\end{tikzpicture}
:::
::::
```

``` example {label="Metallic discs"}
:::: tp-tikz { scale="1.8" label="Three stacked metallic discs" }
::: script { type="tp/tikz" }
\begin{tikzpicture}
\tikzset{
  pics/.cd,
  disc/.style = {
    code = {
      \fill [white] ellipse [x radius = 2, y radius = 2/3];
      \path [left color = black!50, right color = black!50,
        middle color = black!25]
        (-2+.05,-1.1) arc (180:360:2-.05 and 2/3-.05*2/3) -- cycle;
      \path [top color = black!25, bottom color = white]
        (0,.05*2/3) ellipse [x radius = 2-.05, y radius = 2/3-.05*2/3];
      \path [left color = black!25, right color = black!25,
        middle color = white] (-2,0) -- (-2,-1) arc (180:360:2 and 2/3)
        -- (2,0) arc (360:180:2 and 2/3);
      \foreach \r in {225,315}
        \foreach \i [evaluate = {\s=30;}] in {0,2,...,30}
          \fill [black, fill opacity = 1/50]
            (0,0) -- (\r+\s-\i:2 and 2/3) -- ++(0,-1)
            arc (\r+\s-\i:\r-\s+\i:2 and 2/3) -- ++(0,1) -- cycle;
      \foreach \r in {45,135}
        \foreach \i [evaluate = {\s=30;}] in {0,2,...,30}
          \fill [black, fill opacity = 1/50]
            (0,0) -- (\r+\s-\i:2 and 2/3)
            arc (\r+\s-\i:\r-\s+\i:2 and 2/3) -- cycle;
    }
  },
  disc bottom/.style = {
    code = {
      \foreach \i in {0,2,...,30}
        \fill [black, fill opacity = 1/60] (0,-1.1)
          ellipse [x radius = 2+\i/40, y radius = 2/3+\i/60];
      \path pic {disc};
    }
  }
}
\path (0,0) pic {disc bottom} (0,1.25) pic {disc} (0,2.5) pic {disc};
\end{tikzpicture}
:::
::::
```
:::::
::::::
