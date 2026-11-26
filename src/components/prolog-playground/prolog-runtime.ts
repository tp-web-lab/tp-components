import { toolLoadedScript } from "@tp/tp-utilities";

/** Engine version verified from current_prolog_flag(version_data) in the pinned distribution. */
export const SWIPL_VERSION = "10.1.21";

/** Version of the pinned npm WASM distribution. */
export const SWIPL_WASM_VERSION = "8.3.1";

/** Pinned official SWI-Prolog distribution, loaded only when code is run. */
export const SWIPL_BASE_URL = `https://cdn.jsdelivr.net/npm/swipl-wasm@${SWIPL_WASM_VERSION}/dist/swipl/`;

/** Shared engine information, available without loading the WASM runtime. */
export function createSwiplInformation(): HTMLParagraphElement {
	const info = document.createElement("p");
	info.setAttribute("data-tp-prolog-engine", "");
	const engine = document.createElement("a");
	engine.href = "https://www.swi-prolog.org/pldoc/refman/";
	engine.textContent = `SWI-Prolog ${SWIPL_VERSION}`;
	const wasm = document.createElement("a");
	wasm.href = "https://github.com/SWI-Prolog/npm-swipl-wasm";
	wasm.textContent = `swipl-wasm ${SWIPL_WASM_VERSION}`;
	for (const link of [engine, wasm]) {
		link.target = "_blank";
		link.rel = "noopener noreferrer";
	}
	info.append("Engine: ", engine, " · WASM: ", wasm);
	return info;
}

/** Serialize source data without allowing it to terminate an inline script. */
export function serializePrologData(value: unknown): string {
	return JSON.stringify(value).replaceAll("<", "\\u003c");
}

/** Shared answer formatter, including residual constraints. */
export const resultFormatter = String.raw`
:- module(tp_runtime, [run/2]).
run(Source, Text) :-
    read_term_from_atom(Source, Goal, [variable_names(Names), module(user)]),
    user:expand_goal(Goal, Expanded),
    call_residue_vars(user:Expanded, Residue),
    copy_term(Names-Residue, Copies-_, Constraints),
    findall(Part, (member(Name=Value, Copies),
                  \+ sub_atom(Name, 0, 1, _, '_'),
                  format(atom(Part), '~w = ~W', [Name,Value,[quoted(true),variable_names(Copies)]])), Parts),
    findall(Part, (member(Constraint, Constraints),
                  format(atom(Part), '~W', [Constraint,[quoted(true),variable_names(Copies)]])), Goals),
    append(Parts, Goals, All),
    ( All = [] -> Text = 'true.' ; atomic_list_concat(All, ', ', Text) ).
`;

/** Runtime shared by viewers, playgrounds, notebooks and question tests. */
export function createSwiplRuntimeScript(): string {
	return `
 async function loadSwipl(sources, onOutput, mirrorOutput = true) {
   const base = ${JSON.stringify(SWIPL_BASE_URL)};
   await new Promise((resolve, reject) => {
     const script = document.createElement('script');
     script.src = base + 'swipl-web.js';
     script.onload = resolve;
     script.onerror = () => reject(new Error('Unable to load SWI-Prolog WASM.'));
     document.head.append(script);
   });
   const module = await window.SWIPL({
     arguments: ['-q'],
     locateFile: file => base + file,
     on_output: text => {
       onOutput(text);
       if(mirrorOutput && !window.__tpInlineConsole) console.log(text);
       window.tpPlaygroundReportHeight?.();
     }
   });
   const prolog = module.prolog;
   // Mount every source before consultation so use_module/include resolve locally.
   for (const source of sources) {
     const path = source.path.startsWith('/') ? source.path : '/' + source.path;
     const directory = path.slice(0, path.lastIndexOf('/'));
     if (directory) module.FS.mkdirTree(directory);
     module.FS.writeFile(path, source.content);
   }
   for (const source of sources) {
     await prolog.forEach('load_files(File, [if(not_loaded)])', {File:source.path});
   }
   await prolog.load_string(${serializePrologData(resultFormatter)}, '/tp-runtime.pl');
   ${toolLoadedScript("swipl", "SWI-Prolog WASM")}
   return module;
 }
 function prologErrorMessage(error) {
   return error?.message ?? error?.toString?.() ?? String(error);
 }
 ${querySplitter}
 `;
}

// A full stop terminates a query only outside quotes/comments and before whitespace
// or EOF. This preserves decimals, the CLP(FD) .. operator and JavaScript access.
const querySplitter = String.raw`
 function splitPrologQueries(source) {
   const queries = [];
   let current = '', quote = null, escaped = false, comment = null, depth = 0;
   for (let index = 0; index < source.length; index++) {
     const char = source[index], next = source[index + 1];
     if (comment === 'line') { if (char === '\n') { comment = null; current += '\n'; } continue; }
     if (comment === 'block') { if (char === '*' && next === '/') { comment = null; index++; current += ' '; } continue; }
     if (quote) {
       current += char;
       if (escaped) escaped = false;
       else if (char === '\\') escaped = true;
       else if (char === quote) {
         if (next === quote) { current += next; index++; } else quote = null;
       }
       continue;
     }
     if (char === '%') { comment = 'line'; continue; }
     if (char === '/' && next === '*') { comment = 'block'; index++; continue; }
     if (char === '"' || char === "'" || char === '\x60') quote = char;
     if ('([{'.includes(char)) depth++;
     if (')]}'.includes(char)) depth--;
     current += char;
     if (char === '.' && depth === 0 && (!next || /\s/.test(next) || next === '%')) {
       if (current.trim()) queries.push(current.trim());
       current = '';
     }
   }
   if (current.trim()) queries.push(current.trim());
   return queries;
 }
`;
