import { createContext, runInContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";
import { required } from "../../test-helpers/required.js";
import { createPyodideRuntimeScript } from "./python-runtime-script.js";

/** Minimal runtime used to exercise the generated script without downloading Python. */
interface PyodideStub {
	loadPackage: (packages: string[], options: unknown) => Promise<void>;
}

/** Shared state that must survive replacement of a preview window. */
interface RuntimeState {
	executionQueue: Promise<unknown>;
	loadPromise: Promise<void> | null;
	pyodidePromise: Promise<PyodideStub> | null;
}

/** Public functions installed in each disposable execution frame. */
interface PreviewWindow {
	parent: object;
	document: object;
	tpLoadPyodide?: () => Promise<PyodideStub>;
	tpRunWithPyodide?: (callback: () => unknown) => Promise<unknown>;
	tpLoadPyodidePackages?: (
		pyodide: PyodideStub,
		packages: string[],
	) => Promise<void>;
}

/** Creates independent owner/preview realms, mirroring the nested Attributes example. */
function createHarness() {
	const pyodide = { loadPackage: vi.fn(async () => {}) };
	const loadPyodide = vi.fn(async () => pyodide);
	const owner: {
		window?: object;
		document?: object;
		loadPyodide?: typeof loadPyodide;
		__tpPythonPlaygroundPyodideRuntime?: RuntimeState;
	} = {};
	owner.window = owner;
	const ownerContext = createContext(owner);
	const append = vi.fn((script: HTMLScriptElement) => {
		if (script.textContent) runInContext(script.textContent, ownerContext);
		else {
			owner.loadPyodide = loadPyodide;
			script.dispatchEvent(new Event("load"));
		}
	});
	owner.document = {
		createElement: () => document.createElement("script"),
		head: { append },
	};
	const ownerPromise = runInContext(
		"Promise",
		ownerContext,
	) as PromiseConstructor;
	const createPreview = () => {
		const preview: PreviewWindow = { parent: owner, document: {} };
		const context = createContext({
			window: preview,
			document: preview.document,
			console: { info: vi.fn(), log: vi.fn(), error: vi.fn() },
		});
		const script = createPyodideRuntimeScript()
			.replace(/^\s*<script>/, "")
			.replace(/<\/script>\s*$/, "");
		runInContext(script, context);
		return {
			navigate: () => {
				preview.document = {};
			},
			load: required(preview.tpLoadPyodide),
			run: required(preview.tpRunWithPyodide),
			loadPackages: required(preview.tpLoadPyodidePackages),
		};
	};
	return { owner, ownerPromise, createPreview, append, pyodide, loadPyodide };
}

describe("persistent Python runtime", () => {
	it("recovers when an active callback belongs to a replaced preview document", async () => {
		const harness = createHarness();
		const first = harness.createPreview();
		await first.load();
		const callback = vi.fn(() => new Promise(() => {}));
		void first.run(callback);
		await Promise.resolve();
		expect(callback).toHaveBeenCalledOnce();
		const abandoned = harness.owner.__tpPythonPlaygroundPyodideRuntime;
		first.navigate();
		const next = harness.createPreview();
		await next.load();
		await expect(next.run(() => 42)).resolves.toBe(42);
		expect(harness.owner.__tpPythonPlaygroundPyodideRuntime).not.toBe(
			abandoned,
		);
		expect(harness.loadPyodide).toHaveBeenCalledTimes(2);
	});

	it("does not start a queued callback after its preview was replaced", async () => {
		const harness = createHarness();
		const preview = harness.createPreview();
		const callback = vi.fn();
		const queued = preview.run(callback);
		preview.navigate();
		await queued;
		expect(callback).not.toHaveBeenCalled();
	});

	it("replaces stalled legacy state instead of reusing its abandoned promises", async () => {
		const harness = createHarness();
		const legacy: RuntimeState = {
			executionQueue: new Promise(() => {}),
			loadPromise: new Promise(() => {}),
			pyodidePromise: new Promise(() => {}),
		};
		harness.owner.__tpPythonPlaygroundPyodideRuntime = legacy;
		const preview = harness.createPreview();
		await expect(preview.load()).resolves.toBe(harness.pyodide);
		await expect(preview.run(() => 42)).resolves.toBe(42);
		expect(harness.owner.__tpPythonPlaygroundPyodideRuntime).not.toBe(legacy);
	});

	it("allows retrying initialization after a runtime loading failure", async () => {
		const harness = createHarness();
		harness.loadPyodide.mockRejectedValueOnce(new Error("Loading failed"));
		const preview = harness.createPreview();
		await expect(preview.load()).rejects.toThrow("Loading failed");
		await expect(preview.load()).resolves.toBe(harness.pyodide);
		expect(harness.loadPyodide).toHaveBeenCalledTimes(2);
	});

	it("creates cached loading and execution promises in the owner realm", async () => {
		const harness = createHarness();
		const first = harness.createPreview();
		await expect(first.load()).resolves.toBe(harness.pyodide);
		const runtime = required(harness.owner.__tpPythonPlaygroundPyodideRuntime);
		expect(runtime.loadPromise).toBeInstanceOf(harness.ownerPromise);
		expect(runtime.pyodidePromise).toBeInstanceOf(harness.ownerPromise);
		expect(runtime.executionQueue).toBeInstanceOf(harness.ownerPromise);
		await expect(first.run(() => 42)).resolves.toBe(42);

		const next = harness.createPreview();
		await expect(next.load()).resolves.toBe(harness.pyodide);
		await expect(next.run(() => 43)).resolves.toBe(43);
		expect(runtime.executionQueue).toBeInstanceOf(harness.ownerPromise);
		expect(harness.loadPyodide).toHaveBeenCalledOnce();
		// One owner installer and one Pyodide loader, never a reinstall per Run.
		expect(harness.append).toHaveBeenCalledTimes(2);
	});

	it("keeps the shared queue usable after errors and reuses loaded packages", async () => {
		const harness = createHarness();
		const first = harness.createPreview();
		await first.loadPackages(harness.pyodide, ["numpy"]);
		await expect(
			first.run(() => {
				throw new Error("Python error");
			}),
		).rejects.toThrow("Python error");
		const next = harness.createPreview();
		await next.loadPackages(harness.pyodide, ["numpy"]);
		expect(harness.pyodide.loadPackage).toHaveBeenCalledOnce();
		await expect(next.run(() => "next run")).resolves.toBe("next run");
	});
});
