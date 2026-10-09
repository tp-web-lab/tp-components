import "../../chunks/lib/typescript/typescript.js";
import { TpMarkupViewerQuestion as e } from "../markup-viewer-question/markup-viewer-question.js";
//#region src/components/html-viewer-question/html-viewer-question.ts
var t = class extends e {
	createViewer() {
		return document.createElement("tp-html-viewer");
	}
};
customElements.get("tp-html-viewer-question") || customElements.define("tp-html-viewer-question", t);
//#endregion
export { t as TpHtmlViewerQuestion };

