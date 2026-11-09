import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderLatexToFragment } from "@tp/tp-latex";
import { expect, it } from "vitest";
import { buildLatexExecutionDocument } from "./latex-execution-document.js";
import { resolveLatexInputs } from "./latex-inputs.js";
import { TpLatexProject } from "./latex-project.js";

function project(sources: Record<string, string>) {
	return new TpLatexProject({
		entry: "/main.tex",
		files: Object.entries(sources).map(([path, content]) => ({
			path,
			content,
			language: "latex",
		})),
	});
}

it("assembles nested input files and reflects edits on the next run", async () => {
	const p = project({
		"/main.tex": String.raw`\input{sections/intro}\input sections/end.tex`,
		"/sections/intro.tex": String.raw`Hello \input{shared}`,
		"/shared.tex": "world",
		"/sections/end.tex": "Goodbye",
	});
	expect(resolveLatexInputs(p, "/main.tex")).toBe("Hello world\n\nGoodbye\n");
	const file = p.findFile("/shared.tex");
	if (!file) throw new Error("Missing fixture");
	file.content = "edited";
	const output = await buildLatexExecutionDocument(p);
	const doc = new DOMParser().parseFromString(output.html, "text/html");
	expect(doc.querySelector("tp-latex")?.getAttribute("value")).toBe(
		"Hello edited\n\nGoodbye\n",
	);
});

it("keeps inputs in comments, escaped commands and literal regions untouched", () => {
	const source = String.raw`% \input{missing}
\\input{missing}
\verb|\input{missing}|
\begin{verbatim}\input{missing}\end{verbatim}
\begin{comment}\input{missing}\end{comment}
\wcScript[type=tp/latex]{\input{missing}\textbf{literal}}
\rawhtml|<code>\input{missing}</code>|`;
	expect(
		resolveLatexInputs(project({ "/main.tex": source }), "/main.tex"),
	).toBe(source);
});

it("reports missing and circular inputs but permits repeated shared files", () => {
	expect(() =>
		resolveLatexInputs(
			project({ "/main.tex": String.raw`\input{missing}` }),
			"/main.tex",
		),
	).toThrow("/missing.tex");
	expect(() =>
		resolveLatexInputs(
			project({
				"/main.tex": String.raw`\input{part}`,
				"/part.tex": String.raw`\input{main}`,
			}),
			"/main.tex",
		),
	).toThrow("Circular LaTeX input");
	expect(
		resolveLatexInputs(
			project({
				"/main.tex": String.raw`\input{part}\input{part}`,
				"/part.tex": "Hello",
			}),
			"/main.tex",
		),
	).toBe("Hello\nHello\n");
});

it("assembles and renders all bundled multifile examples", () => {
	const root = resolve("public/examples/playgrounds/latex-playground");
	const catalog = JSON.parse(readFileSync(`${root}/index.json`, "utf8")) as {
		examples: string[];
	};
	for (const name of catalog.examples) {
		const folder = `${root}/${name}`;
		const manifest = JSON.parse(
			readFileSync(`${folder}/.files.json`, "utf8"),
		) as { files: string[] };
		expect(manifest.files.length).toBeGreaterThan(1);
		const p = project(
			Object.fromEntries(
				manifest.files.map((path) => [
					`/${path}`,
					readFileSync(`${folder}/${path}`, "utf8"),
				]),
			),
		);
		const source = resolveLatexInputs(p, "/main.tex");
		expect(source).not.toContain("\\input");
		expect(renderLatexToFragment(source).childNodes.length).toBeGreaterThan(0);
	}
});
