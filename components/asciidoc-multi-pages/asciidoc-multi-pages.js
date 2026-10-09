import { t as e } from "../../chunks/markup-multi-pages.js";
//#region src/components/asciidoc-multi-pages/asciidoc-multi-pages.ts
var t = class extends e {
	get fixedLanguage() {
		return "asciidoc";
	}
};
customElements.get("tp-asciidoc-multi-pages") || customElements.define("tp-asciidoc-multi-pages", t);
//#endregion
export { t as TpAsciidocMultiPages };

