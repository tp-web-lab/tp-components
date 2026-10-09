import { readFile, writeFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { augmentQualityTable } from "./component-quality-report-utils.mjs";

const root = resolve(import.meta.dirname, "..");
const config = JSON.parse(await readFile(resolve(root, "config/component-quality-base.json"), "utf8"));
const coverageByComponent = Object.fromEntries(await Promise.all(config.components.map(async (component) => [
  component,
  JSON.parse(await readFile(resolve(root, `config/base-quality-coverage/${component}/coverage-summary.json`), "utf8")),
])));
const coverage = Object.assign({}, ...Object.values(coverageByComponent).map(({ total: _total, ...files }) => files));
const reportPath = resolve(root, "public/docs/appendices/component-quality/base.md");
const metrics = ["lines", "statements", "functions", "branches"];

function resultFor(component) {
  const marker = `${sep}src${sep}components${sep}${component}${sep}`;
  const files = Object.entries(coverageByComponent[component]).filter(([file]) => file !== "total" && resolve(file).includes(marker));
  return Object.fromEntries(metrics.map((metric) => {
    const total = files.reduce((sum, [, item]) => sum + item[metric].total, 0);
    const covered = files.reduce((sum, [, item]) => sum + item[metric].covered, 0);
    return [metric, total === 0 ? 100 : Math.floor((covered / total) * 10000) / 100];
  }));
}

const rows = [...config.components].sort((left, right) => left.localeCompare(right)).map((component) => {
  const result = resultFor(component);
  const below = metrics.filter((metric) => result[metric] < config.targets[metric]);
  return `| \`tp-${component}\` | ${result.lines}% | ${result.statements}% | ${result.functions}% | ${result.branches}% | ${below.length === 0 ? "Target met" : `Follow-up: ${below.join(", ")}`} |`;
});
const met = config.components.filter((component) => metrics.every((metric) => resultFor(component)[metric] >= config.targets[metric])).length;

let report = `# Base component quality

This family report applies the [component quality procedure](index.md) to every component listed under **Base** in the documentation. It measures all production TypeScript files owned by each component. The two suites run in isolated Vitest processes because \`tp-base\` dynamically loads help components whose custom-element registrations would otherwise leak into the \`tp-question\` suite.

The ${config.testFileCount} dedicated test files currently pass independently. ${met} of ${config.components.length} components meet every advisory target: ${config.targets.lines}% lines, ${config.targets.statements}% statements, ${config.targets.functions}% functions, and ${config.targets.branches}% branches. Remaining gaps are explicit follow-up work; the targets do not block changes while this foundational family is being expanded.

| Component | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | --- |
${rows.join("\n")}

Run \`pnpm quality:base\` to execute both isolated suites, refresh V8 coverage, and regenerate this page. Test failures remain technical failures even while coverage targets are advisory.
`;

report = augmentQualityTable(report, coverage, config.components, root, config.targets);

if (process.argv.includes("--check")) {
  const current = await readFile(reportPath, "utf8").catch(() => "");
  if (current !== report) {
    console.error("Base quality report is stale. Run pnpm quality:base:report.");
    process.exitCode = 1;
  }
} else {
  await writeFile(reportPath, report);
  console.log("Updated public/docs/appendices/component-quality/base.md.");
}
