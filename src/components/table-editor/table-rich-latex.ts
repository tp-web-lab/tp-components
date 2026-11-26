import { babelLanguages, quotationMarks } from "@tp/tp-utilities";
import { nativeImageOptions } from "../../utilities/markup-native-presentation.js";
import { stripTheoremPresentation } from "../theorem/theorem-numbering.js";
import { serializeTable, type TableData } from "./table-markup.js";
/** Convert rich cell content to native LaTeX text and multimedia commands. */
export function tableRichLatex(
	html: string,
	escapeText: (text: string) => string,
	options: { document?: boolean } = {},
): string {
	const template = document.createElement("template");
	template.innerHTML = html;
	stripTheoremPresentation(template.content);
	const wc = (node: Element, content: string): string => {
		const name = node.localName
			.split("-")
			.map((part) => part[0]?.toUpperCase() + part.slice(1))
			.join("");
		const attrs = [...node.attributes]
			.filter((attr) => !attr.name.startsWith("data-tp-"))
			.map((attr) => `${attr.name}={${escapeText(attr.value)}}`)
			.join(",");
		const inline =
			[
				"span",
				"a",
				"source",
				"track",
				"br",
				"tp-icon",
				"mark",
				"ins",
				"kbd",
				"cite",
				"label",
				"input",
				"sup",
				"sub",
			].includes(node.localName) ||
			(node.localName.includes("-") &&
				!!node.parentElement?.closest("p,span,strong,em,a,h1,h2,h3,h4,h5,h6"));
		if (!inline) content = content.trim();
		if (/\d/.test(name))
			return `\\webcomponent${attrs ? `[${attrs}]` : ""}{${node.localName}}{${content}}`;
		return `\\wc${name}${inline ? "*" : ""}${attrs ? `[${attrs}]` : ""}{${content}}`;
	};
	const indexDeclarations = new Map<string, string>();
	const indexCommand = (metadata: string): { name: string; entry?: string } => {
		const parsed = JSON.parse(metadata);
		const definition = parsed.definition ?? parsed;
		const { name, title, intoc } = definition;
		if (
			typeof name !== "string" ||
			!/^[a-zA-Z][\w-]*$/.test(name) ||
			typeof title !== "string" ||
			/[\\{}]/.test(title)
		)
			throw new Error("Invalid index metadata");
		indexDeclarations.set(
			name,
			`\\makeindex[name=${name},title={${title}}${intoc ? ",intoc" : ""}]`,
		);
		return { name, entry: parsed.entry };
	};
	const indexDefinitions = [...template.content.querySelectorAll("tp-index")];
	const multipleIndexScopes =
		new Set(
			indexDefinitions.map(
				(node) =>
					node.closest("[data-tp-reference-scope],article,main") ??
					template.content,
			),
		).size > 1;
	const group = (node: Element) => node.getAttribute("index") || "default";
	const indexEntry = (node: Element, seen = new Set<Element>()): string => {
		if (seen.has(node)) throw Error("Cyclic index parent");
		seen.add(node);
		const key = node.getAttribute("sort-key") || node.getAttribute("ref") || "";
		const title = node.getAttribute("title") || node.getAttribute("ref") || "";
		if (!key || /[!@|{}\\]/.test(key + title))
			throw Error(
				"Index terms require plain text without reserved imakeidx characters",
			);
		const part = key === title ? key : `${key}@${title}`;
		const parent = indexDefinitions.find(
			(p) =>
				group(p) === group(node) &&
				p.getAttribute("ref") === node.getAttribute("parent"),
		);
		return parent ? `${indexEntry(parent, seen)}!${part}` : part;
	};
	const declareIndex = (node: Element) => {
		const list = [
			...template.content.querySelectorAll('tp-listof[selector="tp-index"]'),
		].find((l) => group(l) === group(node));
		indexCommand(
			JSON.stringify({
				name: group(node),
				title: list?.getAttribute("title") || "Index",
				intoc: list?.hasAttribute("intoc") || false,
			}),
		);
	};

	const equationDefinitions = [
		...template.content.querySelectorAll("tp-equanum[ref]"),
	];
	const equationCode = new Map<Element, string>();
	const nativeDefinitions = new Set<Element>();
	const validKey = (key: string) => /^[\w:.-]+$/.test(key);
	for (const definition of equationDefinitions) {
		const key = definition.getAttribute("ref") ?? "";
		if (
			!validKey(key) ||
			equationDefinitions.filter((e) => e.getAttribute("ref") === key).length >
				1
		)
			continue;
		const target = definition.getAttribute("target");
		if (target?.startsWith("#")) {
			const math = [...template.content.querySelectorAll("tp-math[id]")].find(
				(e) => e.id === target.slice(1),
			);
			const encoded = math?.getAttribute("data-latex-equation-source");
			let native: string | undefined;
			try {
				native = encoded ? decodeURIComponent(encoded) : undefined;
			} catch {
				native = undefined;
			}
			if (
				math &&
				native &&
				native.replace(/\\label\s*\{[^{}]*\}/g, "").trim() ===
					(
						math.getAttribute("value") ??
						math.querySelector("script")?.textContent ??
						""
					).trim()
			) {
				equationCode.set(math, native);
				nativeDefinitions.add(definition);
			}
		} else {
			const math = definition.querySelector(":scope > tp-math");
			if (
				!math ||
				math.getAttribute("mode") === "asciimath" ||
				[...definition.children].some(
					(e) => e !== math && !e.hasAttribute("data-tp-equanum-generated"),
				)
			)
				continue;
			if (
				[...definition.attributes].some(
					(a) => !["ref", "number"].includes(a.name),
				)
			)
				continue;
			const value =
				math.getAttribute("value") ??
				math.querySelector("script")?.textContent ??
				math.textContent ??
				"";
			const number = definition.getAttribute("number") ?? "";
			if (
				!number ||
				/[{}\\]/.test(number) ||
				/\\(?:tag|label|begin)\b/.test(value)
			)
				continue;
			equationCode.set(
				definition,
				`\\begin{equation}${number ? `\\tag{${number}}` : ""}\\label{${key}}\n${value}\n\\end{equation}`,
			);
			nativeDefinitions.add(definition);
		}
	}
	const theoremDeclarations: string[] = [];
	let theoremSerial = 0;
	const theoremEnvironments = new Map<string, string>();
	const usedTheoremNames = new Set<string>();
	const render = (node: Node): string => {
		if (node instanceof Element) {
			if (node.hasAttribute("data-tp-equanum-generated")) return "";
			if (equationCode.has(node)) return equationCode.get(node) ?? "";
			if (nativeDefinitions.has(node)) return "";
			if (
				node.localName === "tp-math" &&
				node.id &&
				equationDefinitions.some(
					(e) => e.getAttribute("target") === `#${node.id}`,
				)
			)
				return wc(node, "");
			if (
				node.localName === "tp-ref" &&
				node.getAttribute("href")?.startsWith("=") &&
				!node.hasAttribute("silent")
			) {
				const key = node.getAttribute("href")?.slice(1) ?? "";
				const definition = equationDefinitions.find(
					(e) => e.getAttribute("ref") === key && nativeDefinitions.has(e),
				);
				if (
					definition &&
					[...node.attributes].every((a) =>
						["href", "label", "class"].includes(a.name),
					)
				) {
					const label = node.getAttribute("label");
					const number = definition.getAttribute("number") ?? "";
					const command =
						label === null || label === `(${number})`
							? `\\eqref{${key}}`
							: label === number
								? `\\ref{${key}}`
								: null;
					if (command)
						return node.className
							? `\\tpAttributes*[class={${escapeText(node.className)}}]{${command}}`
							: command;
				}
			}
		}

		if (
			node instanceof Element &&
			multipleIndexScopes &&
			(node.localName === "tp-index" ||
				node.localName === "tp-listof" ||
				node.localName === "tp-ref")
		)
			return wc(node, [...node.childNodes].map(render).join(""));
		if (node instanceof Element && node.localName === "tp-index") {
			declareIndex(node);
			let supplemental = "";
			if (!node.hasAttribute("data-latex-index-native"))
				supplemental = wc(node, [...node.childNodes].map(render).join(""));
			for (const [attr, encap] of [
				["see", "see"],
				["see-also", "seealso"],
			] as const) {
				const ref = node.getAttribute(attr);
				if (!ref) continue;
				const target = indexDefinitions.find(
					(d) => group(d) === group(node) && d.getAttribute("ref") === ref,
				);
				if (!target) throw Error(`Unknown index cross-reference: ${ref}`);
				const key = indexEntry(target)
					.split("!")
					.map((p) => p.split("@")[0])
					.join("!");
				supplemental += `\\index[${group(node)}]{${indexEntry(node)}|${encap}{${key}}}`;
			}
			return supplemental;
		}
		if (
			node instanceof Element &&
			node.localName === "tp-listof" &&
			node.getAttribute("selector") === "tp-index"
		) {
			declareIndex(node);
			return `\\printindex[${group(node)}]\n`;
		}
		if (
			node instanceof Element &&
			node.localName === "tp-ref" &&
			node.getAttribute("href")?.startsWith("!")
		) {
			const target = indexDefinitions.find(
				(d) =>
					group(d) === group(node) &&
					d.getAttribute("ref") === node.getAttribute("href")?.slice(1),
			);
			if (!target) return wc(node, [...node.childNodes].map(render).join(""));
			declareIndex(node);
			const command = `\\index[${group(node)}]{${indexEntry(target)}}`;
			if (
				node.hasAttribute("silent") &&
				[...node.attributes].every((a) =>
					["href", "index", "silent"].includes(a.name),
				)
			)
				return command;
			return wc(node, [...node.childNodes].map(render).join("") + command);
		}

		if (node instanceof Element && node.hasAttribute("data-latex-index")) {
			const { name } = indexCommand(
				node.getAttribute("data-latex-index") ?? "",
			);
			return `\\printindex[${name}]\n`;
		}
		if (
			node instanceof Element &&
			node.hasAttribute("data-latex-index-entry")
		) {
			const { name, entry } = indexCommand(
				node.getAttribute("data-latex-index-entry") ?? "",
			);
			if (typeof entry !== "string" || /\\/.test(entry))
				throw new Error("Invalid index entry metadata");
			return `\\index[${name}]{${entry}}`;
		}

		if (options.document && node instanceof HTMLElement) {
			const environments: Record<string, string> = {
				"tp-align-center": "center",
				"tp-align-left": "flushleft",
				"tp-align-right": "flushright",
				"tp-quotation": "quotation",
				"tp-verse": "verse",
				"tp-minipage": "minipage",
				"tp-tabbing": "tabbing",
			};
			const className = Object.keys(environments).find((name) =>
				node.classList.contains(name),
			);
			if (
				className &&
				((node.localName === "div" &&
					className !== "tp-tabbing" &&
					className !== "tp-quotation") ||
					(node.localName === "blockquote" && className === "tp-quotation") ||
					(node instanceof HTMLTableElement && className === "tp-tabbing"))
			) {
				const clone = node.cloneNode(true) as HTMLElement;
				clone.classList.remove(className);
				if (!clone.className) clone.removeAttribute("class");
				else clone.classList.add(className);
				let args = "",
					content = [...node.childNodes].map(render).join("").trim(),
					valid = true;
				if (className === "tp-minipage") {
					const width = node.style.width,
						height = node.style.height;
					const dimension = (value: string) =>
						value.endsWith("%")
							? `${Number.parseFloat(value) / 100}\\linewidth`
							: value;
					const position = node.getAttribute("data-tp-position") || "c",
						inner = node.getAttribute("data-tp-inner-position") || position;
					valid =
						Boolean(width) &&
						["t", "c", "b"].includes(position) &&
						["t", "c", "b"].includes(inner) &&
						[...node.style].every((key) => ["width", "height"].includes(key));
					args = `[${position}]${height ? `[${dimension(height)}][${inner}]` : ""}{${dimension(width)}}`;
					clone.removeAttribute("style");
					clone.removeAttribute("data-tp-position");
					clone.removeAttribute("data-tp-inner-position");
				}
				if (className === "tp-tabbing" && node instanceof HTMLTableElement) {
					valid =
						!node.querySelector(
							"caption,td table,td br,td ul,td ol,td pre,td figure",
						) &&
						[...node.rows].every((row) =>
							[...row.cells].every(
								(cell) => cell.colSpan === 1 && cell.rowSpan === 1,
							),
						);
					content = [...node.rows]
						.map(
							(row) =>
								[...row.cells]
									.map((cell) =>
										[...cell.childNodes].map(render).join("").trim(),
									)
									.join("\\=") +
								(row.classList.contains("tp-tabbing-guide")
									? "\\kill"
									: "\\\\"),
						)
						.join("\n");
				}
				if (valid) {
					const env = environments[className];
					const native = `\\begin{${env}}${args}\n${content}\n\\end{${env}}\n`;
					const attrs = [...clone.attributes].map(
						(a) => `${a.name}={${escapeText(a.value)}}`,
					);
					return attrs.length
						? `\\tpAttributes[${attrs.join(",")}]{\n${native}}\n`
						: native;
				}
			}
		}
		if (node instanceof Element && node.hasAttribute("data-latex-citation")) {
			const keys = JSON.parse(
				node.getAttribute("data-latex-citation") || "[]",
			) as string[];
			const note = node.querySelector(":scope > [data-latex-citation-note]");
			const text = note ? [...note.childNodes].map(render).join("") : "";
			return `\\cite${text ? `[{${text}}]` : ""}{${keys.join(",")}}`;
		}
		if (
			node instanceof Element &&
			node.hasAttribute("data-latex-bibliography-section")
		) {
			const definitions = [...node.querySelectorAll(":scope > tp-biblio")];
			if (definitions.length)
				return `\\begin{thebibliography}{99}\n${definitions
					.map((definition) => {
						const label = (definition.getAttribute("label") || "").replace(
							/^\[|\]$/g,
							"",
						);
						return `\\bibitem${label ? `[{${escapeText(label)}}]` : ""}{${definition.getAttribute("ref")}}\n${[...definition.childNodes].map(render).join("").trim()}`;
					})
					.join("\n\n")}\n\\end{thebibliography}\n`;
		}
		if (node instanceof Element && node.localName === "tp-theorem") {
			const type = node.getAttribute("type") || "theorem";
			const title =
				node.getAttribute("label") ||
				type.charAt(0).toUpperCase() + type.slice(1);
			const heading = node.getAttribute("heading") || "";
			const richHeading = node.querySelector(':scope > [slot="heading"]');
			let index = theoremSerial++,
				suffix = "";
			do {
				suffix = String.fromCharCode(65 + (index % 26)) + suffix;
				index = Math.floor(index / 26) - 1;
			} while (index >= 0);
			const theoremStyle =
				node.getAttribute("theorem-style") ||
				(["definition", "example"].includes(type)
					? "definition"
					: type === "remark"
						? "remark"
						: "plain");
			const key = JSON.stringify([type, title, theoremStyle]);
			let env = theoremEnvironments.get(key);
			if (!env) {
				const base = /^[a-zA-Z]+$/.test(type) ? type : "theorem";
				env =
					type === "proof"
						? "proof"
						: usedTheoremNames.has(base)
							? `${base}${suffix}`
							: base;
				theoremEnvironments.set(key, env);
				usedTheoremNames.add(env);
				if (type !== "proof")
					theoremDeclarations.push(
						`\\theoremstyle{${theoremStyle}}\n\\newtheorem*{${env}}{${escapeText(title)}}`,
					);
			}

			const attrs = [...node.attributes]
				.filter((a) => !a.name.startsWith("data-tp-"))
				.map((a) => `${a.name}={${escapeText(a.value)}}`);
			// Freeze the displayed number when the source component has no explicit number.
			if (!node.hasAttribute("number")) attrs.push("number={}");
			if (!node.hasAttribute("qed"))
				attrs.push(`qed={${type === "proof" ? "□" : ""}}`);
			const content = [...node.childNodes]
				.filter((child) => child !== richHeading)
				.map(render)
				.join("")
				.trim();
			const optionalTitle = richHeading
				? [...richHeading.childNodes].map(render).join("")
				: escapeText(type === "proof" ? title : heading);
			const native = `\\begin{${env}}${optionalTitle ? `[{${optionalTitle}}]` : ""}\n${content}\n\\end{${env}}`;
			return `\\tpAttributes[${attrs.join(",")}]{\n${native}\n}\n`;
		}

		if (
			node instanceof HTMLElement &&
			[
				"figure",
				"figcaption",
				"p",
				"blockquote",
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
			].includes(node.localName) &&
			node.attributes.length
		) {
			const clone = node.cloneNode(true) as HTMLElement;
			for (const attr of [...clone.attributes])
				clone.removeAttribute(attr.name);
			const body = render(clone).trim();
			if (node.attributes.length === 1 && babelLanguages[node.lang])
				return `\\begin{otherlanguage}{${babelLanguages[node.lang]}}\n${body}\n\\end{otherlanguage}\n`;
			if (
				["figure", "figcaption"].includes(node.localName) ||
				[...node.attributes].some((attr) => attr.name !== "id")
			) {
				const attrs = [...node.attributes]
					.map((attr) => `${attr.name}={${escapeText(attr.value)}}`)
					.join(",");
				return `\\tpAttributes[${attrs}]{${body}}\n`;
			}
		}
		if (
			node instanceof HTMLElement &&
			node.localName === "span" &&
			node.attributes.length === 1 &&
			babelLanguages[node.lang]
		)
			return `\\foreignlanguage{${babelLanguages[node.lang]}}{${[...node.childNodes].map(render).join("")}}`;

		if (
			node instanceof HTMLElement &&
			node.id &&
			!["span", "img"].includes(node.localName)
		) {
			if (options.document && /^h[1-6]$/.test(node.localName))
				return renderContent(node);
			const clone = node.cloneNode(true) as HTMLElement;
			clone.removeAttribute("id");
			return `\\hypertarget{${escapeText(node.id)}}{}${render(clone)}`;
		}
		if (node instanceof HTMLElement && node.style.color) {
			const clone = node.cloneNode(true) as HTMLElement;
			clone.style.removeProperty("color");
			if (!clone.getAttribute("style")) clone.removeAttribute("style");
			const probe = document.createElement("span");
			probe.style.color = node.style.color;
			document.body.append(probe);
			const rgb = getComputedStyle(probe).color;
			probe.remove();
			const values = rgb.match(
				/^rgb\(\s*(\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)\s*\)$/,
			);
			if (values) {
				const hex = values
					.slice(1)
					.map((value) => Number(value).toString(16).padStart(2, "0"))
					.join("");
				return `\\textcolor[HTML]{${hex}}{${render(clone)}}`;
			}
			return wc(node, [...node.childNodes].map(render).join(""));
		}
		if (node instanceof HTMLElement) {
			for (const [property, pattern, command] of [
				["font-weight", /^(?:bold|[6-9]00)$/, "textbf"],
				["font-style", /^italic$/, "textit"],
				["vertical-align", /^sub$/, "textsubscript"],
				["vertical-align", /^super$/, "textsuperscript"],
				["text-decoration", /line-through/, "sout"],
				["text-decoration", /underline/, "underline"],
			] as const) {
				if (pattern.test(node.style.getPropertyValue(property))) {
					const clone = node.cloneNode(true) as HTMLElement;
					clone.style.removeProperty(property);
					if (!clone.getAttribute("style")) clone.removeAttribute("style");
					return `\\${command}{${render(clone)}}`;
				}
			}
			if (node.localName === "span")
				for (const [cls, command] of [
					["bf", "textbf"],
					["it", "textit"],
					["tt", "texttt"],
				] as const) {
					if (node.classList.contains(cls)) {
						const clone = node.cloneNode(true) as HTMLElement;
						clone.classList.remove(cls);
						return `\\${command}{${render(clone)}}`;
					}
				}
		}
		return renderContent(node);
	};
	const renderContent = (node: Node): string => {
		if (node.nodeType === Node.COMMENT_NODE)
			return (node.textContent ?? "")
				.split("\n")
				.map((line) => `% ${line}\n`)
				.join("");
		if (node.nodeType === 3) {
			const value = node.textContent ?? "";
			// TeX ignores indentation after a percent comment. Preserve authored prose
			// spacing with a native explicit space, without changing TeX import rules.
			if (
				node.previousSibling?.nodeType === Node.COMMENT_NODE &&
				/^[ \t\r\n]+/.test(value) &&
				(value.trim() ||
					node.parentElement?.matches(
						"p,span,a,strong,b,em,i,sub,sup,mark,ins,del,label,kbd,cite",
					))
			)
				return `\\ ${escapeText(value.replace(/^[ \t\r\n]+/, ""))}`;
			return options.document && /^\s*\n\s*$/.test(value)
				? node.parentElement?.matches(
						"p,span,a,strong,b,em,i,sub,sup,mark,ins,del,label,kbd,cite",
					)
					? " "
					: ""
				: escapeText(value);
		}
		if (!(node instanceof Element)) return "";
		const body = () => Array.from(node.childNodes).map(render).join("");
		const tag = node.localName;
		if (
			tag === "header" &&
			node.className === "document-title" &&
			node.attributes.length === 1
		) {
			const children = [...node.children];
			const title = children[0];
			const author = children[1];
			const date = children[2];
			if (
				children.length === 3 &&
				title?.localName === "h1" &&
				[...title.attributes].every((attribute) => attribute.name === "id") &&
				author?.matches("p.author") &&
				author.attributes.length === 1 &&
				date?.matches("p.date") &&
				date.attributes.length === 1 &&
				[...node.childNodes].every(
					(child) => child.nodeType !== 3 || !child.textContent?.trim(),
				)
			) {
				const content = (element: Element) =>
					[...element.childNodes].map(render).join("").trim();
				const titleContent = title.id
					? `\\hypertarget{${escapeText(title.id)}}{${content(title)}}`
					: content(title);
				return `\\title{${titleContent}}\n\\author{${content(author)}}\n\\date{${content(date)}}\n\\maketitle\n\n`;
			}
		}

		if (
			options.document &&
			tag === "figure" &&
			[...node.attributes].every(
				(attr) => attr.name === "class" && attr.value === "imageblock",
			)
		)
			return `\\begin{figure}\n${[...node.childNodes]
				.map(render)
				.map((value) => value.trim())
				.filter(Boolean)
				.join("\n\n")}\n\\end{figure}\n`;
		if (options.document && tag === "figcaption" && !node.attributes.length)
			return `\\caption{${body()}}\n`;
		if (options.document && /^h[1-6]$/.test(tag)) {
			if (
				[...node.attributes].some(
					(attr) => !["id", "tabindex"].includes(attr.name),
				)
			)
				return wc(node, body());
			const command = [
				"chapter",
				"section",
				"subsection",
				"subsubsection",
				"paragraph",
				"subparagraph",
			][Number(tag[1]) - 1];
			return `\\${command}*{${node.id ? `\\hypertarget{${escapeText(node.id)}}{${body()}}` : body()}}\n`;
		}
		if (options.document && tag === "blockquote")
			return `\\begin{quote}\n${[...node.childNodes]
				.map(render)
				.map((value) => value.trim())
				.filter(Boolean)
				.join("\n\n")}\n\\end{quote}\n`;
		if (options.document && tag === "hr") return "\\hrule\n";
		if (
			options.document &&
			tag === "table" &&
			node instanceof HTMLTableElement
		) {
			const rows = [...node.rows];
			if (
				rows
					.slice(1)
					.some((row) => [...row.cells].some((cell) => cell.localName === "th"))
			)
				return wc(node, body());
			// Booktabs' horizontal-only rules remain native, including partial rules.
			if (
				rows.length &&
				!node.querySelector(
					'br,[rowspan]:not([rowspan="1"]),[colspan]:not([colspan="1"])',
				) &&
				!node.querySelector("col[data-tp-column-width]") &&
				[...node.querySelectorAll("td,th")].every(
					(cell) =>
						cell instanceof HTMLElement &&
						cell.style.borderLeftStyle === "none" &&
						cell.style.borderRightStyle === "none",
				) &&
				[...node.querySelectorAll("td")].some(
					(cell) =>
						(cell as HTMLElement).style.borderBottomStyle === "solid" &&
						(cell as HTMLElement).style.borderBottomWidth,
				)
			) {
				const columns = [...(rows[0]?.cells ?? [])]
					.map((cell) =>
						cell.style.textAlign === "right"
							? "r"
							: cell.style.textAlign === "center"
								? "c"
								: "l",
					)
					.join("");
				const lines: string[] = [];
				rows.forEach((row, index) => {
					const cells = [...row.cells];
					const top = cells[0]?.style.borderTopWidth;
					if (top && cells[0]?.style.borderTopStyle === "solid")
						lines.push(`\\toprule[${top}]`);
					lines.push(
						`${cells
							.map((cell) => [...cell.childNodes].map(render).join(""))
							.join(" & ")} \\\\`,
					);
					for (let c = 0; c < cells.length; c++) {
						const width = cells[c]?.style.borderBottomWidth;
						if (!width || cells[c]?.style.borderBottomStyle !== "solid")
							continue;
						const start = c;
						while (
							c + 1 < cells.length &&
							cells[c + 1]?.style.borderBottomWidth === width &&
							cells[c + 1]?.style.borderBottomStyle === "solid"
						)
							c++;
						lines.push(
							start === 0 && c === cells.length - 1
								? `\\${index === rows.length - 1 ? "bottomrule" : "midrule"}[${width}]`
								: `\\cmidrule[${width}]{${start + 1}-${c + 1}}`,
						);
					}
					const gap = cells[0]?.style.paddingBottom;
					if (gap) lines.push(`\\addlinespace[${gap}]`);
				});
				return `\\begin{tabular}{${columns}}\n${lines.join("\n")}\n\\end{tabular}`;
			}
			const cells: string[][] = [];
			const horizontal: NonNullable<TableData["cellHorizontalAlignments"]> = [];
			const vertical: NonNullable<TableData["cellVerticalAlignments"]> = [];
			const merges: NonNullable<TableData["merges"]> = [];
			const occupied = new Set<string>();
			const edges = new Map<string, string>();
			const borderColors = new Map<string, string>();
			let explicitBorders = false;
			rows.forEach((row, r) => {
				const values: string[] = [];
				let c = 0;
				for (const cell of row.cells) {
					while (occupied.has(`${r},${c}`)) values[c++] = "";
					values[c] = cell.innerHTML;
					for (const side of ["top", "bottom", "left", "right"]) {
						const declaration = new RegExp(
							`(?:^|;)\\s*border-${side}\\s*:\\s*([^;]+)`,
						)
							.exec(cell.getAttribute("style") || "")?.[1]
							?.trim();
						const literal =
							/^(\S+)\s+(solid|dashed|dotted|double)\s+(.+)$/.exec(
								declaration || "",
							);
						const style =
							literal?.[2] ||
							(declaration === "none"
								? "none"
								: cell.style.getPropertyValue(`border-${side}-style`));
						if (!style) continue;
						explicitBorders = true;
						if (style === "none") continue;
						const horizontal = side === "top" || side === "bottom";
						const boundary = horizontal
							? side === "top"
								? r
								: r + cell.rowSpan
							: side === "left"
								? c
								: c + cell.colSpan;
						const width =
							literal?.[1] ||
							cell.style.getPropertyValue(`border-${side}-width`) ||
							"1px";
						const color =
							literal?.[3] ||
							cell.style.getPropertyValue(`border-${side}-color`);
						let foreground = "";
						if (color && !color.startsWith("var(")) {
							const probe = document.createElement("span");
							probe.style.color = color;
							document.body.append(probe);
							const rgb = getComputedStyle(probe).color.match(
								/^rgb\(\s*(\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)\s*\)$/,
							);
							probe.remove();
							if (rgb) {
								const hex = rgb
									.slice(1)
									.map((value) => Number(value).toString(16).padStart(2, "0"))
									.join("");
								foreground = `tpBorder${hex}`;
								borderColors.set(foreground, hex);
							}
						}
						const points =
							Number.parseFloat(width) * (width.endsWith("px") ? 0.75 : 1);
						for (
							let offset = 0;
							offset < (horizontal ? cell.colSpan : cell.rowSpan);
							offset++
						) {
							const segment = (horizontal ? c : r) + offset + 1;
							edges.set(
								`${horizontal ? "h" : "v"}line{${boundary + 1}}=${style === "double" ? "{2}" : ""}{${segment}}`,
								`wd=${style === "double" ? points / 3 : points}pt,dash=${style === "double" ? "solid" : style}${foreground ? `,fg=${foreground}` : ""}`,
							);
						}
					}
					horizontal[r] ??= [];
					horizontal[r][c] =
						cell.style.textAlign === "right"
							? "right"
							: cell.style.textAlign === "center"
								? "center"
								: "left";
					vertical[r] ??= [];
					vertical[r][c] =
						cell.style.verticalAlign === "middle"
							? "middle"
							: cell.style.verticalAlign === "bottom"
								? "bottom"
								: "top";
					if (cell.rowSpan > 1 || cell.colSpan > 1)
						merges.push({
							row: r,
							column: c,
							rowspan: cell.rowSpan,
							colspan: cell.colSpan,
						});
					for (let y = r; y < r + cell.rowSpan; y++)
						for (let x = c; x < c + cell.colSpan; x++)
							if (y !== r || x !== c) occupied.add(`${y},${x}`);
					c++;
				}
				cells.push(values);
			});
			const columns = Math.max(
				1,
				...cells.map((row) => row.length),
				...merges.map((m) => m.column + m.colspan),
			);
			for (const row of cells) while (row.length < columns) row.push("");
			let serialized = serializeTable(
				{
					cells,
					header: !!rows[0]?.querySelector("th"),
					caption: node.caption?.textContent ?? "",
					alignments: Array(columns).fill("left"),
					cellTypes: cells.map((row) => row.map(() => "rich")),
					cellHorizontalAlignments: horizontal,
					cellVerticalAlignments: vertical,
					merges,
				},
				"latex",
			).replace(/^\\usepackage(?:\[[^\]]*\])?\{[^}]*\}\n/gm, "");
			if (explicitBorders)
				serialized = serialized.replace(
					/ {2}hlines,\n {2}vlines/,
					[...edges].map(([key, value]) => `  ${key}{${value}}`).join(",\n"),
				);
			else serialized = serialized.replace(/ {2}hlines,\n {2}vlines,?\n?/, "");
			if (borderColors.size)
				serialized =
					[...borderColors]
						.map(([name, hex]) => `\\definecolor{${name}}{HTML}{${hex}}`)
						.join("\n") +
					"\n" +
					serialized;
			const colspec = [...node.querySelectorAll(":scope > colgroup > col")].map(
				(col) => {
					const width =
						col.getAttribute("data-tp-column-width") ||
						(col as HTMLElement).style.width ||
						col.getAttribute("width") ||
						"auto";
					if (/^(?:\d+(?:\.\d+)?)?\*$/.test(width))
						return `X[${width.slice(0, -1) || "1"},l]`;
					if (width.endsWith("%"))
						return `Q[l,wd=${Number.parseFloat(width) / 100}\\linewidth]`;
					return width !== "auto" &&
						/^\d+(?:\.\d+)?(?:px|pt|em|rem|cm|mm|in|ex)$/.test(width)
						? `Q[l,wd=${width}]`
						: "Q[l]";
				},
			);
			return colspec.length === columns
				? serialized.replace(
						/colspec=\{[^}]*\}/,
						`${node.style.width ? `width=${node.style.width === "100%" ? "\\linewidth" : node.style.width},` : ""}${node.style.tableLayout ? `layout=${node.style.tableLayout},` : ""}colspec={${colspec.join(" ")}}`,
					)
				: serialized;
		}

		if (tag === "source" || tag === "track") return wc(node, "");

		if (tag === "video" || tag === "audio") {
			const src =
				node.getAttribute("src") ||
				node.querySelector("source")?.getAttribute("src");
			const fallback = [...node.childNodes].filter(
				(child) =>
					!(
						child instanceof Element &&
						["source", "track"].includes(child.localName)
					),
			);
			const options = [`showcontrols=${node.hasAttribute("controls")}`];
			for (const name of [
				"preload",
				"aria-label",
				"poster",
				"id",
				"tp-attributes",
				"children-order",
				"fallback-unwrap",
			])
				if (node.hasAttribute(name))
					options.push(
						`${name === "aria-label" ? "title" : name}={${escapeText(node.getAttribute(name) || "")}}`,
					);
			if (!node.hasAttribute("preload")) options.push("preload=unset");
			for (const [key, tag] of [
				["sources", "source"],
				["tracks", "track"],
			]) {
				const entries = [...node.querySelectorAll(`:scope > ${tag}`)].map(
					(child) =>
						Object.fromEntries(
							[...child.attributes].map((a) => [
								a.name,
								a.name === "default" ? true : a.value,
							]),
						),
				);
				if (entries.length)
					options.push(`${key}={${escapeText(JSON.stringify(entries))}}`);
			}
			for (const [attr, option] of [
				["autoplay", "autostart"],
				["loop", "loop"],
				["muted", "muted"],
			])
				if (attr && option && node.hasAttribute(attr)) options.push(option);
			for (const dimension of ["width", "height"]) {
				const value =
					(node as HTMLElement).style.getPropertyValue(dimension) ||
					node.getAttribute(dimension);
				if (value && /^\d*\.?\d+(px|pt|cm|mm|in|em|ex|rem)?$/.test(value))
					options.push(
						`${dimension}=${/^\d*\.?\d+$/.test(value) ? `${value}px` : value}`,
					);
			}
			const title = fallback.map(render).join("").trim();
			if (title) options.push("fallback=true");
			return `\\${tag === "video" ? "movie" : "sound"}[${options.join(",")}]{${title}}{${escapeText(node.getAttribute("src") || (node.querySelector("source") ? "" : src) || "")}}`;
		}
		if (tag === "img") {
			if (!nativeImageOptions(node as HTMLImageElement)) return wc(node, "");
			const dimensions = ["width", "height"].flatMap((dimension) => {
				const value =
					(node as HTMLElement).style.getPropertyValue(dimension) ||
					node.getAttribute(dimension);
				return value && /^\d*\.?\d+(px|pt|cm|mm|in|em|ex|rem)?$/.test(value)
					? [`${dimension}=${/^\d*\.?\d+$/.test(value) ? `${value}px` : value}`]
					: [];
			});
			const style = (node as HTMLElement).style;
			if (node.hasAttribute("alt"))
				dimensions.push(`alt={${escapeText(node.getAttribute("alt") ?? "")}}`);
			if (style.objectFit === "contain") dimensions.push("keepaspectratio");
			const transform =
				/^(?:scale\(([\d.]+)\)\s*)?(?:rotate\((-?[\d.]+)deg\))?$/.exec(
					style.transform,
				);
			if (style.transform && !transform)
				dimensions.push(`transform={${escapeText(style.transform)}}`);
			if (transform?.[1]) dimensions.push(`scale=${transform[1]}`);
			if (transform?.[2]) dimensions.push(`angle=${-Number(transform[2])}`);
			const trim = /^inset\(([^)]+)\)$/.exec(style.clipPath)?.[1]?.split(/\s+/);
			if (style.clipPath && trim?.length !== 4) return wc(node, "");
			if (trim)
				dimensions.push(
					`trim=${trim[3]} ${trim[2]} ${trim[1]} ${trim[0]}`,
					"clip",
				);
			if (style.transformOrigin)
				dimensions.push(`origin={${style.transformOrigin}}`);
			const extra = Object.fromEntries(
				[...node.attributes]
					.filter(
						(a) => !["src", "alt", "width", "height", "style"].includes(a.name),
					)
					.map((a) => [a.name, a.value]),
			);
			if (Object.keys(extra).length)
				dimensions.push(
					`attributes={${escapeText(encodeURIComponent(JSON.stringify(extra)))}}`,
				);
			return `\\includegraphics${dimensions.length ? `[${dimensions.join(",")}]` : ""}{${escapeText(node.getAttribute("src") ?? "")}}`;
		}

		const commands: Record<string, string> = {
			strong: "textbf",
			b: "textbf",
			em: "textit",
			i: "textit",
			u: "underline",
			s: "sout",
			del: "sout",
			strike: "sout",
			sub: "textsubscript",
			sup: "textsuperscript",
			code: "texttt",
		};
		if (tag === "span" && node.hasAttribute("data-tp-quotation")) {
			const clone = node.cloneNode(true) as Element;
			const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
			const texts: Text[] = [];
			while (walker.nextNode()) texts.push(walker.currentNode as Text);
			const first = texts[0],
				last = texts.at(-1);
			if (first && last) {
				const language = node.getAttribute("lang") || "en";
				if (!babelLanguages[language])
					return wc(node, [...node.childNodes].map(render).join(""));
				const pair = quotationMarks(
					language,
					node.getAttribute("data-tp-quotation") === "inner",
				);
				// HTML conversions may normalize non-breaking quotation spaces.
				if (
					first.data.slice(0, pair[0].length).replace(/\s/g, " ") ===
					pair[0].replace(/\s/g, " ")
				)
					first.data = first.data.slice(pair[0].length);
				if (
					last.data.slice(-pair[1].length).replace(/\s/g, " ") ===
					pair[1].replace(/\s/g, " ")
				)
					last.data = last.data.slice(0, -pair[1].length);
				const lang = babelLanguages[language];
				return `\\foreignquote${node.getAttribute("data-tp-quotation") === "inner" ? "*" : ""}{${lang}}{${[...clone.childNodes].map(render).join("")}}`;
			}
		}
		if (tag === "tp-math") {
			const value =
				node.getAttribute("value") ||
				node.querySelector("script")?.textContent ||
				node.textContent ||
				"";
			if (
				node.getAttribute("mode") !== "asciimath" &&
				/^\\begin\{(?:eqnarray|equation|align|alignat|flalign|gather|multline)\*?\}/.test(
					value.trim(),
				)
			)
				return value.trim();
			if (node.getAttribute("mode") !== "asciimath")
				return node.hasAttribute("displaystyle")
					? `\\[${value}\\]`
					: `\\(${value}\\)`;
			return wc(node, "");
		}
		if (
			tag === "tp-code-editor" &&
			node.hasAttribute("readonly") &&
			!node.hasAttribute("src")
		) {
			const script = node.querySelector("script");
			const value =
				node.getAttribute("value") ??
				script?.textContent?.replace(/^\n|\n$/g, "") ??
				"";
			if (!value.includes("\\end{lstlisting}")) {
				const language =
					node.getAttribute("language") ??
					script?.getAttribute("type")?.replace(/^tp\//, "") ??
					"plaintext";
				const settings = [
					`language=${language}`,
					`literal-tail=${encodeURIComponent(/[ \t\r\n]*$/.exec(value)?.[0] || "") || "-"}`,
				];
				const theme = ["light", "dark"].find((value) =>
					node.classList.contains(`tp-${value}`),
				);
				if (theme) settings.push(`theme=${theme}`);
				if (node.hasAttribute("line-numbers"))
					settings.push(
						"numbers=left",
						`firstnumber=${node.getAttribute("line-number-start") || "1"}`,
					);
				if (node.hasAttribute("line-wrapping"))
					settings.push("breaklines=true");
				return `\\begin{lstlisting}[${settings.join(",")}]\n${value}\n\\end{lstlisting}`;
			}
		}
		if (tag === "pre") {
			const value = node.textContent ?? "";
			const code = node.querySelector("code");
			if (
				!node.attributes.length &&
				code &&
				!code.attributes.length &&
				value.endsWith("\n") &&
				!value.includes("\\end{verbatim}")
			)
				return `\\begin{verbatim}\n${value}\\end{verbatim}\n`;

			const language =
				[...(code?.classList ?? node.classList)]
					.find((name) => name.startsWith("language-"))
					?.slice(9) ??
				[...node.classList].find(
					(name) => !["code", "literal-block", "tp-dark"].includes(name),
				) ??
				"";
			if (!value.includes("\\end{lstlisting}")) {
				const listing = `\\begin{lstlisting}${`[${language ? `language=${language},` : ""}literal-tail=${encodeURIComponent(/[ \t\r\n]*$/.exec(value)?.[0] || "") || "-"}]`}\n${value.replace(/\n$/, "")}\n\\end{lstlisting}`;
				const theme = ["tp-dark", "tp-light"].find((name) =>
					node.classList.contains(name),
				);
				return theme
					? listing.replace(
							/\\begin\{lstlisting\}(?:\[([^\]]*)\])?/,
							(_all, settings: string) =>
								`\\begin{lstlisting}[${settings ? `${settings},` : ""}theme=${theme.slice(3)}]`,
						)
					: listing;
			}
		}
		if (commands[tag]) {
			const native = `\\${commands[tag]}{${body().replace(/^(\[[\s\S]*)$/, "{$1}")}}`;
			const attrs = [...node.attributes]
				.filter((a) => a.name !== "id")
				.map((a) => `${a.name}={${escapeText(a.value)}}`)
				.join(",");
			return attrs ? `\\tpAttributes*[${attrs}]{${native}}` : native;
		}
		if (tag === "br") return "\\\\ ";
		if (
			tag === "p" &&
			indexDefinitions.length &&
			node.closest("tp-index,[data-tp-reference-scope]")
		)
			return wc(node, body());
		if (tag === "p" || tag === "div") {
			if (node.attributes.length) return wc(node, body());
			return options.document ? `${body()}\n\n` : `${body()}\\\\ `;
		}
		if (tag === "a")
			return `\\href{${(node.getAttribute("href") ?? "").replace(/[{}\\\s]/g, (char) => encodeURIComponent(char))}}{${body().replace(/^(\[[\s\S]*)$/, "{$1}")}}`;
		if (
			(node.hasAttribute("data-tp-list-marker") ||
				node.hasAttribute("data-tp-list-override")) &&
			node.closest("li")
		)
			return "";
		if (tag === "ul" || tag === "ol") {
			const env = tag === "ul" ? "itemize" : "enumerate";
			const settings: string[] = [];
			if (node.hasAttribute("data-tp-list-label")) {
				const label = escapeText(
					node.getAttribute("data-tp-list-label") || "",
				).replace(/@([1aAiI@])/g, (_all, type: string) =>
					type === "@"
						? "@"
						: `\\${({ 1: "arabic", a: "alph", A: "Alph", i: "roman", I: "Roman" } as Record<string, string>)[type]}*`,
				);
				settings.push(`label={${label}}`);
				for (const key of ["start", "itemsep", "topsep", "leftmargin"]) {
					let value = node.getAttribute(`data-tp-list-${key}`);
					if (value) {
						if (key !== "start" && value === "0") value = "0pt";
						settings.push(`${key}=${value}`);
					}
				}
				if (node.getAttribute("data-tp-list-resume") === "true")
					settings.push("resume");
				return `\\begin{${env}}[${settings.join(",")}]${body().trim()}\\end{${env}}`;
			}

			if (tag === "ol") {
				const type =
					node.getAttribute("type") ??
					(
						{
							upperalpha: "A",
							loweralpha: "a",
							upperroman: "I",
							lowerroman: "i",
						} as Record<string, string>
					)[
						[...node.classList].find((name) =>
							/^(upper|lower)(alpha|roman)$/.test(name),
						) ?? ""
					];
				const command = (
					{ A: "Alph", a: "alph", I: "Roman", i: "roman" } as Record<
						string,
						string
					>
				)[type ?? ""];
				if (command) settings.push(`label=\\${command}*.`);
				if (node.hasAttribute("start"))
					settings.push(`start=${Number(node.getAttribute("start")) || 1}`);
			}
			if ((node as HTMLElement).style.listStyleType === "none")
				settings.push("label={}");
			return `\\begin{${env}}${settings.length ? `[${settings.join(",")}]` : ""}${body().trim()}\\end{${env}}`;
		}
		if (tag === "dl" && !node.attributes.length) {
			return `\\begin{description}\n${[...node.children].map((child) => (child.localName === "dt" ? `\\item[{${[...child.childNodes].map(render).join("")}}] ` : `${[...child.childNodes].map(render).join("")}\n`)).join("")}\\end{description}\n`;
		}
		if (tag === "li") {
			const override = [
				...node.querySelectorAll("[data-tp-list-override]"),
			].find((marker) => marker.closest("li") === node);
			return `\\item${override ? `[{${[...override.childNodes].map(render).join("")}}]` : ""} ${body()} `;
		}
		if (tag === "span" && node.attributes.length) {
			const attrs = [...node.attributes]
				.map((attr) => `${attr.name}={${escapeText(attr.value)}}`)
				.join(",");
			return `\\tpAttributes*[${attrs}]{${body()}}`;
		}

		if (tag === "span" && !node.attributes.length) return body();
		if (tag === "script") {
			const text = node.textContent ?? "";
			const delimiter = ["|", "!", "+", "/", ";", "~"].find(
				(char) => !text.includes(char),
			);
			if (!delimiter) throw new Error("Cannot delimit embedded source");
			return `\\wcScript[type={${escapeText(node.getAttribute("type") ?? "text/plain")}}]${delimiter}${text}${delimiter}`;
		}
		return wc(node, body());
	};
	const rendered = Array.from(template.content.childNodes)
		.map(render)
		.join("")
		.replace(/(?:\\\\\s*)+$/, "");
	return [
		...(indexDeclarations.size
			? ["\\usepackage{imakeidx}", ...indexDeclarations.values()]
			: []),
		...theoremDeclarations,
		rendered,
	].join("\n");
}
