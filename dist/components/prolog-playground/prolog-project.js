import { TpProject as e } from "../playground/project.js";
//#region src/components/prolog-playground/prolog-project.ts
var t = class t extends e {
	query;
	constructor(e = {}) {
		super(e), this.query = e.query;
	}
	clone() {
		return new t({
			name: this.name,
			entry: this.entry,
			test: this.test,
			query: this.query,
			files: this.files.map((e) => ({ ...e }))
		});
	}
	toJSON() {
		return {
			name: this.name,
			entry: this.entry,
			test: this.test,
			query: this.query,
			files: this.files.map((e) => ({ ...e }))
		};
	}
};
//#endregion
export { t as TpPrologProject };

//# sourceMappingURL=prolog-project.js.map