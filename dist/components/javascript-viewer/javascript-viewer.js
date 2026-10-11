import { TpJavascriptPlayground as e } from "../javascript-playground/javascript-playground.js";
//#region src/components/javascript-viewer/javascript-viewer.ts
var t = class extends e {
	get viewerMode() {
		return !0;
	}
};
customElements.get("tp-javascript-viewer") || customElements.define("tp-javascript-viewer", t);
//#endregion
export { t as TpJavascriptViewer };

//# sourceMappingURL=javascript-viewer.js.map