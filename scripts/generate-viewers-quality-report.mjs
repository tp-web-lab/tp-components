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
		resolve(root, "config/component-quality-viewers.json"),
		"utf8",
	),
);
const coverage = JSON.parse(
	await readFile(
		resolve(root, "config/viewers-quality-coverage/coverage-summary.json"),
		"utf8",
	),
);
const reportPath = resolve(
	root,
	"public/docs/appendices/component-quality/viewers.md",
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
let report = `# Viewers component quality

This report covers the ten public components in the **Viewers** catalogue and the internal \`tp-markup-viewer\` foundation that owns their shared editing, layout, rendering, iframe, and cleanup behavior. Measuring the foundation explicitly prevents inherited behavior from disappearing from the assessment. Programming viewers are also checked through their compact playground integration.

The ${config.testFileCount} test files currently pass together, including shared integration suites that exercise programming, Markdown, and AsciiDoc behavior across component boundaries. ${met} of ${config.components.length} measured components meet every advisory target: ${config.targets.lines}% lines, ${config.targets.statements}% statements, ${config.targets.functions}% functions, and ${config.targets.branches}% branches. The per-component Tests column counts only tests with a single directory owner; shared integration tests are deliberately not attributed repeatedly.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
${rows.join("\n")}
${totalRow(coverage, config.components, testCounts, config.targets)}

Run \`pnpm quality:viewers\` to execute the family suite, refresh V8 coverage, and regenerate this page. Targets are advisory; failing tests remain technical failures.
`;
report = executionWarning(report, config.components, root);
if (process.argv.includes("--check")) {
	const current = await readFile(reportPath, "utf8").catch(() => "");
	if (current !== report) {
		console.error(
			"Viewers quality report is stale. Run pnpm quality:viewers:report.",
		);
		process.exitCode = 1;
	}
} else {
	await writeFile(reportPath, report);
	console.log("Updated public/docs/appendices/component-quality/viewers.md.");
}
