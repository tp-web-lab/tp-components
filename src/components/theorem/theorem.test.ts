import { afterEach, expect, it } from "vitest";
import { theoremTypes } from "./theorem.js";

const settle = async () => {
	await Promise.resolve();
	await Promise.resolve();
};
afterEach(() => document.body.replaceChildren());
it.each(theoremTypes)(
	"renders %s without modifying author content",
	async (type) => {
		const element = document.createElement("tp-theorem");
		element.type = type;
		element.heading = "Sample";
		element.innerHTML = "<p>Author text.</p>";
		document.body.append(element);
		await settle();
		expect(element.querySelector("strong")?.textContent).toContain(
			type[0]?.toUpperCase() + type.slice(1),
		);
		expect(element.shadowRoot).toBeNull();
		expect(element.querySelector("p")?.outerHTML).toBe("<p>Author text.</p>");
		expect(
			element.querySelector<HTMLElement>('[data-tp-theorem-generated="qed"]')
				?.hidden,
		).toBe(type !== "proof");
	},
);
it("shares counters, resets by section and renumbers after insertion/removal", async () => {
	document.body.innerHTML =
		'<h2>One</h2><tp-theorem numbering="section" counter="results"></tp-theorem><tp-theorem type="lemma" numbering="section" counter="results"></tp-theorem><h2>Two</h2><tp-theorem numbering="section" counter="results"></tp-theorem>';
	await settle();
	const all = [...document.querySelectorAll("tp-theorem")];
	expect(all.map((n) => n.displayNumber)).toEqual(["1.1", "1.2", "2.1"]);
	all[0]?.remove();
	await settle();
	expect(all[1]?.displayNumber).toBe("1.1");
	if (all[1]) all[1].number = "X";
	await settle();
	expect(all[1]?.displayNumber).toBe("X");
	all[1]?.removeAttribute("number");
	await settle();
	expect(all[1]?.displayNumber).toBe("1.1");
});
it("updates type, title and proof symbol and supports explicit empty numbers", async () => {
	const element = document.createElement("tp-theorem");
	document.body.append(element);
	await settle();
	element.type = "proof";
	element.heading = "Details";
	element.qed = "QED";
	await settle();
	expect(element.displayNumber).toBe("");
	expect(element.textContent).toContain("Proof (Details).");
	expect(
		element.querySelector('[data-tp-theorem-generated="qed"]')?.textContent,
	).toBe("QED");
	element.type = "lemma";
	element.number = "";
	await settle();
	expect(element.displayNumber).toBe("");
});

it.each([
	"none",
	"neutral",
	"brand",
	"info",
	"success",
	"warning",
	"danger",
] as const)("reflects the %s background variant", async (variant) => {
	const element = document.createElement("tp-theorem");
	document.body.append(element);
	element.variant = variant;
	await settle();
	expect(element.variant).toBe(variant);
	expect(element.getAttribute("variant")).toBe(variant);
	element.removeAttribute("variant");
	expect(element.variant).toBe("none");
});

it("restores one pair of decorations after replacement and reconnect", async () => {
	const element = document.createElement("tp-theorem");
	element.innerHTML = "<p>First.</p>";
	document.body.append(element);
	await settle();
	element.innerHTML = "<p>Replacement.</p>";
	await settle();
	element.remove();
	document.body.append(element);
	await settle();
	expect(element.querySelectorAll("[data-tp-theorem-generated]")).toHaveLength(
		2,
	);
	expect(element.querySelector("p")?.textContent).toBe("Replacement.");
	expect(element.shadowRoot).toBeNull();
});

it.each(theoremTypes)(
	"supports an optional ending symbol for %s",
	async (type) => {
		const element = document.createElement("tp-theorem");
		element.type = type;
		document.body.append(element);
		await settle();
		const symbol = element.querySelector<HTMLElement>(
			'[data-tp-theorem-generated="qed"]',
		);
		expect(element.qed).toBe(type === "proof" ? "□" : "");
		element.qed = "◆";
		await settle();
		expect(symbol?.hidden).toBe(false);
		expect(symbol?.textContent).toBe("◆");
		element.type = "definition";
		await settle();
		expect(symbol?.hidden).toBe(false);
		element.qed = "";
		element.type = "proof";
		await settle();
		expect(symbol?.hidden).toBe(true);
		element.removeAttribute("qed");
		await settle();
		expect(symbol?.textContent).toBe("□");
		expect(symbol?.hidden).toBe(false);
	},
);

it("keeps rich heading nodes interactive when numbers and labels change", async () => {
	const element = document.createElement("tp-theorem");
	element.innerHTML =
		'<span slot="heading">See <a href="#guide">the guide</a></span><p>Body.</p>';
	element.setAttribute("heading", "Fallback");
	document.body.append(element);
	await settle();
	const link = element.querySelector("a");
	expect(element.querySelector('[data-tp-theorem-generated="heading"] a')).toBe(
		link,
	);
	expect(element.shadowRoot).toBeNull();
	expect(element.textContent).toContain("Theorem 1 (See the guide).");
	element.number = "2.1";
	await settle();
	expect(element.querySelector("a")).toBe(link);
	expect(element.textContent).toContain("Theorem 2.1 (See the guide).");
	element.querySelector('[slot="heading"]')?.remove();
	await settle();
	expect(element.textContent).toContain("Theorem 2.1 (Fallback).");
});
