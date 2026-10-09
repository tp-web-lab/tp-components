import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { exampleFile, markupExample } from "./component-basic-examples.mjs";
import { standardizeComponentExamples } from "./standardize-component-examples.mjs";

const directory = resolve(
	import.meta.dirname,
	"../public/docs/components/flip-card",
);
const faces = `<dl>
  <dt>recto</dt><dd><p>This is the content <strong>recto...</strong></p></dd>
  <dt>verso</dt><dd><p>...and here is the content <strong>verso.</strong></p></dd>
</dl>`;
const basic = `<tp-flip-card>\n${faces}\n</tp-flip-card>`;
const positions = [
	"top start",
	"top center",
	"top end",
	"bottom start",
	"bottom center",
	"bottom end",
	"none",
];

/** A one-item checkbox modifies a boolean attribute on a single live card. */
function booleanExample(attribute, label, instruction, card) {
	return `<p>${instruction}</p>
<tp-stack>
  <tp-checkbox-list id="flip-card-control" value="1" aria-label="Card settings"><ul><li>${label}</li></ul></tp-checkbox-list>
  ${card.replace("<tp-flip-card", '<tp-flip-card id="flip-card-preview"')}
</tp-stack>
<script type="module">
const selector = document.querySelector("#flip-card-control");
const card = document.querySelector("#flip-card-preview");
if (selector && card) {
  selector.addEventListener("tp-checkbox-list-change", (event) => {
    card.toggleAttribute("${attribute}", event.detail.value === "1");
  });${
		attribute === "flipped"
			? `
  // Keep the checkbox synchronized when the card's own button is used.
  card.addEventListener("tp-flip-card-change", (event) => {
    selector.setAttribute("value", event.detail.flipped ? "1" : "");
  });`
			: ""
	}
}
</script>`;
}
const examples = [
	{ label: "Basic usage", source: basic },
	{
		label: "Attribute: button-position",
		source: `<p>Choose the flip button position. With none, click the card itself or focus it and press Enter or Space.</p>
<tp-stack>
  <tp-radio-list id="flip-card-position" value="6" orientation="horizontal" aria-label="Flip button position"><ul>${positions.map((position) => `<li>${position}</li>`).join("")}</ul></tp-radio-list>
  <tp-flip-card id="flip-card-preview" button-position="bottom end">${faces}</tp-flip-card>
</tp-stack>
<script type="module">
const selector = document.querySelector("#flip-card-position");
const card = document.querySelector("#flip-card-preview");
const positions = ${JSON.stringify(positions)};
if (selector && card) {
  selector.addEventListener("tp-radio-list-change", (event) => {
    const position = positions[Number(event.detail.value) - 1];
    if (position) card.setAttribute("button-position", position);
  });
}
</script>`,
	},
	{
		label: "Attribute: disabled",
		source: booleanExample(
			"disabled",
			"Disable flipping",
			"Uncheck the checkbox to enable the flip button, then check it again to prevent flipping.",
			`<tp-flip-card disabled>${faces}</tp-flip-card>`,
		),
	},
	{
		label: "Attribute: fit-content",
		source: booleanExample(
			"fit-content",
			"Fit the card to its content",
			"Toggle the checkbox to compare the default card size with the size determined by its verso logo. Flip the card to inspect that content.",
			`<tp-flip-card fit-content>
  <dl>
    <dt>recto</dt><dd><p>This is the content <strong>recto...</strong></p></dd>
    <dt>verso</dt><dd><tp-icon name="logo-tp" size="12em" role="img" aria-label="tp-components logo"></tp-icon></dd>
  </dl>
</tp-flip-card>`,
		),
	},
	{
		label: "Attribute: flipped",
		source: booleanExample(
			"flipped",
			"Show the verso",
			"Toggle the checkbox to show the recto or verso. The checkbox also follows the card's flip button.",
			`<tp-flip-card flipped>${faces}</tp-flip-card>`,
		),
	},
	{
		label: "King of hearts",
		source: `<tp-flip-card style="--tp-flip-card-padding: 0">
  <dl>
    <dt>recto</dt>
    <dd><tp-icon src="/src/components/card/cards/hearts/hk.svg" size="100%" style="display: block" role="img" aria-label="King of hearts"></tp-icon></dd>
    <dt>verso</dt>
    <dd><tp-center intrinsic style="height: 100%; justify-content: center"><tp-icon name="logo-tp" size="10em" role="img" aria-label="tp-components logo"></tp-icon></tp-center></dd>
  </dl>
</tp-flip-card>`,
	},
];
for (const language of ["html", "md", "adoc", "rst"])
	writeFileSync(
		`${directory}/examples/examples.${language}`,
		exampleFile(
			language,
			"tp-flip-card",
			examples.map((example) => ({
				...example,
				source: markupExample(language, example.source),
			})),
		),
	);
const path = `${directory}/index.md`;
standardizeComponentExamples(["flip-card"]);
writeFileSync(
	path,
	readFileSync(path, "utf8").replace(
		/<tp-flip-card\b[^>]*>[\s\S]*?<\/tp-flip-card>/,
		basic,
	),
);
