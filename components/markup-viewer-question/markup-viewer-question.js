import { B as e, Yt as t, z as n } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/markup-viewer-question/markup-viewer-question.ts
var r = class extends e {
	sourceLoadedEvent = "tp-markup-viewer-src-load";
	createEditor() {
		return this.createViewer();
	}
	responseValue(e) {
		return e.getValue();
	}
	async buildTests(e, r) {
		let i = await e.createRenderedDocument();
		return n(new t({
			entry: "/index.html",
			test: r.path,
			files: [{
				path: "/index.html",
				language: "html",
				content: i
			}, r]
		}));
	}
};
//#endregion
export { r as TpMarkupViewerQuestion };

