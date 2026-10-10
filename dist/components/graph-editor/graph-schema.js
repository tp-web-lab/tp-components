import { an as e, cn as t, dn as n, fn as r, ln as i, mn as a, on as o, pn as s, un as c } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/graph-editor/graph-schema.ts
var l = c({
	x: i().finite(),
	y: i().finite()
}), u = e([
	"north",
	"east",
	"south",
	"west"
]), d = c({
	id: r().min(1),
	label: r().optional(),
	position: i().finite().min(0).max(1)
}).passthrough(), f = c({
	id: r().min(1),
	type: r().min(1),
	x: i().finite(),
	y: i().finite(),
	label: r().optional(),
	data: n(r(), a()).optional(),
	state: n(r(), a()).optional()
}).passthrough(), p = c({
	id: r().min(1),
	source: r().min(1).optional(),
	target: r().min(1).optional(),
	sourcePoint: l.optional(),
	targetPoint: l.optional(),
	sourcePort: u.optional(),
	targetPort: u.optional(),
	type: r().optional(),
	direction: e([
		"none",
		"forward",
		"backward",
		"both"
	]).optional(),
	routing: e(["straight", "orthogonal"]).optional(),
	elbows: s([
		t(1),
		t(2),
		t(3)
	]).optional(),
	departure: e(["horizontal", "vertical"]).optional(),
	turns: e(["alternating", "same"]).optional(),
	bendX: i().finite().optional(),
	bendY: i().finite().optional(),
	label: r().optional(),
	data: n(r(), a()).optional(),
	state: n(r(), a()).optional()
}).passthrough().superRefine((e, t) => {
	if (e.data?.measurements !== void 0) {
		let n = o(d).safeParse(e.data.measurements);
		n.success ? new Set(n.data.map((e) => e.id)).size !== n.data.length && t.addIssue({
			code: "custom",
			path: ["data", "measurements"],
			message: "Measurement ids must be unique on an edge."
		}) : t.addIssue({
			code: "custom",
			path: ["data", "measurements"],
			message: "Measurements must have a unique id and a position between 0 and 1."
		});
	}
	e.source === void 0 && e.sourcePoint === void 0 && t.addIssue({
		code: "custom",
		path: ["source"],
		message: "A source node or sourcePoint is required."
	}), e.target === void 0 && e.targetPoint === void 0 && t.addIssue({
		code: "custom",
		path: ["target"],
		message: "A target node or targetPoint is required."
	});
}), m = c({
	version: t(1),
	title: r().optional(),
	nodes: o(f),
	edges: o(p),
	data: n(r(), a()).optional()
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