import { afterEach, beforeEach, expect, it, vi } from "vitest";

/** Controlled Leaflet surface avoids network requests and layout assumptions in unit tests. */
const mocks = vi.hoisted(() => {
	const map = {
		on: vi.fn(),
		off: vi.fn(),
		remove: vi.fn(),
		setView: vi.fn(),
		setZoom: vi.fn(),
		fitBounds: vi.fn(),
		getZoom: vi.fn(() => 13),
		zoomIn: vi.fn(),
		zoomOut: vi.fn(),
		invalidateSize: vi.fn(),
	};
	const pin = { remove: vi.fn(), bindPopup: vi.fn(), addTo: vi.fn() };
	const tiles = { on: vi.fn(), off: vi.fn(), addTo: vi.fn() };
	const path = { remove: vi.fn(), addTo: vi.fn() };
	return {
		map,
		pin,
		tiles,
		path,
		polyline: vi.fn(),
		create: vi.fn(),
		marker: vi.fn(),
		tileLayer: vi.fn(),
		icon: vi.fn(),
	};
});
vi.mock("leaflet", () => ({
	map: mocks.create,
	marker: mocks.marker,
	tileLayer: mocks.tileLayer,
	icon: mocks.icon,
	polyline: mocks.polyline,
}));

import { TpMap } from "./map.js";

/** Most recent resize callback. */
let resizeCallback: ResizeObserverCallback;
/** Tracks observer cleanup. */
const disconnect = vi.fn();
/** Minimal ResizeObserver implementation with a controllable callback. */
class ResizeMock {
	/** Captures the component's resize handler. */
	constructor(callback: ResizeObserverCallback) {
		resizeCallback = callback;
	}
	/** Marks observation without accessing layout. */
	observe(): void {
		/* No browser layout in unit tests. */
	}
	/** Records observer cleanup. */
	disconnect(): void {
		disconnect();
	}
}
/** Creates a connected map using the real component. */
function fixture(attributes = ""): TpMap {
	const wrapper = document.createElement("div");
	wrapper.innerHTML = `<tp-map ${attributes}></tp-map>`;
	const element = wrapper.firstElementChild;
	if (!(element instanceof TpMap)) throw new Error("Missing map");
	document.body.append(element);
	return element;
}
/** Waits for deferred import and attribute processing. */
async function settle(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 25));
}
beforeEach(() => {
	vi.clearAllMocks();
	mocks.create.mockReturnValue(mocks.map);
	mocks.marker.mockReturnValue(mocks.pin);
	mocks.pin.addTo.mockReturnValue(mocks.pin);
	mocks.tileLayer.mockReturnValue(mocks.tiles);
	mocks.tiles.addTo.mockReturnValue(mocks.tiles);
	mocks.map.getZoom.mockReturnValue(13);
	mocks.polyline.mockReturnValue(mocks.path);
	mocks.path.addTo.mockReturnValue(mocks.path);
	vi.stubGlobal("ResizeObserver", ResizeMock);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

it("uses extension defaults, creates one map and preserves attribution", async () => {
	const element = fixture();
	expect(element.lat).toBe(48.8566);
	expect(element.lon).toBe(2.3522);
	expect(element.zoom).toBe(13);
	expect(element.marker).toBe(false);
	await settle();
	expect(mocks.create).toHaveBeenCalledOnce();
	const viewport = element.querySelector<HTMLElement>(".tp-map-viewport");
	if (!viewport) throw new Error("Missing map viewport");
	const focus = vi.spyOn(viewport, "focus");
	viewport.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
	expect(focus).toHaveBeenCalledWith({ preventScroll: true });
	expect(mocks.create.mock.calls[0]?.[1]).toMatchObject({
		scrollWheelZoom: false,
		zoomControl: false,
		zoomAnimation: false,
	});
	expect(mocks.tileLayer.mock.calls[0]?.[1].attribution).toContain(
		'href="https://www.openstreetmap.org/copyright"',
	);
	expect(
		element.querySelector('[role="region"]')?.getAttribute("aria-label"),
	).toBe("Interactive map");
	element.title = "Brest";
	element.lat = 48.3904;
	element.lon = -4.4861;
	await settle();
	expect(mocks.create).toHaveBeenCalledOnce();
	expect(mocks.map.setView).toHaveBeenLastCalledWith([48.3904, -4.4861], 13, {
		animate: false,
	});
	element
		.querySelector('[data-action="in"]')
		?.dispatchEvent(new Event("click"));
	element
		.querySelector('[data-action="out"]')
		?.dispatchEvent(new Event("click"));
	expect(mocks.map.zoomIn).toHaveBeenCalledOnce();
	expect(mocks.map.zoomOut).toHaveBeenCalledOnce();
	resizeCallback([], {} as ResizeObserver);
	expect(mocks.map.invalidateSize).toHaveBeenCalledWith({ pan: false });
	element.remove();
	expect(mocks.map.remove).toHaveBeenCalledOnce();
	expect(disconnect).toHaveBeenCalled();
	document.body.append(element);
	await settle();
	expect(mocks.create).toHaveBeenCalledTimes(2);
});
it("updates markers with safe text, reflects zoom and bounds numeric settings", async () => {
	const element = fixture('marker title="&lt;img src=x onerror=alert(1)&gt;"');
	await settle();
	const label = mocks.pin.bindPopup.mock.calls[0]?.[0] as HTMLElement;
	expect(label.textContent).toContain("<img");
	expect(label.querySelector("img")).toBeNull();
	element.title = "";
	await settle();
	expect(mocks.marker.mock.calls.at(-1)?.[1].alt).toBe("Location");
	element.marker = false;
	await settle();
	expect(mocks.pin.remove).toHaveBeenCalled();
	element.setAttribute("marker", "false");
	expect(element.marker).toBe(true);
	element.zoom = 4;
	await settle();
	expect(mocks.map.setZoom).toHaveBeenCalledWith(4, { animate: false });
	mocks.map.getZoom.mockReturnValue(19);
	const sync = mocks.map.on.mock.calls.find(
		([name]) => name === "zoomend",
	)?.[1] as () => void;
	sync();
	expect(element.zoom).toBe(19);
	expect(
		element.querySelector('[data-action="in"]')?.hasAttribute("disabled"),
	).toBe(true);
	mocks.map.getZoom.mockReturnValue(0);
	sync();
	expect(
		element.querySelector('[data-action="out"]')?.hasAttribute("disabled"),
	).toBe(true);
	element.lat = 100;
	element.lon = -200;
	element.zoom = 99;
	expect([element.lat, element.lon, element.zoom]).toEqual([90, -180, 19]);
	element.setAttribute("lat", "invalid");
	element.setAttribute("lon", "");
	expect([element.lat, element.lon]).toEqual([48.8566, 2.3522]);
	element.lat = 0;
	element.lon = 0;
	expect([element.lat, element.lon]).toEqual([0, 0]);
	element.remove();
	sync();
	resizeCallback([], {} as ResizeObserver);
});
it("reports tile and initialization failures and retries on a later update", async () => {
	mocks.create.mockImplementationOnce(() => {
		throw new Error("Map unavailable");
	});
	const element = fixture();
	await settle();
	expect(element.textContent).toContain("Map unavailable");
	element.zoom = 12;
	await settle();
	const error = mocks.tiles.on.mock.calls.find(
		([name]) => name === "tileerror",
	)?.[1] as () => void;
	error();
	expect(element.textContent).toContain("Some map tiles");
	const other = fixture();
	other.remove();
	await settle();
	vi.stubGlobal("ResizeObserver", undefined);
	const noObserver = fixture();
	await settle();
	noObserver.remove();
});
it("requests geolocation only on demand and ignores stale results", async () => {
	const getCurrentPosition = vi.fn();
	vi.stubGlobal("navigator", { geolocation: { getCurrentPosition } });
	const element = fixture();
	await settle();
	expect(getCurrentPosition).not.toHaveBeenCalled();
	element
		.querySelector('[data-action="locate"]')
		?.dispatchEvent(new Event("click"));
	expect(element.textContent).toContain("Waiting");
	const [success, failure] = getCurrentPosition.mock.calls[0] as unknown as [
		PositionCallback,
		PositionErrorCallback,
	];
	failure({ message: "Permission denied" } as GeolocationPositionError);
	expect(element.textContent).toContain("Permission denied");
	element.locate();
	success({ coords: { latitude: 1, longitude: 2 } } as GeolocationPosition);
	expect(element.lat).toBe(48.8566);
	const latest = getCurrentPosition.mock.calls[1]?.[0] as PositionCallback;
	latest({
		coords: { latitude: 48.39, longitude: -4.49 },
	} as GeolocationPosition);
	expect([element.lat, element.lon]).toEqual([48.39, -4.49]);
	await settle();
	element.locate();
	element.remove();
	const [lateSuccess, lateFailure] = getCurrentPosition.mock
		.calls[2] as unknown as [PositionCallback, PositionErrorCallback];
	lateSuccess({ coords: { latitude: 3, longitude: 4 } } as GeolocationPosition);
	lateFailure({ message: "late" } as GeolocationPositionError);
	expect(element.lat).toBe(48.39);
});
it("reports unavailable geolocation and cancels deferred updates on disconnect", async () => {
	vi.stubGlobal("navigator", { geolocation: undefined });
	const element = fixture();
	await settle();
	element.locate();
	expect(element.textContent).toContain("Geolocation is unavailable");
	element.zoom = 4;
	element.remove();
	element.zoom = 5;
	await settle();
	expect(mocks.create).toHaveBeenCalledOnce();
});

it("preserves and updates named locations, fitting only when needed", async () => {
	const element = fixture('marker title="Single"');
	const list = document.createElement("dl");
	list.innerHTML =
		"<dt>Brest</dt><dd>48.3904, -4.4861</dd><dt>Rennes</dt><dd>48.1173, -1.6778</dd>";
	element.append(list);
	expect(element.fitMarkers).toBe(false);
	element.fitMarkers = true;
	await settle();
	expect(element.querySelector("dl")).toBe(list);
	expect(mocks.marker.mock.calls.map(([point]) => point)).toEqual([
		[48.3904, -4.4861],
		[48.1173, -1.6778],
	]);
	expect(
		mocks.pin.bindPopup.mock.calls.map(([label]) => label.textContent),
	).toEqual(["Brest", "Rennes"]);
	expect(mocks.map.fitBounds).toHaveBeenCalledOnce();
	element.zoom = 8;
	await settle();
	expect(mocks.map.fitBounds).toHaveBeenCalledOnce();
	const definition = list.querySelector("dd");
	if (!definition) throw new Error("Missing coordinates");
	definition.textContent = "0, 0";
	await settle();
	expect(mocks.map.fitBounds).toHaveBeenCalledTimes(2);
	element.fitMarkers = false;
	await settle();
	element.setAttribute("fit-markers", "false");
	await settle();
	expect(element.fitMarkers).toBe(true);
	expect(mocks.map.fitBounds).toHaveBeenCalledTimes(3);
	element.remove();
	document.body.append(element);
	await settle();
	expect(element.querySelector("dl")).toBe(list);
	expect(mocks.map.fitBounds).toHaveBeenCalledTimes(4);
	list.remove();
	await settle();
	expect(mocks.marker.mock.calls.at(-1)?.[1].title).toBe("Single");
});

it("ignores invalid pairs without falling back to the single marker", async () => {
	const element = fixture("marker fit-markers");
	element.innerHTML =
		"<dl><dd>Orphan</dd><dt>Missing</dt><dt>Invalid</dt><dd>, 2</dd><dt>Outside</dt><dd>91, 0</dd><dt>Safe &lt;img&gt;</dt><dd>1, 2</dd><dt>No longitude</dt></dl>";
	await settle();
	expect(mocks.marker).toHaveBeenCalledOnce();
	expect(mocks.pin.bindPopup.mock.calls[0]?.[0].textContent).toBe("Safe <img>");
	expect(element.textContent).toContain("Some locations were ignored");
	const list = element.querySelector("dl");
	if (!list) throw new Error("Missing locations");
	list.replaceChildren();
	await settle();
	expect(element.textContent).not.toContain("Some locations were ignored");
	expect(mocks.marker).toHaveBeenCalledOnce();
});

/** Minimal GPX with a waypoint and two disconnected track segments. */
const gpx =
	'<gpx><wpt lat="1" lon="2"><name>&lt;b&gt;Start&lt;/b&gt;</name></wpt><trk><trkseg><trkpt lat="1" lon="2"/><trkpt lat="3" lon="4"/></trkseg><trkseg><trkpt lat="5" lon="6"/><trkpt lat="7" lon="8"/></trkseg></trk></gpx>';

it("loads GPX once, combines waypoints with authored markers and frames all geometry", async () => {
	const fetcher = vi.fn().mockResolvedValue(new Response(gpx));
	vi.stubGlobal("fetch", fetcher);
	const element = fixture();
	expect(element.src).toBe("");
	expect(element.fitContent).toBe(false);
	element.innerHTML = "<dl><dt>Extra</dt><dd>9, 10</dd></dl>";
	element.src = "/track.gpx";
	element.fitMarkers = true;
	await settle();
	await settle();
	expect(fetcher).toHaveBeenCalledOnce();
	expect(mocks.polyline.mock.calls.map(([points]) => points)).toEqual([
		[
			[1, 2],
			[3, 4],
		],
		[
			[5, 6],
			[7, 8],
		],
	]);
	expect(mocks.pin.bindPopup.mock.calls.at(-1)?.[0].textContent).toBe(
		"<b>Start</b>",
	);
	expect(mocks.map.fitBounds.mock.calls.at(-1)?.[0]).toEqual([
		[9, 10],
		[1, 2],
	]);
	element.fitContent = true;
	await settle();
	expect(mocks.map.fitBounds.mock.calls.at(-1)?.[0]).toEqual([
		[9, 10],
		[1, 2],
		[1, 2],
		[3, 4],
		[5, 6],
		[7, 8],
	]);
	const fitted = mocks.map.fitBounds.mock.calls.length;
	element.zoom = 8;
	await settle();
	expect(fetcher).toHaveBeenCalledOnce();
	expect(mocks.map.fitBounds).toHaveBeenCalledTimes(fitted);
	element.fitContent = false;
	await settle();
	element.setAttribute("fit-content", "false");
	expect(element.fitContent).toBe(true);
	element.src = "";
	await settle();
	expect(mocks.path.remove).toHaveBeenCalled();
	expect(mocks.marker.mock.calls.at(-1)?.[1].title).toBe("Extra");
	expect(element.hasAttribute("aria-busy")).toBe(false);
});

it("reports fetch and XML failures without discarding authored markers", async () => {
	const fetcher = vi
		.fn()
		.mockResolvedValueOnce(new Response("Not found", { status: 404 }))
		.mockResolvedValueOnce(new Response("<html>not GPX</html>"))
		.mockRejectedValueOnce("offline")
		.mockResolvedValueOnce(new Response(gpx));
	vi.stubGlobal("fetch", fetcher);
	const element = fixture('marker src="/missing.gpx"');
	await settle();
	await settle();
	expect(element.textContent).toContain("404");
	expect(mocks.marker).toHaveBeenCalled();
	element.title = "Still available";
	await settle();
	expect(element.textContent).toContain("404");
	expect(fetcher).toHaveBeenCalledOnce();
	element.src = "/invalid.gpx";
	await settle();
	await settle();
	expect(element.textContent).toContain("Expected GPX but received HTML");
	element.src = "/offline.gpx";
	await settle();
	await settle();
	expect(element.textContent).toContain("Unable to load GPX");
	element.src = "/valid.gpx";
	await settle();
	await settle();
	expect(element.querySelector("tp-callout")?.hidden).toBe(true);
	expect(mocks.polyline).toHaveBeenCalledTimes(2);
});

it("aborts obsolete requests and ignores late success or failure after source changes and removal", async () => {
	const pending: {
		resolve: (response: Response) => void;
		reject: (reason: Error) => void;
		signal: AbortSignal | null | undefined;
	}[] = [];
	vi.stubGlobal(
		"fetch",
		vi.fn(
			(_url: string, init: RequestInit) =>
				new Promise<Response>((resolve, reject) => {
					pending.push({ resolve, reject, signal: init.signal });
				}),
		),
	);
	const element = fixture('src="/first.gpx" fit-content');
	await settle();
	expect(element.getAttribute("aria-busy")).toBe("true");
	element.src = "/second.gpx";
	expect(pending[0]?.signal?.aborted).toBe(true);
	await settle();
	pending[0]?.resolve(new Response(gpx));
	await settle();
	expect(mocks.polyline).not.toHaveBeenCalled();
	pending[1]?.resolve(new Response(gpx));
	await settle();
	await settle();
	expect(mocks.polyline).toHaveBeenCalledTimes(2);
	element.src = "/third.gpx";
	await settle();
	element.remove();
	expect(pending[2]?.signal?.aborted).toBe(true);
	pending[2]?.reject(new Error("late failure"));
	await settle();
	expect(element.textContent).not.toContain("late failure");
	document.body.append(element);
	await settle();
	expect(pending).toHaveLength(4);
	element.remove();
	pending[3]?.resolve(new Response(gpx));
	await settle();
	expect(mocks.polyline).toHaveBeenCalledTimes(2);
});

it.each([
	{ elevations: [-5, 20, -5], labels: ["Min: -5 m", "Max: 20 m"] },
	{ elevations: [4, 4, 4], labels: ["Min / Max: 4 m"] },
])(
	"marks the first extrema, combining them for a flat profile: $elevations",
	async ({ elevations, labels }) => {
		const content = `<gpx><trk><trkseg>${elevations.map((elevation, index) => `<trkpt lat="0" lon="${index}"><ele>${elevation}</ele></trkpt>`).join("")}</trkseg></trk></gpx>`;
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(content)));
		const element = fixture('src="/extrema.gpx" elevation-profile');
		await settle();
		await settle();
		const markers = element.querySelectorAll(
			".tp-xy-plot-preview .tp-md-xy-graph-point-group",
		);
		expect(
			Array.from(
				markers,
				(marker) => marker.querySelector("text")?.textContent,
			),
		).toEqual(labels);
		expect(markers[0]?.querySelector("title")?.textContent).toContain("(0,");
	},
);

it("toggles an elevation profile without refetching, and clears it with the GPX source", async () => {
	const content =
		'<gpx><trk><trkseg><trkpt lat="0" lon="0"><ele>0</ele></trkpt><trkpt lat="0" lon="0.01"><ele>10</ele></trkpt></trkseg></trk></gpx>';
	const fetcher = vi
		.fn()
		.mockResolvedValueOnce(new Response(content))
		.mockResolvedValueOnce(new Response(gpx));
	vi.stubGlobal("fetch", fetcher);
	const element = fixture('src="/elevation.gpx"');
	expect(element.elevationProfile).toBe(false);
	await settle();
	await settle();
	expect(element.querySelector("tp-xy-plot")).toBeNull();
	element.elevationProfile = true;
	await settle();
	const plot = element.querySelector("tp-xy-plot");
	expect(plot?.querySelectorAll("svg")).toHaveLength(2);
	expect(plot?.textContent).toContain("Elevation (m)");
	expect(plot?.textContent).toContain("Min: 0 m");
	expect(plot?.textContent).toContain("Max: 10 m");
	expect(plot?.textContent).toContain("Mean: 5 m");
	expect(plot?.textContent).toContain("Median: 5 m");
	for (const svg of plot?.querySelectorAll("svg") ?? []) {
		expect(svg.querySelectorAll('path[stroke-dasharray="6 4"]')).toHaveLength(
			2,
		);
		expect(
			svg.querySelectorAll('g > line[stroke-dasharray="6 4"]'),
		).toHaveLength(2);
		expect(svg.querySelector("path")?.hasAttribute("stroke-dasharray")).toBe(
			false,
		);
	}
	expect(
		element.querySelector("[data-map-profile] tp-callout")?.textContent,
	).toBe(
		"Cumulative ascent (D+): 10 m · Cumulative descent (D−): 0 m · Minimum elevation: 0 m · Maximum elevation: 10 m",
	);
	element.zoom = 8;
	await settle();
	expect(element.querySelector("tp-xy-plot")).toBe(plot);
	expect(fetcher).toHaveBeenCalledOnce();
	element.elevationProfile = false;
	await settle();
	expect(element.querySelector("[data-map-profile]")).toBeNull();
	element.setAttribute("elevation-profile", "false");
	await settle();
	expect(element.elevationProfile).toBe(true);
	expect(element.querySelector("tp-xy-plot")).not.toBeNull();
	element.src = "/no-elevation.gpx";
	await settle();
	await settle();
	expect(element.querySelector("tp-xy-plot")).toBeNull();
	expect(element.querySelector("[data-map-profile]")?.textContent).toContain(
		"No elevation samples",
	);
	element.src = "";
	await settle();
	expect(element.querySelector("[data-map-profile]")).toBeNull();
});
