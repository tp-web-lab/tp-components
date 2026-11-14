import { expect, it } from "vitest";
import { syncIframeColor } from "./iframe-color.js";

it("inherits and updates the nearest color scope without replacing example classes", async () => {
	const parent = document.createElement("div");
	const host = document.createElement("div");
	parent.append(host);
	parent.className = "tp-red";
	const target = document.implementation.createHTMLDocument();
	target.documentElement.className = "example";
	const disconnect = syncIframeColor(host, target);
	expect(target.documentElement.className).toBe("example tp-red");
	host.className = "tp-blue";
	await new Promise((resolve) => setTimeout(resolve, 0));
	expect(target.documentElement.className).toBe("example tp-blue");
	host.className = "";
	parent.className = "tp-green";
	await new Promise((resolve) => setTimeout(resolve, 0));
	expect(target.documentElement.className).toBe("example tp-green");
	disconnect();
});

it("preserves an explicitly colored example", () => {
	const host = document.createElement("div");
	host.className = "tp-red";
	const target = document.implementation.createHTMLDocument();
	target.documentElement.className = "tp-blue";
	syncIframeColor(host, target)();
	expect(target.documentElement.className).toBe("tp-blue");
});

it("updates inherited theme independently from an explicit brand", async () => {
	const host = document.createElement("div");
	host.className = "tp-dark tp-red";
	const target = document.implementation.createHTMLDocument();
	target.documentElement.className = "tp-blue";
	target.body.className = "tp-light";
	target.body.dataset.tpDefaultTheme = "tp-light";
	const disconnect = syncIframeColor(host, target);
	expect(target.documentElement.className).toBe("tp-blue tp-dark");
	expect(target.body.className).toBe("");
	host.className = "tp-light";
	await new Promise((resolve) => setTimeout(resolve, 0));
	expect(target.documentElement.className).toBe("tp-blue tp-light");
	disconnect();
});
it("preserves an explicit iframe theme while inheriting brand", () => {
	const host = document.createElement("div");
	host.className = "tp-dark tp-red";
	const target = document.implementation.createHTMLDocument();
	target.documentElement.className = "tp-light";
	const disconnect = syncIframeColor(host, target);
	expect(target.documentElement.className).toBe("tp-light tp-red");
	disconnect();
});
