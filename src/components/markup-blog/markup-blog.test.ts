import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import "./markup-blog.js";
import "../html-blog/html-blog.js";
import "../markdown-blog/markdown-blog.js";
import "../asciidoc-blog/asciidoc-blog.js";
import "../restructuredtext-blog/restructuredtext-blog.js";
import type { TpMarkupBlog } from "./markup-blog.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
async function fixture(type = "html"): Promise<TpMarkupBlog> {
	const template = document.createElement("template");
	template.innerHTML = readFileSync(
		`public/docs/components/${type}-blog/examples/introduction.html`,
		"utf8",
	);
	const blog = template.content.firstElementChild as TpMarkupBlog;
	document.body.append(blog);
	await vi.waitFor(
		() =>
			expect(blog.querySelector('[data-blog-article="garden"]')).not.toBeNull(),
		{ timeout: 15000 },
	);
	return blog;
}
function click(blog: Element, text: string): void {
	const button = Array.from(blog.querySelectorAll("tp-button")).find(
		(item) => item.textContent === text,
	);
	if (!button) throw new Error(`Missing button ${text}`);
	button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}
for (const language of ["markup", "html", "markdown", "asciidoc"]) {
	it(`reads the native ${language} index and opens its inline article`, async () => {
		const blog = await fixture(language);
		expect(blog.querySelectorAll("[data-blog-article]")).toHaveLength(2);
		expect(blog.textContent).toContain("Three ideas for a greener balcony.");
		click(blog, "A small garden");
		await vi.waitFor(() =>
			expect(blog.querySelector(".tp-blog-content")?.textContent).toContain(
				"Start with herbs",
			),
		);
		expect(blog.querySelector("[role=alert]")).toBeNull();
		click(blog, "Back to articles");
		expect(blog.querySelectorAll("[data-blog-article]")).toHaveLength(2);
	}, 20000);
}
it("combines filters, resets pagination, clamps pages and preserves list state after reading", async () => {
	const blog = await fixture();
	click(blog, "Next");
	expect(blog.getAttribute("page")).toBe("2");
	click(blog, "Welcome");
	click(blog, "Back to articles");
	expect(blog.getAttribute("page")).toBe("2");
	blog.setAttribute("category", "Life");
	blog.setAttribute("tag", "community");
	expect(blog.getAttribute("page")).toBe("1");
	expect(blog.querySelectorAll("[data-blog-article]")).toHaveLength(1);
	expect(blog.querySelector("[data-blog-article]")?.textContent).toBe(
		"Welcome",
	);
	blog.setAttribute("tag", "missing");
	expect(blog.textContent).toContain("No articles match");
	blog.removeAttribute("category");
	blog.removeAttribute("tag");
	blog.setAttribute("page", "999");
	expect(blog.getAttribute("page")).toBe("2");
	blog.setAttribute("page-size", "0");
	expect(blog.querySelectorAll("[data-blog-article]")).toHaveLength(3);
});
it("resolves external article and image paths against their respective sources", async () => {
	const index = readFileSync(
		"public/docs/components/html-blog/examples/articles.html",
		"utf8",
	);
	const fetcher = vi.fn(async (url: string | URL | Request) => ({
		ok: true,
		text: async () =>
			String(url).endsWith("index.html")
				? index
				: '<p>External body</p><img src="photo.svg" alt="Garden">',
	}));
	vi.stubGlobal("fetch", fetcher);
	const blog = document.createElement("tp-html-blog");
	blog.setAttribute("src", "https://example.test/blog/index.html");
	document.body.append(blog);
	await vi.waitFor(() =>
		expect(blog.querySelector("[data-blog-article]")).not.toBeNull(),
	);
	click(blog, "A small garden");
	await vi.waitFor(() =>
		expect(blog.querySelector(".tp-blog-content")?.textContent).toBe(
			"External body",
		),
	);
	expect(fetcher.mock.calls.map((call) => call[0])).toContain(
		"https://example.test/blog/article.html",
	);
	expect(blog.querySelector("img")?.getAttribute("src")).toBe(
		"https://example.test/blog/photo.svg",
	);
});
it("shows invalid metadata and fetch failures without retaining stale articles", async () => {
	const blog = await fixture();
	const errors = vi.fn();
	blog.addEventListener("tp-html-blog-error", errors);
	blog.setAttribute(
		"value",
		"<h2>Invalid date</h2><dl><dt>Date</dt><dd>2026-02-30</dd></dl>",
	);
	await vi.waitFor(() =>
		expect(blog.querySelector("[role=alert]")?.textContent).toContain(
			"valid Date",
		),
	);
	expect(errors).toHaveBeenCalledTimes(1);
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => ({ ok: false, status: 404 })),
	);
	blog.setAttribute("src", "/missing.html");
	await vi.waitFor(() =>
		expect(blog.querySelector("[role=alert]")?.textContent).toContain("404"),
	);
});
it("ignores an old index response after the source changes", async () => {
	let finish:
		| ((response: { ok: boolean; text: () => Promise<string> }) => void)
		| undefined;
	vi.stubGlobal(
		"fetch",
		vi.fn(
			() =>
				new Promise((resolve) => {
					finish = resolve;
				}),
		),
	);
	const blog = document.createElement("tp-html-blog");
	blog.setAttribute("src", "/slow.html");
	document.body.append(blog);
	blog.setAttribute(
		"value",
		"<h2>Latest</h2><dl><dt>Date</dt><dd>2026-01-01</dd></dl><p>Current</p>",
	);
	blog.removeAttribute("src");
	await vi.waitFor(() => expect(blog.textContent).toContain("Latest"));
	finish?.({
		ok: true,
		text: async () => "<h2>Old</h2><dl><dt>Date</dt><dd>2026-01-01</dd></dl>",
	});
	await Promise.resolve();
	await Promise.resolve();
	expect(blog.querySelector("[data-blog-article]")?.textContent).toBe("Latest");
});

it("accepts a late inline script, sorts dates and rejects duplicate identifiers", async () => {
	const blog = document.createElement("tp-html-blog");
	document.body.append(blog);
	await vi.waitFor(() =>
		expect(blog.textContent).toContain("No articles yet."),
	);
	const script = document.createElement("script");
	script.type = "tp/html";
	script.textContent =
		"<h2>Older</h2><dl><dt>Id</dt><dd>older</dd><dt>Date</dt><dd>2025-01-01</dd></dl><p>Old</p><h2>Newer</h2><dl><dt>Id</dt><dd>newer</dd><dt>Date</dt><dd>2026-01-01</dd></dl><p>New</p>";
	blog.append(script);
	await vi.waitFor(() =>
		expect(blog.querySelector("[data-blog-article]")?.textContent).toBe(
			"Newer",
		),
	);
	blog.setAttribute(
		"value",
		script.textContent.replace("newer</dd>", "older</dd>"),
	);
	await vi.waitFor(() =>
		expect(blog.querySelector("[role=alert]")?.textContent).toContain(
			"Duplicate article identifier",
		),
	);
});
it("detects an external article language independently of the generic index", async () => {
	const fetcher = vi.fn(async () => ({
		ok: true,
		text: async () => "<p>HTML article body</p>",
	}));
	vi.stubGlobal("fetch", fetcher);
	const blog = document.createElement("tp-markup-blog");
	blog.setAttribute(
		"value",
		"## Mixed formats\n\nDate\n: 2026-01-01\n\nSource\n: https://example.test/article.html\n\nA Markdown index with an HTML article.",
	);
	document.body.append(blog);
	await vi.waitFor(() =>
		expect(blog.querySelector("[data-blog-article]")).not.toBeNull(),
	);
	click(blog, "Mixed formats");
	await vi.waitFor(() =>
		expect(blog.querySelector(".tp-blog-content p")?.textContent).toBe(
			"HTML article body",
		),
	);
	expect(blog.querySelector(".tp-blog-content")?.textContent).not.toContain(
		"<p>",
	);
});
