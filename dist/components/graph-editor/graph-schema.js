import { an as e, cn as t, dn as n, fn as r, in as i, ln as a, pn as o, sn as s, un as c } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/graph-editor/graph-schema.ts
var l = a({
	x: t().finite(),
	y: t().finite()
}), u = i([
	"north",
	"east",
	"south",
	"west"
]), d = a({
	id: n().min(1),
	label: n().optional(),
	position: t().finite().min(0).max(1)
}).passthrough(), f = a({
	id: n().min(1),
	type: n().min(1),
	x: t().finite(),
	y: t().finite(),
	label: n().optional(),
	data: c(n(), o()).optional(),
	state: c(n(), o()).optional()
}).passthrough(), p = a({
	id: n().min(1),
	source: n().min(1).optional(),
	target: n().min(1).optional(),
	sourcePoint: l.optional(),
	targetPoint: l.optional(),
	sourcePort: u.optional(),
	targetPort: u.optional(),
	type: n().optional(),
	direction: i([
		"none",
		"forward",
		"backward",
		"both"
	]).optional(),
	routing: i(["straight", "orthogonal"]).optional(),
	elbows: r([
		s(1),
		s(2),
		s(3)
	]).optional(),
	departure: i(["horizontal", "vertical"]).optional(),
	turns: i(["alternating", "same"]).optional(),
	bendX: t().finite().optional(),
	bendY: t().finite().optional(),
	label: n().optional(),
	data: c(n(), o()).optional(),
	state: c(n(), o()).optional()
}).passthrough().superRefine((t, n) => {
	if (t.data?.measurements !== void 0) {
		let r = e(d).safeParse(t.data.measurements);
		r.success ? new Set(r.data.map((e) => e.id)).size !== r.data.length && n.addIssue({
			code: "custom",
			path: ["data", "measurements"],
			message: "Measurement ids must be unique on an edge."
		}) : n.addIssue({
			code: "custom",
			path: ["data", "measurements"],
			message: "Measurements must have a unique id and a position between 0 and 1."
		});
	}
	t.source === void 0 && t.sourcePoint === void 0 && n.addIssue({
		code: "custom",
		path: ["source"],
		message: "A source node or sourcePoint is required."
	}), t.target === void 0 && t.targetPoint === void 0 && n.addIssue({
		code: "custom",
		path: ["target"],
		message: "A target node or targetPoint is required."
	});
}), m = a({
	version: s(1),
	title: n().optional(),
	nodes: e(f),
	edges: e(p),
	data: c(n(), o()).optional()
}).passthrough().superRefine((e, t) => {
	let n = /* @__PURE__ */ new Set(), r = new Map(e.nodes.map((e) => [e.id, e]));
	for (let [r, i] of e.nodes.entries()) n.has(i.id) && t.addIssue({
		code: "custom",
		path: [
			"nodes",
			r,
			"id"
		],
		message: `Duplicate id: ${i.id}`
	}), n.add(i.id);
	for (let [i, a] of e.edges.entries()) n.has(a.id) && t.addIssue({
		code: "custom",
		path: [
			"edges",
			i,
			"id"
		],
		message: `Duplicate id: ${a.id}`
	}), n.add(a.id), a.source !== void 0 && !r.has(a.source) && t.addIssue({
		code: "custom",
		path: [
			"edges",
			i,
			"source"
		],
		message: `Unknown node: ${a.source}`
	}), a.target !== void 0 && !r.has(a.target) && t.addIssue({
		code: "custom",
		path: [
			"edges",
			i,
			"target"
		],
		message: `Unknown node: ${a.target}`
	}), a.source !== void 0 && a.source === a.target && r.get(a.source)?.type === "hub" && t.addIssue({
		code: "custom",
		path: ["edges", i],
		message: "Self-links are not allowed on hubs."
	});
});
function h(e) {
	return e.issues.map((e) => `${e.path.length === 0 ? "graph" : e.path.join(".")}: ${e.message}`).join("\n");
}
//#endregion
export { m as TpGraphDocumentSchema, h as formatGraphSchemaError };

//# sourceMappingURL=graph-schema.js.map