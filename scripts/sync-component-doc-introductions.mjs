import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parseFragment } from "parse5";
import {
	exampleFile,
	markupExample,
	namedExamples,
	viewerSource,
	withBasicUsage,
} from "./component-basic-examples.mjs";
import { normalizeExampleTabs } from "./component-example-tabs.mjs";

const root = resolve(import.meta.dirname, "..");
const componentsRoot = join(root, "src/components");
const docsRoot = join(root, "public/docs/components");
const checkOnly = process.argv.includes("--check");
const changed = [];
const basicStart = "<!-- tp-docgen:basic-usage:start -->";
const basicEnd = "<!-- tp-docgen:basic-usage:end -->";

function balancedElement(source, tag, from = 0) {
	const opening = new RegExp(`^[ \\t]*<${tag}\\b[^>]*>`, "img");
	opening.lastIndex = from;
	const first = opening.exec(source);
	if (first === null) return null;
	const fragment = parseFragment(source.slice(first.index), {
		sourceCodeLocationInfo: true,
	});
	const node = fragment.childNodes.find((child) => child.tagName === tag);
	if (!node?.sourceCodeLocation?.endTag)
		throw new Error(`Unclosed introductory ${tag}`);
	const end = first.index + node.sourceCodeLocation.endTag.endOffset;
	return { start: first.index, end, value: source.slice(first.index, end) };
}

function sourceMetadata(directory, manifest) {
	const sourcePath = join(componentsRoot, directory, `${directory}.ts`);
	const source = existsSync(sourcePath) ? readFileSync(sourcePath, "utf8") : "";
	const runtimeTag = source.match(
		/customElements\.define\(\s*['"](tp-[a-z0-9-]+)['"]/,
	)?.[1];
	const manifestTag =
		typeof manifest?.tagname === "string"
			? manifest.tagname.match(/^tp-[a-z0-9-]+/)?.[0]
			: undefined;
	const tag = runtimeTag ?? manifestTag;

	const classIndex = source.search(/export\s+class\s+\w+/);
	const classCommentStart =
		classIndex >= 0 ? source.lastIndexOf("/**", classIndex) : -1;
	const classComment =
		classCommentStart >= 0
			? source.slice(
					classCommentStart,
					source.indexOf("*/", classCommentStart) + 2,
				)
			: "";
	const moduleComment = source.startsWith("/**")
		? source.slice(0, source.indexOf("*/") + 2)
		: "";
	const extractSummary = (comment) =>
		comment
			.match(/@summary\s+(.+?)(?=\s+@[a-z-]+|\s*\*\/)/s)?.[1]
			?.replace(/^\s*\*\s?/gm, " ")
			.replace(/\s+/g, " ")
			.trim();
	const summary =
		extractSummary(classComment) ??
		extractSummary(moduleComment) ??
		(typeof manifest?.description === "string"
			? manifest.description.replace(/\s+/g, " ").trim()
			: "");
	return { tag, summary };
}

function dedent(value) {
	const lines = value
		.replace(/^\s*\n/, "")
		.replace(/\s*$/, "")
		.split("\n");
	const indentation = Math.min(
		...lines
			.filter((line) => line.trim())
			.map((line) => line.match(/^\s*/)[0].length),
	);
	return lines
		.map((line) => line.slice(indentation))
		.join("\n")
		.trim();
}

function unwrapViewer(value, directory, tag) {
	const viewer = parseFragment(value, {
		sourceCodeLocationInfo: true,
	}).childNodes.find((node) => node.tagName === "tp-html-viewer");
	const src = viewer.attrs.find((attribute) => attribute.name === "src")?.value;
	if (src) {
		const path = resolve(docsRoot, directory, src);
		if (!path.startsWith(`${docsRoot}/`) || !existsSync(path))
			throw new Error(`Unsupported introduction source: ${src}`);
		return readFileSync(path, "utf8").trim();
	}
	const template = viewer.childNodes.find(
		(node) => node.tagName === "template",
	);
	if (template?.sourceCodeLocation?.endTag) {
		return dedent(
			value.slice(
				template.sourceCodeLocation.startTag.endOffset,
				template.sourceCodeLocation.endTag.startOffset,
			),
		);
	}
	// A live tp-html-viewer is itself the example on its own component page.
	if (tag === "tp-html-viewer") return value.trim();
	return dedent(
		value.slice(
			viewer.sourceCodeLocation.startTag.endOffset,
			viewer.sourceCodeLocation.endTag.startOffset,
		),
	);
}

function directExample(preamble, tag) {
	const contains = (node) =>
		node.tagName === tag || (node.childNodes ?? []).some(contains);
	let skippedPageToc = false;
	for (const match of preamble.matchAll(/^<([a-z][a-z0-9-]*)\b/gm)) {
		const element = balancedElement(preamble, match[1], match.index);
		if (match[1] === "tp-toc" && (!skippedPageToc || tag !== "tp-toc")) {
			skippedPageToc = true;
			continue;
		}
		if (element && parseFragment(element.value).childNodes.some(contains))
			return element;
	}
	return null;
}

function synchronize(path, next) {
	if (existsSync(path) && readFileSync(path, "utf8") === next) return;
	changed.push(path);
	if (!checkOnly) writeFileSync(path, next);
}

let synchronized = 0;
for (const directory of readdirSync(docsRoot)) {
	const manifestPath = join(componentsRoot, directory, `${directory}.json`);
	const documentationPath = join(docsRoot, directory, "index.md");
	if (!existsSync(documentationPath)) continue;

	let manifest = null;
	if (existsSync(manifestPath)) {
		try {
			manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
		} catch {
			manifest = null;
		}
	}
	const { tag } = sourceMetadata(directory, manifest);
	if (typeof tag !== "string") continue;

	const markdown = readFileSync(documentationPath, "utf8");
	const usageIndex = markdown.search(/^## Usage\s*$/m);
	if (usageIndex < 0) continue;
	let preamble = markdown.slice(0, usageIndex);
	const existingViewer = balancedElement(preamble, "tp-html-viewer");
	const isolated =
		directory === "lang" || /-multi-(pages|slides)$/.test(directory);
	const frame = isolated ? balancedElement(preamble, "tp-iframe") : null;
	const direct = directExample(preamble, tag);
	const framePath = join(
		docsRoot,
		directory,
		"examples",
		"introduction-frame.html",
	);
	const rawExample = existingViewer
		? unwrapViewer(existingViewer.value, directory, tag)
		: (direct?.value ??
			(frame && existsSync(framePath)
				? readFileSync(framePath, "utf8").match(
						/<!-- example:start -->\n([\s\S]*?)\n<!-- example:end -->/,
					)?.[1]
				: undefined));
	if (!rawExample)
		throw new Error(`Missing introductory example for ${directory}`);
	const example = rawExample
		.split("\n")
		.map((line) => line.trimEnd())
		.join("\n");
	let liveExample = example;
	if (isolated) {
		if (!checkOnly)
			mkdirSync(join(docsRoot, directory, "examples"), { recursive: true });
		synchronize(
			framePath,
			`<!doctype html>\n<html lang="en">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${tag} — Basic usage</title></head>\n<body>\n<!-- example:start -->\n${example}\n<!-- example:end -->\n<script type="module" src="../../_shared/component-preview.js"></script>\n</body>\n</html>\n`,
		);
		liveExample = `<tp-iframe src="/docs/components/${directory}/examples/introduction-frame.html" title="${tag} — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>`;
	}
	const previous = existingViewer ?? frame ?? direct;
	if (previous)
		preamble =
			preamble.slice(0, previous.start) +
			liveExample +
			preamble.slice(previous.end);
	let next = `${preamble}${markdown.slice(usageIndex)}`;
	const generated = new RegExp(`${basicStart}[\\s\\S]*?${basicEnd}\\n*`);
	next = normalizeExampleTabs(next.replace(generated, ""));
	const files = Object.fromEntries(
		["html", "md", "adoc", "rst"].map((extension) => {
			const path = join(
				docsRoot,
				directory,
				"examples",
				`examples.${extension}`,
			);
			return [
				extension,
				{ path, source: viewerSource(extension, readFileSync(path, "utf8")) },
			];
		}),
	);
	const htmlExamples = namedExamples("html", files.html.source);
	const normalize = (value) =>
		value.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
	const currentFirst = htmlExamples[0]?.source ?? files.html.source;
	const firstIsIntro =
		normalize(currentFirst) ===
		normalize(
			viewerSource(
				"html",
				`<tp-html-viewer><template>${example}</template></tp-html-viewer>`,
			),
		);
	for (const [extension, file] of Object.entries(files)) {
		let examples = htmlExamples.length
			? namedExamples(extension, file.source)
			: [{ label: "Basic usage", source: file.source }];
		if (
			htmlExamples.length &&
			JSON.stringify(examples.map((item) => item.label)) !==
				JSON.stringify(htmlExamples.map((item) => item.label))
		) {
			throw new Error(`Mismatched example labels: ${directory}/${extension}`);
		}
		examples = withBasicUsage(
			examples,
			markupExample(extension, example, {
				onAsset: (url, source) => {
					const path = join(root, "public", url);
					if (!checkOnly) mkdirSync(dirname(path), { recursive: true });
					synchronize(path, `${source}\n`);
				},
			}),
			firstIsIntro,
		);
		synchronize(file.path, exampleFile(extension, tag, examples));
	}
	if (next !== markdown) {
		synchronize(documentationPath, next);
		synchronized += 1;
	}
}

console.log(
	`${checkOnly ? "Outdated" : "Synchronized"} ${synchronized} component documentation introductions.`,
);
if (checkOnly && changed.length) process.exitCode = 1;
