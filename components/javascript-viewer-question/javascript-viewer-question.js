import { M as e, i as t } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/javascript-viewer-question/javascript-viewer-question.ts
var n = class extends t {
	createPlayground() {
		return new e();
	}
};
customElements.get("tp-javascript-viewer-question") || customElements.define("tp-javascript-viewer-question", n);
//#endregion
export { n as TpJavascriptViewerQuestion };

