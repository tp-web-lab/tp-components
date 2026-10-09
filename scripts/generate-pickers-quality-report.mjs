import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
	collectTestCounts,
	coverageForComponent,
	executionWarning,
	qualityMetrics,
	totalRow,
} from "./component-quality-report-utils.mjs";

const root = resolve(import.meta.dirname, "..");
const config = JSON.parse(
	await readFile(
		resolve(root, "config/component-quality-pickers.json"),
		"utf8",
	),
);
const coverage = JSON.parse(
	await readFile(
		resolve(root, "config/pickers-quality-coverage/coverage-summary.json"),
		"utf8",
	),
);
const reportPath = resolve(
	root,
	"public/docs/appendices/component-quality/pickers.md",
);
const testCounts = collectTestCounts(root, config.components);

const rows = [...config.components]
	.sort((left, right) => left.localeCompare(right))
	.map((component) => {
		const result = coverageForComponent(coverage, component);
		const below = qualityMetrics.filter(
			(metric) => result[metric] < config.targets[metric],
		);
		return `| \`tp-${component}\` | ${testCounts[component]} | ${result.lines}% | ${result.statements}% | ${result.functions}% | ${result.branches}% | ${below.length === 0 ? "Target met" : `Follow-up: ${below.join(", ")}`} |`;
	});
const met = config.components.filter((component) =>
	qualityMetrics.every(
		(metric) =>
			coverageForComponent(coverage, component)[metric] >=
			config.targets[metric],
	),
).length;

let report = `# Pickers component quality

This family report applies the [component quality procedure](index.md) to every component listed under **Pickers** in the documentation.

The ${config.testFileCount} dedicated test files currently pass together. ${met} of ${config.components.length} components meet every advisory target: ${config.targets.lines}% lines, ${config.targets.statements}% statements, ${config.targets.functions}% functions, and ${config.targets.branches}% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
${rows.join("\n")}
${totalRow(coverage, config.components, testCounts, config.targets)}

Run \`pnpm quality:pickers\` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
`;

report = executionWarning(report, config.components, root);
if (process.argv.includes("--check")) {
	const current = await readFile(reportPath, "utf8").catch(() => "");
	if (current !== report) {
		console.error(
			"Pickers quality report is stale. Run pnpm quality:pickers:report.",
		);
		process.exitCode = 1;
	}
} else {
	await writeFile(reportPath, report);
	console.log("Updated public/docs/appendices/component-quality/pickers.md.");
}
