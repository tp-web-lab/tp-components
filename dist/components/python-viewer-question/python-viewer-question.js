import { TpPythonViewer as e } from "../python-viewer/python-viewer.js";
import { TpPlaygroundQuestion as t } from "../playground-question/playground-question.js";
//#region src/components/python-viewer-question/python-viewer-question.ts
var n = class extends t {
	createPlayground() {
		return new e();
	}
};
customElements.get("tp-python-viewer-question") || customElements.define("tp-python-viewer-question", n);
//#endregion
export { n as TpPythonViewerQuestion };

//# sourceMappingURL=python-viewer-question.js.map