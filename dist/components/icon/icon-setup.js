import { hasTpIcon as e, registerTpIconLibrary as t } from "./icon-registry.js";
import { tpInternalIcons as n } from "./icon-internal.js";
//#region src/components/icon/icon-setup.ts
function r() {
	e("close", "tp") && e("check", "tp") || t("tp", n);
}
//#endregion
export { r as setupTpIcons };

//# sourceMappingURL=icon-setup.js.map