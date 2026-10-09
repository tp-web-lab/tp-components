/** @module components/map */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-xy-plot
 * @summary XY graph rendering component.
 */
/**
 * @credit Leaflet https://leafletjs.com/
 * @summary Interactive geographic maps.
 */
/**
 * @credit OpenStreetMap https://www.openstreetmap.org/copyright
 * @summary Map tiles and geographic data; attribution required.
 */
// tp-docgen:dependencies:end

import type { Map as LeafletMap, Marker, Polyline, TileLayer } from "leaflet";
import markerUrl from "leaflet/dist/images/marker-icon.png";
import markerRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import leafletStyle from "leaflet/dist/leaflet.css?inline";
import { TpDeclarativeTextSource } from "../../utilities/declarative-text-source.js";
import { TpBase } from "../base/base.js";
import {
	elevationStatistics,
	type GpxData,
	type MapLocation,
	parseGpx,
} from "./gpx.js";
import "../button-group/button-group.js";
import "../icon-button/icon-button.js";
import "../callout/callout.js";
import "../xy-plot/xy-plot.js";
import style from "./map.css?inline";

/**
 * @summary displays an interactive OpenStreetMap with named markers and GPX routes or tracks.
 * @tagname tp-map
 * @attr {number} lat = 48.8566 - Latitude of the configured location, between -90 and 90.
 * @attr {number} lon = 2.3522 - Longitude of the configured location, between -180 and 180.
 * @attr {number} zoom = 13 - Zoom level from 0 to 19.
 * @attr {string} title = "" - Accessible map name and optional marker popup text.
 * @attr {boolean} marker = false - Shows a marker at the configured coordinates when no location list is supplied.
 * @attr {boolean} fit-markers = false - Fits the viewport to the markers when their locations change or fitting is enabled.
 * @attr {boolean} fit-content = false - Fits markers and GPX geometry together; takes precedence over fit-markers.
 * @attr {string} src = "" - URL of a GPX file containing tracks, routes or waypoints.
 * @attr {boolean} elevation-profile = false - Shows GPX altitude in metres against cumulative distance in kilometres below the map.
 * @cssprop [--tp-map-height=24rem] Height of the map viewport.
 * @cssprop [--tp-map-width=100%] Width of the map viewport, limited to the available container width.
 * @accessibility Uses named tp-icon-button controls and a keyboard-focusable map region; preserves visible OpenStreetMap attribution.
 * @accessibilityresponsibility Provide meaningful location text alongside the map; do not rely on geography or a marker alone.
 * @keyboard {Arrow keys} Pans the focused map.
 * @keyboard {+ / -} Zooms the focused map in or out.
 * @keyboard {Enter / Space} Activates toolbar buttons; Enter opens a focused marker popup.
 * @keyboard {Escape} Closes an open popup.
 * @example
 * <tp-map lat="48.3904" lon="-4.4861" zoom="13" title="Brest, Brittany, France" marker></tp-map>
 */
export class TpMap extends TpBase {
	/** Current Leaflet map instance, removed on disconnection. */
	private map: LeafletMap | null = null;
	/** Current geographic markers. */
	private pins: Marker[] = [];
	/** Rendered GPX lines, each representing a separate segment or route. */
	private paths: Polyline[] = [];
	/** Data currently represented by the elevation chart; prevents rebuilding it while panning. */
	private profileData: GpxData | null = null;
	/** Common library URL resolution and text-file loading. No inline script is exposed. */
	private readonly source = new TpDeclarativeTextSource(this, {
		scriptTypes: [],
	});
	/** Geometry from the current source, never from an obsolete response. */
	private gpx: GpxData | null = null;
	/** Last source attempted; presentation updates do not fetch again. */
	private gpxSrc: string | null = null;
	/** Current GPX failure, kept visible across unrelated map updates. */
	private gpxError = "";
	/** Cancels network work when the source changes or the component disconnects. */
	private request: AbortController | null = null;
	/** Invalidates stale GPX successes and failures independently of map rendering. */
	private sourceRevision = 0;
	/** Watches only authored definition-list changes, never Leaflet's generated content. */
	private contentObserver: MutationObserver | null = null;
	/** Last fitted locations, so subsequent zooming and panning remain possible. */
	private fittedKey = "";
	/** Tile layer, retained to release its listeners. */
	private tiles: TileLayer | null = null;
	/** Resize observer for tabs, splitters and responsive documentation. */
	private resize: ResizeObserver | null = null;
	/** Current map viewport element. */
	private viewport: HTMLDivElement | null = null;
	/** Coalesces consecutive attribute updates. */
	private timer: ReturnType<typeof setTimeout> | null = null;
	/** Invalidates pending module loads and location requests. */
	private revision = 0;
	/** Distinguishes successive location requests without cancelling map initialization. */
	private locationRevision = 0;
	/** Prevents reflected zoom changes from triggering another render. */
	private reflecting = false;
	/** Last configured coordinates; dragging does not change the marked location. */
	private centerKey = "";
	/** Attributes that update the map or marker. */
	public static override get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"lat",
			"lon",
			"zoom",
			"title",
			"marker",
			"fit-markers",
			"fit-content",
			"src",
			"elevation-profile",
		];
	}
	/** Reads a bounded numeric setting, retaining explicit zero. */
	private number(
		name: string,
		fallback: number,
		min: number,
		max: number,
	): number {
		const raw = this.getAttribute(name);
		const value = Number(raw);
		return raw?.trim() && Number.isFinite(value)
			? Math.min(max, Math.max(min, value))
			: fallback;
	}
	/** Configured latitude. */
	public get lat(): number {
		return this.number("lat", 48.8566, -90, 90);
	}
	/** Changes latitude. */
	public set lat(value: number) {
		this.setAttribute("lat", String(value));
	}
	/** Configured longitude. */
	public get lon(): number {
		return this.number("lon", 2.3522, -180, 180);
	}
	/** Changes longitude. */
	public set lon(value: number) {
		this.setAttribute("lon", String(value));
	}
	/** Current zoom level, rounded down to a supported integer. */
	public get zoom(): number {
		return Math.floor(this.number("zoom", 13, 0, 19));
	}
	/** Changes zoom without resetting a dragged map center. */
	public set zoom(value: number) {
		this.setAttribute("zoom", String(value));
	}
	/** Whether the configured point has a marker. */
	public get marker(): boolean {
		return this.hasAttribute("marker");
	}
	/** Shows or hides the location marker. */
	public set marker(value: boolean) {
		this.toggleAttribute("marker", value);
	}
	/** Whether new or changed markers should be framed together. */
	public get fitMarkers(): boolean {
		return this.hasAttribute("fit-markers");
	}
	/** Enables or disables automatic framing of marker locations. */
	public set fitMarkers(value: boolean) {
		this.toggleAttribute("fit-markers", value);
	}
	/** Whether markers and GPX geometry are framed together. */
	public get fitContent(): boolean {
		return this.hasAttribute("fit-content");
	}
	/** Enables or disables framing of all geographic content. */
	public set fitContent(value: boolean) {
		this.toggleAttribute("fit-content", value);
	}
	/** URL of the GPX source; empty leaves only authored markers. */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	/** Replaces the GPX source, cancelling obsolete work. */
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	/** Whether the GPX altitude profile is displayed below the map. */
	public get elevationProfile(): boolean {
		return this.hasAttribute("elevation-profile");
	}
	/** Shows or hides the altitude profile without reloading the GPX file. */
	public set elevationProfile(value: boolean) {
		this.toggleAttribute("elevation-profile", value);
	}
	/** Installs shared library and Leaflet styles, then initializes lazily. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-leaflet-styles", leafletStyle);
		this.ensureGlobalStyle("tp-map-styles", style);
		this.contentObserver = new MutationObserver((records) => {
			if (
				records.some((record) => {
					const element =
						record.target.nodeType === Node.ELEMENT_NODE
							? (record.target as Element)
							: record.target.parentElement;
					return (
						element?.closest("dl")?.parentElement === this ||
						(record.target === this &&
							[...record.addedNodes, ...record.removedNodes].some(
								(node) => node.nodeName === "DL",
							))
					);
				})
			)
				this.schedule();
		});
		this.contentObserver.observe(this, {
			childList: true,
			subtree: true,
			characterData: true,
		});
		this.schedule();
	}
	/** Releases maps, observers and callbacks when removed. */
	public disconnectedCallback(): void {
		this.revision++;
		this.resetGpx();
		this.source.disconnect();
		this.contentObserver?.disconnect();
		this.contentObserver = null;
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = null;
		this.resize?.disconnect();
		this.resize = null;
		this.tiles?.off();
		this.tiles = null;
		this.map?.off();
		this.map?.remove();
		this.map = null;
		this.pins = [];
		this.paths = [];
		this.profileData = null;
		this.querySelectorAll(":scope > [data-map-output]").forEach((node) => {
			node.remove();
		});
		this.viewport = null;
		this.centerKey = "";
		this.fittedKey = "";
	}
	/** Updates authored settings while avoiding reflected zoom feedback loops. */
	protected override attributeChangedCallback(name: string): void {
		if (name === "src") this.resetGpx();
		if (
			this.isConnected &&
			!this.reflecting &&
			[
				"lat",
				"lon",
				"zoom",
				"title",
				"marker",
				"fit-markers",
				"fit-content",
				"src",
				"elevation-profile",
			].includes(name)
		)
			this.schedule();
	}
	/** Reuses tp-xy-plot for altitude data and a callout when no samples are available. */
	private updateProfile(): void {
		const existing = this.querySelector(":scope > [data-map-profile]");
		if (!this.elevationProfile || !this.gpx) {
			existing?.remove();
			this.profileData = null;
			return;
		}
		if (existing && this.profileData === this.gpx) return;
		existing?.remove();
		const section = this.ownerDocument.createElement("section");
		section.setAttribute("data-map-output", "");
		section.setAttribute("data-map-profile", "");
		section.setAttribute("aria-label", "Elevation profile");
		if (this.gpx.elevationSegments.length) {
			const plot = this.ownerDocument.createElement("tp-xy-plot");
			const samples = this.gpx.elevationSegments.flat();
			const statistics = elevationStatistics(this.gpx.elevationSegments);
			const referenceLines = statistics
				? [
						{
							label: `Mean: ${Number(statistics.mean.toFixed(2))} m`,
							elevation: statistics.mean,
						},
						{
							label: `Median: ${Number(statistics.median.toFixed(2))} m`,
							elevation: statistics.median,
						},
					].map(({ label, elevation }) => ({
						label,
						dashed: true,
						points: [
							{ x: samples[0]?.x ?? 0, y: elevation },
							{ x: samples.at(-1)?.x ?? 0, y: elevation },
						],
					}))
				: [];
			const minimum = samples.reduce((a, b) => (b.y < a.y ? b : a));
			const maximum = samples.reduce((a, b) => (b.y > a.y ? b : a));
			// Keep the first occurrence of tied extrema; a flat profile has one combined marker.
			const points =
				minimum.y === maximum.y
					? [{ ...minimum, label: `Min / Max: ${minimum.y} m`, dy: -12 }]
					: [
							{ ...minimum, label: `Min: ${minimum.y} m`, dy: 18 },
							{ ...maximum, label: `Max: ${maximum.y} m`, dy: -12 },
						];
			plot.setData({
				title: "Elevation profile",
				xLabel: "Distance (km)",
				yLabel: "Elevation (m)",
				points,
				series: [
					...this.gpx.elevationSegments.map((points, index) => ({
						label: `Section ${index + 1}`,
						points,
					})),
					...referenceLines,
				],
			});
			if (statistics) {
				const summary = this.ownerDocument.createElement("tp-callout");
				summary.setAttribute("variant", "neutral");
				summary.textContent = `Cumulative ascent (D+): ${Number(statistics.ascent.toFixed(2))} m · Cumulative descent (D−): ${Number(statistics.descent.toFixed(2))} m · Minimum elevation: ${minimum.y} m · Maximum elevation: ${maximum.y} m`;
				section.append(summary);
			}
			section.append(plot);
		} else {
			const notice = this.ownerDocument.createElement("tp-callout");
			notice.setAttribute("variant", "info");
			notice.textContent =
				"No elevation samples are available in this GPX track or route.";
			section.append(notice);
		}
		this.append(section);
		this.profileData = this.gpx;
	}
	/** Invalidates source data immediately without affecting the retained author list. */
	private resetGpx(): void {
		this.sourceRevision++;
		this.request?.abort();
		this.request = null;
		this.gpxSrc = null;
		this.gpx = null;
		this.gpxError = "";
		this.removeAttribute("aria-busy");
	}
	/** Fetches only when the source changes; aborted or stale responses cannot change the map. */
	private async loadGpx(): Promise<void> {
		const src = this.src.trim();
		if (this.gpxSrc === src) return;
		this.gpxSrc = src;
		if (!src) return;
		const revision = this.sourceRevision;
		this.request = new AbortController();
		this.setAttribute("aria-busy", "true");
		try {
			const text = await this.source.read({ signal: this.request.signal });
			if (revision !== this.sourceRevision || !this.isConnected) return;
			this.gpx = parseGpx(text);
		} catch (error) {
			if (revision !== this.sourceRevision || !this.isConnected) return;
			this.gpxError =
				error instanceof Error ? error.message : "Unable to load GPX.";
		} finally {
			if (revision === this.sourceRevision && this.isConnected) {
				this.request = null;
				this.removeAttribute("aria-busy");
				this.schedule();
			}
		}
	}
	/** Batches updates and invalidates obsolete asynchronous work. */
	private schedule(): void {
		this.revision++;
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.timer = null;
			void this.render();
		}, 0);
	}
	/** Displays operational messages without injecting HTML supplied by the author. */
	private message(text: string): void {
		const status = this.querySelector<HTMLElement>(":scope > tp-callout");
		if (status) {
			status.textContent = text;
			status.hidden = !text;
		}
	}
	/** Updates toolbar availability and reflects direct map zoom into its attribute. */
	private syncZoom = (): void => {
		if (!this.map) return;
		const zoom = this.map.getZoom();
		this.reflecting = true;
		this.zoom = zoom;
		this.reflecting = false;
		this.querySelector('[data-action="in"]')?.toggleAttribute(
			"disabled",
			zoom >= 19,
		);
		this.querySelector('[data-action="out"]')?.toggleAttribute(
			"disabled",
			zoom <= 0,
		);
	};
	/** Reads direct dt/dd pairs; a supplied list replaces the single-marker configuration. */
	private readLocations(): MapLocation[] {
		const list = this.querySelector(":scope > dl");
		this.message("");
		if (!list)
			return this.marker
				? [{ lat: this.lat, lon: this.lon, title: this.title }]
				: [];
		const locations: MapLocation[] = [];
		let invalid = false;
		Array.from(list.children).forEach((child) => {
			if (child.localName !== "dt") {
				if (
					child.localName !== "dd" ||
					child.previousElementSibling?.localName !== "dt"
				)
					invalid = true;
				return;
			}
			const definition = child.nextElementSibling;
			const parts =
				definition?.localName === "dd"
					? definition.textContent.trim().split(",")
					: [];
			const lat = Number(parts[0]);
			const lon = Number(parts[1]);
			if (
				parts.length !== 2 ||
				!parts.every((part) =>
					/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(part.trim()),
				) ||
				!Number.isFinite(lat) ||
				!Number.isFinite(lon) ||
				Math.abs(lat) > 90 ||
				Math.abs(lon) > 180
			) {
				invalid = true;
				return;
			}
			locations.push({ lat, lon, title: child.textContent.trim() });
		});
		this.message(
			invalid
				? "Some locations were ignored. Each title needs a latitude, longitude pair in the supported ranges."
				: "",
		);
		return locations;
	}
	/** Initializes Leaflet and applies author settings without rebuilding unchanged maps. */
	private async render(): Promise<void> {
		const revision = this.revision;
		if (!this.viewport) {
			const template = this.ownerDocument.createElement("template");
			template.innerHTML =
				'<tp-button-group aria-label="Map controls"><tp-icon-button name="plus" label="Zoom in" data-action="in"></tp-icon-button><tp-icon-button name="minus" label="Zoom out" data-action="out"></tp-icon-button><tp-icon-button name="crosshairs-unknown" label="Use my location" data-action="locate"></tp-icon-button></tp-button-group><div class="tp-map-viewport" role="region" tabindex="0"></div><tp-callout variant="warning" role="status" hidden></tp-callout>';
			Array.from(template.content.children).forEach((node) => {
				node.setAttribute("data-map-output", "");
			});
			this.append(template.content);
			this.viewport = this.querySelector<HTMLDivElement>(".tp-map-viewport");
			// Leaflet's default mouse focus scrolls ancestor frames before restoring
			// only its own window, which can move the marker between down and up.
			this.viewport?.addEventListener(
				"mousedown",
				() => {
					this.viewport?.focus({ preventScroll: true });
				},
				{ capture: true },
			);
			this.querySelector('[data-action="in"]')?.addEventListener("click", () =>
				this.map?.zoomIn(),
			);
			this.querySelector('[data-action="out"]')?.addEventListener("click", () =>
				this.map?.zoomOut(),
			);
			this.querySelector('[data-action="locate"]')?.addEventListener(
				"click",
				() => this.locate(),
			);
		}
		try {
			const L = await import("leaflet");
			if (revision !== this.revision || !this.isConnected || !this.viewport)
				return;
			this.viewport.setAttribute(
				"aria-label",
				this.title.trim() || "Interactive map",
			);
			if (!this.map) {
				this.message("");
				this.map = L.map(this.viewport, {
					center: [this.lat, this.lon],
					zoom: this.zoom,
					minZoom: 0,
					maxZoom: 19,
					zoomControl: false,
					scrollWheelZoom: false,
					zoomAnimation: false,
					fadeAnimation: false,
					markerZoomAnimation: false,
				});
				this.map.on("zoomend", this.syncZoom);
				this.tiles = L.tileLayer(
					"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
					{
						maxZoom: 19,
						attribution:
							'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					},
				).addTo(this.map);
				this.tiles.on("tileerror", () =>
					this.message(
						"Some map tiles could not be loaded. Check your connection or try again later.",
					),
				);
				if (typeof ResizeObserver !== "undefined") {
					this.resize = new ResizeObserver(() =>
						this.map?.invalidateSize({ pan: false }),
					);
					this.resize.observe(this.viewport);
				}
			}
			const centerKey = `${this.lat},${this.lon}`;
			if (centerKey !== this.centerKey)
				this.map.setView([this.lat, this.lon], this.zoom, { animate: false });
			else if (this.map.getZoom() !== this.zoom)
				this.map.setZoom(this.zoom, { animate: false });
			this.centerKey = centerKey;
			void this.loadGpx();
			this.paths.forEach((path) => {
				path.remove();
			});
			this.paths = [];
			const segments = this.gpx?.segments ?? [];
			segments.forEach((segment) => {
				const path = L.polyline(segment, {
					color: "var(--tp-brand-text-colorful)",
					weight: 3,
					interactive: false,
				});
				if (this.map) path.addTo(this.map);
				this.paths.push(path);
			});
			this.pins.forEach((pin) => {
				pin.remove();
			});
			this.pins = [];
			const locations = [
				...this.readLocations(),
				...(this.gpx?.locations ?? []),
			];
			if (this.gpxError) this.message(this.gpxError);
			locations.forEach((location) => {
				const pin = L.marker([location.lat, location.lon], {
					title: location.title || "Location",
					alt: location.title || "Location",
					icon: L.icon({
						iconUrl: markerUrl,
						iconRetinaUrl: markerRetinaUrl,
						shadowUrl: markerShadowUrl,
						iconSize: [25, 41],
						iconAnchor: [12, 41],
						popupAnchor: [1, -34],
						shadowSize: [41, 41],
					}),
				});
				if (this.map) pin.addTo(this.map);
				this.pins.push(pin);
				if (location.title.trim()) {
					const label = this.ownerDocument.createElement("span");
					label.textContent = location.title;
					pin.bindPopup(label);
				}
			});
			const points: [number, number][] = locations.map(({ lat, lon }) => [
				lat,
				lon,
			]);
			if (this.fitContent) points.push(...segments.flat());
			const fit = this.fitContent || this.fitMarkers;
			const fittedKey = fit
				? `${this.fitContent}:${JSON.stringify(points)}`
				: "";
			if (fittedKey !== this.fittedKey && fit && points.length) {
				this.map.fitBounds(points, {
					padding: [24, 24],
					maxZoom: 16,
					animate: false,
				});
			}
			this.fittedKey = fittedKey;
			this.syncZoom();
			this.updateProfile();
		} catch (error) {
			if (revision === this.revision && this.isConnected)
				this.message(
					error instanceof Error ? error.message : "Unable to load the map.",
				);
		}
	}
	/** Requests geolocation only following an explicit user action; stale replies are ignored. */
	public locate(): void {
		const geolocation = this.ownerDocument.defaultView?.navigator.geolocation;
		if (!geolocation) {
			this.message("Geolocation is unavailable in this browser.");
			return;
		}
		const revision = this.revision;
		const locationRevision = ++this.locationRevision;
		this.message("Waiting for location permission…");
		geolocation.getCurrentPosition(
			(position) => {
				if (
					revision !== this.revision ||
					locationRevision !== this.locationRevision ||
					!this.isConnected
				)
					return;
				this.message("");
				this.lat = position.coords.latitude;
				this.lon = position.coords.longitude;
			},
			(error) => {
				if (
					revision !== this.revision ||
					locationRevision !== this.locationRevision ||
					!this.isConnected
				)
					return;
				this.message(`Location unavailable: ${error.message}`);
			},
			{ enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
		);
	}
}
if (!customElements.get("tp-map")) customElements.define("tp-map", TpMap);
declare global {
	interface HTMLElementTagNameMap {
		"tp-map": TpMap;
	}
}
