//#region src/utilities/help-keyboard.ts
function e(e) {
	let t = "Arrow (?:Up|Down|Left|Right)|Mod|Ctrl|Control|Shift|AltGr|Alt|Meta|Command|Cmd|Option|Escape|Esc|Enter|Return|Tab|Space|Backspace|Delete|Insert|Home|End|PageUp|PageDown|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|F(?:1[0-2]|[1-9])", n = `(?:${t}|[A-Za-z0-9?+−-])`, r = RegExp(`\\b(?:${t})(?:\\+${n})+(?![A-Za-z0-9])`, "g"), i = RegExp(`\\b(?:${t}|Down|Up|Left|Right)(?:\\+${n})*(?![A-Za-z0-9])`, "g"), a = (e) => e.split(/\+(?!$)/).map((e) => `<kbd>${e}</kbd>`).join("+"), o = !1, s = "";
	return e.split("\n").map((e) => {
		let t = e.match(/^\s*(```|~~~)/)?.[1];
		return t ? (s = s ? "" : t, e) : s ? e : (/^#{2,4} /.test(e) && (o = /^#### Keyboard/.test(e)), o && (e = e.replace(/`([^`]+)`/g, (e, t) => RegExp(`^${n}(?:[+ ]${n})*$`).test(t) ? a(t.replace(/ /g, "+")) : e)), e.split(/(<kbd\b[^>]*>[\s\S]*?<\/kbd>|`[^`]*`|<[^>]+>)/g).map((e, t) => t % 2 ? e : (o && (e = e.replace(i, a), e = e.replace(/(^\|\s*|\/\s*)([A-Z0-9?])(?=\s*(?:[|/,]|on\b|to\b|$))/g, "$1<kbd>$2</kbd>")), o || (e = e.replace(r, a)), e.replace(/\b(type|press) (\?)(?=[ .;])/g, "$1 <kbd>$2</kbd>"))).join(""));
	}).join("\n");
}
//#endregion
export { e as formatHelpKeyboard };

//# sourceMappingURL=help-keyboard.js.map