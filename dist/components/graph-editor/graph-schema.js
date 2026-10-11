import { a as e, c as t, i as n, l as r, n as i, o as a, s as o, t as s, u as c } from "../../chunks/schemas.js";
//#region src/components/graph-editor/graph-schema.ts
var l = a({
	x: e().finite(),
	y: e().finite()
}), u = s([
	"north",
	"east",
	"south",
	"west"
]), d = a({
	id: t().min(1),
	label: t().optional(),
	position: e().finite().min(0).max(1)
}).passthrough(), f = a({
	id: t().min(1),
	type: t().min(1),
	x: e().finite(),
	y: e().finite(),
	label: t().optional(),
	data: o(t(), c()).optional(),
	state: o(t(), c()).optional()
}).passthrough(), p = a({
	id: t().min(1),
	source: t().min(1).optional(),
	target: t().min(1).optional(),
	sourcePoint: l.optional(),
	targetPoint: l.optional(),
	sourcePort: u.optional(),
	targetPort: u.optional(),
	type: t().optional(),
	direction: s([
		"none",
		"forward",
		"backward",
		"both"
	]).optional(),
	routing: s(["straight", "orthogonal"]).optional(),
	elbows: r([
		n(1),
		n(2),
		n(3)
	]).optional(),
	departure: s(["horizontal", "vertical"]).optional(),
	turns: s(["alternating", "same"]).optional(),
	bendX: e().finite().optional(),
	bendY: e().finite().optional(),
	label: t().optional(),
	data: o(t(), c()).optional(),
	state: o(t(), c()).optional()
}).passthrough().superRefine((e, t) => {
	if (e.data?.measurements !== void 0) {
		let n = i(d).safeParse(e.data.measurements);
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
}), m = a({
	version: n(1),
	title: t().optional(),
	nodes: i(f),
	edges: i(p),
	data: o(t(), c()).optional()
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