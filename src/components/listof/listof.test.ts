import { afterEach, expect, it, vi } from "vitest";
import "./listof.js";
import "../ref/ref.js";

const settle = async () => {
	await Promise.resolve();
	await Promise.resolve();
	await Promise.resolve();
};
afterEach(() => document.body.replaceChildren());

it("lists matching labelled elements in document order and preserves their anchors", async () => {
	document.body.innerHTML = `<main><tp-listof selector="figure, table, section"></tp-listof><figure id="first"><figcaption>Figure one</figcaption></figure><table><caption>Results</caption></table><section title="Title" label="Other"></section><section label="Label"></section><section ref="ref-only"></section><section caption="Caption"></section><section figcaption="Figcaption"></section><section>No name</section><article><figure title="Nested"></figure></article></main>`;
	await settle();
	const links = Array.from(document.querySelectorAll("tp-listof li a"));
	expect(links.map((e) => e.textContent)).toEqual([
		"Figure one",
		"Results",
		"Title",
		"Label",
		"ref-only",
		"Caption",
		"Figcaption",
	]);
	expect(links[0]?.getAttribute("href")).toBe("#first");
	for (const link of links)
		expect(
			document.getElementById(
				decodeURIComponent(link.getAttribute("href")?.slice(1) ?? ""),
			),
		).not.toBeNull();
});

it("renders full hidden definitions and updates copies after edits", async () => {
	document.body.innerHTML = `<div data-tp-reference-scope><tp-listof selector="tp-note, tp-biblio, tp-glossary"></tp-listof><tp-note ref="n"><p id="unique">A <strong>note</strong></p></tp-note><tp-biblio ref="b">Book</tp-biblio><tp-glossary ref="g" title="Term">Definition</tp-glossary></div>`;
	await settle();
	const list = document.querySelector("tp-listof");
	expect(list?.querySelectorAll("ol > li, dl > dd")).toHaveLength(3);
	expect(list?.querySelector("li strong")?.textContent).toBe("note");
	expect(document.querySelectorAll("#unique")).toHaveLength(1);
	const note = document.querySelector("tp-note");
	if (!note) throw new Error("Missing note");
	note.innerHTML = "<p>Updated</p>";
	await settle();
	expect(list?.textContent).toContain("Updated");
	note.remove();
	await settle();
	expect(list?.querySelectorAll("ol > li, dl > dd")).toHaveLength(2);
});

it("handles selectors, late additions, labels and list removal without selecting its own output", async () => {
	document.body.innerHTML =
		'<div data-tp-reference-scope><tp-listof selector="[title]"></tp-listof></div>';
	const list = document.querySelector("tp-listof");
	if (!list) throw new Error("Missing list");
	const target = document.createElement("div");
	target.title = "Added";
	list.parentElement?.append(target);
	await settle();
	expect(list.textContent).toBe("Added");
	target.title = "Changed";
	await settle();
	expect(list.textContent).toBe("Changed");
	list.selector = "[";
	await settle();
	expect(list.hasAttribute("data-invalid-selector")).toBe(true);
	expect(list.querySelectorAll("li")).toHaveLength(0);
	list.selector = "*";
	await settle();
	expect(list.querySelectorAll("li")).toHaveLength(1);
	expect(list.hasAttribute("data-invalid-selector")).toBe(false);
	list.selector = "";
	expect(list.querySelectorAll("li")).toHaveLength(0);
	list.remove();
	list.selector = "[title]";
	document.querySelector("[data-tp-reference-scope]")?.append(list);
	await settle();
	expect(list.textContent).toBe("Changed");
});

it("preserves documentation hash routes when following a generated link", async () => {
	const previous = window.location.hash;
	try {
		window.location.hash = "#/chapter.md";
		document.body.innerHTML =
			'<main><tp-listof selector="figure"></tp-listof><figure id="chart" title="Chart"></figure></main>';
		await settle();
		const target = document.querySelector("figure");
		if (!target) throw new Error("Missing figure");
		const scroll = vi.fn();
		target.scrollIntoView = scroll;
		const link = document.querySelector<HTMLAnchorElement>("tp-listof a");
		expect(link?.getAttribute("href")).toBe("#/chapter.md#chart");
		link?.click();
		expect(window.location.hash).toBe("#/chapter.md#chart");
		expect(scroll).toHaveBeenCalledWith({ block: "start" });
	} finally {
		window.location.hash = previous;
	}
});

it("sorts bibliography and glossary terms alphabetically in description lists", async () => {
	document.body.innerHTML = `<main><tp-listof selector="tp-biblio"></tp-listof><tp-listof selector="tp-glossary"></tp-listof><tp-biblio ref="zulu" title="AAA"><p>Last book</p></tp-biblio><tp-biblio ref="alpha" title="ZZZ"><p>First book</p></tp-biblio><tp-glossary ref="Zebra">Animal</tp-glossary><tp-glossary ref="apple">Fruit</tp-glossary></main>`;
	await settle();
	expect(
		Array.from(
			document.querySelectorAll(".tp-listof-biblio > dt"),
			(e) => e.textContent,
		),
	).toEqual(["alpha", "zulu"]);
	expect(
		Array.from(
			document.querySelectorAll(".tp-listof-biblio > dd"),
			(e) => e.textContent,
		),
	).toEqual(["First book", "Last book"]);
	expect(
		Array.from(
			document.querySelectorAll(".tp-listof-glossary > dt"),
			(e) => e.textContent,
		),
	).toEqual(["apple", "Zebra"]);
	const entry = document.querySelector("tp-biblio[ref=zulu]");
	entry?.setAttribute("ref", "aardvark");
	await settle();
	expect(
		Array.from(
			document.querySelectorAll(".tp-listof-biblio > dt"),
			(e) => e.textContent,
		),
	).toEqual(["aardvark", "alpha"]);
	const list = document.querySelector("tp-listof");
	if (!list) throw new Error("Missing list");
	list.selector = "tp-glossary";
	await settle();
	expect(list.querySelector(".tp-listof-biblio")).toBeNull();
	expect(list.querySelectorAll("dl > dt")).toHaveLength(2);
});

it("preserves note numbering when a selector lists only part of the notes", async () => {
	document.body.innerHTML =
		'<main><tp-ref href="^a"></tp-ref><tp-ref href="^b"></tp-ref><tp-note ref="b" class="selected">Second</tp-note><tp-note ref="a">First</tp-note><tp-listof selector="tp-note.selected"></tp-listof></main>';
	await settle();
	expect(
		document.querySelector<HTMLLIElement>("tp-listof ol > li")?.value,
	).toBe(2);
});
