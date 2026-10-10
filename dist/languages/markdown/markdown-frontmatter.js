import { t as e } from "../../chunks/lib/yaml/yaml.js";
//#region src/languages/markdown/markdown-frontmatter.ts
function t(t) {
	let n = t.match(/^---\n([\s\S]*?)\n---\n?/);
	if (n === null) return {
		attributes: {},
		body: t
	};
	let r = e(n[1] ?? "");
	return {
		attributes: typeof r == "object" && r ? r : {},
		body: t.slice(n[0].length)
	};
}
//#endregion
export { t as parseMarkdownFrontMatter };

//# sourceMappingURL=markdown-frontmatter.js.map