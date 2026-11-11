import { readFileSync } from "node:fs";
import { afterEach, expect, it } from "vitest";
import { htmlExample } from "../../test-helpers/documentation.js";
import { required } from "../../test-helpers/required.js";
import type { TpFlipCard } from "./flip-card.js";
import "./flip-card.js";

afterEach(() => document.body.replaceChildren());

/** Read the generated configuration shared by all four markup panels. */
function configuration(): {
	source: string;
	settings: {
		name: string;
		kind: string;
		value: string | boolean;
		values?: string[];
	}[];
} {
	const script = readFileSync(
		"public/docs/components/flip-card/examples/attributes.js",
		"utf8",
	);
	return JSON.parse(
		required(script.match(/initializeAttributes\(([\s\S]*)\);/)?.[1]),
	);
}
function preview(): TpFlipCard {
	const config = configuration();
	const template = document.createElement("template");
	template.innerHTML = config.source;
	return required(template.content.querySelector("tp-flip-card"));
}

it("publishes default attribute settings for the Component viewer", () => {
	const settings = configuration().settings;
	expect(
		settings
			.filter((item) => item.kind === "boolean")
			.map((item) => [item.name, item.value]),
	).toEqual([
		["disabled", false],
		["fit-content", false],
		["flipped", false],
	]);
	expect(settings.find((item) => item.name === "button-position")?.value).toBe(
		"bottom end",
	);
});

it("keeps Basic usage faces in the default preview and supports flipping", () => {
	const card = preview();
	document.body.append(card);
	expect(card.flipped).toBe(false);
	expect(card.textContent).toContain("This is the content recto...");
	expect(card.textContent).toContain("...and here is the content verso.");
	card.setAttribute("flipped", "");
	expect(
		card.querySelector(".tp-flip-card-recto")?.getAttribute("aria-hidden"),
	).toBe("true");
	expect(card.flip()).toBe(false);
});
it("supports every button position and keyboard activation on the shared preview", () => {
	const positions = [
		"top start",
		"top center",
		"top end",
		"bottom start",
		"bottom center",
		"bottom end",
		"none",
	];
	expect(
		configuration().settings.find((item) => item.name === "button-position")
			?.values,
	).toEqual(positions);
	const card = preview();
	document.body.append(card);
	positions.forEach((position) => {
		card.setAttribute("button-position", position);
		const button = required(
			card.querySelector<HTMLElement>(".tp-flip-card-button"),
		);
		const [block, inline] =
			position === "none" ? ["none", "none"] : position.split(" ");
		expect(button.dataset.block).toBe(block);
		expect(button.dataset.inline).toBe(inline);
		expect(button.hidden).toBe(position === "none");
	});
	const scene = required(
		card.querySelector<HTMLElement>(".tp-flip-card-scene"),
	);
	expect(scene.tabIndex).toBe(0);
	scene.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
	);
	expect(card.flipped).toBe(true);
});
it("supports disabled and fit-content on the shared preview", () => {
	const card = preview();
	document.body.append(card);
	card.setAttribute("disabled", "");
	expect(card.flip()).toBe(false);
	card.removeAttribute("disabled");
	expect(card.flip()).toBe(true);
	card.setAttribute("fit-content", "");
	expect(card.querySelector(".tp-flip-card-sizer")?.textContent).toContain(
		"...and here is the content verso.",
	);
});
it("uses shared components for both playing-card faces without image paragraph wrappers", () => {
	const root = htmlExample("flip-card", "Hearts suit");
	expect(root.querySelectorAll("tp-flip-card")).toHaveLength(13);
	document.body.append(root);
	expect(
		root.querySelector('.tp-flip-card-recto > tp-icon[src$="/hk.svg"]'),
	).not.toBeNull();
	expect(
		root.querySelector(
			'.tp-flip-card-verso > tp-center > tp-icon[name="logo-tp"]',
		),
	).not.toBeNull();
	expect(root.querySelector(".tp-flip-card-face > p")).toBeNull();
});
