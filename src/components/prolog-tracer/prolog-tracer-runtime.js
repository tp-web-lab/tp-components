import TraceWorker from "./prolog-tracer-worker.js?worker";
import { resolutionTree, parseResolutionTrace } from "./resolution-tree.js";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
let nextId = 0;
export function createTraceRuntime(host, readSource) {
	const root = document.createElement("div");
	root.className = "tp-interpreter-panel";
	root.setAttribute("data-tp-prolog-tracer-generated", "");
	root.setAttribute("data-tp-generated", "");
	const commands = [
		["edit", "code", "Edit source"],
		["load", "file-import", "Load trace"],
		["save", "file-upload", "Save trace"],
	];
	const buttons = (items, section = "") =>
		items
			.map(
				([role, icon, label]) =>
					`<tp-icon-button ${section ? `section="${section}"` : ""} data-role="${role}" name="${icon}" label="${label}"></tp-icon-button>`,
			)
			.join("");
	root.innerHTML = `<tp-toolbar class="tp-interpreter-toolbar">
 <span section="start" class="tp-interpreter-title"><tp-icon library="languages" name="file_type_prolog" size="1.5em"></tp-icon> Prolog tracer</span>
 <span section="center" class="tp-interpreter-file" data-interpreter-filename data-role="filename"></span>
 ${buttons(commands, "end")}
 <tp-divider section="end" inline orientation="vertical" data-document-navbar-divider></tp-divider>
 <tp-color section="end"></tp-color><tp-theme section="end" mode="light"></tp-theme><tp-fullscreen section="end"></tp-fullscreen>
 </tp-toolbar>
 <div data-role="source-panel" hidden><tp-code-editor data-role="source" language="prolog" toolbar line-numbers></tp-code-editor></div>
 <tp-textfield data-role="query" label="Query" label-position="start" clearable copy-code></tp-textfield>
 <div class="resolution-controls">${buttons([
		["run", "play", "Record resolution"],
		["stop", "stop", "Stop recording"],
 ])}<tp-divider inline orientation="vertical"></tp-divider>${buttons([
		["first", "chevron-left-first", "First step"],
		["previous", "chevron-left", "Previous step"],
		["next", "chevron-right", "Next step"],
		["last", "chevron-right-last", "Last step"],
 ])}<output data-role="status" aria-live="polite"></output></div>
 <p data-role="event" aria-live="polite"></p><div class="resolution-scroll" tabindex="0" aria-label="Explored resolution tree"><svg data-role="tree" role="img" aria-label="Explored Prolog resolution tree"></svg></div>
 <div class="resolution-details"><div class="resolution-column"><h2>Source</h2><pre data-role="recorded"></pre></div><div class="resolution-column"><h2>Solutions</h2><ol data-role="solutions"></ol><h2>Output</h2><pre data-role="stdout"></pre></div></div><details class="resolution-json"><summary>Trace JSON</summary><pre><code data-role="json" class="language-json"></code></pre></details><input data-role="file" type="file" accept=".json,application/json" hidden>`;
	if (!host.id) host.id = `prolog-tracer-${++nextId}`;
	for (const controller of root.querySelectorAll(
		"tp-color,tp-theme,tp-fullscreen",
	))
		controller.setAttribute("anchor", "#" + CSS.escape(host.id));
	host.append(root);
	const $ = (role) => root.querySelector(`[data-role="${role}"]`);
	let recording = null,
		position = -1,
		worker,
		timer,
		request = 0,
		abort;
	const status = (text, error = false) => {
		$("status").textContent = text;
		$("status").classList.toggle("resolution-error", error);
	};
	function updateFilename() {
		const name = host.filename || host.src.split("/").at(-1) || "program.pl";
		$("filename").textContent = name;
		$("source").setAttribute("filename", name);
	}
	function controls() {
		for (const role of ["first", "previous"])
			$(role).toggleAttribute("disabled", position < 0);
		for (const role of ["next", "last"])
			$(role).toggleAttribute(
				"disabled",
				!recording || position >= recording.events.length - 1,
			);
		$("save").toggleAttribute("disabled", !recording);
		$("stop").toggleAttribute("disabled", !worker);
		$("run").toggleAttribute("disabled", !!worker);
	}
	function stop() {
		clearTimeout(timer);
		worker?.terminate();
		worker = undefined;
		controls();
	}
	const svg = (tag, attrs, text) => {
		const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
		for (const [k, v] of Object.entries(attrs || {}))
			n.setAttribute(k, String(v));
		if (text !== undefined) n.textContent = text;
		return n;
	};
	function renderSource(code, line = 0) {
		const lines = code.split("\n");
		$("recorded").replaceChildren(
			...lines.map((text, index) => {
				const row = document.createElement("span");
				row.className = "resolution-source-line";
				row.dataset.line = String(index + 1);
				const number = document.createElement("span");
				number.className = "resolution-line-number";
				number.textContent = String(index + 1);
				number.setAttribute("aria-hidden", "true");
				const content = document.createElement("span");
				content.className = "resolution-line-text";
				content.textContent = text || " ";
				row.append(number, content);
				if (index + 1 === line) {
					row.classList.add("current");
					row.setAttribute("aria-current", "step");
				}
				return row;
			}),
		);
		const current = $("recorded").querySelector(".current");
		if (current) {
			const area = $("recorded");
			if (
				current.offsetTop < area.scrollTop ||
				current.offsetTop + current.offsetHeight >
					area.scrollTop + area.clientHeight
			)
				area.scrollTop = Math.max(0, current.offsetTop - area.clientHeight / 2);
		}
	}

	function render() {
		const tree = $("tree");
		tree.replaceChildren();
		controls();
		if (!recording) return;
		const { nodes, active, solutions } = resolutionTree(recording, position),
			children = new Map();
		for (const n of nodes) {
			if (!children.has(n.parent)) children.set(n.parent, []);
			children.get(n.parent).push(n);
		}
		let leaf = 0,
			maxDepth = 0;
		function place(n, depth) {
			maxDepth = Math.max(depth, maxDepth);
			const descendants = children.get(n.id) || [];
			for (const child of descendants) place(child, depth + 1);
			n.x = descendants.length
				? (descendants[0].x + descendants.at(-1).x) / 2
				: leaf++ * 240 + 120;
			n.y = depth * 110 + 44;
		}
		place(nodes[0], 0);
		tree.setAttribute("width", Math.max(300, leaf * 240));
		tree.setAttribute("height", (maxDepth + 1) * 110);
		for (const n of nodes) {
			if (n.parent !== null) {
				const parent = nodes[n.parent];
				tree.append(
					svg("path", {
						d: `M ${parent.x} ${parent.y + 32} V ${n.y - 44} H ${n.x} V ${n.y - 32}`,
						class: "resolution-edge",
					}),
				);
			}
		}
		for (const n of nodes) {
			const group = svg("g", {
				transform: `translate(${n.x},${n.y})`,
				class: `resolution-node ${n.port}${n.id === active ? " active" : ""}${n.backtracked ? " backtracked" : ""}`,
				tabindex: 0,
				role: "button",
				"aria-label": `${n.port}: ${n.goal}`,
			});
			group.append(svg("title", {}, n.goal));
			group.append(
				svg("rect", { x: -110, y: -32, width: 220, height: 64, rx: 8 }),
			);
			const label = n.goal.length > 52 ? n.goal.slice(0, 49) + "…" : n.goal;
			group.append(
				svg(
					"text",
					{ x: 0, y: -10, "text-anchor": "middle" },
					label.slice(0, 27),
				),
			);
			group.append(
				svg("text", { x: 0, y: 5, "text-anchor": "middle" }, label.slice(27)),
			);
			group.append(
				svg(
					"text",
					{ x: 0, y: 23, "text-anchor": "middle", class: "resolution-port" },
					`${n.port}${n.attempt > 1 ? " · attempt " + n.attempt : ""}${n.line ? " · line " + n.line : ""}`,
				),
			);
			const select = () => goTo(n.step);
			group.addEventListener("click", select);
			group.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					select();
				}
			});
			tree.append(group);
		}
		const scroll = root.querySelector(".resolution-scroll"),
			current = nodes[active];
		if (current) {
			scroll.scrollLeft = Math.max(0, current.x - scroll.clientWidth / 2);
			if (
				current.y < scroll.scrollTop + 40 ||
				current.y > scroll.scrollTop + scroll.clientHeight - 40
			)
				scroll.scrollTop = Math.max(0, current.y - scroll.clientHeight / 2);
		}
		$("solutions").replaceChildren(
			...solutions.map((answer) => {
				const li = document.createElement("li");
				li.textContent = answer;
				return li;
			}),
		);
		const event = recording.events[position];
		$("event").textContent = event
			? `${event.port}: ${event.goal}`
			: "Query: " + recording.query;
		$("event").classList.toggle(
			"resolution-error",
			event?.port.startsWith("exception"),
		);
		renderSource(recording.code, event?.sourceLine ?? event?.line ?? 0);
		$("stdout").textContent =
			position === recording.events.length - 1 ? recording.stdout || "" : "";
		status(
			`${position + 1} / ${recording.events.length} events${recording.limited ? " · Recording limit reached" : ""}`,
		);
	}
	function goTo(index) {
		if (!recording) return;
		position = Math.max(
			-1,
			Math.min(recording.events.length - 1, Math.trunc(index) || 0),
		);
		render();
	}
	function install(data) {
		stop();
		recording = parseResolutionTrace(JSON.stringify(data));
		$("json").textContent = JSON.stringify(recording, null, 2);
		$("source").setValue(recording.code);
		$("query").value = recording.query;
		position = -1;
		render();
	}
	async function loadAttributes() {
		const token = ++request;
		abort?.abort();
		abort = new AbortController();
		stop();
		updateFilename();
		try {
			if (host.trace) {
				const response = await fetch(
					resolveComponentSourceUrl(host, host.trace),
					{ signal: abort.signal },
				);
				if (!response.ok) throw Error("Unable to load trace");
				const data = parseResolutionTrace(await response.text());
				if (token === request) install(data);
			} else {
				const source = await readSource({ signal: abort.signal });
				if (token !== request) return;
				$("source").setValue(source);
				$("query").value = host.query;
				recording = null;
				$("json").textContent = "";
				position = -1;
				$("tree").replaceChildren();
				renderSource(source);
				$("solutions").replaceChildren();
				$("stdout").textContent = "";
				$("event").textContent = "";
				status("Enter a query, then record its resolution.");
				controls();
			}
		} catch (error) {
			if (token === request && error.name !== "AbortError")
				status(error.message, true);
		}
	}
	function record() {
		if (worker) return;
		++request;
		abort?.abort();
		stop();
		const code = $("source").getValue(),
			query = $("query").value.trim();
		if (!query) {
			status("Enter a Prolog query.", true);
			return;
		}
		if (code.length > 100000) {
			status("Source exceeds 100,000 characters.", true);
			return;
		}
		recording = null;
		$("json").textContent = "";
		position = -1;
		$("tree").replaceChildren();
		$("solutions").replaceChildren();
		$("stdout").textContent = "";
		$("event").textContent = "";
		status("Recording with SWI-Prolog…");
		worker = new TraceWorker();
		const current = worker;
		controls();
		timer = setTimeout(() => {
			if (worker === current) {
				stop();
				status("Recording timed out; simplify the query and try again.", true);
			}
		}, 30000);
		worker.onmessage = ({ data }) => {
			if (worker !== current) return;
			if (data.type === "trace") {
				try {
					install(data.result);
				} catch (e) {
					stop();
					status(e.message, true);
				}
			} else {
				stop();
				status(data.message, true);
			}
		};
		worker.onerror = (event) => {
			if (worker === current) {
				stop();
				status(event.message, true);
			}
		};
		worker.postMessage({ code, query });
	}
	function toggleSource() {
		$("source-panel").hidden = !$("source-panel").hidden;
		$("edit").setAttribute("aria-expanded", String(!$("source-panel").hidden));
	}
	async function saveAs() {
		if (!recording) return;
		try {
			const target = await chooseSaveTarget({
				suggestedName: "prolog-trace.json",
				description: "Prolog resolution trace",
				mimeType: "application/json",
				extension: ".json",
			});
			if (target)
				await saveBlob(
					new Blob([JSON.stringify(recording, null, 2)], {
						type: "application/json",
					}),
					target,
				);
		} catch (e) {
			status(e.message, true);
		}
	}
	$("edit").addEventListener("click", toggleSource);
	$("run").addEventListener("click", record);
	function stopRecording() {
		if (!worker) return;
		stop();
		status("Recording stopped.");
	}
	$("stop").addEventListener("click", stopRecording);
	$("save").addEventListener("click", saveAs);
	const loadTrace = () => $("file").click();
	$("load").addEventListener("click", loadTrace);
	$("file").addEventListener("change", async () => {
		const file = $("file").files[0];
		try {
			if (file) {
				++request;
				abort?.abort();
				install(parseResolutionTrace(await file.text()));
			}
		} catch (e) {
			status(e.message, true);
		}
		$("file").value = "";
	});
	const firstStep = () => goTo(-1);
	const previousStep = () => goTo(position - 1);
	const nextStep = () => { if (recording) goTo(position + 1); };
	const lastStep = () => { if (recording) goTo(recording.events.length - 1); };
	const toggleJson = () => {
		const details = root.querySelector(".resolution-json");
		details.open = !details.open;
	};
	for (const [role, action] of Object.entries({first:firstStep, previous:previousStep, next:nextStep, last:lastStep}))
		$(role).addEventListener("click", action);
	$("query").addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			record();
		}
	});
	controls();
	return {
		loadAttributes,
		updateFilename,
		toggleSource,
		record,
		stop: stopRecording,
		saveAs,
		getCode: () => (recording ? JSON.stringify(recording, null, 2) : ""),
		goTo, firstStep, previousStep, nextStep, lastStep, loadTrace, toggleJson,
		destroy() {
			++request;
			abort?.abort();
			stop();
			root.remove();
		},
	};
}
