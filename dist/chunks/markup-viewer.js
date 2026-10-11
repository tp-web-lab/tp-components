import { t as e } from "./base.js";
import "./icon-button.js";
import "./icon.js";
import { resolveComponentSourceUrl as t } from "../utilities/source-url.js";
import "./divider.js";
import "./code-editor.js";
import { IframeOverlayBridge as n } from "../utilities/iframe-overlay-bridge.js";
import "./switcher.js";
import { shareViewerExample as r, sharedViewerExample as i } from "../components/markup-viewer/shared-example.js";
//#region src/components/markup-viewer/markup-viewer.css?inline
var a = ".tp-markup-viewer{border:1px solid var(--tp-neutral-stroke-soft,#d0d7de);background:var(--tp-paper-color,#fff);border-radius:.5rem;margin-block:1rem;display:block;overflow:hidden}.tp-markup-viewer[lite]{margin-block:0}.tp-markup-viewer[lite] .tp-markup-viewer-start,.tp-markup-viewer[lite] .tp-markup-viewer-end{border-radius:0}.tp-markup-viewer[lite][data-layout=both] .tp-markup-viewer-end{border-block-start:1px solid var(--tp-neutral-stroke-soft,#d0d7de)}.tp-markup-viewer-toolbar,.tp-markup-viewer-lite-toolbar{box-sizing:border-box;border:0;border-block-end:1px solid var(--tp-neutral-stroke-soft,#d0d7de);background:var(--tp-paper-color,#fff);border-radius:.5rem .5rem 0 0;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:.25rem;inline-size:100%;min-inline-size:0;max-inline-size:100%;margin-block-end:0;margin-inline:0;padding:.25rem;display:grid}.tp-markup-viewer-toolbar-start,.tp-markup-viewer-toolbar-end{align-items:center;gap:.25rem;min-inline-size:0;display:flex}.tp-markup-viewer-toolbar-start{grid-column:1;justify-content:flex-start}.tp-markup-viewer-toolbar-end{grid-column:3;justify-content:flex-end}.tp-markup-viewer-editor-actions,.tp-markup-viewer-output-actions{align-items:center;gap:.25rem;display:flex}.tp-markup-viewer-output-actions[hidden]{display:none}.tp-markup-viewer-output-actions tp-divider{block-size:1.5rem;margin-inline:.25rem}.tp-markup-viewer-editor-actions[hidden]{display:none}.tp-markup-viewer-language{color:var(--tp-text-muted,#374151);white-space:nowrap;margin-inline-end:.25rem;font-weight:600}.tp-markup-viewer-toolbar tp-icon-button[aria-pressed=true],.tp-markup-viewer-lite-toolbar tp-icon-button[aria-pressed=true]{color:var(--tp-brand-text-colorful,#2563eb)}.tp-markup-viewer-toolbar tp-icon-button[aria-pressed=true]>button,.tp-markup-viewer-lite-toolbar tp-icon-button[aria-pressed=true]>button{background:var(--tp-brand-fill-softer,#eff6ff);border-radius:.375rem}.tp-markup-viewer-layout{align-items:start}.tp-markup-viewer-toolbar label,.tp-markup-viewer-start-controls label{gap:.15rem;margin:0;display:grid}.tp-markup-viewer-toolbar select,.tp-markup-viewer-start-controls select{box-sizing:border-box;width:100%;height:2.25rem}.tp-markup-viewer-start,.tp-markup-viewer-end{border:1px solid var(--tp-neutral-stroke-soft,#d0d7de);background:var(--tp-paper-color,#fff);border-radius:.75rem;align-content:start;align-self:start;gap:.5rem;min-inline-size:0;max-inline-size:100%;padding:.5rem;display:grid;overflow:hidden}.tp-markup-viewer .tp-markup-viewer-start,.tp-markup-viewer .tp-markup-viewer-end{background:0 0;border:0;border-radius:0;padding:0;overflow:visible}.tp-markup-viewer[data-layout=both] .tp-markup-viewer-end{border-block-start:1px solid var(--tp-neutral-stroke-soft,#d0d7de)}.tp-markup-viewer .tp-markup-viewer-end{padding:6px}.tp-markup-viewer tp-code-editor{border:0;margin-inline:0}.tp-markup-viewer-start-controls:empty{display:none}.tp-markup-viewer-start-controls{grid-column:2;justify-self:center;min-inline-size:0}.tp-markup-viewer-source-toolbar{justify-content:flex-end;align-items:center;gap:.5rem;display:flex}.tp-markup-viewer-source-toolbar tp-icon-button{color:var(--tp-text-muted,#374151)}.tp-markup-viewer-output{min-block-size:0;inline-size:100%;display:block}.tp-markup-viewer-output>iframe{box-sizing:border-box;inline-size:100%;min-height:var(--tp-markup-viewer-frame-min-height,var(--tp-html-viewer-frame-min-height,0));min-block-size:var(--tp-markup-viewer-frame-min-height,var(--tp-html-viewer-frame-min-height,0));border:0;display:block}.tp-markup-viewer[data-layout=source],.tp-markup-viewer[data-layout=output]{display:block}.tp-markup-viewer[data-layout=source] .tp-markup-viewer-end,.tp-markup-viewer[data-layout=output] .tp-markup-viewer-start{display:none}.tp-markup-viewer-error{max-inline-size:100%;overflow:auto}", o = "tp-markup-viewer-styles", s = /* @__PURE__ */ new WeakSet();
function c(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function l(e) {
	let t = e.trim().replace(/\/+$/, "");
	return t === "" ? "Example" : t.split("/").at(-1) ?? "Example";
}
function u(e) {
	switch (e.toLowerCase()) {
		case "html": return "HTML";
		case "markdown": return "Markdown";
		case "asciidoc": return "AsciiDoc";
		case "restructuredtext": return "reStructuredText";
		default: return e;
	}
}
function d(e) {
	e.syncHeightToContent(), queueMicrotask(() => e.syncHeightToContent()), requestAnimationFrame(() => e.syncHeightToContent()), setTimeout(() => e.syncHeightToContent(), 0);
}
function f(e) {
	let t = e.contentDocument;
	if (t === null || t.body === null || t.documentElement === null) return 0;
	let n = Array.from(t.body.querySelectorAll("*")).reduce((e, n) => {
		let r = n.getBoundingClientRect(), i = t.defaultView?.getComputedStyle(n);
		if (i?.display === "none" || i?.position === "absolute" || i?.position === "fixed") return e;
		let a = i === void 0 ? 0 : Number.parseFloat(i.marginBottom) || 0, o = r.top, s = r.bottom + a;
		for (let r = n.parentElement; r && r !== t.body && r !== t.documentElement; r = r.parentElement) {
			if (r.localName === "details" && !r.hasAttribute("open") && !Array.from(r.children).find((e) => e.localName === "summary")?.contains(n)) return e;
			let i = t.defaultView?.getComputedStyle(r);
			if (i?.display === "none" || i?.position === "fixed" || i?.position === "absolute") return e;
			let a = i?.overflowY || i?.overflow;
			if (a && [
				"hidden",
				"clip",
				"auto",
				"scroll"
			].includes(a)) {
				let t = r.getBoundingClientRect();
				if (o = Math.max(o, t.top), s = Math.min(s, t.bottom), s <= o) return e;
			}
		}
		return Math.max(e, s);
	}, 0), r = t.defaultView?.getComputedStyle(t.body), i = (r === void 0 ? 0 : Number.parseFloat(r.paddingTop) || 0) + (r === void 0 ? 0 : Number.parseFloat(r.paddingBottom) || 0), a = n > 0 ? n + i : t.body.getBoundingClientRect().height + i;
	return Math.ceil(a);
}
function p(e) {
	if (e.hasAttribute("popover")) return;
	let t = f(e), n = t > 0 ? `${String(t)}px` : "";
	e.style.height !== n && (n === "" ? e.style.removeProperty("height") : e.style.height = n);
}
function m(e) {
	let t = () => {
		e.isConnected && p(e);
	};
	t(), queueMicrotask(t), requestAnimationFrame(t), setTimeout(t, 0), setTimeout(t, 100);
}
var h = class extends e {
	renderToken = 0;
	responseEditor = null;
	renderResponse = null;
	resetResponse = null;
	getValue() {
		return this.responseEditor?.getValue() ?? "";
	}
	reset() {
		this.resetResponse?.();
	}
	async createRenderedDocument() {
		if (!this.renderResponse) throw Error("Wait for the source to load.");
		return this.renderResponse();
	}
	iframeMutationObserver = null;
	iframeResizeObserver = null;
	iframeVisibilityObserver = null;
	iframeOverlayBridge = null;
	iframeSyncFrame = null;
	deferInitialRender = !1;
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"lite",
			"src"
		];
	}
	get lite() {
		return this.hasAttribute("lite");
	}
	set lite(e) {
		this.toggleAttribute("lite", e);
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		if (e.trim() === "") {
			this.removeAttribute("src");
			return;
		}
		this.setAttribute("src", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.classList.add("tp-markup-viewer", this.viewerClassName), this.ensureGlobalStyle(o, a), this.deferInitialRender ? setTimeout(() => this.requestViewerRender(), 0) : this.renderViewer();
	}
	attributeChangedCallback() {
		this.isConnected && this.renderViewer();
	}
	extractExamples(e) {
		return [e];
	}
	disposeViewer() {}
	resyncEditorHeight(e) {
		d(e);
	}
	getResetSource(e) {
		return e.source;
	}
	requestViewerRender() {
		this.isConnected && this.renderViewer();
	}
	disconnectedCallback() {
		this.renderToken += 1, this.disconnectIframeResizeObserver(), this.disposeViewer();
	}
	async renderViewer() {
		let e = ++this.renderToken;
		this.responseEditor = null, this.renderResponse = null, this.resetResponse = null;
		try {
			let t = await this.loadExamples();
			if (e !== this.renderToken) return;
			let n = this.lite ? t.slice(0, 1) : t, a = i(this, n.map((e) => e.label)), o = n.find((e) => e.label === a) ?? n[0] ?? await this.readInlineSource(), s = new Map(n.map((e) => [e.label, this.getResetSource(e)])), c = this.outputModes[0];
			if (c === void 0) throw Error("A markup viewer must define at least one output mode.");
			this.dataset.layout = "output", this.innerHTML = this.createViewerMarkup(c.value);
			let l = this.querySelector("[data-role=\"start-controls\"]"), u = this.querySelector("[data-role=\"source\"]"), f = this.querySelector("[data-role=\"output\"]"), p = this.querySelector("[data-role=\"toggle-source\"]"), m = this.querySelector("[data-role=\"toggle-output\"]"), h = this.querySelector("[data-role=\"output-actions\"]"), g = Array.from(this.querySelectorAll("[data-role=\"output-mode\"]")), _ = this.querySelector("[data-role=\"toggle-editor-toolbar\"]"), v = this.querySelector("[data-role=\"editor-actions\"]"), y = this.querySelector("[data-role=\"run\"]"), b = this.querySelector("[data-role=\"reset\"]");
			if (l === null || u === null || f === null || y === null || b === null || p === null || m === null) return;
			let x = c.value, S = document.createElement("tp-code-editor");
			S.language = this.sourceLanguage, S.lineNumbers = !1, S.wordWrap = !0, S.readonly = !1, S.setValue(o.source), this.responseEditor = S, this.renderResponse = async () => {
				let e = document.createElement("div");
				return await this.renderOutput(S.getValue(), c.value, e, o.context), e.querySelector("iframe")?.srcdoc ?? e.innerHTML;
			};
			let C = () => {
				if (this.dataset.layout === "output") {
					S.remove();
					return;
				}
				S.parentElement !== u && u.replaceChildren(S), d(S);
			}, w = () => {
				let e = p?.getAttribute("aria-pressed") === "true", t = m?.getAttribute("aria-pressed") !== "false";
				this.dataset.layout = e && t ? "both" : e ? "source" : "output", v?.toggleAttribute("hidden", !e), h?.toggleAttribute("hidden", !t), C(), queueMicrotask(D);
			}, T = async () => {
				this.disconnectIframeResizeObserver();
				let e = this.lite ? c.value : x;
				await this.renderOutput(o.source, e, f, o.context), this.activateOutputScripts(f), this.initializeOutputIframe(f), D();
			}, E = () => Array.from(this.querySelectorAll("tp-code-editor")).filter((e) => e === S ? this.dataset.layout !== "output" : this.dataset.layout !== "source"), D = () => {
				let e = E();
				_?.toggleAttribute("hidden", e.length === 0), _?.setAttribute("aria-pressed", String(e.some((e) => e.toolbar)));
			}, O = async () => {
				w(), await T();
			};
			if (n.length > 1) {
				let e = document.createElement("select");
				e.setAttribute("aria-label", "Example");
				for (let t of n) {
					let n = document.createElement("option");
					n.value = t.label, n.textContent = t.label, e.append(n);
				}
				e.value = o.label;
				let t = document.createElement("label");
				t.append(e), l.append(t), e.addEventListener("change", () => {
					let t = n.find((t) => t.label === e.value);
					t !== void 0 && (r(this, e), o = { ...t }, S.setValue(o.source), O());
				});
			}
			for (let e of g) e.addEventListener("click", () => {
				x = this.readMode(e.dataset.mode ?? "", c.value);
				for (let t of g) t.setAttribute("aria-pressed", String(t === e));
				T();
			});
			let k = (e, t) => {
				let n = e.getAttribute("aria-pressed") === "true";
				n && t.getAttribute("aria-pressed") !== "true" || (e.setAttribute("aria-pressed", String(!n)), w());
			};
			p !== null && m !== null && (p.addEventListener("click", () => k(p, m)), m.addEventListener("click", () => k(m, p))), _?.addEventListener("click", () => {
				let e = E(), t = !e.some((e) => e.toolbar);
				for (let n of e) n.toolbar = t;
				D();
			}), y.addEventListener("click", () => {
				o.source = S.getValue(), T();
			}), this.resetResponse = () => {
				o.source = s.get(o.label) ?? "", S.setValue(o.source), O();
			}, b.addEventListener("click", () => this.reset()), await O(), e === this.renderToken && this.dispatchEvent(new CustomEvent("tp-markup-viewer-src-load"));
		} catch (t) {
			if (e !== this.renderToken) return;
			let n = t instanceof Error ? t.message : String(t);
			this.innerHTML = `<pre class="tp-markup-viewer-error"><code>${c(n)}</code></pre>`;
		}
	}
	activateOutputScripts(e) {
		if (this.hasAttribute("allow-script")) for (let t of Array.from(e.querySelectorAll("script"))) {
			let e = document.createElement("script");
			for (let n of Array.from(t.attributes)) e.setAttribute(n.name, n.value);
			e.textContent = t.textContent, t.replaceWith(e);
		}
	}
	initializeOutputIframe(e) {
		let t = e.querySelector(":scope > iframe");
		if (!(t instanceof HTMLIFrameElement)) return;
		let r = t.srcdoc, i = !1, a = t.closest("[hidden]"), o = () => {
			if (i) return;
			let e = t.contentDocument;
			e !== null && (this.ensureBaseStyles(e), typeof e.addEventListener == "function" && !s.has(e) && (s.add(e), e.addEventListener("fullscreenchange", () => {
				e.fullscreenElement === null && (t.style.removeProperty("height"), requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						t.isConnected && p(t);
					});
				}));
			}))), m(t), this.observeIframeDocument(t), this.iframeOverlayBridge?.disconnect(), this.iframeOverlayBridge = new n(t), this.iframeOverlayBridge.connect();
		};
		if (t.addEventListener("load", o), r !== "" && t.getClientRects().length === 0 && (a !== null || typeof IntersectionObserver < "u")) {
			i = !0, t.removeAttribute("srcdoc");
			let e = () => {
				this.iframeVisibilityObserver?.disconnect(), this.iframeVisibilityObserver = null, i = !1, t.srcdoc = r;
			};
			a === null ? (this.iframeVisibilityObserver = new IntersectionObserver((t) => {
				t.some((e) => e.isIntersecting) && e();
			}), this.iframeVisibilityObserver.observe(t)) : (this.iframeVisibilityObserver = new MutationObserver(() => {
				a.hidden || e();
			}), this.iframeVisibilityObserver.observe(a, {
				attributeFilter: ["hidden"],
				attributes: !0
			}));
			return;
		}
		o();
	}
	observeIframeDocument(e) {
		this.disconnectIframeResizeObserver();
		let t = e.contentDocument, n = t?.defaultView?.Element;
		if (t === null || t.body === null || t.documentElement === null || n === void 0) return;
		let r = (n) => {
			let r = t.defaultView?.customElements;
			if (r === void 0) return;
			let i = new Set(Array.from(n.querySelectorAll("*")).map((e) => e.localName).filter((e) => e.includes("-")));
			for (let t of i) r.whenDefined(t).then(() => m(e));
		};
		r(t), this.iframeMutationObserver = new MutationObserver((t) => {
			for (let e of t) for (let t of Array.from(e.addedNodes)) t instanceof n && r(t);
			this.scheduleIframeHeightSync(e);
		}), this.iframeMutationObserver.observe(t.body, {
			attributes: !0,
			characterData: !0,
			childList: !0,
			subtree: !0
		}), typeof ResizeObserver < "u" && (this.iframeResizeObserver = new ResizeObserver(() => {
			this.scheduleIframeHeightSync(e);
		}), this.iframeResizeObserver.observe(t.body));
	}
	scheduleIframeHeightSync(e) {
		this.iframeSyncFrame === null && (this.iframeSyncFrame = requestAnimationFrame(() => {
			this.iframeSyncFrame = null, e.isConnected && p(e);
		}));
	}
	disconnectIframeResizeObserver() {
		this.iframeSyncFrame !== null && cancelAnimationFrame(this.iframeSyncFrame), this.iframeSyncFrame = null, this.iframeMutationObserver?.disconnect(), this.iframeMutationObserver = null, this.iframeResizeObserver?.disconnect(), this.iframeResizeObserver = null, this.iframeVisibilityObserver?.disconnect(), this.iframeVisibilityObserver = null, this.iframeOverlayBridge?.disconnect(), this.iframeOverlayBridge = null;
	}
	createViewerMarkup(e) {
		let t = c(this.viewerClassName), n = c(this.viewerClassName.replace(/^tp-/, ""));
		if (this.lite) return `
        <div class="tp-markup-viewer-lite-toolbar ${t}-toolbar" role="toolbar" aria-label="Viewer controls">
          <span class="tp-markup-viewer-toolbar-start">
            <tp-icon class="tp-markup-viewer-language" library="components" name="${n}" size="1.5em" role="img" aria-label="${c(u(this.sourceLanguage))}" title="${c(u(this.sourceLanguage))}"></tp-icon>
            <tp-icon-button data-role="toggle-source" name="code" label="Show code" title="Show code" size="s" aria-pressed="false"></tp-icon-button>
            <tp-icon-button data-role="toggle-output" name="eye-outline" label="Show output" title="Show output" size="s" aria-pressed="true"></tp-icon-button>
          </span>
          <span class="tp-markup-viewer-start-controls ${t}-start-controls" data-role="start-controls"></span>
          <span class="tp-markup-viewer-toolbar-end">
            <span class="tp-markup-viewer-editor-actions" data-role="editor-actions" hidden>
              <tp-icon-button data-role="toggle-editor-toolbar" name="keyboard-f1" label="Toggle editor toolbar" title="Toggle editor toolbar (F1)" size="s"></tp-icon-button>
              <tp-icon-button data-role="reset" name="refresh" label="Reset" title="Reset" size="s"></tp-icon-button>
              <tp-icon-button data-role="run" name="play" label="Run" title="Run" size="s"></tp-icon-button>
            </span>
          </span>
        </div>
        <tp-switcher class="tp-markup-viewer-layout ${t}-layout" gap="0" threshold="60rem">
          <div class="tp-markup-viewer-start ${t}-start ${t}-panel ${t}-panel-code">
            <div class="tp-markup-viewer-source ${t}-source ${t}-source-output" data-role="source"></div>
          </div>
          <div class="tp-markup-viewer-end ${t}-end ${t}-panel ${t}-panel-preview">
            <div class="tp-markup-viewer-output ${t}-output" data-role="output"></div>
          </div>
        </tp-switcher>
      `;
		let r = this.outputModes.at(-1) ?? this.outputModes[0], i = this.outputModes.find((e) => e.value === "html");
		return `
      <div class="tp-markup-viewer-toolbar ${t}-toolbar" role="toolbar" aria-label="Viewer controls">
        <span class="tp-markup-viewer-toolbar-start">
          <tp-icon class="tp-markup-viewer-language" library="components" name="${n}" size="1.5em" role="img" aria-label="${c(u(this.sourceLanguage))}" title="${c(u(this.sourceLanguage))}"></tp-icon>
          <tp-icon-button data-role="toggle-source" name="code" label="Show code" title="Show code" size="s" aria-pressed="false"></tp-icon-button>
          <tp-icon-button data-role="toggle-output" name="eye-outline" label="Show output" title="Show output" size="s" aria-pressed="true"></tp-icon-button>
        </span>
        <span class="tp-markup-viewer-start-controls ${t}-start-controls" data-role="start-controls"></span>
        <span class="tp-markup-viewer-toolbar-end">
          <span class="tp-markup-viewer-output-actions" data-role="output-actions">
            <tp-icon-button data-role="output-mode" data-mode="${c(e)}" name="language-html" library="tp" label="Rendered HTML" title="Rendered HTML" size="s" aria-pressed="true"></tp-icon-button>
            ${i ? `<tp-icon-button data-role="output-mode" data-mode="${c(i.value)}" name="code" library="tp" label="Generated HTML" title="Generated HTML" size="s" aria-pressed="false"></tp-icon-button>` : ""}
            <tp-icon-button data-role="output-mode" data-mode="${c(r?.value ?? e)}" name="tree" library="components" label="${c(r?.label ?? "AST")}" title="${c(r?.label ?? "AST")}" size="s" aria-pressed="false"></tp-icon-button>
            <tp-divider orientation="vertical"></tp-divider>
          </span>
          <span class="tp-markup-viewer-editor-actions" data-role="editor-actions">
            <tp-icon-button data-role="toggle-editor-toolbar" name="keyboard-f1" label="Toggle editor toolbar" title="Toggle editor toolbar (F1)" size="s"></tp-icon-button>
            <tp-icon-button data-role="reset" name="refresh" label="Reset" title="Reset" size="s"></tp-icon-button>
            <tp-icon-button data-role="run" name="play" label="Run" title="Run" size="s"></tp-icon-button>
          </span>
        </span>
      </div>
      <tp-switcher class="tp-markup-viewer-layout ${t}-layout" gap="0" threshold="60rem">
        <div class="tp-markup-viewer-start ${t}-start ${t}-panel ${t}-panel-code">
          <div class="tp-markup-viewer-source ${t}-source ${t}-source-output" data-role="source"></div>
        </div>
        <div class="tp-markup-viewer-end ${t}-end ${t}-panel ${t}-panel-preview">
          <div class="tp-markup-viewer-output ${t}-output" data-role="output"></div>
        </div>
      </tp-switcher>
    `;
	}
	readMode(e, t) {
		return this.outputModes.find((t) => t.value === e)?.value ?? t;
	}
	async loadExamples() {
		let e = this.src.split(",").map((e) => e.trim()).filter(Boolean);
		if (e.length === 0) return this.extractExamples(await this.readInlineSource());
		let n = [];
		for (let r of e) {
			let e = t(this, r), i = await fetch(e.href, { cache: "no-store" });
			if (!i.ok) throw Error(`Unable to load example: ${e.pathname} (${String(i.status)})`);
			let a = {
				label: l(r),
				source: await i.text(),
				context: await this.createExternalContext(e)
			};
			n.push(...this.extractExamples(a));
		}
		return n;
	}
};
//#endregion
export { h as t };

//# sourceMappingURL=markup-viewer.js.map