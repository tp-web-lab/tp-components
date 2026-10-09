import { afterEach, expect, it, vi } from "vitest";
import {
	createSingleSourceProject,
	loadPlaygroundSource,
	playgroundSourceAccept,
} from "./playground-source-loader.js";

afterEach(() => vi.unstubAllGlobals());

it.each([
	["javascript", ".js,.mjs,.cjs"],
	["typescript", ".ts,.mts,.cts"],
	["python", ".py"],
	["prolog", ".pl,.pro"],
	["sql", ".sql"],
	["html", ".html,.htm"],
	["markdown", ".md,.markdown"],
	["asciidoc", ".adoc,.asciidoc"],
	["restructuredtext", ".rst"],
])(
	"filters local %s files using the supported extensions",
	(language, accept) => {
		expect(playgroundSourceAccept(language)).toBe(accept);
		accept.split(",").forEach((extension) => {
			const project = createSingleSourceProject(
				`example${extension.toUpperCase()}`,
				"source\n",
				language,
			);
			expect(project.entry).toBe(`/example${extension.toUpperCase()}`);
		});
	},
);

it("rejects untyped local files and unknown languages", () => {
	expect(() => createSingleSourceProject("example", "text", "python")).toThrow(
		"Unsupported python source file",
	);
	expect(playgroundSourceAccept("unknown")).toBe("");
	expect(() =>
		createSingleSourceProject("example.py", "text", "unknown"),
	).toThrow("Unsupported unknown source file");
});

it.each([
	["javascript", "js"],
	["typescript", "ts"],
	["python", "py"],
	["sql", "sql"],
	["prolog", "pl"],
	["markdown", "md"],
	["asciidoc", "adoc"],
	["restructuredtext", "rst"],
])(
	"wraps a %s file without changing its contents",
	async (language, extension) => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("source\n")));
		const project = await loadPlaygroundSource(
			`https://example.org/example.${extension}?v=2#test`,
			language,
		);
		expect(project.entry).toBe(`/example.${extension}`);
		expect(project.files).toEqual([
			{
				path: "/index.html",
				language: "html",
				content: '<main id="app"></main>',
			},
			{ path: project.entry, language, content: "source\n" },
		]);
	},
);

it("preserves HTML as the entry without adding another HTML file", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue(new Response("<p>Hello</p>")),
	);
	const project = await loadPlaygroundSource(
		"https://example.org/page.html",
		"html",
	);
	expect(project.files).toHaveLength(1);
	expect(project.entry).toBe("/page.html");
});

it.each(["project.json", "endpoint"])(
	"preserves JSON loading for %s",
	async (name) => {
		const data = {
			entry: "/x.js",
			files: [{ path: "/x.js", content: "hello" }],
		};
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(JSON.stringify(data))),
		);
		expect(
			await loadPlaygroundSource(`https://example.org/${name}`, "javascript"),
		).toEqual(data);
	},
);

it("reports missing files", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue(new Response("", { status: 404 })),
	);
	await expect(
		loadPlaygroundSource("https://example.org/missing.js", "javascript"),
	).rejects.toThrow("404");
});

it("rejects incompatible source files before fetching", async () => {
	const fetcher = vi.fn();
	vi.stubGlobal("fetch", fetcher);
	await expect(
		loadPlaygroundSource("https://example.org/example.py", "javascript"),
	).rejects.toThrow("Unsupported javascript");
	expect(fetcher).not.toHaveBeenCalled();
});

it("identifies a missing JSON project when the server returns an HTML fallback", async () => {
	const url = "https://example.org/file-unknown.json";
	vi.stubGlobal(
		"fetch",
		vi
			.fn()
			.mockResolvedValue(
				new Response("<!doctype html><title>Fallback</title>", { status: 200 }),
			),
	);
	await expect(loadPlaygroundSource(url, "python")).rejects.toThrow(
		`Unable to read JSON: ${url}. The file is missing or does not contain valid JSON.`,
	);
});

it("identifies a JSON project rejected with HTTP 404", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue(new Response("Not found", { status: 404 })),
	);
	await expect(
		loadPlaygroundSource("https://example.org/file-unknown.json", "python"),
	).rejects.toThrow(
		"Unable to load JSON: https://example.org/file-unknown.json (404)",
	);
});
