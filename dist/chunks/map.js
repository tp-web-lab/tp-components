import { o as e } from "./rolldown-runtime.js";
import { Ku as t } from "./lib/typescript/typescript.js";
import { G as n, K as r, W as i, q as a } from "./lib/vendor/vendor.js";
import { TpDeclarativeTextSource as o } from "../utilities/declarative-text-source.js";
import { elevationStatistics as s, parseGpx as c } from "../components/map/gpx.js";
import "./xy-plot.js";
//#region src/components/map/map.css?inline
var l = "tp-map{min-inline-size:0;max-inline-size:100%;display:flow-root}tp-map>tp-button-group{margin-block-end:var(--tp-space-xs,.5rem)}tp-map>dl{display:none}tp-map>.tp-map-viewport{inline-size:var(--tp-map-width,100%);block-size:var(--tp-map-height,24rem);isolation:isolate;min-block-size:10rem;max-inline-size:100%}tp-map .leaflet-container{--lightningcss-light:initial;--lightningcss-dark: ;color-scheme:light}tp-map>tp-callout{margin-block-start:var(--tp-space-xs,.5rem)}tp-map>[data-map-profile]{inline-size:var(--tp-map-width,100%);max-inline-size:100%;margin-block-start:var(--tp-space-s,1rem)}", u = class extends t {
	map = null;
	pins = [];
	paths = [];
	profileData = null;
	source = new o(this, { scriptTypes: [] });
	gpx = null;
	gpxSrc = null;
	gpxError = "";
	request = null;
	sourceRevision = 0;
	contentObserver = null;
	fittedKey = "";
	tiles = null;
	resize = null;
	viewport = null;
	timer = null;
	revision = 0;
	locationRevision = 0;
	reflecting = !1;
	centerKey = "";
	static get observedAttributes() {
		return [
			...t.observedAttributes,
			"lat",
			"lon",
			"zoom",
			"title",
			"marker",
			"fit-markers",
			"fit-content",
			"src",
			"elevation-profile"
		];
	}
	number(e, t, n, r) {
		let i = this.getAttribute(e), a = Number(i);
		return i?.trim() && Number.isFinite(a) ? Math.min(r, Math.max(n, a)) : t;
	}
	get lat() {
		return this.number("lat", 48.8566, -90, 90);
	}
	set lat(e) {
		this.setAttribute("lat", String(e));
	}
	get lon() {
		return this.number("lon", 2.3522, -180, 180);
	}
	set lon(e) {
		this.setAttribute("lon", String(e));
	}
	get zoom() {
		return Math.floor(this.number("zoom", 13, 0, 19));
	}
	set zoom(e) {
		this.setAttribute("zoom", String(e));
	}
	get marker() {
		return this.hasAttribute("marker");
	}
	set marker(e) {
		this.toggleAttribute("marker", e);
	}
	get fitMarkers() {
		return this.hasAttribute("fit-markers");
	}
	set fitMarkers(e) {
		this.toggleAttribute("fit-markers", e);
	}
	get fitContent() {
		return this.hasAttribute("fit-content");
	}
	set fitContent(e) {
		this.toggleAttribute("fit-content", e);
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		this.setAttribute("src", e);
	}
	get elevationProfile() {
		return this.hasAttribute("elevation-profile");
	}
	set elevationProfile(e) {
		this.toggleAttribute("elevation-profile", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-leaflet-styles", i), this.ensureGlobalStyle("tp-map-styles", l), this.contentObserver = new MutationObserver((e) => {
			e.some((e) => (e.target.nodeType === Node.ELEMENT_NODE ? e.target : e.target.parentElement)?.closest("dl")?.parentElement === this || e.target === this && [...e.addedNodes, ...e.removedNodes].some((e) => e.nodeName === "DL")) && this.schedule();
		}), this.contentObserver.observe(this, {
			childList: !0,
			subtree: !0,
			characterData: !0
		}), this.schedule();
	}
	disconnectedCallback() {
		this.revision++, this.resetGpx(), this.source.disconnect(), this.contentObserver?.disconnect(), this.contentObserver = null, this.timer !== null && clearTimeout(this.timer), this.timer = null, this.resize?.disconnect(), this.resize = null, this.tiles?.off(), this.tiles = null, this.map?.off(), this.map?.remove(), this.map = null, this.pins = [], this.paths = [], this.profileData = null, this.querySelectorAll(":scope > [data-map-output]").forEach((e) => {
			e.remove();
		}), this.viewport = null, this.centerKey = "", this.fittedKey = "";
	}
	attributeChangedCallback(e) {
		e === "src" && this.resetGpx(), this.isConnected && !this.reflecting && [
			"lat",
			"lon",
			"zoom",
			"title",
			"marker",
			"fit-markers",
			"fit-content",
			"src",
			"elevation-profile"
		].includes(e) && this.schedule();
	}
	updateProfile() {
		let e = this.querySelector(":scope > [data-map-profile]");
		if (!this.elevationProfile || !this.gpx) {
			e?.remove(), this.profileData = null;
			return;
		}
		if (e && this.profileData === this.gpx) return;
		e?.remove();
		let t = this.ownerDocument.createElement("section");
		if (t.setAttribute("data-map-output", ""), t.setAttribute("data-map-profile", ""), t.setAttribute("aria-label", "Elevation profile"), this.gpx.elevationSegments.length) {
			let e = this.ownerDocument.createElement("tp-xy-plot"), n = this.gpx.elevationSegments.flat(), r = s(this.gpx.elevationSegments), i = r ? [{
				label: `Mean: ${Number(r.mean.toFixed(2))} m`,
				elevation: r.mean
			}, {
				label: `Median: ${Number(r.median.toFixed(2))} m`,
				elevation: r.median
			}].map(({ label: e, elevation: t }) => ({
				label: e,
				dashed: !0,
				points: [{
					x: n[0]?.x ?? 0,
					y: t
				}, {
					x: n.at(-1)?.x ?? 0,
					y: t
				}]
			})) : [], a = n.reduce((e, t) => t.y < e.y ? t : e), o = n.reduce((e, t) => t.y > e.y ? t : e), c = a.y === o.y ? [{
				...a,
				label: `Min / Max: ${a.y} m`,
				dy: -12
			}] : [{
				...a,
				label: `Min: ${a.y} m`,
				dy: 18
			}, {
				...o,
				label: `Max: ${o.y} m`,
				dy: -12
			}];
			if (e.setData({
				title: "Elevation profile",
				xLabel: "Distance (km)",
				yLabel: "Elevation (m)",
				points: c,
				series: [...this.gpx.elevationSegments.map((e, t) => ({
					label: `Section ${t + 1}`,
					points: e
				})), ...i]
			}), r) {
				let e = this.ownerDocument.createElement("tp-callout");
				e.setAttribute("variant", "neutral"), e.textContent = `Cumulative ascent (D+): ${Number(r.ascent.toFixed(2))} m · Cumulative descent (D−): ${Number(r.descent.toFixed(2))} m · Minimum elevation: ${a.y} m · Maximum elevation: ${o.y} m`, t.append(e);
			}
			t.append(e);
		} else {
			let e = this.ownerDocument.createElement("tp-callout");
			e.setAttribute("variant", "info"), e.textContent = "No elevation samples are available in this GPX track or route.", t.append(e);
		}
		this.append(t), this.profileData = this.gpx;
	}
	resetGpx() {
		this.sourceRevision++, this.request?.abort(), this.request = null, this.gpxSrc = null, this.gpx = null, this.gpxError = "", this.removeAttribute("aria-busy");
	}
	async loadGpx() {
		let e = this.src.trim();
		if (this.gpxSrc === e || (this.gpxSrc = e, !e)) return;
		let t = this.sourceRevision;
		this.request = new AbortController(), this.setAttribute("aria-busy", "true");
		try {
			let e = await this.source.read({ signal: this.request.signal });
			if (t !== this.sourceRevision || !this.isConnected) return;
			this.gpx = c(e);
		} catch (e) {
			if (t !== this.sourceRevision || !this.isConnected) return;
			this.gpxError = e instanceof Error ? e.message : "Unable to load GPX.";
		} finally {
			t === this.sourceRevision && this.isConnected && (this.request = null, this.removeAttribute("aria-busy"), this.schedule());
		}
	}
	schedule() {
		this.revision++, this.timer !== null && clearTimeout(this.timer), this.timer = setTimeout(() => {
			this.timer = null, this.render();
		}, 0);
	}
	message(e) {
		let t = this.querySelector(":scope > tp-callout");
		t && (t.textContent = e, t.hidden = !e);
	}
	syncZoom = () => {
		if (!this.map) return;
		let e = this.map.getZoom();
		this.reflecting = !0, this.zoom = e, this.reflecting = !1, this.querySelector("[data-action=\"in\"]")?.toggleAttribute("disabled", e >= 19), this.querySelector("[data-action=\"out\"]")?.toggleAttribute("disabled", e <= 0);
	};
	readLocations() {
		let e = this.querySelector(":scope > dl");
		if (this.message(""), !e) return this.marker ? [{
			lat: this.lat,
			lon: this.lon,
			title: this.title
		}] : [];
		let t = [], n = !1;
		return Array.from(e.children).forEach((e) => {
			if (e.localName !== "dt") {
				(e.localName !== "dd" || e.previousElementSibling?.localName !== "dt") && (n = !0);
				return;
			}
			let r = e.nextElementSibling, i = r?.localName === "dd" ? r.textContent.trim().split(",") : [], a = Number(i[0]), o = Number(i[1]);
			if (i.length !== 2 || !i.every((e) => /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(e.trim())) || !Number.isFinite(a) || !Number.isFinite(o) || Math.abs(a) > 90 || Math.abs(o) > 180) {
				n = !0;
				return;
			}
			t.push({
				lat: a,
				lon: o,
				title: e.textContent.trim()
			});
		}), this.message(n ? "Some locations were ignored. Each title needs a latitude, longitude pair in the supported ranges." : ""), t;
	}
	async render() {
		let t = this.revision;
		if (!this.viewport) {
			let e = this.ownerDocument.createElement("template");
			e.innerHTML = "<tp-button-group aria-label=\"Map controls\"><tp-icon-button name=\"plus\" label=\"Zoom in\" data-action=\"in\"></tp-icon-button><tp-icon-button name=\"minus\" label=\"Zoom out\" data-action=\"out\"></tp-icon-button><tp-icon-button name=\"crosshairs-unknown\" label=\"Use my location\" data-action=\"locate\"></tp-icon-button></tp-button-group><div class=\"tp-map-viewport\" role=\"region\" tabindex=\"0\"></div><tp-callout variant=\"warning\" role=\"status\" hidden></tp-callout>", Array.from(e.content.children).forEach((e) => {
				e.setAttribute("data-map-output", "");
			}), this.append(e.content), this.viewport = this.querySelector(".tp-map-viewport"), this.viewport?.addEventListener("mousedown", () => {
				this.viewport?.focus({ preventScroll: !0 });
			}, { capture: !0 }), this.querySelector("[data-action=\"in\"]")?.addEventListener("click", () => this.map?.zoomIn()), this.querySelector("[data-action=\"out\"]")?.addEventListener("click", () => this.map?.zoomOut()), this.querySelector("[data-action=\"locate\"]")?.addEventListener("click", () => this.locate());
		}
		try {
			let i = await import("./lib/vendor/vendor.js").then((t) => /* @__PURE__ */ e(t.n(), 1));
			if (t !== this.revision || !this.isConnected || !this.viewport) return;
			this.viewport.setAttribute("aria-label", this.title.trim() || "Interactive map"), this.map || (this.message(""), this.map = i.map(this.viewport, {
				center: [this.lat, this.lon],
				zoom: this.zoom,
				minZoom: 0,
				maxZoom: 19,
				zoomControl: !1,
				scrollWheelZoom: !1,
				zoomAnimation: !1,
				fadeAnimation: !1,
				markerZoomAnimation: !1
			}), this.map.on("zoomend", this.syncZoom), this.tiles = i.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
			}).addTo(this.map), this.tiles.on("tileerror", () => this.message("Some map tiles could not be loaded. Check your connection or try again later.")), typeof ResizeObserver < "u" && (this.resize = new ResizeObserver(() => this.map?.invalidateSize({ pan: !1 })), this.resize.observe(this.viewport)));
			let o = `${this.lat},${this.lon}`;
			o === this.centerKey ? this.map.getZoom() !== this.zoom && this.map.setZoom(this.zoom, { animate: !1 }) : this.map.setView([this.lat, this.lon], this.zoom, { animate: !1 }), this.centerKey = o, this.loadGpx(), this.paths.forEach((e) => {
				e.remove();
			}), this.paths = [];
			let s = this.gpx?.segments ?? [];
			s.forEach((e) => {
				let t = i.polyline(e, {
					color: "var(--tp-brand-text-colorful)",
					weight: 3,
					interactive: !1
				});
				this.map && t.addTo(this.map), this.paths.push(t);
			}), this.pins.forEach((e) => {
				e.remove();
			}), this.pins = [];
			let c = [...this.readLocations(), ...this.gpx?.locations ?? []];
			this.gpxError && this.message(this.gpxError), c.forEach((e) => {
				let t = i.marker([e.lat, e.lon], {
					title: e.title || "Location",
					alt: e.title || "Location",
					icon: i.icon({
						iconUrl: a,
						iconRetinaUrl: r,
						shadowUrl: n,
						iconSize: [25, 41],
						iconAnchor: [12, 41],
						popupAnchor: [1, -34],
						shadowSize: [41, 41]
					})
				});
				if (this.map && t.addTo(this.map), this.pins.push(t), e.title.trim()) {
					let n = this.ownerDocument.createElement("span");
					n.textContent = e.title, t.bindPopup(n);
				}
			});
			let l = c.map(({ lat: e, lon: t }) => [e, t]);
			this.fitContent && l.push(...s.flat());
			let u = this.fitContent || this.fitMarkers, d = u ? `${this.fitContent}:${JSON.stringify(l)}` : "";
			d !== this.fittedKey && u && l.length && this.map.fitBounds(l, {
				padding: [24, 24],
				maxZoom: 16,
				animate: !1
			}), this.fittedKey = d, this.syncZoom(), this.updateProfile();
		} catch (e) {
			t === this.revision && this.isConnected && this.message(e instanceof Error ? e.message : "Unable to load the map.");
		}
	}
	locate() {
		let e = this.ownerDocument.defaultView?.navigator.geolocation;
		if (!e) {
			this.message("Geolocation is unavailable in this browser.");
			return;
		}
		let t = this.revision, n = ++this.locationRevision;
		this.message("Waiting for location permission…"), e.getCurrentPosition((e) => {
			t !== this.revision || n !== this.locationRevision || !this.isConnected || (this.message(""), this.lat = e.coords.latitude, this.lon = e.coords.longitude);
		}, (e) => {
			t !== this.revision || n !== this.locationRevision || !this.isConnected || this.message(`Location unavailable: ${e.message}`);
		}, {
			enableHighAccuracy: !1,
			timeout: 1e4,
			maximumAge: 6e4
		});
	}
};
customElements.get("tp-map") || customElements.define("tp-map", u);
//#endregion
export { u as t };

//# sourceMappingURL=map.js.map