import { afterEach, expect, it, vi } from "vitest";
import {
	releaseInterpreterScope,
	scopedInterpreterEngine,
} from "./interpreter-scope.js";

afterEach(() => document.body.replaceChildren());
it("shares definitions while routing output and releasing the last owner", async () => {
	const a = document.createElement("div"),
		b = document.createElement("div");
	for (const host of [a, b]) {
		host.setAttribute("execution-scope", "shared-test");
		document.body.append(host);
	}
	const dispose = vi.fn();
	let value = "";
	const create = vi.fn(async (write: (text: string) => void) => ({
		execute: async (code: string) => {
			if (code !== "read") value = code;
			write(value);
			return value;
		},
		dispose,
	}));
	const first = vi.fn(),
		second = vi.fn();
	const one = await scopedInterpreterEngine(a, "test", first, create);
	const two = await scopedInterpreterEngine(b, "test", second, create);
	await one.execute("42");
	expect(await two.execute("read")).toBe("42");
	expect(create).toHaveBeenCalledOnce();
	expect(first).toHaveBeenCalledExactlyOnceWith("42");
	expect(second).toHaveBeenCalledExactlyOnceWith("42");
	one.dispose();
	expect(dispose).not.toHaveBeenCalled();
	releaseInterpreterScope(a);
	expect(dispose).not.toHaveBeenCalled();
	releaseInterpreterScope(b);
	await Promise.resolve();
	expect(dispose).toHaveBeenCalledOnce();
});
