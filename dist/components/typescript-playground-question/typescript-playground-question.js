import { TpTypescriptPlayground as e } from "../typescript-playground/typescript-playground.js";
import { TpPlaygroundQuestion as t } from "../playground-question/playground-question.js";
//#region src/components/typescript-playground-question/typescript-playground-question.ts
var n = class extends t {
	createPlayground() {
		return new e();
	}
};
customElements.get("tp-typescript-playground-question") || customElements.define("tp-typescript-playground-question", n);
//#endregion
export { n as TpTypescriptPlaygroundQuestion };

//# sourceMappingURL=typescript-playground-question.js.map