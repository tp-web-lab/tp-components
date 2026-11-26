import { afterEach, expect, it } from "vitest";
import "./equanum.js";
import "../ref/ref.js";

const settle = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
};
afterEach(() => document.body.replaceChildren());
it("displays a number in light DOM and previews the equation from its reference", async () => {
	document.body.innerHTML =
		'<div data-tp-reference-scope><tp-equanum ref="e" number="2.1"><tp-math value="x=1" displaystyle></tp-math></tp-equanum><tp-ref href="=e"></tp-ref></div>';
	await settle();
	const definition = document.querySelector("tp-equanum");
	expect(definition?.shadowRoot).toBeNull();
	expect(
		definition?.querySelector("[data-tp-equanum-generated]")?.textContent,
	).toBe("(2.1)");
	expect(document.querySelector("tp-ref button")?.textContent).toBe("(2.1)");
	expect(
		document.querySelector("tp-ref tp-tooltip tp-math")?.getAttribute("value"),
	).toBe("x=1");
	definition?.setAttribute("number", "3");
	await settle();
	expect(document.querySelector("tp-ref button")?.textContent).toBe("(3)");
});
it("binds existing equations without adding a second number or copying generated SVG", async () => {
	document.body.innerHTML =
		'<div data-tp-reference-scope><tp-equanum ref="e" number="A" target="#formula"></tp-equanum><tp-math id="formula" value="x=1"></tp-math><tp-ref href="=e"></tp-ref></div>';
	await settle();
	expect(
		document.querySelector("tp-equanum [data-tp-equanum-generated]"),
	).toBeNull();
	const math = document.querySelector("tp-ref tp-tooltip tp-math");
	expect(math?.getAttribute("value")).toBe("x=1");
	expect(math?.id).toBe("");
	// MathJax may replace its SVG repeatedly; keep the existing preview intact.
	const original = document.querySelector("#formula");
	if (original)
		original.innerHTML = '<svg id="generated-mathjax"><path d="M0 0"/></svg>';
	await settle();
	expect(document.querySelector("tp-ref tp-tooltip tp-math")).toBe(math);
	expect(
		document.querySelector("tp-ref tp-tooltip #generated-mathjax"),
	).toBeNull();
	const button = document.querySelector("tp-ref button");
	button?.dispatchEvent(new MouseEvent("mouseenter"));
	expect(document.querySelector("tp-tooltip")?.hasAttribute("open")).toBe(true);
});
it("keeps equation identifiers local to a reference scope and disables missing references", async () => {
	document.body.innerHTML =
		'<div data-tp-reference-scope><tp-equanum ref="x" number="1">first</tp-equanum><tp-ref href="=x"></tp-ref></div><div data-tp-reference-scope><tp-equanum ref="x" number="2">second</tp-equanum><tp-ref href="=x"></tp-ref><tp-ref href="=missing"></tp-ref></div>';
	await settle();
	expect(
		[...document.querySelectorAll("tp-ref button")].map((e) => e.textContent),
	).toEqual(["(1)", "(2)", "(?)"]);
	expect(
		document.querySelector<HTMLButtonElement>('tp-ref[href="=missing"] button')
			?.disabled,
	).toBe(true);
});
