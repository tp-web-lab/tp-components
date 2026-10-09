import { afterEach, expect, it, vi } from "vitest";
import { renderMarkdownToHtml } from "../markdown/markdown.js";
import { DICTIONARY } from "./dictionary.js";
import {
	DEFAULT_OPTIONS,
	type LoremType,
	readLoremType,
	readOptionalInteger,
	renderLorem,
} from "./generator.js";
import { TpLoremIpsum } from "./lorem-ipsum.js";

/** Creates a connected, configured placeholder. */
function fixture(attributes = ""): TpLoremIpsum {
	const parent = document.createElement("div");
	parent.innerHTML = `<tp-lorem-ipsum ${attributes}></tp-lorem-ipsum>`;
	const element = parent.firstElementChild;
	if (!(element instanceof TpLoremIpsum))
		throw new Error("Missing lorem component");
	document.body.append(element);
	return element;
}
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});

it("matches tp-markdown's seeded output for every output type", async () => {
	for (const type of ["sentence", "title", "p", "dl", "ol", "ul"] as const) {
		const element = fixture(
			`type="${type}" length="2" words-per-sentence="4-6" sentences-per-paragraph="2" seed="42"`,
		);
		element.regenerate();
		const expected = await renderMarkdownToHtml(
			`::lorem{type="${type}" length="2" words-per-sentence="4-6" sentences-per-paragraph="2" seed="42"}`,
		);
		expect(element.innerHTML.trim()).toBe(expected.trim());
	}
});
it("uses the extension defaults and updates every attribute and property", async () => {
	const element = fixture();
	expect(element.type).toBe("p");
	expect(element.length).toBe("3-5");
	expect(element.wordsPerSentence).toBe("4-16");
	expect(element.sentencesPerParagraph).toBe("3-6");
	expect(element.seed).toBe("");
	element.type = "p";
	element.length = "2";
	element.wordsPerSentence = "4";
	element.sentencesPerParagraph = "2";
	element.seed = "17";
	await vi.waitFor(() => expect(element.querySelectorAll("p")).toHaveLength(2));
	expect(
		element.querySelector("p")?.textContent?.split(".").filter(Boolean),
	).toHaveLength(2);
	const html = element.innerHTML;
	element.regenerate();
	expect(element.innerHTML).toBe(html);
	element.seed = "18";
	await vi.waitFor(() => expect(element.innerHTML).not.toBe(html));
	element.setAttribute("type", "unknown");
	expect(element.type).toBe("p");
	element.length = "";
	element.wordsPerSentence = "";
	element.sentencesPerParagraph = "";
	expect(element.length).toBe("3-5");
	element.setAttribute("lang", "en");
	element.regenerate();
	element.remove();
	element.type = "title";
	const before = element.innerHTML;
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(element.innerHTML).toBe(before);
	document.body.append(element);
	await vi.waitFor(() => expect(element.querySelector("p")).toBeNull());
	expect(document.querySelectorAll("#tp-lorem-ipsum-styles")).toHaveLength(1);
});
it("supports reversed ranges, zero counts and the copied numeric helpers", () => {
	const options = {
		...DEFAULT_OPTIONS,
		seed: 1,
		wordsPerSentence: 3,
		sentencesPerParagraph: 1,
	};
	expect(renderLorem({ ...options, length: 2 }).match(/<p>/g)).toHaveLength(2);
	expect(renderLorem({ ...options, length: "2-2" }).match(/<p>/g)).toHaveLength(
		2,
	);
	expect(
		renderLorem({ ...options, length: "3-2" }).match(/<p>/g)?.length,
	).toBeGreaterThanOrEqual(2);
	expect(
		renderLorem({ ...options, length: "invalid" }).match(/<p>/g),
	).toHaveLength(1);
	expect(renderLorem({ ...options, length: "0" })).toBe("");
	expect(renderLorem({ ...options, type: "title", wordsPerSentence: 0 })).toBe(
		"",
	);
	expect(readLoremType(17)).toBe("p");
	expect(readOptionalInteger(undefined)).toBeUndefined();
	expect(readOptionalInteger(3.9)).toBe(3);
	expect(readOptionalInteger(Infinity)).toBeUndefined();
	expect(readOptionalInteger("")).toBeUndefined();
	expect(readOptionalInteger("42")).toBe(42);
});
it("keeps dictionary content escaped and uses random generation without a seed", () => {
	const original = DICTIONARY[0];
	if (original === undefined) throw new Error("Empty dictionary");
	vi.spyOn(Math, "random").mockReturnValue(0);
	DICTIONARY[0] = '<&">';
	try {
		expect(
			renderLorem({
				...DEFAULT_OPTIONS,
				type: "sentence",
				wordsPerSentence: 1,
			}),
		).toBe("&lt;&amp;&quot;&gt;.");
	} finally {
		DICTIONARY[0] = original;
	}
	vi.spyOn(Math, "random").mockReturnValue(1);
	expect(
		renderLorem({ ...DEFAULT_OPTIONS, type: "sentence", wordsPerSentence: 1 }),
	).toBe("Lorem.");
});
it("bounds allocation, reports excessive requests and recovers after correction", () => {
	const element = fixture('length="1000000000" seed="1"');
	element.regenerate();
	expect(element.querySelector("tp-callout")?.textContent).toContain("10,000");
	element.length = "1-99999";
	element.regenerate();
	expect(element.querySelector("tp-callout")).not.toBeNull();
	element.length = "100";
	element.wordsPerSentence = "100";
	element.sentencesPerParagraph = "2";
	element.regenerate();
	expect(element.querySelector("tp-callout")).not.toBeNull();
	element.length = "100";
	element.wordsPerSentence = "0";
	element.sentencesPerParagraph = "1000";
	element.regenerate();
	expect(element.querySelector("tp-callout")).not.toBeNull();
	element.length = "invalid";
	element.sentencesPerParagraph = "2";
	element.wordsPerSentence = "4";
	element.regenerate();
	expect(element.querySelectorAll("p")).toHaveLength(1);
	for (const type of ["title", "sentence", "dl"] as LoremType[]) {
		element.type = type;
		element.regenerate();
		expect(element.querySelector("tp-callout")).toBeNull();
	}
	element.length = "-1";
	element.type = "p";
	element.regenerate();
	expect(element.innerHTML).toBe("");
	const detached = fixture();
	detached.remove();
});
