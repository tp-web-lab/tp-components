import { afterEach, expect, it, vi } from "vitest";
import { TpMarkupMultiPages } from "./markup-multi-pages.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("places the calculator between Code and annotations and preserves its state", () => {
	vi.stubGlobal("fetch", () => new Promise<Response>(() => {}));
	const docs = new TpMarkupMultiPages();
	document.body.append(docs);
	const trigger = docs.querySelector<HTMLElement>('[data-action="calculator"]');
	if (!trigger) throw new Error("Missing calculator button");
	expect(trigger.previousElementSibling?.getAttribute("data-action")).toBe(
		"code",
	);
	expect(trigger.nextElementSibling?.localName).toBe("tp-post-it-editor");
	trigger.click();
	const drawer = docs.querySelector('tp-drawer[data-role="calculator-drawer"]');
	const field = drawer?.querySelector("tp-textfield");
	if (!drawer || !field) throw new Error("Missing calculator");
	expect(drawer.hasAttribute("open")).toBe(true);
	field.value = "42";
	trigger.click();
	expect(drawer.hasAttribute("open")).toBe(false);
	trigger.click();
	expect(drawer.hasAttribute("open")).toBe(true);
	expect(field.value).toBe("42");
	expect(drawer.querySelectorAll("tp-calculator")).toHaveLength(1);
});
