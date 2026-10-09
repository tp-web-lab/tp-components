import { an as e, cn as t, dn as n, fn as r, in as i, ln as a, on as o, sn as s } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/question/question-src-schema.ts
var c = i([
	"markdown",
	"md",
	"html",
	"none"
]), l = a({
	title: n().optional(),
	markup: c.default("markdown").optional(),
	prompt: n().min(1),
	form: e(n().min(1)).min(2),
	feedback: e(n()).optional(),
	solution: n().optional()
}), u = a({
	answer: r([t().int().min(1), n().regex(/^\d+$/, "Expected a 1-based integer index")]),
	random: o().optional(),
	name: n().optional(),
	orientation: n().optional(),
	value: n().optional()
}), d = l.extend({ attributes: u }), f = a({
	answer: r([
		s(""),
		n().regex(/^\d+(,\s*\d+)*$/, "Expected comma-separated 1-based indexes"),
		e(t().int().min(1))
	]),
	random: o().optional(),
	name: n().optional(),
	orientation: n().optional(),
	value: n().optional()
}), p = l.extend({ attributes: f }), m = a({ answer: r([n().min(1), e(n().min(1)).min(1)]) }), h = a({
	title: n().optional(),
	markup: c.default("markdown").optional(),
	prompt: n().min(1),
	form: n().min(1),
	feedback: e(n()).optional(),
	solution: n().optional(),
	attributes: m
});
//#endregion
export { h as FillBlankQuestionSrcSchema, p as MultiChoiceQuestionSrcSchema, d as SingleChoiceQuestionSrcSchema };

