import { afterEach, beforeEach, expect, it, vi } from "vitest";
import "./html-viewer.js";

beforeEach(() =>
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	),
);
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

it("preserves authored component custom properties in the rendered iframe", async () => {
	const viewer = document.createElement("tp-html-viewer");
	viewer.innerHTML =
		'<template><tp-flip-card style="--tp-flip-card-padding: 0; --tp-flip-card-width: 14rem"><dl><dt>recto</dt><dd>Front</dd><dt>verso</dt><dd>Back</dd></dl></tp-flip-card></template>';
	document.body.append(viewer);
	await vi.waitFor(() => {
		const source = viewer.querySelector("iframe")?.srcdoc ?? "";
		expect(source).toContain("--tp-flip-card-padding: 0");
		expect(source).toContain("--tp-flip-card-width: 14rem");
	});
});
