export const nativeTheoremCases: {
	name: string;
	html: string;
	selectors: string[];
	attributes: [string, string, string][];
	texts: [string, string][];
}[] = [
	"theorem",
	"lemma",
	"proposition",
	"corollary",
	"definition",
	"example",
	"remark",
	"proof",
].map((type, index) => ({
	name: type,
	html: `<tp-theorem qed="${index % 2 ? "" : "◆"}" variant="${["none", "neutral", "brand", "info", "success", "warning", "danger"][index % 7]}" type="${type}" id="sample-${type}" number="${type === "proof" ? "" : "2.3"}" heading="A useful result" counter="results" numbering="section"><p>A <strong>useful</strong> statement.</p><p>Its explanation.</p></tp-theorem><p>See <a href="#sample-${type}">the result</a>.</p>`,
	selectors: [
		`tp-theorem[type="${type}"] > p strong`,
		`a[href="#sample-${type}"]`,
	],
	attributes: [
		["tp-theorem", "qed", index % 2 ? "" : "◆"],
		[
			"tp-theorem",
			"variant",
			["none", "neutral", "brand", "info", "success", "warning", "danger"][
				index % 7
			] || "neutral",
		],
		["tp-theorem", "type", type],
		["tp-theorem", "number", type === "proof" ? "" : "2.3"],
		["tp-theorem", "heading", "A useful result"],
		["tp-theorem", "counter", "results"],
		["tp-theorem", "numbering", "section"],
		["tp-theorem", "id", `sample-${type}`],
	],
	texts: [
		["tp-theorem > p:first-child", "A useful statement."],
		["tp-theorem > p:nth-child(2)", "Its explanation."],
	],
}));
