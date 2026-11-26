import {compactTraceSteps} from "./visible-steps.js";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";
import { createConnectors } from "./connectors.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { traceTemplate } from "./template.js";
import { parseTrace } from "./trace-file.js";
let instance = 0;
export function createTraceRuntime(host, readSource, options) {
	const prefix = `${options.language}-tracer-${++instance}-`;
	const root = document.createElement("div");
	root.setAttribute(`data-tp-${options.language}-tracer-generated`, "");
	root.className = "tp-interpreter-panel";
	root.innerHTML = traceTemplate(options.language, options.title);
	if (!host.id) host.id = prefix + "host";
	root.setAttribute("data-tp-generated", "");
	for (const control of root.querySelectorAll(
		"tp-color,tp-theme,tp-fullscreen",
	))
		control.setAttribute("anchor", `#${CSS.escape(host.id)}`);
	for (const node of root.querySelectorAll("[id]")) {
		node.dataset.role = node.id;
		node.id = prefix + node.id;
	}
	host.append(root);
	const $ = (id) => root.querySelector(`[data-role="${id}"]`);
	let loadedFilename = options.filename;
	function updateFilename(name) {
		if (name) loadedFilename = name;
		const filename = host.getAttribute("filename") || loadedFilename;
		$("filename").textContent = filename;
		$("filename").title = filename;
		$("source").setAttribute(
			"filename",
			filename.endsWith(".json") ? options.filename : filename,
		);
	}
	function toggleSource() {
		$("source-panel").hidden = !$("source-panel").hidden;
		$("edit").setAttribute("aria-expanded", String(!$("source-panel").hidden));
	}
	$("edit").addEventListener("click", toggleSource);
	updateFilename();

	const connectors = createConnectors(root, prefix);
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
		if (
			Array.isArray(value) &&
			[
				"SCHEME",
				"UNDEFINED",
				"UNINITIALIZED",
				"BIGINT",
				"SYMBOL",
				"ACCESSOR",
				"TRUNCATED",
			].includes(value[0])
		)
			return text("span", value[1]);
		if (Array.isArray(value)) return text("span", JSON.stringify(value));
    if (options.language === "scheme" && typeof value === "boolean") return text("span", value ? "#t" : "#f");
		return text(
			"span",
			value === null
				? options.language === "python"
					? "None"
					: "null"
				: typeof value === "boolean"
					? value
						? options.language === "python"
							? "True"
							: "true"
						: options.language === "python"
							? "False"
							: "false"
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
				.filter(
					(name) =>
						name in locals &&
						!(
							options.language !== "python" &&
							Array.isArray(locals[name]) &&
							locals[name][0] === "UNINITIALIZED"
						),
				)
				.map((name) => [name, locals[name]]),
		);
		return card;
	}
	function render() {
		$("save").toggleAttribute("disabled", !snapshots.length);
		const step = snapshots[position];
		if (!step) return;
		setStatus(`Step ${position + 1} / ${snapshots.length}`);
		$("event").textContent =
			`${step.event} · line ${step.line ?? "—"} · ${step.func_name ?? ""}${step.exception_msg ? " · " + step.exception_msg : ""}`;
		$("event").classList.toggle("trace-error", Boolean(step.exception_msg));
		let offset = 0;
		const range = step.source_range;
		$("recorded").replaceChildren(
			...recordedCode.split("\n").map((line, i) => {
				const span = text("span", `${i + 1}  `);
				span.className = !range && i + 1 === step.line ? "current" : "";
				const start = range ? Math.max(0, range.start - offset) : 0;
				const end = range ? Math.min(line.length, range.end - offset) : 0;
				if (range && start < end) {
					span.append(document.createTextNode(line.slice(0,start)),text("mark",line.slice(start,end)),document.createTextNode(line.slice(end)+"\n"));
				} else span.append(document.createTextNode(line+"\n"));
				offset += line.length + 1;
				return span;
			}),
		);
        // Scroll only the source viewport, never the surrounding book/page.
        const sourcePanel = $("recorded");
        const active = sourcePanel.querySelector("mark, .current");
        if (active) {
            const panel = sourcePanel.getBoundingClientRect();
            const rect = active.getBoundingClientRect();
            if (rect.left < panel.left || rect.right > panel.right)
                sourcePanel.scrollLeft += rect.left - panel.left - 12;
            if (rect.top < panel.top || rect.bottom > panel.bottom)
                sourcePanel.scrollTop += rect.top - panel.top - 12;
        }
		$("stdout").textContent = step.stdout ?? "";
		$("variables").replaceChildren(
			frame("Globals", step.globals ?? {}, step.ordered_globals),
		);
		$("call-stack").replaceChildren();
		for (const f of step.stack_to_render ?? [])
			$("call-stack").append(
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
			if (["LIST", "ARRAY", "TUPLE", "SET", "VECTOR"].includes(object[0])) {
				card.classList.add("sequence");
				values(
					card,
					object.slice(1).map((value, i) => [String(i), value]),
				);
			} else if (object[0] === "PAIR") values(card, object.slice(1));
      else if (object[0] === "DICT")
				values(
					card,
					object.slice(1).map(([key, value]) => [JSON.stringify(key), value]),
				);
			else if (["INSTANCE", "INSTANCE_PPRINT", "CLASS"].includes(object[0])) {
				const isClass = object[0] === "CLASS";
				card.dataset.objectKind = isClass ? "class" : "instance";
				card.querySelector("h3").textContent =
					`Object #${id} · ${object[1]} ${isClass ? "class" : "instance"}`;
				if (isClass && object[2].length) {
					const bases = text(
						"p",
						object[2].length === 1 ? "super: " : "Bases: ",
					);
					for (const [index, name] of object[2].entries()) {
						if (index) bases.append(document.createTextNode(", "));
						// Legacy recordings identify bases by name. Never guess if names collide.
						const matches = Object.entries(step.heap ?? {}).filter(
							([key, value]) =>
								key !== id && value[0] === "CLASS" && value[1] === name,
						);
						if (matches.length === 1) {
							const target = matches[0][0];
							const link = text("a", name);
							link.href = `#${prefix}object-${target}`;
							link.dataset.objectLink = target;
							link.className = "super-link";
							link.title = `Base class ${name}`;
							bases.append(link);
						} else bases.append(document.createTextNode(name));
					}
					card.append(bases);
				}
				if (object[0] === "INSTANCE_PPRINT") card.append(text("p", object[2]));
				const attributes = object.slice(object[0] === "INSTANCE" ? 2 : 3);
				if (attributes.length) values(card, attributes);
				else card.append(text("p", "No attributes."));
			} else if (object[0] === "FUNCTION") card.append(text("code", object[1]));
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
	function setStatus(message, error = false) {
		$("status").textContent = message;
		$("status").classList.toggle("trace-error", error);
	}
	function fail(message) {
		finish();
		setStatus(message, true);
	}
	let recordedSource, recordedQuery, replayQuery;
	function record() {
		if (worker) return;
		cancelLoad();
		finish();
		snapshots = [];
		$("save").setAttribute("disabled", "");
		scheduleArrows(true);
		position = 0;
		for (const id of [
			"recorded",
			"variables",
			"call-stack",
			"heap",
			"stdout",
			"json",
			"event",
		])
			$(id).replaceChildren();
		for (const id of ["first", "previous", "next", "last"])
			$(id).setAttribute("disabled", "");
		recordedSource = $("source").getValue();
		recordedQuery = options.language === "scheme" ? (replayQuery ? replayQuery.query : host.getAttribute("query") ?? undefined) : undefined;
		recordedCode = recordedQuery === undefined ? recordedSource : recordedSource.trimEnd() + "\n\n" + recordedQuery;
		if (recordedCode.length > 20000) {
			setStatus("Source limit: 20,000 characters.", true);
			return;
		}
		$("run").setAttribute("disabled", "");
		$("stop").removeAttribute("disabled");
		setStatus(options.loading);
		const current = (worker = options.createWorker());
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
				setStatus(
					`Recording with ${options.title}${data.version ? " " + data.version : ""}…`,
				);
				timer = setTimeout(
					() => fail("Execution timed out. The Worker was terminated."),
					10000,
				);
			} else if (data.type === "error") fail(data.message);
			else if (data.type === "trace") {
				snapshots = compactTraceSteps(data.result.trace);
				finish();
				if (!snapshots.length) {
					setStatus("No trace events.");
					return;
				}
				render();
			}
		};
		current.postMessage({ code: recordedSource, ...(recordedQuery !== undefined ? {query:recordedQuery} : {}) });
	}
	$("run").addEventListener("click", record);
	const stopRecording = () => { if (worker) fail("Recording stopped."); };
	$("stop").addEventListener("click", stopRecording);
	function goTo(index) {
		if (!Number.isInteger(index) || !snapshots.length) return;
		position = Math.max(0, Math.min(index, snapshots.length - 1));
		render();
	}
	const firstStep = () => goTo(0);
	const previousStep = () => goTo(position - 1);
	const nextStep = () => goTo(position + 1);
	const lastStep = () => goTo(snapshots.length - 1);
	const loadTrace = () => $("file").click();
	const toggleJson = () => {
		const details = $("json").closest("details");
		details.open = !details.open;
	};
	for (const [role, action] of Object.entries({first:firstStep, previous:previousStep, next:nextStep, last:lastStep}))
		$(role).addEventListener("click", action);
	window.addEventListener("pagehide", finish);

	let request = 0,
		controller;
	function cancelLoad() {
		request++;
		controller?.abort();
	}
	function install(data) {
		finish();
		recordedCode = data.code;
		recordedSource = data.source ?? data.code;
		recordedQuery = data.query;
		replayQuery = {query:data.query};
		snapshots = compactTraceSteps(data.trace);
		position = 0;
		$("source").setValue(recordedSource);
		render();
	}
	async function load(read) {
		cancelLoad();
		finish();
		const token = request;
		controller = new AbortController();
		const currentController = controller;
		setStatus("Loading…");
		const deadline = setTimeout(() => currentController.abort(), 30000);
		try {
			const result = await read(controller.signal);
			if (token !== request) return;
			if (result.kind === "trace") {
				const recording = parseTrace(result.text);
				if ((recording.language ?? "python") !== options.language)
					throw new Error(`Expected a ${options.title} recording.`);
				install(recording);
				updateFilename(result.filename || "trace.json");
				if (result.filename) traceFilename = result.filename;
			} else {
				if (result.text.length > 20000)
					throw new Error("Source limit: 20,000 characters.");
				recordedCode = "";
					replayQuery = undefined;
				snapshots = [];
				$("save").setAttribute("disabled", "");
				position = 0;
				for (const id of [
					"recorded",
					"variables",
					"call-stack",
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
				updateFilename(result.filename || options.filename);
				setStatus("Source loaded. Choose Record execution.");
			}
		} catch (error) {
			if (token === request) setStatus(`Load failed: ${error.message}`, true);
		} finally {
			clearTimeout(deadline);
		}
	}
	function loadAttributes() {
		const trace = host.getAttribute("trace");

		return load(async (signal) => {
			if (!trace)
				return {
					kind: "source",
					text: await readSource({ signal }),
					filename: host.getAttribute("src")
						? decodeURIComponent(
								resolveComponentSourceUrl(host, host.getAttribute("src"))
									.pathname.split("/")
									.pop(),
							)
						: host
								.querySelector(`script[type="tp/${options.language}"]`)
								?.getAttribute("filename") || options.filename,
				};
			const response = await fetch(resolveComponentSourceUrl(host, trace), {
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
							resolveComponentSourceUrl(host, trace).pathname.split("/").pop(),
						)
					: undefined,
			};
		});
	}
	let traceFilename = "trace.json";
	async function saveAs() {
		if (!snapshots.length) return;
		// Capture the recording, not unexecuted edits currently in the source editor.
		const content =
			JSON.stringify(
				{
					version: 1,
					...(options.language !== "python"
						? { language: options.language }
						: {}),
					code: recordedCode,
					...(recordedQuery !== undefined ? {source:recordedSource, query:recordedQuery} : {}),
					trace: snapshots,
				},
				null,
				2,
			) + "\n";
		try {
			const target = await chooseSaveTarget({
				suggestedName: traceFilename,
				description: `${options.title} execution trace`,
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
			setStatus(`Save failed: ${error.message}`, true);
		}
	}
	$("save").addEventListener("click", saveAs);

	$("load").addEventListener("click", loadTrace);
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
		updateFilename,
		toggleSource,
		record,
		saveAs,
		stop: stopRecording,
		getCode: () =>
			JSON.stringify(
				{
					version: 1,
					...(options.language !== "python"
						? { language: options.language }
						: {}),
					code: recordedCode,
					...(recordedQuery !== undefined ? {source:recordedSource, query:recordedQuery} : {}),
					trace: snapshots,
				},
				null,
				2,
			) + "\n",
		goTo, firstStep, previousStep, nextStep, lastStep, loadTrace, toggleJson,
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
			root.remove();
		},
	};
}
