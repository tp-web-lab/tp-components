import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseFragment } from "parse5";
import { describeExample } from "./component-example-descriptions.mjs";

const start = "<!-- tp-docgen:example-descriptions:start -->";
const end = "<!-- tp-docgen:example-descriptions:end -->";
const children = (node) => node?.content?.childNodes ?? node?.childNodes ?? [];
const attribute = (node, name) =>
	node.attrs?.find((item) => item.name === name)?.value;

/** Read only top-level selectable examples, never examples nested inside their source. */
export function exampleLabels(source) {
	function findViewer(node) {
		if (node.tagName === "tp-html-viewer") return node;
		for (const child of children(node)) {
			const found = findViewer(child);
			if (found) return found;
		}
	}
	const viewer = findViewer(parseFragment(source));
	const template = children(viewer).find((node) => node.tagName === "template");
	const labels = children(template ?? viewer)
		.filter(
			(node) => node.tagName === "div" && attribute(node, "role") === "example",
		)
		.map((node) => attribute(node, "label")?.trim());
	if (!labels.length || labels.some((label) => !label))
		throw new Error("Expected named HTML examples.");
	if (new Set(labels).size !== labels.length)
		throw new Error("Duplicate example titles.");
	return labels;
}

/** Preserve the rest of the Examples section, including authored explanatory subsections. */
export function synchronizeDescriptions(markdown, component, labels) {
	const section = markdown.match(
		/^## Examples?[^\S\n]*\n[\s\S]*?(?=^## |$(?![\s\S]))/m,
	);
	if (!section) throw new Error(`${component}: missing Examples section.`);
	const entries = labels
		.map((label) => `${label}\n: ${describeExample(component, label)}`)
		.join("\n\n");
	const block = `${start}\n${entries}\n${end}\n\n`;
	let body = section[0];
	const first = body.indexOf(start);
	if (first >= 0) {
		const last = body.indexOf(end, first);
		if (last < 0) throw new Error(`${component}: unclosed description block.`);
		body =
			body.slice(0, first) + body.slice(last + end.length).replace(/^\n*/, "");
	}
	const tabs = body.search(/^:{3,}\s+tp-tabs\b/m);
	if (tabs < 0) throw new Error(`${component}: missing language tabs.`);
	body = body.slice(0, tabs) + block + body.slice(tabs);
	return (
		markdown.slice(0, section.index) +
		body +
		markdown.slice(section.index + section[0].length)
	);
}

function main() {
	const root = resolve(import.meta.dirname, "../public/docs/components");
	const check = process.argv.includes("--check");
	let count = 0;
	let examples = 0;
	const pending = [];
	// Validate everything before writing, so missing descriptions cannot produce a partial update.
	for (const entry of readdirSync(root, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const path = join(root, entry.name, "index.md");
		const htmlPath = join(root, entry.name, "examples/examples.html");
		let html;
		try {
			html = readFileSync(htmlPath, "utf8");
		} catch (error) {
			if (error.code === "ENOENT") continue;
			throw error;
		}
		const source = readFileSync(path, "utf8");
		const labels = exampleLabels(html);
		const next = synchronizeDescriptions(source, entry.name, labels);
		if (next !== source) pending.push({ path, next });
		count += 1;
		examples += labels.length;
	}
	if (check && pending.length)
		throw new Error(
			`Outdated example descriptions:\n${pending.map(({ path }) => path).join("\n")}`,
		);
	if (!check) for (const { path, next } of pending) writeFileSync(path, next);
	console.log(
		`${check ? "Checked" : "Synchronized"} ${examples} example descriptions in ${count} component pages; ${pending.length} pages ${check ? "outdated" : "updated"}.`,
	);
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
	main();
