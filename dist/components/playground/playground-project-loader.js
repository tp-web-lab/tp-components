import { inferLanguage as e } from "./playground-example-loader.js";
import { c as t, n, o as r, r as i } from "../../chunks/schemas.js";
//#region src/components/playground/playground-project-loader.ts
var a = r({
	path: t().min(1),
	content: t(),
	language: t().optional(),
	readonly: i().optional()
}), o = r({
	id: t().optional(),
	label: t().optional(),
	name: t().optional(),
	entry: t().optional(),
	test: t().optional(),
	files: n(a)
}).passthrough(), s = o.omit({ files: !0 }).passthrough(), c = r({ files: n(t()).default([]) });
function l(e, t) {
	return `${e.replace(/\/$/, "")}/${t.replace(/^\//, "")}`;
}
function u(e) {
	return e.startsWith("/") ? e : `/${e}`;
}
async function d(e) {
	let t = await fetch(e, { cache: "no-store" });
	if (!t.ok) throw Error(`Unable to load JSON: ${e} (${String(t.status)})`);
	try {
		return await t.json();
	} catch (t) {
		throw Error(`Unable to read JSON: ${e}. The file is missing or does not contain valid JSON.`, { cause: t });
	}
}
async function f(e) {
	let t = await fetch(e, { cache: "no-store" });
	if (!t.ok) throw Error(`Unable to load file: ${e} (${String(t.status)})`);
	return t.text();
}
function p(e) {
	return o.parse(e);
}
function m(e) {
	return s.parse(e);
}
async function h(e) {
	return p(await d(e));
}
function g(e) {
	let t = e.querySelector(":scope > script[type=\"tp/json\"]");
	if (t === null) return null;
	let n = t.textContent?.trim() ?? "";
	return n === "" ? null : p(JSON.parse(n));
}
async function _(t) {
	let n = m(await d(l(t, "project.json"))), r = c.parse(await d(l(t, ".files.json"))), i = [];
	for (let n of r.files) {
		let r = u(n);
		i.push({
			path: r,
			content: await f(l(t, n)),
			language: e(r)
		});
	}
	return {
		metadata: n,
		files: i
	};
}
//#endregion
export { h as loadPlaygroundProjectJson, _ as loadPlaygroundRepository, p as parsePlaygroundProjectJson, m as parsePlaygroundProjectMetadata, g as readInlinePlaygroundProjectJson };

//# sourceMappingURL=playground-project-loader.js.map