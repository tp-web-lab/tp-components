/** Structural regression check for named command actions across all component classes.
 * Checks literal switch commands and named public delegates, including inheritance.
 * Does not prove runtime behavior or discover arbitrary dynamic UI construction.
 */

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "../src/components");
const delegated = new Map([
	[
		"code-editor.runKeyboardAction.save-as",
		"requestSave delegates to public saveAs with error reporting",
	],
	[
		"object-tree.handleTreeContextAction.toggle-guides",
		"Owned by the embedded tp-tree.toggleGuides",
	],
	[
		"prose-editor.runFileAction.load-html",
		"Legacy alias; current file menu uses public openImport(language)",
	],
	[
		"prose-editor.runFileAction.import-markdown",
		"public openImport(language) constructs the language-specific import action",
	],
	["tangram.handleClick.help", "public toggleHelp uses the same dropdown"],
	[
		"tree.handleGlobalContextAction.sort-all",
		"public sortAll delegates to sortAllItems",
	],
	[
		"tree.handleNodeContextAction.toggle-guides",
		"Grouped global cases delegate to public tree actions",
	],
	[
		"tree.handleNodeContextAction.sort",
		"public sortNodeChildren delegates to sortChildrenOfItem",
	],
]);
let checked = 0;
const missing = [];
const all = new Map();
for (const d of fs.readdirSync(root)) {
	const f = path.join(root, d, `${d}.ts`);
	if (!fs.existsSync(f)) continue;
	const sf = ts.createSourceFile(f, fs.readFileSync(f, "utf8"), 99, true);
	for (const c of sf.statements.filter(ts.isClassDeclaration)) {
		if (!c.name?.text.startsWith("Tp")) continue;
		all.set(c.name.text, {
			sf,
			c,
			d,
			m: new Map(
				c.members.filter((x) => x.name).map((x) => [x.name.getText(sf), x]),
			),
		});
	}
}
const pub = (m) =>
	!m.modifiers?.some((x) =>
		[ts.SyntaxKind.PrivateKeyword, ts.SyntaxKind.ProtectedKeyword].includes(
			x.kind,
		),
	);
const walk = (n, f) => {
	f(n);
	ts.forEachChild(n, (x) => walk(x, f));
};
for (const data of all.values()) {
	const { d, m } = data;
	const publicNames = new Set(),
		literals = new Set();
	let cursor = data;
	const seen = new Set();
	while (cursor && !seen.has(cursor)) {
		seen.add(cursor);
		for (const [n, x] of cursor.m)
			if (pub(x)) {
				publicNames.add(n);
				if (ts.isMethodDeclaration(x))
					walk(x, (y) => {
						if (ts.isStringLiteral(y)) literals.add(y.text);
					});
			}
		const parent = cursor.c.heritageClauses?.[0]?.types[0]?.expression.getText(
			cursor.sf,
		);
		cursor = all.get(parent);
	}
	for (const [n, x] of m) {
		if (pub(x) || !/(action|command|click|select)/i.test(n)) continue;
		walk(x, (node) => {
			if (!ts.isCaseClause(node) || !ts.isStringLiteral(node.expression))
				return;
			const key = node.expression.text;
			checked++;
			if (literals.has(key)) return;
			let covered = false,
				calls = [];
			for (const stmt of node.statements)
				walk(stmt, (y) => {
					if (
						ts.isCallExpression(y) &&
						ts.isPropertyAccessExpression(y.expression) &&
						y.expression.expression.kind === ts.SyntaxKind.ThisKeyword
					) {
						const name = y.expression.name.text;
						calls.push(name);
						if (publicNames.has(name)) covered = true;
					}
				});
			if (
				!covered &&
				node.statements.length &&
				!delegated.has(`${d}.${n}.${key}`)
			)
				missing.push(
					`${d}.${n}: ${key} (calls ${calls.join(", ") || "inline implementation"})`,
				);
		});
	}
}

for (const [owner, methods] of [
	["TpCodeEditor", ["saveAs"]],
	["TpTree", ["toggleGuides", "sortAll", "sortNodeChildren"]],
	["TpProseEditor", ["openImport"]],
	["TpTangram", ["toggleHelp"]],
]) {
	for (const name of methods) {
		const method = all.get(owner)?.m.get(name);
		if (!method || !pub(method))
			missing.push(`${owner}: missing public delegate ${name}`);
	}
}

if (missing.length) {
	console.error(missing.join("\n"));
	process.exitCode = 1;
} else
	console.log(
		`Verified ${checked} literal command branches across ${all.size} component classes, with documented delegates for embedded/legacy controls.`,
	);
