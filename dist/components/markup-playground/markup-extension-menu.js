//#region src/components/markup-playground/markup-extension-menu.ts
var e = "[data-tp-markup-extension-menu]", t = "[data-tp-markup-extension-id]";
function n(e) {
	return `markup-extension-${e}`;
}
function r(e) {
	return e.startsWith("markup-extension-");
}
function i(e) {
	if (!r(e)) return null;
	let t = e.replace(/^markup-extension-/, "");
	return t === "" ? null : t;
}
function a(e) {
	return `
    <li data-tp-markup-extension-menu>
      Extensions
      <ul>
        ${e.length === 0 ? "\n              <li aria-disabled=\"true\">\n                None\n              </li>\n            " : e.map((e) => o(e)).join("")}
      </ul>
    </li>
  `;
}
function o(e) {
	return `
    <li
      role="menuitemcheckbox"
      aria-checked="${e.checked ? "true" : "false"}"
      aria-disabled="${e.disabled ? "true" : "false"}"
      data-tp-markup-extension-id="${e.id}"
      data-tp-playground-action="${n(e.id)}"
    >
      <span data-tp-markup-extension-check>${e.checked ? "✓" : ""}</span>
      <span>${e.label}</span>
    </li>
  `;
}
function s(e, n) {
	let r = e.querySelectorAll(t);
	for (let e of r) {
		let t = e.getAttribute("data-tp-markup-extension-id");
		if (t === null) continue;
		let r = n.has(t);
		e.setAttribute("aria-checked", r ? "true" : "false");
		let i = e.querySelector("[data-tp-markup-extension-check]");
		i instanceof HTMLElement && (i.textContent = r ? "✓" : "");
	}
}
//#endregion
export { t as TP_MARKUP_EXTENSION_ITEM_SELECTOR, e as TP_MARKUP_EXTENSION_MENU_SELECTOR, n as createMarkupExtensionAction, i as getMarkupExtensionIdFromAction, r as isMarkupExtensionAction, a as renderMarkupExtensionMenu, o as renderMarkupExtensionMenuItem, s as syncMarkupExtensionMenuChecks };

//# sourceMappingURL=markup-extension-menu.js.map