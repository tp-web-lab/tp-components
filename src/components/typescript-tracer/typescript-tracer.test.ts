import { afterEach, beforeEach, expect, it, vi } from "vitest";

const workers = vi.hoisted(() => ({ created: 0, terminated: 0 }));
vi.mock("./typescript-tracer-worker.js?worker", () => ({
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
import { TpTypescriptTracer } from "./typescript-tracer.js";

const trace = {
	version: 1,
	language: "typescript",
	code: "console.log(42)",
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
	const host = new TpTypescriptTracer();
	for (const [key, value] of Object.entries(attributes))
		host.setAttribute(key, value);
	document.body.append(host);
	return host;
}
it("replays trace before src without starting a Worker, and clamps navigation", async () => {
	const fetcher = vi.fn(async () => new Response(JSON.stringify(trace)));
	vi.stubGlobal("fetch", fetcher);
	const host = mount({ src: "unused.ts", trace: "saved.json" });
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
	host.filename = "lesson.ts";
	expect(host.querySelector('[data-role="filename"]')?.textContent).toBe(
		"lesson.ts",
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
	const host = new TpTypescriptTracer();
	host.innerHTML =
		'<script type="tp/typescript">\n    console.log(42)\n</script>';
	document.body.append(host);
	await host.refresh();
	const editor = host.querySelector("tp-code-editor");
	expect(editor?.getValue()).toBe("console.log(42)");
	expect(host.querySelector('script[type="tp/typescript"]')).not.toBeNull();
	host.record();
	expect(workers.created).toBe(1);
	host.remove();
	expect(workers.terminated).toBe(1);
	document.body.append(host);
	await host.refresh();
	expect(
		host.querySelectorAll("[data-tp-typescript-tracer-generated]"),
	).toHaveLength(1);
	expect(host.querySelector("tp-code-editor")?.getValue()).toBe(
		"console.log(42)",
	);
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
	const a = mount({ value: "console.log(1)" }),
		b = mount({ value: "console.log(2)" });
	await Promise.all([a.refresh(), b.refresh()]);
	expect(a.querySelector("tp-code-editor")?.getValue()).toBe("console.log(1)");
	expect(b.querySelector("tp-code-editor")?.getValue()).toBe("console.log(2)");
	expect(a.querySelector('[data-role="source"]')?.id).not.toBe(
		b.querySelector('[data-role="source"]')?.id,
	);
	const html = await htmlToMarkup(a.outerHTML, "html");
	expect(html).not.toContain("tp-code-editor");
	expect(html).toContain("tp-typescript-tracer");
});

it("rejects Python recordings without replacing a loaded TypeScript tracer", async () => {
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
		"Expected a TypeScript recording",
	);
	expect(JSON.parse(host.getCode())).toEqual(trace);
});
