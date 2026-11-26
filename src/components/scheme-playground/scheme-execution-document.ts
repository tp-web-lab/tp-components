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
import { createSchemeSession } from "../scheme/scheme-runtime.js";

/** Builds runnable Scheme, sharing a queued session only when a notebook scope is supplied. */
export async function buildSchemeExecutionDocument(
	project: TpProject,
	scope = "",
	tests = false,
): Promise<TpExecutionDocument> {
	const schemeTestRuntime = tests
		? (await import("./scheme-test-runtime.js")).schemeTestRuntime
		: "";
	const entry = resolveEntryFile(project, {
		entry: project.entry,
		priorityPaths: ["/main.scm"],
		extensions: [".scm", ".ss", ".sld"],
		fallbackToFirstFile: false,
	});
	if (!entry) throw new Error("No Scheme entry file found.");
	const test = tests
		? findProjectFile(project, project.test ?? "/main.test.scm")
		: undefined;
	if (tests && !test) throw new Error("No Scheme test file found.");
	const files = Object.fromEntries(
		project.files
			.filter((f) => /\.(scm|ss|sld)$/i.test(f.path))
			.map((f) => [f.path, f.content]),
	);
	const json = (value: unknown) =>
		JSON.stringify(value).replaceAll("<", "\\u003c");
	const body = findProjectFile(project, "/index.html")?.content ?? "";
	return {
		html: `<!doctype html><html><head><meta charset="utf-8">${tests ? testResultsHead() : ""}</head><body>
${body}
<pre data-scheme-output></pre>
${createCommonRuntimeScript()}${createConsoleBridgeScript()}
<script type="module">
const createSession=${createSchemeSession.toString()};
const owner=window.parent!==window?window.parent:window;
const scope=${json(tests ? "" : scope)};
const sessions=owner.__tpSchemeSessions??=new Map();
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
 const output=document.querySelector('[data-scheme-output]');
 let pending='';
 const write=text=>{output.append(document.createTextNode(text));pending+=text;let end;while((end=pending.indexOf('\\n'))>=0){if(!window.__tpInlineConsole)console.log(pending.slice(0,end));pending=pending.slice(end+1);}};
 state.session??=await createSession(scope?owner.document.body:document.body,write);
 const session=state.session;session.bind(window,write);
 const files=${json(files)};
  session.set('load-project',async path=>{
  const name=String(path);const source=files[name.startsWith('/')?name:'/'+name];
  if(source===undefined)throw new Error('Unknown Scheme project file: '+name);
  await session.load(source);
 });
 const reporter=${tests ? `(${createTestReporter.toString()})(document.body, 'SRFI-64')` : "null"};
 reporter?.attachLog(output);
 session.set('tp-test-result',(suite,name,kind,details)=>{const status=({pass:'passed',fail:'failed',skip:'skipped',xfail:'expected-failure',xpass:'failed'})[String(kind)]??'failed';reporter?.add({suite:String(suite),name:String(name),status,details:status==='passed'?'':String(details)});const message=(status==='passed'?'✓ ':status==='failed'?'✗ ':'– ')+String(name)+' ['+status+']';(status==='failed'?console.error:console.info)(message);if(status==='failed'&&details)console.error(String(details));});
 try {
  ${tests ? `await session.execute(${json(schemeTestRuntime)});session.isolateProgram();` : ""}
  const result=await session.execute(${json(entry.content)});
  ${tests ? "session.set('tp-test-program-output',(output.textContent+((result==='#void'||result==='undefined')?'':result)).trim());" : ""}
  ${tests ? `await session.execute(${json(test?.content)});reporter.finish();output.setAttribute('data-scheme-test-status',reporter.results.some(r=>r.status==='failed')?'failed':'passed');` : `if(result!=='#void' && result!=='undefined'){write(result+'\\n');}`}
 } catch(error) {reporter?.error(error);throw error;} finally {if(pending&&!window.__tpInlineConsole)console.log(pending);}
};
state.queue=state.queue.then(run,run).catch(error=>{if(!window.__tpInlineConsole)console.error(String(error));const output=document.querySelector('[data-scheme-output]');output?.append(document.createTextNode(String(error)));});
window.addEventListener('pagehide',()=>{if(!scope){state.session?.dispose();sessions.delete(key);}});
</script></body></html>`,
	};
}
