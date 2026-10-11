import { TpJavascriptViewer as e } from "../javascript-viewer/javascript-viewer.js";
import { TpPlaygroundQuestion as t } from "../playground-question/playground-question.js";
//#region src/components/javascript-viewer-question/javascript-viewer-question.ts
var n = class extends t {
	createPlayground() {
		return new e();
	}
};
customElements.get("tp-javascript-viewer-question") || customElements.define("tp-javascript-viewer-question", n);
//#endregion
export { n as TpJavascriptViewerQuestion };

//# sourceMappingURL=javascript-viewer-question.js.map