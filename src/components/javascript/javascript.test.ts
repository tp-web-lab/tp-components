import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createJavascriptEngine } from "./javascript-engine.js";
import "./javascript.js";

vi.mock("./javascript-engine.js", () => ({ createJavascriptEngine: vi.fn() }));
const execute = vi.fn(async (_code: string) => "49");
const dispose = vi.fn();
beforeEach(() => {
	execute.mockReset().mockResolvedValue("49");
	dispose.mockReset();
	vi.mocked(createJavascriptEngine)
		.mockReset()
		.mockResolvedValue({ execute, dispose });
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
function mount() {
	const el = document.createElement("tp-javascript");
	el.query = "square(7)";
	el.innerHTML =
		'<script type="tp/javascript">\n    function square(x) {\n      return x*x;\n    }\n</script>';
	document.body.append(el);
	return el;
}
describe("tp-javascript", () => {
	it("loads dedented source lazily and preserves the prompt", async () => {
		const el = mount();
		expect(createJavascriptEngine).not.toHaveBeenCalled();
		expect(el.shadowRoot).toBeNull();
		await el.run();
		expect(execute.mock.calls.map((call) => call[0])).toEqual([
			"function square(x) {\n  return x*x;\n}",
			"square(7)",
		]);
		expect(el.querySelector("tp-textfield")?.value).toBe("square(7)");
		await el.run("square(8)");
		expect(createJavascriptEngine).toHaveBeenCalledTimes(1);
	});
	it("retains the session on Clear and reloads the original on Reset", async () => {
		const el = mount();
		await el.run();
		el.clear();
		expect(el.querySelector("[role=log]")?.textContent).toBe("");
		expect(dispose).not.toHaveBeenCalled();
		await el.reset();
		expect(dispose).toHaveBeenCalledOnce();
		expect(createJavascriptEngine).toHaveBeenCalledTimes(2);
		expect(el.querySelector("[role=log]")?.textContent).not.toContain(
			"Engine:",
		);
	});
	it("reports execution errors and allows subsequent commands", async () => {
		const el = mount();
		await el.run();
		execute.mockRejectedValueOnce(new Error("expected"));
		await el.run("bad()");
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"ERROR: expected",
		);
		await el.run("square(7)");
		expect(el.getAttribute("aria-busy")).toBe("false");
	});
	it("restores the command draft after history navigation", async () => {
		const el = mount();
		await el.run("first");
		await el.run("second");
		const field = el.querySelector("tp-textfield");
		if (!field) throw new Error("Missing prompt");
		field.value = "draft";
		field.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
		expect(field.value).toBe("second");
		field.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
		expect(field.value).toBe("draft");
	});
	it("gives an external source precedence and disposes on removal", async () => {
		const el = mount();
		el.value = "ignored";
		el.src = "/squares.js";
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValue(new Response("function square(x) { return x*x; }")),
		);
		await el.run();
		expect(execute.mock.calls[0]?.[0]).toContain("function square");
		expect(el.filename).toBe("squares.js");
		el.remove();
		expect(dispose).toHaveBeenCalledOnce();
	});
	it.each(["Enter", "Shift+Enter", "Run"] as const)(
		"reloads changed editor source with %s and keeps unchanged sessions",
		async (action) => {
			vi.stubGlobal(
				"requestAnimationFrame",
				vi.fn(() => 0),
			);
			const el = mount();
			expect(el.querySelector('[label="Apply source"]')).toBeNull();
			await el.run();
			await el.toggleSource();
			const editor = el.querySelector("tp-code-editor");
			const field = el.querySelector("tp-textfield");
			if (!editor || !field) throw new Error("Missing editor or query");
			const changed = "function square(x) { return x + 1; }";
			editor.setValue(changed);
			field.value = "square(8)";
			const press = () =>
				action === "Run"
					? el.querySelector<HTMLElement>('[data-command="run"]')?.click()
					: field.dispatchEvent(
							new KeyboardEvent("keydown", {
								key: "Enter",
								shiftKey: action === "Shift+Enter",
								bubbles: true,
								cancelable: true,
							}),
						);
			el.clear();
			press();
			await vi.waitFor(() =>
				expect(execute).toHaveBeenLastCalledWith("square(8)"),
			);
			expect(execute.mock.calls.slice(-2).map((call) => call[0])).toEqual([
				changed,
				"square(8)",
			]);
			expect(createJavascriptEngine).toHaveBeenCalledTimes(2);
			expect(dispose).toHaveBeenCalledOnce();
			expect(el.querySelector("[role=log]")?.textContent).toContain(
				"> Program reloaded.\n> square(8)",
			);
			expect(field.value).toBe("square(8)");
			await vi.waitFor(() =>
				expect(el.getAttribute("aria-busy")).toBe("false"),
			);
			press();
			await vi.waitFor(() =>
				expect(el.getAttribute("aria-busy")).toBe("false"),
			);
			expect(createJavascriptEngine).toHaveBeenCalledTimes(2);
			expect(
				el
					.querySelector("[role=log]")
					?.textContent?.match(/Program reloaded\./g),
			).toHaveLength(1);
			editor.setValue("invalid source");
			execute.mockRejectedValueOnce(new Error("Invalid program"));
			const before = execute.mock.calls.length;
			press();
			await vi.waitFor(() =>
				expect(el.getAttribute("aria-busy")).toBe("false"),
			);
			expect(execute.mock.calls.slice(before).map((call) => call[0])).toEqual([
				"invalid source",
			]);
			expect(el.querySelector("[role=log]")?.textContent).toContain(
				"Invalid program",
			);
			expect(
				el
					.querySelector("[role=log]")
					?.textContent?.match(/Program reloaded\./g),
			).toHaveLength(1);
		},
	);
	it("opens the editor in simple mode without welcome or action controls", async () => {
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn(() => 0),
		);
		const el = document.createElement("tp-javascript");
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
		).toBe(true);
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
	});
});

it("does not load or execute a notebook program without a query", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const el = document.createElement("tp-javascript");
	el.mode = "simple";
	el.setAttribute("data-tp-notebook-interpreter", "");
	el.value = 'throw new Error("Must not run");';
	document.body.append(el);
	await vi.waitFor(() => expect(el.getAttribute("aria-busy")).toBe("false"));
	await el.run();
	expect(createJavascriptEngine).not.toHaveBeenCalled();
	expect(execute).not.toHaveBeenCalled();
});
