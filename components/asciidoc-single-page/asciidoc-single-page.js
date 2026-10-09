import { t as e } from "../../chunks/markup-single-page.js";
//#region src/components/asciidoc-single-page/asciidoc-single-page.ts
var t = class extends e {
	get fixedLanguage() {
		return "asciidoc";
	}
};
customElements.get("tp-asciidoc-single-page") || customElements.define("tp-asciidoc-single-page", t);
//#endregion
export { t as TpAsciidocSinglePage };

