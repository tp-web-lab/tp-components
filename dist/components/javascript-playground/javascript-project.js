import { TpProject as e } from "../playground/project.js";
//#region src/components/javascript-playground/javascript-project.ts
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
};
//#endregion
export { t as TpJavascriptProject };

//# sourceMappingURL=javascript-project.js.map