export const textEnvironmentExamples = {
	center: String.raw`\begin{center}Centered \textbf{text}.\end{center}`,
	flushleft: String.raw`\begin{flushleft}Left aligned.\end{flushleft}`,
	flushright: String.raw`\begin{flushright}Right aligned.\end{flushright}`,
	quote: String.raw`\begin{quote}First paragraph.

Second paragraph.\end{quote}`,
	quotation: String.raw`\begin{quotation}First paragraph.

Second paragraph.\end{quotation}`,
	verse: String.raw`\begin{verse}First line\\Second line

Another stanza.\end{verse}`,
	minipage: String.raw`\begin{minipage}[t][4cm][b]{0.5\textwidth}A \textbf{small} page.

Second paragraph.\end{minipage}`,
	tabbing: String.raw`\begin{tabbing}Long heading\=Second column\kill
Name\>Value\\
Alpha\>12\\
Beta\>24
\end{tabbing}`,
	verbatim: String.raw`\begin{verbatim}
  <tag> & literal \commands{unbalanced
next line
\end{verbatim}`,
	figure: String.raw`\begin{figure}[ht]\includegraphics[width=120px]{https://example.org/image.svg}\caption{A figure}\end{figure}`,
	table: String.raw`\begin{table}[ht]\begin{tabular}{lr}Name & Value\\Alpha & 12\end{tabular}\caption{A table}\end{table}`,
};
export function textEnvironmentSignature(html: string): unknown {
	const root = document.createElement("div");
	root.innerHTML = html;
	for (const br of root.querySelectorAll("br"))
		br.after(document.createTextNode(" "));
	return {
		text: root.textContent?.replace(/\s+/g, ""),
		paragraphs: [...root.querySelectorAll("p")]
			.filter((p) => !p.closest("td,th,caption,figcaption"))
			.map((p) => p.textContent?.replace(/\s+/g, " ").trim()),
		blockquotes: root.querySelectorAll("blockquote").length,
		lines: root.querySelectorAll("br").length,
		code: [...root.querySelectorAll("pre")].map((pre) => pre.textContent),
		semantic: [
			...root.querySelectorAll(
				'[class*="tp-align-"],.tp-quotation,.tp-verse,.tp-minipage,.tp-tabbing,.tp-tabbing-guide',
			),
		].map((e) => ({
			tag: e.localName,
			classes: [...e.classList]
				.filter((c) => /^tp-(align|quotation|verse|minipage|tabbing)/.test(c))
				.sort(),
			position: e.getAttribute("data-tp-position"),
			inner: e.getAttribute("data-tp-inner-position"),
			width: (e as HTMLElement).style.width,
			height: (e as HTMLElement).style.height,
		})),
		cells: [...root.querySelectorAll("td,th")].map((e) =>
			e.textContent?.trim(),
		),
		captions: [...root.querySelectorAll("caption,figcaption")].map((e) =>
			e.textContent?.trim(),
		),
	};
}
