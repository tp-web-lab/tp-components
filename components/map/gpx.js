//#region src/components/map/gpx.ts
function e(e) {
	let t = e.flatMap((e) => e.map((e) => e.y));
	if (!t.length) return null;
	let n = 0, r = 0;
	e.forEach((e) => {
		e.forEach((t, i) => {
			let a = e[i - 1];
			if (!a) return;
			let o = t.y - a.y;
			n += Math.max(0, o), r += Math.max(0, -o);
		});
	}), t.sort((e, t) => e - t);
	let i = t[Math.floor((t.length - 1) / 2)] ?? 0, a = t[Math.floor(t.length / 2)] ?? 0;
	return {
		ascent: n,
		descent: r,
		mean: t.reduce((e, t) => e + t, 0) / t.length,
		median: (i + a) / 2
	};
}
function t(e, t) {
	let n = Math.PI / 180, r = Math.sin((t[0] - e[0]) * n / 2), i = Math.sin((t[1] - e[1]) * n / 2), a = r * r + Math.cos(e[0] * n) * Math.cos(t[0] * n) * i * i;
	return 6371 * 2 * Math.atan2(Math.sqrt(Math.min(1, a)), Math.sqrt(Math.max(0, 1 - a)));
}
function n(e) {
	if (e.length > 5e6) throw Error("GPX exceeds the 5,000,000-character text limit.");
	if (/^\s*(?:<!doctype\s+html\b|<html[\s>])/i.test(e)) throw Error("Expected GPX but received HTML. Check the source URL.");
	if (/<!DOCTYPE|<!ENTITY/i.test(e)) throw Error("GPX document types and custom entities are not supported.");
	let n = new DOMParser().parseFromString(e, "application/xml"), r = n.documentElement, i = r.namespaceURI;
	if (n.getElementsByTagName("parsererror").length || r.localName !== "gpx" || ![
		null,
		"",
		"http://www.topografix.com/GPX/1/0",
		"http://www.topografix.com/GPX/1/1"
	].includes(i)) throw Error("Invalid GPX XML document.");
	let a = (e, t) => {
		let n = [];
		for (let r = e.firstElementChild; r; r = r.nextElementSibling) r.localName === t && r.namespaceURI === i && n.push(r);
		return n;
	}, o = 0, s = (e) => {
		if (++o > 5e4) throw Error("GPX exceeds the 50,000 point limit.");
		let t = e.getAttribute("lat") ?? "", n = e.getAttribute("lon") ?? "", r = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
		if (!r.test(t.trim()) || !r.test(n.trim()) || !Number.isFinite(Number(t)) || !Number.isFinite(Number(n)) || Math.abs(Number(t)) > 90 || Math.abs(Number(n)) > 180) throw Error("Invalid GPX coordinates: expected latitude from -90 to 90 and longitude from -180 to 180.");
		return [Number(t), Number(n)];
	}, c = a(r, "wpt").map((e) => {
		let [t, n] = s(e);
		return {
			lat: t,
			lon: n,
			title: a(e, "name")[0]?.textContent.trim() || "Waypoint"
		};
	}), l = [], u = [], d = 0, f = (e, n) => {
		let r = a(e, n), i = r.map(s);
		if (i.length < 2) return;
		l.push(i);
		let o = [];
		r.forEach((e, n) => {
			let r = i[n - 1], s = i[n];
			r && s && (d += t(r, s));
			let c = a(e, "ele")[0]?.textContent.trim() ?? "", l = Number(c);
			/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(c) && Number.isFinite(l) ? (o.length || u.push(o), o.push({
				x: d,
				y: l
			})) : o = [];
		});
	};
	if (a(r, "rte").forEach((e) => {
		f(e, "rtept");
	}), a(r, "trk").forEach((e) => {
		a(e, "trkseg").forEach((e) => {
			f(e, "trkpt");
		});
	}), !c.length && !l.length) throw Error("GPX contains no waypoints or drawable routes or tracks.");
	return {
		locations: c,
		segments: l,
		elevationSegments: u
	};
}
//#endregion
export { e as elevationStatistics, t as geographicDistance, n as parseGpx };

