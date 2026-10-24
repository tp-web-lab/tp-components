import { reportToolLoaded, toolLoadedScript } from "@tp/tp-utilities";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const key = Symbol.for("@tp/loaded-tools");
describe("tool loading messages", () => {
	beforeEach(() => {
		Reflect.deleteProperty(globalThis, key);
	});
	afterEach(() => {
		Reflect.deleteProperty(globalThis, key);
		vi.restoreAllMocks();
	});
	it("reports each tool only once across multiple callers", () => {
		const info = vi.spyOn(console, "info").mockImplementation(() => {});
		reportToolLoaded("pele", "Pele", "1.6.0");
		reportToolLoaded("pele", "Pele");
		reportToolLoaded("mermaid", "Mermaid");
		expect(info.mock.calls).toEqual([
			["[tp-pele] Pele 1.6.0 loaded."],
			["[tp-mermaid] Mermaid loaded."],
		]);
	});
	it("deduplicates serialized runtime reporters with module reporters", () => {
		const info = vi.spyOn(console, "info").mockImplementation(() => {});
		const run = new Function(
			toolLoadedScript("sqljs", "sql.js", JSON.stringify("1.13.0")),
		);
		run();
		run();
		reportToolLoaded("sqljs", "sql.js");
		expect(info).toHaveBeenCalledExactlyOnceWith(
			"[tp-sqljs] sql.js 1.13.0 loaded.",
		);
	});
	it("shares the first-load message with same-origin preview windows", () => {
		const info = vi.fn();
		const parent = { document: {}, console: { info } };
		Object.assign(parent, { window: parent, parent });
		const first = { parent, console: { info: vi.fn() } };
		Object.assign(first, { window: first });
		const second = { parent, console: { info: vi.fn() } };
		Object.assign(second, { window: second });
		const run = new Function("globalThis", toolLoadedScript("pele", "Pele"));
		run(first);
		run(second);
		expect(info).toHaveBeenCalledExactlyOnceWith("[tp-pele] Pele loaded.");
		expect(first.console.info).not.toHaveBeenCalled();
		expect(second.console.info).not.toHaveBeenCalled();
	});

	it("does not report a failed loader, and allows a later success", async () => {
		const info = vi.spyOn(console, "info").mockImplementation(() => {});
		const load = async (promise: Promise<void>) => {
			await promise;
			reportToolLoaded("test", "Test");
		};
		await expect(load(Promise.reject(new Error("offline")))).rejects.toThrow(
			"offline",
		);
		expect(info).not.toHaveBeenCalled();
		await load(Promise.resolve());
		await load(Promise.resolve());
		expect(info).toHaveBeenCalledExactlyOnceWith("[tp-test] Test loaded.");
	});
});
