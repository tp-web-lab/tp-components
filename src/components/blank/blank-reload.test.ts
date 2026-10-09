import { afterEach, expect, it, vi } from "vitest";
import { TpBlank } from "./blank.js";

afterEach(() => document.body.replaceChildren());

it("keeps image content when the registered constructor predates a module reload", async () => {
	const registered = document.createElement("tp-blank");
	registered.name = "logo";
	document.body.append(registered);
	expect(registered).toBeInstanceOf(TpBlank);
	vi.resetModules();
	const { TpBlank: ReloadedBlank, isTpBlank } = await import("./blank.js");
	expect(registered).not.toBeInstanceOf(ReloadedBlank);
	expect(isTpBlank(registered)).toBe(true);
	expect(isTpBlank(document.createElement("div"))).toBe(false);
	const { ClosedAnswers } = await import(
		"../fill-blank-question/closed-answers.js"
	);
	const { getBlankFields } = await import("../fill-blank/fields.js");
	const form = document.createElement("div");
	document.body.append(form);
	form.append(registered);
	const image = document.createElement("img");
	image.src = "/docs/medias/logos/logo-tp.svg";
	image.alt = "tp-components logo";
	const fragment = document.createDocumentFragment();
	fragment.append(image);
	const controller = new ClosedAnswers(form, [""], null, [fragment]);
	const choice = document.querySelector("tp-button[data-tp-closed-item]");
	choice?.dispatchEvent(new Event("click", { bubbles: true }));
	registered.dispatchEvent(new Event("click", { bubbles: true }));
	expect(registered.value).toBe("1");
	expect(registered.querySelector(":scope > img")?.getAttribute("alt")).toBe(
		"tp-components logo",
	);
	expect(registered.textContent).not.toContain("tp-components logo");
	expect(getBlankFields(form)).toEqual([registered]);
	controller.destroy();
});
