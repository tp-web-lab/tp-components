import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

test("component summaries describe functionality without redundant implementation details", () => {
	for (const name of readdirSync("src/components")) {
		const path = `src/components/${name}/${name}.ts`;
		if (!existsSync(path)) continue;
		const source = readFileSync(path, "utf8");
		for (const match of source.matchAll(/\/\*\*[\s\S]*?\*\//g)) {
			const comment = match[0];
			const summary = comment.match(
				/@summary[^\S\n]+([^\n]*?)(?=\s+@[a-z-]+|\s*\*\/|\n)/,
			)?.[1];
			if (!summary) continue;
			assert.doesNotMatch(summary, /light[ -]?DOM|DOM léger/i, path);
			const following = source.slice(match.index + comment.length);
			if (
				comment.includes("@module") ||
				/^\s*export (?:abstract )?class /.test(following)
			) {
				assert.ok(!summary.includes(`tp-${name}`), `${path}: ${summary}`);
			}
		}
	}
});
