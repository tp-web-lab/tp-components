import { chooseSaveTarget, saveBlob } from "/src/utilities/save-file.ts";
import { createConnectors } from "./connectors.js";
import "/src/components/code-editor/code-editor.ts";
import "/src/components/icon-button/icon-button.ts";
import "/src/components/button/button.ts";
import "/src/components/divider/divider.ts";
import { template } from "./template.js";
import { parseTrace } from "./trace-file.js";
export const examples = {
	students:
		"students = [\n    {'name': 'Ada', 'scores': (90, 95)},\n    {'name': 'Bob', 'scores': (80, 70)},\n]\ntop = None\nbest = -1\nfor s in students:\n    avg = sum(s['scores']) / 2\n    if avg > best:\n        best = avg\n        top = s['name']\nprint(top, best)",
	recursion:
		"def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nanswer = factorial(5)\nprint(answer)",
	variables: "x = 2\ny = x + 3\nx = 9\nprint(x, y)",
	lists: "items = [1, 2]\nitems.append(3)\nitems[0] = 10\nprint(items)",
	sharing:
		"a = [1, 2]\nb = a\nc = list(a)\nb.append(3)\npair = [a, b]\nprint(a, b, c)\nprint(a is b, a is c)",
};
let instance = 0;
function initialize(host) {
	const prefix = instance++ ? `python-tracer-${instance}-` : "";
	host.innerHTML = template;
	for (const node of host.children) node.setAttribute("data-tp-generated", "");
	for (const node of host.querySelectorAll("[id]")) {
		node.dataset.role = node.id;
		node.id = prefix + node.id;
	}
	const $ = (id) => host.querySelector(`[data-role="${id}"]`);
	const connectors = createConnectors(host, prefix);
	const scheduleArrows = connectors.scheduleArrows;
	let worker,
		timer,
		snapshots = [],
		position = 0,
		recordedCode = "";
	const text = (tag, value) => {
		const node = document.createElement(tag);
		node.textContent = value;
		return node;
	};
	function valueNode(value) {
		if (Array.isArray(value) && value[0] === "REF") {
			const a = text("a", "");
			a.className = "reference-port";
			a.setAttribute("aria-label", `Reference to object #${value[1]}`);
			a.title = `Object #${value[1]}`;
			a.href = `#${prefix}object-${value[1]}`;
			a.dataset.reference = String(value[1]);
			return a;
		}
		if (Array.isArray(value) && value[0] === "SPECIAL_FLOAT")
			return text("span", value[1]);
		if (Array.isArray(value)) return text("span", JSON.stringify(value));
		return text(
			"span",
			value === null
				? "None"
				: typeof value === "boolean"
					? value
						? "True"
						: "False"
					: JSON.stringify(value),
		);
	}
	function values(container, entries) {
		const dl = document.createElement("dl");
		for (const [name, value] of entries) {
			dl.append(text("dt", name));
			const dd = document.createElement("dd");
			dd.append(valueNode(value));
			dl.append(dd);
		}
		container.append(dl);
	}
	function frame(title, locals, names) {
		const card = document.createElement("article");
		card.className = "frame";
		card.append(text("h3", title));
		values(
			card,
			(names ?? Object.keys(locals))
				.filter((name) => name in locals)
				.map((name) => [name, locals[name]]),
		);
		return card;
	}
	function render() {
		$("save").toggleAttribute("disabled", !snapshots.length);
		const step = snapshots[position];
		if (!step) return;
		$("status").textContent = `Step ${position + 1} / ${snapshots.length}`;
		$("event").textContent =
			`${step.event} · line ${step.line ?? "—"} · ${step.func_name ?? ""}${step.exception_msg ? " · " + step.exception_msg : ""}`;
		$("recorded").replaceChildren(
			...recordedCode.split("\n").map((line, i) => {
				const span = text("span", `${i + 1}  ${line}\n`);
				span.className = i + 1 === step.line ? "current" : "";
				return span;
			}),
		);
		$("stdout").textContent = step.stdout ?? "";
		$("frames").replaceChildren(
			frame("Globals", step.globals ?? {}, step.ordered_globals),
		);
		for (const f of step.stack_to_render ?? [])
			$("frames").append(
				frame(
					`${f.func_name} · frame #${f.frame_id}`,
					f.encoded_locals ?? {},
					f.ordered_varnames,
				),
			);
		$("heap").replaceChildren();
		for (const [id, object] of Object.entries(step.heap ?? {})) {
			const card = document.createElement("article");
			card.className = "object";
			card.id = `${prefix}object-${id}`;
			card.dataset.object = id;
			card.append(text("h3", `Object #${id} · ${object[0]}`));
			if (["LIST", "TUPLE", "SET"].includes(object[0])) {
				card.classList.add("sequence");
				values(
					card,
					object.slice(1).map((value, i) => [String(i), value]),
				);
			} else if (object[0] === "DICT")
				values(
					card,
					object.slice(1).map(([key, value]) => [JSON.stringify(key), value]),
				);
			else if (object[0] === "FUNCTION") card.append(text("code", object[1]));
			else card.append(text("pre", JSON.stringify(object.slice(1), null, 2)));
			$("heap").append(card);
		}
		scheduleArrows(true);
		$("json").textContent = JSON.stringify(step, null, 2);
		for (const id of ["first", "previous"])
			$(id).toggleAttribute("disabled", position === 0);
		for (const id of ["next", "last"])
			$(id).toggleAttribute("disabled", position === snapshots.length - 1);
	}
	function finish() {
		clearTimeout(timer);
		worker?.terminate();
		worker = undefined;
		$("run").removeAttribute("disabled");
		$("stop").setAttribute("disabled", "");
	}
	function fail(message) {
		finish();
		$("status").textContent = message;
	}
	function record() {
		cancelLoad();
		finish();
		snapshots = [];
		$("save").setAttribute("disabled", "");
		scheduleArrows(true);
		position = 0;
		for (const id of ["recorded", "frames", "heap", "stdout", "json", "event"])
			$(id).replaceChildren();
		for (const id of ["first", "previous", "next", "last"])
			$(id).setAttribute("disabled", "");
		recordedCode = $("source").getValue();
		if (recordedCode.length > 20000) {
			$("status").textContent = "Source limit: 20,000 characters.";
			return;
		}
		$("run").setAttribute("disabled", "");
		$("stop").removeAttribute("disabled");
		$("status").textContent = "Loading Pyodide…";
		const current = (worker = new Worker(
			new URL("./worker.js", import.meta.url),
		));
		timer = setTimeout(
			() => fail("Initialization timed out. Try again."),
			60000,
		);
		current.onerror = (event) => {
			if (worker === current) fail(event.message);
		};
		current.onmessage = ({ data }) => {
			if (worker !== current) return;
			if (data.type === "ready") {
				clearTimeout(timer);
				$("status").textContent = `Recording with Python ${data.version}…`;
				timer = setTimeout(
					() => fail("Execution timed out. The Worker was terminated."),
					10000,
				);
			} else if (data.type === "error") fail(data.message);
			else if (data.type === "trace") {
				snapshots = data.result.trace;
				finish();
				if (!snapshots.length) {
					$("status").textContent = "No trace events.";
					return;
				}
				render();
			}
		};
		current.postMessage({ code: recordedCode });
	}
	$("run").addEventListener("click", record);
	$("stop").addEventListener("click", () => fail("Recording stopped."));
	$("first").addEventListener("click", () => {
		position = 0;
		render();
	});
	$("previous").addEventListener("click", () => {
		position = Math.max(0, position - 1);
		render();
	});
	$("next").addEventListener("click", () => {
		position = Math.min(snapshots.length - 1, position + 1);
		render();
	});
	$("last").addEventListener("click", () => {
		position = snapshots.length - 1;
		render();
	});
	for (const button of host.querySelectorAll("[data-example]"))
		button.addEventListener("click", () => {
			$("source").setValue(examples[button.dataset.example]);
		});
	window.addEventListener("pagehide", finish);
	$("source").setValue(examples.recursion);

	let request = 0,
		controller;
	function cancelLoad() {
		request++;
		controller?.abort();
	}
	function install(data) {
		finish();
		recordedCode = data.code;
		snapshots = data.trace;
		position = 0;
		$("source").setValue(recordedCode);
		render();
	}
	async function load(read) {
		cancelLoad();
		finish();
		const token = request;
		controller = new AbortController();
		const currentController = controller;
		$("status").textContent = "Loading…";
		const deadline = setTimeout(() => currentController.abort(), 30000);
		try {
			const result = await read(controller.signal);
			if (token !== request) return;
			if (result.kind === "trace") {
				install(parseTrace(result.text));
				if (result.filename) traceFilename = result.filename;
			} else {
				if (result.text.length > 20000)
					throw new Error("Source limit: 20,000 characters.");
				recordedCode = "";
				snapshots = [];
				$("save").setAttribute("disabled", "");
				position = 0;
				for (const id of [
					"recorded",
					"frames",
					"heap",
					"stdout",
					"json",
					"event",
				])
					$(id).replaceChildren();
				for (const id of ["first", "previous", "next", "last"])
					$(id).setAttribute("disabled", "");
				scheduleArrows(true);
				$("source").setValue(result.text);
				$("status").textContent = "Source loaded. Choose Record execution.";
			}
		} catch (error) {
			if (token === request)
				$("status").textContent = `Load failed: ${error.message}`;
		} finally {
			clearTimeout(deadline);
		}
	}
	function loadAttributes() {
		const trace = host.getAttribute("trace"),
			src = host.getAttribute("src");
		if (!trace && !src) {
			cancelLoad();
			return;
		}
		return load(async (signal) => {
			const response = await fetch(new URL(trace || src, host.baseURI), {
				signal,
			});
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const text = await response.text();
			if (text.length > 10000000) throw new Error("File limit: 10 MB.");
			return {
				kind: trace ? "trace" : "source",
				text,
				filename: trace
					? decodeURIComponent(
							new URL(trace, host.baseURI).pathname.split("/").pop(),
						)
					: undefined,
			};
		});
	}
	let traceFilename = "trace.json";
	$("save").addEventListener("click", async () => {
		if (!snapshots.length) return;
		// Capture the recording, not unexecuted edits currently in the source editor.
		const content =
			JSON.stringify(
				{ version: 1, code: recordedCode, trace: snapshots },
				null,
				2,
			) + "\n";
		try {
			const target = await chooseSaveTarget({
				suggestedName: traceFilename,
				description: "Python execution trace",
				mimeType: "application/json",
				extension: ".json",
			});
			if (!target) return;
			await saveBlob(
				new Blob([content], { type: "application/json;charset=utf-8" }),
				target,
			);
			traceFilename = target.filename;
		} catch (error) {
			$("status").textContent = `Save failed: ${error.message}`;
		}
	});
	$("load").addEventListener("click", () => $("file").click());
	$("file").addEventListener("change", () => {
		const file = $("file").files[0];
		$("file").value = "";
		if (!file) return;
		void load(async () => {
			if (file.size > 10000000) throw new Error("File limit: 10 MB.");
			return { kind: "trace", text: await file.text(), filename: file.name };
		});
	});
	return {
		loadAttributes,
		get snapshots() {
			return snapshots;
		},
		get position() {
			return position;
		},
		destroy() {
			cancelLoad();
			finish();
			connectors.destroy();
			window.removeEventListener("pagehide", finish);
		},
	};
}
export class TpPythonTracer extends HTMLElement {
	static observedAttributes = ["src", "trace"];
	connectedCallback() {
		if (!this.runtime) this.runtime = initialize(this);
		this.runtime.loadAttributes();
	}
	attributeChangedCallback() {
		if (this.isConnected) this.runtime?.loadAttributes();
	}
	disconnectedCallback() {
		this.runtime?.destroy();
		this.runtime = undefined;
	}
}
customElements.define("tp-python-tracer", TpPythonTracer);
// Read-only inspection for existing prototype checks.
window.pythonTracePrototype =
	document.querySelector("tp-python-tracer")?.runtime;
