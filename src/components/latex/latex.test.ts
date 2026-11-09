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
