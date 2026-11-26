import { beforeEach, describe, expect, it, vi } from "vitest";
import { createJavascriptEngine } from "../javascript/javascript-engine.js";
import { createTypescriptEngine } from "./typescript-engine.js";

vi.mock("../javascript/javascript-engine.js", () => ({
	createJavascriptEngine: vi.fn(),
}));
const execute = vi.fn(async (_code: string) => "42");
const dispose = vi.fn();
beforeEach(() => {
	execute.mockClear();
	dispose.mockClear();
	vi.mocked(createJavascriptEngine).mockResolvedValue({ execute, dispose });
});
describe("TypeScript interpreter engine", () => {
	it("erases types and interfaces while preserving executable declarations", async () => {
		const engine = await createTypescriptEngine(
			document.createElement("div"),
			() => {},
		);
		await engine.execute(
			"interface Item { value: number }\nconst item: Item = {value: 42}; item.value",
		);
		const code = execute.mock.calls[0]?.[0] ?? "";
		expect(code).not.toContain("interface");
		expect(code).not.toContain(": Item");
		expect(code).toContain("const item");
		expect(code).toContain("item.value");
	});
	it("transpiles enums and generics without turning the session into a module", async () => {
		const engine = await createTypescriptEngine(
			document.createElement("div"),
			() => {},
		);
		await engine.execute(
			"enum Color { Red, Blue }\nfunction identity<T>(value: T): T { return value; }\nidentity(Color.Blue)",
		);
		const code = execute.mock.calls[0]?.[0] ?? "";
		expect(code).toContain("Color");
		expect(code).toContain("function identity(value)");
		expect(code).not.toContain("exports");
	});
	it("rejects syntax errors before execution and accepts the next command", async () => {
		const engine = await createTypescriptEngine(
			document.createElement("div"),
			() => {},
		);
		await expect(engine.execute("const n: = 3;")).rejects.toThrow(/Line 1/);
		expect(execute).not.toHaveBeenCalled();
		await expect(engine.execute("const n: number = 3; n")).resolves.toBe("42");
	});
	it("preserves let and const semantics and await expressions", async () => {
		const engine = await createTypescriptEngine(
			document.createElement("div"),
			() => {},
		);
		await engine.execute(
			"let n: number = 1; const fixed: number = 2; await Promise.resolve(n + fixed)",
		);
		const code = execute.mock.calls[0]?.[0] ?? "";
		expect(code).toContain("let n");
		expect(code).toContain("const fixed");
		expect(code).toContain("await Promise.resolve");
	});
	it("reuses the same execution session and disposes it", async () => {
		const engine = await createTypescriptEngine(
			document.createElement("div"),
			() => {},
		);
		await engine.execute("let n: number = 1");
		await engine.execute("++n");
		engine.dispose();
		expect(createJavascriptEngine).toHaveBeenCalled();
		expect(execute).toHaveBeenCalledTimes(2);
		expect(dispose).toHaveBeenCalledOnce();
	});
});
