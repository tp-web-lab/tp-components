import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { parseTrace } from "./trace-file.js";

const workers = vi.hoisted(() => ({ created: 0, terminated: 0 }));
vi.mock("./python-tracer-worker.js?worker", () => ({
	default: class {
		onmessage?: (event: { data: unknown }) => void;
		constructor() {
			workers.created++;
		}
		postMessage() {}
		terminate() {
			workers.terminated++;
		}
	},
}));
vi.mock("../code-editor/code-editor.js", () => {
	class Editor extends HTMLElement {
		value = "";
		setValue(value: string) {
			this.value = value;
		}
		getValue() {
			return this.value;
		}
	}
	if (!customElements.get("tp-code-editor"))
		customElements.define("tp-code-editor", Editor);
	return {};
});

import { htmlToMarkup } from "../../utilities/markup-conversion.js";
import { TpPythonTracer } from "./python-tracer.js";

const trace = {
	version: 1,
	code: "print(42)",
	trace: [
		{ event: "step_line", line: 1, globals: {}, heap: {}, stdout: "" },
		{ event: "return", line: 1, globals: {}, heap: {}, stdout: "42\n" },
	],
};
beforeEach(() => {
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	workers.created = 0;
	workers.terminated = 0;
});
function mount(attributes: Record<string, string> = {}) {
	const host = new TpPythonTracer();
	for (const [key, value] of Object.entries(attributes))
		host.setAttribute(key, value);
	document.body.append(host);
	return host;
}
it("replays trace before src without starting a Worker, and clamps navigation", async () => {
	const fetcher = vi.fn(async () => new Response(JSON.stringify(trace)));
	vi.stubGlobal("fetch", fetcher);
	const host = mount({ src: "unused.py", trace: "saved.json" });
	await host.refresh();
	expect(fetcher.mock.calls.length).toBeGreaterThan(0);
	expect(JSON.parse(host.getCode())).toEqual(trace);
	expect(workers.created).toBe(0);
	expect(host.shadowRoot).toBeNull();
	expect(host.querySelector('[data-role="filename"]')?.textContent).toBe(
		"saved.json",
	);
	const saved = host.getCode();
	host.filename = "lesson.py";
	expect(host.querySelector('[data-role="filename"]')?.textContent).toBe(
		"lesson.py",
	);
	expect(host.getCode()).toBe(saved);
	expect(
		host.querySelector<HTMLElement>('[data-role="source-panel"]')?.hidden,
	).toBe(true);
	expect(
		host.querySelector('[data-role="edit"]')?.getAttribute("aria-expanded"),
	).toBe("false");
	host.toggleSource();
	expect(
		host.querySelector<HTMLElement>('[data-role="source-panel"]')?.hidden,
	).toBe(false);
	expect(
		host.querySelector('[data-role="edit"]')?.getAttribute("aria-expanded"),
	).toBe("true");
	host.toggleSource();
	expect(
		host.querySelector<HTMLElement>('[data-role="source-panel"]')?.hidden,
	).toBe(true);
	expect(host.getCode()).toBe(saved);

	host.goTo(99);
	expect(host.querySelector('[data-role="stdout"]')?.textContent).toBe("42\n");
	host.goTo(-5);
	expect(host.querySelector('[data-role="status"]')?.textContent).toBe(
		"Step 1 / 2",
	);
});
it("dedents author source, preserves it on reconnect and cleans up recording", async () => {
	const host = new TpPythonTracer();
	host.innerHTML = '<script type="tp/python">\n    print(42)\n</script>';
	document.body.append(host);
	await host.refresh();
	const editor = host.querySelector("tp-code-editor");
	expect(editor?.getValue()).toBe("print(42)");
	expect(host.querySelector('script[type="tp/python"]')).not.toBeNull();
	host.record();
	expect(workers.created).toBe(1);
	host.remove();
	expect(workers.terminated).toBe(1);
	document.body.append(host);
	await host.refresh();
	expect(
		host.querySelectorAll("[data-tp-python-tracer-generated]"),
	).toHaveLength(1);
	expect(host.querySelector("tp-code-editor")?.getValue()).toBe("print(42)");
});
it("retains the previous recording when a replacement trace is invalid", async () => {
	let body = JSON.stringify(trace);
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response(body)),
	);
	const host = mount({ trace: "saved.json" });
	await host.refresh();
	body = '{"code":"x","trace":[{"event":"line","heap":{"1":null}}]}';
	await host.refresh();
	expect(JSON.parse(host.getCode())).toEqual(trace);
	expect(host.querySelector('[data-role="status"]')?.textContent).toContain(
		"Load failed",
	);
});
it("keeps instances independent and excludes rendered controls from conversions", async () => {
	const a = mount({ value: "print(1)" }),
		b = mount({ value: "print(2)" });
	await Promise.all([a.refresh(), b.refresh()]);
	expect(a.querySelector("tp-code-editor")?.getValue()).toBe("print(1)");
	expect(b.querySelector("tp-code-editor")?.getValue()).toBe("print(2)");
	expect(a.querySelector('[data-role="source"]')?.id).not.toBe(
		b.querySelector('[data-role="source"]')?.id,
	);
	const html = await htmlToMarkup(a.outerHTML, "html");
	expect(html).not.toContain("tp-code-editor");
	expect(html).toContain("tp-python-tracer");
});
it.each([
	null,
	{ code: "x", trace: [] },
	{ ...trace, version: 2 },
	{ ...trace, trace: [{ event: "line", ordered_globals: "wrong" }] },
	{ ...trace, trace: [{ event: "line", heap: { 1: ["DICT", null] } }] },
])("rejects malformed complete recordings: %j", (value) => {
	expect(() => parseTrace(JSON.stringify(value))).toThrow();
});
it("accepts legacy unversioned recordings", () => {
	expect(
		parseTrace(JSON.stringify({ code: trace.code, trace: trace.trace })).trace,
	).toHaveLength(2);
});
it("renders class and instance attributes, pretty text and shared references without JSON", async () => {
	const snapshot = {
		version: 1,
		code: "counter = Counter()",
		trace: [
			{
				event: "return",
				heap: {
					1: ["CLASS", "Counter", ["Base"], ["increment", ["REF", 4]]],
					2: ["INSTANCE", "Counter", ["value", 4], ["peer", ["REF", 3]]],
					3: [
						"INSTANCE_PPRINT",
						"Counter",
						"Counter(4)",
						["value", 4],
						["peer", ["REF", 2]],
					],
					4: ["FUNCTION", "increment(self)"],
					5: ["CLASS", "Base", []],
				},
				globals: { counter: ["REF", 2], alias: ["REF", 2] },
			},
		],
	};
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response(JSON.stringify(snapshot))),
	);
	const host = mount({ trace: "classes.json" });
	await host.refresh();
	expect(host.querySelectorAll('[data-object-kind="instance"]')).toHaveLength(
		2,
	);
	expect(host.querySelector('[data-object="1"]')?.textContent).toContain(
		"super: Base",
	);
	const baseLink = host.querySelector<HTMLAnchorElement>(
		'[data-object="1"] .super-link',
	);
	const baseCard = host.querySelector('[data-object="5"]');
	expect(baseLink?.getAttribute("href")).toBe(`#${baseCard?.id}`);
	baseLink?.dispatchEvent(new Event("focusin", { bubbles: true }));
	expect(baseCard?.classList.contains("referenced")).toBe(true);
	baseLink?.dispatchEvent(new Event("focusout", { bubbles: true }));
	expect(baseCard?.classList.contains("referenced")).toBe(false);
	expect(host.querySelector('[data-object="2"] dt')?.textContent).toBe("value");
	expect(host.querySelector('[data-object="2"] dd')?.textContent).toBe("4");
	expect(host.querySelector('[data-object="3"]')?.textContent).toContain(
		"Counter(4)",
	);
	expect(host.querySelectorAll('[data-role="heap"] pre')).toHaveLength(0);
	expect(
		host.querySelector('[data-object="2"] [data-reference="3"]'),
	).not.toBeNull();
	expect(
		host.querySelector('[data-object="3"] [data-reference="2"]'),
	).not.toBeNull();
	expect(
		host.querySelector('[data-object="1"] [data-reference="4"]'),
	).not.toBeNull();
	expect(
		host.querySelectorAll('[data-role="frames"] [data-reference="2"]'),
	).toHaveLength(2);
});
it.each(
	[
		["INSTANCE", null],
		["INSTANCE", "Counter", null],
		["INSTANCE", "Counter", [5, 4]],
		["CLASS", "Counter", null],
		["INSTANCE_PPRINT", "Counter", {}],
	].map((entry) => ({ entry })),
)("rejects malformed instance or class metadata: $entry", ({ entry }) => {
	expect(() =>
		parseTrace(
			JSON.stringify({
				...trace,
				trace: [{ event: "line", heap: { 1: entry } }],
			}),
		),
	).toThrow();
});
