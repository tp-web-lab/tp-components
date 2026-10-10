//#region src/languages/markdown/extensions/markdown-extension-loader.ts
async function e(e) {
	let t = await import(
		/* @vite-ignore */
		e
), n = t.default ?? t;
	if (typeof n != "function") throw Error(`Invalid Markdown extension: ${e}`);
	return n;
}
//#endregion
export { e as loadMarkdownExtension };

//# sourceMappingURL=markdown-extension-loader.js.map