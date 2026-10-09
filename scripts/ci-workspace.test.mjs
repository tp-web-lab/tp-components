import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { load } from "js-yaml";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const action = load(read(".github/actions/setup-workspace/action.yml"));
const lock = load(read(".github/ci/pnpm-lock.yaml"));
const packages = load(read(".github/ci/pnpm-workspace.yaml")).packages;
const workflows = ["accessibility", "component-quality", "lighthouse"];

test("the CI workspace contains the component package and four pinned repositories", () => {
  const checkouts = action.runs.steps.filter((step) => step.with?.repository);
  assert.equal(checkouts.length, 4);
  assert.deepEqual([...packages].sort(), ["tp-components", ...checkouts.map((step) => step.with.path)].sort());
  for (const { with: inputs } of checkouts) {
    assert.equal(inputs.repository, `tp-web-lab/${inputs.path}`);
    assert.match(inputs.ref, /^[a-f0-9]{40}$/);
    assert.equal(inputs["persist-credentials"], false);
    assert.ok(lock.importers[inputs.path]);
  }
});

test("the CI lockfile matches every component dependency declaration", () => {
  const pkg = JSON.parse(read("package.json"));
  const ci = JSON.parse(read(".github/ci/package.json"));
  assert.equal(pkg.packageManager, ci.packageManager);
  assert.equal(ci.packageManager, "pnpm@9.15.5");
  const importer = lock.importers["tp-components"];
  for (const group of ["dependencies", "devDependencies", "optionalDependencies"]) {
    assert.deepEqual(Object.keys(importer[group] ?? {}).sort(), Object.keys(pkg[group] ?? {}).sort());
    for (const [name, specifier] of Object.entries(pkg[group] ?? {})) {
      assert.equal(importer[group][name].specifier, specifier, name);
      if (specifier.startsWith("workspace:")) {
        assert.equal(importer[group][name].version, `link:../${name.slice(4)}`);
      }
    }
  }
  assert.deepEqual(Object.keys(lock.importers).sort(), [".", ...packages].sort());
});

test("shared setup uses the frozen CI lock and builds dependencies before reports", () => {
  const steps = action.runs.steps;
  const setup = steps.find((step) => step.uses === "actions/setup-node@v6");
  assert.equal(setup.with["node-version"], 24);
  assert.equal(setup.with["cache-dependency-path"], "tp-components/.github/ci/pnpm-lock.yaml");
  const commands = steps.filter((step) => step.run);
  for (const step of commands.filter((step) => step.name !== "Check CI workspace configuration")) assert.equal(step["working-directory"], "${{ github.workspace }}");
  assert.ok(commands.some((step) => step.run.trim() === "pnpm install --frozen-lockfile"));
  const build = commands.find((step) => step.name === "Build the shared packages").run;
  for (const name of packages.filter((name) => name !== "tp-components")) {
    assert.ok(build.includes(`pnpm --filter @tp/${name} build`));
  }
  assert.doesNotMatch(build, /test:|quality:|lighthouse/);
});

test("all workflows share setup and collect artifacts relative to the workspace root", () => {
  for (const name of workflows) {
    const workflow = load(read(`.github/workflows/${name}.yml`));
    assert.equal(workflow.permissions.contents, "read");
    assert.equal(workflow.defaults.run["working-directory"], "tp-components");
    for (const job of Object.values(workflow.jobs)) {
      assert.equal(job.steps[0].uses, "actions/checkout@v6");
      assert.equal(job.steps[0].with.path, "tp-components");
      assert.equal(job.steps[1].uses, "./tp-components/.github/actions/setup-workspace");
      const upload = job.steps.find((step) => step.uses === "actions/upload-artifact@v6");
      assert.equal(upload.if, "always()");
      for (const path of upload.with.path.trim().split("\n")) assert.ok(path.startsWith("tp-components/"));
      assert.ok(!job.steps.some((step) => step.run?.startsWith("pnpm install")));
    }
  }
});
