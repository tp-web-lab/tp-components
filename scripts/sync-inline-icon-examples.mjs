import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { exampleFile } from "./component-basic-examples.mjs";
import { readExamples } from "./standardize-component-examples.mjs";

/** Convert empty icon blocks only; retain structured sources and other markup. */
export function inlineIcons(language, source) {
	if (language === "md")
		return source.replace(/:tp-icon:(?:`[^`]*`|icon)\{/g, ":tp-icon:{").replace(
			/^([ \t]*)(:{3,}) tp-icon(?:[ \t]+\{([^\n]*)\})?[ \t]*\n\1\2[ \t]*$/gm,
			(_, indent, _fence, options) =>
				`${indent}:tp-icon:{${options ? options.trim() : ""}}`,
		);
	if (language === "adoc")
		return source.replace(
			/^([ \t]*)\[tp-icon([^\n]*)\]\n(={4,}|-{2,})\n\3[ \t]*$/gm,
			(_, indent, options) => `${indent}[tp-icon${options.replace(/^[^,]*/, (prefix) => prefix.replaceAll("%", ","))}]#icon#`,
		);
	const roles = [];
	let serial = 0;
	const result = source.replace(
		/^([ \t]*)\.\. tp-icon::[ \t]*(?:\n|$)((?:\1   :[^\n]*(?:\n|$))*)(?=\n|$)/gm,
		(match, indent, options, offset) => {
			// An indented body belongs to the icon, not to the surrounding example.
			const next = source.slice(offset + match.length).match(/\S[^\n]*/);
			const remainder = source.slice(offset + match.length);
			const line = remainder.split("\n").find((line) => line.trim());
			if (next && line && line.search(/\S/) > indent.length) return match;
			let name;
			do name = `inline-tp-icon-${++serial}`;
			while (source.includes(name));
			const attributes = options.split("\n").filter(Boolean)
				.map((line) => line.slice(indent.length)).join("\n");
			roles.push(`.. role:: ${name}(tp-icon)${attributes ? `\n${attributes}` : ""}`);
			return `${indent}:${name}:\`icon\`\n`;
		},
	);
	return roles.length ? `${roles.join("\n\n")}\n\n${result}` : result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const check = process.argv.includes("--check");
	let changed = 0;
	for (const component of readdirSync("public/docs/components")) {
		for (const language of ["adoc", "md", "rst"]) {
			const path = `public/docs/components/${component}/examples/examples.${language}`;
			if (!existsSync(path)) continue;
			const examples = readExamples(component, language);
			let dirty = false;
			for (const example of examples) {
				const next = inlineIcons(language, example.source);
				if (next === example.source) continue;
				dirty = true;
				example.source = next;
			}
			if (!dirty) continue;
			changed++;
			if (!check) writeFileSync(path, exampleFile(language, `tp-${component}`, examples));
			console.log(`${check ? "Outdated" : "Updated"}: ${path}`);
		}
	}
	console.log(`${changed} files ${check ? "need migration" : "updated"}.`);
	if (check && changed) process.exitCode = 1;
}
