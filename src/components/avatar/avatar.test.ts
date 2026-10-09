import { afterEach, describe, expect, it } from "vitest";
import type { TpSizeType } from "../base/base.types.js";
import { TpAvatar } from "./avatar.js";

/** Connects an avatar after assigning its initial attributes. */
function mount(attributes: Record<string, string> = {}): TpAvatar {
	const avatar = document.createElement("tp-avatar");
	Object.entries(attributes).forEach(([name, value]) => {
		avatar.setAttribute(name, value);
	});
	document.body.append(avatar);
	return avatar;
}

afterEach(() => document.body.replaceChildren());

describe("tp-avatar", () => {
	it("supports all shared sizes and gives the icon more room than initials", () => {
		const avatar = mount();
		const sizes: TpSizeType[] = ["xxs", "xs", "s", "m", "l", "xl", "xxl"];
		sizes.forEach((size) => {
			avatar.size = size;
			expect(avatar.size).toBe(size);
			expect(avatar.dataset.size).toBe(size);
			expect(avatar.querySelector("tp-icon")?.getAttribute("size")).toBe("2em");
		});
		avatar.removeAttribute("size");
		expect(avatar.size).toBe("m");
	});
	it("registers with safe defaults and a decorative icon", () => {
		const avatar = mount();
		expect(avatar).toBeInstanceOf(TpAvatar);
		expect([avatar.src, avatar.initials, avatar.label]).toEqual(["", "", ""]);
		expect([avatar.icon, avatar.library, avatar.shape, avatar.size]).toEqual([
			"user",
			"tp",
			"circle",
			"m",
		]);
		expect(avatar.querySelector("tp-icon")?.getAttribute("name")).toBe("user");
		expect(avatar.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
		expect(avatar.hasAttribute("tabindex")).toBe(false);
	});

	it("reflects every property and updates presentation dynamically", () => {
		const avatar = mount();
		avatar.initials = "AL";
		avatar.label = "Ada Lovelace";
		avatar.shape = "square";
		avatar.size = "l";
		avatar.icon = "home";
		avatar.library = "tp";
		expect(avatar.textContent).toBe("AL");
		expect(avatar.firstElementChild?.getAttribute("role")).toBe("img");
		expect(avatar.firstElementChild?.getAttribute("aria-label")).toBe(
			"Ada Lovelace",
		);
		expect(avatar.dataset).toMatchObject({ shape: "square", size: "l" });
		avatar.size = "s";
		expect(avatar.dataset.size).toBe("s");
		avatar.setAttribute("shape", "invalid");
		avatar.setAttribute("size", "invalid");
		expect(avatar.dataset).toMatchObject({ shape: "circle", size: "m" });
		avatar.label = "";
		avatar.initials = "";
		expect(avatar.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
		expect(avatar.querySelector("tp-icon")?.getAttribute("name")).toBe("home");
	});

	it("prioritizes images, then initials, then icons on failure", () => {
		const avatar = mount({
			src: "/portrait.svg",
			initials: "AL",
			label: "Ada",
		});
		const image = avatar.querySelector("img");
		expect(image?.getAttribute("src")).toBe("/portrait.svg");
		expect(image?.alt).toBe("");
		image?.dispatchEvent(new Event("error"));
		expect(avatar.querySelector("img")).toBeNull();
		expect(avatar.textContent).toBe("AL");
		avatar.initials = "";
		expect(avatar.querySelector("tp-icon")).not.toBeNull();
		avatar.src = "/another.svg";
		expect(avatar.querySelector("img")?.getAttribute("src")).toBe(
			"/another.svg",
		);
		avatar.removeAttribute("src");
		expect(avatar.querySelector("img")).toBeNull();
	});

	it("ignores stale image errors and unchanged attributes", () => {
		const avatar = mount({ src: "/old.svg" });
		const old = avatar.querySelector("img");
		avatar.src = "/new.svg";
		const current = avatar.querySelector("img");
		old?.dispatchEvent(new Event("error"));
		expect(avatar.querySelector("img")).toBe(current);
		avatar.src = "/new.svg";
		expect(avatar.querySelector("img")).toBe(current);
	});

	it("handles detached updates and reconnects without duplicate styles or content", () => {
		const avatar = mount({ initials: "<AL>" });
		avatar.remove();
		avatar.initials = "JT";
		document.body.append(avatar);
		expect(avatar.textContent).toBe("JT");
		expect(avatar.children).toHaveLength(1);
		mount();
		expect(document.querySelectorAll("#tp-avatar-styles")).toHaveLength(1);
	});

	it("trims values and never interprets initials as HTML", () => {
		const avatar = mount({ initials: " <img src=x> ", label: "  Profile  " });
		expect(avatar.textContent).toBe("<img src=x>");
		expect(avatar.querySelector("img")).toBeNull();
		expect(avatar.label).toBe("Profile");
		avatar.icon = " ";
		avatar.library = " ";
		expect([avatar.icon, avatar.library]).toEqual(["user", "tp"]);
	});
});
