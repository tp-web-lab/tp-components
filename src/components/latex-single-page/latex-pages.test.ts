import { afterEach, describe, expect, it, vi } from "vitest";
import "./latex-single-page.js";
import "../latex-multi-pages/latex-multi-pages.js";
import "../latex-multi-slides/latex-multi-slides.js";

const files: Record<string, string> = {
	"/latex/cover.tex": String.raw`\usepackage{hyperref}\section*{Welcome} \href{chapter.tex}{Next chapter}`,
	"/latex/chapter.tex": String.raw`\section*{Chapter two} Some content.`,
	"/latex/sidebar.tex": String.raw`\usepackage{hyperref}\begin{itemize}\item \href{cover.tex}{Welcome}\item \href{chapter.tex}{Chapter two}\end{itemize}`,
};
function mockFetch() {
	vi.stubGlobal(
		"fetch",
		vi.fn(async (input: RequestInfo | URL) => {
			const source =
				files[new URL(String(input), window.location.href).pathname];
			return {
				ok: source !== undefined,
				status: source === undefined ? 404 : 200,
				headers: { get: () => "text/plain" },
				text: async () => source ?? "",
			} as unknown as Response;
		}),
	);
}
afterEach(() => {
	document.body.replaceChildren();
	window.history.replaceState({}, "", "/");
	vi.unstubAllGlobals();
});
describe("LaTeX document components", () => {
	it("renders inline LaTeX and reports its language", async () => {
		const page = document.createElement("tp-latex-single-page");
		const rendered = vi.fn();
		page.addEventListener("tp-latex-single-page-rendered", rendered);
		page.innerHTML = String.raw`<script type="tp/latex">\section*{Inline title}\begin{itemize}\item First\end{itemize}</script>`;
		document.body.append(page);
		await vi.waitFor(() =>
			expect(page.querySelector("tp-latex h2")?.textContent).toBe(
				"Inline title",
			),
		);
		expect(page.querySelector("tp-latex li")?.textContent).toContain("First");
		expect(
			page.querySelector("tp-latex")?.hasAttribute("data-tp-latex-rendered"),
		).toBe(true);
		expect(rendered).toHaveBeenCalled();
	});
	it("detects external .tex sources in the generic single-page component", async () => {
		mockFetch();
		const page = document.createElement("tp-markup-single-page");
		page.setAttribute("src", "/latex/chapter.tex");
		document.body.append(page);
		await vi.waitFor(() =>
			expect(page.querySelector("tp-latex h2")?.textContent).toBe(
				"Chapter two",
			),
		);
		expect(page.getAttribute("data-tp-markup-single-page-language")).toBe(
			"latex",
		);
	});
	for (const tag of [
		"tp-latex-multi-pages",
		"tp-latex-multi-slides",
	] as const) {
		it(`${tag} loads its cover, menu and linked document`, async () => {
			mockFetch();
			const page = document.createElement(tag);
			page.setAttribute("repository", "/latex");
			document.body.append(page);
			await vi.waitFor(() =>
				expect(page.querySelector("main tp-latex h2")?.textContent).toBe(
					"Welcome",
				),
			);
			expect(page.querySelector('a[href*="chapter.tex"]')).not.toBeNull();
			const next = page.querySelector<HTMLAnchorElement>(
				'main tp-latex a[href*="chapter.tex"]',
			);
			expect(next).not.toBeNull();
			next?.click();
			await vi.waitFor(() =>
				expect(page.querySelector("main tp-latex h2")?.textContent).toBe(
					"Chapter two",
				),
			);
		});
	}
});
