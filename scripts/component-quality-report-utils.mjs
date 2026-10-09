import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve, sep } from "node:path";

/** Read the dated result of the latest complete test execution, when available. */
export function latestGlobalExecution(root) {
	const path = resolve(root, "config/component-quality-latest-run.json");
	return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
}

/** Keep generated family reports explicit about failures in the latest global run. */
export function executionWarning(report, components, root) {
	const run = latestGlobalExecution(root);
	const failures = [...new Map(
		[...(run?.failures ?? []), ...(run?.familyFailures ?? [])]
			.filter((failure) => components.includes(failure.component) || failure.affectedComponents?.some((component) => components.includes(component)))
			.map((failure) => [`${failure.file}:${failure.title}`, failure]),
	).values()];
	if (failures.length === 0) return report;
	const warning = `> Latest recorded executions: **${failures.length} distinct failing ${failures.length === 1 ? "test affects" : "tests affect"} this family** in the global run or its separate family reruns. Coverage was collected despite failures and is not evidence of a passing suite. See the [execution results](index.md#latest-global-execution) for both scopes.\n\n`;
	const firstParagraph = report.indexOf("\n\n") + 2;
	return (
		report.slice(0, firstParagraph) +
		warning +
		report
			.slice(firstParagraph)
			.replace(
				/currently pass (?:together|independently)/g,
				"were executed; failures are recorded above",
			)
	);
}

export const qualityMetrics = ["lines", "statements", "functions", "branches"];

export function percentage(covered, total) {
	return total === 0 ? 100 : Math.floor((covered / total) * 10000) / 100;
}

export function filesForComponent(coverage, component) {
	const marker = `${sep}src${sep}components${sep}${component}${sep}`;
	return Object.entries(coverage).filter(
		([file]) => file !== "total" && resolve(file).includes(marker),
	);
}

export function coverageForComponent(coverage, component) {
	const files = filesForComponent(coverage, component);
	return Object.fromEntries(
		qualityMetrics.map((metric) => {
			const total = files.reduce(
				(sum, [, item]) => sum + item[metric].total,
				0,
			);
			const covered = files.reduce(
				(sum, [, item]) => sum + item[metric].covered,
				0,
			);
			return [metric, percentage(covered, total)];
		}),
	);
}

export function weightedCoverage(coverage, components) {
	const files = components.flatMap((component) =>
		filesForComponent(coverage, component),
	);
	return Object.fromEntries(
		qualityMetrics.map((metric) => {
			const total = files.reduce(
				(sum, [, item]) => sum + item[metric].total,
				0,
			);
			const covered = files.reduce(
				(sum, [, item]) => sum + item[metric].covered,
				0,
			);
			return [metric, percentage(covered, total)];
		}),
	);
}

export function collectTestCounts(root, components) {
	const filters = components.map((component) => `src/components/${component}`);
	const tests = JSON.parse(
		execFileSync(
			process.execPath,
			[
				resolve(root, "node_modules/vitest/vitest.mjs"),
				"list",
				...filters,
				"--json",
			],
			{ cwd: root, encoding: "utf8" },
		),
	);
	return Object.fromEntries(
		components.map((component) => {
			const marker = `${sep}src${sep}components${sep}${component}${sep}`;
			return [
				component,
				tests.filter(({ file }) => resolve(file).includes(marker)).length,
			];
		}),
	);
}

export function totalRow(coverage, components, testCounts, targets) {
	const result = weightedCoverage(coverage, components);
	const below = qualityMetrics.filter(
		(metric) => result[metric] < targets[metric],
	);
	const tests = components.reduce(
		(sum, component) => sum + testCounts[component],
		0,
	);
	return `| **Total (weighted averages)** | **${tests}** | **${result.lines}%** | **${result.statements}%** | **${result.functions}%** | **${result.branches}%** | **${below.length === 0 ? "Target met" : `Follow-up: ${below.join(", ")}`}** |`;
}

export function augmentQualityTable(
	report,
	coverage,
	components,
	root,
	targets,
) {
	const testCounts = collectTestCounts(root, components);
	const rows = report.split("\n").map((line) => {
		const match = /^\| `tp-([^`]+)` \|/.exec(line);
		if (match === null) return line;
		return line.replace(
			`| \`tp-${match[1]}\` |`,
			`| \`tp-${match[1]}\` | ${testCounts[match[1]] ?? 0} |`,
		);
	});
	const headerIndex = rows.indexOf(
		"| Component | Lines | Statements | Functions | Branches | Advisory result |",
	);
	if (headerIndex < 0) return report;
	rows[headerIndex] =
		"| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |";
	rows[headerIndex + 1] = "| --- | ---: | ---: | ---: | ---: | ---: | --- |";
	let end = headerIndex + 2;
	while (rows[end]?.startsWith("| `tp-")) end += 1;
	rows.splice(end, 0, totalRow(coverage, components, testCounts, targets));
	return executionWarning(rows.join("\n"), components, root);
}
