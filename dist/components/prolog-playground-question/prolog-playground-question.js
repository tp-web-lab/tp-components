import { TpPrologPlayground as e } from "../prolog-playground/prolog-playground.js";
import { TpPlaygroundQuestion as t } from "../playground-question/playground-question.js";
//#region src/components/prolog-playground-question/prolog-playground-question.ts
var n = class extends t {
	createPlayground() {
		return new e();
	}
};
customElements.get("tp-prolog-playground-question") || customElements.define("tp-prolog-playground-question", n);
//#endregion
export { n as TpPrologPlaygroundQuestion };

//# sourceMappingURL=prolog-playground-question.js.map