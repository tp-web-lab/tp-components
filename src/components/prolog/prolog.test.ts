import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TpDrawer } from "../drawer/drawer.js";
import { createPrologEngine } from "./prolog-engine.js";
import "./prolog.js";

vi.mock("./prolog-engine.js", () => ({ createPrologEngine: vi.fn() }));
vi.mock("../prolog-tracer/prolog-tracer.js", () => {
	class Recorder extends HTMLElement {
		value = "";
		query = "";
		filename = "";
		record = vi.fn();
		stop = vi.fn();
		refresh = vi.fn(async () => {});
	}
	customElements.define("tp-prolog-tracer", Recorder);
	return {};
});
const forEach = vi.fn(
	async (_goal: string, _input?: Record<string, unknown>) =>
		[] as Record<string, unknown>[],
);
const load = vi.fn(async (_source: string, _filename: string) => undefined);
beforeEach(() => {
	forEach.mockReset().mockResolvedValue([]);
	load.mockReset();
	vi.mocked(createPrologEngine)
		.mockReset()
		.mockResolvedValue({ prolog: { forEach, load_string: load } });
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
function mount() {
	const element = document.createElement("tp-prolog");
	element.innerHTML = '<script type="tp/prolog">color(red).</script>';
	document.body.append(element);
	return element;
}
describe("tp-prolog", () => {
	it("loads lazily, preserves author source and gives value precedence", async () => {
		const element = mount();
		expect(createPrologEngine).not.toHaveBeenCalled();
		expect(element.querySelector(".tp-prolog-output")?.textContent).toBe(
			"tp-prolog - enter a query ending with a full stop.\nEngine: SWI-Prolog 10.1.21 · WASM: swipl-wasm 8.3.1\n",
		);
		expect(
			element
				.querySelector(".tp-prolog-title tp-icon")
				?.getAttribute("library"),
		).toBe("languages");
		expect(
			element.querySelector(".tp-prolog-title tp-icon")?.getAttribute("name"),
		).toBe("file_type_prolog");
		const links = element.querySelectorAll<HTMLAnchorElement>(
			".tp-prolog-output a",
		);
		expect(Array.from(links, (link) => link.href)).toEqual([
			"https://www.swi-prolog.org/pldoc/refman/",
			"https://github.com/SWI-Prolog/npm-swipl-wasm",
		]);
		for (const link of links) {
			expect(link.target).toBe("_blank");
			expect(link.rel).toBe("noopener noreferrer");
		}
		expect(element.shadowRoot).toBeNull();
		const script = element.querySelector("script");
		if (!script) throw new Error("Missing inline script fixture");
		script.textContent = "\n    color(red).\n    color(green).\n";
		expect(element.value).toBe("color(red).\ncolor(green).");
		expect(element.filename).toBe("program.pl");
		element.filename = "colors.pl";
		expect(element.querySelector("[data-prolog-filename]")?.textContent).toBe(
			"colors.pl",
		);
		element.value = "color(blue).";
		expect(
			element.querySelector('[data-action="all"]')?.hasAttribute("disabled"),
		).toBe(false);
		const field = element.querySelector("tp-textfield");
		if (field) field.value = "color(X).";
		await element.all();
		expect(load).toHaveBeenCalledWith("color(blue).", "/colors.pl");
		expect(element.querySelector("script")?.textContent).toBe(
			"\n    color(red).\n    color(green).\n",
		);
		expect(element.textContent).toContain("false.");
	});
	it("continues the same query and clears only its transcript", async () => {
		let answer = 0;
		forEach.mockImplementation(async (goal) => {
			if (!goal.startsWith("engine_next")) return [];
			const color = ["red", "green", "blue"][answer++];
			return color ? [{ Text: `X = ${color}` }] : [];
		});
		const element = mount();
		const initialGreeting =
			element.querySelector(".tp-prolog-output")?.innerHTML;
		const prompt = element.querySelector("tp-textfield");
		expect(prompt?.hasAttribute("clearable")).toBe(true);
		expect(prompt?.hasAttribute("copy-code")).toBe(true);
		if (prompt) prompt.value = "color(X).";
		await element.run(prompt?.value ?? "");
		expect(prompt?.value).toBe("color(X).");
		await element.next();
		expect(
			forEach.mock.calls.filter(([goal]) => goal.startsWith("engine_create")),
		).toHaveLength(1);
		expect(
			forEach.mock.calls.filter(([goal]) => goal.startsWith("engine_next")),
		).toHaveLength(2);
		await element.all();
		const transcript =
			element.querySelector(".tp-prolog-output")?.textContent ?? "";
		expect(transcript.match(/X = red/g)).toHaveLength(1);
		expect(transcript.match(/X = green/g)).toHaveLength(1);
		expect(transcript.match(/X = blue/g)).toHaveLength(1);
		expect(transcript).toContain("false.");
		expect(transcript).toContain(
			"X = red ;\nX = green ;\nX = blue ;\nfalse.\n",
		);
		expect(prompt?.value).toBe("color(X).");
		expect(
			forEach.mock.calls.filter(([goal]) => goal.startsWith("engine_create")),
		).toHaveLength(1);
		expect(
			element.querySelector('[data-action="all"]')?.hasAttribute("disabled"),
		).toBe(false);
		element.clear();
		expect(element.querySelector(".tp-prolog-output")?.textContent).toBe("");
		await element.accept();
		expect(forEach).toHaveBeenCalledWith("engine_destroy(tp_repl)");
		expect(createPrologEngine).toHaveBeenCalledTimes(1);
		expect(prompt?.value).toBe("color(X).");
		await element.run(prompt?.value ?? "");
		if (prompt) prompt.value = "color(green).";
		await element.run(prompt?.value ?? "");
		const queries = forEach.mock.calls
			.filter(([goal]) => goal.startsWith("engine_create"))
			.map(([, input]) => input?.Source);
		expect(queries).toEqual(["color(X).", "color(X).", "color(green)."]);
		expect(prompt?.value).toBe("color(green).");
		await element.reset();
		expect(element.querySelector(".tp-prolog-output")?.innerHTML).toBe(
			initialGreeting,
		);
		await element.reset();
		expect(element.querySelector(".tp-prolog-output")?.innerHTML).toBe(
			initialGreeting,
		);
		await element.run("true.");
		expect(createPrologEngine).toHaveBeenCalledTimes(2);
		forEach.mockImplementation(async (goal) =>
			goal.startsWith("engine_next") ? [{ Text: "X = orange" }] : [],
		);
		await element.run("color(X).");
		await element.accept();
		expect(element.querySelector(".tp-prolog-output")?.textContent).toContain(
			"X = orange .\n",
		);
		forEach.mockImplementation(async (goal) =>
			goal.startsWith("engine_next") ? [{ Text: "true." }] : [],
		);
		await element.run("true.");
		await element.accept();
		expect(
			element.querySelector(".tp-prolog-output")?.textContent,
		).not.toContain("true. .");
	});
	it("loads src through the shared resolver, before value and script, and retries failures", async () => {
		const fetcher = vi.fn(
			async () =>
				new Response("  color(orange).\n", {
					headers: { "Content-Type": "text/plain" },
				}),
		);
		vi.stubGlobal("fetch", fetcher);
		const element = mount();
		element.setAttribute(
			"data-tp-source",
			"https://example.test/guide/index.md",
		);
		element.value = "color(blue).";
		element.src = "files/colors.pl";
		expect(element.filename).toBe("colors.pl");
		await element.run("color(X).");
		expect(fetcher).toHaveBeenCalledWith(
			"https://example.test/guide/files/colors.pl",
		);
		expect(load).toHaveBeenLastCalledWith("  color(orange).\n", "/colors.pl");
		await element.reset();
		await element.run("color(X).");
		expect(fetcher).toHaveBeenCalledTimes(1);
		element.src = "missing.pl";
		fetcher.mockResolvedValue(new Response("Not found", { status: 404 }));
		await element.reset();
		await element.run("true.");
		expect(element.querySelector(".tp-prolog-output")?.textContent).toContain(
			"ERROR:",
		);
		fetcher.mockImplementation(async () => new Response("color(green)."));
		await element.run("color(X).");
		expect(load).toHaveBeenLastCalledWith("color(green).", "/missing.pl");
	});
	it("loads libraries from the menu, preserves the prompt and clears checks on Reset", async () => {
		const loaded = new Set<string>();
		forEach.mockImplementation(async (goal) => {
			if (goal.startsWith("member(Library-Module"))
				return [...loaded].map((Library) => ({ Library }));
			if (goal === "user:use_module(library('clpfd'))") {
				loaded.add("clpfd");
				return [{}];
			}
			if (goal === "user:use_module(library('random'))")
				throw new Error("Library unavailable");
			return [];
		});
		const element = mount();
		element.query = "X #> 2.";
		const field = element.querySelector("tp-textfield");
		expect(field?.value).toBe("X #> 2.");
		expect(
			element.querySelector(
				'tp-icon-button[data-prolog-libraries-trigger][name="file_type_swiprolog"][library="languages"]',
			),
		).not.toBeNull();
		expect(element.querySelector('[data-prolog-library="dom"]')).not.toBeNull();
		const menu = element.querySelector("tp-menu");
		const choose = (name: string) =>
			menu?.dispatchEvent(
				new CustomEvent("tp-menu-item-select", {
					bubbles: true,
					detail: {
						item: element.querySelector(`[data-prolog-library="${name}"]`),
					},
				}),
			);
		choose("clpfd");
		await vi.waitFor(() =>
			expect(
				element
					.querySelector('[data-prolog-library="clpfd"]')
					?.hasAttribute("data-loaded"),
			).toBe(true),
		);
		expect(field?.value).toBe("X #> 2.");
		choose("random");
		await vi.waitFor(() =>
			expect(element.querySelector(".tp-prolog-output")?.textContent).toContain(
				"ERROR: Library unavailable",
			),
		);
		expect(
			element
				.querySelector('[data-prolog-library="random"]')
				?.hasAttribute("data-loaded"),
		).toBe(false);
		element.clear();
		expect(
			element
				.querySelector('[data-prolog-library="clpfd"]')
				?.hasAttribute("data-loaded"),
		).toBe(true);
		await element.reset();
		expect(field?.value).toBe("X #> 2.");
		expect(
			element.querySelectorAll("[data-prolog-library][data-loaded]"),
		).toHaveLength(0);
	});
	it("reports errors and restores a usable prompt", async () => {
		const element = mount();
		forEach.mockRejectedValueOnce(new Error("Syntax error"));
		await element.run("broken(");
		expect(element.querySelector(".tp-prolog-output")?.textContent).toContain(
			"ERROR: Syntax error",
		);
		expect(element.getAttribute("aria-busy")).toBe("false");
		expect(
			element.querySelector("tp-textfield")?.hasAttribute("disabled"),
		).toBe(false);
		await element.run("fail.");
		expect(element.querySelector(".tp-prolog-output")?.textContent).toContain(
			"false.",
		);
	});
	it.each(["Enter", "Shift+Enter", "Run"] as const)(
		"reloads changed editor source with %s without repeating unchanged loads",
		async (action) => {
			vi.stubGlobal(
				"requestAnimationFrame",
				vi.fn(() => 0),
			);
			const el = mount();
			expect(el.querySelector('[label="Apply source"]')).toBeNull();
			await el.run("color(X).");
			await el.toggleSource();
			const editor = el.querySelector("tp-code-editor");
			const field = el.querySelector("tp-textfield");
			if (!editor || !field) throw new Error("Missing editor or query");
			editor.setValue("color(blue).");
			field.value = "color(X).";
			const press = () =>
				action === "Run"
					? el.querySelector<HTMLElement>('[data-action="run"]')?.click()
					: field.dispatchEvent(
							new KeyboardEvent("keydown", {
								key: "Enter",
								shiftKey: action === "Shift+Enter",
								bubbles: true,
								cancelable: true,
							}),
						);
			const before = forEach.mock.calls.length;
			el.clear();
			press();
			await vi.waitFor(() =>
				expect(el.getAttribute("aria-busy")).toBe("false"),
			);
			expect(load.mock.calls.at(-1)?.[0]).toBe("color(blue).");
			expect(
				forEach.mock.calls
					.slice(before)
					.some((call) => call[1]?.Source === "color(X)."),
			).toBe(true);
			expect(load.mock.invocationCallOrder.at(-1)).toBeLessThan(
				forEach.mock.invocationCallOrder.at(-1) ?? 0,
			);
			expect(createPrologEngine).toHaveBeenCalledTimes(2);
			expect(el.querySelector("[role=log]")?.textContent).toContain(
				"> Program reloaded.\n?- color(X).",
			);
			expect(field.value).toBe("color(X).");
			press();
			await vi.waitFor(() =>
				expect(el.getAttribute("aria-busy")).toBe("false"),
			);
			expect(createPrologEngine).toHaveBeenCalledTimes(2);
			expect(
				el
					.querySelector("[role=log]")
					?.textContent?.match(/Program reloaded\./g),
			).toHaveLength(1);
			editor.setValue("invalid program");
			load.mockRejectedValueOnce(new Error("Invalid Prolog source"));
			const calls = forEach.mock.calls.length;
			press();
			await vi.waitFor(() =>
				expect(el.getAttribute("aria-busy")).toBe("false"),
			);
			expect(
				forEach.mock.calls
					.slice(calls)
					.some((call) => call[1]?.Source === "color(X)."),
			).toBe(false);
			expect(el.querySelector("[role=log]")?.textContent).toContain(
				"Invalid Prolog source",
			);
			expect(
				el
					.querySelector("[role=log]")
					?.textContent?.match(/Program reloaded\./g),
			).toHaveLength(1);
		},
	);
	it("opens the editor in simple mode and keeps solution controls without a welcome", async () => {
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn(() => 0),
		);
		const el = document.createElement("tp-prolog");
		el.mode = "simple";
		el.value = "";
		document.body.append(el);
		await vi.waitFor(() =>
			expect(el.querySelector("tp-code-editor")).not.toBeNull(),
		);
		await vi.waitFor(() =>
			expect(
				el.querySelector<HTMLElement>(".tp-interpreter-source")?.hidden,
			).toBe(false),
		);
		expect(el.querySelector("[role=log]")?.textContent).toBe("");
		expect(
			el.querySelector<HTMLElement>(".tp-interpreter-toolbar")?.hidden,
		).toBe(true);
		expect(
			el.querySelector<HTMLElement>(".tp-interpreter-actions")?.hidden,
		).toBe(false);
		const editor = el.querySelector("tp-code-editor");
		el.mode = "lite";
		expect(
			el.querySelector<HTMLElement>(".tp-interpreter-toolbar")?.hidden,
		).toBe(false);
		expect(
			el.querySelector<HTMLElement>(".tp-interpreter-actions")?.hidden,
		).toBe(false);
		el.mode = "simple";
		expect(el.querySelector("tp-code-editor")).toBe(editor);
		expect(
			el.querySelector<HTMLElement>(".tp-interpreter-actions")?.hidden,
		).toBe(false);
		for (const action of ["run", "next", "all", "accept", "clear", "reset"])
			expect(el.querySelector(`[data-action="${action}"]`)).not.toBeNull();
	});
});

it("opens an opt-in 75% trace drawer with the edited program and prompt without executing the interpreter", async () => {
	const host = mount();
	await host.openTrace();
	expect(host.querySelector("tp-drawer")).toBeNull();
	host.tracer = true;
	host.filename = "edited.pl";
	vi.spyOn(host, "getSource").mockResolvedValue("color(blue).");
	const field = host.querySelector("tp-textfield");
	if (!field) throw Error("Missing query");
	field.value = "?- color(X).";
	await host.openTrace();
	const trace = host.querySelector("tp-prolog-tracer");
	expect(trace?.value).toBe("color(blue).");
	expect(trace?.query).toBe("color(X).");
	expect(trace?.filename).toBe("edited.pl");
	expect(trace?.record).toHaveBeenCalledOnce();
	expect(host.querySelector<TpDrawer>("tp-drawer")?.open).toBe(true);
	expect(host.querySelector("tp-drawer")?.getAttribute("width")).toBe("75%");
	expect(createPrologEngine).not.toHaveBeenCalled();
	host.mode = "simple";
	expect(
		host.querySelector('.tp-interpreter-prompt > [data-command="trace"]'),
	).not.toBeNull();
	host.querySelector<TpDrawer>("tp-drawer")?.hide();
	expect(trace?.stop).toHaveBeenCalled();
	host.tracer = false;
	expect(host.querySelector("tp-drawer")).toBeNull();
	expect(host.querySelector('[data-command="trace"]')).toBeNull();
});
it("stops the trace on disconnect and restores its command on reconnect", async () => {
	const host = mount();
	host.tracer = true;
	host.query = "color(X).";
	await host.openTrace();
	const trace = host.querySelector("tp-prolog-tracer");
	host.remove();
	expect(trace?.stop).toHaveBeenCalled();
	expect(host.querySelector("tp-drawer")).toBeNull();
	document.body.append(host);
	expect(host.querySelectorAll('[data-command="trace"]')).toHaveLength(1);
});
