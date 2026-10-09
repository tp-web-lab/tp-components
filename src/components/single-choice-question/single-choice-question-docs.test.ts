import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { required } from "../../test-helpers/required.js";
import type { TpSingleChoiceQuestion } from "./single-choice-question.js";
import "./single-choice-question.js";

/** Author examples are parsed in an inert template before mounting one question. */
const source = readFileSync(
	"public/docs/components/single-choice-question/examples/examples.html",
	"utf8",
);

/** Mounts one example without executing its external MathJax scripts in jsdom. */
async function mountExample(label: string): Promise<TpSingleChoiceQuestion> {
	const container = document.createElement("template");
	container.innerHTML = source;
	const template = required(container.content.querySelector("template"));
	const example = required(
		template.content.querySelector(`[label="${label}"]`),
	);
	const question = required(example.querySelector("tp-single-choice-question"));
	document.body.append(question);
	await new Promise((resolve) => window.setTimeout(resolve, 0));
	return question;
}

/** Selects an item and submits the question through its public controls. */
function choiceValue(
	question: TpSingleChoiceQuestion,
	matches: (item: Element) => boolean,
): string {
	const index = Array.from(
		question.querySelectorAll("tp-radio-list li"),
	).findIndex(matches);
	expect(index).toBeGreaterThanOrEqual(0);
	return String(index + 1);
}

/** Submits the selected position after the choices have been shuffled. */
async function submit(
	question: TpSingleChoiceQuestion,
	value: string,
): Promise<string> {
	required(question.querySelector("tp-radio-list")).setAttribute(
		"value",
		value,
	);
	required(
		question.querySelector('tp-icon-button[data-action="submit"]'),
	).dispatchEvent(new Event("click"));
	await new Promise((resolve) => window.setTimeout(resolve, 0));
	return (
		required(question.querySelector("[data-tp-question-feedback-output]"))
			.textContent ?? ""
	);
}

afterEach(() => {
	document.body.replaceChildren();
});

describe("single-choice documentation examples", () => {
	it("keeps Basic usage, grouped Attributes and two complementary examples", () => {
		expect(source).not.toContain('label="Additional usage"');
		expect(source.match(/role="example"/g)).toHaveLength(4);
		expect(source).toContain('label="Attributes"');
		expect(source).not.toContain('label="Attribute:');
		expect(source).toContain("mathjax@4/tex-svg.js");
		expect(source).toContain('customElements.whenDefined("tp-radio-list")');
		const container = document.createElement("template");
		container.innerHTML = source;
		const template = required(container.content.querySelector("template"));
		expect(
			template.content.querySelectorAll(
				'[role="example"]:not([label^="Attribute:"]) tp-single-choice-question[random]',
			),
		).toHaveLength(3);
		for (const formula of source.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
			if (formula[1]?.includes(String.raw`\frac`))
				expect(formula[1]).toContain(String.raw`\displaystyle`);
		}
	});

	it("accepts only the reciprocal cosine square among four derivative choices", async () => {
		const question = await mountExample("Derivative of tan(x)");
		const items = question.querySelectorAll("tp-radio-list li");
		expect(items).toHaveLength(4);
		const wrong = choiceValue(
			question,
			(item) => item.textContent?.trim() === String.raw`\(\cos^{2}(x)\)`,
		);
		expect(await submit(question, wrong)).toContain("0/1");
	});

	it("awards the correct derivative a full score", async () => {
		const question = await mountExample("Derivative of tan(x)");
		const correct = choiceValue(
			question,
			(item) =>
				item.textContent?.includes(String.raw`\frac{1}{\cos^{2}(x)}`) ?? false,
		);
		expect(await submit(question, correct)).toContain("1/1");
	});

	it("preserves all five SVG images and accepts the heptagon", async () => {
		const question = await mountExample("Regular heptagon");
		const images = question.querySelectorAll("tp-radio-list img");
		expect(images).toHaveLength(5);
		const correct = choiceValue(
			question,
			(item) => item.querySelector('img[src$="/heptagon.svg"]') !== null,
		);
		expect(await submit(question, correct)).toContain("1/1");
	});

	it("rejects the nonagon with the matching feedback", async () => {
		const question = await mountExample("Regular heptagon");
		const wrong = choiceValue(
			question,
			(item) => item.querySelector('img[src$="/nonagon.svg"]') !== null,
		);
		const feedback = await submit(question, wrong);
		expect(feedback).toContain("0/1");
		expect(feedback).toContain("nine sides");
	});

	it("uses regular polygons with five through nine vertices", () => {
		for (const [index, name] of [
			"pentagon",
			"hexagon",
			"heptagon",
			"octagon",
			"nonagon",
		].entries()) {
			const svg = readFileSync(
				`public/docs/components/single-choice-question/examples/${name}.svg`,
				"utf8",
			);
			const points =
				required(svg.match(/points="([^"]+)"/))[1]
					?.split(" ")
					.map((point) => point.split(",").map(Number)) ?? [];
			expect(points).toHaveLength(index + 5);
			const lengths = points.map(([x = 0, y = 0], vertex) => {
				const [nextX = 0, nextY = 0] =
					points[(vertex + 1) % points.length] ?? [];
				return Math.hypot(nextX - x, nextY - y);
			});
			expect(Math.max(...lengths) - Math.min(...lengths)).toBeLessThan(0.003);
		}
	});
});
