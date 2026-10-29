import { expect, it } from "vitest";
import { loadComponentIcon } from "./icon-component-source.js";
import { getTpIcon, registerTpIcon } from "./icon-registry.js";

it("shares a requested icon download without registering the rest of the collection", async () => {
	const request = loadComponentIcon("code-editor");
	expect(loadComponentIcon("code-editor")).toBe(request);
	await request;
	expect(getTpIcon("code-editor", "components")).toContain("<svg");
	expect(getTpIcon("alarm", "components")).toBeNull();
});

it("preserves overrides and leaves unknown icons available for the normal fallback", async () => {
	registerTpIcon("alarm", '<svg id="custom-alarm"></svg>', "components");
	await loadComponentIcon("alarm");
	expect(getTpIcon("alarm", "components")).toContain("custom-alarm");
	await loadComponentIcon("missing-component-icon");
	expect(getTpIcon("missing-component-icon", "components")).toBeNull();
});
