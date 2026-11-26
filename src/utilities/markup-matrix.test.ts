import { describe, expect, it } from "vitest";
import { matrixCases, runMarkupMatrixCase } from "./markup-matrix-fixtures.js";

const languages = ["html", "markdown", "asciidoc"] as const;
for (const from of languages)
	for (const to of languages)
		if (from !== to)
			describe(`${from} → ${to}`, () => {
				it.each(matrixCases)("preserves %s", async (name) => {
					const result = await runMarkupMatrixCase(
						name,
						from,
						to,
						"https://example.org/source/",
					);
					expect(result.errors).toEqual([]);
				});
			});
