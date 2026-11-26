import { textEnvironmentExamples } from "./markup-text-environment-fixtures.js";
export const packageExamples = {
	textEnvironments: Object.values(textEnvironmentExamples).join("\n\n"),
	arrayTabularx: String.raw`\usepackage{array,tabularx}
\newcolumntype{Y}{>{\raggedright\arraybackslash}X}
\newcolumntype{P}[1]{>{\bfseries}p{#1}}
\begin{tabularx}{\linewidth}{|P{7em}|Y|X|}
\hline
Item & Description & Comment\\\hline
\multicolumn{2}{|c|}{Two combined columns} & Last\\\hline
Detail & A flexible paragraph column & Resize the preview\\\hline
\end{tabularx}

\begin{tabular}{p{8em}m{8em}b{8em}}
First line\newline Second line & Middle & Bottom
\end{tabular}`,
	imakeidx: String.raw`\usepackage{imakeidx}
\makeindex[title={Subject index},intoc]
\makeindex[name=people,title={People}]

\section*{Linear algebra}
A matrix\index{matrix} represents a linear map.
A square matrix\index{matrix!square} has equal dimensions.
A diagonal matrix\index{matrix!square!diagonal} is a special case.
Matrices\index{matrix} also describe transformations.
The term array\index{array|see{matrix}} refers to matrices here.
Vectors\index{vector|seealso{matrix}} provide another viewpoint.

\section*{People}
Leonhard Euler\index[people]{euler@Leonhard Euler} and
Emmy Noether\index[people]{noether@Emmy Noether} contributed to algebra.

\printindex
\printindex[people]`,
	coreMath: String.raw`Inline \begin{math}x^2+1\end{math} expression.

\begin{displaymath}
\begin{pmatrix}1 & 2 \\ 3 & 4\end{pmatrix}
\end{displaymath}

\begin{eqnarray}
a & = & b \label{first} \\
c & = & d \nonumber \\
e & = & f\label{second}
\end{eqnarray}
See equations \eqref{first} and \eqref{second}.

\begin{eqnarray*}
x & = & y + z \\
x - y & = & z
\end{eqnarray*}`,
	amsmath: String.raw`\usepackage{amsmath}
See \eqref{quadratic} below.
\begin{equation}E=mc^2\label{energy}\end{equation}
\begin{align}
y &= d\\
y &= cx+d\nonumber\\
y &= bx^2+cx+d\label{quadratic}
\end{align}
Equation \ref{energy} has the first number.
\begin{equation*}
f(n)=\begin{cases}n/2 & \text{if }n\text{ is even}\\-(n+1)/2 & \text{if }n\text{ is odd}\end{cases}
\end{equation*}
\begin{gather}a=b+c\\d=e+f\end{gather}`,
	csquotes: String.raw`\usepackage[french,ngerman,spanish,italian,portuguese,dutch,main=english]{babel}
\usepackage[autostyle=true]{csquotes}
English: \enquote{An outer \enquote{inner \enquote{deep}} quotation.}

French: \foreignquote{french}{Une citation \enquote{dans une \enquote{autre}} citation.}

German: \foreignquote{ngerman}{Ein Zitat \enquote{in einem \enquote{weiteren}} Zitat.}

Spanish: \foreignquote{spanish}{Una cita \enquote{dentro de \enquote{otra}} cita.}

Italian: \foreignquote{italian}{Una citazione \enquote{dentro \enquote{un'altra}} citazione.}

Portuguese: \foreignquote{portuguese}{Uma citação \enquote{dentro de \enquote{outra}} citação.}

Dutch: \foreignquote{dutch}{Een citaat \enquote{in een \enquote{ander}} citaat.}

\enquote*{An inner quotation.}

\begin{displayquote}
A block quotation with \textbf{emphasis}.
\end{displayquote}

\selectlanguage{french}
\enquote{Une citation en français.}`,

	tables: String.raw`\usepackage{tabularray}\begin{tblr}{width=\linewidth,colspec={Q[l,wd=9em] X[r]},row{1}={font=\bfseries},hlines,vlines}Item & Quantity\\Pencil & 30\\\end{tblr}`,
	rules: String.raw`\usepackage{booktabs}\begin{tabular}{lrr}\toprule Scenario & Revenue & Cost\\\midrule Baseline & 120 & 90\\\cmidrule{2-3}Alternative & 150 & 105\\\bottomrule\end{tabular}`,
	lists: String.raw`\usepackage{enumitem}\setlist[enumerate]{label=\Alph*),nosep}\begin{enumerate}[start=3]\item First\begin{itemize}[label=--]\item Nested\end{itemize}\item Second\end{enumerate}\begin{enumerate}[resume]\item Third\end{enumerate}`,
	theorems: String.raw`\usepackage[english]{babel}
\usepackage{amsthm,cleveref}
\newtheorem{theorem}{Theorem}[section]
\theoremstyle{definition}
\newtheorem{definition}[theorem]{Definition}

\section{A simple result}\label{sec:result}

See \cref{thm:square} below, in \Cref{sec:result}.

\begin{definition}\label{def:square}
The square of a real number $x$ is $x^2$.
\end{definition}

\tpAttributes[variant={brand},qed={◆}]{
\begin{theorem}[Nonnegativity]\label{thm:square}
For every real number $x$, we have $x^2\geq 0$.
\end{theorem}
}

\begin{proof}
The product of two numbers with the same sign is nonnegative.
\end{proof}

The shared counter gives Definition \ref{def:square} and Theorem \ref{thm:square}.`,
	units: String.raw`\usepackage{siunitx}\sisetup{locale=FR}\qty{1234.5}{\metre}\qtyrange{2}{5}{\second}`,
	graphics: String.raw`\usepackage{graphicx}\graphicspath{{images/}}\includegraphics[width=180px,height=100px,keepaspectratio,angle=15,trim=1pt 2pt 3pt 4pt,clip,alt={A canoe}]{canoe.svg}`,
	listings: String.raw`\usepackage{listings}\lstdefinestyle{code}{language=JavaScript,numbers=left}\lstinputlisting[style=code,firstline=2,lastline=3,firstnumber=20]{sample.js}\begin{lstlisting}[language=Python]
  print("<literal>")
\end{lstlisting}`,
};

/** Independently authored native sources, rather than generated LaTeX round trips. */
export const nativeLatexSources = {
	html: `<h2 id="results">Results</h2>

<p><strong>Energy</strong> and <a href="#results">results</a>.</p>

<ol start="3" type="A">
  <li>First</li>
  <li>Second</li>
</ol>

<table>
  <thead>
    <tr>
      <th>Item</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Energy</td>
      <td style="text-align:right;vertical-align:middle"><tp-math value="E=mc^2"></tp-math></td>
    </tr>
  </tbody>
</table>

<pre><code class="language-python">if ready:
  print("ready")</code></pre>

<p><img src="sample.svg" alt="Diagram" width="120"></p>`,
	markdown:
		'## Results {#results}\n\n**Energy** and [results](#results).\n\n3. First\n4. Second\n{type=A}\n\n| Item | Value |\n| :--- | ---: |\n| Energy | :tp-math:` E=mc^2 `{} |\n\n```python\nif ready:\n  print("ready")\n```\n\n![Diagram](sample.svg){width=120}',
	asciidoc:
		'[[results]]\n== Results\n\n*Energy* and <<results,results>>.\n\n[upperalpha,start=3]\n. First\n. Second\n\n[cols="<,>",options="header"]\n|===\n|Item |Value\n|Energy |latexmath:[E=mc^2]\n|===\n\n[source,python]\n----\nif ready:\n  print("ready")\n----\n\nimage::sample.svg[Diagram,120]',
	restructuredtext:
		'.. _results:\n\nResults\n=======\n\n**Energy** and `results <#results>`__.\n\nC. First\nD. Second\n\n.. list-table::\n   :header-rows: 1\n\n   * - Item\n     - Value\n   * - Energy\n     - :math:`E=mc^2`\n\n.. code-block:: python\n\n   if ready:\n     print("ready")\n\n.. image:: sample.svg\n   :alt: Diagram\n   :width: 120px',
};
