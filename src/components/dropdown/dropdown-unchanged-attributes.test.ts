import { afterEach, expect, it } from "vitest";
import type { TpDropdown } from "./dropdown.js";
import "./dropdown.js";

afterEach(() => document.body.replaceChildren());

it("does not redecorate a menu when its placement is assigned the same value", () => {
	const dropdown = document.createElement("tp-dropdown") as TpDropdown;
	dropdown.setAttribute("placement", "bottom");
	dropdown.innerHTML = "<ul><li>First action</li><li>Second action</li></ul>";
	document.body.append(dropdown);
	const menu = dropdown.querySelector("ul");
	if (!menu) throw new Error("Missing menu");
	const observer = new MutationObserver(() => {});
	observer.observe(menu, { attributes: true, subtree: true });
	dropdown.setAttribute("placement", "bottom");
	expect(observer.takeRecords()).toHaveLength(0);
	dropdown.setAttribute("placement", "top");
	expect(observer.takeRecords().length).toBeGreaterThan(0);
	observer.disconnect();
});

it("resolves an anchor inserted after the closed menu when opening", () => {
	const dropdown = document.createElement("tp-dropdown") as TpDropdown;
	dropdown.setAttribute("anchor", "#late-anchor");
	dropdown.innerHTML = "<ul><li>Action</li></ul>";
	document.body.append(dropdown);
	const anchor = document.createElement("button");
	anchor.id = "late-anchor";
	document.body.append(anchor);
	dropdown.show();
	expect(dropdown.style.maxHeight).not.toBe("");
});
