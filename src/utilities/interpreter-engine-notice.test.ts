import { expect, it } from "vitest";
import { claimInterpreterEngineNotice } from "./interpreter-engine-notice.js";

it("announces each language once per document, independently of instances", () => {
	const page = document.implementation.createHTMLDocument();
	const first = page.createElement("div");
	const second = page.createElement("div");
	expect(claimInterpreterEngineNotice(first, "prolog")).toBe(true);
	expect(claimInterpreterEngineNotice(first, "prolog")).toBe(false);
	expect(claimInterpreterEngineNotice(second, "prolog")).toBe(false);
	expect(claimInterpreterEngineNotice(second, "scheme")).toBe(true);
	const nextPage = document.implementation.createHTMLDocument();
	expect(
		claimInterpreterEngineNotice(nextPage.createElement("div"), "prolog"),
	).toBe(true);
});
