import "../../chunks/lib/typescript/typescript.js";
import { TpMarkupViewerQuestion as e } from "../markup-viewer-question/markup-viewer-question.js";
//#region src/components/asciidoc-viewer-question/asciidoc-viewer-question.ts
var t = class extends e {
	createViewer() {
		return document.createElement("tp-asciidoc-viewer");
	}
};
customElements.get("tp-asciidoc-viewer-question") || customElements.define("tp-asciidoc-viewer-question", t);
//#endregion
export { t as TpAsciidocViewerQuestion };

