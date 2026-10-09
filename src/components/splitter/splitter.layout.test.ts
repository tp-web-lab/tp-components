import { afterEach, describe, expect, it } from "vitest";
import { TpSplitter } from "./splitter.js";

afterEach(() => document.body.replaceChildren());

describe("splitter layout integration", () => {
	it("establishes a formatting context to fit beside a floating table of contents", () => {
		const splitter = new TpSplitter();
		document.body.append(splitter);
		expect(
			document.getElementById("tp-splitter-styles")?.textContent,
		).toContain("display: flow-root;");
		expect(splitter.storageKey).toBe("");
		expect(splitter.hasAttribute("storage-key")).toBe(false);
	});

	it("keeps nested perpendicular dividers independent", () => {
		document.body.innerHTML = `
			<tp-splitter position="30%">
				<dl>
					<dt>start</dt><dd>Navigation</dd>
					<dt>end</dt><dd>
						<tp-splitter axis="vertical" position="55%">
							<dl><dt>start</dt><dd>Editor</dd><dt>end</dt><dd>Preview</dd></dl>
						</tp-splitter>
					</dd>
				</dl>
			</tp-splitter>`;
		const outer = document.querySelector("tp-splitter");
		const inner = outer?.querySelector("tp-splitter");
		expect(outer).toBeInstanceOf(TpSplitter);
		expect(inner).toBeInstanceOf(TpSplitter);
		if (!(outer instanceof TpSplitter) || !(inner instanceof TpSplitter))
			throw new Error("Both splitters must be registered");
		const outerDivider = outer.querySelector(":scope > dl > [role=separator]");
		const innerDivider = inner.querySelector(":scope > dl > [role=separator]");
		expect(outerDivider?.getAttribute("aria-orientation")).toBe("vertical");
		expect(innerDivider?.getAttribute("aria-orientation")).toBe("horizontal");
		innerDivider?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
		);
		expect(inner.position).toBe("56%");
		expect(outer.position).toBe("30%");
		outerDivider?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
		);
		expect(outer.position).toBe("31%");
		expect(inner.position).toBe("56%");
	});
});
