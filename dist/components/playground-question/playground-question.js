import { TpEditorQuestion as e } from "../editor-question/editor-question.js";
//#region src/components/playground-question/playground-question.ts
var t = class extends e {
	createEditor() {
		return this.createPlayground();
	}
	sourceLoadedEvent = "tp-playground-src-load";
	responseValue(e) {
		return e.getProject().toJSON();
	}
	buildTests(e, t) {
		return e.createTestDocument(t);
	}
};
//#endregion
export { t as TpPlaygroundQuestion };

//# sourceMappingURL=playground-question.js.map