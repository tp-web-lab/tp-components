//#region ../../../../../../@tp/tp-markdown/dist/markdown/renderers/text-to-speech.js
var e = {
	lang: "fr-FR",
	rate: 1,
	pitch: 1,
	volume: 1
}, t = {
	id: "text-to-speech",
	render(e, t = {}) {
		for (let n of e.querySelectorAll(".tp-md-text-to-speech")) n instanceof HTMLButtonElement && r(n, t);
		for (let t of e.querySelectorAll(".tp-md-text-to-speech-stop")) t instanceof HTMLButtonElement && n(t);
	}
};
function n(e) {
	e.dataset.textToSpeechStopRendered !== "true" && (e.dataset.textToSpeechStopRendered = "true", e.addEventListener("click", () => {
		"speechSynthesis" in window && window.speechSynthesis.cancel();
	}));
}
function r(e, t) {
	e.dataset.textToSpeechRendered !== "true" && (e.dataset.textToSpeechRendered = "true", e.addEventListener("click", () => {
		let n = e.dataset.textToSpeechText ?? "";
		n.trim() !== "" && c(n, a(t, i(e)));
	}));
}
function i(e) {
	return {
		lang: e.dataset.ttsLang,
		voice: e.dataset.ttsVoice,
		rate: s(e.dataset.ttsRate),
		pitch: s(e.dataset.ttsPitch),
		volume: s(e.dataset.ttsVolume)
	};
}
function a(e, t) {
	return {
		...e,
		...o(t)
	};
}
function o(e) {
	let t = {};
	return e.lang !== void 0 && (t.lang = e.lang), e.voice !== void 0 && (t.voice = e.voice), e.rate !== void 0 && (t.rate = e.rate), e.pitch !== void 0 && (t.pitch = e.pitch), e.volume !== void 0 && (t.volume = e.volume), t;
}
function s(e) {
	if (e === void 0) return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
async function c(t, n) {
	if (!("speechSynthesis" in window)) {
		console.warn("Web Speech API is not available.");
		return;
	}
	window.speechSynthesis.cancel();
	let r = new SpeechSynthesisUtterance(t);
	r.lang = n.lang ?? e.lang, r.rate = n.rate ?? e.rate, r.pitch = n.pitch ?? e.pitch, r.volume = n.volume ?? e.volume;
	let i = await l(n.voice, r.lang);
	i !== null && (r.voice = i), window.speechSynthesis.speak(r);
}
async function l(e, t) {
	let n = await u();
	if (e !== void 0 && e.trim() !== "") {
		let t = n.find((t) => t.name === e);
		if (t !== void 0) return t;
	}
	return n.find((e) => e.lang === t && !f(e)) ?? n.find((e) => e.lang.toLowerCase().startsWith(t.toLowerCase().slice(0, 2)) && !f(e)) ?? null;
}
async function u() {
	let e = window.speechSynthesis, t = e.getVoices();
	return t.length > 0 || (t = await new Promise((t) => {
		let n = () => {
			let r = e.getVoices();
			r.length !== 0 && (e.removeEventListener("voiceschanged", n), t(r));
		};
		e.addEventListener("voiceschanged", n);
	})), t;
}
var d = [
	"Albert",
	"Bahh",
	"Boing",
	"Bonnes nouvelles",
	"Bouffon",
	"Bulles",
	"Cloches",
	"Fred",
	"Grandma",
	"Grandpa",
	"Junior",
	"Mauvaises nouvelles",
	"Murmure",
	"Orgue",
	"Ralph",
	"Trinoïdes",
	"Violoncelles",
	"Wobble",
	"Zarvox"
];
function f(e) {
	return d.some((t) => e.name.includes(t));
}
//#endregion
export { t as default };

