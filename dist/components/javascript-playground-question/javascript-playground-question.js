import { TpJavascriptPlayground as e } from "../javascript-playground/javascript-playground.js";
import { TpPlaygroundQuestion as t } from "../playground-question/playground-question.js";
//#region src/components/javascript-playground-question/javascript-playground-question.ts
var n = class extends t {
	createPlayground() {
		return new e();
	}
};
customElements.get("tp-javascript-playground-question") || customElements.define("tp-javascript-playground-question", n);
//#endregion
export { n as TpJavascriptPlaygroundQuestion };

//# sourceMappingURL=javascript-playground-question.js.map