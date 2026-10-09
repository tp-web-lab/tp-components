import "../../chunks/lib/typescript/typescript.js";
import { TpMarkupViewerQuestion as e } from "../markup-viewer-question/markup-viewer-question.js";
//#region src/components/markdown-viewer-question/markdown-viewer-question.ts
var t = class extends e {
	createViewer() {
		return document.createElement("tp-markdown-viewer");
	}
};
customElements.get("tp-markdown-viewer-question") || customElements.define("tp-markdown-viewer-question", t);
//#endregion
export { t as TpMarkdownViewerQuestion };

