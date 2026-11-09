import { readFileSync } from "node:fs";
import { renderLatexToFragment } from "@tp/tp-latex";
import { expect, it } from "vitest";
import type { MarkupViewerExample } from "../markup-viewer/markup-viewer.js";
import { TpLatexViewer } from "./latex-viewer.js";

class TestViewer extends TpLatexViewer {
	public examples(source: string): MarkupViewerExample[] {
		return this.extractExamples({
			label: "Document",
			source,
			context: undefined,
		});
	}
	public output(
		source: string,
		mode: "render" | "html",
		target: HTMLElement,
	): Promise<void> {
		return this.renderOutput(source, mode, target);
	}
}
customElements.define("test-latex-viewer", TestViewer);
it("converts all eight native TikZ documents without losing libraries or drawing source", () => {
	const viewer = new TestViewer();
	const examples = viewer.examples(
		readFileSync("public/docs/components/tikz/examples/examples.tex", "utf8"),
	);
	expect(examples).toHaveLength(8);
	expect(viewer.examples("Plain text")[0]?.source).toBe("Plain text");
	for (const example of examples) {
		const output = renderLatexToFragment(example.source);
		const drawings = output.querySelectorAll("tp-tikz");
		expect(drawings, example.label).toHaveLength(1);
		expect(drawings[0]?.getAttribute("value")).toContain("scale=1.8");
		if (example.label === "Trie graph") {
			expect(drawings[0]?.getAttribute("libraries")).toBe("graphs,arrows.meta");
			expect(drawings[0]?.getAttribute("value")).toContain(
				"\\colorlet{graphicbackground}",
			);
		}
	}
});
it("provides a live tp-latex preview and the generated HTML", async () => {
	const viewer = new TestViewer();
	const target = document.createElement("div");
	await viewer.output("\\section{Hello}Formula $x^2$.", "render", target);
	expect(target.querySelector("iframe")?.srcdoc).toContain("<tp-latex");
	await viewer.output("\\section{Hello}Formula $x^2$.", "html", target);
	expect(target.querySelector("tp-code-editor")?.getValue()).toContain(
		"tp-math",
	);
});

it("includes both native and raw HTML scripts in the executable iframe document", async () => {
	const viewer = new TestViewer();
	viewer.setAttribute("allow-script", "");
	const target = document.createElement("div");
	await viewer.output(
		String.raw`\wcScript[type=module]|console.log("native")| \rawhtml|<script>console.log("raw")</script>|`,
		"render",
		target,
	);
	const doc = new DOMParser().parseFromString(
		target.querySelector("iframe")?.srcdoc ?? "",
		"text/html",
	);
	expect(
		Array.from(
			doc.querySelectorAll(".tp-latex-output script"),
			(node) => node.textContent,
		),
	).toEqual(['console.log("native")', 'console.log("raw")']);
	expect(
		doc
			.querySelector(".tp-latex-output")
			?.hasAttribute("data-tp-reference-scope"),
	).toBe(true);
});

it("uses the same semantic lists in executable previews and generated HTML", async () => {
	const viewer = new TestViewer();
	viewer.setAttribute("allow-script", "");
	const source = String.raw`\begin{itemize}\item First\item Second\end{itemize}`;
	const target = document.createElement("div");
	await viewer.output(source, "render", target);
	const doc = new DOMParser().parseFromString(
		target.querySelector("iframe")?.srcdoc ?? "",
		"text/html",
	);
	expect(doc.querySelectorAll("ul > li")).toHaveLength(2);
	expect(doc.querySelector(".itemlabel, ul.list")).toBeNull();
	await viewer.output(source, "html", target);
	const html = target.querySelector("tp-code-editor")?.getValue() ?? "";
	expect(html).toContain("<ul>");
	expect(html).not.toContain("itemlabel");
});
