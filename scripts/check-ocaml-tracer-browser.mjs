import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { chromium, firefox } from "@playwright/test";
import { compactTraceSteps } from "../src/components/trace/visible-steps.js";
const name = process.env.BROWSER || "chrome",
	base = process.env.BASE_URL || "http://127.0.0.1:4386";
const report = { browser: name, cases: [] };
const browser = await (name === "firefox" ? firefox : chromium).launch(
	name === "chrome" ? { channel: "chrome" } : {},
);
try {
	const page = await browser.newPage({
		viewport: { width: 1450, height: 1000 },
	});
	page.on("pageerror", (e) => console.error(e.message));
	page.on("console", (m) => {
		if (m.type() === "error") console.error(m.text());
	});
	await page.route("**/__ocaml-tracer.html", (r) =>
		r.fulfill({
			contentType: "text/html",
			body:
				'<tp-ocaml-tracer></tp-ocaml-tracer><script type="module" src="' +
				(process.env.TRACE_MODULE ||
					"/src/components/ocaml-tracer/ocaml-tracer.ts") +
				'"></script>',
		}),
	);
	await page.goto(base + "/__ocaml-tracer.html");
	await page.waitForFunction(() => customElements.get("tp-ocaml-tracer"));
	const host = page.locator("tp-ocaml-tracer");
	for (const [file, expected] of [
		["recursion.ml", "120\n"],
		["same-line.ml", "30\n"],
		["shared.ml", "9 1\n"],
		["closures.ml", "1\n2\n"],
		["patterns.ml", "6\n"],
		["caught.ml", "42\n"],
		["error.ml", ""],
	]) {
		await host.evaluate(async (e, file) => {
			e.removeAttribute("trace");
			e.src = "/docs/components/ocaml-tracer/examples/" + file;
			await e.refresh();
			e.record();
		}, file);
		await page.waitForFunction(
			() => {
				const status = document.querySelector("[data-role=status]");
				return (
					status.textContent.startsWith("Step ") ||
					status.classList.contains("trace-error")
				);
			},
			null,
			{ timeout: 90000 },
		);
		const status = await host.locator("[data-role=status]").innerText();
		assert.ok(status.startsWith("Step "), status);
		const data = JSON.parse(await host.evaluate((e) => e.getCode()));
		console.log(
			file,
			data.trace.length,
			data.trace.at(-1).exception_msg || data.trace.at(-1).stdout,
		);
		await writeFile(
			"/tmp/ocaml-" + file + ".json",
			JSON.stringify(data, null, 2),
		);
		assert.equal(data.trace.at(-1).stdout, expected);
		if (file === "error.ml") assert.ok(data.trace.at(-1).exception_msg);
		else assert.notEqual(data.trace.at(-1).event, "instruction_limit_reached");
		assert.deepEqual(compactTraceSteps(data.trace), data.trace);
		const last = data.trace.at(-1);
		if (file === "recursion.ml")
			assert.equal(
				Math.max(...data.trace.map((s) => s.stack_to_render?.length || 0)),
				5,
			);
		if (file === "shared.ml") {
			assert.deepEqual(last.globals.shared, last.globals.alias);
			assert.deepEqual(last.heap[last.globals.shared[1]], ["ARRAY", 1, 9, 3]);
		}
		if (file === "closures.ml") {
			assert.ok(
				data.trace.some((s) =>
					s.stack_to_render.some((f) => f.func_name === "anonymous"),
				),
			);
			const captured = last.stack_to_render.find(
				(f) => f.func_name === "Captured environment",
			);
			assert.deepEqual(last.heap[captured.encoded_locals.count[1]], [
				"INSTANCE",
				"ref",
				["contents", 2],
			]);
		}

		for (let i = 0; i < data.trace.length; i++) {
			await host.evaluate((e, i) => e.goTo(i), i);
			const range = data.trace[i].source_range;
			if (range)
				assert.equal(
					(
						await host.locator("[data-role=recorded] mark").allTextContents()
					).join("\n"),
					data.code.slice(range.start, range.end),
				);
		}
		await page.evaluate(() => {
			window.savedWorker = Worker;
			window.Worker = class {
				constructor() {
					throw Error("Replay started a Worker");
				}
			};
		});
		await host
			.locator("[data-role=file]")
			.setInputFiles({
				name: "saved.json",
				mimeType: "application/json",
				buffer: Buffer.from(JSON.stringify(data)),
			});
		await host.locator("[data-role=last]").click();
		assert.equal(
			await host.locator("[data-role=stdout]").innerText(),
			expected,
		);
		await page.evaluate(() => {
			window.Worker = window.savedWorker;
		});
		await page.screenshot({ path: "/tmp/ocaml-tracer-" + file + ".png" });
		report.cases.push({
			file,
			steps: data.trace.length,
			output: expected,
			sourceRanges: true,
			replay: true,
		});
	}
	const extra = [
		[
			"Unicode",
			'let s = "😀";; let n = (2 + 3);; print_int n;; print_newline ();;',
			"5\n",
			false,
		],
		[
			"Structure without phrase separators",
			'let a = 2\nlet square x = x * x\nlet answer = square (a + 1)\nlet () = Printf.printf "%d\\n" answer',
			"9\n",
			false,
		],
		["Infinite loop", "while true do () done;;", "", true],
		["Syntax error", "let =", "", true],
		["Unsupported module", "module Example = struct let x = 1 end;;", "", true],
		[
			"Float array and bool ref",
			'let a = [|1.; 2.|];; let r = ref true;; Printf.printf "%g %b\\n" a.(1) !r;;',
			"2 true\n",
			false,
		],
	];
	for (const [label, code, output, error] of extra) {
		await host.evaluate(async (e, code) => {
			e.removeAttribute("trace");
			e.removeAttribute("src");
			e.value = code;
			await e.refresh();
			e.record();
		}, code);
		await page.waitForFunction(
			() =>
				document
					.querySelector("[data-role=status]")
					?.textContent.startsWith("Step "),
			null,
			{ timeout: 90000 },
		);
		const data = JSON.parse(await host.evaluate((e) => e.getCode()));
		assert.equal(data.trace.at(-1).stdout, output, label);
		assert.equal(Boolean(data.trace.at(-1).exception_msg), error, label);
		if (label === "Infinite loop") {
			assert.equal(data.trace.at(-1).event, "instruction_limit_reached");
			assert.ok(data.trace.length <= 1001);
			assert.ok(data.trace.some((step) => (step.grouped_steps || 1) > 1));
			assert.deepEqual(compactTraceSteps(data.trace), data.trace);
		}
		if (label === "Float array and bool ref") {
			const last = data.trace.at(-1);
			assert.deepEqual(last.heap[last.globals.a[1]], ["ARRAY", 1, 2]);
			assert.deepEqual(last.heap[last.globals.r[1]], [
				"INSTANCE",
				"ref",
				["contents", true],
			]);
		}
		await host
			.locator("[data-role=file]")
			.setInputFiles({
				name: "extra.json",
				mimeType: "application/json",
				buffer: Buffer.from(JSON.stringify(data)),
			});
		await host.locator("[data-role=last]").click();
		assert.equal(await host.locator("[data-role=stdout]").innerText(), output);
		console.log(name, label, "passed");
		report.cases.push({
			label,
			steps: data.trace.length,
			output,
			error,
			replay: true,
		});
	}
	report.passed = true;
	await writeFile(
		`/tmp/ocaml-tracer-${name}.json`,
		JSON.stringify(report, null, 2),
	);
} finally {
	await browser.close();
}
