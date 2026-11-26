import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { compactTraceSteps } from "../src/components/trace/visible-steps.js";
const endpoint = process.env.SAFARI_DRIVER_URL || "http://127.0.0.1:4445";
const base = process.env.BASE_URL || "http://127.0.0.1:4386";
const languages = (
	process.env.TRACERS || "javascript,typescript,python,scheme"
).split(",");
const directory = "/tmp/tp-tracer-safari";
await mkdir(directory, { recursive: true });
const fixtureDirectory = "public/__tracer-verification-safari";
await mkdir(fixtureDirectory, { recursive: true });
for (const language of languages)
	await writeFile(
		`${fixtureDirectory}/${language}.html`,
		`<!doctype html><tp-${language}-tracer></tp-${language}-tracer><script type="module" src="/src/components/${language}-tracer/${language}-tracer.ts"></script>`,
	);
const server = createServer(async (req, res) => {
	try {
		const match = req.url
			.split("?")[0]
			.match(/^\/(javascript|typescript|python|scheme|ocaml)(\.json)?$/);
		if (!match) {
			res.writeHead(404).end();
			return;
		}
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Content-Type", match[2] ? "application/json" : "text/html");
		res.end(
			match[2]
				? await readFile(`${directory}/${match[1]}.json`)
				: `<!doctype html><html><body><tp-${match[1]}-tracer></tp-${match[1]}-tracer><script type="module" src="${base}/src/components/${match[1]}-tracer/${match[1]}-tracer.ts"></script></body></html>`,
		);
	} catch (error) {
		res.writeHead(500).end(String(error));
	}
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const origin = `http://127.0.0.1:${server.address().port}`;
async function command(
	path,
	data,
	method = data === undefined ? "GET" : "POST",
) {
	const response = await fetch(endpoint + path, {
		method,
		headers: { "Content-Type": "application/json" },
		body: data === undefined ? undefined : JSON.stringify(data),
		signal: AbortSignal.timeout(30000),
	});
	const result = await response.json();
	if (!response.ok || result.value?.error) throw Error(JSON.stringify(result));
	return result.value;
}
const session = await command("/session", {
	capabilities: { alwaysMatch: { browserName: "safari" } },
});
const path = `/session/${session.sessionId}`;
const execute = (script, args = []) =>
	command(path + "/execute/sync", { script, args });
async function wait(script, args = [], timeout = 90000) {
	const end = Date.now() + timeout;
	while (Date.now() < end) {
		if (await execute(script, args)) return;
		await new Promise((r) => setTimeout(r, 150));
	}
	throw Error("Timed out: " + script);
}
const report = {
	browser: "Safari",
	navigation:
		process.env.SAFARI_NAVIGATION === "dom"
			? "DOM button click (native pointer not verified)"
			: "native pointer",
	version: session.capabilities.browserVersion,
	date: new Date().toISOString(),
	checks: [],
};
try {
	await command(path + "/window/rect", { width: 1450, height: 1000 });
	for (const language of languages) {
		const code =
			language === "python"
				? 'emoji = "😀"; x = 2\ny = (x + 3) * 4\nprint(y)'
				: language === "ocaml"
					? 'let emoji = "😀";; let x = 2;; let y = (x + 3) * 4;; print_int y;; print_newline ();;'
					: language === "scheme"
						? '(define emoji "😀")\n(define x 2)\n(define y (* (+ x 3) 4))\n(display y) (newline)'
						: `const emoji = "😀"; const x${language === "typescript" ? ": number" : ""} = 2;\nconst y = (x + 3) * 4; console.log(y);`;
		await command(path + "/url", {
			url: base + "/__tracer-verification-safari/" + language + ".html",
		});
		await wait("return !!customElements.get(arguments[0]);", [
			`tp-${language}-tracer`,
		]);
		await execute(
			`window.host=document.querySelector(arguments[0]);window.failures=[];window.addEventListener('error',e=>failures.push(e.message));host.setAttribute('value',arguments[1]);host.refresh().then(()=>host.record()).catch(e=>failures.push(String(e)));`,
			[`tp-${language}-tracer`, code],
		);
		await wait(`return JSON.parse(host.getCode()||'{}').trace?.length>0;`);
		const data = JSON.parse(await execute("return host.getCode();"));
		assert.equal(data.trace.at(-1).stdout, "20\n");
		assert.deepEqual(compactTraceSteps(data.trace), data.trace);
		const sub =
			language === "scheme"
				? "(+ x 3)"
				: language === "ocaml"
					? "(x + 3)"
					: "x + 3";
		assert.ok(
			data.trace.some(
				(s) =>
					s.source_range &&
					code.slice(s.source_range.start, s.source_range.end) === sub,
			),
		);
		async function inspect() {
			return execute(
				`const data=JSON.parse(host.getCode());let count=0;for(const direction of [1,-1]){for(let j=0;j<data.trace.length;j++){const i=direction===1?j:data.trace.length-1-j;host.goTo(i);const s=data.trace[i];if(s.source_range){const expected=data.code.slice(s.source_range.start,s.source_range.end);const actual=[...host.querySelectorAll('[data-role=recorded] mark')].map(n=>n.textContent).join('\\n');if(actual!==expected)throw Error('Highlight mismatch at '+i);count++;}if(host.querySelector('[data-role=stdout]').textContent!==(s.stdout||''))throw Error('Output mismatch at '+i);}}return count;`,
			);
		}
		const highlights = await inspect();
		await writeFile(
			`${directory}/${language}.json`,
			JSON.stringify(data, null, 2),
		);
		await execute(
			`window.workerAttempts=0;window.Worker=class {constructor(){workerAttempts++;throw Error('Replay must not start a Worker');}};host.setAttribute('trace',arguments[0]);host.refresh().then(()=>window.replayed=true).catch(e=>failures.push(String(e)));`,
			[origin + "/" + language + ".json"],
		);
		await wait("return window.replayed;");
		assert.deepEqual(JSON.parse(await execute("return host.getCode();")), data);
		assert.equal(await inspect(), highlights);
		// A legacy/internal recording can contain duplicate snapshots. Loading it
		// must compact them rather than exposing extra empty clicks.
		const duplicates = {
			...data,
			trace: data.trace.flatMap((s) => [s, { ...s }]),
		};
		await writeFile(
			`${directory}/${language}.json`,
			JSON.stringify(duplicates),
		);
		await execute(
			`window.replayed=false;host.setAttribute('trace',arguments[0]);host.refresh().then(()=>window.replayed=true);`,
			[origin + "/" + language + ".json?duplicates=1"],
		);
		await wait("return window.replayed;");
		const compact = JSON.parse(await execute("return host.getCode();"));
		assert.deepEqual(compact.trace, compactTraceSteps(duplicates.trace));
		await inspect();
		await execute(
			`window.clickEvents=[];document.addEventListener('click',e=>clickEvents.push({tag:e.target.tagName,html:e.target.outerHTML.slice(0,400),role:e.target.closest('[data-role]')?.dataset.role,x:e.clientX,y:e.clientY}),true);`,
		);
		for (const role of ["next", "previous"]) {
			for (let j = 1; j < data.trace.length; j++) {
				if (process.env.SAFARI_NAVIGATION === "dom") {
					await execute(
						`host.querySelector('[data-role="'+arguments[0]+'"] button').click();`,
						[role],
					);
				} else {
					const point = await execute(
						`const r=host.querySelector('[data-role="'+arguments[0]+'"] button').getBoundingClientRect();const zoom=outerWidth/innerWidth;return {x:Math.round((r.x+r.width/2)*zoom),y:Math.round((r.y+r.height/2)*zoom)};`,
						[role],
					);
					await command(path + "/actions", {
						actions: [
							{
								type: "pointer",
								id: "mouse",
								parameters: { pointerType: "mouse" },
								actions: [
									{
										type: "pointerMove",
										origin: "viewport",
										...point,
										duration: 0,
									},
									{ type: "pointerDown", button: 0 },
									{ type: "pointerUp", button: 0 },
								],
							},
						],
					});
				}

				const index = role === "next" ? j : data.trace.length - 1 - j;
				const visible = await execute(
					`return {status:host.querySelector('[data-role=status]').textContent,mark:[...host.querySelectorAll('[data-role=recorded] mark')].map(n=>n.textContent).join('\\n')};`,
				);
				if (visible.status !== `Step ${index + 1} / ${data.trace.length}`)
					console.error(
						await execute(
							'return {events:clickEvents,rect:host.querySelector("[data-role=next] button").getBoundingClientRect().toJSON(),dpr:devicePixelRatio,viewport:{w:innerWidth,h:innerHeight},button:host.querySelector("[data-role=next]").outerHTML};',
						),
					);
				assert.equal(
					visible.status,
					`Step ${index + 1} / ${data.trace.length}`,
				);
				const range = data.trace[index].source_range;
				if (range)
					assert.equal(visible.mark, code.slice(range.start, range.end));
			}
		}
		assert.equal(await execute("return workerAttempts;"), 0);
		assert.deepEqual(await execute("return failures;"), []);
		const selected = data.trace.findIndex(
			(s) =>
				s.source_range &&
				code.slice(s.source_range.start, s.source_range.end) === sub,
		);
		await execute("host.goTo(arguments[0]);", [selected]);
		await wait(
			"return host.querySelector('[data-role=recorded] mark')?.textContent===arguments[0];",
			[sub],
		);
		await command(path + "/execute/async", {
			script:
				"const done=arguments[arguments.length-1];requestAnimationFrame(()=>requestAnimationFrame(()=>done(true)));",
			args: [],
		});
		const screenshot = await command(path + "/screenshot");
		await writeFile(
			`${directory}/${language}.png`,
			Buffer.from(screenshot, "base64"),
		);
		report.checks.push({
			language,
			steps: data.trace.length,
			highlightChecks: highlights * 3,
			sourceRange: true,
			navigationButtons: true,
			replayWithoutWorker: true,
			duplicateGrouping: true,
		});
		console.log(language, "passed", data.trace.length, "steps");
	}
	report.passed = true;
} finally {
	await writeFile(`${directory}/report.json`, JSON.stringify(report, null, 2));
	await command(path, undefined, "DELETE");
	server.close();
	await rm(fixtureDirectory, { recursive: true, force: true });
}
console.log(JSON.stringify(report));
