import { r as e } from "./rolldown-runtime.js";
//#region ../tp-markdown/dist/markdown/extensions/formats/index.js
var t = /* @__PURE__ */ e({ default: () => r }), n = [
	{
		marker: "==",
		tag: "mark",
		token: "tp_mark_inline"
	},
	{
		marker: "++",
		tag: "ins",
		token: "tp_insert_inline"
	},
	{
		marker: "#",
		tag: "del",
		token: "tp_delete_inline"
	},
	{
		marker: "~~",
		tag: "s",
		token: "tp_strike_inline"
	},
	{
		marker: "^",
		tag: "sup",
		token: "tp_sup_inline"
	},
	{
		marker: "~",
		tag: "sub",
		token: "tp_sub_inline"
	}
];
function r(e) {
	if (!(e.inline === void 0 || e.renderer === void 0)) for (let t of n) i(e, t);
}
function i(e, t) {
	e.inline === void 0 || e.renderer === void 0 || (e.inline.ruler.before("emphasis", t.token, (e, n) => {
		if (!e.src.slice(e.pos).startsWith(t.marker)) return !1;
		let r = e.pos + t.marker.length, i = e.src.indexOf(t.marker, r);
		if (i === -1) return !1;
		let a = e.src.slice(r, i);
		if (a.trim() === "") return !1;
		if (!n) {
			let n = e.push(t.token, "", 0);
			n.content = a;
		}
		return e.pos = i + t.marker.length, !0;
	}), e.renderer.rules[t.token] = (e, n) => {
		let r = e[n];
		return r === void 0 ? "" : `<${t.tag}>${a(r.content)}</${t.tag}>`;
	});
}
function a(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
//#endregion
export { r as n, t };

//# sourceMappingURL=formats.js.map