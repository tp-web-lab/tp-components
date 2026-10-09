import { c as e } from "../../chunks/lib/markdown-it/markdown-it.js";
import { registerDefaultMarkdownPlugins as t } from "./markdown-default-plugins.js";
import { registerDefaultMarkdownExtensions as n } from "./markdown-default-extensions.js";
import { loadMarkdownExtension as r } from "./extensions/markdown-extension-loader.js";
import { parseMarkdownFrontMatter as i } from "./markdown-frontmatter.js";
//#region src/languages/markdown/markdown.ts
function a(e, t) {
	return {
		...e,
		options: {
			...o(e, t),
			...e.options ?? {}
		}
	};
}
function o(e, t) {
	let n = s(e);
	if (n === null) return {};
	let r = t[n];
	return typeof r != "object" || !r || Array.isArray(r) ? {} : r;
}
function s(e) {
	return "id" in e && typeof e.id == "string" ? e.id : e.url.split("/").filter((e) => e !== "").at(-2) ?? null;
}
var c = class {
	md;
	options;
	constructor(r = {}, i = []) {
		this.options = {
			html: !0,
			linkify: !0,
			typographer: !0,
			...r
		}, this.md = new e({
			html: this.options.html,
			linkify: this.options.linkify,
			typographer: this.options.typographer
		}), t(this.md), n(this.md);
		for (let e of i) this.useExtension(e);
	}
	use(e, t = {}) {
		return this.md.use(e, t), this;
	}
	async useExtension(e) {
		let t = await r(e.url);
		return this.use(t, e.options ?? {}), this;
	}
	async useExtensions(e) {
		for (let t of e) await this.useExtension(t);
		return this;
	}
	parse(e, t = []) {
		if (t.length > 0) throw Error("TpMarkdown.parse() cannot load async extensions. Use parseAsync().");
		let n = i(e), r = { attributes: {
			...this.options.attributes ?? {},
			...n.attributes
		} };
		return {
			tokens: this.md.parse(n.body, r),
			env: r
		};
	}
	async parseAsync(e, t = []) {
		return await this.useExtensions(t), this.parse(e);
	}
	render(e, t = []) {
		if (t.length > 0) throw Error("TpMarkdown.render() cannot load async extensions. Use renderAsync().");
		let n = i(e), r = { attributes: {
			...this.options.attributes ?? {},
			...n.attributes
		} };
		return this.md.render(n.body, r);
	}
	async renderAsync(e, t = []) {
		let n = i(e);
		await this.useExtensions(t.map((e) => a(e, n.attributes)));
		let r = { attributes: {
			...this.options.attributes ?? {},
			...n.attributes
		} };
		return this.md.render(n.body, r);
	}
};
//#endregion
export { c as TpMarkdown };

