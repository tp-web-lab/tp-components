import { t as e } from "../../chunks/markup-multi-pages.js";
//#region src/components/html-multi-pages/html-multi-pages.ts
var t = class extends e {
	get fixedLanguage() {
		return "html";
	}
};
customElements.get("tp-html-multi-pages") || customElements.define("tp-html-multi-pages", t);
//#endregion
export { t as TpHtmlMultiPages };

