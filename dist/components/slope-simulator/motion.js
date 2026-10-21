//#region src/components/slope-simulator/motion.ts
var e = [
	{
		name: "Rolling stage",
		points: [
			[0, 0],
			[.2, .012],
			[.38, .002],
			[.58, .022],
			[.78, .006],
			[1, .016]
		]
	},
	{
		name: "Mountain passes",
		points: [
			[0, 0],
			[.12, .003],
			[.36, .045],
			[.52, .015],
			[.74, .055],
			[.9, .024],
			[1, .02]
		]
	},
	{
		name: "Summit finish",
		points: [
			[0, 0],
			[.2, .004],
			[.35, .016],
			[.5, .008],
			[.72, .045],
			[1, .095]
		]
	}
];
function t(e, t, n = 1) {
	for (let r = 0; r < e.length - 1; r++) {
		let i = e[r + 1];
		if (i && (t < i[0] || n < 0 && t === i[0])) return r;
	}
	return e.length - 2;
}
function n(e, n, r = 1) {
	let i = t(e, n, r), a = e[i], o = e[i + 1];
	if (!a || !o) return {
		altitude: 0,
		grade: 0
	};
	let s = (o[1] - a[1]) / (o[0] - a[0]);
	return {
		altitude: a[1] + (n - a[0]) * s,
		grade: s * 100
	};
}
function r(e, r, i) {
	if (!Number.isFinite(i)) return r;
	let a = Math.sign(i), o = Math.abs(i), s = r;
	for (let r = 0; r < e.length && o > 0; r++) {
		let r = t(e, s, a), i = e[a > 0 ? r + 1 : r];
		if (!i) break;
		let c = Math.exp(n(e, s, a).grade * a * Math.log(4) / 20), l = Math.abs(i[0] - s), u = Math.min(l, o / c);
		if (s += a * u, o = Math.max(0, o - u * c), u === l && (s = i[0]), s <= 0 || s >= 1) break;
	}
	return Math.max(0, Math.min(1, s));
}
//#endregion
export { r as advance, e as profiles, n as sample, t as segmentAt };

//# sourceMappingURL=motion.js.map