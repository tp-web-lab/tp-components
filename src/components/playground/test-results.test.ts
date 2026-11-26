import { afterEach, expect, it } from "vitest";
import { createTestReporter } from "./test-results.js";

afterEach(() => document.body.replaceChildren());
it("renders safe test details and distinguishes skipped cases from failures", () => {
	const report = createTestReporter(document.body, "Example");
	report.add({
		suite: "Math",
		name: "<script>bad()</script>",
		status: "passed",
	});
	report.add({
		suite: "Math",
		name: "Pending",
		status: "skipped",
		details: "Later",
	});
	report.add({ suite: "Math", name: "Known", status: "expected-failure" });
	report.finish();
	expect(document.querySelector("script")).toBeNull();
	expect(document.querySelector("section")?.dataset.testResult).toBe("passed");
	expect(document.querySelector('[role="status"]')?.textContent).toContain(
		"1 skipped, 1 expected failures",
	);
	report.error(new Error("Unexpected"));
	expect(document.querySelector("section")?.dataset.testResult).toBe("failed");
});
it("rejects an empty suite instead of declaring it successful", () => {
	const report = createTestReporter(document.body, "Empty");
	report.finish();
	expect(document.querySelector("section")?.dataset.testResult).toBe("failed");
	expect(document.body.textContent).toContain("No tests executed.");
});
