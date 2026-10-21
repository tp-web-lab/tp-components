import { t as e } from "./base.js";
import "./icon-button.js";
import "./button.js";
import "./numberfield.js";
import "./code-editor.js";
import "./badge.js";
import { chooseSaveTarget as t, saveBlob as n } from "../utilities/save-file.js";
import { choosePlaygroundFile as r } from "../components/playground/playground-local-file.js";
import { TpDeclarativeTextSource as i } from "../utilities/declarative-text-source.js";
import "./radio-list.js";
import "../components/graph-geometry/geometry-actions.js";
import { parseProfiles as a } from "../components/slope-simulator/profiles.js";
import { advance as o, profiles as s, sample as c } from "../components/slope-simulator/motion.js";
//#region src/components/slope-simulator/slope-simulator.css?inline
var l = "tp-slope-simulator{box-sizing:border-box;width:auto;min-inline-size:0;max-inline-size:100%;margin-block:0;margin-inline:auto;display:flow-root}tp-slope-simulator .tp-slope-ui{box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft,#cdd9dc);background:var(--tp-paper-color,Canvas);min-inline-size:0;color:var(--tp-text-body,CanvasText);border-radius:12px;gap:2rem;padding:.5rem;display:grid}tp-slope-simulator section{min-width:0}tp-slope-simulator h3{margin:0 0 1rem}tp-slope-simulator p{font-size:.9em}tp-slope-simulator .tp-slope-board{width:100%;position:relative}tp-slope-simulator svg{width:100%;height:auto;display:block;overflow:visible}tp-slope-simulator .tp-slope-route{fill:none;stroke:var(--tp-brand-text-colorful,#246c94);stroke-width:4px;vector-effect:non-scaling-stroke}tp-slope-simulator .tp-slope-area{fill:var(--tp-brand-text-colorful,#246c94);opacity:.09}.tp-slope-point{box-sizing:border-box;vertical-align:middle;border:3px solid var(--tp-paper-color,white);background:var(--tp-brand-text-colorful,#246c94);border-radius:50%;width:28px;min-width:0;height:28px;min-height:0;padding:0;display:inline-block;box-shadow:0 0 0 1px}tp-slope-simulator .tp-slope-point{cursor:grab;touch-action:none;position:absolute;transform:translate(-50%,-50%)}tp-slope-simulator .tp-slope-point:after{content:\"\";position:absolute;inset:-8px}tp-slope-simulator .tp-slope-point:active{cursor:grabbing}tp-slope-simulator .tp-slope-point:focus-visible{outline-offset:5px;outline:3px solid}tp-slope-simulator .tp-slope-footer{font-variant-numeric:tabular-nums;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.75rem;display:flex}tp-slope-simulator .tp-slope-grade{font-variant-numeric:tabular-nums;justify-content:center;margin-block:.5rem;display:flex}tp-slope-simulator .tp-slope-editor-actions{justify-content:flex-end;align-items:center;gap:.5rem;margin-block:1rem .5rem;display:flex}tp-slope-simulator .tp-slope-editor-details{min-inline-size:0;margin-block-start:1rem}tp-slope-simulator .tp-slope-editor-details>summary{cursor:pointer;font-weight:600}tp-slope-simulator tp-code-editor{min-inline-size:0;display:block}tp-slope-simulator .tp-slope-file-menu{margin-inline-end:auto}tp-slope-simulator .tp-slope-stage-heading{justify-content:space-between;align-items:center;gap:.5rem;display:flex}tp-slope-simulator .tp-slope-stage-heading h3{margin:0}tp-slope-simulator .tp-slope-grid{pointer-events:none}tp-slope-simulator .tp-slope-grid path{fill:none;stroke:currentColor;opacity:.18;vector-effect:non-scaling-stroke}tp-slope-simulator .tp-slope-grid .tp-slope-axes{opacity:.6}tp-slope-simulator .tp-slope-grid text{fill:currentColor;font-variant-numeric:tabular-nums;font-size:18px}", u = class u extends e {
	ui;
	source = new i(this, {
		scriptTypes: ["tp/slope-simulator"],
		ignoreSelector: ".tp-slope-ui"
	});
	available = this.defaults();
	originals = [];
	drafts = [];
	static nextFileId = 0;
	fileId = `tp-slope-files-${u.nextFileId++}`;
	fileBusy = !1;
	fileRequest;
	saveTargets = /* @__PURE__ */ new Map();
	token = 0;
	abort;
	programmatic = !1;
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"src",
			"speed-base"
		];
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		this.setAttribute("src", e);
	}
	get speedBase() {
		let e = Number(this.getAttribute("speed-base"));
		return Number.isFinite(e) && e > 0 ? e : this.available[this.profile]?.speedBase ?? 30;
	}
	set speedBase(e) {
		this.setAttribute("speed-base", String(e));
	}
	attributeChangedCallback(e, t, n) {
		e === "speed-base" && t !== n && (this.update(0), this.update(1)), e === "src" && t !== n && this.isConnected && this.ui && (this.programmatic = !1, this.watchSource());
	}
	setProfiles(e) {
		try {
			let t = a(e);
			return this.stopLoading(), this.source.disconnect(), this.programmatic = !0, this.applyProfiles(t), !0;
		} catch (e) {
			return this.reportError(e), !1;
		}
	}
	defaults() {
		return a({ profiles: s.map((e, t) => ({
			id: `default-${t + 1}`,
			name: e.name,
			points: e.points.map(([e, t]) => [Number((e * 100).toFixed(8)), Number((t * 1e5).toFixed(8))])
		})) });
	}
	stopLoading() {
		this.token++, this.abort?.abort(), this.fileRequest?.abort();
	}
	watchSource() {
		this.source.disconnect(), this.source.observe(() => {
			this.reloadProfiles();
		}), this.reloadProfiles();
	}
	async reloadProfiles() {
		this.stopLoading();
		let e = this.token;
		this.abort = new AbortController();
		try {
			let t = await this.source.read({ signal: this.abort.signal });
			if (e !== this.token) return;
			this.applyProfiles(this.src.trim() || t.trim() ? a(t) : this.defaults());
		} catch (t) {
			e === this.token && this.reportError(t);
		}
	}
	applyProfiles(e) {
		this.finish(), this.available = e, this.originals = [...e], this.saveTargets.clear(), this.drafts = e.map((e) => this.profileCode(e)), this.profile = 0, this.positions[1] = .1, this.directions[1] = 1, this.refreshChoices(), this.syncEditor();
		let t = this.ui?.querySelector("[data-source-error]");
		t && (t.textContent = "", t.hidden = !0), this.update(0), this.update(1);
	}
	refreshChoices() {
		let e = this.ui?.querySelector("[data-profile-choices]");
		if (e) {
			let t = document.createElement("tp-radio-list");
			t.setAttribute("label", "Stage profile"), t.setAttribute("orientation", "horizontal"), t.setAttribute("value", String(this.profile + 1));
			let n = document.createElement("ul");
			for (let e of this.available) {
				let t = document.createElement("li");
				t.textContent = e.name, n.append(t);
			}
			if (t.append(n), this.available.length === 1) {
				let t = document.createElement("p");
				t.textContent = `Stage profile: ${this.available[0]?.name}`, e.replaceChildren(t);
			} else e.replaceChildren(t);
		}
	}
	profileCode(e) {
		let t = e.source;
		return `{
${e.speedBase === void 0 ? "" : `  "speed-base": ${e.speedBase},\n`}  "profiles": [{
    "id": ${JSON.stringify(t.id)},
    "name": ${JSON.stringify(t.name)},
    "points": [
${t.points.map((e) => `      ${JSON.stringify(e)}`).join(",\n")}
    ]
  }]
}`;
	}
	syncEditor() {
		let e = this.ui?.querySelector("tp-code-editor");
		e && e.setValue(this.drafts[this.profile] ?? "");
	}
	editProfile(e) {
		let t = this.ui?.querySelector("tp-code-editor");
		if (t) try {
			let n;
			if (e) n = this.originals[this.profile];
			else {
				let e = t.getValue();
				this.drafts[this.profile] = e;
				let r = a(e);
				if (r.length > 1) {
					this.stopLoading(), this.source.disconnect(), this.programmatic = !0, this.applyProfiles(r);
					return;
				}
				n = r[0];
			}
			if (!n) return;
			if (this.available.some((e, t) => t !== this.profile && e.id === n?.id)) throw Error(`Duplicate profile id: ${n.id}.`);
			this.stopLoading(), this.source.disconnect(), this.programmatic = !0, this.finish(), this.available[this.profile] = n, this.drafts[this.profile] = this.profileCode(n), this.positions[1] = .1, this.directions[1] = 1, this.refreshChoices(), this.syncEditor(), this.update(0), this.update(1);
			let r = this.ui?.querySelector("[data-source-error]");
			r && (r.textContent = "", r.hidden = !0);
		} catch (e) {
			this.reportError(e);
		}
	}
	async profileFileAction(e) {
		if (this.fileBusy) return;
		let i = this.ui?.querySelector("tp-code-editor");
		if (!i) return;
		this.fileBusy = !0, this.syncFileButtons();
		let a = this.token, o = this.profile, s = i.getValue();
		try {
			if (e === "load") {
				let e = new AbortController();
				this.fileRequest = e;
				let t = await r(this, ".json,application/json", e.signal);
				if (!t) return;
				let n = await t.text();
				if (e.signal.aborted || !this.isConnected || a !== this.token || o !== this.profile || s !== i.getValue()) return;
				this.setProfiles(n);
			} else {
				let r = (this.available[o]?.id ?? "profile").replace(/[^a-zA-Z0-9_-]/g, "-") || "profile", i = e === "save" && this.saveTargets.get(o) || await t({
					suggestedName: `${r}.json`,
					description: "Cycling profile",
					mimeType: "application/json",
					extension: ".json"
				});
				if (!i || !this.isConnected || a !== this.token || o !== this.profile) return;
				await n(new Blob([s], { type: "application/json;charset=utf-8" }), i), a === this.token && this.saveTargets.set(o, i);
			}
		} catch (e) {
			this.isConnected && a === this.token && this.reportError(e);
		} finally {
			this.fileBusy = !1, this.syncFileButtons();
		}
	}
	syncFileButtons() {
		for (let e of this.ui?.querySelectorAll("[data-profile-file]") ?? []) e.toggleAttribute("disabled", this.fileBusy), e.setAttribute("aria-disabled", String(this.fileBusy));
	}
	reportError(e) {
		let t = e instanceof Error ? e.message : String(e), n = this.ui?.querySelector("[data-source-error]");
		n && (n.textContent = t, n.hidden = !1), this.dispatchEvent(new CustomEvent("tp-slope-simulator-error", {
			bubbles: !0,
			detail: { message: t }
		}));
	}
	moving = [!1, !1];
	idleTimers = [];
	gridVisible = !1;
	slope = 0;
	profile = 0;
	positions = [.1, .1];
	directions = [1, 1];
	drag;
	connectedCallback() {
		if (super.connectedCallback(), this.ensureGlobalStyle("tp-slope-simulator-style", l), this.source.capture(), this.ui) {
			this.programmatic || this.watchSource();
			return;
		}
		this.ui = document.createElement("div"), this.ui.className = "tp-slope-ui", this.ui.innerHTML = `<section><h3>Constant slope</h3>
   <tp-numberfield label="Slope (%)" min="-20" max="20" step="1" value="0" range clearable></tp-numberfield>
   <p>Drag the point horizontally, or focus it and press ← / →. Uphill takes more effort; downhill takes less. Release and grab again to continue.</p>
   ${this.board(0, "Point on constant slope")}</section>
   <section><div class="tp-slope-stage-heading"><h3>Cycling stage</h3><tp-icon-button library="geometry" name="grid" label="Grid" title="Show or hide distance and elevation grid" aria-pressed="false" data-profile-grid></tp-icon-button></div>
   <div data-profile-choices></div>
   <p data-elevation-note></p>
   ${this.board(1, "Point on cycling stage")}
   <p role="alert" data-source-error hidden></p>
   <details class="tp-slope-editor-details">
   <summary>Profile code</summary>
   <p>Point: [distance in km, height in m], −20% ≤ slope ≤ +20%.</p>
   <div class="tp-slope-editor-actions"><div class="tp-slope-file-menu"><tp-icon-button id="${this.fileId}" name="file-outline" label="Profile files (.json)" aria-haspopup="menu" data-profile-files></tp-icon-button><tp-dropdown anchor="#${this.fileId}" outside-click data-profile-menu><ul><li data-profile-file="load">Load (.json)</li><li data-profile-file="save">Save (.json)</li><li data-profile-file="save-as">Save as (.json)</li></ul></tp-dropdown></div><tp-icon-button library="tp" name="keyboard-f1" label="F1 — Toggle editor toolbar" title="Toggle editor toolbar (F1)" data-profile-toolbar></tp-icon-button><tp-icon-button name="refresh" label="Restore original profile" data-profile-reset></tp-icon-button><tp-icon-button name="play" label="Apply profile" data-profile-play></tp-icon-button></div>
   <tp-code-editor language="json" line-numbers word-wrap aria-label="Cycling stage profile JSON"></tp-code-editor>
   </details>
   </section>`, this.append(this.ui), this.ui.addEventListener("input", (e) => {
			let t = e.target.closest("tp-numberfield");
			t && (this.stopSpeed(0), this.slope = Number(t.value) || 0, this.update(0));
		}), this.ui.addEventListener("tp-radio-list-change", () => {
			this.drafts[this.profile] = this.ui?.querySelector("tp-code-editor")?.getValue() ?? "", this.finish(), this.profile = Number(this.ui?.querySelector("tp-radio-list")?.value ?? 1) - 1, this.positions[1] = .1, this.directions[1] = 1, this.update(0), this.update(1), this.syncEditor();
		}), this.ui.addEventListener("click", (e) => {
			let t = e.target;
			if (t.closest("[data-profile-grid]")) {
				this.gridVisible = !this.gridVisible, this.update(0), this.update(1);
				return;
			}
			if (t.closest("[data-profile-files]")) {
				this.ui?.querySelector("tp-dropdown")?.toggle();
				return;
			}
			if (t.closest("[data-profile-toolbar]")) {
				let e = this.ui?.querySelector("tp-code-editor");
				e && (e.toolbar = !e.toolbar);
				return;
			}
			if (t.closest("[data-profile-play]")) {
				this.editProfile(!1);
				return;
			}
			if (t.closest("[data-profile-reset]")) {
				this.editProfile(!0);
				return;
			}
			let n = e.target.closest("[data-reset]");
			if (!n) return;
			this.finish();
			let r = Number(n.dataset.reset);
			this.positions[r] = .1, this.directions[r] = 1, this.update(r);
		});
		for (let e of this.ui.querySelectorAll("[data-profile-file]")) {
			let t = () => {
				e.getAttribute("aria-disabled") !== "true" && this.profileFileAction(e.dataset.profileFile);
			};
			e.addEventListener("click", t), e.addEventListener("keydown", (e) => {
				(e.key === "Enter" || e.key === " ") && (e.preventDefault(), t());
			});
		}
		this.ui.addEventListener("keydown", this.key), this.ui.addEventListener("keyup", (e) => {
			if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
			let t = e.target.closest("[data-track]");
			t && this.stopSpeed(Number(t.dataset.track));
		}), this.ui.addEventListener("focusout", (e) => {
			let t = e.target.closest("[data-track]");
			t && this.stopSpeed(Number(t.dataset.track));
		}), this.ui.addEventListener("pointerdown", this.down), this.ui.addEventListener("pointermove", this.move), this.ui.addEventListener("pointerup", this.end), this.ui.addEventListener("pointercancel", this.end), this.ui.addEventListener("lostpointercapture", this.end), this.update(0), this.applyProfiles(this.available), this.programmatic || this.watchSource();
	}
	disconnectedCallback() {
		this.stopLoading(), this.source.disconnect(), this.finish();
	}
	board(e, t) {
		return `<p class="tp-slope-speed-note" data-speed-note="${e}"></p>
   <div class="tp-slope-grade"><tp-badge size="xxl" variant="brand" data-grade="${e}"></tp-badge></div>
   <div class="tp-slope-board" data-board="${e}"><svg viewBox="0 0 1000 300" aria-hidden="true"><g class="tp-slope-grid"/><path class="tp-slope-area"/><path class="tp-slope-route"/></svg>
   <button type="button" class="tp-slope-point" data-track="${e}" role="slider" aria-label="${t}" aria-valuemin="0" aria-valuemax="100" aria-orientation="horizontal"></button></div>
   <div class="tp-slope-footer"><span data-status="${e}"></span><tp-button data-reset="${e}">Restart</tp-button></div>`;
	}
	terrain(e) {
		return e === 0 ? [[0, -this.slope / 200], [1, this.slope / 200]] : (this.available[this.profile] ?? this.available[0])?.points ?? [[0, 0], [1, 0]];
	}
	update(e) {
		let t = this.ui?.querySelector(`[data-board="${e}"]`);
		if (!t) return;
		let n = this.ui?.querySelector(`[data-speed-note="${e}"]`);
		n && (n.textContent = `Fictional speed calculated at constant effort, based on ${this.speedBase} km/h on flat ground (0% slope).`);
		let r = e === 1 && this.gridVisible;
		t.querySelector("svg")?.setAttribute("viewBox", r ? "-65 -10 1080 350" : "0 0 1000 300");
		let i = this.terrain(e), a = this.positions[e] ?? .1, o = this.directions[e] ?? 1, s = c(i, a, o), l = i.reduce((e, t) => Math.max(e, t[1]), 0), u = l > 0 ? 230 / l : 1912, d = (t) => e === 0 ? 150 - t * 956 : 260 - t * u;
		if (e === 1) {
			let e = this.ui?.querySelector("[data-elevation-note]");
			e && (e.textContent = `Elevation display scale ×${(u / 956).toFixed(2)}. Effort uses the actual slope (maximum ±20%).`);
		}
		if (e === 1) {
			this.ui?.querySelector("[data-profile-grid]")?.setAttribute("aria-pressed", String(this.gridVisible));
			let e = t.querySelector(".tp-slope-grid");
			e && (e.innerHTML = r ? this.renderGrid() : "");
		}
		let f = i.map(([e, t], n) => `${n ? "L" : "M"}${22 + e * 956},${d(t)}`).join(" ");
		t.querySelector(".tp-slope-route")?.setAttribute("d", f), t.querySelector(".tp-slope-area")?.setAttribute("d", `${f} L978,290 L22,290 Z`);
		let p = t.querySelector(".tp-slope-point"), m = Math.round(s.grade * o * 10) / 10, h = `${m > 0 ? "+" : m < 0 ? "−" : ""}${Math.abs(m).toFixed(1)}`, g = this.ui?.querySelector(`[data-grade="${e}"]`), _ = this.moving[e] ? this.speedBase / 4 ** (s.grade * o / 20) : 0;
		g && (g.textContent = `${h} % — ${_.toFixed(1)} km/h`);
		let v = `${(a * 100).toFixed(1)}% of route · ${h}% slope ${o > 0 ? "→" : "←"} · ${m > 0 ? "Uphill" : m < 0 ? "Downhill" : "Flat"}`;
		p && (p.style.left = `${(22 + a * 956 + (r ? 65 : 0)) / (r ? 1080 : 1e3) * 100}%`, p.style.top = `${(d(s.altitude) + (r ? 10 : 0)) / (r ? 350 : 300) * 100}%`, p.setAttribute("aria-valuenow", (a * 100).toFixed(1)), p.setAttribute("aria-valuetext", v));
		let y = this.ui?.querySelector(`[data-status="${e}"]`);
		y && (y.textContent = v);
	}
	renderGrid() {
		let e = this.available[this.profile]?.source.points, t = e?.[0], n = e?.at(-1);
		if (!e || !t || !n) return "";
		let r = Math.min(...e.map((e) => e[1])), i = Math.max(...e.map((e) => e[1])), a = i > r ? i : r + 100, o = (e, t, n) => {
			let r = (t - e) / n, i = 10 ** Math.floor(Math.log10(r)), a = (r / i <= 1 ? 1 : r / i <= 2 ? 2 : r / i <= 5 ? 5 : 10) * i, o = [];
			for (let n = Math.ceil(e / a); n <= Math.floor(t / a); n++) o.push(Number((n * a).toPrecision(12)));
			return o;
		}, s = (e) => 22 + (e - t[0]) / (n[0] - t[0]) * 956, c = (e) => 260 - (e - r) / (a - r) * 230;
		return `<path class="tp-slope-axes" d="M22,30 V260 H978"/>
			<text x="22" y="12">Height (m)</text><text x="978" y="322" text-anchor="end">Distance (km)</text>
			${o(t[0], n[0], 6).map((e) => `<path d="M${s(e)},30 V260"/><text x="${s(e)}" y="285" text-anchor="middle">${e}</text>`).join("")}
			${o(r, a, 4).map((e) => `<path d="M22,${c(e)} H978"/><text x="12" y="${c(e)}" text-anchor="end" dominant-baseline="middle">${e}</text>`).join("")}`;
	}
	stopSpeed(e) {
		clearTimeout(this.idleTimers[e]), this.idleTimers[e] = void 0, this.moving[e] = !1, this.update(e);
	}
	travel(e, t) {
		if (!t) return;
		let n = this.positions[e] ?? .1;
		this.directions[e] = Math.sign(t), this.positions[e] = o(this.terrain(e), this.positions[e] ?? .1, t), this.moving[e] = this.positions[e] !== n, clearTimeout(this.idleTimers[e]), this.idleTimers[e] = setTimeout(() => this.stopSpeed(e), 600), this.update(e);
	}
	key = (e) => {
		if (e.key === "Escape") {
			this.finish();
			return;
		}
		let t = e.target.closest("[data-track]");
		!t || !["ArrowLeft", "ArrowRight"].includes(e.key) || e.ctrlKey || e.metaKey || e.altKey || (e.preventDefault(), this.travel(Number(t.dataset.track), e.key === "ArrowRight" ? .01 : -.01));
	};
	down = (e) => {
		let t = e.target.closest("[data-track]");
		!t || e.button !== 0 || this.drag || (e.preventDefault(), t.focus(), t.setPointerCapture(e.pointerId), this.drag = {
			id: e.pointerId,
			x: e.clientX,
			track: Number(t.dataset.track),
			target: t
		});
	};
	move = (e) => {
		let t = this.drag;
		if (!t || t.id !== e.pointerId) return;
		let n = t.target.parentElement?.getBoundingClientRect().width ?? 0;
		n > 0 && this.travel(t.track, (e.clientX - t.x) / (n * (956 / (t.track === 1 && this.gridVisible ? 1080 : 1e3)))), t.x = e.clientX;
	};
	end = (e) => {
		this.drag?.id === e.pointerId && this.finish();
	};
	finish() {
		this.stopSpeed(0), this.stopSpeed(1);
		let e = this.drag;
		this.drag = void 0, e?.target.hasPointerCapture(e.id) && e.target.releasePointerCapture(e.id);
	}
};
customElements.get("tp-slope-simulator") || customElements.define("tp-slope-simulator", u);
//#endregion
export { u as t };

//# sourceMappingURL=slope-simulator.js.map