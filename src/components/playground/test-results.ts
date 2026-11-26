import baseStyle from "../base/base.css?inline";
import resetStyle from "../base/tp-reset.css?inline";
import tokenStyle from "../base/tp-tokens.css?inline";

/** Test previews reuse TP base typography, tables and semantic state colors. */
export function testResultsHead(): string {
	return `<style>${tokenStyle}\n${resetStyle}\n${baseStyle}</style><script>(${syncTestAppearance.toString()})()</script>`;
}

/** Keeps an embedded report in its playground's TP color and theme scope. */
function syncTestAppearance(): void {
	const frame = window.frameElement;
	if (!frame) return;
	frame.setAttribute("data-tp-test-frame", "");
	const root = document.documentElement;
	const tokenNames = new Set<string>();
	const sync = () => {
		const scope = frame.closest(".tp-dark, .tp-light");
		const style = frame.ownerDocument.defaultView?.getComputedStyle(
			scope ?? frame,
		);
		if (!style) return;
		for (const name of Array.from(style)) {
			if (name.startsWith("--tp-")) tokenNames.add(name);
		}
		// Firefox may omit a token from enumeration when it returns to its default.
		// Refresh previously copied names too, so the old dark palette cannot linger.
		for (const name of tokenNames) {
			const value = style.getPropertyValue(name);
			if (value) root.style.setProperty(name, value);
			else root.style.removeProperty(name);
		}

		root.classList.toggle(
			"tp-dark",
			scope?.classList.contains("tp-dark") ?? false,
		);
		root.classList.toggle(
			"tp-light",
			scope?.classList.contains("tp-light") ?? false,
		);
	};
	sync();
	const observer = new MutationObserver(sync);
	for (let node: Element | null = frame; node; node = node.parentElement) {
		observer.observe(node, {
			attributes: true,
			attributeFilter: ["class", "style"],
		});
	}
	window.addEventListener(
		"pagehide",
		() => {
			observer.disconnect();
			frame.removeAttribute("data-tp-test-frame");
		},
		{
			once: true,
		},
	);
}

/** A framework-independent test result, rendered as text rather than HTML. */
export interface PlaygroundTestResult {
	suite: string;
	name: string;
	status: "passed" | "failed" | "skipped" | "expected-failure";
	details?: string;
}

/** Self-contained reporter embedded in isolated test documents. */
export function createTestReporter(host: HTMLElement, framework: string) {
	const results: PlaygroundTestResult[] = [];
	const section = document.createElement("section");
	section.dataset.tpTestResults = framework;
	section.setAttribute("aria-label", `${framework} test results`);
	const summary = document.createElement("p");
	summary.setAttribute("role", "status");
	const table = document.createElement("table");
	const head = table.createTHead().insertRow();
	for (const title of ["Suite", "Test", "Status", "Details"]) {
		const cell = document.createElement("th");
		cell.scope = "col";
		cell.textContent = title;
		head.append(cell);
	}
	const body = table.createTBody();
	section.append(summary, table);
	host.append(section);
	function refresh() {
		const count = (status: string) =>
			results.filter((result) => result.status === status).length;
		summary.textContent = `${framework}: ${count("passed")} passed, ${count("failed")} failed, ${count("skipped")} skipped, ${count("expected-failure")} expected failures`;
		section.dataset.testResult = count("failed")
			? "failed"
			: results.length
				? "passed"
				: "empty";
		window.dispatchEvent(new Event("resize"));
	}
	function add(result: PlaygroundTestResult) {
		results.push(result);
		const row = body.insertRow();
		row.dataset.testStatus = result.status;
		for (const value of [
			result.suite,
			result.name,
			result.status,
			result.details ?? "",
		])
			row.insertCell().textContent = value;
		refresh();
	}
	function attachLog(output: HTMLElement) {
		const details = document.createElement("details");
		const label = document.createElement("summary");
		label.textContent = "Engine output";
		details.append(label, output);
		section.append(details);
	}
	function finish() {
		if (!results.length)
			add({
				suite: framework,
				name: "Test suite",
				status: "failed",
				details: "No tests executed.",
			});
		refresh();
		section.dataset.testComplete = "";
		const failed = results.some((result) => result.status === "failed");
		(failed ? console.error : console.info)(summary.textContent);
	}
	function error(error: unknown) {
		section.dataset.testComplete = "";
		add({
			suite: framework,
			name: "Execution error",
			status: "failed",
			details: String(error),
		});
	}
	refresh();
	return { add, finish, error, results, attachLog };
}
