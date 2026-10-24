import { afterEach, describe, expect, it } from "vitest";
import { TpMask } from "./mask.js";

const flush = async () => {
	await Promise.resolve();
	await Promise.resolve();
};
function fixture(active = false) {
	const target = document.createElement("div");
	target.id = "target";
	target.innerHTML = '<input value="retained">';
	const mask = new TpMask();
	mask.anchor = "#target";
	mask.active = active;
	mask.textContent = "Hidden until review";
	document.body.append(target, mask);
	return { target, mask };
}
afterEach(() => document.body.replaceChildren());
describe("tp-mask", () => {
	it("is inactive by default and restores the same target and input", () => {
		const { target, mask } = fixture();
		const input = target.querySelector("input");
		expect(mask.active).toBe(false);
		expect(target.style.display).toBe("");
		mask.active = true;
		expect(target.style.display).toBe("none");
		expect(target.hasAttribute("inert")).toBe(true);
		expect(target.getAttribute("aria-hidden")).toBe("true");
		expect(target.previousElementSibling).toBe(mask);
		mask.active = false;
		expect(target.style.display).toBe("");
		expect(target.hasAttribute("inert")).toBe(false);
		expect(target.hasAttribute("aria-hidden")).toBe(false);
		expect(target.querySelector("input")).toBe(input);
		expect(input?.value).toBe("retained");
		expect(mask.hasAttribute("data-tp-mask-visible")).toBe(false);
	});
	it("restores existing styles and accessibility state on removal", () => {
		const { target, mask } = fixture();
		target.style.setProperty("display", "grid", "important");
		target.setAttribute("aria-hidden", "false");
		target.setAttribute("inert", "");
		mask.active = true;
		mask.remove();
		expect(target.style.display).toBe("grid");
		expect(target.style.getPropertyPriority("display")).toBe("important");
		expect(target.getAttribute("aria-hidden")).toBe("false");
		expect(target.hasAttribute("inert")).toBe(true);
	});
	it("tracks replacement targets and anchor changes", async () => {
		const { target, mask } = fixture(true);
		const replacement = document.createElement("div");
		replacement.id = "target";
		target.replaceWith(replacement);
		await flush();
		expect(target.style.display).toBe("");
		expect(replacement.style.display).toBe("none");
		mask.anchor = "#missing";
		expect(replacement.style.display).toBe("");
		expect(mask.hasAttribute("data-tp-mask-visible")).toBe(false);
		const late = document.createElement("div");
		late.id = "missing";
		document.body.append(late);
		await flush();
		expect(late.style.display).toBe("none");
	});
	it("keeps the target masked until every active mask releases it", () => {
		const { target, mask } = fixture(true);
		const other = new TpMask();
		other.anchor = "#target";
		other.active = true;
		document.body.append(other);
		mask.remove();
		expect(target.style.display).toBe("none");
		other.remove();
		expect(target.style.display).toBe("");
	});
	it("rejects invalid, self, ancestor and descendant targets", () => {
		const { target, mask } = fixture(true);
		for (const selector of ["[", "body", "tp-mask", "tp-mask span"]) {
			mask.innerHTML = "<span>Message</span>";
			mask.anchor = selector;
			expect(target.style.display).toBe("");
			expect(mask.hasAttribute("data-tp-mask-visible")).toBe(false);
		}
	});
	it("moves focus away from hidden controls", () => {
		const { target, mask } = fixture();
		target.querySelector("input")?.focus();
		mask.active = true;
		expect(document.activeElement).toBe(mask);
	});
});
