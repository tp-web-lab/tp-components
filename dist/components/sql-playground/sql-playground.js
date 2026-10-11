import { t as e } from "../../chunks/playground.js";
import { buildSqlExecutionDocument as t, createSqlStorageKey as n } from "./sql-execution-document.js";
import { TpSqlProject as r } from "./sql-project.js";
//#region src/components/sql-playground/sql-playground.ts
var i = class extends e {
	createEmptyProject() {
		return new r({
			name: "SQL project",
			entry: "/query.sql",
			setup: "/tables.sql",
			database: {
				id: "tables.sql",
				name: "tables.sql",
				type: "sql",
				path: "/tables.sql",
				active: !0
			},
			databases: [{
				id: "tables.sql",
				name: "tables.sql",
				type: "sql",
				path: "/tables.sql",
				active: !0
			}],
			files: [{
				path: "/tables.sql",
				language: "sql",
				content: "CREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL\n);\n\nINSERT INTO users (name) VALUES\n  ('Ada'),\n  ('Grace'),\n  ('Linus');"
			}, {
				path: "/query.sql",
				language: "sql",
				content: "SELECT * FROM users;"
			}]
		});
	}
	createNewProject() {
		return this.createEmptyProject();
	}
	createClearProject() {
		return new r({
			name: "Untitled project",
			files: []
		});
	}
	normalizeProject(e) {
		let t = e.clone();
		return (t.entry === void 0 || t.entry === "") && (t.entry = t.files.find((e) => e.path.endsWith(".sql"))?.path ?? t.files[0]?.path), t.databases === void 0 && typeof t.setup == "string" && (t.databases = [{
			id: t.setup,
			name: t.setup.split("/").filter(Boolean).at(-1) ?? "setup",
			type: "sql",
			path: t.setup,
			active: !0
		}], t.database = t.databases[0]), t;
	}
	resolveEntry(e) {
		return typeof e.entry == "string" && e.findFile(e.entry) !== void 0 ? e.entry : e.files.find((e) => e.path === "/query.sql")?.path ?? e.files.find((e) => e.path === "/main.sql")?.path ?? e.files.find((e) => e.path.endsWith(".sql"))?.path ?? null;
	}
	getPlaygroundKind() {
		return "sql";
	}
	getLanguageIconName() {
		return "file_type_sql";
	}
	getLanguageHelp() {
		return "\n      <h2>SQL</h2>\n      <p>Ce playground exécute SQL avec SQLite via sql.js.</p>\n      <ul>\n        <li><a href=\"https://www.sqlite.org/lang.html\" target=\"_blank\" rel=\"noreferrer\">SQLite language</a></li>\n        <li><a href=\"https://sql.js.org/\" target=\"_blank\" rel=\"noreferrer\">sql.js</a></li>\n      </ul>\n    ";
	}
	getAdditionalToolbarMenuItems() {
		return "\n      <li>\n        DB\n        <ul>\n          <li data-tp-playground-action=\"sql-reset-db\">Reset DB</li>\n        </ul>\n      </li>\n    ";
	}
	handleAdditionalToolbarAction(e) {
		switch (e) {
			case "sql-reset-db": return this.resetActiveDatabase(), !0;
			default: return !1;
		}
	}
	createProjectFromExample(e, t) {
		let n = e.setup, i = typeof n == "string" && n !== "" ? {
			id: n,
			name: n.split("/").filter(Boolean).at(-1) ?? n,
			type: "sql",
			path: n,
			active: !0
		} : void 0;
		return new r({
			name: e.name ?? e.label ?? e.id ?? "SQL project",
			entry: e.entry ?? "/query.sql",
			test: e.test,
			setup: n,
			database: i,
			databases: i === void 0 ? void 0 : [i],
			files: t
		});
	}
	async buildExecutionDocument(e) {
		return t(e, {
			entry: this.resolveEntry(e) ?? void 0,
			scope: this.getAttribute("execution-scope") ?? void 0
		});
	}
	resetActiveDatabase() {
		let e = this.getProject(), t = e.getActiveDatabase(), r = typeof t?.storageKey == "string" ? t.storageKey : n(e);
		localStorage.removeItem(r), localStorage.removeItem(`${r}:reset`), localStorage.removeItem(`${r}:name`), this.run();
	}
};
customElements.get("tp-sql-playground") || customElements.define("tp-sql-playground", i);
//#endregion
export { i as TpSqlPlayground, r as TpSqlProject };

//# sourceMappingURL=sql-playground.js.map