//#region src/components/playground/project.ts
var e = class e {
	name;
	entry;
	test;
	files;
	constructor(e = {}) {
		this.name = e.name ?? "Untitled project", this.entry = e.entry, this.test = e.test, this.files = e.files?.map((e) => ({ ...e })) ?? [];
	}
	clone() {
		return new e({
			name: this.name,
			entry: this.entry,
			test: this.test,
			files: this.files.map((e) => ({ ...e }))
		});
	}
	findFile(e) {
		return this.files.find((t) => t.path === e);
	}
	setFiles(e) {
		this.files = e.map((e) => ({ ...e }));
	}
	toJSON() {
		return {
			name: this.name,
			entry: this.entry,
			test: this.test,
			files: this.files.map((e) => ({ ...e }))
		};
	}
	static fromJSON(t) {
		if (typeof t != "object" || !t) return null;
		let n = t;
		if (!Array.isArray(n.files)) return null;
		let r = n.files.filter((e) => {
			if (typeof e != "object" || !e) return !1;
			let t = e;
			return typeof t.path == "string" && typeof t.content == "string";
		}).map((e) => ({ ...e }));
		return new e({
			name: typeof n.name == "string" ? n.name : void 0,
			entry: typeof n.entry == "string" ? n.entry : void 0,
			test: typeof n.test == "string" ? n.test : void 0,
			files: r
		});
	}
};
//#endregion
export { e as TpProject };

//# sourceMappingURL=project.js.map