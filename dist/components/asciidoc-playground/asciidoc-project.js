import { $t as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/asciidoc-playground/asciidoc-project.ts
var t = class t extends e {
	attributes;
	extensions;
	constructor(e = {}) {
		super(e), this.attributes = e.attributes, this.extensions = e.extensions;
	}
	clone() {
		return new t({
			name: this.name,
			entry: this.entry,
			test: this.test,
			attributes: this.attributes === void 0 ? void 0 : { ...this.attributes },
			extensions: this.extensions?.map((e) => ({ ...e })),
			files: this.files.map((e) => ({ ...e }))
		});
	}
	toJSON() {
		return {
			name: this.name,
			entry: this.entry,
			test: this.test,
			attributes: this.attributes === void 0 ? void 0 : { ...this.attributes },
			extensions: this.extensions?.map((e) => ({ ...e })),
			files: this.files.map((e) => ({ ...e }))
		};
	}
};
//#endregion
export { t as TpAsciidocProject };

//# sourceMappingURL=asciidoc-project.js.map