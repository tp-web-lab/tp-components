import { afterEach, expect, it, vi } from "vitest";
import "./ref.js";
import "../listof/listof.js";

afterEach(() => document.body.replaceChildren());
const settle = async () => {
	await Promise.resolve();
	await Promise.resolve();
	await Promise.resolve();
};

it("resolves each prefix independently and shows HTML on hover, focus and activation", async () => {
	document.body.innerHTML = `<div data-tp-reference-scope><tp-ref href="^same"></tp-ref><tp-ref href="@same"></tp-ref><tp-ref href="%same"></tp-ref><tp-note ref="same"><p>A <strong>note</strong></p></tp-note><tp-biblio ref="same">A book</tp-biblio><tp-glossary ref="same" title="Term">A definition</tp-glossary></div>`;
	await settle();
	const refs = Array.from(document.querySelectorAll("tp-ref"));
	expect(refs.map((e) => e.querySelector("button")?.textContent)).toEqual([
		"[1]",
		"[same]",
		"same",
	]);
	expect(refs[0]?.querySelector("tp-tooltip strong")?.textContent).toBe("note");
	const button = refs[0]?.querySelector("button");
	const tip = refs[0]?.querySelector("tp-tooltip");
	button?.dispatchEvent(new MouseEvent("mouseenter"));
	expect(tip?.hasAttribute("open")).toBe(true);
	button?.dispatchEvent(new MouseEvent("mouseleave"));
	expect(tip?.hasAttribute("open")).toBe(false);
	button?.focus();
	expect(tip?.hasAttribute("open")).toBe(true);
	document.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
	);
	expect(tip?.hasAttribute("open")).toBe(false);
	button?.click();
	expect(tip?.hasAttribute("open")).toBe(true);
	expect(button?.getAttribute("aria-describedby")).toBe(tip?.id);
	expect(
		getComputedStyle(document.querySelector("tp-note") as Element).display,
	).toBe("none");
});

it("handles forward references, punctuation, changed content and removal", async () => {
	const scope = document.createElement("div");
	scope.setAttribute("data-tp-reference-scope", "");
	scope.innerHTML = '<tp-ref href="^a&quot;[]"></tp-ref>';
	document.body.append(scope);
	const ref = scope.querySelector("tp-ref");
	const button = ref?.querySelector("button");
	expect(button?.disabled).toBe(true);
	const note = document.createElement("tp-note");
	note.ref = 'a"[]';
	note.innerHTML = '<p id="original">First</p>';
	scope.append(note);
	await settle();
	expect(button?.disabled).toBe(false);
	expect(scope.querySelectorAll("#original")).toHaveLength(1);
	note.innerHTML = "<p>Changed</p>";
	await settle();
	expect(ref?.querySelector("tp-tooltip")?.textContent).toBe("Changed");
	note.remove();
	await settle();
	expect(button?.disabled).toBe(true);
	expect(ref?.querySelector("tp-tooltip")?.textContent).toBe("");
});

it("uses generated labels, resolves within independent scopes and reconnects", async () => {
	document.body.innerHTML = `<div data-tp-reference-scope id="one"><tp-ref href="^id"><em>Read</em></tp-ref><tp-note ref="id">One</tp-note></div><div data-tp-reference-scope id="two"><tp-note ref="id">Two</tp-note></div>`;
	await settle();
	const ref = document.querySelector("tp-ref");
	if (!ref) throw new Error("Missing ref");
	expect(ref.querySelector("button sup")?.textContent).toBe("[1]");
	expect(ref.querySelector("tp-tooltip")?.textContent).toBe("One");
	document.querySelector("#two")?.append(ref);
	await settle();
	expect(ref.querySelector("tp-tooltip")?.textContent).toBe("Two");
	expect(ref.querySelectorAll("button")).toHaveLength(1);
	ref.href = "https://example.com";
	expect(ref.querySelector("button")?.disabled).toBe(true);
});

it("does not recursively generate previews for a self reference", async () => {
	document.body.innerHTML =
		'<div data-tp-reference-scope><tp-ref href="^self"></tp-ref><tp-note ref="self">See <tp-ref href="^self">this note</tp-ref>.</tp-note></div>';
	await settle();
	const count = document.querySelectorAll("tp-tooltip").length;
	await settle();
	expect(document.querySelectorAll("tp-tooltip")).toHaveLength(count);
	expect(count).toBe(1);
});

it("releases observation when the last reference is removed", () => {
	const spy = vi.spyOn(MutationObserver.prototype, "disconnect");
	const scope = document.createElement("div");
	scope.setAttribute("data-tp-reference-scope", "");
	scope.innerHTML = '<tp-ref href="^missing"></tp-ref>';
	document.body.append(scope);
	const before = spy.mock.calls.length;
	scope.remove();
	expect(spy.mock.calls.length).toBeGreaterThan(before);
	spy.mockRestore();
});

it("numbers unique notes by first citation and renumbers after reordering and removal", async () => {
	document.body.innerHTML = `<main><p id="citations"><tp-ref href="^b"></tp-ref><tp-ref href="^a"></tp-ref><tp-ref href="^b"></tp-ref></p><tp-note ref="a">Alpha</tp-note><tp-note ref="b">Beta</tp-note><tp-note ref="c">Uncited</tp-note><tp-listof selector="tp-note"></tp-listof></main>`;
	const labels = () =>
		Array.from(
			document.querySelectorAll("#citations tp-ref sup"),
			(e) => e.textContent,
		);
	const entries = () =>
		Array.from(
			document.querySelectorAll<HTMLLIElement>("tp-listof ol > li"),
			(e) => [e.value, e.textContent],
		);
	await settle();
	expect(labels()).toEqual(["[1]", "[2]", "[1]"]);
	expect(entries()).toEqual([
		[1, "Beta"],
		[2, "Alpha"],
		[3, "Uncited"],
	]);
	const citations = document.querySelector("#citations");
	const second = citations?.children[1];
	if (!citations || !second) throw new Error("Missing citation");
	citations.prepend(second);
	await settle();
	expect(labels()).toEqual(["[1]", "[2]", "[2]"]);
	expect(entries()).toEqual([
		[1, "Alpha"],
		[2, "Beta"],
		[3, "Uncited"],
	]);
	second.remove();
	await settle();
	expect(labels()).toEqual(["[1]", "[1]"]);
	expect(entries()).toEqual([
		[1, "Beta"],
		[2, "Alpha"],
		[3, "Uncited"],
	]);
	const first = citations.querySelector("tp-ref");
	if (!first) throw new Error("Missing ref");
	first.href = "^c";
	await settle();
	expect(labels()).toEqual(["[1]", "[2]"]);
	expect(entries()).toEqual([
		[1, "Uncited"],
		[2, "Beta"],
		[3, "Alpha"],
	]);
});
