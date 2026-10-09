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
		resolve(root, "config/component-quality-playgrounds.json"),
		"utf8",
	),
);
const coverage = JSON.parse(
	await readFile(
		resolve(root, "config/playgrounds-quality-coverage/coverage-summary.json"),
		"utf8",
	),
);
const reportPath = resolve(
	root,
	"public/docs/appendices/component-quality/playgrounds.md",
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
let report = `# Playgrounds component quality

This report covers the nine public components in the **Playgrounds** catalogue. Coverage includes every production TypeScript file owned by each component, including its project model and execution-document builders; shared integration suites are not attributed repeatedly in the Tests column.

The ${config.testFileCount} test files currently pass together. ${met} of ${config.components.length} measured components meet every advisory target: ${config.targets.lines}% lines, ${config.targets.statements}% statements, ${config.targets.functions}% functions, and ${config.targets.branches}% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
${rows.join("\n")}
${totalRow(coverage, config.components, testCounts, config.targets)}

Run \`pnpm quality:playgrounds\` to execute the family suite, refresh V8 coverage, and regenerate this page. Targets are advisory; failing tests remain technical failures.
`;
report = executionWarning(report, config.components, root);
if (process.argv.includes("--check")) {
	const current = await readFile(reportPath, "utf8").catch(() => "");
	if (current !== report) {
		console.error(
			"Playgrounds quality report is stale. Run pnpm quality:playgrounds:report.",
		);
		process.exitCode = 1;
	}
} else {
	await writeFile(reportPath, report);
	console.log(
		"Updated public/docs/appendices/component-quality/playgrounds.md.",
	);
}
