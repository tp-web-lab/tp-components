import { execFileSync } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import {
	collectTestCounts,
	latestGlobalExecution,
	coverageForComponent as sharedCoverageForComponent,
	weightedCoverage,
} from "./component-quality-report-utils.mjs";

const root = resolve(import.meta.dirname, "..");
const configPath = resolve(root, "config/component-quality-pilot.json");
const coveragePath = resolve(
	root,
	"config/quality-coverage/coverage-summary.json",
);
const reportPath = resolve(
	root,
	"public/docs/appendices/component-quality/index.md",
);
const check = process.argv.includes("--check");
const config = JSON.parse(await readFile(configPath, "utf8"));
const latestRun = latestGlobalExecution(root);
const latestRunSection =
	latestRun === null
		? ""
		: `## Latest global execution

Executed at ${latestRun.generatedAt}. The full Vitest suite reports **${latestRun.tests.passed} passed, ${latestRun.tests.failed} failed, ${latestRun.tests.pending} skipped/pending** out of ${latestRun.tests.total} tests, plus **${latestRun.unhandledErrors} unhandled errors**. These are execution results, not the static test counts in the family tables.

Coverage below comes from a single complete-suite run over production files in \`src/components/\`, including components not yet assigned to a family report. Family tables retain their separate family-scoped measurements. The runner retains coverage even when tests fail; coverage alone does not demonstrate that tests passed.

${
	latestRun.familyRuns
		? latestRun.familyRuns.some((run) => run.failed > 0)
			? `Separate family-scoped reruns reported failures in: ${latestRun.familyRuns
					.filter((run) => run.failed > 0)
					.map(
						(run) =>
							`\`${run.name.replace("test:quality:", "")}\` (${run.failed})`,
					)
					.join(
						", ",
					)}. These reruns overlap the complete suite and must not be added to its test totals.`
			: "All recorded family-scoped reruns passed. These reruns overlap the complete suite and must not be added to its test totals."
		: ""
}

| Lines | Statements | Functions | Branches |
| ---: | ---: | ---: | ---: |
| ${latestRun.coverage.lines}% | ${latestRun.coverage.statements}% | ${latestRun.coverage.functions}% | ${latestRun.coverage.branches}% |

${
	latestRun.failures.length === 0
		? "No failing tests."
		: `### Failing tests

| Component | Failure | Test |
| --- | --- | --- |
${latestRun.failures.map((failure) => `| ${failure.component ? `\`tp-${failure.component}\`` : "Shared tests"} | ${failure.kind} | ${failure.title.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("|", "\\|").replace(/\s+/g, " ")} |`).join("\n")}`
}

${latestRun.familyRuns?.length ? `### Family execution results

These separate reruns are not additional tests in the global total. A successful family rerun does not erase a failure recorded in the full suite.

| Family | Passed | Failed | Completed at (UTC) |
| --- | ---: | ---: | --- |
${[...latestRun.familyRuns].sort((a, b) => a.name.localeCompare(b.name)).map((run) => `| ${run.name.replace("test:quality:", "")} | ${run.passed} | ${run.failed} | ${run.generatedAt} |`).join("\n")}
` : ""}
${latestRun.familyFailures?.length ? `### Failing tests in family reruns

| Family | Component | Failure | Test |
| --- | --- | --- | --- |
${[...latestRun.familyFailures].sort((a, b) => a.family.localeCompare(b.family)).map((failure) => `| ${failure.family} | ${failure.component ? `\`tp-${failure.component}\`` : "Shared tests"} | ${failure.kind} | ${failure.title.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("|", "\\|").replace(/\s+/g, " ")} |`).join("\n")}
` : ""}

`;
const coverage = JSON.parse(await readFile(coveragePath, "utf8"));
const metrics = ["lines", "statements", "functions", "branches"];
const listedTests = JSON.parse(
	execFileSync(
		process.execPath,
		[
			resolve(root, "node_modules/vitest/vitest.mjs"),
			"list",
			...config.testFiles,
			"--json",
		],
		{ cwd: root, encoding: "utf8" },
	),
);

function componentFiles(component) {
	const marker = `${sep}src${sep}components${sep}${component}${sep}`;
	return Object.entries(coverage).filter(
		([file]) => file !== "total" && resolve(file).includes(marker),
	);
}

function percentage(covered, total) {
	return total === 0 ? 100 : Math.floor((covered / total) * 10000) / 100;
}

function componentCoverage(component) {
	const files = componentFiles(component);

	return Object.fromEntries(
		metrics.map((metric) => {
			const total = files.reduce(
				(sum, [, value]) => sum + value[metric].total,
				0,
			);
			const covered = files.reduce(
				(sum, [, value]) => sum + value[metric].covered,
				0,
			);
			return [metric, percentage(covered, total)];
		}),
	);
}

function componentTestCount(component) {
	const marker = `${sep}src${sep}components${sep}${component}${sep}`;
	return listedTests.filter(({ file }) => resolve(file).includes(marker))
		.length;
}

const totalCoverage = Object.fromEntries(
	metrics.map((metric) => {
		const files = config.components.flatMap((component) =>
			componentFiles(component),
		);
		const total = files.reduce(
			(sum, [, value]) => sum + value[metric].total,
			0,
		);
		const covered = files.reduce(
			(sum, [, value]) => sum + value[metric].covered,
			0,
		);
		return [metric, percentage(covered, total)];
	}),
);
const totalTests = config.components.reduce(
	(sum, component) => sum + componentTestCount(component),
	0,
);

const rows = [...config.components]
	.sort((left, right) => left.localeCompare(right))
	.map((component) => {
		const result = componentCoverage(component);
		const below = metrics.filter(
			(metric) => result[metric] < config.targets[metric],
		);
		return `| \`tp-${component}\` | ${componentTestCount(component)} | ${result.lines}% | ${result.statements}% | ${result.functions}% | ${result.branches}% | ${below.length === 0 ? "Target met" : `Follow-up: ${below.join(", ")}`} |`;
	});
const totalBelow = metrics.filter(
	(metric) => totalCoverage[metric] < config.targets[metric],
);
const totalRow = `| **Total (weighted averages)** | **${totalTests}** | **${totalCoverage.lines}%** | **${totalCoverage.statements}%** | **${totalCoverage.functions}%** | **${totalCoverage.branches}%** | **${totalBelow.length === 0 ? "Target met" : `Follow-up: ${totalBelow.join(", ")}`}** |`;

const familyDefinitions = [
	[
		"Base",
		"base",
		[
			"config/base-quality-coverage/base/coverage-summary.json",
			"config/base-quality-coverage/question/coverage-summary.json",
		],
	],
	[
		"Controllers",
		"controllers",
		["config/controllers-quality-coverage/coverage-summary.json"],
	],
	[
		"Editors",
		"editors",
		["config/editors-quality-coverage/coverage-summary.json"],
	],
	[
		"Documentation",
		"documentation",
		["config/documentation-quality-coverage/coverage-summary.json"],
	],
	[
		"Slides",
		"slides",
		["config/slides-quality-coverage/coverage-summary.json"],
	],
	[
		"Viewers",
		"viewers",
		["config/viewers-quality-coverage/coverage-summary.json"],
	],
	[
		"Simulators",
		"simulators",
		["config/simulators-quality-coverage/coverage-summary.json"],
	],
	[
		"Playgrounds",
		"playgrounds",
		["config/playgrounds-quality-coverage/coverage-summary.json"],
	],
	[
		"Markup Languages",
		"markup-languages",
		["config/markup-languages-quality-coverage/coverage-summary.json"],
	],
	[
		"Notebooks",
		"notebooks",
		["config/notebooks-quality-coverage/coverage-summary.json"],
	],
	[
		"Pickers",
		"pickers",
		["config/pickers-quality-coverage/coverage-summary.json"],
	],
	[
		"Feedbacks",
		"feedbacks",
		["config/feedbacks-quality-coverage/coverage-summary.json"],
	],
	["Files", "files", ["config/files-quality-coverage/coverage-summary.json"]],
	["Forms", "forms", ["config/forms-quality-coverage/coverage-summary.json"]],
	["Games", "games", ["config/games-quality-coverage/coverage-summary.json"]],
	[
		"Layouts",
		"layouts",
		["config/layout-quality-coverage/coverage-summary.json"],
	],
	[
		"Overlays",
		"overlays",
		["config/overlays-quality-coverage/coverage-summary.json"],
	],
	["Plots", "plots", ["config/plots-quality-coverage/coverage-summary.json"]],
	[
		"Quizzes",
		"quizzes",
		["config/quizzes-quality-coverage/coverage-summary.json"],
	],
	["Time", "time", ["config/time-quality-coverage/coverage-summary.json"]],
	[
		"Utilities",
		"utilities",
		["config/utilities-quality-coverage/coverage-summary.json"],
	],
];

const familyResults = await Promise.all(
	familyDefinitions.map(async ([label, slug, coverageFiles]) => {
		const familyConfig = JSON.parse(
			await readFile(
				resolve(root, `config/component-quality-${slug}.json`),
				"utf8",
			),
		);
		const summaries = await Promise.all(
			coverageFiles.map(async (file) => {
				const content = await readFile(resolve(root, file), "utf8").catch(
					() => null,
				);
				return content === null ? null : JSON.parse(content);
			}),
		);
		if (summaries.some((summary) => summary === null)) return null;
		const familyCoverage = Object.assign(
			{},
			...summaries.map(({ total: _total, ...files }) => files),
		);
		const testCounts = collectTestCounts(root, familyConfig.components);
		const tests = familyConfig.components.reduce(
			(sum, component) => sum + testCounts[component],
			0,
		);
		const result = weightedCoverage(familyCoverage, familyConfig.components);
		const passing = familyConfig.components.filter((component) =>
			metrics.every(
				(metric) =>
					sharedCoverageForComponent(familyCoverage, component)[metric] >=
					familyConfig.targets[metric],
			),
		).length;
		return {
			label,
			slug,
			config: familyConfig,
			coverage: familyCoverage,
			tests,
			result,
			passing,
		};
	}),
).then((families) => families.filter((family) => family !== null));

const familyRows = [...familyResults]
	.sort((left, right) => left.label.localeCompare(right.label))
	.map(({ label, slug, config: familyConfig, tests, result, passing }) => {
		const below = metrics.filter(
			(metric) => result[metric] < familyConfig.targets[metric],
		);
		return `| [${label}](${slug}.md) | ${familyConfig.components.length} | ${passing} | ${tests} | ${result.lines}% | ${result.statements}% | ${result.functions}% | ${result.branches}% | ${below.length === 0 ? "Target met" : `Follow-up: ${below.join(", ")}`} |`;
	});
const allComponents = familyResults.flatMap(
	({ config: familyConfig }) => familyConfig.components,
);
const componentDirectories = (
	await readdir(resolve(root, "src/components"), { withFileTypes: true })
)
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name);
const publicComponents = (
	await Promise.all(
		componentDirectories.map(
			async (component) =>
				await readFile(
					resolve(root, `src/components/${component}/${component}.json`),
					"utf8",
				)
					.then(() => component)
					.catch(() => null),
		),
	)
).filter((component) => component !== null);
const sharedImplementations = allComponents.filter(
	(component) => !publicComponents.includes(component),
);
const allCoverage = Object.assign(
	{},
	...familyResults.map(({ coverage: familyCoverage }) => familyCoverage),
);
const allTests = familyResults.reduce((sum, family) => sum + family.tests, 0);
const allPassing = familyResults.reduce(
	(sum, family) => sum + family.passing,
	0,
);
const allResult = weightedCoverage(allCoverage, allComponents);
const allBelow = metrics.filter(
	(metric) => allResult[metric] < config.targets[metric],
);
const familyTotalRow = `| **Total (weighted averages)** | **${allComponents.length}** | **${allPassing}** | **${allTests}** | **${allResult.lines}%** | **${allResult.statements}%** | **${allResult.functions}%** | **${allResult.branches}%** | **${allBelow.length === 0 ? "Target met" : `Follow-up: ${allBelow.join(", ")}`}** |`;

const report = `# Component quality

This appendix defines the common test procedure expected of every component. It complements the [accessibility review](../accessibility/index.md): accessibility is part of component quality, but code coverage alone neither proves accessibility nor product correctness.

## Procedure

For a new or changed component, the author should:

1. exercise its public API, rendering, events, keyboard behavior, error states, cleanup, and important edge cases with dedicated unit tests;
2. run the automated accessibility scenarios in the three browser engines when the component has a rendered example;
3. review the generated documentation and examples from an author's point of view;
4. measure statement, line, function, and branch coverage, then explain or test meaningful gaps;
5. record manual checks that automation cannot establish, such as usability with a screen reader, zoom, forced colours, or real content.

The procedure applies to future components from their introduction. Existing components enter it progressively, starting with the pilot below.

## What blocks a change

A broken test runner, a failing test, or an invalid generated report is a technical failure and should block. Coverage targets and manual-review gaps are initially **advisory**: they create visible follow-up work without rejecting a change automatically. A target may become blocking later, component by component, once its suite is mature and stable.

This distinction prevents a percentage from replacing engineering judgement. In particular, 100% coverage can still miss an incorrect assertion, an integration failure, or an inaccessible interaction.

## Reading coverage

The four coverage columns describe complementary aspects of the production code exercised while the tests run:

- **Lines**: the proportion of executable source lines that were executed at least once.
- **Statements**: the proportion of individual instructions or expressions that were executed; several statements may appear on the same source line.
- **Functions**: the proportion of declared functions, methods, getters, setters, and callbacks that were called.
- **Branches**: the proportion of alternative control-flow paths that were taken, such as both outcomes of a condition, the cases of a switch, or fallback expressions.

Coverage records execution, not correctness: a covered path still needs a meaningful assertion. Unless a report explicitly mentions a failure, timeout, skip, or expected failure, **100% of the tests counted in its tables completed successfully without error**. A coverage percentage below 100% therefore describes production paths that were not exercised; it does not mean that the corresponding proportion of tests failed.

## Pilot

The pilot runs ${config.testFiles.length} dedicated test files for ${config.components.length} components. The current advisory targets are ${config.targets.lines}% lines, ${config.targets.statements}% statements, ${config.targets.functions}% functions, and ${config.targets.branches}% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
${rows.join("\n")}
${totalRow}

The complete family reports apply the same procedure to [Base](base.md), [Controllers](controllers.md), [Documentation](documentation.md), [Editors](editors.md), [Feedbacks](feedbacks.md), [Files](files.md), [Forms](forms.md), [Games](games.md), [Layouts](layouts.md), [Markup Languages](markup-languages.md), [Notebooks](notebooks.md), [Overlays](overlays.md), [Pickers](pickers.md), [Playgrounds](playgrounds.md), [Plots](plots.md), [Quizzes](quizzes.md), [Simulators](simulators.md), [Slides](slides.md), [Time](time.md), [Utilities](utilities.md), and [Viewers](viewers.md).

## Complete test assessment

This consolidated view covers every component in the completed family reports. **Components meeting targets** requires each component to reach all four advisory thresholds; family and total percentages are weighted by the measured code units rather than averaged component percentages. Under the convention above, all tests shown here passed without error unless the report explicitly says otherwise.

The current totals distinguish ${publicComponents.length} registered public components from ${sharedImplementations.length} shared implementation ${sharedImplementations.length === 1 ? "unit" : "units"}${sharedImplementations.length === 0 ? "" : ` (${sharedImplementations.map((component) => `\`tp-${component}\``).join(", ")})`}. Shared implementations are included because their production code must remain visible to coverage, but they are not additional custom elements.

| Family | Components | Components meeting targets | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
${familyRows.join("\n")}
${familyTotalRow}

Run \`pnpm quality:pilot\` to execute the pilot, collect V8 coverage, and regenerate this page. Run \`pnpm quality:report:check\` to verify that the committed page matches the latest coverage data. The CI pilot is explicitly non-blocking while the procedure is being calibrated; its report is still retained as an artifact for review.

${latestRunSection}## Extending the pilot

Add the component and its dedicated tests to \`${relative(root, configPath)}\`. Include all production files owned by the component, including trigger or helper modules: an untested helper must remain visible rather than disappearing from the denominator. Expand the pilot in small groups so weak assertions and obsolete tests are corrected deliberately instead of being hidden by a repository-wide percentage.
`;

if (check) {
	const current = await readFile(reportPath, "utf8").catch(() => "");
	if (current !== report) {
		console.error(
			`Component quality report is stale. Run pnpm quality:report.`,
		);
		process.exitCode = 1;
	}
} else {
	await writeFile(reportPath, report);
	console.log(`Updated ${relative(root, reportPath)}.`);
}
