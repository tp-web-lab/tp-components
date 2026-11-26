import { afterEach, describe, expect, it, vi } from "vitest";
import { TpLatex } from "./latex.js";

const tick = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
};
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
describe("tp-latex", () => {
	it("converts inline source, scopes references and preserves source on reconnect", () => {
		const el = new TpLatex();
		el.innerHTML = String.raw`<script type="tp/latex">\section{Résumé}A formula $x^2$.</script>`;
		document.body.append(el);
		expect(el.querySelector("h2")?.textContent).toContain("Résumé");
		expect(el.querySelector("tp-math")?.getAttribute("value")).toBe("x^2");
		expect(el.querySelector("[data-tp-reference-scope]")).not.toBeNull();
		el.remove();
		document.body.append(el);
		expect(el.querySelectorAll("h2")).toHaveLength(1);
		el.value = String.raw`\section{Replacement}New text.`;
		expect(el.querySelector("h2")?.textContent).toContain("Replacement");
		el.value = "";
		expect(el.querySelector("h2")).toBeNull();
	});
	it("discards old fetch results and displays recoverable conversion errors", async () => {
		let release: (response: Response) => void = () => {};
		vi.stubGlobal(
			"fetch",
			vi.fn(
				() =>
					new Promise<Response>((resolve) => {
						release = resolve;
					}),
			),
		);
		const el = new TpLatex();
		el.src = "/old.tex";
		document.body.append(el);
		el.removeAttribute("src");
		el.value = String.raw`\section{Current}`;
		release(new Response(String.raw`\section{Stale}`));
		await tick();
		expect(el.textContent).toContain("Current");
		expect(el.textContent).not.toContain("Stale");
		const error = vi.fn();
		el.addEventListener("tp-latex-error", error);
		el.value = String.raw`\unknownCommand`;
		expect(error).toHaveBeenCalledOnce();
		expect(el.querySelector("[role=alert]")).not.toBeNull();
		el.value = "Recovered";
		expect(el.querySelector("[role=alert]")).toBeNull();
	});
});

it("uses semantic lists with inherited TP styling for documents and component bodies", () => {
	const el = new TpLatex();
	el.value = String.raw`\section*{Lists}\begin{itemize}\item First\item Second\end{itemize}\wcTpCallout{\begin{itemize}\item Inside\end{itemize}}`;
	document.body.append(el);
	expect(el.querySelectorAll("ul")).toHaveLength(2);
	expect(el.querySelectorAll(".itemlabel, ul.list")).toHaveLength(0);
	expect(el.querySelector("h2")?.textContent).toBe("Lists");
	expect(el.querySelector("tp-callout ul li")?.textContent).toBe("Inside");
});

it("loads a listing beside its source document and ignores stale listing responses", async () => {
	const fetcher = vi
		.fn()
		.mockResolvedValueOnce(
			new Response(String.raw`\lstinputlisting[numbers=left]{sample.js}`),
		)
		.mockResolvedValueOnce(new Response("const value = 7;"));
	vi.stubGlobal("fetch", fetcher);
	const element = new TpLatex();
	element.src = "https://example.org/course/chapter.tex";
	document.body.append(element);
	await tick();
	await tick();
	expect(String(fetcher.mock.calls[1]?.[0])).toBe(
		"https://example.org/course/sample.js",
	);
	expect(element.querySelector("tp-code-editor")?.getAttribute("value")).toBe(
		"const value = 7;",
	);
	let complete: (value: Response) => void = () => {};
	fetcher.mockImplementation(
		() =>
			new Promise<Response>((resolve) => {
				complete = resolve;
			}),
	);
	element.removeAttribute("src");
	element.value = String.raw`\lstinputlisting{slow.js}`;
	element.value = "Current document";
	complete(new Response("Stale code"));
	await tick();
	expect(element.textContent).toContain("Current document");
	expect(element.querySelector("tp-code-editor")).toBeNull();
});

it("uses TP bibliography previews inside the native proposition heading", async () => {
	const el = new TpLatex();
	el.value = String.raw`\usepackage{amsthm}\newtheorem{proposition}{Proposition}\begin{proposition}[Companion, {\cite[p. 12]{guide}}]Text.\end{proposition}\begin{thebibliography}{99}\bibitem[7]{guide}Alex. \emph{Guide}.\end{thebibliography}`;
	document.body.append(el);
	await tick();
	expect(el.querySelectorAll("tp-biblio")).toHaveLength(1);
	expect(el.querySelectorAll("tp-listof")).toHaveLength(1);
	const heading = el.querySelector(
		'tp-theorem > [data-tp-theorem-generated="heading"]',
	);
	const ref = heading?.querySelector("tp-ref");
	expect(ref?.getAttribute("href")).toBe("@guide");
	const button = ref?.querySelector("button");
	expect(button?.textContent).toBe("7");
	expect(button?.disabled).toBe(false);
	button?.dispatchEvent(new MouseEvent("mouseenter"));
	expect(ref?.querySelector("tp-tooltip")?.hasAttribute("open")).toBe(true);
	expect(ref?.querySelector("tp-tooltip em")?.textContent).toBe("Guide");
	expect(el.querySelector("tp-listof dt")?.textContent).toBe("[7]");
	expect(el.querySelector("tp-theorem > p")?.textContent).toBe("Text.");
	const theorem = el.querySelector("tp-theorem");
	theorem?.setAttribute("number", "2.1");
	await tick();
	expect(heading?.querySelector("button")).toBe(button);
	const { htmlToMarkup } = await import("../../utilities/markup-conversion.js");
	const exported = htmlToMarkup(
		el.querySelector(".tp-latex-output")?.innerHTML || "",
		"latex",
	);
	expect(exported.match(/\\cite/g)).toHaveLength(1);
	expect(exported.match(/\\bibitem/g)).toHaveLength(1);
	expect(exported).not.toContain("tp-tooltip");
	expect(exported).toContain("\\begin{proposition}");
});

it("loads amsplain databases relative to the source and keeps citation numbering", async () => {
	const fetcher = vi.fn(
		async (url: URL | string) =>
			new Response(
				String(url).endsWith(".tex")
					? String.raw`\bibliographystyle{amsplain}\cite{z,a}\bibliography{refs}`
					: "@misc{z,author={Zulu, Alex},title={Last},year=2026}\n@misc{a,author={Alpha, Jane},title={First},year=2020}",
			),
	);
	vi.stubGlobal("fetch", fetcher);
	const el = new TpLatex();
	el.src = "https://example.org/docs/paper.tex";
	document.body.append(el);
	await vi.waitFor(() =>
		expect(el.querySelectorAll("tp-biblio")).toHaveLength(2),
	);
	expect(String(fetcher.mock.calls[1]?.[0])).toBe(
		"https://example.org/docs/refs.bib",
	);
	expect(
		[...el.querySelectorAll("tp-ref")].map((e) => e.getAttribute("label")),
	).toEqual(["2", "1"]);
});
it("discards stale bibliography loads after the document changes", async () => {
	let release: (response: Response) => void = () => {};
	vi.stubGlobal(
		"fetch",
		vi.fn(
			() =>
				new Promise<Response>((resolve) => {
					release = resolve;
				}),
		),
	);
	const el = new TpLatex();
	el.value = String.raw`\bibliographystyle{amsplain}\cite{x}\bibliography{refs}`;
	document.body.append(el);
	el.value = "New document";
	release(new Response("@misc{x,title={Stale}}"));
	await tick();
	expect(el.textContent).toContain("New document");
	expect(el.querySelector("tp-biblio")).toBeNull();
});
