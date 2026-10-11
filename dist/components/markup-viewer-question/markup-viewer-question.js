import { TpProject as e } from "../playground/project.js";
import { TpEditorQuestion as t } from "../editor-question/editor-question.js";
import { buildBrowserTestDocument as n } from "../playground/browser-test-document.js";
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