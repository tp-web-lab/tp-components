/** @module components/map */
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
import { TpBase } from "../base/base.js";
import "../button-group/button-group.js";
import "../icon-button/icon-button.js";
import "../callout/callout.js";
import "../xy-plot/xy-plot.js";
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
export declare class TpMap extends TpBase {
    /** Current Leaflet map instance, removed on disconnection. */
    private map;
    /** Current geographic markers. */
    private pins;
    /** Rendered GPX lines, each representing a separate segment or route. */
    private paths;
    /** Data currently represented by the elevation chart; prevents rebuilding it while panning. */
    private profileData;
    /** Common library URL resolution and text-file loading. No inline script is exposed. */
    private readonly source;
    /** Geometry from the current source, never from an obsolete response. */
    private gpx;
    /** Last source attempted; presentation updates do not fetch again. */
    private gpxSrc;
    /** Current GPX failure, kept visible across unrelated map updates. */
    private gpxError;
    /** Cancels network work when the source changes or the component disconnects. */
    private request;
    /** Invalidates stale GPX successes and failures independently of map rendering. */
    private sourceRevision;
    /** Watches only authored definition-list changes, never Leaflet's generated content. */
    private contentObserver;
    /** Last fitted locations, so subsequent zooming and panning remain possible. */
    private fittedKey;
    /** Tile layer, retained to release its listeners. */
    private tiles;
    /** Resize observer for tabs, splitters and responsive documentation. */
    private resize;
    /** Current map viewport element. */
    private viewport;
    /** Coalesces consecutive attribute updates. */
    private timer;
    /** Invalidates pending module loads and location requests. */
    private revision;
    /** Distinguishes successive location requests without cancelling map initialization. */
    private locationRevision;
    /** Prevents reflected zoom changes from triggering another render. */
    private reflecting;
    /** Last configured coordinates; dragging does not change the marked location. */
    private centerKey;
    /** Attributes that update the map or marker. */
    static get observedAttributes(): string[];
    /** Reads a bounded numeric setting, retaining explicit zero. */
    private number;
    /** Configured latitude. */
    get lat(): number;
    /** Changes latitude. */
    set lat(value: number);
    /** Configured longitude. */
    get lon(): number;
    /** Changes longitude. */
    set lon(value: number);
    /** Current zoom level, rounded down to a supported integer. */
    get zoom(): number;
    /** Changes zoom without resetting a dragged map center. */
    set zoom(value: number);
    /** Whether the configured point has a marker. */
    get marker(): boolean;
    /** Shows or hides the location marker. */
    set marker(value: boolean);
    /** Whether new or changed markers should be framed together. */
    get fitMarkers(): boolean;
    /** Enables or disables automatic framing of marker locations. */
    set fitMarkers(value: boolean);
    /** Whether markers and GPX geometry are framed together. */
    get fitContent(): boolean;
    /** Enables or disables framing of all geographic content. */
    set fitContent(value: boolean);
    /** URL of the GPX source; empty leaves only authored markers. */
    get src(): string;
    /** Replaces the GPX source, cancelling obsolete work. */
    set src(value: string);
    /** Whether the GPX altitude profile is displayed below the map. */
    get elevationProfile(): boolean;
    /** Shows or hides the altitude profile without reloading the GPX file. */
    set elevationProfile(value: boolean);
    /** Installs shared library and Leaflet styles, then initializes lazily. */
    protected connectedCallback(): void;
    /** Releases maps, observers and callbacks when removed. */
    disconnectedCallback(): void;
    /** Updates authored settings while avoiding reflected zoom feedback loops. */
    protected attributeChangedCallback(name: string): void;
    /** Reuses tp-xy-plot for altitude data and a callout when no samples are available. */
    private updateProfile;
    /** Invalidates source data immediately without affecting the retained author list. */
    private resetGpx;
    /** Fetches only when the source changes; aborted or stale responses cannot change the map. */
    private loadGpx;
    /** Batches updates and invalidates obsolete asynchronous work. */
    private schedule;
    /** Displays operational messages without injecting HTML supplied by the author. */
    private message;
    /** Updates toolbar availability and reflects direct map zoom into its attribute. */
    private syncZoom;
    /** Reads direct dt/dd pairs; a supplied list replaces the single-marker configuration. */
    private readLocations;
    /** Initializes Leaflet and applies author settings without rebuilding unchanged maps. */
    private render;
    /** Requests geolocation only following an explicit user action; stale replies are ignored. */
    locate(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-map": TpMap;
    }
}
