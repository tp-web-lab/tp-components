import { createHash } from "node:crypto";
import { parseFragment, serializeOuter } from "parse5";

const kids = (node) => node.content?.childNodes ?? node.childNodes ?? [];
const attr = (node, name) =>
	node.attrs?.find((item) => item.name === name)?.value;
const indent = (text, size) =>
	text
		.split("\n")
		.map((line) => (line ? " ".repeat(size) + line : ""))
		.join("\n");
const dedent = (value) => {
	const lines = value.replace(/^\n/, "").trimEnd().split("\n");
	const depth = Math.min(
		...lines
			.filter((line) => line.trim())
			.map((line) => line.match(/^ */)[0].length),
	);
	return lines
		.map((line) => line.slice(depth))
		.join("\n")
		.trim();
};
const fence = (char, body, min = 3) => {
	let length = Math.max(
		min,
		...body
			.split("\n")
			.map((line) =>
				new RegExp(`^\\${char}+$`).test(line.trim())
					? line.trim().length + 1
					: 0,
			),
	);
	if (char === "=" && length === 7) length++;
	return char.repeat(length);
};

/** Convert authored HTML to native prose, lists, roles and component directives.
 * Script/code payloads are data, not document markup, and remain untouched.
 */
export function nativeMarkup(
	language,
	html,
	{ onAsset = () => {}, inlineOnly = false } = {},
) {
	if (language === "html") return html;
	const roles = [];
	const attributes = (node) => node.attrs ?? [];
	const rstOption = ({ name, value }) =>
		`   :${name}:${value ? ` ${value.replace(/\r?\n/g, "\n      ")}` : ""}`;
	// Native attribute parsers accept single-quoted JSON, not JSON-style escaped quotes.
	const quoteOption = (value) =>
		value.includes('"') && !value.includes("'")
			? `'${value}'`
			: JSON.stringify(value);
	const options = (node) =>
		attributes(node)
			.map(({ name, value }) =>
				value ? `${name}=${quoteOption(value)}` : name,
			)
			.join(" ");
	const adocOptions = (node) =>
		attributes(node)
			.filter((item) => !item.value)
			.map((item) => `%${item.name}`)
			.join("") +
		attributes(node)
			.filter((item) => item.value)
			.map(({ name, value }) => `,${name}=${JSON.stringify(value)}`)
			.join("");
	const text = (node) =>
		node.nodeName === "#text" ? node.value : kids(node).map(text).join("");
	const directive = (node, body) => {
		const name = node.tagName;
		if (language === "md") {
			const marker = fence(":", body);
			return `${marker} ${name}${options(node) ? ` { ${options(node)} }` : ""}\n${body ? `${body}\n` : ""}${marker}`;
		}
		if (language === "adoc") {
			const marker = fence("=", body, 4);
			return `[${name}${adocOptions(node)}]\n${marker}\n${body ? `${body}\n` : ""}${marker}`;
		}
		const attrs = attributes(node).map(rstOption).join("\n");
		return `.. ${name}::${attrs ? `\n${attrs}` : ""}${body ? `\n\n${indent(body, 3)}` : ""}`;
	};
	const inlineComponent = (node) => {
		const isField = /^tp-(text|math|number|date|time)field$/.test(node.tagName);
		const body = text(node).trim() || (node.tagName === "tp-ref" ? `${({"^":"note","@":"bibliography","%":"glossary"})[(attr(node,"href") ?? "")[0]] ?? "reference"}-${(attr(node,"href") ?? "").slice(1)}` : attr(node, "name")) || "…";
		if (isField && attr(node, "name") && (!text(node).trim() || text(node).trim() === attr(node, "name"))) node = { ...node, attrs: node.attrs.filter(attribute => attribute.name !== "name") };
		if (language === "md" && node.tagName === "tp-ref")
 return `:tp-ref:${text(node).trim()}{${options(node)}}`;
		if (language === "md" && node.tagName === "tp-icon")
			return `:tp-icon:{${options(node)}}`;
		if (language === "md")
			return `:${node.tagName}:\`${body}\`${options(node) ? `{${options(node)}}` : ""}`;
		if (language === "adoc")
			return `[${node.tagName}${adocOptions(node).replace(/^[^,]*/, (prefix) => prefix.replaceAll("%", ","))}]#${body}#`;
		const name = `example-${node.tagName}-${roles.length + 1}`;
		roles.push(
			`.. role:: ${name}(${node.tagName})\n${attributes(node)
				.map(rstOption)
				.join("\n")}`.trimEnd(),
		);
		return `:${name}:\`${body}\``;
	};
	const inline = (node) => {
		if (node.nodeName === "#text") return node.value.replace(/\s+/g, " ");
		const body = kids(node).map(inline).join("");
		if (["strong", "b"].includes(node.tagName))
			return `${language === "adoc" ? "*" : "**"}${body}${language === "adoc" ? "*" : "**"}`;
		if (["em", "i"].includes(node.tagName))
			return language === "adoc" ? `_${body}_` : `*${body}*`;
		if (node.tagName === "code")
			return language === "rst" ? `\`\`${text(node)}\`\`` : `\`${text(node)}\``;
		if (node.tagName === "a")
			return language === "md"
				? `[${body}](${attr(node, "href")})`
				: language === "adoc"
					? `${attr(node, "href")}[${body}]`
					: `\`${body} <${attr(node, "href")}>\`_`;
		if (node.tagName === "br")
			return language === "md" ? "  \n" : language === "adoc" ? " +\n" : "\n";
		if (node.tagName?.startsWith("tp-") || attributes(node).length)
			return inlineComponent(node);
		return body;
	};
	const blocks = (nodes, separator = "\n\n") => {
		let previousBlockName;
		// Adjacent phrasing nodes belong to one paragraph, including inside directives.
		const paragraphs = [];
		let phrasing = [];
		const flush = () => {
			const paragraph = phrasing.map(inline).join("").trim();
			if (paragraph) paragraphs.push(paragraph);
			phrasing = [];
		};
		for (const node of nodes) {
			if (
				node.nodeName === "#text" ||
				["strong", "b", "em", "i", "a", "code", "br"].includes(node.tagName) ||
				(node.tagName === "tp-icon" && !kids(node).some((child) => child.tagName))
			) {
				phrasing.push(node);
			} else {
				flush();
				const block = render(node);
				if (block) {
					// A blank line alone nests a following AsciiDoc list in the last item.
					if (language === "adoc" && ["ul", "ol"].includes(previousBlockName) && ["ul", "ol"].includes(node.tagName)) paragraphs.push("//");
					paragraphs.push(block);
					previousBlockName = node.tagName;
				}
			}
		}
		flush();
		return paragraphs.join(separator);
	};
	const list = (node, depth = 1) =>
		kids(node)
			.filter((child) => child.tagName === "li")
			.map((item, index) => {
				const marker =
					language === "adoc"
						? (node.tagName === "ol" ? "." : "*").repeat(depth)
						: node.tagName === "ol"
							? `${index + 1}.`
							: "-";
				const body = kids(item).filter(
					(child) => !["ul", "ol"].includes(child.tagName),
				);
				const nested = kids(item).filter((child) =>
					["ul", "ol"].includes(child.tagName),
				);
				const rendered = blocks(body, language === "adoc" && body.some(child => ["audio", "video"].includes(child.tagName)) ? "\n+\n" : "\n\n").trim();
				const isBlock = body.some(
					(child) =>
						child.tagName?.startsWith("tp-") ||
						["img", "svg", "audio", "video"].includes(child.tagName),
				);
				if (language === "adoc")
					return `${marker} ${isBlock ? `{blank}\n+\n${rendered}` : rendered || "{blank}"}${nested.length ? `\n${nested.map((child) => list(child, depth + 1)).join("\n")}` : ""}`;
				const content = `${rendered}${nested.length ? `${!rendered && language === "md" ? "" : "\n\n"}${nested.map((child) => list(child, depth + 1)).join("\n")}` : ""}`;
				const lines = content.split("\n");
				return `${marker} ${lines[0]}${lines.length > 1 ? `\n${indent(lines.slice(1).join("\n"), marker.length + 1)}` : ""}`;
			})
			.join("\n\n");
	const render = (node) => {
		const name = node.tagName;
		if (node.nodeName === "#comment") return "";
		if (node.nodeName === "#text") return node.value.trim();
		if (name === "script") return directive(node, dedent(text(node)));
		if (name === "pre") {
			const body = text(node).trim();
			if (language === "md") {
				const marker = fence("`", body);
				return `${marker}\n${body}\n${marker}`;
			}
			if (language === "adoc") {
				const marker = fence(".", body, 4);
				return `${marker}\n${body}\n${marker}`;
			}
			return `::\n\n${indent(body, 3)}`;
		}
		if (name === "svg") {
			const source = serializeOuter(node);
			const path = `/docs/medias/examples/${createHash("sha256").update(source).digest("hex").slice(0, 16)}.svg`;
			onAsset(path, source);
			return render({
				tagName: "img",
				attrs: [
					{ name: "src", value: path },
					{ name: "alt", value: attr(node, "aria-label") ?? "Illustration" },
					...attributes(node).filter((item) =>
						["width", "height"].includes(item.name),
					),
				],
				childNodes: [],
			});
		}
		// Inline media roles remain valid inside Markdown list items.
		if (language === "md" && ["audio", "video"].includes(name) && !kids(node).length)
			return `:${name}:{${options(node)}}`;
		if (name === "img") {
			const src = attr(node, "src"),
				alt = attr(node, "alt") ?? "";
			if (language === "adoc")
				return `image::${src}[${alt}${attr(node, "width") ? `,${attr(node, "width")}` : ""}${attr(node, "height") ? `,${attr(node, "height")}` : ""}]`;
			if (language === "rst")
				return `.. image:: ${src}\n   :alt: ${alt}${["width", "height"]
					.filter((key) => attr(node, key))
					.map((key) => `\n   :${key}: ${attr(node, key)}`)
					.join("")}`;
			return `![${alt}](${src})${
				attributes(node).some((item) => ["width", "height"].includes(item.name))
					? "{" +
						attributes(node)
							.filter((item) => ["width", "height"].includes(item.name))
							.map((item) => `${item.name}="${item.value}"`)
							.join(" ") +
						"}"
					: ""
			}`;
		}
		if (name === "p" && !attributes(node).length)
			return kids(node).map(inline).join("").trim();
		if (/^h[1-6]$/.test(name) && !attributes(node).length) {
			const body = kids(node).map(inline).join("").trim();
			// Section headings are not legal in every nested Docutils container.
			return language === "md"
				? `${"#".repeat(Number(name[1]))} ${body}`
				: directive(node, body);
		}
		if (
			["ul", "ol"].includes(name) &&
			!attributes(node).length &&
			!kids(node).some((child) => attributes(child).length)
		)
			return list(node);
		if (name === "dl" && !attributes(node).length) {
			const rows = [];
			let term = "";
			for (const child of kids(node)) {
				if (child.tagName === "dt")
					term = kids(child).map(inline).join("").trim();
				if (child.tagName !== "dd") continue;
				const groupedLists = language === "adoc" && kids(child).filter(node => ["ul", "ol"].includes(node.tagName)).length > 1;
				const body = blocks(kids(child), language === "adoc" && !groupedLists ? "\n+\n" : "\n\n");
				const definitionBody = groupedLists ? `--\n${body}\n--` : body;
				rows.push(
					language === "md"
						? `${term}\n:\n${indent(body, 2)}`
						: language === "adoc"
							? `${term}::\n+\n${definitionBody}`
							: `${term}\n${indent(body, 3)}`,
				);
			}
			return rows.join("\n\n");
		}
		if (name === "tp-icon" && !kids(node).some((child) => child.tagName))
			return inline(node);
		if (["strong", "b", "em", "i", "a", "code"].includes(name))
			return inline(node);
		if (!name) return blocks(kids(node));
		return directive(
			node,
			name === "p"
				? kids(node).map(inline).join("").trim()
				: blocks(kids(node)),
		);
	};
	const nodes = parseFragment(html).childNodes;
	const body = inlineOnly ? nodes.map(inline).join("") : blocks(nodes);
	return [...roles, body].join("\n\n");
}
