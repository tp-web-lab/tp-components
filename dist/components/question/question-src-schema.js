import { cn as e, dn as t, fn as n, gn as r, hn as i, ln as a, pn as o, un as s } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/question/question-src-schema.ts
var c = e([
	"markdown",
	"md",
	"html",
	"none"
]), l = o({
	title: i().optional(),
	markup: c.default("markdown").optional(),
	prompt: i().min(1),
	form: a(i().min(1)).min(2),
	feedback: a(i()).optional(),
	solution: i().optional()
}), u = o({
	answer: r([n().int().min(1), i().regex(/^\d+$/, "Expected a 1-based integer index")]),
	random: s().optional(),
	name: i().optional(),
	orientation: i().optional(),
	value: i().optional()
}), d = l.extend({ attributes: u }), f = o({
	answer: r([
		t(""),
		i().regex(/^\d+(,\s*\d+)*$/, "Expected comma-separated 1-based indexes"),
		a(n().int().min(1))
	]),
	random: s().optional(),
	name: i().optional(),
	orientation: i().optional(),
	value: i().optional()
}), p = l.extend({ attributes: f }), m = o({ answer: r([i().min(1), a(i().min(1)).min(1)]) }), h = o({
	title: i().optional(),
	markup: c.default("markdown").optional(),
	prompt: i().min(1),
	form: i().min(1),
	feedback: a(i()).optional(),
	solution: i().optional(),
	attributes: m
});
//#endregion
export { h as FillBlankQuestionSrcSchema, p as MultiChoiceQuestionSrcSchema, d as SingleChoiceQuestionSrcSchema };

//# sourceMappingURL=question-src-schema.js.map