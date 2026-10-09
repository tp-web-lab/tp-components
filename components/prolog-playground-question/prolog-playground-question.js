import { i as e, p as t } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/prolog-playground-question/prolog-playground-question.ts
var n = class extends e {
	createPlayground() {
		return new t();
	}
};
customElements.get("tp-prolog-playground-question") || customElements.define("tp-prolog-playground-question", n);
//#endregion
export { n as TpPrologPlaygroundQuestion };

