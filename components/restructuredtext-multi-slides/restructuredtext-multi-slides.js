import { t as e } from "../../chunks/markup-multi-slides.js";
//#region src/components/restructuredtext-multi-slides/restructuredtext-multi-slides.ts
var t = class extends e {
	get fixedLanguage() {
		return "restructuredtext";
	}
};
customElements.get("tp-restructuredtext-multi-slides") || customElements.define("tp-restructuredtext-multi-slides", t);
//#endregion
export { t as TpRestructuredTextMultiSlides };

