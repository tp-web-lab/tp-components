import { TpHtmlProject as e } from "./html-project.js";
//#region src/components/html-playground/html-example-loader.ts
function t(e, t) {
	return `${e.replace(/\/$/, "")}/${t.replace(/^\//, "")}`;
}
function n(e) {
	return e.startsWith("/") ? e : `/${e}`;
}
function r(e) {
	return e.endsWith(".html") ? "html" : e.endsWith(".css") ? "css" : e.endsWith(".js") || e.endsWith(".mjs") ? "javascript" : e.endsWith(".json") ? "json" : e.endsWith(".md") ? "markdown" : "text";
}
async function i(e) {
	let t = await fetch(e);
	if (!t.ok) throw Error(`Unable to load ${e}`);
	return await t.json();
}
async function a(e) {
	let t = await fetch(e);
	if (!t.ok) throw Error(`Unable to load ${e}`);
	return t.text();
}
async function o(o) {
	let s = await i(t(o, "project.json")), c = await i(t(o, ".files.json")), l = [];
	for (let e of c.files ?? []) l.push({
		path: n(e),
		content: await a(t(o, e)),
		language: r(e)
	});
	return new e({
		name: s.name ?? s.label ?? s.id ?? "HTML project",
		entry: s.entry ?? "/tp-components/index.html",
		importmap: s.importmap,
		files: l
	});
}
//#endregion
export { o as loadHtmlProjectFromDirectory };

