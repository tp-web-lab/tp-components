import { expect, it } from "vitest";
import { elevationStatistics, geographicDistance, parseGpx } from "./gpx.js";

it("computes discrete statistics without weighting by distance or bridging gaps", () => {
	const segments = [
		[
			{ x: 0, y: -5 },
			{ x: 1, y: 10 },
			{ x: 10, y: 3 },
		],
		[
			{ x: 10, y: 100 },
			{ x: 11, y: 90 },
		],
	];
	expect(elevationStatistics(segments)).toEqual({
		ascent: 15,
		descent: 17,
		mean: 39.6,
		median: 10,
	});
	expect(segments[0]?.[0]?.y).toBe(-5);
	expect(
		elevationStatistics([
			[
				{ x: 0, y: 2 },
				{ x: 2, y: 6 },
			],
		]),
	).toEqual({ ascent: 4, descent: 0, mean: 4, median: 4 });
	expect(elevationStatistics([[{ x: 0, y: 7 }]])).toEqual({
		ascent: 0,
		descent: 0,
		mean: 7,
		median: 7,
	});
	expect(elevationStatistics([])).toBeNull();
	expect(elevationStatistics([[]])).toBeNull();
});

it("preserves track gaps, separate routes and literal waypoint titles", () => {
	const result = parseGpx(`<gpx xmlns="http://www.topografix.com/GPX/1/1">
	<wpt lat="0" lon="0"><name>&lt;img src=x&gt;</name></wpt><wpt lat="1" lon="2"/>
	<trk><trkseg><trkpt lat="1" lon="2"/><trkpt lat="3" lon="4"/></trkseg>
	<trkseg><trkpt lat="5" lon="6"/><trkpt lat="7" lon="8"/></trkseg></trk>
	<rte><rtept lat="9" lon="10"/><rtept lat="11" lon="12"/></rte>
	<extensions><wpt lat="50" lon="50"/></extensions><wpt xmlns="urn:foreign" lat="50" lon="50"/>
	</gpx>`);
	expect(result.locations).toEqual([
		{ lat: 0, lon: 0, title: "<img src=x>" },
		{ lat: 1, lon: 2, title: "Waypoint" },
	]);
	expect(result.segments).toEqual([
		[
			[9, 10],
			[11, 12],
		],
		[
			[1, 2],
			[3, 4],
		],
		[
			[5, 6],
			[7, 8],
		],
	]);
});

it("accepts prefixed GPX 1.0 and unnamespaced documents", () => {
	expect(
		parseGpx(
			'<g:gpx xmlns:g="http://www.topografix.com/GPX/1/0"><g:wpt lat="-90" lon="180"><g:name>South</g:name></g:wpt></g:gpx>',
		).locations[0]?.title,
	).toBe("South");
	expect(
		parseGpx(
			'<gpx><wpt lat=".5" lon="-0.5"/><trk><trkseg/><trkseg><trkpt lat="1" lon="2"/></trkseg></trk></gpx>',
		).segments,
	).toEqual([]);
});

it.each([
	"",
	"<gpx>",
	"<html/>",
	'<gpx xmlns="urn:wrong"/>',
	'<!DOCTYPE gpx [<!ENTITY attack "expanded">]><gpx/>',
	'<gpx><wpt lat="" lon="0"/></gpx>',
	'<gpx><wpt lon="0"/></gpx>',
	'<gpx><wpt lat="91" lon="0"/></gpx>',
	'<gpx><wpt lat="0" lon="-181"/></gpx>',
	'<gpx><wpt lat="NaN" lon="1"/></gpx>',
	'<gpx><wpt lat="0x10" lon="1"/></gpx>',
	'<gpx><wpt lat="1" lon="Infinity"/></gpx>',
	"<gpx/>",
	'<gpx><trk><trkseg><trkpt lat="1" lon="2"/><trkpt lat="bad" lon="2"/><trkpt lat="3" lon="4"/></trkseg></trk></gpx>',
])("rejects malformed, unsafe or unusable GPX: %s", (source) => {
	expect(() => parseGpx(source)).toThrow();
});

it("bounds input size and total coordinate count", () => {
	expect(() => parseGpx(" ".repeat(5_000_001))).toThrow("text limit");
	expect(() =>
		parseGpx(`<gpx>${'<wpt lat="0" lon="0"/>'.repeat(50_001)}</gpx>`),
	).toThrow("point limit");
});

it("explains HTML fallback responses from a missing file on a development server", () => {
	expect(() =>
		parseGpx("<!DOCTYPE html><html><body>Application fallback</body></html>"),
	).toThrow("Check the source URL");
	expect(() => parseGpx("<html><body>Not found</body></html>")).toThrow(
		"received HTML",
	);
});

it("calculates geographic distances, including zero, dateline and antipodal points", () => {
	expect(geographicDistance([0, 0], [0, 0])).toBe(0);
	expect(geographicDistance([0, 0], [0, 1])).toBeCloseTo(111.1949, 3);
	expect(geographicDistance([0, 179], [0, -179])).toBeCloseTo(222.3899, 3);
	expect(geographicDistance([0, 0], [0, 180])).toBeCloseTo(Math.PI * 6371, 6);
});

it("keeps elevation gaps and accumulates distance without jumping between segments", () => {
	const result = parseGpx(`<gpx><trk><trkseg>
	<trkpt lat="0" lon="0"><ele>0</ele></trkpt>
	<trkpt lat="0" lon="1"><ele>10</ele></trkpt>
	<trkpt lat="0" lon="2"/>
	<trkpt lat="0" lon="3"><ele>-5</ele></trkpt>
	<trkpt lat="0" lon="4"><ele>NaN</ele></trkpt>
	<trkpt lat="0" lon="5"><ele></ele></trkpt>
	</trkseg><trkseg><trkpt lat="50" lon="50"><ele>100</ele></trkpt>
	<trkpt lat="50" lon="51"><ele>200</ele></trkpt></trkseg></trk></gpx>`);
	const runs = result.elevationSegments;
	expect(runs.map((run) => run.map((point) => point.y))).toEqual([
		[0, 10],
		[-5],
		[100, 200],
	]);
	expect(runs[0]?.[0]?.x).toBe(0);
	expect(runs[0]?.[1]?.x).toBeCloseTo(111.1949, 3);
	expect(runs[1]?.[0]?.x).toBeCloseTo(
		3 * geographicDistance([0, 0], [0, 1]),
		6,
	);
	expect(runs[2]?.[0]?.x).toBeCloseTo(
		5 * geographicDistance([0, 0], [0, 1]),
		6,
	);
});
