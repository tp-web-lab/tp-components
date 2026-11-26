import { toolLoadedScript } from "@tp/tp-utilities";
import type { TpExecutionDocument } from "../playground/playground.js";
import {
	createCommonRuntimeScript,
	createConsoleBridgeScript,
	findProjectFile,
	resolveEntryFile,
} from "../playground/playground-build-utils.js";
import {
	createTestReporter,
	testResultsHead,
} from "../playground/test-results.js";
import { createSqlStorageKey } from "./sql-execution-document.js";
import type { TpSqlProject } from "./sql-project.js";
import { compareSqlResults, runSqlTests } from "./sql-test-runner.js";

/** Builds an isolated SQLite test document from declarative query expectations. */
export async function buildSqlTestDocument(
	project: TpSqlProject,
): Promise<TpExecutionDocument> {
	const test = project.test
		? findProjectFile(project, project.test)
		: resolveEntryFile(project, {
				priorityPaths: ["/query.test.json", "/main.test.json"],
				extensions: [".test.json", ".tests.json", ".spec.json"],
				ignoreProjectEntry: true,
				fallbackToFirstFile: false,
			});
	if (!test) throw new Error("No SQL test JSON file found.");
	const active = project.getActiveDatabase();
	const setup =
		active?.type === "sqlite"
			? undefined
			: active?.type === "sql"
				? active.path
				: (project.setup ??
					findProjectFile(project, "/tables.sql")?.path ??
					findProjectFile(project, "/setup.sql")?.path);
	const entry = resolveEntryFile(project, {
		entry: project.entry,
		priorityPaths: ["/query.sql", "/main.sql"],
		extensions: [".sql"],
		fallbackToFirstFile: false,
	})?.path;
	const config = {
		source: test.content,
		files: Object.fromEntries(
			project.files.map((file) => [file.path, file.content]),
		),
		setup,
		entry,
	};
	const json = (value: unknown) =>
		JSON.stringify(value).replaceAll("<", "\\u003c");
	return {
		html: `<!doctype html><html><head>${testResultsHead()}</head><body>
${createCommonRuntimeScript()}${createConsoleBridgeScript()}
<script type="module">
const reporter=(${createTestReporter.toString()})(document.body,'SQLite');
const output=document.createElement('pre');reporter.attachLog(output);
const log=text=>{output.append(document.createTextNode(text+'\\n'));};
try {
 const config=${json(config)};
 if(${active?.type === "sqlite"}) {
  const key=${json(active?.storageKey ?? createSqlStorageKey(project))};
  const saved=localStorage.getItem(key);
  if(!saved)throw new Error('SQLite database not found in localStorage: '+key);
  config.storedDatabase=saved;
 }
 await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/sql-wasm.js';script.crossOrigin='anonymous';script.onload=resolve;script.onerror=()=>reject(new Error('Unable to load sql.js.'));document.head.append(script);});
 const SQL=await window.initSqlJs({locateFile:file=>'https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/'+file});
 ${toolLoadedScript("sqljs", "sql.js", JSON.stringify("1.13.0"))}
 (${runSqlTests.toString()})(SQL,config,reporter,${compareSqlResults.toString()},log);
} catch(error) {reporter.error(error);log(String(error));console.error(error);}
</script></body></html>`,
	};
}
