import { $t as e, B as t, z as n } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/markup-viewer-question/markup-viewer-question.ts
var r = class extends t {
	sourceLoadedEvent = "tp-markup-viewer-src-load";
	createEditor() {
		return this.createViewer();
	}
	responseValue(e) {
		return e.getValue();
	}
	async buildTests(t, r) {
		let i = await t.createRenderedDocument();
		return n(new e({
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

//# sourceMappingURL=markup-viewer-question.js.map