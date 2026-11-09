import { afterEach, expect, it } from "vitest";
import { loadLanguageSupport } from "../code-editor/language-support.js";
import { inferLanguage } from "../playground/playground-example-loader.js";
import { buildLatexExecutionDocument } from "./latex-execution-document.js";
import { TpLatexPlayground, TpLatexProject } from "./latex-playground.js";

afterEach(() => document.body.replaceChildren());
class TestPlayground extends TpLatexPlayground {
	public initial(): TpLatexProject {
		return this.createInitialProject();
	}
}
customElements.define("test-latex-playground", TestPlayground);
it("preserves inline documents, entry selection and project clone independence", () => {
	const playground = new TestPlayground();
	playground.innerHTML = String.raw`<script type="tp/latex" filename="first.tex">\section{First}</script><script type="tp/latex" filename="second.tex">\section{Second}</script>`;
	const project = playground.initial();
	expect(project.entry).toBe("/first.tex");
	expect(project.files.map((file) => file.path)).toEqual([
		"/first.tex",
		"/second.tex",
	]);
	const clone = project.clone();
	const first = clone.files[0];
	if (!first) throw new Error("Missing first file");
	first.content = "Edited";
	expect(project.files[0]?.content).toBe(String.raw`\section{First}`);
	expect(inferLanguage("/chapter.tex")).toBe("latex");
});
it("serializes literal source safely and honors the selected document", async () => {
	const literal = String.raw`\section{Selected} </script><div> & "quotes"`;
	const project = new TpLatexProject({
		entry: "/second.tex",
		files: [
			{ path: "/main.tex", language: "latex", content: "Wrong document" },
			{ path: "/second.tex", language: "latex", content: literal },
		],
	});
	const result = await buildLatexExecutionDocument(project);
	const doc = new DOMParser().parseFromString(result.html, "text/html");
	expect(doc.querySelector("tp-latex")?.getAttribute("value")).toBe(literal);
	expect(result.html).toContain("tp-latex-error");
	expect(result.html).toContain("tp-loader");
	await expect(
		buildLatexExecutionDocument(new TpLatexProject()),
	).rejects.toThrow("entry");
});
it("loads LaTeX syntax highlighting", async () => {
	expect(await loadLanguageSupport("latex")).toBeTruthy();
});
