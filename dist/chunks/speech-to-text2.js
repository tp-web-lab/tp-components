//#region ../tp-markdown/dist/markdown/renderers/speech-to-text.js
var e = {
	lang: "fr-FR",
	continuous: !0,
	interimResults: !0
}, t = {
	id: "speech-to-text",
	render(e, t = {}) {
		for (let r of e.querySelectorAll(".tp-md-speech-to-text, .tp-md-speech-to-text-block")) r instanceof HTMLElement && n(r, t);
	}
};
function n(t, n) {
	if (t.dataset.sttRendered === "true") return;
	t.dataset.sttRendered = "true";
	let a = window.SpeechRecognition ?? window.webkitSpeechRecognition;
	if (a === void 0) {
		t.append(document.createTextNode(" Speech recognition is not available."));
		return;
	}
	let o = i(n, r(t)), s = new a();
	s.lang = o.lang ?? e.lang, s.continuous = o.continuous ?? e.continuous, s.interimResults = o.interimResults ?? e.interimResults;
	let c = t.querySelector("[data-stt-start]"), l = t.querySelector("[data-stt-stop]"), u = t.querySelector("[data-stt-output]");
	!(c instanceof HTMLButtonElement) || !(u instanceof HTMLElement) || (c.addEventListener("click", () => {
		u.textContent = "", s.start();
	}), l instanceof HTMLButtonElement && l.addEventListener("click", () => {
		s.stop();
	}), s.addEventListener("result", (e) => {
		let t = e.results, n = "";
		for (let e = 0; e < t.length; e += 1) n += t[e]?.[0]?.transcript ?? "";
		u.textContent = n;
	}));
}
function r(e) {
	return {
		lang: e.dataset.sttLang,
		continuous: o(e.dataset.sttContinuous),
		interimResults: o(e.dataset.sttInterimResults)
	};
}
function i(e, t) {
	return {
		...e,
		...a(t)
	};
}
function a(e) {
	let t = {};
	return e.lang !== void 0 && (t.lang = e.lang), e.continuous !== void 0 && (t.continuous = e.continuous), e.interimResults !== void 0 && (t.interimResults = e.interimResults), t;
}
function o(e) {
	if (e !== void 0) {
		if (e === "true" || e === "1") return !0;
		if (e === "false" || e === "0") return !1;
	}
}
//#endregion
export { t as default };

//# sourceMappingURL=speech-to-text2.js.map