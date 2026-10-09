import { N as e, i as t } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/javascript-playground-question/javascript-playground-question.ts
var n = class extends t {
	createPlayground() {
		return new e();
	}
};
customElements.get("tp-javascript-playground-question") || customElements.define("tp-javascript-playground-question", n);
//#endregion
export { n as TpJavascriptPlaygroundQuestion };

