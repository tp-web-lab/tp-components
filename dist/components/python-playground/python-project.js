import { TpProject as e } from "../playground/project.js";
//#region src/components/python-playground/python-project.ts
var t = class t extends e {
	libs;
	constructor(e = {}) {
		super(e), this.libs = e.libs;
	}
	clone() {
		return new t({
			name: this.name,
			entry: this.entry,
			test: this.test,
			libs: this.libs === void 0 ? void 0 : [...this.libs],
			files: this.files.map((e) => ({ ...e }))
		});
	}
	toJSON() {
		return {
			name: this.name,
			entry: this.entry,
			test: this.test,
			libs: this.libs === void 0 ? void 0 : [...this.libs],
			files: this.files.map((e) => ({ ...e }))
		};
	}
};
//#endregion
export { t as TpPythonProject };

//# sourceMappingURL=python-project.js.map