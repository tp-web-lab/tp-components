import { Xt as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/html-playground/html-project.ts
var t = class t extends e {
	importmap;
	constructor(e = {}) {
		super(e), this.importmap = e.importmap;
	}
	clone() {
		return new t({
			name: this.name,
			entry: this.entry,
			test: this.test,
			importmap: this.importmap,
			files: this.files.map((e) => ({ ...e }))
		});
	}
	toJSON() {
		return {
			name: this.name,
			entry: this.entry,
			test: this.test,
			importmap: this.importmap,
			files: this.files.map((e) => ({ ...e }))
		};
	}
	static fromJSON(e) {
		if (typeof e != "object" || !e) return null;
		let n = e;
		if (!Array.isArray(n.files)) return null;
		let r = n.files.filter((e) => {
			if (typeof e != "object" || !e) return !1;
			let t = e;
			return typeof t.path == "string" && typeof t.content == "string";
		}).map((e) => {
			let t = e;
			return {
				path: t.path,
				content: t.content,
				language: typeof t.language == "string" ? t.language : void 0,
				readonly: typeof t.readonly == "boolean" ? t.readonly : void 0
			};
		});
		return new t({
			name: typeof n.name == "string" ? n.name : void 0,
			entry: typeof n.entry == "string" ? n.entry : void 0,
			test: typeof n.test == "string" ? n.test : void 0,
			importmap: typeof n.importmap == "object" && n.importmap !== null ? n.importmap : void 0,
			files: r
		});
	}
};
//#endregion
export { t as TpHtmlProject };

//# sourceMappingURL=html-project.js.map