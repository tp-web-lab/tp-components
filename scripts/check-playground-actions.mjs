/** Audit named APIs for every concrete playground, including inherited methods.
 * The menu-to-method contract is explicit: a new menu command requires a mapping.
 * This supplements (rather than replaces) behavior/guard/event tests.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../src/components");
const common = {
	"new-project": "newProject",
	"clear-project": "clearProject",
	"open-source-file": "openSourceFile",
	"save-file": "saveFile",
	"save-file-as": "saveFileAs",
	"import-disk": "importProject",
	"export-disk": "exportProject",
	"save-memory": "saveInMemory",
	"load-memory": "loadFromMemory",
	"clear-memory": "clearMemory",
	"run-project": "run",
	"test-project": "test",
	"reset-project": "reset",
};
const required = [
	"run",
	"test",
	"reset",
	"loadExample",
	"showLanguageHelp",
	"toggleEditorToolbar",
	...Object.values(common),
];
const shared = readFileSync(resolve(root, "playground/playground.ts"), "utf8");
const problems = [];
let components = 0,
	commands = 0;
for (const name of readdirSync(root).filter((name) =>
	name.endsWith("-playground"),
)) {
	if (!existsSync(resolve(root, name, `${name}.ts`))) continue;
	const file = resolve(root, name, `${name}.json`);
	if (!existsSync(file)) {
		problems.push(`${name}: missing API manifest`);
		continue;
	}
	const manifest = JSON.parse(readFileSync(file, "utf8"));
	const methods = new Set(
		(manifest.methods ?? []).map((method) => method.name.split("(")[0]),
	);
	for (const method of required)
		if (!methods.has(method))
			problems.push(`${name}: missing public ${method}()`);
	const source = `${shared}\n${readFileSync(resolve(root, name, `${name}.ts`), "utf8")}`;
	const actions = [
		...new Set(
			[...source.matchAll(/data-tp-playground-action="([^"]+)"/g)].map(
				(match) => match[1],
			),
		),
	];
	for (const action of actions) {
		const method =
			common[action] ??
			(/^(html|javascript|typescript)-importmap-/.test(action)
				? "setImportmap"
				: /^python-libs-/.test(action)
					? "setLibraries"
					: /^(asciidoc|markdown|restructuredtext)-extension-/.test(action)
						? "setExtensions"
						: action === "sql-reset-db"
							? "resetActiveDatabase"
							: null);
		if (!method) problems.push(`${name}: unmapped menu action ${action}`);
		else if (!methods.has(method))
			problems.push(`${name}: ${action} needs public ${method}()`);
		commands++;
	}
	components++;
}
if (problems.length) {
	console.error(problems.join("\n"));
	process.exitCode = 1;
} else
	console.log(
		`Verified ${commands} menu bindings and common named APIs in ${components} playgrounds (including inherited methods).`,
	);
