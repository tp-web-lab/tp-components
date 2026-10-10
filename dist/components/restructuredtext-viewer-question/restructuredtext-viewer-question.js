import "../../chunks/lib/typescript/typescript.js";
import { TpMarkupViewerQuestion as e } from "../markup-viewer-question/markup-viewer-question.js";
//#region src/components/restructuredtext-viewer-question/restructuredtext-viewer-question.ts
var t = class extends e {
	createViewer() {
		return document.createElement("tp-restructuredtext-viewer");
	}
};
customElements.get("tp-restructuredtext-viewer-question") || customElements.define("tp-restructuredtext-viewer-question", t);
//#endregion
export { t as TpRestructuredTextViewerQuestion };

//# sourceMappingURL=restructuredtext-viewer-question.js.map