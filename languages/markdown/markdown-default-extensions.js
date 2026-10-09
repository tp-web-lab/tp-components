import e from "./extensions/section-numbering/index.js";
import t from "./extensions/toc/index.js";
import n from "./extensions/include/index.js";
import r from "./extensions/web-component/index.js";
import i from "./extensions/references/index.js";
//#region src/languages/markdown/markdown-default-extensions.ts
function a(a, o = {}) {
	a.use(i), a.use(r), a.use(e), a.use(n, {
		files: o.files,
		entryPath: o.entryPath
	}), a.use(t);
}
//#endregion
export { a as registerDefaultMarkdownExtensions };

