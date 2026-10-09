/** A named geographic point, with plain-text content only. */
export interface MapLocation {
	/** Latitude in decimal degrees. */
	lat: number;
	/** Longitude in decimal degrees. */
	lon: number;
	/** Human-readable marker title. */
	title: string;
}

/** Geometry extracted from GPX without executing or inserting its XML. */
export interface GpxData {
	/** Named waypoints. */
	locations: MapLocation[];
	/** Independent track segments and routes; gaps are never joined. */
	segments: [number, number][][];
	/** Continuous runs of altitude samples; distance is cumulative kilometres without inter-segment jumps. */
	elevationSegments: { x: number; y: number }[][];
}

/** Discrete elevation statistics; gaps never contribute to ascent or descent. */
export function elevationStatistics(segments: GpxData["elevationSegments"]): {
	/** Sum of positive consecutive elevation differences, in metres. */
	ascent: number;
	/** Absolute sum of negative consecutive elevation differences, in metres. */
	descent: number;
	/** Arithmetic mean of all recorded elevations, in metres. */
	mean: number;
	/** Median of all recorded elevations, in metres. */
	median: number;
} | null {
	const elevations = segments.flatMap((segment) =>
		segment.map((point) => point.y),
	);
	if (!elevations.length) return null;
	let ascent = 0;
	let descent = 0;
	segments.forEach((segment) => {
		segment.forEach((point, index) => {
			const previous = segment[index - 1];
			if (!previous) return;
			const difference = point.y - previous.y;
			ascent += Math.max(0, difference);
			descent += Math.max(0, -difference);
		});
	});
	elevations.sort((a, b) => a - b);
	const lower = elevations[Math.floor((elevations.length - 1) / 2)] ?? 0;
	const upper = elevations[Math.floor(elevations.length / 2)] ?? 0;
	return {
		ascent,
		descent,
		mean:
			elevations.reduce((sum, elevation) => sum + elevation, 0) /
			elevations.length,
		median: (lower + upper) / 2,
	};
}

/** Great-circle distance in kilometres, using Leaflet's mean Earth radius. */
export function geographicDistance(
	a: [number, number],
	b: [number, number],
): number {
	const radians = Math.PI / 180;
	const latitude = Math.sin(((b[0] - a[0]) * radians) / 2);
	const longitude = Math.sin(((b[1] - a[1]) * radians) / 2);
	const h =
		latitude * latitude +
		Math.cos(a[0] * radians) * Math.cos(b[0] * radians) * longitude * longitude;
	return (
		6371 *
		2 *
		Math.atan2(Math.sqrt(Math.min(1, h)), Math.sqrt(Math.max(0, 1 - h)))
	);
}

/** Parses GPX 1.0/1.1 geometry; rejects unsafe XML and invalid coordinates. */
export function parseGpx(source: string): GpxData {
	if (source.length > 5_000_000)
		throw new Error("GPX exceeds the 5,000,000-character text limit.");
	if (/^\s*(?:<!doctype\s+html\b|<html[\s>])/i.test(source))
		throw new Error("Expected GPX but received HTML. Check the source URL.");
	if (/<!DOCTYPE|<!ENTITY/i.test(source))
		throw new Error(
			"GPX document types and custom entities are not supported.",
		);
	const document = new DOMParser().parseFromString(source, "application/xml");
	const root = document.documentElement;
	const namespace = root.namespaceURI;
	if (
		document.getElementsByTagName("parsererror").length ||
		root.localName !== "gpx" ||
		![
			null,
			"",
			"http://www.topografix.com/GPX/1/0",
			"http://www.topografix.com/GPX/1/1",
		].includes(namespace)
	) {
		throw new Error("Invalid GPX XML document.");
	}
	/** Selects direct GPX children, excluding foreign extension elements. */
	const children = (parent: Element, name: string): Element[] => {
		const result: Element[] = [];
		for (
			let child = parent.firstElementChild;
			child;
			child = child.nextElementSibling
		) {
			if (child.localName === name && child.namespaceURI === namespace)
				result.push(child);
		}
		return result;
	};
	let count = 0;
	/** Validates coordinates before any segment is drawn, so invalid points cannot bridge a gap. */
	const point = (element: Element): [number, number] => {
		if (++count > 50_000)
			throw new Error("GPX exceeds the 50,000 point limit.");
		const lat = element.getAttribute("lat") ?? "";
		const lon = element.getAttribute("lon") ?? "";
		const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
		if (
			!decimal.test(lat.trim()) ||
			!decimal.test(lon.trim()) ||
			!Number.isFinite(Number(lat)) ||
			!Number.isFinite(Number(lon)) ||
			Math.abs(Number(lat)) > 90 ||
			Math.abs(Number(lon)) > 180
		) {
			throw new Error(
				"Invalid GPX coordinates: expected latitude from -90 to 90 and longitude from -180 to 180.",
			);
		}
		return [Number(lat), Number(lon)];
	};
	const locations = children(root, "wpt").map((element) => {
		const [lat, lon] = point(element);
		return {
			lat,
			lon,
			title: children(element, "name")[0]?.textContent.trim() || "Waypoint",
		};
	});
	const segments: [number, number][][] = [];
	const elevationSegments: { x: number; y: number }[][] = [];
	let distance = 0;
	/** Keeps each route or track segment independent; one point cannot define a line. */
	const segment = (parent: Element, name: string): void => {
		const elements = children(parent, name);
		const points = elements.map(point);
		if (points.length < 2) return;
		segments.push(points);
		let run: { x: number; y: number }[] = [];
		elements.forEach((element, index) => {
			const previous = points[index - 1];
			const current = points[index];
			if (previous && current)
				distance += geographicDistance(previous, current);
			const raw = children(element, "ele")[0]?.textContent.trim() ?? "";
			const elevation = Number(raw);
			if (
				/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw) &&
				Number.isFinite(elevation)
			) {
				if (!run.length) elevationSegments.push(run);
				run.push({ x: distance, y: elevation });
			} else run = [];
		});
	};
	children(root, "rte").forEach((route) => {
		segment(route, "rtept");
	});
	children(root, "trk").forEach((track) => {
		children(track, "trkseg").forEach((part) => {
			segment(part, "trkpt");
		});
	});
	if (!locations.length && !segments.length)
		throw new Error("GPX contains no waypoints or drawable routes or tracks.");
	return { locations, segments, elevationSegments };
}
