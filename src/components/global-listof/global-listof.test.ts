import { afterEach, expect, it, vi } from "vitest";
import {
	expandQuestionPrompts,
	type GlobalListHost,
	globalListAnchor,
	globalListDefinitionContent,
	globalListTarget,
} from "../../utilities/global-listof.js";
import { TpGlobalListof } from "./global-listof.js";

function setup(files: Record<string, string>, selector = "figure") {
	const fetcher = vi.fn(async (input: string | URL | Request) => {
		const path = new URL(String(input)).pathname;
		return new Response(files[path] ?? "Missing", {
			status: path in files ? 200 : 404,
		});
	});
	vi.stubGlobal("fetch", fetcher);
	const host = document.createElement("tp-html-multi-pages") as GlobalListHost;
	host.getGlobalListPages = () =>
		Object.keys(files).map((href) => ({ href, title: href }));
	host.globalListHref = (href) => `#/${href.replace(/^\//, "")}`;
	const list = new TpGlobalListof();
	list.selector = selector;
	host.append(list);
	document.body.append(host);
	return { host, list, fetcher };
}
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("links pages and authored anchors without copying active content or changing refs", async () => {
	const { list } = setup({
		"/a.html":
			'<figure id="same" class="diagram"><img id="picture" src="images/first.svg" alt="First diagram" onload="alert(1)"><figcaption>First</figcaption></figure><script>window.unexpected = true</script>',
		"/b.html":
			'<figure id="same"><figcaption>Second</figcaption></figure><tp-ref href="^local"></tp-ref>',
	});
	await list.refresh();
	expect(
		[...list.querySelectorAll("a")].map((a) => a.getAttribute("href")),
	).toEqual(["#/a.html#same", "#/b.html#same"]);
	expect(
		[...list.querySelectorAll("a[data-tp-global-origin]")].map(
			(link) => link.textContent,
		),
	).toEqual(["First", "Second"]);
	expect(list.querySelector("script,tp-ref")).toBeNull();
	expect(list.shadowRoot).toBeNull();
	expect(
		[...list.querySelectorAll("li > figure > figcaption")].map(
			(node) => node.textContent,
		),
	).toEqual(["First", "Second"]);
	expect(list.querySelector("li > figure")?.classList.contains("diagram")).toBe(
		true,
	);
	expect(list.querySelector("figure img")?.getAttribute("src")).toBe(
		new URL("/images/first.svg", document.baseURI).href,
	);
	expect(
		list.querySelector("figure [id], figure[id], figure [onload]"),
	).toBeNull();
});
it("resolves generated anchors for repeated labels without modifying reference ids", () => {
	const inert = new DOMParser().parseFromString(
		"<figure><figcaption>Same</figcaption></figure><figure><figcaption>Same</figcaption></figure>",
		"text/html",
	);
	const figure = inert.querySelectorAll("figure")[1];
	if (!figure) throw new Error("Missing second figure");
	const anchor = globalListAnchor(figure, inert);
	const live = document.createElement("div");
	live.innerHTML = inert.body.innerHTML;
	const target = globalListTarget(live, anchor);
	expect(target?.nextElementSibling).toBe(live.querySelectorAll("figure")[1]);
	expect(globalListTarget(live, anchor)).toBe(target);
	expect(live.querySelector("figure")?.id).toBe("");
	expect(globalListTarget(live, "tp-global-target-invalid")).toBeNull();
	const hidden = document.createElement("div");
	hidden.id = "definition";
	hidden.hidden = true;
	live.append(hidden);
	const marker = globalListTarget(live, "definition");
	expect(marker?.nextElementSibling).toBe(hidden);
	expect(hidden.id).toBe("definition");
	expect(hidden.hidden).toBe(true);
	expect(globalListTarget(live, "definition")).toBe(marker);
	for (const tag of ["tp-biblio", "tp-glossary", "tp-index"]) {
		const definition = document.createElement(tag);
		definition.id = `${tag}-definition`;
		live.append(definition);
		const target = globalListTarget(live, definition.id);
		expect(target?.nextElementSibling).toBe(definition);
		expect(target).not.toBe(definition);
	}
});
it("shares cached page snapshots and refreshes them explicitly", async () => {
	const { host, list, fetcher } = setup({
		"/a.html": '<figure id="a" title="A"></figure>',
	});
	await list.refresh();
	const count = fetcher.mock.calls.length;
	const other = new TpGlobalListof();
	other.selector = "figure";
	host.append(other);
	await vi.waitFor(() => expect(other.querySelectorAll("a")).toHaveLength(1));
	expect(fetcher).toHaveBeenCalledTimes(count);
	await other.refresh();
	expect(fetcher).toHaveBeenCalledTimes(count + 1);
});
it("reports failed pages and invalid selectors without dropping valid results", async () => {
	const { host, list } = setup({
		"/a.html": '<figure id="a" title="A"></figure>',
	});
	host.getGlobalListPages = () => [
		{ href: "/missing.html", title: "Missing" },
		{ href: "/a.html", title: "A" },
	];
	await list.refresh();
	expect(list.querySelectorAll("a[data-tp-global-origin]")).toHaveLength(1);
	expect(list.textContent).toContain("1 page(s)");
	list.selector = "[";
	await list.refresh();
	expect(list.hasAttribute("data-invalid-selector")).toBe(true);
	expect(list.querySelector("a")).toBeNull();
	expect(list.hasAttribute("aria-busy")).toBe(false);
});
it("filters named indexes and excludes generated lists", async () => {
	const { list } = setup(
		{
			"/a.html":
				'<tp-index ref="a"></tp-index><tp-index ref="b" index="other"></tp-index><div data-tp-reference-output><tp-index ref="c"></tp-index></div>',
		},
		"tp-index",
	);
	list.index = "other";
	await list.refresh();
	expect(list.querySelectorAll("a[data-tp-global-origin]")).toHaveLength(1);
	expect(list.querySelector("a")?.textContent).toContain("b");
});
it("ignores obsolete responses after a selector change", async () => {
	const { list } = setup({
		"/a.html": '<figure title="A"></figure><table title="B"></table>',
	});
	const pending = list.refresh();
	list.selector = "table";
	await pending;
	await vi.waitFor(() =>
		expect(list.querySelector("a")?.textContent).toContain("B"),
	);
	expect(list.textContent).not.toContain("— A");
});
it("displays rich definitions and preserves source links without importing reference scopes", async () => {
	const { list } = setup(
		{
			"/chapters/a.html":
				'<tp-biblio id="book" ref="book" title="Book"><p id="original">A <em>book</em> with <a href="#section">details</a> and <img src="cover.svg" alt="Cover">.</p><script>throw Error("never run")</script><tp-ref href="%term">Term</tp-ref></tp-biblio><tp-glossary ref="term" title="Term"><p>The definition.</p></tp-glossary><h2 id="section">Details</h2>',
			"/chapters/b.html":
				'<tp-index ref="topic" title="Topic"><p><strong>Index description</strong></p></tp-index>',
		},
		"tp-biblio,tp-glossary,tp-index",
	);
	let entries = 0;
	list.addEventListener("tp-global-listof-ready", (event) => {
		entries = (event as CustomEvent).detail.count;
	});
	list.merge = true;
	await list.refresh();
	expect(list.querySelectorAll("dl > dt")).toHaveLength(3);
	expect(list.querySelectorAll("dl > dd")).toHaveLength(3);
	expect(list.querySelector("dd em")?.textContent).toBe("book");
	expect(list.querySelector("dd strong")?.textContent).toBe(
		"Index description",
	);
	expect(list.querySelector("dd img")?.getAttribute("src")).toBe(
		new URL("/chapters/cover.svg", document.baseURI).href,
	);
	expect(list.querySelector("dd a")?.getAttribute("href")).toBe(
		"#/chapters/a.html#section",
	);
	expect(list.querySelectorAll("a[data-tp-global-origin]")).toHaveLength(3);
	expect(
		[...list.querySelectorAll("dd a")].some(
			(a) =>
				a.textContent === "Term" &&
				a
					.getAttribute("href")
					?.startsWith("#/chapters/a.html#tp-global-target-"),
		),
	).toBe(true);
	expect(list.querySelector("script,tp-ref,[id=original],dd [ref]")).toBeNull();
	expect(entries).toBe(3);
});

it("copies notes with first-citation numbers from each source scope, including filtered lists", async () => {
	const { list } = setup(
		{
			"/first.html":
				'<p><tp-ref href="^a"></tp-ref><tp-ref href="^b"></tp-ref><tp-ref href="^a"></tp-ref></p><tp-note ref="b" data-keep><p>Second <strong>note</strong>.</p></tp-note><tp-note ref="a"><p>First note.</p></tp-note><tp-note ref="c"><p>Uncited note.</p></tp-note><section data-tp-reference-scope><tp-note ref="a" data-keep><p>Nested note.</p></tp-note></section>',
			"/second.html":
				'<tp-ref href="^a"></tp-ref><tp-note ref="a" data-keep><p>Other page note.</p></tp-note>',
		},
		"tp-note",
	);
	await list.refresh();
	expect(
		[...list.querySelectorAll("ol > li")].map(
			(li) => (li as HTMLLIElement).value,
		),
	).toEqual([1, 2, 3, 1, 1]);
	expect(
		[...list.querySelectorAll("ol > li > div")].map(
			(content) => content.textContent,
		),
	).toEqual([
		"First note.",
		"Second note.",
		"Uncited note.",
		"Nested note.",
		"Other page note.",
	]);
	expect(list.querySelector("strong")?.textContent).toBe("note");
	expect(list.querySelectorAll("a[data-tp-global-origin]")).toHaveLength(5);
	expect(list.querySelector("tp-note,tp-ref,[ref]")).toBeNull();
	list.selector = "tp-note[data-keep]";
	await list.refresh();
	expect(
		[...list.querySelectorAll("ol > li")].map(
			(li) => (li as HTMLLIElement).value,
		),
	).toEqual([2, 1, 1]);
});
it("merges identical bibliography definitions and groups every citation by source page", async () => {
	const body = "<p>Alex. <em>A book</em>. 2026.</p>";
	const files = {
		"/first.html": `<p><tp-ref id="citation-one" href="@shared"></tp-ref><tp-ref href="@shared"></tp-ref></p><tp-biblio ref="shared">${body}</tp-biblio><tp-biblio ref="uncited"><p>Further reading.</p></tp-biblio>`,
		"/second.html": `<tp-ref href="@shared"></tp-ref><tp-ref href="@shared"></tp-ref><tp-biblio ref="shared">\n ${body}\n</tp-biblio>`,
		"/third.html":
			'<tp-ref href="@shared"></tp-ref><tp-biblio ref="shared"><p>A different book.</p></tp-biblio>',
	};
	const { list } = setup(files, "tp-biblio");
	list.merge = true;
	await list.refresh();
	expect(list.querySelectorAll("dl")).toHaveLength(1);
	expect(list.querySelectorAll("dl > dt")).toHaveLength(3);
	const entry = [...list.querySelectorAll("dd")].find((dd) =>
		dd.querySelector("em"),
	);
	expect(entry?.querySelectorAll("[data-tp-global-citation]")).toHaveLength(4);
	expect(entry?.textContent).toContain("/first.html: 1, 2");
	expect(entry?.textContent).toContain("/second.html: 1, 2");
	expect(list.querySelectorAll("[data-tp-global-citation]")).toHaveLength(5);
	expect(list.querySelectorAll("[data-tp-global-uncited]")).toHaveLength(1);
	for (const link of list.querySelectorAll<HTMLAnchorElement>(
		"[data-tp-global-citation]",
	)) {
		const href = link.getAttribute("href") ?? "";
		const [file, fragment] = href.slice(1).split("#");
		const live = document.createElement("div");
		live.innerHTML = files[file as keyof typeof files];
		for (const citation of live.querySelectorAll("tp-ref"))
			citation.textContent = "Rendered citation";
		const target = globalListTarget(live, decodeURIComponent(fragment ?? ""));
		const citation = target?.matches("tp-ref")
			? target
			: target?.nextElementSibling;
		expect(citation?.localName).toBe("tp-ref");
		expect(citation?.getAttribute("href")).toBe("@shared");
	}
});
it("resolves bibliography citations in their own scopes and orders returns by occurrence", async () => {
	const { list } = setup(
		{
			"/a.html":
				'<tp-ref id="outer" href="@x"></tp-ref><section data-tp-reference-scope><tp-ref id="inner" href="@x"></tp-ref><tp-biblio ref="x"><p>Same.</p></tp-biblio></section><section data-tp-reference-scope><tp-ref id="unresolved" href="@x"></tp-ref></section><tp-biblio ref="x"><p>Same.</p></tp-biblio>',
		},
		"tp-biblio",
	);
	list.merge = true;
	await list.refresh();
	expect(list.querySelectorAll("dt")).toHaveLength(1);
	expect(
		[...list.querySelectorAll("[data-tp-global-citation]")].map((a) =>
			a.getAttribute("href"),
		),
	).toEqual(["#/a.html#outer", "#/a.html#inner"]);
});
it("keeps different relative resources and literal code whitespace in separate bibliography entries", async () => {
	const { list } = setup(
		{
			"/one/a.html":
				'<tp-biblio ref="image"><img src="cover.svg" alt="Cover"></tp-biblio><tp-biblio ref="code"><pre>A B</pre></tp-biblio>',
			"/two/b.html":
				'<tp-biblio ref="image"><img src="cover.svg" alt="Cover"></tp-biblio><tp-biblio ref="code"><pre>A  B</pre></tp-biblio>',
		},
		"tp-biblio",
	);
	list.merge = true;
	await list.refresh();
	expect(list.querySelectorAll("dl")).toHaveLength(1);
	expect(list.querySelectorAll("dt")).toHaveLength(4);
});
it.each(["glossary", "index"] as const)(
	"merges %s definitions with scoped occurrences and retains conflicts",
	async (kind) => {
		const prefix = kind === "index" ? "!" : "%";
		const definition = (body: string) =>
			`<tp-${kind} ref="shared" title="Shared"><p>${body}</p></tp-${kind}>`;
		const { list } = setup(
			{
				"/a.html": `<tp-ref id="first" href="${prefix}shared"></tp-ref><tp-ref id="silent" silent href="${prefix}shared"></tp-ref>${definition("Same")}<section data-tp-reference-scope><tp-ref id="unresolved" href="${prefix}shared"></tp-ref></section>`,
				"/b.html": `<tp-ref id="second" href="${prefix}shared"></tp-ref>${definition("Same")}`,
				"/c.html": `<tp-ref href="${prefix}shared"></tp-ref>${definition("Different")}<tp-${kind} ref="unused">Unused</tp-${kind}>`,
			},
			`tp-${kind}`,
		);
		list.merge = true;
		await list.refresh();
		expect(list.querySelectorAll("dl")).toHaveLength(1);
		expect(list.querySelectorAll("dt")).toHaveLength(3);
		const shared = [...list.querySelectorAll("dd")].find(
			(dd) => dd.firstElementChild?.textContent === "Same",
		);
		expect(
			[...(shared?.querySelectorAll("[data-tp-global-occurrence]") ?? [])].map(
				(a) => a.getAttribute("href"),
			),
		).toEqual(["#/a.html#first", "#/a.html#silent", "#/b.html#second"]);
		expect(shared?.textContent).toContain("/a.html: 1, 2");
		expect(list.querySelectorAll("[data-tp-global-uncited]")).toHaveLength(1);
		const live = document.createElement("div");
		live.innerHTML = `<tp-ref id="silent" silent href="${prefix}shared"></tp-ref>`;
		expect(globalListTarget(live, "silent")?.nextElementSibling?.id).toBe(
			"silent",
		);
	},
);
it("keeps index metadata distinct and only links occurrences in the selected index", async () => {
	const { list } = setup(
		{
			"/a.html":
				'<tp-ref id="topic" href="!x" index="topics" silent></tp-ref><tp-ref id="other" href="!x"></tp-ref><tp-index index="topics" ref="x" parent="A">Same</tp-index><tp-index ref="x">Same</tp-index>',
			"/b.html":
				'<tp-ref id="second" href="!x" index="topics"></tp-ref><tp-index index="topics" ref="x" parent="B">Same</tp-index>',
		},
		"tp-index",
	);
	list.setAttribute("index", "topics");
	list.merge = true;
	await list.refresh();
	expect(list.querySelectorAll("dt")).toHaveLength(2);
	expect(
		[...list.querySelectorAll("[data-tp-global-occurrence]")].map((a) =>
			a.getAttribute("href"),
		),
	).toEqual(["#/a.html#topic", "#/b.html#second"]);
});
it("preserves global index hierarchy and cross-references across pages", async () => {
	const { list } = setup(
		{
			"/a.html":
				'<tp-index ref="root" title="Root">Parent</tp-index><tp-index ref="z" parent="root" sort-key="a">First child</tp-index><tp-index ref="alias" see="root">Alias</tp-index>',
			"/b.html":
				'<tp-index ref="root" title="Root">Parent</tp-index><tp-index ref="a" parent="root" sort-key="z" see-also="z">Last child</tp-index><tp-ref href="!a" silent></tp-ref>',
		},
		"tp-index",
	);
	list.merge = true;
	await list.refresh();
	const root = [...list.querySelectorAll("dt")].find(
		(dt) => dt.textContent === "Root",
	);
	expect(
		[
			...(root?.nextElementSibling?.querySelectorAll(
				":scope > dl > dd > div",
			) ?? []),
		].map((node) => node.textContent),
	).toEqual(["First child", "Last child"]);
	expect(list.querySelectorAll("dt")).toHaveLength(4);
	expect(list.querySelectorAll("[data-tp-global-occurrence]")).toHaveLength(1);
	for (const link of list.querySelectorAll<HTMLAnchorElement>(
		"[data-tp-global-index-crossref]",
	)) {
		expect(list.querySelector(link.getAttribute("href") ?? "")).not.toBeNull();
		link.click();
		expect(document.activeElement?.id).toBe(link.hash.slice(1));
	}
	expect(list.querySelectorAll("[data-tp-global-index-crossref]")).toHaveLength(
		2,
	);
});
it("retains orphaned and cyclic entries without guessing ambiguous index references", async () => {
	const { list } = setup(
		{
			"/a.html":
				'<tp-index ref="a" parent="b">A</tp-index><tp-index ref="x">X one</tp-index>',
			"/b.html":
				'<tp-index ref="b" parent="a">B</tp-index><tp-index ref="x">X two</tp-index>',
			"/c.html":
				'<tp-index ref="orphan" parent="missing" see="x" see-also="missing">Orphan</tp-index>',
		},
		"tp-index",
	);
	list.merge = true;
	await list.refresh();
	expect(list.querySelectorAll("dl > dt")).toHaveLength(5);
	expect(list.querySelectorAll("dd dl")).toHaveLength(0);
	expect(list.querySelectorAll("[data-tp-global-index-crossref]")).toHaveLength(
		0,
	);
	expect(list.textContent).toContain("see x");
	expect(list.textContent).toContain("see also missing");
});
it("keeps explicit equation numbers and distinct source destinations across pages", async () => {
	const files = {
		"/a.html":
			'<h2>Equations</h2><tp-equanum id="law" ref="law" number="1"><tp-math value="E=mc^2"></tp-math></tp-equanum><tp-equanum ref="relation" number="2"><tp-math value="v=d/t"></tp-math></tp-equanum>',
		"/b.html":
			'<h2>Equations</h2><tp-equanum id="law" ref="law" number="1"><tp-math value="F=ma"></tp-math></tp-equanum><tp-equanum ref="relation" number="2"><tp-math value="p=mv"></tp-math></tp-equanum>',
	};
	const { list } = setup(files, "tp-equanum");
	await list.refresh();
	expect(
		[...list.querySelectorAll("tp-accordion > dl > dt")].map(
			(node) => node.textContent,
		),
	).toEqual(["/a.html", "/b.html"]);
	const summary = list.querySelector<HTMLElement>("tp-accordion dt");
	expect(summary?.getAttribute("aria-expanded")).toBe("false");
	summary?.click();
	expect(summary?.getAttribute("aria-expanded")).toBe("true");
	summary?.click();
	expect(summary?.getAttribute("aria-expanded")).toBe("false");
	const links = [
		...list.querySelectorAll<HTMLAnchorElement>("a[data-tp-global-origin]"),
	];
	expect(links.map((a) => a.textContent)).toEqual([
		"Equation (1)",
		"Equation (2)",
		"Equation (1)",
		"Equation (2)",
	]);
	expect(new Set(links.map((a) => a.href)).size).toBe(4);
	expect(
		[...list.querySelectorAll("li > div tp-math")].map((math) =>
			math.getAttribute("value"),
		),
	).toEqual(["E=mc^2", "v=d/t", "F=ma", "p=mv"]);
	expect(
		list.querySelector("tp-equanum, tp-ref, li > div [ref], li > div [id]"),
	).toBeNull();
	for (const link of links) {
		const [file, fragment] = (link.getAttribute("href") ?? "")
			.slice(1)
			.split("#");
		const root = document.createElement("div");
		root.innerHTML = files[file as keyof typeof files];
		const anchor = globalListTarget(root, decodeURIComponent(fragment ?? ""));
		const equation = anchor?.matches("tp-equanum")
			? anchor
			: anchor?.nextElementSibling;
		expect(equation?.localName).toBe("tp-equanum");
		expect(link.textContent).toContain(`(${equation?.getAttribute("number")})`);
		expect(
			equation?.querySelector("tp-math")?.getAttribute("value"),
		).toBeTruthy();
	}
});
it("groups complete tables and captions in initially closed sections with original links", async () => {
	const { list } = setup(
		{
			"/a.html":
				'<h1>First</h1><h2>Data</h2><table id="data"><caption>Results</caption><colgroup><col style="width:8rem"></colgroup><thead><tr><th scope="col">Item</th></tr></thead><tbody><tr><td id="cell" style="text-align:right">10</td></tr></tbody></table>',
			"/b.html":
				'<h2>Data</h2><table><caption>Results</caption><tbody><tr><th scope="row">Total</th><td>20</td></tr></tbody></table>',
		},
		"table",
	);
	await list.refresh();
	expect(
		[...list.querySelectorAll("tp-accordion dt")].map((el) => el.textContent),
	).toEqual(["/a.html", "/b.html"]);
	expect(
		[...list.querySelectorAll("tp-accordion dt")].every(
			(el) => el.getAttribute("aria-expanded") === "false",
		),
	).toBe(true);
	expect(list.querySelectorAll("li > table > caption")).toHaveLength(2);
	expect(list.querySelector("table col")?.getAttribute("style")).toContain(
		"8rem",
	);
	expect(list.querySelector("table th")?.getAttribute("scope")).toBe("col");
	expect(list.querySelector("table td")?.getAttribute("style")).toContain(
		"right",
	);
	expect(list.querySelector("table [id],table[id]")).toBeNull();
	const links = [...list.querySelectorAll("a[data-tp-global-origin]")];
	expect(links.map((link) => link.textContent)).toEqual(["Results", "Results"]);
	expect(links[0]?.getAttribute("href")).toBe("#/a.html#data");
	expect(links[1]?.getAttribute("href")).toContain(
		"#/b.html#tp-global-target-",
	);
	expect(list.querySelectorAll("table")).toHaveLength(2);
});
it("groups labelled code blocks by chapter without changing source whitespace or destinations", async () => {
	const code = "if (ready) {\n  run();\n}\n";
	const { list } = setup(
		{
			"/a.html": `<h2>One</h2><pre id="example" label="Example"><code class="language-javascript">${code}</code></pre><h2>Two</h2><pre label="Other"><code>next()</code></pre>`,
			"/b.html":
				'<pre label="Example"><code class="language-python">print("hello")</code></pre>',
		},
		"pre[label]",
	);
	await list.refresh();
	expect(
		[...list.querySelectorAll("tp-accordion dt")].map((el) => el.textContent),
	).toEqual(["/a.html", "/b.html"]);
	expect(
		[...list.querySelectorAll("tp-accordion dt")].every(
			(el) => el.getAttribute("aria-expanded") === "false",
		),
	).toBe(true);
	expect(list.querySelectorAll("li > pre > code")).toHaveLength(3);
	expect(list.querySelector("pre code")?.textContent).toBe(code);
	expect(list.querySelector("pre code")?.className).toBe("language-javascript");
	expect(list.querySelector("pre[id],pre [id]")).toBeNull();
	const links = [...list.querySelectorAll("a[data-tp-global-origin]")];
	expect(links.map((link) => link.textContent)).toEqual([
		"Example",
		"Other",
		"Example",
	]);
	expect(links[0]?.getAttribute("href")).toBe("#/a.html#example");
	expect(links[2]?.getAttribute("href")).toContain(
		"#/b.html#tp-global-target-",
	);
});
it("indexes standard headings including its own page without copying generated output", async () => {
	const files = {
		"/a.html":
			'<tp-toc id="toc" label="On this page"></tp-toc><h1 id="intro">Introduction</h1><h2>Other level</h2><h1>Second heading</h1>',
		"/contents.html":
			'<tp-toc></tp-toc><h1>Contents</h1><tp-global-listof selector="h1"><h1>Generated</h1></tp-global-listof><div data-tp-reference-output><h1>Copied</h1></div>',
	};
	const { list } = setup(files, "h1");
	list.merge = true;
	await list.refresh();
	const links = [
		...list.querySelectorAll<HTMLAnchorElement>("a[data-tp-global-origin]"),
	];
	expect(links.map((link) => link.textContent)).toEqual([
		"/a.html — Introduction",
		"/a.html — Second heading",
		"/contents.html — Contents",
	]);
	expect(list.querySelector("tp-accordion")).toBeNull();
	for (const link of links) {
		const [file, id] = (link.getAttribute("href") ?? "").slice(1).split("#");
		const root = document.createElement("div");
		root.innerHTML = files[file as keyof typeof files];
		const anchor = globalListTarget(root, decodeURIComponent(id ?? ""));
		const heading = anchor?.matches("h1") ? anchor : anchor?.nextElementSibling;
		expect(heading?.localName).toBe("h1");
		expect(link.textContent).toContain(heading?.textContent);
	}
	list.selector = "tp-toc";
	await list.refresh();
	const tocs = [...list.querySelectorAll("a[data-tp-global-origin]")];
	expect(tocs.map((link) => link.textContent)).toEqual([
		"/a.html — On this page",
		"/contents.html — Contents",
	]);
	expect(tocs[0]?.getAttribute("href")).toBe("#/a.html#toc");
	expect(tocs[1]?.getAttribute("href")).toContain(
		"#/contents.html#tp-global-target-",
	);
	list.selector = "h1[id], h2";
	await list.refresh();
	expect(
		[...list.querySelectorAll("a[data-tp-global-origin]")].map(
			(link) => link.textContent,
		),
	).toEqual(["/a.html — Introduction", "/a.html — Other level"]);
});
it("copies theorem content and local counters without renumbering filtered entries", async () => {
	const { list } = setup(
		{
			"/a.html":
				'<tp-theorem type="theorem" id="one" heading="First"><p>One.</p></tp-theorem><tp-theorem heading="Second" variant="info" qed="Q"><p>Two.</p></tp-theorem>',
			"/b.html":
				'<tp-theorem heading="Other"><p>Other page.</p></tp-theorem><tp-theorem number="A.2" type="lemma"><p>Explicit.</p></tp-theorem><tp-theorem type="proof"><p>Proof.</p></tp-theorem><tp-theorem type="definition"><p>Definition.</p></tp-theorem>',
		},
		"tp-theorem",
	);
	await list.refresh();
	expect(
		[...list.querySelectorAll("tp-accordion dt")].map(
			(node) => node.textContent,
		),
	).toEqual(["/a.html", "/b.html"]);
	expect(
		[...list.querySelectorAll("li > tp-theorem")].map((node) =>
			node.getAttribute("number"),
		),
	).toEqual(["1", "2", "1", "A.2", "", "1"]);
	expect(
		[...list.querySelectorAll("li > tp-theorem > p")].map(
			(node) => node.textContent,
		),
	).toEqual([
		"One.",
		"Two.",
		"Other page.",
		"Explicit.",
		"Proof.",
		"Definition.",
	]);
	expect(
		list.querySelector('li > tp-theorem[variant="info"]')?.getAttribute("qed"),
	).toBe("Q");
	expect(list.querySelector("li > tp-theorem[id]")).toBeNull();
	expect(
		list.querySelector("a[data-tp-global-origin]")?.getAttribute("href"),
	).toBe("#/a.html#one");
	list.selector = "tp-theorem:not([type]), tp-theorem[type='theorem']";
	await list.refresh();
	expect(
		[...list.querySelectorAll("li > tp-theorem")].map((node) =>
			node.getAttribute("number"),
		),
	).toEqual(["1", "2", "1"]);
	list.selector = "tp-theorem[type='definition']";
	await list.refresh();
	expect(list.querySelectorAll("li > tp-theorem")).toHaveLength(1);
	expect(list.querySelector("li > tp-theorem")?.getAttribute("type")).toBe(
		"definition",
	);
	expect(list.querySelector("li > tp-theorem")?.getAttribute("number")).toBe(
		"1",
	);
	list.selector = 'tp-theorem[heading="Second"]';
	await list.refresh();
	expect(list.querySelector("li > tp-theorem")?.getAttribute("number")).toBe(
		"2",
	);
	expect(list.querySelector("a[data-tp-global-origin]")?.textContent).toBe(
		"Theorem 2 — Second",
	);
});
it("toggles merge dynamically for arbitrary selectors while retaining source links", async () => {
	const { list } = setup(
		{ "/a.html": '<h1 id="a">Alpha</h1>', "/b.html": '<h1 id="b">Beta</h1>' },
		"h1",
	);
	await list.refresh();
	expect(list.merge).toBe(false);
	expect(
		[...list.querySelectorAll("tp-accordion dt")].map(
			(node) => node.textContent,
		),
	).toEqual(["/a.html", "/b.html"]);
	expect(
		[...list.querySelectorAll("tp-accordion dt")].every(
			(node) => node.getAttribute("aria-expanded") === "false",
		),
	).toBe(true);
	const hrefs = () =>
		[...list.querySelectorAll("a[data-tp-global-origin]")].map((node) =>
			node.getAttribute("href"),
		);
	const original = hrefs();
	const toggle = (value: boolean) =>
		new Promise<void>((resolve) => {
			list.addEventListener("tp-global-listof-ready", () => resolve(), {
				once: true,
			});
			list.merge = value;
		});
	await toggle(true);
	expect(list.querySelector("tp-accordion")).toBeNull();
	expect(list.querySelectorAll("ul")).toHaveLength(1);
	expect(hrefs()).toEqual(original);
	expect(
		[...list.querySelectorAll("a")].map((node) => node.textContent),
	).toEqual(["/a.html — Alpha", "/b.html — Beta"]);
	await toggle(false);
	expect(list.querySelectorAll("tp-accordion dt")).toHaveLength(2);
	expect(hrefs()).toEqual(original);
	expect(
		[...list.querySelectorAll("a")].map((node) => node.textContent),
	).toEqual(["Alpha", "Beta"]);
});
it.each(["biblio", "glossary", "index"] as const)(
	"merges %s across pages only when merge is present",
	async (kind) => {
		const definition = `<tp-${kind} ref="shared" title="Shared"><p>Same definition.</p></tp-${kind}>`;
		const { list } = setup(
			{ "/a.html": definition, "/b.html": definition },
			`tp-${kind}`,
		);
		await list.refresh();
		expect(
			list.querySelectorAll('tp-accordion dt[role="button"]'),
		).toHaveLength(2);
		expect(
			list.querySelectorAll("[data-tp-global-definitions] > dt"),
		).toHaveLength(2);
		list.merge = true;
		await list.refresh();
		expect(list.querySelector("tp-accordion")).toBeNull();
		expect(
			list.querySelectorAll("[data-tp-global-definitions] > dt"),
		).toHaveLength(1);
		expect(list.querySelectorAll("[data-tp-global-uncited]")).toHaveLength(2);
		list.merge = false;
		await list.refresh();
		expect(
			list.querySelectorAll("[data-tp-global-definitions] > dt"),
		).toHaveLength(2);
	},
);

it("includes bibliography citations authored inside notes", async () => {
	const { list } = setup(
		{
			"/a.html":
				'<main><tp-note ref="n"><tp-ref href="@book" label="Author 2000"></tp-ref></tp-note><tp-biblio ref="book">Book</tp-biblio></main>',
		},
		"tp-biblio",
	);
	list.setAttribute("merge", "");
	await list.refresh();
	expect(list.querySelectorAll("a[data-tp-global-citation]")).toHaveLength(1);
});

it("resolves hidden notes and their citations to the visible local note list", () => {
	const root = document.createElement("main");
	root.innerHTML =
		'<tp-note ref="n" id="note-n"><tp-ref href="@book"></tp-ref></tp-note><tp-listof><div data-tp-reference-output><ol><li data-tp-note-ref="n"><tp-ref href="@book"></tp-ref></li></ol></div></tp-listof>';
	const original = root.querySelector("tp-note tp-ref");
	if (!original) throw new Error("Missing citation");
	const id = globalListAnchor(original, root);
	expect(globalListTarget(root, "note-n")).toBe(root.querySelector("li"));
	const anchor = globalListTarget(root, id);
	expect(anchor?.nextElementSibling).toBe(root.querySelector("li tp-ref"));
	expect(globalListTarget(root, id)).toBe(anchor);
});

it("does not duplicate an explicit repository prefix in figure resources", () => {
	const { host } = setup({});
	host.setAttribute("repository", "./docs");
	const doc = new DOMParser().parseFromString(
		'<figure><img src="docs/images/a.svg"><img src="images/b.svg"><img src="http://localhost:3000/docs/docs/images/c.svg"><figcaption>Two images</figcaption></figure>',
		"text/html",
	);
	const figure = doc.querySelector("figure");
	if (!figure) throw new Error("Missing figure");
	figure
		.querySelectorAll("img")[2]
		?.setAttribute(
			"src",
			new URL("/docs/docs/images/c.svg", host.ownerDocument.baseURI).href,
		);
	const content = globalListDefinitionContent(
		figure,
		doc,
		host,
		"/docs/chapter.md",
	);
	expect(
		[...content.querySelectorAll("img")].map(
			(e) => new URL(e.getAttribute("src") ?? "").pathname,
		),
	).toEqual(["/docs/images/a.svg", "/docs/images/b.svg", "/docs/images/c.svg"]);
});

it("preserves multiple original index cross-reference labels", async () => {
	const cross = JSON.stringify([
		{ ref: "a", label: "Original A" },
		{ ref: "b", label: "Original B" },
		{ ref: "absent", label: "Missing original" },
	]).replaceAll('"', "&quot;");
	const { list } = setup(
		{
			"/a.html": `<tp-index ref="entry" title="Entry" see-also="${cross}"></tp-index><tp-index ref="a" title="Target A"></tp-index><tp-index ref="b" title="Target B"></tp-index>`,
		},
		"tp-index",
	);
	list.setAttribute("merge", "");
	await list.refresh();
	expect(
		[...list.querySelectorAll("a[data-tp-global-index-crossref]")].map(
			(e) => e.textContent,
		),
	).toEqual(["Original A", "Original B"]);
	expect(list.textContent).toContain("Missing original");
});

it("targets the visible paragraph for a silent index occurrence inside a note", () => {
	const root = document.createElement("main");
	root.innerHTML =
		'<tp-note ref="n"><tp-ref id="occ" href="!term" silent></tp-ref></tp-note><tp-listof><div data-tp-reference-output><ol><li data-tp-note-ref="n"><p>Note <tp-ref href="!term" silent></tp-ref>text.</p></li></ol></div></tp-listof>';
	expect(globalListTarget(root, "occ")).toBe(root.querySelector("li p"));
});

it("groups a merged index by letter and opens a closed cross-reference destination", async () => {
	const { list } = setup(
		{
			"/a.html":
				'<tp-index ref="a" title="Alpha" see="b"></tp-index><tp-index ref="child" title="Child" parent="a"></tp-index><tp-index ref="b" title="Beta"></tp-index><tp-index ref="symbol" title="+"></tp-index>',
		},
		"tp-index",
	);
	list.setAttribute("merge", "");
	list.setAttribute("group-by", "letter");
	await list.refresh();
	const panels = [
		...list.querySelectorAll("tp-accordion[data-tp-index-letter]"),
	];
	expect(panels.map((p) => p.getAttribute("data-tp-index-letter"))).toEqual([
		"Symbols",
		"A",
		"B",
	]);
	expect(
		panels.every(
			(p) =>
				p.querySelector(":scope > dl > dt")?.getAttribute("aria-expanded") ===
				"false",
		),
	).toBe(true);
	expect(
		panels[1]?.querySelector("dl[data-tp-global-definitions] dd dl dt")
			?.textContent,
	).toBe("Child");
	list
		.querySelector<HTMLAnchorElement>("a[data-tp-global-index-crossref]")
		?.click();
	expect(
		panels[2]?.querySelector(":scope > dl > dt")?.getAttribute("aria-expanded"),
	).toBe("true");
});

it("indexes external exercise prompts without loading solutions or executing editors", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn(
			async () =>
				new Response(
					`<dl><dt>Title</dt><dd>Exercise</dd><dt>Prompt</dt><dd><figure id="book"><img src="https://example.test/docs/exercises/image.svg"><figcaption>Book figure</figcaption></figure></dd><dt>Context</dt><dd><a href="../chapter.md">Chapter</a></dd><dt>Solution</dt><dd><figure id="answer"><figcaption>Answer figure</figcaption></figure></dd></dl>`,
				),
		),
	);
	const snapshot = new DOMParser().parseFromString(
		'<tp-scheme-interpreter-question src="exercises/one.md"></tp-scheme-interpreter-question>',
		"text/html",
	);
	await expandQuestionPrompts(snapshot, "https://example.test/docs/chapter.md");
	expect(snapshot.querySelector("#book")).not.toBeNull();
	expect(snapshot.querySelector("img")?.getAttribute("src")).toBe(
		"https://example.test/docs/image.svg",
	);
	expect(snapshot.querySelector("#answer,tp-scheme,tp-code-editor")).toBeNull();
	expect(fetch).toHaveBeenCalledWith(
		"https://example.test/docs/exercises/one.md",
	);
});
