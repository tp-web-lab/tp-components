import { TpPythonPlayground as e } from "../python-playground/python-playground.js";
import { TpPlaygroundQuestion as t } from "../playground-question/playground-question.js";
//#region src/components/python-playground-question/python-playground-question.ts
var n = class extends t {
	createPlayground() {
		return new e();
	}
};
customElements.get("tp-python-playground-question") || customElements.define("tp-python-playground-question", n);
//#endregion
export { n as TpPythonPlaygroundQuestion };

//# sourceMappingURL=python-playground-question.js.map