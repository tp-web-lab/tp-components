//#region ../tp-markdown/dist/markdown/renderers/tabs.js
var e = {
	id: "tabs",
	async render(e) {
		for (let n of e.querySelectorAll("[data-tabs]")) n instanceof HTMLElement && t(n);
	}
};
function t(e) {
	if (e.dataset.tabsBound === "true") return;
	e.dataset.tabsBound = "true";
	let t = Array.from(e.querySelectorAll("[data-tabs-tab]")), n = Array.from(e.querySelectorAll("[data-tabs-panel]"));
	for (let e of t) e.addEventListener("click", () => {
		let r = e.dataset.tabsIndex ?? "";
		for (let n of t) n.setAttribute("aria-selected", String(n === e));
		for (let e of n) e.hidden = e.dataset.tabsIndex !== r;
	});
}
//#endregion
export { e as default };

//# sourceMappingURL=tabs.js.map