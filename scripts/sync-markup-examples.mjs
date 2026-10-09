import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
	exampleFile,
	namedExamples,
	viewerSource,
} from "./component-basic-examples.mjs";
import { nativeMarkup } from "./native-markup.mjs";

const root = resolve(import.meta.dirname, "..");
const docs = join(root, "public/docs/components");
const selected = new Set(process.argv.slice(2));
let count = 0;
for (const dir of readdirSync(docs, { withFileTypes: true })) {
	if (!dir.isDirectory() || (selected.size && !selected.has(dir.name)))
		continue;
	const folder = join(docs, dir.name, "examples");
	const html = join(folder, "examples.html");
	if (!existsSync(html)) continue;
	const examples = namedExamples(
		"html",
		viewerSource("html", readFileSync(html, "utf8")),
	);
	if (!examples.length) throw Error(`No named examples in ${html}`);
	for (const language of ["md", "adoc", "rst"]) {
		const translated = examples.map((example) => ({
			...example,
			source: nativeMarkup(language, example.source, {
				onAsset: (url, source) => {
					const path = join(root, "public", url);
					mkdirSync(dirname(path), { recursive: true });
					writeFileSync(path, `${source}\n`);
				},
			}),
		}));
		writeFileSync(
			join(folder, `examples.${language}`),
			exampleFile(language, `tp-${dir.name}`, translated),
		);
	}
	count++;
}
console.log(`Translated ${count} component example sets with native markup.`);
