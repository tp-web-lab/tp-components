import { a as e, c as t, i as n, l as r, n as i, o as a, r as o, t as s } from "../../chunks/schemas.js";
//#region src/components/question/question-src-schema.ts
var c = s([
	"markdown",
	"md",
	"html",
	"none"
]), l = a({
	title: t().optional(),
	markup: c.default("markdown").optional(),
	prompt: t().min(1),
	form: i(t().min(1)).min(2),
	feedback: i(t()).optional(),
	solution: t().optional()
}), u = a({
	answer: r([e().int().min(1), t().regex(/^\d+$/, "Expected a 1-based integer index")]),
	random: o().optional(),
	name: t().optional(),
	orientation: t().optional(),
	value: t().optional()
}), d = l.extend({ attributes: u }), f = a({
	answer: r([
		n(""),
		t().regex(/^\d+(,\s*\d+)*$/, "Expected comma-separated 1-based indexes"),
		i(e().int().min(1))
	]),
	random: o().optional(),
	name: t().optional(),
	orientation: t().optional(),
	value: t().optional()
}), p = l.extend({ attributes: f }), m = a({ answer: r([t().min(1), i(t().min(1)).min(1)]) }), h = a({
	title: t().optional(),
	markup: c.default("markdown").optional(),
	prompt: t().min(1),
	form: t().min(1),
	feedback: i(t()).optional(),
	solution: t().optional(),
	attributes: m
});
//#endregion
export { h as FillBlankQuestionSrcSchema, p as MultiChoiceQuestionSrcSchema, d as SingleChoiceQuestionSrcSchema };

//# sourceMappingURL=question-src-schema.js.map