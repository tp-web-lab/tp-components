import { cleanReferenceMarkup } from "./index-markup.js";
import { indexList, indexName } from "./index-references.js";
/** Check declarative entries and the list they generate, independently of runtime controls. */
export function indexSignature(html: string) {
	const root = document.createElement("div");
	root.innerHTML = html;
	cleanReferenceMarkup(root);
	const clean = (text: string | null) =>
		text?.replace(/\s+/g, " ").trim() ?? "";
	const definitions = [...root.querySelectorAll("tp-index")];
	const references = [...root.querySelectorAll('tp-ref[href^="!"]')];
	const terms = definitions
		.map((node) => ({
			ref: node.getAttribute("ref"),
			index: indexName(node),
			title: node.getAttribute("title") || node.getAttribute("ref"),
			sort: node.getAttribute("sort-key") || node.getAttribute("ref"),
			parent: node.getAttribute("parent") || "",
			see: node.getAttribute("see") || "",
			also: node.getAttribute("see-also") || "",
			content: node.innerHTML.trim(),
		}))
		.sort((a, b) => `${a.index}:${a.ref}`.localeCompare(`${b.index}:${b.ref}`));
	const entries = references.map((node) => ({
		ref: node.getAttribute("href"),
		index: indexName(node),
		silent: node.hasAttribute("silent"),
		content: node.innerHTML.trim(),
	}));
	const indexes = [
		...root.querySelectorAll('tp-listof[selector="tp-index"]'),
	].map((node) => {
		const list = indexList(
			definitions.filter((d) => indexName(d) === indexName(node)),
			references,
			node,
		);
		node.append(list);
		const text = list.cloneNode(true) as Element;
		for (const block of text.querySelectorAll("ul,li,p")) {
			block.prepend(" ");
			block.append(" ");
		}
		return {
			name: indexName(node),
			title: node.getAttribute("title") || "Index",
			intoc: node.hasAttribute("intoc"),
			text: clean(text.textContent),
			levels: [...list.querySelectorAll("li")].map((item) => {
				let depth = 0;
				for (let p = item.parentElement; p && p !== node; p = p.parentElement)
					if (p.localName === "ul") depth++;
				return depth;
			}),
			links: [...list.querySelectorAll("a")].map((a) => [
				a.textContent,
				Boolean(
					root.querySelector(`[id="${decodeURIComponent(a.hash.slice(1))}"]`),
				),
			]),
		};
	});
	return {
		terms,
		entries,
		indexes,
		paragraphs: [...root.querySelectorAll("p")]
			.filter((p) => !p.closest("tp-index,tp-listof,nav"))
			.map((p) => {
				const clone = p.cloneNode(true) as Element;
				for (const ref of clone.querySelectorAll("tp-ref[silent]"))
					ref.remove();
				return clean(clone.textContent);
			}),
	};
}
