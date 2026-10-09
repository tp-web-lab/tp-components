import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/color-picker/color-picker.css?inline
var t = "tp-color-picker{border:1px solid var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-lg);background:var(--tp-paper-color);gap:1rem;padding:.75rem;display:grid}tp-color-picker [data-tp-color-picker-jump-controls]{border:1px solid var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-md);background:var(--tp-neutral-fill-softer);grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:.75rem;padding:.5rem;display:grid}tp-color-picker [data-tp-color-picker-jump-control]{gap:.35rem;display:grid}tp-color-picker [data-tp-color-picker-jump-label]{font-size:.78rem;font-weight:var(--tp-font-weight-semibold)}tp-color-picker [data-tp-color-picker-jump-select]{min-block-size:var(--tp-form-control-height-sm);border:1px solid var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-sm);background:var(--tp-paper-color);color:var(--tp-text-body);padding-inline:.5rem}tp-color-picker [data-tp-color-picker-section]{gap:.5rem;display:grid}tp-color-picker [data-tp-color-picker-section-title]{margin:0;font-size:.95rem}tp-color-picker [data-tp-color-picker-grid]{grid-template-columns:repeat(auto-fill,minmax(14rem,1fr));gap:.5rem;display:grid}tp-color-picker [data-tp-color-picker-token]{border:1px solid var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-md);background:var(--tp-neutral-fill-softer);color:var(--tp-text-body);grid-template-columns:2rem 1fr;grid-template-areas:\"swatch token\"\"swatch value\";align-items:center;gap:.2rem .5rem;padding:.5rem;display:grid}tp-color-picker [data-tp-color-picker-token],tp-color-picker [data-tp-color-picker-class-swatch]{cursor:copy}tp-color-picker [data-tp-color-picker-token]:focus-visible,tp-color-picker [data-tp-color-picker-class-swatch]:focus-visible{outline:2px solid var(--tp-color-focus,Highlight);outline-offset:2px}tp-color-picker [data-tp-color-picker-swatch]{border:1px solid var(--tp-neutral-stroke-mid);border-radius:var(--tp-border-radius-sm);block-size:2rem;inline-size:2rem;box-shadow:var(--tp-inset-shadow-softer);grid-area:swatch}tp-color-picker [data-tp-color-picker-token-name]{word-break:break-word;grid-area:token;font-size:.78rem;line-height:1.2}tp-color-picker [data-tp-color-picker-token-value]{color:var(--tp-text-body);word-break:break-word;grid-area:value;font-size:.75rem}tp-color-picker [data-tp-color-picker-class]{box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-md);background:var(--tp-neutral-fill-softer);inline-size:fit-content;max-inline-size:100%;color:var(--tp-text-body);justify-self:start;gap:.5rem;padding:.5rem;display:grid}tp-color-picker [data-tp-color-picker-class-grid]{flex-wrap:wrap;justify-content:start;align-items:start;display:flex}tp-color-picker [data-tp-color-picker-class-swatch]{justify-items:center;gap:.25rem;display:grid}tp-color-picker [data-tp-color-picker-class-chip]{border:1px solid var(--tp-neutral-stroke-mid);border-radius:var(--tp-border-radius-sm);block-size:2rem;inline-size:2rem;box-shadow:var(--tp-inset-shadow-softer);font-size:.75rem;font-weight:var(--tp-font-weight-bold);place-items:center;line-height:1;display:grid}tp-color-picker [data-tp-color-picker-class-name]{word-break:break-word;font-size:.78rem;line-height:1.2}tp-color-picker [data-tp-color-picker-class-scales]{flex-wrap:nowrap;gap:.5rem;inline-size:100%;min-inline-size:0;padding-block-end:.125rem;display:flex;overflow-x:auto}tp-color-picker [data-tp-color-picker-class-scales-title]{color:var(--tp-text-body);font-size:.75rem;line-height:1.1}tp-color-picker [data-tp-color-picker-class-scales-best],tp-color-picker [data-tp-color-picker-class-scales-tone]{border-top:1px solid var(--tp-neutral-stroke-soft);padding-block-start:.25rem}tp-color-picker [data-tp-color-picker-class-caption]{color:var(--tp-text-body);text-align:center;word-break:break-word;font-size:.75rem;line-height:1.2}tp-color-picker [data-tp-color-picker-class-subcaption]{color:var(--tp-text-body);text-align:center;word-break:break-word;font-size:.7rem;line-height:1.1}", n = [
	"50",
	"100",
	"200",
	"300",
	"400",
	"500",
	"600",
	"700",
	"800",
	"900",
	"950"
], r = {
	50: "color-mix(in oklab, var(--tp-brand-seed), white 95%)",
	100: "color-mix(in oklab, var(--tp-brand-seed), white 87%)",
	200: "color-mix(in oklab, var(--tp-brand-seed), white 70%)",
	300: "color-mix(in oklab, var(--tp-brand-seed), white 47%)",
	400: "color-mix(in oklab, var(--tp-brand-seed), white 23%)",
	500: "var(--tp-brand-seed)",
	600: "color-mix(in oklab, var(--tp-brand-seed), black 15.5%)",
	700: "color-mix(in oklab, var(--tp-brand-seed), black 28.25%)",
	800: "color-mix(in oklab, var(--tp-brand-seed), black 43.5%)",
	900: "color-mix(in oklab, var(--tp-brand-seed), black 58.5%)",
	950: "color-mix(in oklab, var(--tp-brand-seed), black 73.75%)"
};
function i(e) {
	return n.map((t) => `--tp-${e}-${t}`);
}
function a(e) {
	return [
		`--tp-${e}-fill-softer`,
		`--tp-${e}-fill-soft`,
		`--tp-${e}-fill-mid`,
		`--tp-${e}-fill-loud`,
		`--tp-${e}-fill-louder`,
		`--tp-${e}-text-on-soft`,
		`--tp-${e}-text-on-mid`,
		`--tp-${e}-text-on-loud`,
		`--tp-${e}-text-colorful`,
		`--tp-${e}-stroke-softer`,
		`--tp-${e}-stroke-soft`,
		`--tp-${e}-stroke-mid`
	];
}
var o = {
	id: "tp-color-picker-seed-tokens",
	group: "seed",
	title: "Seed tokens",
	tokens: [
		"--tp-brand-seed",
		"--tp-neutral-seed",
		"--tp-success-seed",
		"--tp-warning-seed",
		"--tp-danger-seed",
		"--tp-info-seed"
	]
}, s = [
	{
		id: "tp-color-picker-brand-scale",
		group: "scale",
		title: "Brand scale",
		tokens: i("brand")
	},
	{
		id: "tp-color-picker-neutral-scale",
		group: "scale",
		title: "Neutral scale",
		tokens: i("neutral")
	},
	{
		id: "tp-color-picker-success-scale",
		group: "scale",
		title: "Success scale",
		tokens: i("success")
	},
	{
		id: "tp-color-picker-warning-scale",
		group: "scale",
		title: "Warning scale",
		tokens: i("warning")
	},
	{
		id: "tp-color-picker-danger-scale",
		group: "scale",
		title: "Danger scale",
		tokens: i("danger")
	},
	{
		id: "tp-color-picker-info-scale",
		group: "scale",
		title: "Info scale",
		tokens: i("info")
	}
], c = [
	{
		id: "tp-color-picker-brand-semantic",
		group: "semantic",
		title: "Brand semantic tokens",
		tokens: a("brand")
	},
	{
		id: "tp-color-picker-neutral-semantic",
		group: "semantic",
		title: "Neutral semantic tokens",
		tokens: a("neutral")
	},
	{
		id: "tp-color-picker-success-semantic",
		group: "semantic",
		title: "Success semantic tokens",
		tokens: a("success")
	},
	{
		id: "tp-color-picker-warning-semantic",
		group: "semantic",
		title: "Warning semantic tokens",
		tokens: a("warning")
	},
	{
		id: "tp-color-picker-danger-semantic",
		group: "semantic",
		title: "Danger semantic tokens",
		tokens: a("danger")
	},
	{
		id: "tp-color-picker-info-semantic",
		group: "semantic",
		title: "Info semantic tokens",
		tokens: a("info")
	}
], l = [
	{
		id: "tp-color-picker-class-tp-default",
		presetClass: "tp-default",
		brandSeed: "#989cff"
	},
	{
		id: "tp-color-picker-class-tp-red",
		presetClass: "tp-red",
		brandSeed: "#ef5655"
	},
	{
		id: "tp-color-picker-class-tp-orange",
		presetClass: "tp-orange",
		brandSeed: "#f08039"
	},
	{
		id: "tp-color-picker-class-tp-amber",
		presetClass: "tp-amber",
		brandSeed: "#e89a26"
	},
	{
		id: "tp-color-picker-class-tp-yellow",
		presetClass: "tp-yellow",
		brandSeed: "#dcb31e"
	},
	{
		id: "tp-color-picker-class-tp-lime",
		presetClass: "tp-lime",
		brandSeed: "#9abb28"
	},
	{
		id: "tp-color-picker-class-tp-green",
		presetClass: "tp-green",
		brandSeed: "#5dbb55"
	},
	{
		id: "tp-color-picker-class-tp-emerald",
		presetClass: "tp-emerald",
		brandSeed: "#47b873"
	},
	{
		id: "tp-color-picker-class-tp-teal",
		presetClass: "tp-teal",
		brandSeed: "#37b995"
	},
	{
		id: "tp-color-picker-class-tp-glaz",
		presetClass: "tp-glaz",
		brandSeed: "#88B1A1"
	},
	{
		id: "tp-color-picker-class-tp-cyan",
		presetClass: "tp-cyan",
		brandSeed: "#20b8bc"
	},
	{
		id: "tp-color-picker-class-tp-sky",
		presetClass: "tp-sky",
		brandSeed: "#1caedd"
	},
	{
		id: "tp-color-picker-class-tp-blue",
		presetClass: "tp-blue",
		brandSeed: "#4a97f4"
	},
	{
		id: "tp-color-picker-class-tp-indigo",
		presetClass: "tp-indigo",
		brandSeed: "#6e85f8"
	},
	{
		id: "tp-color-picker-class-tp-violet",
		presetClass: "tp-violet",
		brandSeed: "#927cfb"
	},
	{
		id: "tp-color-picker-class-tp-purple",
		presetClass: "tp-purple",
		brandSeed: "#ae75f6"
	},
	{
		id: "tp-color-picker-class-tp-fuchsia",
		presetClass: "tp-fuchsia",
		brandSeed: "#d26ae8"
	},
	{
		id: "tp-color-picker-class-tp-pink",
		presetClass: "tp-pink",
		brandSeed: "#e468b0"
	},
	{
		id: "tp-color-picker-class-tp-rose",
		presetClass: "tp-rose",
		brandSeed: "#ee6383"
	},
	{
		id: "tp-color-picker-class-tp-zinc",
		presetClass: "tp-zinc",
		brandSeed: "#8b8c93"
	},
	{
		id: "tp-color-picker-class-tp-ivory",
		presetClass: "tp-ivory",
		brandSeed: "#fffff0"
	},
	{
		id: "tp-color-picker-class-tp-stone",
		presetClass: "tp-stone",
		brandSeed: "#918c87"
	}
], u = class i extends e {
	static styleId = "tp-color-picker-styles";
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(i.styleId, t), this.render();
	}
	render() {
		let e = document.createDocumentFragment();
		e.append(this.createJumpControls()), e.append(this.createSection(o));
		for (let t of s) e.append(this.createSection(t));
		e.append(this.createClassSection());
		for (let t of c) e.append(this.createSection(t));
		this.replaceChildren(e), this.updateClassScaleContrast();
	}
	createJumpControls() {
		let e = document.createElement("section");
		return e.setAttribute("data-tp-color-picker-jump-controls", ""), e.append(this.createJumpSelect("Scales", s.map((e) => ({
			label: e.title,
			targetId: e.id
		}))), this.createJumpSelect(".tp-* class scales", l.map((e) => ({
			label: `.${e.presetClass}`,
			targetId: e.id
		}))), this.createJumpSelect("Semantic tokens", c.map((e) => ({
			label: e.title,
			targetId: e.id
		})))), e;
	}
	createJumpSelect(e, t) {
		let n = document.createElement("label");
		n.setAttribute("data-tp-color-picker-jump-control", "");
		let r = document.createElement("span");
		r.setAttribute("data-tp-color-picker-jump-label", ""), r.textContent = e;
		let i = document.createElement("select");
		i.setAttribute("data-tp-color-picker-jump-select", ""), i.addEventListener("change", () => this.handleJumpSelect(i));
		let a = document.createElement("option");
		a.value = "", a.textContent = `Go to ${e.toLowerCase()}…`, i.append(a);
		for (let e of t) {
			let t = document.createElement("option");
			t.value = e.targetId, t.textContent = e.label, i.append(t);
		}
		return n.append(r, i), n;
	}
	handleJumpSelect(e) {
		let t = e.value;
		t && (this.querySelector(`#${t}`)?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		}), e.value = "");
	}
	createClassSection() {
		let e = document.createElement("section");
		e.id = "tp-color-picker-class-scales", e.setAttribute("data-tp-color-picker-section", ""), e.setAttribute("data-tp-color-picker-class-section", "");
		let t = document.createElement("h3");
		t.setAttribute("data-tp-color-picker-section-title", ""), t.textContent = ".tp-* class scales";
		let n = document.createElement("div");
		n.setAttribute("data-tp-color-picker-grid", ""), n.setAttribute("data-tp-color-picker-class-grid", "");
		for (let e of l) n.append(this.createClassCard(e));
		return e.append(t, n), e;
	}
	createSection(e) {
		let t = document.createElement("section");
		t.id = e.id, t.setAttribute("data-tp-color-picker-section", ""), t.setAttribute("data-tp-color-picker-section-group", e.group);
		let n = document.createElement("h3");
		n.setAttribute("data-tp-color-picker-section-title", ""), n.textContent = e.title;
		let r = document.createElement("div");
		r.setAttribute("data-tp-color-picker-grid", "");
		for (let t of e.tokens) r.append(this.createTokenCard(t));
		return t.append(n, r), t;
	}
	createTokenCard(e) {
		let t = document.createElement("article");
		t.setAttribute("data-tp-color-picker-token", ""), t.dataset.token = e, t.tabIndex = 0, t.setAttribute("role", "button"), t.setAttribute("aria-label", `Copy var(${e})`), this.addCopyInteraction(t, e);
		let n = document.createElement("span");
		n.setAttribute("data-tp-color-picker-swatch", ""), n.style.backgroundColor = `var(${e})`;
		let r = document.createElement("code");
		r.setAttribute("data-tp-color-picker-token-name", ""), r.textContent = e;
		let i = document.createElement("output");
		return i.setAttribute("data-tp-color-picker-token-value", ""), i.textContent = this.getTokenValue(e) || "(unresolved)", t.append(n, r, i), t;
	}
	createClassCard(e) {
		let t = document.createElement("article");
		t.id = e.id, t.setAttribute("data-tp-color-picker-class", ""), t.dataset.className = e.presetClass;
		let r = document.createElement("code");
		r.setAttribute("data-tp-color-picker-class-name", ""), r.textContent = `.${e.presetClass} { --tp-brand-seed: ${e.brandSeed}; }`;
		let i = document.createElement("div");
		i.setAttribute("data-tp-color-picker-class-scales", "");
		for (let t of n) i.append(this.createClassSwatch(t, e.presetClass, t, "plain"));
		let a = document.createElement("div");
		a.setAttribute("data-tp-color-picker-class-scales", ""), a.setAttribute("data-tp-color-picker-class-scales-best", "");
		for (let t of n) a.append(this.createClassSwatch(t, e.presetClass, t, "best-contrast"));
		let o = this.createClassScalesTitle("black or white text", "best"), s = document.createElement("div");
		s.setAttribute("data-tp-color-picker-class-scales", ""), s.setAttribute("data-tp-color-picker-class-scales-tone", "");
		for (let t of n) s.append(this.createClassSwatch(t, e.presetClass, t, "tone-contrast"));
		let c = this.createClassScalesTitle("accessible text contrast", "tone");
		return t.append(r, i, o, a, c, s), t;
	}
	createClassScalesTitle(e, t) {
		let n = document.createElement("div");
		return n.setAttribute("data-tp-color-picker-class-scales-title", ""), n.dataset.row = t, n.textContent = e, n;
	}
	createClassSwatch(e, t, n, i) {
		let a = document.createElement("div");
		a.setAttribute("data-tp-color-picker-class-swatch", ""), a.dataset.mode = i, a.dataset.scaleStep = n;
		let o = `--tp-brand-${n}`;
		a.tabIndex = 0, a.setAttribute("role", "button"), a.setAttribute("aria-label", `Copy var(${o})`), this.addCopyInteraction(a, o);
		let s = document.createElement("span");
		if (s.setAttribute("data-tp-color-picker-class-chip", ""), s.classList.add(t), s.style.backgroundColor = r[n], i !== "plain") {
			let e = document.createElement("span");
			e.setAttribute("data-tp-color-picker-class-chip-text", ""), e.classList.add(t), e.textContent = "Aa", s.append(e);
		}
		let c = document.createElement("code");
		if (c.setAttribute("data-tp-color-picker-class-caption", ""), c.textContent = e, a.append(s, c), i === "tone-contrast") {
			let e = document.createElement("code");
			e.setAttribute("data-tp-color-picker-class-subcaption", ""), a.append(e);
		}
		return a;
	}
	addCopyInteraction(e, t) {
		let n = () => {
			let e = `var(${t})`;
			navigator.clipboard !== void 0 && navigator.clipboard.writeText(e).catch((n) => {
				this.dispatchEvent(new CustomEvent("tp-color-picker-copy-error", {
					bubbles: !0,
					composed: !0,
					detail: {
						token: t,
						value: e,
						error: n
					}
				}));
			}), this.dispatchEvent(new CustomEvent("tp-color-picker-select", {
				bubbles: !0,
				composed: !0,
				detail: {
					token: t,
					value: e
				}
			}));
		};
		e.addEventListener("click", n), e.addEventListener("keydown", (e) => {
			e.key !== "Enter" && e.key !== " " || (e.preventDefault(), n());
		});
	}
	updateClassScaleContrast() {
		this.applyBestContrastToMode("plain", ["black", "white"]), this.applyBestContrastToMode("best-contrast", ["black", "white"]), this.applyBestContrastToMode("tone-contrast", ["black", "white"]);
	}
	applyBestContrastToMode(e, t) {
		let n = this.querySelectorAll(`[data-tp-color-picker-class-swatch][data-mode="${e}"]`);
		for (let e of n) {
			let n = e.querySelector("[data-tp-color-picker-class-chip]"), r = e.querySelector("[data-tp-color-picker-class-chip-text]");
			if (!n || !r) continue;
			let i = this.parseCssColor(globalThis.getComputedStyle(n).backgroundColor);
			if (!i) continue;
			let a = t.map((e) => ({
				expression: e,
				resolvedColor: this.resolveColorExpression(n, e)
			})).map((e) => ({
				expression: e.expression,
				resolvedColor: e.resolvedColor,
				parsed: this.parseCssColor(e.resolvedColor)
			})).filter((e) => !!(e.expression && e.resolvedColor && e.parsed));
			if (a.length === 0) continue;
			let [o, ...s] = a;
			if (o === void 0) continue;
			let c = o, l = this.getContrastRatio(i, c.parsed);
			for (let e of s) {
				let t = this.getContrastRatio(i, e.parsed);
				t > l && (c = e, l = t);
			}
			r.style.color = c.expression;
		}
	}
	resolveColorExpression(e, t) {
		let n = e.style.color;
		e.style.color = t;
		let r = globalThis.getComputedStyle(e).color;
		return e.style.color = n, r.trim();
	}
	getContrastRatio(e, t) {
		let n = this.getRelativeLuminance(e), r = this.getRelativeLuminance(t), i = Math.max(n, r), a = Math.min(n, r);
		return (i + .05) / (a + .05);
	}
	getRelativeLuminance(e) {
		let t = e[0] <= .04045 ? e[0] / 12.92 : ((e[0] + .055) / 1.055) ** 2.4, n = e[1] <= .04045 ? e[1] / 12.92 : ((e[1] + .055) / 1.055) ** 2.4, r = e[2] <= .04045 ? e[2] / 12.92 : ((e[2] + .055) / 1.055) ** 2.4;
		return .2126 * t + .7152 * n + .0722 * r;
	}
	parseCssColor(e) {
		let t = e.trim().toLowerCase();
		if (!t) return null;
		if (t === "white") return [
			1,
			1,
			1
		];
		if (t === "black") return [
			0,
			0,
			0
		];
		if (t.startsWith("#")) {
			let e = t.slice(1);
			if (e.length === 3 || e.length === 4) {
				let [t, n, r] = e;
				return t === void 0 || n === void 0 || r === void 0 ? null : [
					Number.parseInt(t + t, 16) / 255,
					Number.parseInt(n + n, 16) / 255,
					Number.parseInt(r + r, 16) / 255
				];
			}
			return e.length === 6 || e.length === 8 ? [
				Number.parseInt(e.slice(0, 2), 16) / 255,
				Number.parseInt(e.slice(2, 4), 16) / 255,
				Number.parseInt(e.slice(4, 6), 16) / 255
			] : null;
		}
		let n = this.parseOklabOrOklchColor(t);
		if (n) return n;
		let r = t.match(/^rgba?\((.+)\)$/);
		if (r) {
			let [, e] = r;
			if (e === void 0) return null;
			let t = e.replaceAll("/", " ").replaceAll(",", " ").split(/\s+/).filter(Boolean).slice(0, 3).map((e) => this.parseRgbChannel(e));
			if (t.length < 3 || t.some((e) => e === null)) return null;
			let [n, i, a] = t;
			return n === void 0 || i === void 0 || a === void 0 || n === null || i === null || a === null ? null : [
				n,
				i,
				a
			];
		}
		let i = t.match(/^color\(srgb\s+(.+)\)$/);
		if (i) {
			let [, e] = i;
			if (e === void 0) return null;
			let t = e.replaceAll("/", " ").split(/\s+/).filter(Boolean).slice(0, 3).map((e) => this.parseUnitIntervalChannel(e));
			if (t.length < 3 || t.some((e) => e === null)) return null;
			let [n, r, a] = t;
			return n === void 0 || r === void 0 || a === void 0 || n === null || r === null || a === null ? null : [
				n,
				r,
				a
			];
		}
		let a = t.match(/[\d.]+/g)?.slice(0, 3).map(Number);
		if (!a || a.length < 3 || a.some((e) => Number.isNaN(e))) return null;
		let [o, s, c] = a;
		return o === void 0 || s === void 0 || c === void 0 ? null : [
			o / 255,
			s / 255,
			c / 255
		];
	}
	parseOklabOrOklchColor(e) {
		let t = e.match(/^oklab\((.+)\)$/);
		if (t) {
			let [, e] = t;
			if (e === void 0) return null;
			let n = e.replaceAll("/", " ").split(/\s+/).filter(Boolean).slice(0, 3);
			if (n.length < 3) return null;
			let [r, i, a] = n;
			if (r === void 0 || i === void 0 || a === void 0) return null;
			let o = this.parseOklabLightness(r), s = this.parseOklabAxis(i), c = this.parseOklabAxis(a);
			return o === null || s === null || c === null ? null : this.oklabToSrgb(o, s, c);
		}
		let n = e.match(/^oklch\((.+)\)$/);
		if (n) {
			let [, e] = n;
			if (e === void 0) return null;
			let t = e.replaceAll("/", " ").split(/\s+/).filter(Boolean).slice(0, 3);
			if (t.length < 3) return null;
			let [r, i, a] = t;
			if (r === void 0 || i === void 0 || a === void 0) return null;
			let o = this.parseOklabLightness(r), s = this.parseOklabAxis(i), c = this.parseHueDegrees(a);
			if (o === null || s === null || c === null) return null;
			let l = c * Math.PI / 180;
			return this.oklabToSrgb(o, s * Math.cos(l), s * Math.sin(l));
		}
		return null;
	}
	parseOklabLightness(e) {
		let t = e.trim();
		if (!t) return null;
		let n = Number.parseFloat(t);
		return Number.isNaN(n) ? null : t.endsWith("%") ? this.clampUnit(n / 100) : this.clampUnit(n);
	}
	parseOklabAxis(e) {
		let t = e.trim();
		if (!t) return null;
		let n = Number.parseFloat(t);
		return Number.isNaN(n) ? null : t.endsWith("%") ? n / 100 : n;
	}
	parseHueDegrees(e) {
		let t = e.trim();
		if (!t) return null;
		let n = Number.parseFloat(t);
		return Number.isNaN(n) ? null : t.endsWith("deg") ? n : t.endsWith("grad") ? n * .9 : t.endsWith("rad") ? n * 180 / Math.PI : t.endsWith("turn") ? n * 360 : n;
	}
	oklabToSrgb(e, t, n) {
		let r = e + .3963377774 * t + .2158037573 * n, i = e - .1055613458 * t - .0638541728 * n, a = e - .0894841775 * t - 1.291485548 * n, o = r ** 3, s = i ** 3, c = a ** 3, l = 4.0767416621 * o - 3.3077115913 * s + .2309699292 * c, u = -1.2684380046 * o + 2.6097574011 * s - .3413193965 * c, d = -.0041960863 * o - .7034186147 * s + 1.707614701 * c;
		return [
			this.linearToSrgb(l),
			this.linearToSrgb(u),
			this.linearToSrgb(d)
		];
	}
	linearToSrgb(e) {
		return e <= .0031308 ? this.clampUnit(12.92 * e) : this.clampUnit(1.055 * e ** (1 / 2.4) - .055);
	}
	parseRgbChannel(e) {
		let t = e.trim();
		if (!t) return null;
		let n = Number.parseFloat(t);
		return Number.isNaN(n) ? null : t.endsWith("%") ? this.clampUnit(n / 100) : this.clampUnit(n / 255);
	}
	parseUnitIntervalChannel(e) {
		let t = e.trim();
		if (!t) return null;
		let n = Number.parseFloat(t);
		return Number.isNaN(n) ? null : t.endsWith("%") ? this.clampUnit(n / 100) : this.clampUnit(n);
	}
	clampUnit(e) {
		return e < 0 ? 0 : e > 1 ? 1 : e;
	}
	getTokenValue(e) {
		return globalThis.getComputedStyle(this).getPropertyValue(e).trim();
	}
};
customElements.get("tp-color-picker") || customElements.define("tp-color-picker", u);
//#endregion
export { u as t };

