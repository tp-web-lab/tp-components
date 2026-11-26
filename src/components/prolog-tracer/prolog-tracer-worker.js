import recorder from "./recorder.pl?raw";
import { SWIPL_BASE_URL } from "../prolog-playground/prolog-runtime.js";
self.onmessage = async ({ data }) => {
	try {
		const response = await fetch(SWIPL_BASE_URL + "swipl-web.js");
		if (!response.ok) throw Error("Unable to load SWI-Prolog");
		const factory = new Function((await response.text()) + "\nreturn SWIPL;")();
		let stdout = "";
		const engine = await factory({
			arguments: ["-q"],
			locateFile: (file) => SWIPL_BASE_URL + file,
			on_output: (text) => {
				stdout += text + "\n";
			},
		});
		await engine.prolog.load_string(data.code, "/program.pl");
		if (/ERROR:/.test(stdout)) throw Error(stdout.trim());
		await engine.prolog.load_string(recorder, "/recorder.pl");
		await engine.prolog.forEach("tp_resolution:prepare(Source)", {
			Source: data.code,
		});
		let results;
		try {
			results = await engine.prolog.forEach("tp_resolution:run(Query, Json)", {
				Query: data.query,
			});
		} catch (error) {
			results = await engine.prolog.forEach(
				"nb_current(tp_resolution_limited, true), tp_resolution:export(Json)",
			);
			if (!results.length) throw error;
		}
		if (!results.length) throw Error("SWI-Prolog did not return a recording.");

		const result = JSON.parse(results[0].Json);
		self.postMessage({
			type: "trace",
			result: {
				version: 1,
				language: "prolog",
				code: data.code,
				query: data.query,
				events: result.events,
				limited: result.limited,
				stdout,
			},
		});
	} catch (error) {
		self.postMessage({ type: "error", message: String(error) });
	}
};
