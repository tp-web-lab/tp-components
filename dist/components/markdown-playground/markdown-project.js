import { Yt as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/markdown-playground/markdown-project.ts
var t = class t extends e {
	extensions;
	constructor(e = {}) {
		super(e), this.extensions = e.extensions;
	}
	clone() {
		return new t({
			name: this.name,
			entry: this.entry,
			test: this.test,
			extensions: this.extensions?.map((e) => ({ ...e })),
			files: this.files.map((e) => ({ ...e }))
		});
	}
	toJSON() {
		return {
			name: this.name,
			entry: this.entry,
			test: this.test,
			extensions: this.extensions?.map((e) => ({ ...e })),
			files: this.files.map((e) => ({ ...e }))
		};
	}
};
//#endregion
export { t as TpMarkdownProject };

//# sourceMappingURL=markdown-project.js.map