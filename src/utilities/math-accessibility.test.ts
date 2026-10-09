import { expect, it } from "vitest";
import { labelMathSvg } from "./math-accessibility.js";

it("preserves existing names and prefers the author's label over formula source", () => {
	const root = document.createElement("div");
	root.innerHTML = `<span aria-label="Square root"><mjx-container><svg role="img"><g data-mml-node="math" data-latex="sqrt(x)"></g></svg></mjx-container></span>
<mjx-container><svg role="img" aria-label="Existing"></svg></mjx-container>
<mjx-container><svg role="img" aria-labelledby="caption"></svg></mjx-container>`;
	labelMathSvg(root);
	expect(root.querySelector("svg")?.getAttribute("aria-label")).toBe(
		"Square root",
	);
	expect(root.querySelectorAll("svg")[1]?.getAttribute("aria-label")).toBe(
		"Existing",
	);
	expect(root.querySelectorAll("svg")[2]?.hasAttribute("aria-label")).toBe(
		false,
	);
});

it("uses semantic speech, then TeX, without inventing a name for unknown graphics", () => {
	const root = document.createElement("div");
	root.innerHTML = `<mjx-container><svg role="img"><g data-semantic-speech="x squared"></g></svg></mjx-container>
<mjx-container><svg role="img"><g data-mml-node="math" data-latex="x^2"></g></svg></mjx-container>
<mjx-container><svg role="img"></svg></mjx-container>`;
	labelMathSvg(root);
	expect(
		[...root.querySelectorAll("svg")].map((svg) =>
			svg.getAttribute("aria-label"),
		),
	).toEqual(["x squared", "x^2", null]);
});
