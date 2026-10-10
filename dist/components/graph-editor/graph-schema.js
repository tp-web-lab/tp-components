import { _n as e, cn as t, dn as n, fn as r, gn as i, hn as a, ln as o, mn as s, pn as c } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/graph-editor/graph-schema.ts
var l = c({
	x: r().finite(),
	y: r().finite()
}), u = t([
	"north",
	"east",
	"south",
	"west"
]), d = c({
	id: a().min(1),
	label: a().optional(),
	position: r().finite().min(0).max(1)
}).passthrough(), f = c({
	id: a().min(1),
	type: a().min(1),
	x: r().finite(),
	y: r().finite(),
	label: a().optional(),
	data: s(a(), e()).optional(),
	state: s(a(), e()).optional()
}).passthrough(), p = c({
	id: a().min(1),
	source: a().min(1).optional(),
	target: a().min(1).optional(),
	sourcePoint: l.optional(),
	targetPoint: l.optional(),
	sourcePort: u.optional(),
	targetPort: u.optional(),
	type: a().optional(),
	direction: t([
		"none",
		"forward",
		"backward",
		"both"
	]).optional(),
	routing: t(["straight", "orthogonal"]).optional(),
	elbows: i([
		n(1),
		n(2),
		n(3)
	]).optional(),
	departure: t(["horizontal", "vertical"]).optional(),
	turns: t(["alternating", "same"]).optional(),
	bendX: r().finite().optional(),
	bendY: r().finite().optional(),
	label: a().optional(),
	data: s(a(), e()).optional(),
	state: s(a(), e()).optional()
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
	version: n(1),
	title: a().optional(),
	nodes: o(f),
	edges: o(p),
	data: s(a(), e()).optional()
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