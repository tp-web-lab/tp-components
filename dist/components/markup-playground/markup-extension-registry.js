//#region src/components/markup-playground/markup-extension-registry.ts
var e = [
	{
		id: "include",
		label: "Include",
		kind: "built-in",
		enabled: !0,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "toc",
		label: "Table of contents",
		kind: "built-in",
		enabled: !0,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "list-table",
		label: "List table",
		kind: "built-in",
		enabled: !0,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "csv-table",
		label: "CSV table",
		kind: "built-in",
		enabled: !0,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "footnote",
		label: "Footnote",
		kind: "built-in",
		enabled: !0,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "highlight",
		label: "Highlight",
		kind: "optional",
		enabled: !1,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "design",
		label: "Design",
		kind: "optional",
		enabled: !1,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "map",
		label: "Map",
		kind: "optional",
		enabled: !1,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "mathjax",
		label: "MathJax",
		kind: "optional",
		enabled: !1,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "mermaid",
		label: "Mermaid",
		kind: "optional",
		enabled: !1,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "music",
		label: "Music",
		kind: "optional",
		enabled: !1,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "references",
		label: "References",
		kind: "optional",
		enabled: !1,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "section-numbering",
		label: "Section numbering",
		kind: "built-in",
		enabled: !0,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	},
	{
		id: "web-component",
		label: "Web component",
		kind: "built-in",
		enabled: !0,
		languages: [
			"asciidoc",
			"markdown",
			"restructuredtext"
		]
	}
];
function t(t) {
	return e.filter((e) => e.languages.includes(t)).map((e) => ({ ...e }));
}
function n(e) {
	return t(e).filter((e) => e.kind === "optional");
}
function r(e) {
	let n = {};
	for (let r of t(e)) n[r.id] = r.enabled;
	return n;
}
function i(e, t) {
	return n(e).map((e) => ({
		id: e.id,
		label: e.label,
		checked: t.has(e.id),
		disabled: !1
	}));
}
function a(e, t) {
	return n(e).filter((e) => t.has(e.id)).map((t) => ({
		id: t.id,
		label: t.label,
		url: `/extensions/${e}/${t.id}/index.js`,
		enabled: !0
	}));
}
function o(t) {
	let n = e.find((e) => e.id === t);
	return n === void 0 ? void 0 : { ...n };
}
function s(e, t) {
	let n = new Set(e);
	return n.has(t) ? (n.delete(t), n) : (n.add(t), n);
}
//#endregion
export { e as TP_MARKUP_EXTENSIONS, r as createDefaultMarkupExtensionState, i as createMarkupExtensionMenuItems, o as getMarkupExtensionById, t as getMarkupExtensionsForLanguage, n as getOptionalMarkupExtensionsForLanguage, a as toMarkupRuntimeExtensions, s as toggleMarkupExtensionId };

//# sourceMappingURL=markup-extension-registry.js.map