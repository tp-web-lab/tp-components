import { parseFragment, serializeOuter } from "parse5";
import { EXAMPLE_TABS_FENCE } from "./component-example-tabs.mjs";
import { nativeMarkup } from "./native-markup.mjs";

const indent = (text, size) =>
	text
		.split("\n")
		.map((line) =>
			line.trim() ? " ".repeat(size) + line.replace(/(?<=\S) $/, "") : "",
		)
		.join("\n");
const attr = (node, name) =>
	node.attrs?.find((item) => item.name === name)?.value;
const children = (node) =>
	node.tagName === "template"
		? node.content.childNodes
		: (node.childNodes ?? []);
const find = (node, predicate) =>
	predicate(node)
		? node
		: children(node)
				.map((child) => find(child, predicate))
				.find(Boolean);
const dedent = (text) => {
	const lines = text.replace(/^\n/, "").trimEnd().split("\n");
	const width = Math.min(
		...lines
			.filter((line) => line.trim())
			.map((line) => line.match(/^ */)[0].length),
	);
	return lines
		.map((line) => line.slice(width))
		.join("\n")
		.trim();
};
const fence = (character, text, minimum = 4) => {
	let length = Math.max(
		minimum,
		...text
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => new RegExp(`^\\${character}+$`).test(line))
			.map((line) => line.length + 1),
	);
	// Seven equals signs look like a Git conflict marker.
	if (character === "=" && length === 7) length++;
	return character.repeat(length);
};

/** Read the editable source, not the wrapper that displays its editor. */
export function viewerSource(extension, text) {
	if (extension === "html") {
		const root = find(
			parseFragment(text),
			(node) => node.tagName === "tp-html-viewer",
		);
		if (!root) throw new Error("Missing HTML viewer");
		const template = children(root).find((node) => node.tagName === "template");
		return dedent(
			children(template ?? root)
				.map(serializeOuter)
				.join(""),
		);
	}
	if (extension === "md") {
		const match = /^(:{3,}) script[^\n]*\n/m.exec(text);
		if (!match) throw new Error("Missing Markdown source script");
		const body = text.slice(match.index + match[0].length);
		const end = body.search(new RegExp(`^${match[1]}[ \\t]*$`, "m"));
		return (end < 0 ? body : body.slice(0, end)).trim();
	}
	if (extension === "adoc") {
		const match = /^\[script[^\n]*\]\n([^\w\s]{4,})\n/m.exec(text);
		if (!match) throw new Error("Missing AsciiDoc source script");
		const body = text.slice(match.index + match[0].length);
		const end = body.split("\n").findIndex((line) => line.trim() === match[1]);
		if (end < 0) throw new Error("Unclosed AsciiDoc source script");
		return body.split("\n").slice(0, end).join("\n").trim();
	}
	const match = /^([ ]*)\.\. script::\s*\n(?:[ ]+:[^\n]*\n)+\s*\n/m.exec(text);
	if (!match) throw new Error("Missing reStructuredText source script");
	return dedent(text.slice(match.index + match[0].length));
}

/** Extract named examples while preserving their original language source. */
export function namedExamples(extension, source) {
	if (extension === "html") {
		const nodes = parseFragment(source).childNodes;
		return nodes
			.filter((node) => attr(node, "role") === "example")
			.map((node) => ({
				label: attr(node, "label") ?? "Example",
				source: dedent(children(node).map(serializeOuter).join("")),
			}));
	}
	const result = [];
	const lines = source.split("\n");
	for (let index = 0; index < lines.length; index++) {
		if (extension === "rst") {
			const match = /^\.\. example::\s*(.+)$/.exec(lines[index]);
			if (!match) continue;
			const start = ++index;
			while (
				index < lines.length &&
				(!lines[index].trim() || lines[index].startsWith(" "))
			)
				index++;
			result.push({
				label: match[1],
				source: dedent(lines.slice(start, index).join("\n")),
			});
			index--;
			continue;
		}
		const match =
			extension === "md"
				? /^(`{3,}|~{3,})\s*example\b.*label=["']([^"']+)["']/.exec(
						lines[index],
					)
				: /^\.([^.].*)$/.exec(lines[index]);
		if (!match) continue;
		const delimiter = extension === "md" ? match[1] : lines[++index];
		if (extension === "adoc" && !/^={4,}$/.test(delimiter ?? "")) continue;
		const start = ++index;
		while (index < lines.length && lines[index] !== delimiter) index++;
		result.push({
			label: extension === "md" ? match[2] : match[1],
			source: lines.slice(start, index).join("\n").trim(),
		});
	}
	return result;
}

/** Generate native markup rather than HTML passthrough blocks. */
export const markupExample = nativeMarkup;

export function exampleFile(extension, tag, examples) {
	const fullWindow = /-multi-(pages|slides)$/.test(tag) || tag === "tp-post-it" || tag === "tp-post-it-editor";
	const frameMinHeight = tag === "tp-post-it-editor" ? "48rem" : "32rem";
	const frameStyle =
		extension === "html"
			? `--tp-html-viewer-frame-min-height: ${frameMinHeight}`
			: `--tp-markup-viewer-frame-min-height: ${frameMinHeight}`;
	const body = examples
		.map(({ label, source }) => {
			if (extension === "html")
				return `<div role="example" label="${label.replaceAll('"', "&quot;")}">\n${indent(source, 2)}\n</div>`;
			if (extension === "md") {
				const marker = fence("`", source, 3);
				return `${marker} example {label=${JSON.stringify(label)}}\n${source}\n${marker}`;
			}
			if (extension === "adoc") {
				// Valid AsciiDoc fences must not resemble Git conflict markers.
				if (/^={7}$/m.test(source)) {
					const replacement = fence("=", source, 8);
					source = source.replace(/^={7}$/gm, replacement);
				}
				const marker = fence("=", source, 6);
				return `.${label}\n${marker}\n${source}\n${marker}`;
			}
			return `.. example:: ${label}\n\n${indent(source, 3)}`;
		})
		.join("\n\n");
	if (extension === "html")
		return `<tp-html-viewer label="${tag}" allow-script${fullWindow ? ` style="${frameStyle}"` : ""}>\n  <template>\n${indent(body, 4)}\n  </template>\n</tp-html-viewer>\n`;
	if (extension === "md") {
		const script = fence(":", body, 4);
		const viewer = `${script}:`;
		if (viewer.length >= EXAMPLE_TABS_FENCE.length) {
			throw new Error(
				`${tag}: Markdown examples need shorter nested fences than the ${EXAMPLE_TABS_FENCE.length}-colon language tabs.`,
			);
		}
		return `${viewer} tp-markdown-viewer { label="${tag}" allow-script${fullWindow ? ` style="${frameStyle}"` : ""} }\n${script} script { type="tp/markdown" }\n${body}\n${script}\n${viewer}\n`;
	}
	if (extension === "adoc") {
		const script = fence("-", body);
		const viewer = fence("=", body, 8);
		return `[tp-asciidoc-viewer%allow-script,label="${tag}"${fullWindow ? `,style="${frameStyle}"` : ""}]\n${viewer}\n[script,type="tp/asciidoc"]\n${script}\n${body}\n${script}\n${viewer}\n`;
	}
	return `.. tp-restructuredtext-viewer::\n   :label: ${tag}\n   :allow-script:${fullWindow ? `\n   :style: ${frameStyle}` : ""}\n\n   .. script::\n      :type: tp/restructuredtext\n\n${indent(body, 6)}\n`;
}

/** Updates the generated first example instead of archiving outdated introductions. */
export function withBasicUsage(examples, source, firstIsIntro = false) {
	const remaining =
		firstIsIntro || examples[0]?.label === "Basic usage"
			? examples.slice(1)
			: examples;
	return [{ label: "Basic usage", source }, ...remaining];
}
