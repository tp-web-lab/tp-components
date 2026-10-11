import { TpPrologViewer as e } from "../prolog-viewer/prolog-viewer.js";
import { TpPlaygroundQuestion as t } from "../playground-question/playground-question.js";
//#region src/components/prolog-viewer-question/prolog-viewer-question.ts
var n = class extends t {
	createPlayground() {
		return new e();
	}
};
customElements.get("tp-prolog-viewer-question") || customElements.define("tp-prolog-viewer-question", n);
//#endregion
export { n as TpPrologViewerQuestion };

//# sourceMappingURL=prolog-viewer-question.js.map