import { afterEach, expect, it, vi } from "vitest";
import "./notebook.js";
import { renderNotebookMarkup } from "./notebook-export.js";

afterEach(() => {
	document.body.replaceChildren();
	document.body.removeAttribute("class");
	document.body.removeAttribute("style");
	document.documentElement.removeAttribute("class");
	vi.unstubAllGlobals();
});

it("exports readable markup before any loader runs", async () => {
	const md = await renderNotebookMarkup(
		"markdown",
		"# Visible heading\n\n- First\n- Second",
	);
	expect(md.querySelector("h1")?.textContent).toBe("Visible heading");
	expect(md.querySelectorAll("li")).toHaveLength(2);
	const tex = await renderNotebookMarkup(
		"latex",
		String.raw`\section*{LaTeX}\begin{itemize}\item Visible\end{itemize}$x^2$`,
	);
	expect(tex.querySelector("li")?.textContent).toBe("Visible");
	expect(tex.querySelector("tp-math")?.textContent).toBe("x^2");
	const adoc = await renderNotebookMarkup(
		"asciidoc",
		"== AsciiDoc\n\nVisible paragraph.",
	);
	expect(adoc.querySelector("h2")?.textContent).toBe("AsciiDoc");
	expect(adoc.textContent).toContain("Visible paragraph.");
});

it("preserves code containing closing script tags and includes styles and the asset base", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const notebook = document.createElement("tp-notebook");
	notebook.setAttribute(
		"data-tp-source",
		"https://example.test/course/lesson.md",
	);
	const script = document.createElement("script");
	script.type = "tp/javascript";
	const source = 'console.log("</script><p>literal</p>")';
	script.textContent = source;
	notebook.append(script);
	document.body.append(notebook);
	await vi.waitFor(() =>
		expect(notebook.querySelector("tp-javascript-viewer")).not.toBeNull(),
	);
	const api = notebook as unknown as { standaloneHtml(): Promise<string> };
	const doc = new DOMParser().parseFromString(
		await api.standaloneHtml(),
		"text/html",
	);
	expect(doc.querySelector("base")?.href).toBe(
		"https://example.test/course/lesson.md",
	);
	expect(doc.querySelector("style")?.textContent).toContain("--tp-font-family");
	expect(
		JSON.parse(
			doc.querySelector('script[data-tp-export-type="tp/javascript"]')
				?.textContent ?? "null",
		),
	).toBe(source);
	expect(
		doc.querySelector("[data-tp-notebook-code-fallback] code")?.textContent,
	).toBe(source);
	expect(doc.querySelector("main > p")).toBeNull();
});

it.each(["tp-light", "tp-dark"])(
	"preserves the global %s theme and custom brand in standalone HTML",
	async (theme) => {
		const notebook = document.createElement("tp-notebook");
		document.documentElement.className = theme;
		document.body.style.setProperty("--tp-brand-seed", "#c12367");
		const api = notebook as unknown as { standaloneHtml(): Promise<string> };
		const doc = new DOMParser().parseFromString(
			await api.standaloneHtml(),
			"text/html",
		);
		expect(doc.documentElement.className).toBe(theme);
		expect(doc.body.className).toBe(theme);
		expect(doc.body.style.getPropertyValue("--tp-notebook-export-brand")).toBe(
			"#c12367",
		);
		expect(doc.head.textContent).toContain(
			"background:var(--tp-background-color)",
		);
	},
);

it("opens code and output once exported viewers initialize", async () => {
	const notebook = document.createElement("tp-notebook");
	const api = notebook as unknown as { standaloneHtml(): Promise<string> };
	const doc = new DOMParser().parseFromString(
		await api.standaloneHtml(),
		"text/html",
	);
	const viewer = doc.createElement("div");
	viewer.setAttribute("data-tp-notebook-code-viewer", "");
	doc.querySelector("main")?.append(viewer);
	const bootstrap = doc.body.querySelector("script")?.textContent ?? "";
	new Function("document", "MutationObserver", bootstrap)(
		doc,
		MutationObserver,
	);
	const code = doc.createElement("button");
	code.setAttribute("data-tp-programming-viewer-code", "");
	code.setAttribute("aria-pressed", "false");
	const output = doc.createElement("button");
	output.setAttribute("data-tp-programming-viewer-output", "");
	output.setAttribute("aria-pressed", "false");
	const openCode = vi.fn();
	const openOutput = vi.fn();
	code.addEventListener("click", openCode);
	output.addEventListener("click", openOutput);
	viewer.append(code, output);
	await vi.waitFor(() => expect(openCode).toHaveBeenCalledOnce());
	expect(openOutput).toHaveBeenCalledOnce();
	viewer.append(doc.createElement("div"));
	await Promise.resolve();
	expect(openCode).toHaveBeenCalledOnce();
});

it("captures the documentation container theme and brand instead of the body defaults", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	document.body.className = "tp-light";
	document.body.style.setProperty("--tp-brand-seed", "#88b1a1");
	const scope = document.createElement("section");
	scope.className = "tp-dark";
	scope.style.setProperty("--tp-brand-seed", "#4a97f4");
	const notebook = document.createElement("tp-notebook");
	scope.append(notebook);
	document.body.append(scope);
	const api = notebook as unknown as { standaloneHtml(): Promise<string> };
	const doc = new DOMParser().parseFromString(
		await api.standaloneHtml(),
		"text/html",
	);
	expect(doc.body.className).toBe("tp-dark");
	expect(doc.body.style.getPropertyValue("--tp-notebook-export-brand")).toBe(
		"#4a97f4",
	);
});

it("runs exported cells in order and resets their sources through the viewers", async () => {
	const notebook = document.createElement("tp-notebook");
	const api = notebook as unknown as { standaloneHtml(): Promise<string> };
	const doc = new DOMParser().parseFromString(
		await api.standaloneHtml(),
		"text/html",
	);
	const calls: string[] = [];
	for (let i = 0; i < 2; i++) {
		const viewer = doc.createElement("div");
		viewer.setAttribute("data-tp-notebook-code-viewer", "");
		viewer.innerHTML =
			'<button data-tp-programming-viewer-code aria-pressed="true"></button><button data-tp-programming-viewer-output aria-pressed="true"></button>';
		Object.assign(viewer, {
			run: async () => {
				await Promise.resolve();
				calls.push(`run-${i}`);
			},
			reset: () => {
				calls.push(`reset-${i}`);
			},
		});
		doc.querySelector("main")?.append(viewer);
	}
	new Function(
		"document",
		"MutationObserver",
		doc.body.querySelector("script")?.textContent ?? "",
	)(doc, MutationObserver);
	const run = doc.querySelector<HTMLElement>("[data-tp-notebook-export-run]");
	const reset = doc.querySelector<HTMLElement>(
		"[data-tp-notebook-export-reset]",
	);
	expect(run?.hasAttribute("disabled")).toBe(false);
	run?.click();
	expect(reset?.hasAttribute("disabled")).toBe(true);
	run?.click();
	await vi.waitFor(() => expect(calls).toEqual(["run-0", "run-1"]));
	expect(reset?.hasAttribute("disabled")).toBe(false);
	reset?.click();
	await vi.waitFor(() =>
		expect(calls).toEqual(["run-0", "run-1", "reset-0", "reset-1"]),
	);
});
