import { TpTypescriptViewer as e } from "../typescript-viewer/typescript-viewer.js";
import { TpPlaygroundQuestion as t } from "../playground-question/playground-question.js";
//#region src/components/typescript-viewer-question/typescript-viewer-question.ts
var n = class extends t {
	createPlayground() {
		return new e();
	}
};
customElements.get("tp-typescript-viewer-question") || customElements.define("tp-typescript-viewer-question", n);
//#endregion
export { n as TpTypescriptViewerQuestion };

//# sourceMappingURL=typescript-viewer-question.js.map