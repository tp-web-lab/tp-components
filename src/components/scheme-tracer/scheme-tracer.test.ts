import { afterEach, beforeEach, expect, it, vi } from "vitest";

const workers = vi.hoisted(() => ({
	created: 0,
	terminated: 0,
	message: undefined as unknown,
}));
vi.mock("./scheme-tracer-worker.js?worker", () => ({
	default: class {
		onmessage?: (event: { data: unknown }) => void;
		constructor() {
			workers.created++;
		}
		postMessage(data: unknown) {
			workers.message = data;
		}
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
import { TpSchemeTracer } from "./scheme-tracer.js";

const trace = {
	version: 1,
	language: "scheme",
	code: "(+ 40 2)",
	trace: [
		{
			event: "step_line",
			line: 1,
			globals: {
				future: ["UNINITIALIZED", "<uninitialized>"],
				empty: ["UNDEFINED", "undefined"],
			},
			heap: {},
			stdout: "",
		},
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
	const host = new TpSchemeTracer();
	for (const [key, value] of Object.entries(attributes))
		host.setAttribute(key, value);
	document.body.append(host);
	return host;
}
it("replays trace before src without starting a Worker, and clamps navigation", async () => {
	const fetcher = vi.fn(async () => new Response(JSON.stringify(trace)));
	vi.stubGlobal("fetch", fetcher);
	const host = mount({ src: "unused.scm", trace: "saved.json" });
	await host.refresh();
	expect(fetcher.mock.calls.length).toBeGreaterThan(0);
	expect(JSON.parse(host.getCode())).toEqual(trace);
	expect(workers.created).toBe(0);
	expect(host.shadowRoot).toBeNull();
	expect(
		[...host.querySelectorAll('[data-role="variables"] dt')].map(
			(node) => node.textContent,
		),
	).toEqual(["empty"]);
	expect(host.querySelector('[data-role="filename"]')?.textContent).toBe(
		"saved.json",
	);
	const saved = host.getCode();
	host.filename = "lesson.scm";
	expect(host.querySelector('[data-role="filename"]')?.textContent).toBe(
		"lesson.scm",
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
	const host = new TpSchemeTracer();
	host.innerHTML = '<script type="tp/scheme">\n    (+ 40 2)\n</script>';
	document.body.append(host);
	await host.refresh();
	const editor = host.querySelector("tp-code-editor");
	expect(editor?.getValue()).toBe("(+ 40 2)");
	expect(host.querySelector('script[type="tp/scheme"]')).not.toBeNull();
	host.record();
	expect(workers.created).toBe(1);
	host.remove();
	expect(workers.terminated).toBe(1);
	document.body.append(host);
	await host.refresh();
	expect(
		host.querySelectorAll("[data-tp-scheme-tracer-generated]"),
	).toHaveLength(1);
	expect(host.querySelector("tp-code-editor")?.getValue()).toBe("(+ 40 2)");
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
	const a = mount({ value: "(+ 0 1)" }),
		b = mount({ value: "(+ 0 2)" });
	await Promise.all([a.refresh(), b.refresh()]);
	expect(a.querySelector("tp-code-editor")?.getValue()).toBe("(+ 0 1)");
	expect(b.querySelector("tp-code-editor")?.getValue()).toBe("(+ 0 2)");
	expect(a.querySelector('[data-role="source"]')?.id).not.toBe(
		b.querySelector('[data-role="source"]')?.id,
	);
	const html = await htmlToMarkup(a.outerHTML, "html");
	expect(html).not.toContain("tp-code-editor");
	expect(html).toContain("tp-scheme-tracer");
});

it("rejects Python recordings without replacing a loaded Scheme tracer", async () => {
	let body = JSON.stringify(trace);
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response(body)),
	);
	const host = mount({ trace: "trace.json" });
	await host.refresh();
	body = JSON.stringify({ ...trace, language: "python" });
	await host.refresh();
	expect(host.querySelector('[data-role="status"]')?.textContent).toContain(
		"Expected a Scheme recording",
	);
	expect(JSON.parse(host.getCode())).toEqual(trace);
});

it("sends source and query separately and preserves them in replayed JSON", async () => {
	const source = "(+ 1 2) (define x 40)",
		query = "(+ x 2)";
	const saved = { ...trace, source, query, code: `${source}\n\n${query}` };
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response(JSON.stringify(saved))),
	);
	const host = mount({ trace: "saved.json", query: "ignored" });
	await host.refresh();
	expect(JSON.parse(host.getCode())).toEqual(saved);
	expect(host.querySelector("tp-code-editor")?.getValue()).toBe(source);
	host.record();
	expect(workers.message).toEqual({ code: source, query });
	host.removeAttribute("trace");
	host.value = source;
	host.query = query;
	await host.refresh();
	host.record();
	expect(workers.message).toEqual({ code: source, query });
	host.removeAttribute("query");
	await host.refresh();
	host.record();
	expect(workers.message).toEqual({ code: source });
});
it("rejects inconsistent saved source/query metadata", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn(
			async () =>
				new Response(
					JSON.stringify({ ...trace, source: "wrong", query: "42" }),
				),
		),
	);
	const host = mount({ trace: "bad.json" });
	await host.refresh();
	expect(host.querySelector('[data-role="status"]')?.textContent).toContain(
		"Load failed",
	);
	expect(workers.created).toBe(0);
});

it("replays exact expression highlights and groups unchanged legacy events", async () => {
	const code = "(+ (* 3 5) (- 10 6))";
	const first = {
		event: "step_line",
		line: 1,
		source_range: { start: 3, end: 10 },
		stdout: "",
		globals: {},
		heap: {},
	};
	const data = {
		version: 1,
		language: "scheme",
		code,
		trace: [
			first,
			{ ...first, event: "result" },
			{
				...first,
				event: "result",
				source_range: { start: 0, end: code.length },
				stdout: "19\n",
			},
		],
	};
	let body = JSON.stringify(data);
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response(body)),
	);
	const host = mount({ trace: "saved.json" });
	await host.refresh();
	expect(host.querySelector('[data-role="recorded"] mark')?.textContent).toBe(
		"(* 3 5)",
	);
	expect(JSON.parse(host.getCode()).trace).toHaveLength(2);
	expect(JSON.parse(host.getCode()).trace[0].grouped_steps).toBe(2);
	host.goTo(1);
	expect(host.querySelector('[data-role="recorded"] mark')?.textContent).toBe(
		code,
	);
	expect(host.querySelector('[data-role="stdout"]')?.textContent).toBe("19\n");
	const saved = host.getCode();
	body = JSON.stringify({
		...data,
		trace: [{ ...first, source_range: { start: 0, end: 999 } }],
	});
	await host.refresh();
	expect(host.getCode()).toBe(saved);
	expect(workers.created).toBe(0);
});
