/** @module utilities/native-markup */

/**
 * Converts HTML example fragments to native Markdown, AsciiDoc or reStructuredText with
 * component directives and inline roles.
 *
 * Shared by the live component viewer and documentation generation. Use html to
 * preserve HTML; an optional svgSource callback supplies an SVG asset URL.
 *
 * @example
 * import { nativeMarkup } from "./scripts/native-markup.mjs";
 * const markdown = nativeMarkup("md", "<tp-button>Continue</tp-button>");
 */

import { imageOptionNames, imageOptionStyles, mediaOptionNames, nativeMediaHtml } from "@tp/tp-utilities";
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
	{ svgSource = (source) => `data:image/svg+xml,${encodeURIComponent(source)}`, inlineOnly = false } = {},
) {
	if (language === "html") return html;
	const roles = [];
 let emptyReference = 0;
 const nodes = parseFragment(html).childNodes;
 const sourceCharacters = html + nodes.map(serializeOuter).join("");
 // Mark only generated roles, so literal code and authored escapes are untouched.
 let markerCode = 0xe000;
 while (sourceCharacters.includes(String.fromCodePoint(markerCode)) || sourceCharacters.includes(String.fromCodePoint(markerCode + 1))) markerCode += 2;
 const roleStart = String.fromCodePoint(markerCode), roleEnd = String.fromCodePoint(markerCode + 1);
 const rstRole = (value) => `${roleStart}${value}${roleEnd}`;
 // Docutils inline recognition rules 6/7: ASCII delimiters and equivalent
 // Unicode punctuation. A zero-width escaped space is needed within words.
 const roleBoundary = (char, start) => !char || /\s/u.test(char) ||
  (char.codePointAt(0) < 128
   ? (start ? `-:/\'"<([{` : `-.,:;!?\\/\'"})]>`).includes(char)
   : (start ? /[\p{Ps}\p{Pi}\p{Pf}\p{Pd}\p{Po}]/u : /[\p{Pe}\p{Pi}\p{Pf}\p{Pd}\p{Po}]/u).test(char));
 const resolveRoles = (source) => {
  const chars = [...source];
  let result = "", previous = "";
  for (let index = 0; index < chars.length; index++) {
   const char = chars[index];
   if (char === roleStart) {
    if (!roleBoundary(previous, true)) { result += "\\ "; previous = " "; }
   } else if (char === roleEnd) {
    if (!roleBoundary(chars[index + 1], false)) { result += "\\ "; previous = " "; }
   } else { result += char; previous = char; }
  }
  return result;
 };
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
            // A language-bearing paragraph needs a block wrapper; nesting p in p is invalid HTML.
            if(name === "p" && attributes(node).every(a => a.name === "lang")) return `[div${adocOptions(node)}]\n${fence("=",body,4)}\n${body}\n${fence("=",body,4)}`;
			const marker = fence("=", body, 4);
			return `[${name}${adocOptions(node)}]\n${marker}\n${body ? `${body}\n` : ""}${marker}`;
		}
		const attrs = attributes(node).map(rstOption).join("\n");
		return `.. ${["table", "figure", "header", "footer"].includes(name) ? `html-${name}` : name}::${attrs ? `\n${attrs}` : ""}${body ? `\n\n${indent(body, 3)}` : ""}`;
	};
	const inlineComponent = (node) => {
 if(node.tagName === "tp-equanum" && !kids(node).length)return `\n\n${directive(node, "")}\n\n`;
        // Textual HTML spans are prose, never inline-code payloads. Keep the
        // surrounding spaces outside inline roles, whose delimiters trim them.
        if (["span", "strong", "b", "em", "i"].includes(node.tagName)) {
            const value = kids(node).map(inline).join("");
            const leading = /^[ \t\r\n]/.test(value) ? " " : "";
            const trailing = /[ \t\r\n]$/.test(value) ? " " : "";
            const body = value.trim();
            if (!body) {
                if (node.tagName === "span" && attributes(node).some(a => a.name !== "id")) {
                    if (language === "md") return `[]{${options(node)}}`;
                    if (language === "adoc") return `[${attributes(node).map(({name,value})=>`${name === "class" ? "role" : name}=${quoteOption(value)}`).join(",")},tp-empty=true]##empty##`;
                    const name = `example-span-${roles.length + 1}`;
                    roles.push(`.. role:: ${name}\n${attributes(node).map(rstOption).concat(["   :tp-empty: true", "   :class:"]).join("\n")}`);
                    return rstRole(`:${name}:\`empty\``);
                }
                if (attr(node,"id")) {
                    if(language === "adoc") return `[[${attr(node,"id")}]]`;
                    if(language === "md") return `[]{#${attr(node,"id")}}`;
                    return `\n\n.. _${attr(node,"id")}:\n\n`;
                }
                return value ? " " : "";
            }
            if (language === "md") {
                const marker = ["strong", "b"].includes(node.tagName) ? "**" : ["em", "i"].includes(node.tagName) ? "*" : "";
                return `${leading}[${marker}${body}${marker}]{${options(node)}}${trailing}`;
            }
            if (language === "adoc" && node.tagName === "span" && attributes(node).length === 1 && attr(node,"id")) return `${leading}[[${attr(node,"id")}]]${body}${trailing}`;
            if (language === "adoc" && node.tagName === "span" && attributes(node).some(a => a.name !== "class")) return `${leading}[${attributes(node).map(({name,value})=>`${name === "class" ? "role" : name}=${quoteOption(value)}`).join(",")}]${"#".repeat(Math.max(1,...[...body.matchAll(/#+/g)].map(m=>m[0].length))+1)}${body}${"#".repeat(Math.max(1,...[...body.matchAll(/#+/g)].map(m=>m[0].length))+1)}${trailing}`;
            if (language === "adoc" && node.tagName === "span" && attributes(node).length === 1 && attr(node, "class") && /^[a-zA-Z_][\w-]*(?: +[a-zA-Z_][\w-]*)*$/.test(attr(node, "class"))) return `${leading}[${attr(node, "class").split(/ +/).map(name => `.${name}`).join("")}]${"#".repeat(Math.max(0,...[...body.matchAll(/#+/g)].map(m=>m[0].length))+1)}${body}${"#".repeat(Math.max(0,...[...body.matchAll(/#+/g)].map(m=>m[0].length))+1)}${trailing}`;
            if (language === "adoc") return `${leading}[${node.tagName}${adocOptions(node)}]${"#".repeat(Math.max(0,...[...body.matchAll(/#+/g)].map(m=>m[0].length))+1)}${body}${"#".repeat(Math.max(0,...[...body.matchAll(/#+/g)].map(m=>m[0].length))+1)}${trailing}`;
            const name = `example-${node.tagName}-${roles.length + 1}`;
            roles.push(`.. role:: ${name}${node.tagName === "span" ? "" : `(${node.tagName === "strong" ? "html-strong" : node.tagName})`}\n${attributes(node).map(rstOption).concat(node.tagName === "span" && !attr(node,"class") ? ["   :class:"] : []).join("\n")}`.trimEnd());
            return `${leading}${rstRole(`:${name}:\`${body.replaceAll("\\", "\\\\").replaceAll("`", "\\`")}\``)}${trailing}`;
        }
        if (node.tagName === "tp-ref" && !kids(node).length && language !== "md") node={...node,attrs:[...attributes(node),{name:"tp-empty",value:"true"}]};
		const isField = /^tp-(text|math|number|date|time)field$/.test(node.tagName);
		const body = text(node).trim() || (node.tagName === "tp-ref" ? `${({"^":"note","@":"bibliography","%":"glossary"})[(attr(node,"href") ?? "")[0]] ?? "reference"}-${(attr(node,"href") ?? "").slice(1)}-${++emptyReference}` : attr(node, "name")) || "…";
		if (isField && attr(node, "name") && (!text(node).trim() || text(node).trim() === attr(node, "name"))) node = { ...node, attrs: node.attrs.filter(attribute => attribute.name !== "name") };
		if (language === "md" && node.tagName === "tp-ref")
 return `:tp-ref:${text(node).trim()}{${options(node)}}`;
		if (language === "md" && node.tagName === "tp-equanum" && !kids(node).length)
 return `:tp-equanum:{${options(node)}}`;
		if (language === "md" && node.tagName === "tp-icon")
			return `:tp-icon:{${options(node)}}`;
  if (language === "md" && !node.tagName.startsWith("tp-"))
   return `:${node.tagName}:${kids(node).map(inline).join("")}{${options(node)}}`;
		if (language === "md")
			return `:${node.tagName}:\`${body}\`${`{${options(node)}}`}`;
		if (language === "adoc")
			return `[${node.tagName}${adocOptions(node).replace(/^[^,]*/, (prefix) => prefix.replaceAll("%", ","))}]${node.tagName === "tp-ref" ? "##" : "#"}${body}${node.tagName === "tp-ref" ? "##" : "#"}`;
		const name = `example-${node.tagName}-${roles.length + 1}`;
		roles.push(
			`.. role:: ${name}(${["strong", "code", "sub", "sup"].includes(node.tagName) ? `html-${node.tagName}` : node.tagName})\n${attributes(node)
				.map(rstOption)
				.join("\n")}`.trimEnd(),
		);
		return rstRole(`:${name}:\`${body.replaceAll("\\", "\\\\").replaceAll("`", "\\`")}\``);
	};
	const mathSource = node => attr(node, "value") ?? text(node);
	const inlineMath = node => {
		if (attributes(node).some(item => !["value", "mode"].includes(item.name))) return inlineComponent(node);
		const value = mathSource(node).trim().replace(/\s*\n\s*/g, " ");
		const mode = attr(node, "mode") === "asciimath" ? "asciimath" : "latexmath";
		if (language === "adoc") return `${mode}:[${value.replaceAll("]", "\\]")}]`;
		if (language === "rst") return rstRole(`:${mode === "latexmath" ? "math" : "asciimath"}:\`${value}\``);
		return `:${mode}:\`${value}\``;
	};
	const styledImage = node => attributes(node).some(item => {
        if (["src", "alt", "width", "height", "title", ...imageOptionNames].includes(item.name)) return false;
        if (item.name !== "style") return true;
        // Width/height already represented by native image attributes need no fallback.
        return item.value.split(";").filter(part=>part.trim()).some(part=>{
            const match=/^\s*(width|height)\s*:\s*(\d+(?:\.\d+)?)(?:px)?\s*$/.exec(part);
            return !match || String(attr(node,match[1])).replace(/px$/,"") !== match[2];
        });
    });
 const nativeMedia=node=>{
 const opts={};
 for(const {name,value} of attributes(node)) {
 if(name === "style") {
 const declarations=value.split(";").filter(part=>part.trim());
 for(const declaration of declarations) {
 const match=/^\s*(width|height)\s*:\s*(\d+(?:\.\d+)?)(?:px)?\s*$/.exec(declaration);
 if(!match) return;
 opts[match[1]]=match[2];
 }
 } else if(mediaOptionNames.includes(name)) opts[name]=["controls","autoplay","loop","muted"].includes(name)?"true":value;
 else return;
 }
 for(const key of ["controls","autoplay","loop","muted"]) if(!Object.hasOwn(opts,key)) opts[key]="false";
 const fallback=kids(node).filter(child=>!["source","track"].includes(child.tagName));
 const hasFallback=fallback.some(child=>child.nodeName!=="#text" || child.value.trim());
 const inlineFallback=!fallback.some(child=>child.tagName && /^(p|ul|ol|div|blockquote|pre|table|h[1-6])$/.test(child.tagName));
 for(const [key,tag] of [["sources","source"],["tracks","track"]]) {
 const values=kids(node).filter(child=>child.tagName===tag).map(child=>Object.fromEntries(attributes(child).map(a=>[a.name,a.name==="default"?true:a.value])));
 if(values.length) opts[key]=JSON.stringify(values);
 }
 try {nativeMediaHtml(node.tagName,opts);} catch {return;}
 const src=opts.src || "tp-media-sources";
 if(language==="md") {
 const values=Object.entries(opts).filter(([key])=>key!=="src").map(([key,value])=>`${key}=${quoteOption(value)}`).join(" ");
 const media=`![](${src}){media=${node.tagName} ${values}}`;
 if(!hasFallback)return media;
 const content=inlineFallback?fallback.map(inline).join(""):blocks(fallback);
 return `${(media+"\n\n"+content).split("\n").map(line=>"> "+line).join("\n")}\n\n{media-container="${inlineFallback?"inline":"blocks"}"}`;
 }
 if(language==="adoc") {
 const media=`${node.tagName}::${src}[tp-media=true,${Object.entries(opts).filter(([key])=>key!=="src").map(([key,value])=>`${key}=${quoteOption(value)}`).join(",")}]`;
 if(!hasFallback)return media;
 const content=inlineFallback?fallback.map(inline).join(""):blocks(fallback);
 const marker=fence("=",content,4);
 return `[example,media-container="${inlineFallback?"inline":"blocks"}"]\n${marker}\n${media}\n\n${content}\n${marker}`;
 }
 if(hasFallback && inlineFallback)opts["fallback-inline"]="true";
 return `.. media:: ${node.tagName}\n${Object.entries(opts).map(([key,value])=>`   :${key}: ${value}`).join("\n")}${hasFallback?"\n\n"+indent(inlineFallback?fallback.map(inline).join(""):blocks(fallback),3):""}`;
 };
 const comment = node => {
  const value = node.data ?? "";
  if (language === "md") return `<!--${value}-->`;
  if (language === "adoc") return value.split("\n").map(line => `// ${line}`).join("\n");
  return `..\n${value.replace(/^\s*\n|\n\s*$/g, "").split("\n").map(line=>`   ${line}`).join("\n")}`;
 };
	const inline = (node) => {
  if (node.nodeName === "#comment") return comment(node);
		if (node.nodeName === "#text") {
 const value=node.value.replace(/[ \t\r\n]+/g," ");
 return language==="md" ? value.replace(/([\\`*_[\]<>])/g,"\\$1") : language==="rst" ? value.replace(/([\\`*|])/g,"\\$1") : value.replace(/[&\\*_`{}]/g,char=>`&#${char.charCodeAt(0)};`);
 }
		const body = kids(node).map(inline).join("");
		if (node.tagName === "tp-math") return attributes(node).some(a=>a.name==="displaystyle") ? `\n\n${render(node)}\n\n` : inlineMath(node);
 if(language === "md" && ["audio","video"].includes(node.tagName)) {const source=nativeMedia(node);if(source!==undefined) return source;}
		if (node.tagName === "u" && !attributes(node).length) {
			if (language === "md") return `[${body}]{.underline}`;
			if (language === "adoc") return `[.underline]#${body}#`;
			const role = `tp-underline-${roles.length + 1}`;
			roles.push(`.. role:: ${role}\n   :class: underline`);
			return rstRole(`:${role}:\`${text(node)}\``);
		}
  if (node.tagName === "kbd" && language === "adoc" && !attributes(node).length && !/[\]\r\n]/.test(body)) { if (!roles.includes(":experimental:")) roles.push(":experimental:"); return `kbd:[${body}]`; }
  if (["sub","sup","mark","del","s","strike","ins","kbd","cite"].includes(node.tagName)) {
   if (!attributes(node).length) {
    if (language==="adoc" && ["sub","sup","mark","del","s","strike"].includes(node.tagName)) {
     const markers={sub:"~",sup:"^",mark:"#"};
     const marker=markers[node.tagName];
     return marker ? `${marker}${body}${marker}` : `[.line-through]#${body}#`;
    }
    if (language==="md" && ["sub","sup","mark","del","s","strike"].includes(node.tagName)) {
     const marker=({sub:"~",sup:"^",mark:"==",del:"~~",s:"~~",strike:"~~"})[node.tagName];
     return `${marker}${body}${marker}`;
    }
    if(language==="rst" && ["sub","sup"].includes(node.tagName)) return rstRole(`:${node.tagName}:\`${body}\``);
   }
   return inlineComponent(node);
  }
		if (node.tagName === "img" && styledImage(node)) return inlineComponent(node);
		if (node.tagName === "img" && language === "md") {
            const imageOptions = options({...node, attrs: attributes(node).filter(item => !["src", "alt"].includes(item.name))});
            return `![${attr(node, "alt") ?? ""}](${attr(node, "src")})${imageOptions ? `{${imageOptions}}` : ""}`;
        }
        if (node.tagName === "img" && language === "adoc")
 return `image:${attr(node,"src")}[${JSON.stringify(attr(node,"alt") || "")}${attributes(node).filter(a => ["width","height",...imageOptionNames].includes(a.name)).map(a=>`,${a.name}=${JSON.stringify(a.value)}`).join("")}]`;
		if (node.tagName === "img" && language === "rst") {
			const label = `tp-image-${roles.length + 1}`;
			roles.push(`.. |${label}| image:: ${attr(node,"src")}\n   :alt: ${attr(node,"alt") ?? ""}${["width","height",...imageOptionNames].filter(key=>attr(node,key)).map(key=>`\n   :${key}: ${attr(node,key)}`).join("")}`);
			return `|${label}|`;
		}

		if (["strong", "b", "em", "i"].includes(node.tagName) && (attributes(node).length || (language === "rst" && kids(node).some(child => child.tagName)))) return inlineComponent(node);
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
					? `link:${attr(node, "href")}[${body}]`
					: `\`${body} <${attr(node, "href")}>\`__`;
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
			// A layout child must remain an element, not acquire paragraph margins.
			if (node.tagName === "span" && node.parentNode?.tagName === "tp-inline") {
				flush();
				paragraphs.push(directive(node, kids(node).map(inline).join("")));
				continue;
			}
			if (
				node.nodeName === "#text" ||
				["strong", "b", "em", "i", "a", "code", "br", "sub", "sup", "mark", "del", "ins", "kbd", "cite"].includes(node.tagName) || (node.tagName === "span" && (!attributes(node).length || (kids(node).length && kids(node).every(child => child.nodeName === "#text")))) || (node.tagName === "tp-math" && !attributes(node).some(item => item.name === "displaystyle")) ||
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
	const ordinal = (number, type) => {
		if (type === "A" || type === "a") {
			let label = "";
			while (number > 0) { number--; label = String.fromCharCode(65 + number % 26) + label; number = Math.floor(number / 26); }
			return type === "a" ? label.toLowerCase() : label;
		}
		if (type === "I" || type === "i") {
			let label = "";
			for (const [value, token] of [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]])
				while(number >= value) { label += token; number -= value; }
			return type === "i" ? label.toLowerCase() : label;
		}
		return String(number);
	};
	const list = (node, depth = 1) =>
		kids(node)
			.filter((child) => child.tagName === "li")
			.map((item, index) => {
				const marker =
					language === "adoc"
						? (node.tagName === "ol" ? "." : "*").repeat(depth)
						: node.tagName === "ol"
							? `${ordinal(index + (Number(attr(node, "start")) || 1), language === "rst" ? attr(node, "type") : "1")}.`
							: "-";
				const body = kids(item).filter(
					(child) => !["ul", "ol"].includes(child.tagName),
				);
				const nested = kids(item).filter((child) =>
					["ul", "ol"].includes(child.tagName),
				);
				const rendered = blocks(body, language === "adoc" && body.some(child => ["audio", "video","h1","h2","h3","h4","h5","h6"].includes(child.tagName)) ? "\n+\n" : "\n\n").trim();
				const isBlock = body.some(
					(child) =>
						child.tagName?.startsWith("tp-") ||
						["img", "svg", "audio", "video","h1","h2","h3","h4","h5","h6"].includes(child.tagName),
				);
				if (language === "adoc")
					return `${marker} ${isBlock ? `{blank}\n+\n${rendered}` : rendered || "{blank}"}${nested.length ? `\n${nested.map((child) => list(child, depth + 1)).join("\n")}` : ""}`;
				const content = `${rendered}${nested.length ? `${!rendered && language === "md" ? "" : "\n\n"}${nested.map((child) => list(child, depth + 1)).join("\n")}` : ""}`;
				const lines = content.split("\n");
				if (language === "rst" && /^\.\. [\w-]+::/.test(lines[0])) return `${marker}\n\n${indent(content, marker.length + 1)}`;
				return `${marker} ${lines[0]}${lines.length > 1 ? `\n${indent(lines.slice(1).join("\n"), marker.length + 1)}` : ""}`;
			})
			.join("\n");
	const render = (node) => {
		const name = node.tagName;
		if (node.nodeName === "#comment") return comment(node);
        if (/^h[1-6]$/.test(name)) {
          const level=Number(name[1]),body=kids(node).map(inline).join("");
          if(language === "md")return `${"#".repeat(level)} ${body}${attributes(node).length?` {${options(node)}}`:""}`;
          if(language === "adoc")return `[discrete${attributes(node).map(({name,value})=>`,${name === "class"?"role":name}=${quoteOption(value)}`).join("")}]\n${"=".repeat(level)} ${body}`;
          return `.. heading-level:: ${level}\n\n${attributes(node).length?`.. attributes::\n${attributes(node).map(rstOption).join("\n")}\n\n`:""}${body}\n${"=".repeat(Math.max(body.length,3))}`;
        }

		if (node.nodeName === "#text") return node.value.trim();
        if (language === "rst" && name === "p" && attributes(node).length && !attributes(node).every(a => ["id", "class"].includes(a.name))) return `.. attributes::\n${attributes(node).map(rstOption).join("\n")}\n\n${render({...node,attrs:[]})}`;
  // Apply native classes/targets to a native block, without replacing its tag
  // or dropping attributes that require a custom-element directive.
  if (language === "rst" && ["p", "ul", "ol", "dl"].includes(name) && attr(node, "class") &&
      /^[a-z][a-z0-9-]*(?: +[a-z][a-z0-9-]*)*$/.test(attr(node, "class")) &&
      (!attr(node, "id") || /^[a-z][a-z0-9-]*$/.test(attr(node, "id"))) &&
      attributes(node).every(item => ["id", "class", ...(name === "ol" ? ["start", "type"] : [])].includes(item.name)) &&
      !(name === "p" && kids(node).some(child => child.tagName === "br"))) {
   const native = render({...node, attrs: attributes(node).filter(item => !["id", "class"].includes(item.name))});
   if (!new RegExp(`^\\.\\. ${name}::`).test(native))
    return `${attr(node, "id") ? `.. _${attr(node, "id")}:\n\n` : ""}.. class:: ${attr(node, "class")}\n\n${native}`;
  }
		if (name === "aside" && language === "adoc" && !attributes(node).length) { const body = blocks(kids(node)); const marker = fence("*", body, 4); return `${marker}\n${body}\n${marker}`; }
        if (name === "div" && language === "rst" && attributes(node).every(a => a.name === "class") && /^[a-z][a-z0-9-]*(?: +[a-z][a-z0-9-]*)*$/.test(attr(node, "class") ?? "")) return `.. container:: ${attr(node, "class")}\n\n${indent(blocks(kids(node)),3)}`;
        if (name === "script" || name === "style") return directive(node, dedent(text(node)));
		if (name === "tp-math") {
			if (!attributes(node).some(item => item.name === "displaystyle")) return inlineMath(node);
			if (attributes(node).some(item => !["value", "mode", "displaystyle"].includes(item.name))) {
 const value=mathSource(node);
 const shell={...node,attrs:attributes(node).filter(a=>a.name!=="value")};
 const script={tagName:"script",attrs:[{name:"type",value:attr(node,"mode")==="asciimath"?"tp/asciimath":"tp/latex"}],childNodes:[{nodeName:"#text",value}]};
 return directive(shell,render(script));
}
			const value=mathSource(node), mode=attr(node,"mode")==="asciimath"?"asciimath":"latexmath";
			if(language==="adoc") {const marker=fence("+",value,4);return `[${mode}]\n${marker}\n${value}\n${marker}`;}
			if(language==="rst")return `.. ${mode==="latexmath"?"math":"asciimath"}::\n\n${indent(value,3)}`;
			const marker=fence("`",value); return `${marker}${mode}\n${value.trim()}\n${marker}`;
		}
		if (name === "span" && !kids(node).length) {
            if (language === "rst" && attributes(node).length === 1 && attr(node,"id") && /^[a-zA-Z_][\w.-]*$/.test(attr(node,"id"))) return `.. _${attr(node,"id")}:`;
            return directive(node, "");
        }
		if (name === "span" && kids(node).every(child => child.nodeName === "#text")) return inlineComponent(node);
		if (name === "pre") {
			const body = text(node);
			const classes = attr(node,"class") ?? "";
			const code = kids(node).find(child => child.tagName === "code");
			const syntax = (attr(code ?? node,"class") ?? "").split(/\s+/).find(value=>value.startsWith("language-"))?.slice(9) ?? "";
			if (language === "md") {
				const marker = fence("`", body);
 const tail=encodeURIComponent(/[ \t\r\n]*$/.exec(body)?.[0] || "") || "-";
				return `${marker}${syntax}${` {literal-tail="${tail}"${classes ? ` ${classes.split(/\s+/).map(name=>`.${name}`).join(" ")}` : ""}}`}\n${body}\n${marker}`;
			}
			if (language === "adoc") {
				const marker = fence(syntax ? "-" : ".", body, 4);
				return `[${syntax ? `source,${syntax},` : ""}literal-tail="${encodeURIComponent(/[ \t\r\n]*$/.exec(body)?.[0] || "") || "-"}"${classes ? `,role="${classes}"` : ""}]\n${marker}\n${body}\n${marker}`;
			}
            return `.. code:: ${syntax || "plaintext"}\n   :literal-indent: 3\n   :literal-lines: ${body.split("\n").length}${classes ? `\n   :class: ${classes}` : ""}\n\n${body.split("\n").map(line=>"   "+line).join("\n")}`;
		}
		if (name === "svg") {
			const source = serializeOuter(node);
			const path = svgSource(source);
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
        if (["audio","video"].includes(name)) {
 const source=nativeMedia(node);
 if(source!==undefined) return source;
 }

		if (name === "img" && styledImage(node)) return directive(node, "");
        if (name === "img") {
 const src=attr(node,"src"),alt=attr(node,"alt") || "";
 const opts=attributes(node).filter(a => ["width","height",...imageOptionNames].includes(a.name));
 if(language === "adoc") return `image::${src}[${JSON.stringify(alt)}${opts.map(a=>`,${a.name}=${JSON.stringify(a.value)}`).join("")}]`;
 if(language === "rst") return `.. image:: ${src}\n   :alt: ${alt}${opts.map(a=>`\n   :${a.name}: ${a.value}`).join("")}`;
 return inline(node);
 }
  if (name === "hr" && !attributes(node).length) return language === "adoc" ? "'''" : language === "rst" ? "----" : "---";
  if (name === "p" && language === "md" && attributes(node).every(a=>/^[a-z_:][a-z0-9_.:-]*$/i.test(a.name)) && attributes(node).length) return `${kids(node).map(inline).join("").trim()}\n{${options(node)}}`;

        if (name === "p" && attributes(node).length === 1 && attr(node, "id") &&
            ((language === "adoc" && /^[a-zA-Z_][\w.-]*$/.test(attr(node, "id"))) ||
             (language === "rst" && /^[a-zA-Z_][\w.-]*$/.test(attr(node, "id")) && !kids(node).some(child => child.tagName === "br")))) {
            const body = render({...node, attrs: []});
            return language === "adoc" ? `[[${attr(node, "id")}]]\n${body}` : `.. _${attr(node, "id")}:\n\n${body}`;
        }
        if (name === "p" && language === "adoc" && attributes(node).length &&
            attributes(node).every(({name}) => /^[a-z_:][a-z0-9_.:-]*$/i.test(name) && !["options", "subs", "role", "reftext", "cloaked-context"].includes(name))) {
            let anchor = "", roles = "", flags = "";
            const named = [];
            for (const {name, value} of attributes(node)) {
                if (name === "id" && /^[a-zA-Z_][\w-]*$/.test(value)) anchor = `#${value}`;
                else if (name === "class" && /^[a-zA-Z_][\w-]*(?: +[a-zA-Z_][\w-]*)*$/.test(value)) roles = value.split(/ +/).map(item => `.${item}`).join("");
                else if (!value && ["hidden", "inert", "itemscope"].includes(name)) flags += `%${name}`;
                else named.push(`${name === "class" ? "role" : name}=${JSON.stringify(value)}`);
            }
            return `[${[anchor + roles + flags, ...named].filter(Boolean).join(",")}]\n${render({...node, attrs: []})}`;
        }
		if (name === "p" && !attributes(node).length)
			return language === "rst" && kids(node).some(child=>child.tagName === "br") ? kids(node).map(inline).join("").trim().split("\n").map(line=>`| ${line}`).join("\n") : kids(node).map(inline).join("").trim();
		if (/^h[1-6]$/.test(name) && !attributes(node).length) {
			const body = kids(node).map(inline).join("").trim();
			// Section headings are not legal in every nested Docutils container.
			return language === "md"
				? `${"#".repeat(Number(name[1]))} ${body}`
				: directive(node, body);
		}
		if (
			["ul", "ol"].includes(name) &&
			attributes(node).every(item => name === "ol" && ["start", "type"].includes(item.name)) &&
			(!attr(node,"type") || /^[1aAiI]$/.test(attr(node,"type"))) &&
			(!attr(node,"start") || /^\d+$/.test(attr(node,"start")) && Number.isSafeInteger(Number(attr(node,"start")))) &&
			!(language === "rst" && /^[aAiI]$/.test(attr(node,"type") ?? "") && ((Number(attr(node,"start")) || 1) + kids(node).filter(child=>child.tagName === "li").length > (/^[aA]$/.test(attr(node,"type")) ? 27 : 4000))) &&
			!kids(node).some((child) => attributes(child).length)
		)
		{
			const type = attr(node, "type"), start = attr(node, "start");
			const style = {A:"upperalpha",a:"loweralpha",I:"upperroman",i:"lowerroman"}[type];
			const prefix = language === "adoc" && (style || start) ? `[${[style, start ? `start=${start}` : ""].filter(Boolean).join(",")}]\n` : "";
			return prefix + list(node) + (language === "md" && type && type !== "1" ? `\n{type=${type}}` : "");
		}
  if (name === "ul" && ["md","adoc"].includes(language) && attr(node,"data-choice-list")) {
   const rows=kids(node).filter(child=>child.tagName==="li");
   const labels=rows.map(row=>kids(row).find(child=>child.tagName==="label"));
   if(labels.every(label=>label && kids(label).filter(child=>child.tagName==="input" && attr(child,"type")==="checkbox").length===1)) {
    return (language==="adoc" ? "[options=interactive]\n" : "") + labels.map(label=>{const input=kids(label).find(child=>child.tagName==="input");return `${language==="adoc"?"*":"-"} [${attributes(input).some(a=>a.name==="checked")?"x":" "}] ${kids(label).filter(child=>child!==input).map(inline).join("").trim()}`;}).join("\n");
   }
  }
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
 const prepareImages = node => {
 if(node.tagName === "img") {
 const extra=attributes(node).filter(a => !["src","alt","width","height","style",...imageOptionNames].includes(a.name));
 if(extra.length) node.attrs=[...attributes(node).filter(a => !extra.includes(a)),{name:"image-attributes",value:encodeURIComponent(JSON.stringify(Object.fromEntries(extra.map(a=>[a.name,a.value]))))}];
 }

 if(node.tagName === "img" && attr(node,"style")) {
 const values={};
 for(const declaration of attr(node,"style").split(";")) {
 const at=declaration.indexOf(":");
 if(at>=0) values[declaration.slice(0,at).trim()]=declaration.slice(at+1).trim();
 }
 let supported=Object.keys(values).every(key => ["width","height","transform","transform-origin","object-fit","clip-path"].includes(key));
 const result={};
 for(const key of ["width","height"]) if(values[key]) result[key]=values[key].replace(/px$/, "");
 if(values["object-fit"]) result["image-fit"]=values["object-fit"];
 if(values["transform-origin"]) result["image-origin"]=values["transform-origin"];
 if(values.transform) {
 const match=/^(?:scale\(([-\d.]+)\)\s*)?(?:rotate\(([-\d.]+)deg\))?$/.exec(values.transform);
 if(!match) result["image-transform"]=values.transform;
 else {if(match[1]) result["image-scale"]=match[1];if(match[2]) result["image-angle"]=String(-Number(match[2]));}
 }
 if(values["clip-path"]) {
 const match=/^inset\(([^)]+)\)$/.exec(values["clip-path"]);
 if(!match) supported=false;
 else {
 const sides=match[1].trim().split(/\s+/);
 if(sides.length>4) supported=false;
 const [top,right=top,bottom=top,left=right]=sides;
 result["image-trim"]=`${left} ${bottom} ${right} ${top}`;result["image-clip"]="true";
 }
 }
 try {imageOptionStyles(result);} catch {supported=false;}
 if(supported) node.attrs=[...attributes(node).filter(a => a.name!=="style" && !Object.hasOwn(result,a.name)),...Object.entries(result).map(([name,value])=>({name,value}))];
 }
 for(const child of kids(node)) prepareImages(child);
 };
 nodes.forEach(prepareImages);
	const body = inlineOnly ? nodes.map(inline).join("") : blocks(nodes);
	const result = [...roles, body].join("\n\n");
 return language === "rst" ? resolveRoles(result) : result;
}
