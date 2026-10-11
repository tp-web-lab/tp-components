import { TpTypescriptPlayground as e } from "../typescript-playground/typescript-playground.js";
//#region src/components/typescript-viewer/typescript-viewer.ts
var t = class extends e {
	get viewerMode() {
		return !0;
	}
};
customElements.get("tp-typescript-viewer") || customElements.define("tp-typescript-viewer", t);
//#endregion
export { t as TpTypescriptViewer };

//# sourceMappingURL=typescript-viewer.js.map