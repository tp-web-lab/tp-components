import { nativeImageOptions } from "../../utilities/markup-native-presentation.js";
import { nativeMarkup } from "../../utilities/native-markup.js";

/** Inline rich content suitable for a pipe-table cell; complex blocks need directives. */
export function tableRichMarkdown(html: string): string | undefined {
	const template = document.createElement("template");
	template.innerHTML = html;
	const supported = new Set([
		"p",
		"strong",
		"b",
		"em",
		"i",
		"a",
		"code",
		"br",
		"img",
		"video",
		"audio",
	]);
	for (const element of template.content.querySelectorAll("*")) {
		if (!supported.has(element.localName)) return undefined;
		if (
			element.localName === "img" &&
			!nativeImageOptions(element as HTMLImageElement)
		)
			return undefined;
		if (
			element.localName === "code" &&
			/[|\r\n]/.test(element.textContent ?? "")
		)
			return undefined;
		const allowed =
			element.localName === "img"
				? undefined
				: element.localName === "a"
					? ["href"]
					: undefined;
		if (
			allowed &&
			[...element.attributes].some((attr) => !allowed.includes(attr.name))
		)
			return undefined;
		if (
			!["img", "video", "audio", "a"].includes(element.localName) &&
			element.attributes.length
		)
			return undefined;
		if (
			["video", "audio"].includes(element.localName) &&
			element.childNodes.length
		)
			return undefined;
		if ([...element.attributes].some((attr) => /[\r\n|]/.test(attr.value)))
			return undefined;
	}
	for (const media of template.content.querySelectorAll<HTMLElement>(
		"video,audio",
	))
		for (const dimension of ["width", "height"]) {
			const size = media.getAttribute(dimension);
			if (
				size &&
				/^\d+(?:\.\d+)?$/.test(size) &&
				!media.style.getPropertyValue(dimension)
			)
				media.style.setProperty(dimension, `${size}px`);
		}
	const render = (node: Node): string => {
		if (node.nodeType === 3)
			return (node.textContent ?? "")
				.replace(/\s+/g, " ")
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/[\\`*_[\]{}!#|~^]/g, (char) => `&#${char.charCodeAt(0)};`);
		if (!(node instanceof Element)) return "";
		const body = () => [...node.childNodes].map(render).join("");
		switch (node.localName) {
			case "strong":
			case "b":
				return `**${body()}**`;
			case "em":
			case "i":
				return `*${body()}*`;
			case "br":
				return "<br>";
			case "p":
				return `${body()}<br><br>`;
			case "img":
			case "video":
			case "audio":
				return nativeMarkup("md", node.outerHTML);
			case "a":
				return nativeMarkup("md", node.outerHTML);
			case "code": {
				const value = node.textContent ?? "";
				const fence = "`".repeat(
					Math.max(
						0,
						...[...value.matchAll(/`+/g)].map((match) => match[0].length),
					) + 1,
				);
				return `${fence} ${value.replaceAll("|", "&#124;").replace(/\r?\n/g, " ")} ${fence}`;
			}
			default:
				return body();
		}
	};
	return [...template.content.childNodes]
		.map(render)
		.join("")
		.trim()
		.replace(/(?:<br>)+$/, "");
}
