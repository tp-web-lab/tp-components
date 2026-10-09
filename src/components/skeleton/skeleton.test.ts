import { afterEach, describe, expect, it, vi } from "vitest";
import { TpSkeleton } from "./skeleton.js";

/** Mounts a preview from a literal HTML value. */
function mount(value = ""): TpSkeleton {
	const element = document.createElement("tp-skeleton");
	element.value = value;
	document.body.append(element);
	return element;
}

/** Waits for asynchronous source acquisition and traversal. */
async function rendered(element: TpSkeleton): Promise<void> {
	await vi.waitFor(() =>
		expect(element.hasAttribute("data-rendered")).toBe(true),
	);
}

/** Returns the recognized elements in document order. */
function kinds(element: TpSkeleton): (string | undefined)[] {
	return Array.from(element.querySelectorAll<HTMLElement>("[data-kind]")).map(
		(node) => node.dataset.kind,
	);
}

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe("tp-skeleton", () => {
	it("keeps navigation bars aligned and equally wide while preserving paragraph spacing", async () => {
		const element = mount("<nav></nav><p></p><figure></figure><h1></h1>");
		await rendered(element);
		Array.from(element.querySelectorAll('[data-kind="nav"] > span')).forEach(
			(bar) => {
				expect(getComputedStyle(bar).marginTop).toBe("0px");
				expect(
					Number.parseFloat(
						getComputedStyle(bar).marginBlockStart ||
							getComputedStyle(bar).marginTop,
					),
				).toBe(0);
				expect(getComputedStyle(bar).inlineSize).toBe("20%");
			},
		);
		const paragraph = element.querySelector(
			'[data-kind="p"] > span:last-child',
		);
		const caption = element.querySelector(
			'[data-kind="figure"] > span:last-child',
		);
		const heading = element.querySelector('[data-kind="h1"] > span');
		if (!paragraph || !caption || !heading)
			throw new Error("Missing skeleton bars");
		expect(
			Number.parseFloat(getComputedStyle(paragraph).marginBlockStart),
		).toBeGreaterThan(0);
		expect(getComputedStyle(paragraph).inlineSize).toBe("65%");
		expect(getComputedStyle(caption).inlineSize).toBe("40%");
		expect(getComputedStyle(heading).inlineSize).toBe("70%");
	});
	it("keeps table cells aligned and full-width without text-line spacing", async () => {
		const element = mount("<table></table>");
		await rendered(element);
		const cells = element.querySelectorAll('[data-kind="table"] > span');
		expect(cells).toHaveLength(12);
		Array.from(cells).forEach((cell) => {
			expect(getComputedStyle(cell).marginTop).toBe("0px");
			expect(getComputedStyle(cell).inlineSize).toBe("100%");
		});
	});
	it("registers, exposes defaults and renders empty input without a keyboard stop", async () => {
		const element = mount();
		await rendered(element);
		expect(element).toBeInstanceOf(TpSkeleton);
		expect(element.src).toBe("");
		expect(element.value).toBe("");
		expect(element.label).toBe("Content layout preview");
		expect(kinds(element)).toEqual(["h1"]);
		expect(element.hasAttribute("tabindex")).toBe(false);
		expect(element.querySelector('[role="status"]')?.textContent).toBe(
			"No HTML source provided.",
		);
	});

	it("creates every fixed pattern without reading leaf descendants", async () => {
		const tags = [
			"p",
			"ul",
			"ol",
			"dl",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"blockquote",
			"figure",
			"nav",
			"table",
		];
		const element = mount(tags.map((tag) => `<${tag}></${tag}>`).join(""));
		await rendered(element);
		expect(kinds(element)).toEqual(tags);
		expect(element.querySelector('[data-kind="table"]')?.children).toHaveLength(
			12,
		);
		expect(element.querySelector('[data-kind="dl"]')?.children).toHaveLength(4);
		expect(
			element.querySelector('[data-kind="figure"]')?.children,
		).toHaveLength(2);
		const empty = element.querySelector('[data-kind="ul"]')?.innerHTML;
		element.value =
			"<ul><li><p>Private text</p><figure>Ignored</figure></li></ul><table><tr><td><h1>Hidden</h1></td></tr></table>";
		await rendered(element);
		expect(kinds(element)).toEqual(["ul", "table"]);
		expect(element.querySelector('[data-kind="ul"]')?.innerHTML).toBe(empty);
		expect(element.textContent).toBe("");
	});

	it("walks main but ignores unselected elements and never runs source code", async () => {
		const fetcher = vi.fn();
		vi.stubGlobal("fetch", fetcher);
		const element = mount(
			'<main><h1>Title</h1><div><p>Ignored subtree</p></div><p><img src="/never.png" onerror="throw 1"></p><script>throw 1</script><tp-button>Ignored</tp-button><main><nav>Links</nav></main></main>',
		);
		await rendered(element);
		expect(kinds(element)).toEqual(["main", "h1", "p", "main", "nav"]);
		expect(element.querySelector("script, img, tp-button, iframe")).toBeNull();
		expect(fetcher).not.toHaveBeenCalled();
	});

	it("reads both supported script types, including scripts added after connection", async () => {
		const first = document.createElement("tp-skeleton");
		const script = document.createElement("script");
		script.type = "tp/skeleton";
		script.textContent = "<p>Author source</p>";
		first.append(script);
		document.body.append(first);
		await rendered(first);
		expect(kinds(first)).toEqual(["p"]);
		first.remove();
		document.body.append(first);
		await rendered(first);
		expect(kinds(first)).toEqual(["p"]);
		const late = mount();
		await rendered(late);
		const source = document.createElement("script");
		source.type = "tp/html";
		source.textContent = "<h2>Late source</h2>";
		late.append(source);
		await vi.waitFor(() => expect(kinds(late)).toEqual(["h2"]));
	});

	it("uses src before value and restores value after removing src", async () => {
		const fetcher = vi.fn().mockResolvedValue(new Response("<ol></ol>"));
		vi.stubGlobal("fetch", fetcher);
		const element = mount("<p></p>");
		await rendered(element);
		element.src = "/article.html";
		await rendered(element);
		expect(kinds(element)).toEqual(["ol"]);
		expect(element.src).toBe("/article.html");
		element.src = "";
		await rendered(element);
		expect(kinds(element)).toEqual(["p"]);
		element.label = "Article outline";
		await rendered(element);
		expect(
			element.querySelector("[role=img]")?.getAttribute("aria-label"),
		).toBe("Article outline");
		element.label = "";
		await rendered(element);
		expect(element.label).toBe("Content layout preview");
	});

	it("traverses iframe srcdoc, including complete HTML documents", async () => {
		const element = mount(
			'<iframe srcdoc="&lt;!doctype html&gt;&lt;html&gt;&lt;head&gt;&lt;title&gt;Ignored&lt;/title&gt;&lt;/head&gt;&lt;body&gt;&lt;main&gt;&lt;p&gt;Text&lt;/p&gt;&lt;/main&gt;&lt;/body&gt;&lt;/html&gt;"></iframe>',
		);
		await rendered(element);
		expect(kinds(element)).toEqual(["iframe", "main", "p"]);
		element.value = '<iframe srcdoc="" src="/not-loaded.html"></iframe>';
		await rendered(element);
		expect(kinds(element)).toEqual(["iframe", "figure"]);
	});

	it("reads same-origin iframe files and resolves nested URLs relative to the file", async () => {
		const base = new URL("/frames/first.html", document.baseURI).href;
		const fetcher = vi
			.fn()
			.mockResolvedValueOnce(
				new Response('<main><iframe src="second.html"></iframe></main>'),
			)
			.mockResolvedValueOnce(new Response("<p>Nested</p>"));
		vi.stubGlobal("fetch", fetcher);
		const element = mount('<iframe src="/frames/first.html"></iframe>');
		await rendered(element);
		expect(kinds(element)).toEqual(["iframe", "main", "iframe", "p"]);
		expect(fetcher.mock.calls.map((call) => call[0])).toEqual([
			base,
			new URL("second.html", base).href,
		]);
	});

	it("keeps inaccessible, missing, unsafe and recursive frames as placeholders", async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValueOnce(new Response("", { status: 404 }))
			.mockRejectedValueOnce(new Error("Unavailable"))
			.mockResolvedValueOnce(
				new Response('<iframe src="/cycle.html"></iframe>'),
			);
		vi.stubGlobal("fetch", fetcher);
		const element = mount(
			'<iframe></iframe><iframe src="https://foreign.invalid/"></iframe><iframe src="javascript:alert(1)"></iframe><iframe src="http://["></iframe><iframe src="/missing.html"></iframe><iframe src="/offline.html"></iframe><iframe src="/cycle.html"></iframe>',
		);
		await rendered(element);
		expect(fetcher).toHaveBeenCalledTimes(3);
		expect(element.querySelectorAll(".tp-skeleton-frame")).toHaveLength(8);
		expect(element.querySelectorAll('[data-kind="figure"]')).toHaveLength(7);
	});

	it("limits nested containers", async () => {
		const element = mount(
			`${"<main>".repeat(10)}<iframe></iframe>${"</main>".repeat(10)}`,
		);
		await rendered(element);
		expect(element.textContent).toBe("No supported HTML content found.");
		element.value = `${"<main>".repeat(8)}<iframe srcdoc="&lt;p&gt;&lt;/p&gt;"></iframe>${"</main>".repeat(8)}`;
		await rendered(element);
		expect(element.querySelectorAll('[data-kind="figure"]')).toHaveLength(1);
	});

	it("shows safe source errors and recovers on a new value", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockRejectedValueOnce("<img onerror=alert(1)>"),
		);
		const element = mount();
		await rendered(element);
		element.src = "/failed.html";
		await rendered(element);
		expect(
			element.querySelector(".tp-skeleton-message")?.getAttribute("role"),
		).toBe("status");
		expect(element.textContent).toContain("<img onerror=alert(1)>");
		expect(element.querySelector("img")).toBeNull();
		element.src = "";
		element.value = "<h3></h3>";
		await rendered(element);
		expect(kinds(element)).toEqual(["h3"]);
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response("", { status: 500 })),
		);
		element.src = "/failed-again.html";
		await vi.waitFor(() =>
			expect(
				element.querySelector(".tp-skeleton-message")?.textContent,
			).toContain("500"),
		);
	});

	it("ignores obsolete responses and aborts pending requests on disconnection", async () => {
		let finish: ((response: Response) => void) | undefined;
		const fetcher = vi.fn(
			(_input: RequestInfo | URL, _init?: RequestInit) =>
				new Promise<Response>((resolve) => {
					finish = resolve;
				}),
		);
		vi.stubGlobal("fetch", fetcher);
		const element = mount("<p></p>");
		await rendered(element);
		element.src = "/slow.html";
		element.src = "";
		element.value = "<nav></nav>";
		await rendered(element);
		finish?.(new Response("<h1></h1>"));
		await Promise.resolve();
		expect(kinds(element)).toEqual(["nav"]);
		element.src = "/slow-again.html";
		element.remove();
		const options = fetcher.mock.calls.at(-1)?.[1] as RequestInit | undefined;
		expect(options?.signal?.aborted).toBe(true);
		finish?.(new Response("<h2></h2>"));
		await Promise.resolve();
		expect(kinds(element)).toEqual(["nav"]);
	});
});
