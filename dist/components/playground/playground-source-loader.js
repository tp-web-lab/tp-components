import { loadPlaygroundProjectJson as e } from "./playground-project-loader.js";
//#region src/components/playground/playground-source-loader.ts
var t = {
	javascript: [
		"js",
		"mjs",
		"cjs"
	],
	typescript: [
		"ts",
		"mts",
		"cts"
	],
	python: ["py"],
	prolog: ["pl", "pro"],
	sql: ["sql"],
	html: ["html", "htm"],
	markdown: ["md", "markdown"],
	asciidoc: ["adoc", "asciidoc"],
	restructuredtext: ["rst"]
};
function n(e) {
	return (t[e] ?? []).map((e) => `.${e}`).join(",");
}
function r(e, n) {
	let r = e.split(".").at(-1)?.toLowerCase() ?? "";
	if (!e.includes(".") || !t[n]?.includes(r)) throw Error(`Unsupported ${n} source file: ${e}`);
}
async function i(t, n) {
	let i = new URL(t).pathname.split("/").at(-1) ?? "";
	if ((i.split(".").at(-1)?.toLowerCase() ?? "") === "json" || !i.includes(".")) return e(t);
	r(i, n);
	let o = await fetch(t, { cache: "no-store" });
	if (!o.ok) throw Error(`Unable to load file: ${t} (${o.status})`);
	return a(i, await o.text(), n);
}
function a(e, t, n) {
	r(e, n);
	let i = `/${e}`;
	return {
		name: e,
		entry: i,
		files: [...n === "html" ? [] : [{
			path: "/index.html",
			language: "html",
			content: "<main id=\"app\"></main>"
		}], {
			path: i,
			language: n,
			content: t
		}]
	};
}
//#endregion
export { a as createSingleSourceProject, i as loadPlaygroundSource, n as playgroundSourceAccept };

//# sourceMappingURL=playground-source-loader.js.map