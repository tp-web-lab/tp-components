/**
 * @module components/playground/build-utils-test
 * @summary Tests for playground build utilities.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import type { TpFile } from "../filesystem/filesystem.types.js";
import {
	createJavaScriptModuleBlobUrls,
	createStaticBlobUrls,
	createTypescriptModuleBlobUrls,
} from "./playground-build-utils.js";

describe("playground build utilities", () => {
	it("imports compiled TypeScript dependencies instead of their raw static blobs", async () => {
		const blobs: Blob[] = [];
		vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
			if (blob instanceof Blob) blobs.push(blob);
			return `blob:test-${blobs.length}`;
		});
		const files: TpFile[] = [
			{
				path: "/double.ts",
				content: "export const double = (value: number): number => value * 2;",
			},
			{
				path: "/double.test.ts",
				content:
					"import { double } from './double.ts'; console.log(double(3));",
			},
		];
		const staticUrls = createStaticBlobUrls(files);
		const modules = await createTypescriptModuleBlobUrls(files, staticUrls);
		const output = await Promise.all(
			blobs.slice(staticUrls.size).map((blob) => blob.text()),
		);
		expect(output.join("\n")).toContain(modules.get("/double.ts"));
		expect(output.join("\n")).not.toContain(staticUrls.get("/double.ts"));
		expect(output.join("\n")).not.toContain(": number");
		expect(
			blobs
				.slice(staticUrls.size)
				.every((blob) => blob.type === "text/javascript"),
		).toBe(true);
	});
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("converts local CSS module imports to JavaScript CSSStyleSheet modules", async () => {
		const blobs: Blob[] = [];
		const createUrlSpy = vi
			.spyOn(URL, "createObjectURL")
			.mockImplementation((blob) => {
				if (blob instanceof Blob) {
					blobs.push(blob);
				}

				return `blob:test-${String(blobs.length)}`;
			});

		const files: TpFile[] = [
			{
				path: "/main.js",
				language: "javascript",
				content:
					"import styles from './tabs.css' with { type: 'css' };\nconsole.log(styles);",
			},
			{
				path: "/tabs.css",
				language: "css",
				content: ".tabs { color: royalblue; }",
			},
		];

		const staticUrls = createStaticBlobUrls(files);
		const moduleUrls = await createJavaScriptModuleBlobUrls(files, staticUrls);
		const moduleBlobs = blobs.slice(staticUrls.size);
		const moduleTexts = await Promise.all(
			moduleBlobs.map((blob) => blob.text()),
		);

		expect(createUrlSpy).toHaveBeenCalled();
		expect(moduleUrls.get("/main.js")).toBeDefined();
		expect(moduleUrls.get("/tabs.css?tp-css-module")).toBeDefined();
		expect(moduleTexts.join("\n")).not.toContain("with { type: 'css' }");
		expect(moduleTexts.join("\n")).toContain("new CSSStyleSheet()");
		expect(moduleTexts.join("\n")).toContain(
			'sheet.replaceSync(".tabs { color: royalblue; }")',
		);
	});
});
