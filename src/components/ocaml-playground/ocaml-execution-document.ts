import {
	createOCamlSession,
	OCAML_RUNTIME_URL,
} from "../ocaml/ocaml-runtime.js";
import type { TpExecutionDocument } from "../playground/playground.js";
import {
	createCommonRuntimeScript,
	createConsoleBridgeScript,
	findProjectFile,
	resolveEntryFile,
} from "../playground/playground-build-utils.js";
import type { TpProject } from "../playground/project.js";
import {
	createTestReporter,
	testResultsHead,
} from "../playground/test-results.js";

/** Formats toplevel outcomes only; stdout and runtime errors use separate channels.
 * Self-contained because it is embedded in the execution document.
 */
export function formatOCamlResults(transcript: string): string {
	return transcript
		.split(
			/^(?=- :|val |type |module |exception |class |File |Line |Warning |Alert |Error:)/m,
		)
		.map((block) => {
			if (/^(?:val |type |module |exception |class )/.test(block)) return "";
			return block.replace(/^- :[\s\S]*? = /, "").trimEnd();
		})
		.filter((block) => block.trim() !== "")
		.join("\n");
}

/** Builds runnable OCaml, sharing a queued session only when a notebook scope is supplied. */
export async function buildOCamlExecutionDocument(
	project: TpProject,
	scope = "",
	tests = false,
	resultsOnly = false,
): Promise<TpExecutionDocument> {
	const entry = resolveEntryFile(project, {
		entry: project.entry,
		priorityPaths: ["/main.ml"],
		extensions: [".ml"],
		fallbackToFirstFile: false,
	});
	if (!entry) throw new Error("No OCaml entry file found.");
	const test = tests
		? findProjectFile(project, project.test ?? "/main.test.ml")
		: undefined;
	if (tests && !test) throw new Error("No OCaml test file found.");
	const files = Object.fromEntries(
		project.files
			.filter((f) => /\.(ml)$/i.test(f.path))
			.map((f) => [f.path, f.content]),
	);
	const json = (value: unknown) =>
		JSON.stringify(value).replaceAll("<", "\\u003c");
	const body = findProjectFile(project, "/index.html")?.content ?? "";
	return {
		html: `<!doctype html><html><head><meta charset="utf-8">${tests ? testResultsHead() : ""}</head><body>
${body}
<pre data-ocaml-output></pre>
${createCommonRuntimeScript()}${createConsoleBridgeScript()}
<script type="module">
const createSession=${createOCamlSession.toString()};
const formatResults=${formatOCamlResults.toString()};
const owner=window.parent!==window?window.parent:window;
const scope=${json(tests ? "" : scope)};
const sessions=owner.__tpOCamlSessions??=new Map();
const key=scope||Symbol();
let state=sessions.get(key);
if(!state){
 state={session:null,queue:Promise.resolve(),disposed:false};sessions.set(key,state);
 if(scope){const observer=new MutationObserver(()=>{
  if(!owner.document.querySelector('[execution-scope="'+CSS.escape(scope)+'"]')){
   state.disposed=true;observer.disconnect();sessions.delete(key);void state.queue.finally(()=>state.session?.dispose());
  }
 });observer.observe(owner.document.documentElement,{childList:true,subtree:true});}
}
const run=async()=>{
 if(!document.body.isConnected||state.disposed)return;
 const output=document.querySelector('[data-ocaml-output]');
 let pending='';
 const write=text=>{output.append(document.createTextNode(text));pending+=text;let end;while((end=pending.indexOf('\\n'))>=0){if(!window.__tpInlineConsole)console.log(pending.slice(0,end));pending=pending.slice(end+1);}};
 state.session??=await createSession(scope?owner.document.body:document.body,write,${json(tests ? new URL("toplevel-tests.js", OCAML_RUNTIME_URL).href : OCAML_RUNTIME_URL)});
 const session=state.session;session.bind(window,write);
 const files=${json(files)};
 for(const [path,source] of Object.entries(files)) session.file(path,source);
 const reporter=${tests ? `(${createTestReporter.toString()})(document.body, 'Alcotest')` : "null"};
 reporter?.attachLog(output);
 session.set('tpAlcotestResult',(suite,name,status,details)=>{reporter?.add({suite:String(suite),name:String(name),status,details:String(details)});});
 session.set('tpOcamlCheck',(label,passed)=>{reporter?.add({suite:'Legacy assertions',name:String(label),status:passed?'passed':'failed'});if(passed){console.info('✓ '+String(label));}else{console.error('✗ '+String(label));}});
 try {
  ${tests ? `await session.execute(${json('module Alcotest = Tp_alcotest;; let test_assert label passed = ignore (Js_of_ocaml.Js.Unsafe.fun_call (Js_of_ocaml.Js.Unsafe.get Js_of_ocaml.Js.Unsafe.global "tpOcamlCheck") [| Js_of_ocaml.Js.Unsafe.inject (Js_of_ocaml.Js.string label); Js_of_ocaml.Js.Unsafe.inject (Js_of_ocaml.Js.bool passed) |]);; let test_equal label expected actual = test_assert label (expected = actual);;')});` : ""}
  const result=await session.execute(${json(entry.content)});
  ${tests ? `await session.execute(${json(test?.content)});reporter.finish();output.setAttribute('data-ocaml-test-status',reporter.results.some(r=>r.status==='failed')?'failed':'passed');` : `const visibleResult=${resultsOnly ? "formatResults(result)" : "result"};if(visibleResult){write(visibleResult+'\\n');}`}
 } catch(error) {reporter?.error(error);throw error;} finally {if(pending&&!window.__tpInlineConsole)console.log(pending);}
};
state.queue=state.queue.then(run,run).catch(error=>{if(!window.__tpInlineConsole)console.error(String(error));const output=document.querySelector('[data-ocaml-output]');output?.append(document.createTextNode(String(error)));});
window.addEventListener('pagehide',()=>{if(!scope){state.session?.dispose();sessions.delete(key);}});
</script></body></html>`,
	};
}
