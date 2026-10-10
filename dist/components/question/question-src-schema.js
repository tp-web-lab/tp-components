import { an as e, cn as t, fn as n, ln as r, on as i, pn as a, sn as o, un as s } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/question/question-src-schema.ts
var c = e([
	"markdown",
	"md",
	"html",
	"none"
]), l = s({
	title: n().optional(),
	markup: c.default("markdown").optional(),
	prompt: n().min(1),
	form: i(n().min(1)).min(2),
	feedback: i(n()).optional(),
	solution: n().optional()
}), u = s({
	answer: a([r().int().min(1), n().regex(/^\d+$/, "Expected a 1-based integer index")]),
	random: o().optional(),
	name: n().optional(),
	orientation: n().optional(),
	value: n().optional()
}), d = l.extend({ attributes: u }), f = s({
	answer: a([
		t(""),
		n().regex(/^\d+(,\s*\d+)*$/, "Expected comma-separated 1-based indexes"),
		i(r().int().min(1))
	]),
	random: o().optional(),
	name: n().optional(),
	orientation: n().optional(),
	value: n().optional()
}), p = l.extend({ attributes: f }), m = s({ answer: a([n().min(1), i(n().min(1)).min(1)]) }), h = s({
	title: n().optional(),
	markup: c.default("markdown").optional(),
	prompt: n().min(1),
	form: n().min(1),
	feedback: i(n()).optional(),
	solution: n().optional(),
	attributes: m
});
//#endregion
export { h as FillBlankQuestionSrcSchema, p as MultiChoiceQuestionSrcSchema, d as SingleChoiceQuestionSrcSchema };

//# sourceMappingURL=question-src-schema.js.map