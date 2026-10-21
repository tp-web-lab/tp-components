//#region src/components/slope-simulator/profiles.ts
function e(e) {
	let t = typeof e == "string" ? JSON.parse(e) : e;
	if (!t || typeof t != "object" || !("profiles" in t) || !Array.isArray(t.profiles) || !t.profiles.length) throw Error("Expected a nonempty profiles array.");
	let n = "speed-base" in t ? t["speed-base"] : void 0;
	if (n !== void 0 && (typeof n != "number" || !Number.isFinite(n) || n <= 0)) throw Error("Expected \"speed-base\" to be a finite positive number in km/h.");
	let r = /* @__PURE__ */ new Set();
	return t.profiles.map((e, t) => {
		if (!e || typeof e != "object" || !("id" in e) || typeof e.id != "string" || !e.id.trim() || !("name" in e) || typeof e.name != "string" || !e.name.trim() || !("points" in e) || !Array.isArray(e.points) || e.points.length < 2) throw Error(`Profile ${t + 1}: expected id, name and at least two points.`);
		if (r.has(e.id)) throw Error(`Duplicate profile id: ${e.id}.`);
		r.add(e.id);
		let i = e.points.map((t, n) => {
			if (!Array.isArray(t) || t.length !== 2 || !t.every((e) => typeof e == "number" && Number.isFinite(e))) throw Error(`Profile "${e.id}", point ${n + 1}: expected two finite numbers.`);
			return [t[0], t[1]];
		});
		for (let t = 1; t < i.length; t++) {
			let n = i[t - 1], r = i[t];
			if (!n || !r) continue;
			let a = r[0] - n[0];
			if (!(a > 0) || !Number.isFinite(a)) throw Error(`Profile "${e.id}", segment ${t}: distances must increase strictly.`);
			let o = (r[1] - n[1]) / a / 10;
			if (!Number.isFinite(o) || Math.abs(o) > 20.0000000001) throw Error(`Profile "${e.id}", segment ${t}: slope ${o.toFixed(6)}% exceeds ±20%.`);
		}
		let a = i[0], o = i[i.length - 1];
		if (!a || !o) throw Error("Missing endpoints.");
		let s = o[0] - a[0], c = i.reduce((e, t) => Math.min(e, t[1]), Infinity);
		if (!Number.isFinite(s) || !Number.isFinite(s * 1e3) || s * 1e3 == 0) throw Error(`Profile "${e.id}": invalid distance span.`);
		return {
			speedBase: n,
			source: {
				id: e.id,
				name: e.name,
				points: i
			},
			id: e.id,
			name: e.name,
			points: i.map(([e, t]) => [(e - a[0]) / s, (t - c) / (s * 1e3)])
		};
	});
}
//#endregion
export { e as parseProfiles };

//# sourceMappingURL=profiles.js.map