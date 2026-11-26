/** Publish the conversion regression inputs as interactive documentation examples. */
import { readFileSync, writeFileSync } from "node:fs";
import {
	nativeLatexSources,
	packageExamples,
} from "../src/utilities/markup-latex-package-fixtures.js";
import { richSources } from "../src/utilities/markup-matrix-fixtures.js";

const folder = "public/docs/components/markup-converter/examples";
const prefix = "/docs/components/markup-converter/examples/";
const cases: [string, string, string][] = [];
for (const [language, source] of Object.entries(nativeLatexSources)) {
	const extension = (
		{
			html: "html",
			markdown: "md",
			asciidoc: "adoc",
			restructuredtext: "rst",
		} as Record<string, string>
	)[language];
	const label = (
		{
			html: "HTML",
			markdown: "Markdown",
			asciidoc: "AsciiDoc",
			restructuredtext: "reStructuredText",
		} as Record<string, string>
	)[language];
	cases.push([
		`Native ${label} comparison`,
		`comparison-native.${extension}`,
		source,
	]);
}
const richLabels: Record<string, string> = {
	"rich media": "Media and subtitles comparison",
	"table layout": "Merged table comparison",
	"math and code": "Math and code comparison",
};
for (const [name, source] of Object.entries(richSources))
	cases.push([
		richLabels[name] ?? name,
		`comparison-${name.replaceAll(" ", "-")}.html`,
		source,
	]);
const latexLabels: Record<string, string> = {
	textEnvironments: "LaTeX text environments comparison",
	tables: "LaTeX flexible table comparison",
	rules: "LaTeX table rules comparison",
	lists: "LaTeX lists comparison",
	theorems: "LaTeX theorems and references comparison",
	units: "LaTeX units comparison",
	graphics: "LaTeX image transformations comparison",
	listings: "LaTeX code listings comparison",
	arrayTabularx: "LaTeX array and tabularx comparison",
	imakeidx: "LaTeX indexes comparison",
	coreMath: "LaTeX core math environments comparison",
	amsmath: "LaTeX AMS equations comparison",
	csquotes: "LaTeX multilingual quotations comparison",
};
for (const [name, label] of Object.entries(latexLabels)) {
	const filename =
		name === "textEnvironments"
			? "text-environments"
			: name === "arrayTabularx"
				? "array-tabularx"
				: name === "coreMath"
					? "core-math-environments"
					: name === "amsmath"
						? "ams-environments"
						: name;
	cases.push([
		label,
		`comparison-${filename}.tex`,
		packageExamples[name as keyof typeof packageExamples],
	]);
}
cases.push([
	"Index components comparison",
	"comparison-index-components.html",
	readFileSync(
		"public/docs/components/index/examples/introduction.html",
		"utf8",
	).trim(),
]);
for (const [, filename, source] of cases) {
	const publicSource = source
		.replaceAll("https://example.org/picture.svg", "/medias/image/canoe.svg")
		.replaceAll("https://example.org/image.svg", "/medias/image/canoe.svg")
		.replaceAll("https://example.org/movie.mp4", "/medias/video/chute-eau.mp4")
		.replaceAll(
			"https://example.org/movie.webm",
			"/medias/video/chute-eau.mp4?alternative",
		)
		.replaceAll("video/webm", "video/mp4")
		.replaceAll(
			"https://example.org/captions.vtt",
			`${prefix}comparison-captions.vtt`,
		)
		.replaceAll(
			"https://example.org/sound.ogg",
			"/medias/audio/glass-break.mp3",
		)
		.replaceAll("sample.svg", "/medias/image/canoe.svg")
		.replaceAll(
			"\\graphicspath{{images/}}",
			"\\graphicspath{{/medias/image/}}",
		);
	writeFileSync(`${folder}/${filename}`, `${publicSource}\n`);
}
writeFileSync(
	`${folder}/sample.js`,
	readFileSync("scripts/fixtures/sample.js", "utf8"),
);
writeFileSync(
	`${folder}/comparison-captions.vtt`,
	"WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nWater flowing over rocks.\n",
);
const start = "    <!-- conversion-comparisons:start -->",
	end = "    <!-- conversion-comparisons:end -->";
const examples = cases
	.map(
		([label, file]) =>
			`    <div role="example" label="${label}">\n      <tp-markup-converter src="${prefix}${file}"></tp-markup-converter>\n    </div>`,
	)
	.join("\n\n");
const path = `${folder}/examples.html`,
	current = readFileSync(path, "utf8"),
	block = `${start}\n${examples}\n${end}\n`;
writeFileSync(
	path,
	current.includes(start)
		? current.slice(0, current.indexOf(start)) +
				block +
				current.slice(current.indexOf(end) + end.length + 1)
		: current.replace("  </template>", `${block}  </template>`),
);
console.log(`Published ${cases.length} conversion comparison examples.`);
