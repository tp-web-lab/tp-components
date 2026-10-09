import { t as e } from "../../chunks/markup-single-page.js";
//#region src/components/restructuredtext-single-page/restructuredtext-single-page.ts
var t = class extends e {
	get fixedLanguage() {
		return "restructuredtext";
	}
};
customElements.get("tp-restructuredtext-single-page") || customElements.define("tp-restructuredtext-single-page", t);
//#endregion
export { t as TpRestructuredTextSinglePage };

