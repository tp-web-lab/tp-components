import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
	exampleFile,
	namedExamples,
	viewerSource,
} from "./component-basic-examples.mjs";
import { nativeMarkup } from "./native-markup.mjs";

/** Ignore literal script/code payloads, but inspect all rendered example markup. */
export function rawMarkup(language, source) {
	const lines = source.split("\n");
	const kept = [];
	for (let index = 0; index < lines.length; index++) {
		const line = lines[index];
		if (language === "md") {
			const script = /^\s*(:{3,}) script\b/.exec(line);
			const code = /^\s*(`{3,}|~{3,})/.exec(line);
			const delimiter = script?.[1] ?? code?.[1];
			if (delimiter) {
				while (++index < lines.length && lines[index].trim() !== delimiter) {}
				continue;
			}
		}
		if (
			language === "adoc" &&
			(/^\s*\[script\b/.test(line) || /^\s*\[source\b/.test(line))
		) {
			const delimiter = lines[++index]?.trim();
			while (++index < lines.length && lines[index].trim() !== delimiter) {}
			continue;
		}
		if (language === "adoc" && /^(\.{4,}|-{4,})$/.test(line.trim())) {
			const delimiter = line.trim();
			while (++index < lines.length && lines[index].trim() !== delimiter) {}
			continue;
		}
		if (
			language === "rst" &&
			/^\s*\.\. (script|code|code-block)::/.test(line)
		) {
			const depth = line.search(/\S/);
			while (
				index + 1 < lines.length &&
				(!lines[index + 1].trim() || lines[index + 1].search(/\S/) > depth)
			)
				index++;
			continue;
		}
		kept.push(line.replace(/``[^`]*``|`[^`]*`/g, ""));
	}
	return /<\/?[a-z][\w-]*(?:\s[^<>]*|\s*)>|\.\. raw::\s*html|^\s*\+{4,}\s*$/im.test(
		kept.join("\n"),
	);
}

/** Audit every language example set; conversion is explicit and label-preserving. */
export function auditNativeMarkup({ fix = false } = {}) {
	const root = resolve(import.meta.dirname, "..");
	const docs = join(root, "public/docs/components");
	const failures = [];
	let checked = 0,
		changed = 0;
	for (const dir of readdirSync(docs, { withFileTypes: true }).filter((entry) =>
		entry.isDirectory(),
	)) {
		const path = join(docs, dir.name, "examples");
		let files;
		try {
			files = readdirSync(path);
		} catch {
			continue;
		}
		const html = files.includes("examples.html")
			? namedExamples(
					"html",
					viewerSource(
						"html",
						readFileSync(join(path, "examples.html"), "utf8"),
					),
				)
			: [];
		for (const language of ["md", "adoc", "rst"]) {
			if (!files.includes(`examples.${language}`)) continue;
			const file = join(path, `examples.${language}`);
			const examples = namedExamples(
				language,
				viewerSource(language, readFileSync(file, "utf8")),
			);
			let dirty = false;
			for (const example of examples) {
				checked++;
				if (!rawMarkup(language, example.source)) continue;
				if (!fix) {
					failures.push(`${dir.name}/${language}: ${example.label}`);
					continue;
				}
				// Preserve hand-authored mathematics and language-specific examples.
				if (language === "md") {
					const replaced = example.source.replace(
						/<(tp-[\w-]+)\b[^>]*>[\s\S]*?<\/\1>/g,
						(value) => nativeMarkup(language, value, { inlineOnly: true }),
					);
					if (!rawMarkup(language, replaced)) {
						example.source = replaced;
						dirty = true;
						continue;
					}
				}
				const original = html.find((item) => item.label === example.label);
				if (!original)
					throw Error(`Missing canonical HTML: ${dir.name}/${example.label}`);
				example.source = nativeMarkup(language, original.source, {
					onAsset: (url, source) => {
						const asset = join(root, "public", url);
						mkdirSync(dirname(asset), { recursive: true });
						writeFileSync(asset, `${source}\n`);
					},
				});
				if (rawMarkup(language, example.source))
					throw Error(`Conversion left raw HTML: ${file}/${example.label}`);
				dirty = true;
			}
			if (dirty) {
				writeFileSync(file, exampleFile(language, `tp-${dir.name}`, examples));
				changed++;
			}
		}
	}
	return { checked, changed, failures };
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	const result = auditNativeMarkup({ fix: process.argv.includes("--fix") });
	console.log(
		`Checked ${result.checked} examples; updated ${result.changed} files.`,
	);
	if (result.failures.length) {
		console.error(result.failures.join("\n"));
		process.exitCode = 1;
	}
}
