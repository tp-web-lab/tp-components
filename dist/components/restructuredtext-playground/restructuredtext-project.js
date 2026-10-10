import { Xt as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/restructuredtext-playground/restructuredtext-project.ts
var t = class t extends e {
	libs;
	extensions;
	constructor(e = {}) {
		super(e), this.libs = e.libs, this.extensions = e.extensions;
	}
	clone() {
		return new t({
			name: this.name,
			entry: this.entry,
			test: this.test,
			libs: this.libs === void 0 ? void 0 : [...this.libs],
			files: this.files.map((e) => ({ ...e })),
			extensions: this.extensions?.map((e) => ({ ...e }))
		});
	}
	toJSON() {
		return {
			name: this.name,
			entry: this.entry,
			test: this.test,
			libs: this.libs === void 0 ? void 0 : [...this.libs],
			files: this.files.map((e) => ({ ...e })),
			extensions: this.extensions?.map((e) => ({ ...e }))
		};
	}
};
//#endregion
export { t as TpRestructuredTextProject };

//# sourceMappingURL=restructuredtext-project.js.map