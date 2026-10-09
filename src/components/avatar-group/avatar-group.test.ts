import { afterEach, describe, expect, it } from "vitest";
import { TpAvatarGroup } from "./avatar-group.js";

/** Mounts a group with three labelled avatars. */
function mount(): TpAvatarGroup {
	const group = document.createElement("tp-avatar-group");
	group.innerHTML =
		'<tp-avatar initials="AL" label="Ada"></tp-avatar><tp-avatar initials="GH" label="Grace"></tp-avatar><tp-avatar initials="KT" label="Katherine"></tp-avatar>';
	document.body.append(group);
	return group;
}

/** Reads managed stacking indices in DOM order. */
function indices(group: TpAvatarGroup): string[] {
	return Array.from(group.querySelectorAll("tp-avatar")).map((avatar) =>
		avatar.style.getPropertyValue("--tp-avatar-group-index"),
	);
}

afterEach(() => document.body.replaceChildren());

describe("tp-avatar-group", () => {
	it("registers with horizontal layout, ltr stacking and default overlap", () => {
		const group = mount();
		expect(group).toBeInstanceOf(TpAvatarGroup);
		expect(group.orientation).toBe("horizontal");
		expect(group.order).toBe("ltr");
		expect(group.offset).toBe("0.75rem");
		expect(indices(group)).toEqual(["1", "2", "3"]);
		expect(group.hasAttribute("tabindex")).toBe(false);
		expect(group.querySelectorAll('[role="img"]')).toHaveLength(3);
	});

	it("changes all settings without replacing or reordering avatars", () => {
		const group = mount();
		const avatars = Array.from(group.children);
		group.order = "rtl";
		group.orientation = "vertical";
		group.offset = "12px";
		expect(indices(group)).toEqual(["3", "2", "1"]);
		expect(group.dataset.orientation).toBe("vertical");
		expect(group.style.getPropertyValue("--tp-avatar-group-overlap")).toBe(
			"12px",
		);
		expect(Array.from(group.children)).toEqual(avatars);
		group.order = "rtl";
		group.setAttribute("order", "invalid");
		group.setAttribute("orientation", "invalid");
		expect(group.order).toBe("ltr");
		expect(group.orientation).toBe("horizontal");
	});

	it("accepts nonnegative lengths and rejects invalid offsets", () => {
		const group = mount();
		["0", "0px", ".5em", "1.25rem", "2vw", " 4px "].forEach((value) => {
			group.offset = value;
			expect(group.offset).toBe(value.trim());
		});
		["", "-2px", "red", "30%", "2", "calc(1rem + 2px)"].forEach((value) => {
			group.offset = value;
			expect(group.offset).toBe("0.75rem");
		});
		group.removeAttribute("offset");
		expect(group.offset).toBe("0.75rem");
	});

	it("updates stacking for additions, removals and reordered avatars", async () => {
		const group = mount();
		const first = group.querySelector("tp-avatar");
		if (!first) throw new Error("Missing avatar");
		group.append(document.createElement("tp-avatar"));
		await Promise.resolve();
		expect(indices(group)).toEqual(["1", "2", "3", "4"]);
		group.append(first);
		await Promise.resolve();
		expect(first.style.getPropertyValue("--tp-avatar-group-index")).toBe("4");
		first.remove();
		await Promise.resolve();
		expect(first.style.getPropertyValue("--tp-avatar-group-index")).toBe("");
		expect(indices(group)).toEqual(["1", "2", "3"]);
	});

	it("cleans up on disconnection and resumes on reconnection", () => {
		const group = mount();
		group.remove();
		expect(indices(group)).toEqual(["", "", ""]);
		group.order = "rtl";
		document.body.append(group);
		expect(indices(group)).toEqual(["3", "2", "1"]);
		expect(document.querySelectorAll("#tp-avatar-group-styles")).toHaveLength(
			1,
		);
	});

	it("handles empty groups and ignores unrelated and nested elements", async () => {
		const group = document.createElement("tp-avatar-group");
		document.body.append(group);
		group.append(document.createTextNode(" "));
		const wrapper = document.createElement("span");
		wrapper.append(document.createElement("tp-avatar"));
		group.append(wrapper);
		await Promise.resolve();
		expect(wrapper.style.length).toBe(0);
		expect(indices(group)).toEqual([""]);
	});
});
