/** Shared browser-safe HTML-to-LaTeX conversion for demos and documentation examples. */
import { parseFragment, serializeOuter } from "parse5";

const inline = new Set(
	"a abbr b bdi bdo br button cite code data del dfn em i img input ins kbd label mark q s samp small span strong sub sup time u var wbr".split(
		" ",
	),
);
const literal = new Set([
	"style",
	"template",
	"pre",
	"code",
	"textarea",
	"svg",
	"math",
]);
const children = (node) => node.content?.childNodes ?? node.childNodes ?? [];
const escapeText = (text) =>
	text.replace(
		/[\\{}$&#%_^~]/g,
		(char) =>
			({
				"\\": "\\textbackslash{}",
				"^": "\\textasciicircum{}",
				"~": "\\textasciitilde{}",
			})[char] ?? `\\${char}`,
	);

/** Delimited literal bodies avoid imposing brace balancing on embedded languages. */
export function rawBody(text) {
	for (const delimiter of [
		"|",
		"!",
		"+",
		"/",
		";",
		":",
		"?",
		"@",
		"`",
		"§",
		"¦",
		"¬",
		"¤",
	]) {
		if (!text.includes(delimiter)) return `${delimiter}${text}${delimiter}`;
	}
	throw new Error("No unused literal delimiter");
}

function attributes(node) {
	if (
		node.attrs.some(
			({ name, value }) =>
				/[\s=,{}\[\]\\%]/.test(name) ||
				/[,={}\[\]\\%#^$\n\r]/.test(value) ||
				value.trim() !== value,
		)
	)
		return null;
	return node.attrs.length
		? `[${node.attrs.map(({ name, value }) => (value ? `${name}=${value}` : name)).join(",")}]`
		: "";
}

// Keep authored MathJax delimiters as native LaTeX mathematics.
function latexText(text) {
	const parts = text.split(/(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g);
	return parts
		.map((part) =>
			part.startsWith("\\(")
				? `$${part.slice(2, -2)}$`
				: part.startsWith("\\[")
					? part
					: escapeText(part.replace(/\s+/g, " ")),
		)
		.join("");
}

export function latexMarkup(html) {
	function convert(node, inlineContext = false, depth = 0) {
		const pad = "  ".repeat(depth);
		if (node.nodeName === "#text") return latexText(node.value);
		if (node.nodeName === "#comment") return "";
		const tag = node.tagName;
		const significant = children(node).filter(
			(child) => child.nodeName !== "#text" || child.value.trim(),
		);
		if (!tag) return significant.map((child) => convert(child)).join("\n\n");
		const attrs = attributes(node);
		if (
			attrs === null ||
			literal.has(tag) ||
			node.namespaceURI !== "http://www.w3.org/1999/xhtml"
		) {
			return `${pad}\\rawhtml${inline.has(tag) || inlineContext ? "*" : ""}${rawBody(serializeOuter(node))}`;
		}
		if (tag === "img" && node.parentNode?.tagName === "tp-carousel" &&
			node.attrs.every(({name}) => ["src", "alt"].includes(name))) {
			const src = node.attrs.find(({name}) => name === "src")?.value;
			const alt = node.attrs.find(({name}) => name === "alt")?.value;
			if (src) return `${pad}\\includegraphics${alt ? `[alt=${alt}]` : ""}{${src}}`;
		}
		if (tag === "script")
			return `${pad}\\wcScript${attrs}${rawBody(
				children(node)
					.map((n) => n.value ?? "")
					.join(""),
			)}`;
		const bare = node.attrs.length === 0;
		const inlineBody = () =>
			children(node)
				.map((child) => convert(child, true))
				.join("")
				.trim();
		if (bare && tag === "p") return `${pad}${inlineBody()}\n`;
		const formatting = {
			strong: "textbf",
			b: "textbf",
			em: "emph",
			i: "textit",
		};
		if (bare && formatting[tag]) return `\\${formatting[tag]}{${inlineBody()}}`;
		if (bare && tag === "br") return "\\\\\n";
		const headings = { h2: "section", h3: "subsection", h4: "subsubsection" };
		if (bare && headings[tag])
			return `${pad}\\${headings[tag]}*{${inlineBody()}}`;
		if (
			bare &&
			["ul", "ol"].includes(tag) &&
			significant.length &&
			significant.every(
				(child) => child.tagName === "li" && !child.attrs.length,
			)
		) {
			const env = tag === "ul" ? "itemize" : "enumerate";
			const items = significant.map((item) => {
				const body = children(item)
					.map((child) => convert(child, false, depth + 1))
					.join("")
					.trim();
				return `${pad}  \\item ${body}`;
			});
			return `${pad}\\begin{${env}}\n${items.join("\n")}\n${pad}\\end{${env}}`;
		}
		if (
			bare &&
			tag === "dl" &&
			significant.length % 2 === 0 &&
			significant.every(
				(child, i) =>
					child.tagName === (i % 2 ? "dd" : "dt") && !child.attrs.length,
			)
		) {
			const items = [];
			for (let i = 0; i < significant.length; i += 2) {
				const term = children(significant[i])
					.map((child) => convert(child, true))
					.join("");
				const body = children(significant[i + 1])
					.map((child) => convert(child, false, depth + 1))
					.join("")
					.trim();
				items.push(`${pad}  \\item[{${term}}] ${body}`);
			}
			return `${pad}\\begin{description}\n${items.join("\n")}\n${pad}\\end{description}`;
		}
		const mixed =
			inline.has(tag) ||
			tag === "p" ||
			/^h[1-6]$/.test(tag) ||
			children(node).some(
				(child) => child.nodeName === "#text" && child.value.trim(),
			);
		const body = mixed
			? children(node)
					.map((child) => convert(child, true))
					.join("")
			: significant.map((child) => convert(child, false, depth + 1)).join("\n");
		const isInline = inline.has(tag) || (tag.includes("-") && inlineContext);
		const name = tag
			.split("-")
			.map((part) => part[0].toUpperCase() + part.slice(1))
			.join("");
		const command = /^[A-Za-z]+$/.test(name)
			? `\\wc${name}${isInline ? "*" : ""}${attrs}`
			: `\\webcomponent${attrs}{${tag}}`;
		return !mixed && body
			? `${pad}${command}{\n${body}\n${pad}}`
			: `${pad}${command}{${body}}`;
	}
	return convert(parseFragment(html)).trim();
}

