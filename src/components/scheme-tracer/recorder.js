import {compactSchemeSteps, schemeSourceRanges} from "./visible-steps.js";
let lips;

const filename = "tp-scheme-tracer.scm";
// Keep the initial scope explicit: these features can resume or replace evaluation,
// run outside the Worker, or generate source that has no reliable original position.
const unsupported = new Set([
 "call/cc", "call-with-current-continuation", "call-with-values", "values",
 "define-syntax", "syntax-rules", "define-macro", "define-syntax-parameter",
 "dynamic-wind", "call-with-prompt", "reset", "shift", "eval", "load",
 "import", "include", "require", "await", "timer", "wait", "sleep", "begin*",
 "parallel", "thread", "call-with-input-file", "call-with-output-file",
 "open-input-file", "open-output-file", "read", "read-line", "read-char",
 "window", "document", "global", "globalThis", "self", "fetch", "Promise",
 "setTimeout", "setInterval", "new", "new-port", "javascript", "js-eval",
]);

/** LIPS bootstrap is separate so replay never loads the evaluator or standard library. */
export async function initializeSchemeRecorder(url, engine) { lips = engine; await lips.bootstrap(url); }

/** Observe the pinned LIPS evaluator; no user expressions or procedure bodies are rewritten.
 * @param {string} source
 * @param {{maxSteps?:number, query?:string}} options
 */
export async function recordScheme(source, { maxSteps = 12000, query } = {}) {
 const code = query === undefined ? source : source.trimEnd() + "\n\n" + query;
 if (code.length > 20000) throw new Error("Source limit: 20,000 characters.");
 let stdout = "", lastLine = 1, frameSerial = 0, objectSerial = 0, envSerial = 0;
 let ranges = new Map();
 let lastRange;
 const expressionRange = object => object?.__file__ === filename ? ranges.get(`${object.__line__}:${object.__col__}`) : undefined;
 const trace = [], frames = [], identities = new WeakMap(), environments = new WeakMap(), scopes = new WeakMap();
 const limit = new Error(`Trace limit: ${maxSteps.toLocaleString("en-US")} recorded events (before grouping).`);
 let stopped = false, instructions = 0, queryOutputStart;
 const port = new lips.OutputPort(value => {
  stdout += String(value);
  if (stdout.length > 100000) { stopped = true; throw limit; }
 });
 const interpreter = new lips.Interpreter("tp-scheme-tracer", { meta: true, filename, stdout: port, stderr: port });
 const root = interpreter.__env__, repr = interpreter.get("repr");
 const rootDefaults = new Set(Object.keys(root.__env__));
 // Referencing a reader is valid (e.g. a metacircular primitive table).
 // Only its invocation is unsupported, including calls through aliases/apply/map.
 const readerDefaults = new Map();
 const readers = new Set(["read", "read-line", "read-char"]);
 for (const name of readers) {
  const reader = root.get(name, {throwError:false});
  if (typeof reader === "function") { root.set(name, new Proxy(reader, {
   apply() { throw new Error(`${name} is outside synchronous Scheme tracing (line ${lastLine}).`); }
  })); readerDefaults.set(name, root.__env__[name]); }
 }
 const unsupportedValues = new Set([...unsupported].filter(name=>!readers.has(name)).map(name => root.get(name, {throwError:false})).filter(value => value !== undefined));
 const descendant = env => { for (let e = env; e; e = e.__parent__) if (e === root) return true; return false; };
 const envId = env => { if (!environments.has(env)) environments.set(env, ++envSerial); return environments.get(env); };
 const bindings = env => Object.entries(env?.__env__ || {}).filter(([name,value]) =>
  !name.startsWith("**") && !["arguments", "this"].includes(name) && (env !== root || !rootDefaults.has(name)) && (env !== root || !readerDefaults.has(name) || readerDefaults.get(name)!==value));
 const sourceLine = object => object?.__file__ === filename && Number.isInteger(object.__line__) ? object.__line__ + 1 : undefined;
 function snapshot(event, state, extra = {}) {
  if (stopped || trace.length >= maxSteps) { stopped = true; throw limit; }
  const heap = {}, retained = new Set();
  let objects = 0;
  function encode(value) {
   if (value === lips.nil) return ["SCHEME", "()"];
   if (value === undefined) return ["SCHEME", "#void"];
   if (value instanceof lips.LSymbol) return ["SYMBOL", String(value.valueOf())];
   if (value instanceof lips.LString) return value.valueOf();
   if (value instanceof lips.LNumber || value instanceof lips.LCharacter) return ["SCHEME", String(repr(value, true))];
   if (value === null || typeof value === "boolean" || typeof value === "string" || typeof value === "number") return value;
   if (typeof value !== "object" && typeof value !== "function") return ["SCHEME", String(value)];
   if (!identities.has(value)) identities.set(value, ++objectSerial);
   const id = identities.get(value);
   if (heap[id]) return ["REF", id];
   if (++objects > 300) return ["TRUNCATED", "<object limit>"];
   heap[id] = ["OBJECT"];
   if (value instanceof lips.Pair) heap[id] = ["PAIR", ["car", encode(value.car)], ["cdr", encode(value.cdr)]];
   else if (Array.isArray(value)) {
    heap[id] = ["VECTOR", ...value.slice(0, 200).map(encode)];
    if (value.length > 200) heap[id].push(["TRUNCATED", "…"]);
   } else if (typeof value === "function") {
    const env = value._env;
    if (env && descendant(env) && env !== root) retained.add(env);
    heap[id] = ["FUNCTION", String(value.__name__ || value.name || "lambda"), env && descendant(env) ? envId(env) : null];
   } else heap[id] = ["INSTANCE", "Scheme object"];
   return ["REF", id];
  }
  const encodeBindings = entries => Object.fromEntries(entries.map(([key,value]) => [key,encode(value)]));
  const globals = encodeBindings(bindings(root));
  const stack = frames.map((f,index) => {
   let env = index === frames.length - 1 && descendant(state?.env) ? state.env : f.current;
   const chain = [];
   for (let e=env; e && e!==root; e=e.__parent__) { chain.unshift(e); if(e===f.env) break; }
   const locals = new Map(chain.flatMap(bindings));
   if (extra.returnFrame === f) locals.set("return", extra.result);
   const values = encodeBindings([...locals]);
   return { func_name:f.name, frame_id:f.id, continuation_id:f.continuationId, encoded_locals:values, ordered_varnames:Object.keys(values), is_highlighted:index===frames.length-1 };
  });
  if (!frames.length && state?.env !== root && descendant(state?.env)) {
   const entries = new Map();
   const chain = [];
   for (let env=state.env;env && env!==root;env=env.__parent__) chain.unshift(env);
   for (const env of chain) for (const pair of bindings(env)) entries.set(...pair);
   const values=encodeBindings([...entries]);
   stack.push({func_name:"Lexical scope",frame_id:`scope-${envId(state.env)}`,encoded_locals:values,ordered_varnames:Object.keys(values),is_highlighted:true});
  }
  const expressionValue=extra.expression ? {value:encode(extra.result)} : undefined;
  const seen = new Set(frames.map(f=>f.env));
  for (const captured of retained) {
   for(let env=captured;env && env!==root && descendant(env);env=env.__parent__) {
    if(seen.has(env))continue;
    seen.add(env);
    const values=encodeBindings(bindings(env));
    stack.unshift({func_name:`${scopes.get(env)?.__name__ || env.__name__ || "environment"} (captured)`,frame_id:`scope-${envId(env)}`,encoded_locals:values,ordered_varnames:Object.keys(values),is_parent:true,is_zombie:true});
   }
  }
  trace.push({event,line:lastLine,...(lastRange ? {source_range:lastRange} : {}),func_name:frames.at(-1)?.name || "<program>",globals,ordered_globals:Object.keys(globals),stack_to_render:stack,heap,stdout,...(expressionValue?{expression:expressionValue}:{}),...(extra.error?{exception_msg:extra.error}:{})});
 }
 function call(state, fn, expression) {
  if(!fn || !descendant(fn._env))return;
  // A tail call shares the caller's continuation: replace, do not grow, its frame.
  const replaced = frames.at(-1)?.state===state && frames.at(-1)?.cc===state.cc ? frames.pop() : undefined;
  lastRange=expressionRange(expression);
  lastLine=sourceLine(expression)||lastLine;
  const frame={line:lastLine,id:++frameSerial,name:String(fn.__name__ || "lambda"),env:state.env,current:state.env,range:lastRange,cc:state.cc,state};
  frame.continuationId = replaced?.continuationId ?? frame.id;
  frames.push(frame);
  snapshot("call",state);
 }
 const pendingExpressions = new WeakMap();
 // LIPS macro expansion consumes many internal operations per visible user step.
 // Bound both independently; the Worker also enforces its wall-clock deadline.
 function observe(event,state,fn) {
  if(++instructions>20000000) {stopped=true;throw new Error("Internal operation limit: 20,000,000 operations.");}
  if(event==="scope") { if(descendant(fn?._env)) scopes.set(state.env,fn); return; }
  if(event==="start") { call(state,scopes.get(state.env)); return; }
  if(event==="call") { call(state,fn.fn,fn.expression); return; }
  if(event==="continue") {
   const pending=pendingExpressions.get(state)||[];
   while(pending.at(-1)?.cc===state.cc) {
    const expression=pending.pop();
    lastRange=expression.range;lastLine=expression.line;
    snapshot("expression",{...state,env:expression.env},{expression:true,result:state.object});
   }
   const frame=frames.at(-1);
   if(frame?.state===state && frame.cc===state.cc) {
    lastRange=frame.range;
    lastLine=frame.line;
    snapshot("return",state,{returnFrame:frame,result:state.object});
    frames.pop();
   }
   return;
  }
  if(event!=="eval")return;
  const object=state.object, line=sourceLine(object);
  const visibleExpression=line && (object instanceof lips.Pair || (object instanceof lips.LSymbol && state.env===root));
  if(visibleExpression) {lastLine=line;lastRange=expressionRange(object);}
  if(line) {
   const symbol = object instanceof lips.Pair ? object.car : object;
   if(symbol instanceof lips.LSymbol) {
    const name=String(symbol.valueOf());
    const value=state.env.get(symbol,{throwError:false});
    if(unsupportedValues.has(value) || name.includes(".")) throw new Error(`${name} is outside synchronous Scheme tracing (line ${line}).`);
   }
  }
  if(frames.at(-1)?.state===state && descendant(state.env)) frames.at(-1).current=state.env;
  // Observe source expressions, not the stdlib's expansion machinery.
  if(visibleExpression) {
   if(lastRange) {
    let pending=pendingExpressions.get(state);
    if(!pending)pendingExpressions.set(state,pending=[]);
    pending.push({cc:state.cc,range:lastRange,line:lastLine,env:state.env});
   }
   snapshot("step_line",state);
  }
 }

 try {
  ranges = schemeSourceRanges(lips.tokenize(code, true), code);
  // Parse with the interpreter itself, preserving source positions and reader syntax.
  const setupForms=await lips.parse(query === undefined ? code : source.trimEnd(),{env:root,meta:true,filename});
  const queryForms=query === undefined ? [] : await lips.parse("\n".repeat(source.trimEnd().split("\n").length + 1) + query,{env:root,meta:true,filename});
  const forms=[...setupForms,...queryForms];
  lips.setTraceObserver(observe);
  if (!forms.length) snapshot("result", {env:root});
  for(const [index, form] of forms.entries()) {
   if(query!==undefined && index===setupForms.length)queryOutputStart=stdout.length;
   lastLine=sourceLine(form)||lastLine;
   lastRange=expressionRange(form);
   const results=await interpreter.exec([form]);
   const value=results.at(-1);
   if(value!==undefined && (query === undefined || index >= setupForms.length)) stdout+=String(repr(value,true))+"\n";
   lastLine=sourceLine(form)||lastLine;
   lastRange=expressionRange(form);
   snapshot("result",{env:root});
  }
 } catch(error) {
  lips.setTraceObserver(undefined);
  if(error===limit || stopped) {
   trace.push({...trace.at(-1),event:"instruction_limit_reached",line:lastLine,globals:trace.at(-1)?.globals||{},heap:trace.at(-1)?.heap||{},stdout,exception_msg:error.message});
  } else {
   if (!frames.length) lastLine=sourceLine(error)||lastLine;
   snapshot("exception",{env:frames.at(-1)?.current||root},{error:String(error.message||error).replace(/ at line \d+ and column \d+ in tp-scheme-tracer\.scm$/, "")});
  }
 } finally {lips.setTraceObserver(undefined);}
 return {version:1,language:"scheme",code,...(queryOutputStart!==undefined?{setup_stdout:stdout.slice(0,queryOutputStart),query_stdout:stdout.slice(queryOutputStart)}:{}),trace:compactSchemeSteps(trace)};
}
