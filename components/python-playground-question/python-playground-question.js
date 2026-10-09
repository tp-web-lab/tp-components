import { i as e, w as t } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/python-playground-question/python-playground-question.ts
var n = class extends e {
	createPlayground() {
		return new t();
	}
};
customElements.get("tp-python-playground-question") || customElements.define("tp-python-playground-question", n);
//#endregion
export { n as TpPythonPlaygroundQuestion };

