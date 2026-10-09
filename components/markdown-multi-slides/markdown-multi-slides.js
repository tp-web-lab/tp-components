import { t as e } from "../../chunks/markup-multi-slides.js";
//#region src/components/markdown-multi-slides/markdown-multi-slides.ts
var t = class extends e {
	get fixedLanguage() {
		return "markdown";
	}
};
customElements.get("tp-markdown-multi-slides") || customElements.define("tp-markdown-multi-slides", t);
//#endregion
export { t as TpMarkdownMultiSlides };

