import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

it("keeps every TP component implementation in light DOM", () => {
	const root = resolve(process.cwd(), "src/components");
	const violations = readdirSync(root, { recursive: true })
		.map(String)
		.filter((name) => name.endsWith(".ts") && !name.endsWith(".test.ts"))
		.filter((name) =>
			/\battachShadow\s*\(|\bshadowrootmode\s*=|\bextends\s+LitElement\b/.test(
				readFileSync(resolve(root, name), "utf8"),
			),
		);
	expect(violations).toEqual([]);
});
