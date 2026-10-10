import { ed as e, zr as t } from "../chunks/lib/typescript/typescript.js";
//#region src/utilities/declarative-text-source.ts
var n = class {
	host;
	options;
	snapshot = null;
	onInlineSource = null;
	observer = new MutationObserver(() => {
		this.capture() && (this.observer.disconnect(), this.onInlineSource?.());
	});
	constructor(e, t) {
		if (this.host = e, this.options = t, t.scriptTypes.some((e) => !e.startsWith("tp/"))) throw TypeError("Declarative component script types must begin with \"tp/\".");
	}
	observe(e) {
		this.onInlineSource = e, (this.host.getAttribute("src") ?? "").trim() === "" && (this.host.getAttribute("value") ?? "").trim() === "" && (this.capture() || this.observer.observe(this.host, {
			childList: !0,
			characterData: !0,
			subtree: !0
		}));
	}
	capture() {
		if (this.snapshot !== null) return !0;
		let t = new Set(this.options.scriptTypes), n = Array.from(this.host.querySelectorAll("script")).find((e) => t.has(e.type) && (!this.options.ignoreSelector || !e.closest(this.options.ignoreSelector)))?.textContent ?? (this.options.textContentFallback === !0 ? this.authorText() : null);
		return n === null || n.trim() === "" ? !1 : (this.snapshot = e(n), !0);
	}
	authorText() {
		let e = this.options.ignoreSelector;
		if (!e) return this.host.textContent ?? "";
		let t = this.host.ownerDocument.createTreeWalker(this.host, NodeFilter.SHOW_TEXT), n = "";
		for (let r = t.nextNode(); r; r = t.nextNode()) r.parentElement?.closest(e) || (n += r.textContent ?? "");
		return n;
	}
	get inlineSource() {
		return this.capture(), this.snapshot;
	}
	async read(e) {
		let n = (this.host.getAttribute("src") ?? "").trim();
		if (n === "") {
			let e = this.host.getAttribute("value") ?? "";
			return e.trim() === "" ? this.inlineSource ?? "" : e;
		}
		let r = t(this.host, n), i = await fetch(r.href, e);
		if (!i.ok) throw Error(`Failed to fetch "${n}" (${String(i.status)})`);
		return await i.text();
	}
	disconnect() {
		this.observer.disconnect(), this.onInlineSource = null;
	}
};
//#endregion
export { n as TpDeclarativeTextSource };

//# sourceMappingURL=declarative-text-source.js.map