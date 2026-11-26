import { afterEach, expect, it, vi } from "vitest";
import "./ref.js";
import type { TpTooltip } from "../tooltip/tooltip.js";
import "../listof/listof.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.useRealTimers();
});
const settle = async () => {
	await Promise.resolve();
	await Promise.resolve();
	await Promise.resolve();
};

it("resolves each prefix independently and shows HTML on hover, focus and activation", async () => {
	document.body.innerHTML = `<div data-tp-reference-scope><tp-ref href="^same"></tp-ref><tp-ref href="@same"></tp-ref><tp-ref href="%same"></tp-ref><tp-note ref="same"><p>A <strong>note</strong></p></tp-note><tp-biblio ref="same">A book</tp-biblio><tp-glossary ref="same" title="Term">A definition</tp-glossary></div>`;
	await settle();
	const refs = Array.from(document.querySelectorAll("tp-ref"));
	expect(document.querySelectorAll("tp-ref > tp-button")).toHaveLength(3);
	expect(document.querySelector("tp-ref > button")).toBeNull();
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
	expect(tip?.hasAttribute("open")).toBe(true);
	await vi.waitFor(() => expect(tip?.hasAttribute("open")).toBe(false));
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
	expect(ref?.querySelector<TpTooltip>("tp-tooltip")?.textContent).toBe(
		"Changed",
	);
	note.remove();
	await settle();
	expect(button?.disabled).toBe(true);
	expect(ref?.querySelector<TpTooltip>("tp-tooltip")?.textContent).toBe("");
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

it("uses bibliography labels and lets a reference override its displayed label", async () => {
	document.body.innerHTML =
		'<main><tp-ref href="@book"></tp-ref><tp-biblio ref="book" label="[7]" title="A book">Description.</tp-biblio><tp-listof selector="tp-biblio"></tp-listof></main>';
	await settle();
	const ref = document.querySelector("tp-ref");
	expect(ref?.querySelector("button")?.textContent).toBe("[7]");
	ref?.setAttribute("label", "7");
	await settle();
	expect(ref?.querySelector("button")?.textContent).toBe("7");
	document.querySelector("tp-biblio")?.setAttribute("label", "[8]");
	await settle();
	expect(document.querySelector("tp-listof dt")?.textContent).toBe("[8]");
	ref?.removeAttribute("label");
	await settle();
	expect(ref?.querySelector("button")?.textContent).toBe("[8]");
});

it("keeps bibliography labels readable inside note tooltips without recursive previews", async () => {
	document.body.innerHTML =
		'<main><tp-ref href="^n"></tp-ref><tp-note ref="n">See <tp-ref href="@book" label="Author (2000)"></tp-ref>.</tp-note><tp-biblio ref="book">Book</tp-biblio><tp-listof selector="tp-note"></tp-listof></main>';
	await settle();
	expect(document.querySelector("main > tp-ref tp-tooltip")?.textContent).toBe(
		"See Author (2000).",
	);
	expect(document.querySelector("main > tp-ref tp-tooltip tp-ref")).toBeNull();
	expect(
		document.querySelector("tp-listof tp-ref tp-tooltip")?.textContent,
	).toBe("Book");
});

it("keeps silent index occurrences textless in headings and restores visible mode", async () => {
	document.body.innerHTML =
		'<main><h2>Heading<tp-ref href="!term" silent></tp-ref></h2><tp-index ref="term" title="Index term"></tp-index></main>';
	await settle();
	expect(document.querySelector("h2")?.textContent).toBe("Heading");
	document.querySelector("tp-ref")?.removeAttribute("silent");
	await settle();
	expect(document.querySelector("h2 tp-button")?.textContent).toBe(
		"Index term",
	);
});

for (const [tag, prefix] of [
	["tp-note", "^"],
	["tp-biblio", "@"],
]) {
	it(`keeps ${tag} previews interactive across pointer and keyboard transitions`, async () => {
		vi.useFakeTimers();
		document.body.innerHTML = `<div data-tp-reference-scope><tp-ref href="${prefix}long"></tp-ref><${tag} ref="long"><p><a href="#destination">Read more</a></p>${"<p>Long reference content.</p>".repeat(40)}</${tag}><p id="destination">Destination</p></div>`;
		await settle();
		const ref = document.querySelector("tp-ref");
		const button = ref?.querySelector("button");
		const tip = ref?.querySelector<TpTooltip>("tp-tooltip");
		const link = tip?.querySelector("a");
		if (!button || !tip || !link) throw Error("Missing reference preview");
		expect(tip.tabIndex).toBe(0);
		button.dispatchEvent(new MouseEvent("mouseenter"));
		button.dispatchEvent(new MouseEvent("mouseleave"));
		vi.advanceTimersByTime(150);
		tip.dispatchEvent(new MouseEvent("mouseenter"));
		vi.advanceTimersByTime(500);
		expect(tip.open).toBe(true);
		const click = new MouseEvent("click", { bubbles: true, cancelable: true });
		link.dispatchEvent(click);
		expect(click.defaultPrevented).toBe(false);
		expect(tip.open).toBe(true);
		tip.focus();
		tip.dispatchEvent(new MouseEvent("mouseleave"));
		vi.advanceTimersByTime(500);
		expect(tip.open).toBe(true);
		tip.blur();
		vi.advanceTimersByTime(250);
		expect(tip.open).toBe(false);
	});
}
