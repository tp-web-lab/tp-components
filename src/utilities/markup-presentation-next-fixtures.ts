export const presentationCases = [
	{
		name: "3D image and CSS expressions",
		language: "html",
		source:
			'<img src="/medias/image/canoe.svg" alt="3D" width="120" style="transform:perspective(600px) rotateX(calc(20deg + var(--tilt, 5deg))) rotate3d(1, 1, 0, 30deg) translate3d(clamp(0px, 5vw, 30px), min(10px, 2vw), 20px) scale3d(1, 0.8, 1.2)">',
	},
	{
		name: "Matrix3d image",
		language: "html",
		source:
			'<img src="/medias/image/canoe.svg" alt="Matrix" width="120" style="transform:matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1)">',
	},
	{
		name: "Custom cleveref plurals and mixed groups",
		language: "latex",
		source: String.raw`\usepackage[english]{babel}\usepackage{amsthm,cleveref}
\newtheorem{theorem}{Theorem}\crefname{theorem}{result}{results}\Crefname{theorem}{Result}{Results}
See \cref{t:c,t:a,t:b,t:a} and \cref{t:a,sec:one,t:c}. Also \Crefrange{t:a}{t:c}.
\section{Results}\label{sec:one}
\begin{theorem}\label{t:a}First.\end{theorem}
\begin{theorem}\label{t:b}Second.\end{theorem}
\begin{theorem}\label{t:c}Third.\end{theorem}`,
	},
	...["ngerman", "spanish", "italian", "portuguese", "dutch"].map(
		(language) => ({
			name: `Multilingual cleveref ${language}`,
			language: "latex" as const,
			source: String.raw`\usepackage[${language}]{babel}
\usepackage{cleveref}
See \cref{sec:third,sec:first,sec:second} and \Crefrange{sec:first}{sec:third}.
\section{First}\label{sec:first}
\section{Second}\label{sec:second}
\section{Third}\label{sec:third}
\section{Fourth}\label{sec:fourth}
Again \cref{sec:first,sec:third} and \Cref{sec:second,sec:third,sec:fourth}.`,
		}),
	),
	{
		name: "Compound image transforms and attributes",
		language: "html",
		source:
			'<p>Before <img src="/medias/image/canoe.svg" alt="Canoe" width="120" title="A canoe" id="canoe" class="sample" loading="lazy" decoding="async" fetchpriority="low" srcset="images/canoe.svg 1x, ../large/canoe.svg?size=2,wide 2x" sizes="(max-width: 600px) 100vw, 120px" aria-label="Canoe illustration" data-credit="Author" style="transform:translate(12px, -4px) rotate(20deg) scale(0.8, 1.2) skewX(10deg);transform-origin:25% 75%"> after.</p>',
	},
	{
		name: "Matrix image transform in table",
		language: "html",
		source:
			'<table><thead><tr><th>Image</th></tr></thead><tbody><tr><td><img src="/medias/image/canoe.svg" alt="Canoe" width="120" style="transform:matrix(1, 0.2, -0.1, 1, 8, 12)" title="Matrix"></td></tr></tbody></table>',
	},
	{
		name: "Additional languages and nested quotations",
		language: "latex",
		source: String.raw`\usepackage[french,ngerman,spanish,italian,portuguese,dutch,english]{babel}
\usepackage{csquotes}
\foreignquote{ngerman}{Deutsch \enquote{innen \enquote{tief}}.}
\foreignquote{spanish}{Español \enquote{interior \enquote{profundo}}.}
\foreignquote{italian}{Italiano \enquote{interno \enquote{profondo}}.}
\foreignquote{portuguese}{Português \enquote{interior \enquote{profundo}}.}
\foreignquote{dutch}{Nederlands \enquote{binnen \enquote{diep}}.}
\foreignquote{french}{Français \enquote{intérieur \enquote{profond}}.}
\foreignquote{english}{English \enquote{inner \enquote{deep}}.}
\foreignlanguage{ngerman}{Deutsch}
\begin{otherlanguage}{spanish}Español\end{otherlanguage}`,
	},
	{
		name: "Item labels",
		language: "latex",
		source: String.raw`\usepackage{enumitem}\begin{enumerate}[label=\Alph*),start=3]\item[Special] First\item Second\begin{itemize}\item[!] Nested\end{itemize}\end{enumerate}`,
	},
	{
		name: "Inline image",
		language: "html",
		source:
			'<p>Before <img src="/medias/image/canoe.svg" alt="Canoe" width="120" style="transform:rotate(-15deg);transform-origin:left top"> after.</p>',
	},
	{
		name: "Image origin",
		language: "html",
		source:
			'<img src="/medias/image/canoe.svg" alt="Canoe" width="120" style="transform:scale(0.8) rotate(-15deg);transform-origin:25% 75%">',
	},
	{
		name: "Table image",
		language: "html",
		source:
			'<table><thead><tr><th>Illustration</th></tr></thead><tbody><tr><td><img src="/medias/image/canoe.svg" alt="Canoe" width="120" style="transform:rotate(-15deg);transform-origin:left top;clip-path:inset(4pt 3pt 2pt 1pt)"></td></tr></tbody></table>',
	},
	{
		name: "Listing theme",
		language: "html",
		source:
			'<pre class="tp-dark"><code class="language-python">if ready:\n  print("ready")</code></pre>',
	},
	{
		name: "Numbered listing theme",
		language: "html",
		source:
			'<tp-code-editor readonly line-numbers line-number-start="20" language="python" class="tp-light" value="if ready:&#10;  print(1)"></tp-code-editor>',
	},
] as const;
export function presentationSignature(html: string) {
	const root = document.createElement("div");
	root.innerHTML = html;
	return {
		referenceProse: root.querySelector("a[href]")
			? root.textContent?.replace(/\s/g, "")
			: "",
		references: [...root.querySelectorAll("a[href]")].map((a) => ({
			href: a.getAttribute("href"),
			text: a.parentElement?.hasAttribute("data-tp-cref")
				? a.parentElement.textContent
				: a.textContent,
		})),
		languages: [...root.querySelectorAll("[lang]")]
			.filter(
				(e) =>
					e.hasAttribute("data-tp-quotation") ||
					e.getAttribute("lang") !==
						(e.parentElement?.closest("[lang]")?.getAttribute("lang") || "en"),
			)
			.map((e) => ({
				lang: e.getAttribute("lang"),
				quote: e.getAttribute("data-tp-quotation"),
				text: e.textContent?.replace(/\s+/g, " ").trim(),
			})),
		markers: [
			...root.querySelectorAll("[data-tp-list-marker],[data-tp-list-override]"),
		].map((e) => e.textContent),
		lists: [...root.querySelectorAll("ol,ul")].map((list) => ({
			tag: list.localName,
			parent: list.parentElement?.closest("ol,ul")?.localName ?? null,
			items: [...list.children]
				.filter((item) => item.localName === "li")
				.map((item) => {
					const clone = item.cloneNode(true) as Element;
					for (const marker of clone.querySelectorAll(
						"[data-tp-list-marker],[data-tp-list-override],ol,ul",
					))
						marker.remove();
					return clone.textContent?.replace(/\s+/g, " ").trim();
				}),
		})),
		images: [...root.querySelectorAll<HTMLImageElement>("img")].map((e) => ({
			attributes: Object.fromEntries(
				[...e.attributes]
					.filter(
						(a) => !["style", "width", "height", "src", "alt"].includes(a.name),
					)
					.map((a) => [a.name, a.value] as const)
					.sort(([a], [b]) => a.localeCompare(b)),
			),
			src: e.src,
			alt: e.alt,
			width: e.getAttribute("width") || e.style.width,
			transform: e.style.transform,
			origin: e.style.transformOrigin,
			clip: e.style.clipPath,
			cell: !!e.closest("td,th"),
		})),
		prose:
			root
				.querySelector("p:has(img)")
				?.textContent?.trim()
				.replace(/\s+/g, " ") || "",
		code: [...root.querySelectorAll("pre,tp-code-editor")].map((e) => ({
			text: (e.getAttribute("value") ?? e.textContent)?.trimEnd(),
			theme: e.closest(".tp-dark")
				? "dark"
				: e.closest(".tp-light")
					? "light"
					: "",
		})),
	};
}
