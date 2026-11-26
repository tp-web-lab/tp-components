import type { TpAsciidocParser } from "@tp/tp-asciidoc";
import { listOptionNames } from "@tp/tp-utilities";
import { PIVOT_AUTHOR } from "./markup-pivot-authorship.js";

interface SourceNode {
	role?: string | null;
	getAttribute?: (name: string) => unknown;
	getAttributes?: () => Record<string, unknown>;
}
/** Capture authored roles/attributes while the Asciidoctor node still identifies them. */
export function prepareAsciidocPivot(
	parser: InstanceType<typeof TpAsciidocParser>,
): void {
	const converter = parser.converter as unknown as Record<
		string,
		(node: SourceNode, ...args: unknown[]) => Promise<string>
	>;
	const names = new Set<string>(["convert_pass"]);
	for (
		let prototype = Object.getPrototypeOf(converter);
		prototype;
		prototype = Object.getPrototypeOf(prototype)
	) {
		for (const name of Object.getOwnPropertyNames(prototype))
			if (name.startsWith("convert_")) names.add(name);
	}
	for (const name of names) {
		if (
			["convert_document", "convert_embedded", "convert_outline"].includes(name)
		)
			continue;
		const original = converter[name];
		if (typeof original !== "function") continue;
		converter[name] = async (node, ...args) => {
			const html = await original.call(converter, node, ...args);
			const fragment = document.createElement("template");
			fragment.innerHTML = html;
			if (name === "convert_pass") {
				for (const element of fragment.content.querySelectorAll("*"))
					element.setAttribute(PIVOT_AUTHOR, JSON.stringify({ "*": "true" }));
			} else {
				const role = String(node.getAttribute?.("role") ?? node.role ?? "");
				for (const element of fragment.content.children) {
					const authored: Record<string, string> = {};
					const classes = role
						.split(/\s+/)
						.filter((value) => value && element.classList.contains(value));
					if (classes.length) authored.class = classes.join(" ");
					for (const key of Object.keys(node.getAttributes?.() ?? {})) {
						if (
							!listOptionNames.includes(key) &&
							key !== "figure-layout" &&
							key !== "class" &&
							key !== "role" &&
							key !== "id" &&
							element.hasAttribute(key)
						)
							authored[key] = element.getAttribute(key) ?? "";
					}
					if (Object.keys(authored).length)
						element.setAttribute(PIVOT_AUTHOR, JSON.stringify(authored));
				}
			}
			return fragment.innerHTML;
		};
	}
}
