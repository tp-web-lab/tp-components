import { afterEach, describe, expect, it, vi } from "vitest";

import "./icon-button.js";
import { TpButton } from "../button/button.js";
import type { TpIconButton } from "./icon-button.js";

afterEach(() => {
	document.body.replaceChildren();
});

describe("<tp-icon-button>", () => {
	it("forwards icon presentation attributes to its internal tp-icon", async () => {
		const element = document.createElement("tp-icon-button") as TpIconButton;
		element.setAttribute("name", "check");
		element.setAttribute("color", "tomato");
		element.setAttribute("scale", "2");
		element.setAttribute("rotate", "45deg");
		element.setAttribute("flip-h", "");
		element.setAttribute("flip-v", "");
		element.setAttribute("spin", "");
		document.body.append(element);
		await Promise.resolve();

		const icon = element.querySelector("tp-icon");
		expect(icon?.getAttribute("color")).toBe("tomato");
		expect(icon?.getAttribute("scale")).toBe("2");
		expect(icon?.getAttribute("rotate")).toBe("45deg");
		expect(icon?.hasAttribute("flip-h")).toBe(true);
		expect(icon?.hasAttribute("flip-v")).toBe(true);
		expect(icon?.hasAttribute("spin")).toBe(true);
	});

	it("removes forwarded boolean attributes when disabled", async () => {
		const element = document.createElement("tp-icon-button") as TpIconButton;
		element.spin = true;
		element.flipH = true;
		document.body.append(element);
		element.spin = false;
		element.flipH = false;
		await Promise.resolve();

		const icon = element.querySelector("tp-icon");
		expect(icon?.hasAttribute("spin")).toBe(false);
		expect(icon?.hasAttribute("flip-h")).toBe(false);
	});

	it("reflects the complete icon button API", async () => {
		const element = document.createElement("tp-icon-button") as TpIconButton;
		element.name = "check";
		element.library = "actions";
		element.label = "Confirm";
		element.type = "submit";
		element.variant = "success";
		element.size = "l";
		element.color = "green";
		element.scale = 1.5;
		element.rotate = "90deg";
		element.flipH = true;
		element.flipV = true;
		element.spin = true;
		element.disabled = true;
		document.body.append(element);
		await Promise.resolve();
		expect([
			element.name,
			element.library,
			element.label,
			element.type,
			element.variant,
			element.size,
			element.color,
			element.scale,
			element.rotate,
		]).toEqual([
			"check",
			"actions",
			"Confirm",
			"submit",
			"success",
			"l",
			"green",
			1.5,
			"90deg",
		]);
		expect([
			element.flipH,
			element.flipV,
			element.spin,
			element.disabled,
		]).toEqual([true, true, true, true]);
		expect(element.querySelector("button")?.getAttribute("aria-label")).toBe(
			"Confirm",
		);
	});

	it("normalizes invalid enum and numeric attributes", () => {
		const element = document.createElement("tp-icon-button") as TpIconButton;
		element.setAttribute("type", "other");
		element.setAttribute("variant", "other");
		element.setAttribute("size", "other");
		element.setAttribute("scale", "bad");
		expect(element.type).toBe("button");
		expect(element.variant).toBe("neutral");
		expect(element.size).toBe("m");
		expect(element.scale).toBe(1);
	});
});

it("supports every tp-button attribute", () => {
	const IconButton = customElements.get(
		"tp-icon-button",
	) as typeof import("./icon-button.js").TpIconButton;
	for (const name of TpButton.observedAttributes)
		expect(IconButton.observedAttributes).toContain(name);
});

it("switches between a native link and button while preserving the icon and accessible name", () => {
	const element = document.createElement("tp-icon-button");
	element.name = "home";
	element.label = "Open home";
	element.href = "/home";
	element.target = "_blank";
	element.rel = "noopener noreferrer";
	element.download = "guide.pdf";
	document.body.append(element);
	const icon = element.querySelector("tp-icon");
	const anchor = element.querySelector("a");
	expect(anchor?.getAttribute("href")).toBe("/home");
	expect(anchor?.getAttribute("target")).toBe("_blank");
	expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer");
	expect(anchor?.getAttribute("download")).toBe("guide.pdf");
	expect(anchor?.getAttribute("aria-label")).toBe("Open home");
	element.href = "";
	element.type = "reset";
	expect(element.querySelector("a")).toBeNull();
	expect(element.querySelector("button")?.type).toBe("reset");
	expect(element.querySelector("tp-icon")).toBe(icon);
	element.href = "/next";
	element.target = "";
	element.rel = "";
	element.download = "";
	expect(element.querySelector("a")?.getAttribute("href")).toBe("/next");
	expect(element.querySelector("a")?.hasAttribute("target")).toBe(false);
	expect(element.querySelector("a")?.hasAttribute("download")).toBe(false);
});

it.each(["disabled", "loading"] as const)(
	"blocks link navigation and click handlers when %s",
	(attribute) => {
		const element = document.createElement("tp-icon-button");
		element.href = "#destination";
		document.body.append(element);
		const clicked = vi.fn();
		element.addEventListener("click", clicked);
		element[attribute] = true;
		const anchor = element.querySelector("a");
		expect(anchor?.hasAttribute("href")).toBe(false);
		expect(anchor?.tabIndex).toBe(-1);
		expect(anchor?.getAttribute("aria-disabled")).toBe("true");
		anchor?.click();
		expect(clicked).not.toHaveBeenCalled();
		element[attribute] = false;
		expect(anchor?.getAttribute("href")).toBe("#destination");
		expect(anchor?.hasAttribute("tabindex")).toBe(false);
	},
);

it("reflects loading and appearance settings in button mode", () => {
	const element = document.createElement("tp-icon-button");
	document.body.append(element);
	element.outlined = true;
	element.pill = true;
	element.loadingMode = "inline";
	element.loading = true;
	expect(element.outlined && element.pill).toBe(true);
	expect(element.getAttribute("loading-mode")).toBe("inline");
	expect(element.querySelector("button")?.disabled).toBe(true);
	expect(element.querySelector("button")?.getAttribute("aria-busy")).toBe(
		"true",
	);
	element.loading = false;
	element.setAttribute("loading-mode", "invalid");
	expect(element.loadingMode).toBe("replace");
	expect(element.querySelector("button")?.disabled).toBe(false);
});
