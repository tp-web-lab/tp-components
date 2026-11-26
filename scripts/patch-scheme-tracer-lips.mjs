/** Reproduce or verify the observation-only patch of pinned LIPS 1.0.0-beta.23.1. */
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
const target=fileURLToPath(new URL("../src/components/scheme-tracer/vendor/lips.js",import.meta.url));
const upstreamHash="f3c88fb5202a6c1461812f2cf3a24306f1ed7f0e1de861843cef885d3e8ecab2";
const pairs=[["    this._stack_set = null;\n  }\n  cont() {", "    this._stack_set = null;\n    tpObserve(\"start\", this);\n  }\n  cont() {\n    tpObserve(\"continue\", this);"], ["function* evaluate_code(state) {\n  var code = state.object;", "function* evaluate_code(state) {\n  tpObserve(\"eval\", state);\n  var code = state.object;"], ["  state.object = body;\n  state.ready = false;\n}\n\n// -------------------------------------------------------------------------\nfunction next_pair", "  state.object = body;\n  state.ready = false;\n  tpObserve(\"call\", state, { fn, expression: cc.__code__ });\n}\n\n// -------------------------------------------------------------------------\nfunction next_pair"], ["  return {\n    env,\n    cc,\n    dynamic_env,\n    use_dynamic,\n    error\n  };\n}", "  tpObserve(\"scope\", { env }, fn);\n  return {\n    env,\n    cc,\n    dynamic_env,\n    use_dynamic,\n    error\n  };\n}"]];
const suffix="\n// TP: optional read-only observation of the existing evaluator.\nlet tpObserver;\nexport function setTraceObserver(observer) { tpObserver = observer; }\nfunction tpObserve(event, state, extra) { if (tpObserver) tpObserver(event, state, extra); }\n";

const hash=text=>createHash("sha256").update(text).digest("hex");
if(process.argv[2] && process.argv[2]!=="--check") {
 let text=readFileSync(process.argv[2],"utf8");
 if(hash(text)!==upstreamHash)throw Error("Unexpected LIPS source version or checksum");
 for(const [from,to] of pairs){if(text.split(from).length!==2)throw Error("Ambiguous hook location");text=text.replace(from,to);}
 writeFileSync(target,text+suffix);
} else {
 let text=readFileSync(target,"utf8");
 if(!text.endsWith(suffix))throw Error("Missing observer export");
 text=text.slice(0,-suffix.length);
 for(const [from,to] of pairs){if(text.split(to).length!==2)throw Error("Missing or repeated observation hook");text=text.replace(to,from);}
 if(hash(text)!==upstreamHash)throw Error("Unexpected changes outside the LIPS observation hooks");
 console.log("Pinned LIPS source verified: only the evaluator observation hooks differ.");
}
