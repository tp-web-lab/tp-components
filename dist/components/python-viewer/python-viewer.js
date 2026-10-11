import { TpPythonPlayground as e } from "../python-playground/python-playground.js";
//#region src/components/python-viewer/python-viewer.ts
var t = class extends e {
	get viewerMode() {
		return !0;
	}
};
customElements.get("tp-python-viewer") || customElements.define("tp-python-viewer", t);
//#endregion
export { t as TpPythonViewer };

//# sourceMappingURL=python-viewer.js.map