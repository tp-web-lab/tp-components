import ts from "typescript";
import { resolve } from "node:path";
import { readFileSync, readdirSync, existsSync, writeFileSync } from "node:fs";
const root = resolve(import.meta.dirname, "..");
const output = {};
for (const dir of readdirSync(root + "/src/components")) {
	const file = `${root}/src/components/${dir}/${dir}.ts`;
	if (!existsSync(file)) continue;
	const sf = ts.createSourceFile(
		file,
		readFileSync(file, "utf8"),
		ts.ScriptTarget.Latest,
		true,
	);
	const records = [];
	const assignments = new Map();
	function strings(n) {
		if (!n) return [];
		if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n))
			return [n.text];
		if (ts.isConditionalExpression(n))
			return [...strings(n.whenTrue), ...strings(n.whenFalse)];
		return [];
	}
	function visit(n) {
		if (ts.isObjectLiteralExpression(n)) {
			const a = Object.fromEntries(
				n.properties
					.filter(ts.isPropertyAssignment)
					.map((p) => [
						p.name.getText(sf).replace(/["']/g, ""),
						strings(p.initializer),
					]),
			);
			if (a.action?.length && a.icon?.length && a.label?.length)
				for (const label of a.label)
					records.push({
						label,
						icons: a.icon,
						library: a.library?.[0] || "",
						description: a.description?.[0] || "",
					});
		}

		if (
			ts.isStringLiteral(n) ||
			ts.isNoSubstitutionTemplateLiteral(n) ||
			ts.isTemplateExpression(n)
		) {
			const value = ts.isTemplateExpression(n)
				? n.getText(sf).slice(1, -1)
				: n.text;
			for (const m of value.matchAll(
				/<(tp-icon-button|tp-button|button)\b([^>]*)(?:>([\s\S]*?)<\/\1>)?/g,
			)) {
				const attrs = Object.fromEntries(
					[...m[2].matchAll(/([\w-]+)="([^"]*)"/g)].map((x) => [x[1], x[2]]),
				);
				const label =
					attrs["data-help-label"] ||
					attrs.label ||
					attrs["aria-label"] ||
					attrs.title;
				const icon =
					attrs.name || /<tp-icon\b[^>]*name="([^"]+)"/.exec(m[3] || "")?.[1];
				if (label && icon && !/[${}]/.test(label + icon))
					records.push({
						label,
						icons: [icon],
						library: attrs.library || "",
						description: attrs["data-help-description"] || "",
						line: sf.getLineAndCharacterOfPosition(n.pos).line + 1,
					});
			}
		}
		if (
			ts.isCallExpression(n) &&
			ts.isPropertyAccessExpression(n.expression) &&
			n.expression.name.text === "setAttribute"
		) {
			const key = strings(n.arguments[0])[0];
			if (
				[
					"name",
					"label",
					"aria-label",
					"data-help-label",
					"library",
					"data-help-description",
				].includes(key)
			) {
				let parent = n.parent;
				while (parent && !ts.isFunctionLike(parent) && !ts.isSourceFile(parent))
					parent = parent.parent;
				const id =
					(parent?.pos || 0) + "|" + n.expression.expression.getText(sf);
				const group = assignments.get(id) || {};
				group[key] = [
					...new Set([...(group[key] || []), ...strings(n.arguments[1])]),
				];
				assignments.set(id, group);
			}
		}
		ts.forEachChild(n, visit);
	}
	visit(sf);
	for (const a of assignments.values()) {
		const labels = a["data-help-label"] || a.label || a["aria-label"];
		if (labels?.length && a.name?.length)
			for (const label of labels)
				records.push({
					label,
					icons: a.name,
					library: a.library?.[0] || "",
					description: a["data-help-description"]?.[0] || "",
				});
	}
	output[dir] = records.filter(
		(r, i) =>
			records.findIndex(
				(x) => x.label === r.label && x.icons.join() === r.icons.join(),
			) === i,
	);
}

let checked = 0,
	icons = 0;
const failures = [];
for (const [name, controls] of Object.entries(output)) {
	const path = `${root}/public/docs/components/${name}/interactions.md`;
	if (!existsSync(path)) continue;
	checked++;
	// Multi-page viewers use the separately tested complete document catalog.
	if (name.endsWith("-multi-pages")) continue;
	const doc = readFileSync(path, "utf8");
	const documented = new Set(
		[...doc.matchAll(/:tp-icon:\{[^}]*name="([^"]+)"/g)].map(
			(match) => match[1],
		),
	);
	for (const control of controls)
		for (const icon of control.icons) {
			icons++;
			if (!documented.has(icon))
				failures.push(`${name}: ${control.label} (${icon})`);
		}
}
if (failures.length) {
	console.error(failures.join("\n"));
	process.exitCode = 1;
} else
	console.log(
		`Audited ${checked} component interaction pages: ${icons} source-defined icon/state occurrences documented; shared multi-page controls covered by help-presentation.test.ts.`,
	);
