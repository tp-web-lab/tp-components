import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const textExtensions = new Set([
	".html",
	".md",
	".adoc",
	".asciidoc",
	".rst",
	".rest",
	".js",
	".mjs",
	".ts",
	".json",
	".css",
	".svg",
	".txt",
]);

export function normalizeBase(value) {
	if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(value)) {
		throw new Error("Pages base must be / or a path such as /tp-components/.");
	}
	return value;
}

// Rewrite only URLs belonging to this build, not external URLs or arbitrary
// absolute paths used as teaching examples. Also handles JSON-escaped quotes.
export function rewriteUrls(source, base, roots) {
	return source
		.replace(
			/(["'`(=\s])\/(?!\/)([a-zA-Z0-9_.-]+)(?=[/"'`)?#\s<>]|$)/g,
			(match, before, first) => {
				if (first === "src" || first === "dist")
					return `${before}${base.slice(0, -1)}`;
				return roots.has(first) ? `${before}${base}${first}` : match;
			},
		)
		.replaceAll(`${base}tp-loader.ts`, `${base}tp-loader.js`);
}

export async function preparePages(root, base = "/tp-components/") {
	normalizeBase(base);
	const input = resolve(root, "dist");
	const output = resolve(root, ".pages");
	await readFile(resolve(input, "index.html"));
	const roots = new Set(
		(await readdir(input)).filter((name) => !name.endsWith(".map")),
	);
	await rm(output, { recursive: true, force: true });
	await mkdir(output, { recursive: true });
	await cp(input, output, {
		recursive: true,
		filter: (path) => !path.endsWith(".map"),
	});
	async function visit(directory) {
		for (const entry of await readdir(directory, { withFileTypes: true })) {
			const path = resolve(directory, entry.name);
			if (entry.isDirectory()) await visit(path);
			else if (textExtensions.has(extname(path))) {
				let source = rewriteUrls(await readFile(path, "utf8"), base, roots);
				source = source.replace(/^\/\/# sourceMappingURL=.*$/gm, "");
				if (path === resolve(output, "index.html")) {
					source = source
						.replace("PREVIEW : tp-components", "tp-components")
						.replace('repository="docs"', `repository="${base}docs"`);
				}
				await writeFile(path, source);
			}
		}
	}
	await visit(output);
	await writeFile(resolve(output, ".nojekyll"), "");
	return output;
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
	console.log(
		await preparePages(
			resolve(import.meta.dirname, ".."),
			process.argv[2] ?? "/tp-components/",
		),
	);
}
