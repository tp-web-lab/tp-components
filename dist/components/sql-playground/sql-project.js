import { TpProject as e } from "../playground/project.js";
//#region src/components/sql-playground/sql-project.ts
var t = class t extends e {
	setup;
	database;
	databases;
	constructor(e = {}) {
		super(e), this.setup = e.setup, this.database = e.database, this.databases = e.databases;
	}
	getActiveDatabase() {
		return this.databases?.find((e) => e.active === !0) ?? this.database;
	}
	clone() {
		return new t({
			name: this.name,
			entry: this.entry,
			test: this.test,
			setup: this.setup,
			database: this.database === void 0 ? void 0 : { ...this.database },
			databases: this.databases?.map((e) => ({ ...e })),
			files: this.files.map((e) => ({ ...e }))
		});
	}
	toJSON() {
		return {
			name: this.name,
			entry: this.entry,
			test: this.test,
			setup: this.setup,
			database: this.database === void 0 ? void 0 : { ...this.database },
			databases: this.databases?.map((e) => ({ ...e })),
			files: this.files.map((e) => ({ ...e }))
		};
	}
};
//#endregion
export { t as TpSqlProject };

//# sourceMappingURL=sql-project.js.map