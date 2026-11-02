import{o as e}from"./rolldown-runtime.js";import{t}from"./tool-loading.js";import{resolveSpecifier as n}from"../utilities/importmap/importmap-resolver.js";(function(e){return e[e.Static=1]=`Static`,e[e.Dynamic=2]=`Dynamic`,e[e.ImportMeta=3]=`ImportMeta`,e[e.StaticSourcePhase=4]=`StaticSourcePhase`,e[e.DynamicSourcePhase=5]=`DynamicSourcePhase`,e[e.StaticDeferPhase=6]=`StaticDeferPhase`,e[e.DynamicDeferPhase=7]=`DynamicDeferPhase`,e})({});var r=new Uint8Array(new Uint16Array([1]).buffer)[0]===1;function i(e,t=`@`){if(!s)return c.then(()=>i(e));let n=e.length+1,l=(s.__heap_base.value||s.__heap_base)+4*n-s.memory.buffer.byteLength;l>0&&s.memory.grow(Math.ceil(l/65536));let u=s.sa(n-1);if(typeof Buffer<`u`?Buffer.from(s.memory.buffer,u,2*(n-1)).write(e,`utf16le`):(r?o:a)(e,new Uint16Array(s.memory.buffer,u,n)),!s.parse())throw Object.assign(Error(`Parse error ${t}:${e.slice(0,s.e()).split(`
`).length}:${s.e()-e.lastIndexOf(`
`,s.e()-1)}`),{idx:s.e()});let d=[],f=[];for(;s.ri();){let t=s.is(),n=s.ie(),r=s.it(),i=s.ai(),a=s.id(),o=s.ss(),c=s.se(),l;s.ip()&&(l=p(e.slice(a===-1?t-1:t,a===-1?n+1:n)));let u=null;for(u=[],s.rsa();s.ra();){let t=s.aks(),n=s.ake(),r=s.avs(),i=s.ave();u.push([m(e.slice(t,n)),m(e.slice(r,i))])}u.length===0&&(u=null),d.push({n:l,t:r,s:t,e:n,ss:o,se:c,d:a,a:i,at:u})}for(;s.re();){let t=s.es(),n=s.ee(),r=s.els(),i=s.ele(),a=r<0?void 0:m(e.slice(r,i)),o=m(e.slice(t,n));f.push({s:t,e:n,ls:r,le:i,ss:s.ess(),n:o,ln:a})}function p(e){try{return(0,eval)(e)}catch{}}function m(e){if(!e)return e;let t=e[0];return(t===`"`||t===`'`)&&p(e)||e}return[d,f,!!s.f(),!!s.ms()]}function a(e,t){let n=e.length,r=0;for(;r<n;){let n=e.charCodeAt(r);t[r++]=(255&n)<<8|n>>>8}}function o(e,t){let n=e.length,r=0;for(;r<n;)t[r]=e.charCodeAt(r++)}var s,c=WebAssembly.compile((()=>{return e=`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`,typeof Buffer<`u`?Buffer.from(e,`base64`):Uint8Array.from(atob(e),e=>e.charCodeAt(0));var e})()).then(WebAssembly.instantiate).then(({exports:e})=>{s=e}),l=`?tp-css-module`;function u(e){return e.startsWith(`http://`)||e.startsWith(`https://`)||e.startsWith(`data:`)||e.startsWith(`blob:`)||e.startsWith(`npm:`)||e.startsWith(`#`)}function d(e,t){if(t.startsWith(`/`))return t;let n=e.split(`/`).filter(Boolean);n.pop();let r=t.split(`/`).filter(Boolean),i=[...n];for(let e of r)if(e!==`.`){if(e===`..`){i.pop();continue}i.push(e)}return`/${i.join(`/`)}`}function f(e){return e.replace(/import\s+([A-Za-z_$][\w$]*)\s+from\s+(['"])((?:\.{1,2}\/|\/)[^'"]+\.css)\2\s+(?:with|assert)\s*\{\s*type\s*:\s*(['"])css\4\s*\}\s*;?/g,(e,t,n,r)=>`import ${t} from ${n}${r}${l}${n};`)}function p(e){let t=e.indexOf(`?`);return t<0?{pathname:e,query:``}:{pathname:e.slice(0,t),query:e.slice(t)}}function m(e){return`const sheet = new CSSStyleSheet();
sheet.replaceSync(${v(e)});
export default sheet;
`}async function h(e){await c;let[t]=i(e),n=[];for(let r of t)r.n!==void 0&&n.push({start:r.s,end:r.e,specifier:e.slice(r.s,r.e),isDynamic:r.d>-1});return n}async function g(e,t,r,i){let a=f(e),o=await h(a);if(o.length===0)return a;let s=``,c=0;for(let e of o){s+=a.slice(c,e.start);let o=e.specifier;if(u(o)){s+=o,c=e.end;continue}if(!(o.startsWith(`./`)||o.startsWith(`../`)||o.startsWith(`/`))){let r=n(o,i);console.log(`rewrite import`,{fromPath:t,rawSpecifier:o,resolvedSpecifier:r}),s+=r??o,c=e.end;continue}let l=await r(d(t,o));s+=l,c=e.end}return s+=a.slice(c),s}function _(e){let t=document.createElement(`textarea`);return t.innerHTML=e,t.value}function v(e){return JSON.stringify(e)}function y(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`)}function b(e){return e.split(`/`).filter(Boolean).at(-1)??e}function x(e,t){return t.some(t=>e.endsWith(t))}function S(e){let t=e.path;return t.endsWith(`.html`)||t.endsWith(`.htm`)?`text/html`:t.endsWith(`.css`)?`text/css`:t.endsWith(`.js`)||t.endsWith(`.mjs`)||t.endsWith(`.cjs`)?`text/javascript`:t.endsWith(`.json`)?`application/json`:t.endsWith(`.svg`)?`image/svg+xml`:`text/plain`}function C(e){return e.path.endsWith(`.js`)||e.path.endsWith(`.mjs`)||e.path.endsWith(`.cjs`)}function w(e){let t=new Map;for(let n of e){if(C(n))continue;let e=new Blob([n.content],{type:S(n)});t.set(n.path,URL.createObjectURL(e))}return t}async function T(e,t,n){let r=new Map(e.map(e=>[e.path,e])),i=new Map,a=new Map,o=async e=>{let s=i.get(e);if(s!==void 0)return s;let c=a.get(e);if(c!==void 0)return c;let u=(async()=>{let a=r.get(e);if(a===void 0)throw Error(`Module not found: ${e}`);let s=await g(a.content,a.path,async e=>{let{pathname:n,query:a}=p(e);if(a===l){let t=i.get(e);if(t!==void 0)return t;let a=r.get(n);if(a===void 0)throw Error(`CSS module not found: ${n}`);let o=new Blob([m(a.content)],{type:`text/javascript`}),s=URL.createObjectURL(o);return i.set(e,s),s}let s=t.get(n);if(s!==void 0)return s;let c=r.get(n);if(c===void 0)throw Error(`Dependency not found: ${n}`);if(C(c))return o(n);let u=new Blob([c.content],{type:S(c)});return URL.createObjectURL(u)},n),c=new Blob([s],{type:`text/javascript`}),u=URL.createObjectURL(c);return i.set(e,u),u})();a.set(e,u);try{return await u}finally{a.delete(e)}};for(let t of e)C(t)&&await o(t.path);return i}function E(e){return e.path.endsWith(`.ts`)||e.path.endsWith(`.tsx`)}function D(e){return e.replace(/\.tsx?$/,`.js`)}async function O(n){let{default:r}=await import(`./typescript.js`).then(t=>e(t.default,1));return t(`typescript`,`TypeScript`,r.version),r.transpileModule(n,{compilerOptions:{target:r.ScriptTarget.ES2022,module:r.ModuleKind.ESNext,jsx:r.JsxEmit.ReactJSX,useDefineForClassFields:!1}}).outputText}function k(e,t){let n=t.get(e);if(n!==void 0)return n;if(e.endsWith(`.js`))return t.get(e.replace(/\.js$/,`.ts`))??t.get(e.replace(/\.js$/,`.tsx`))}async function A(e,t,n){let r=new Map(e.map(e=>[e.path,e])),i=new Map,a=new Map,o=async e=>{let s=i.get(e);if(s!==void 0)return s;let c=a.get(e);if(c!==void 0)return c;let l=(async()=>{let a=r.get(e);if(a===void 0)throw Error(`Module not found: ${e}`);let s=await g(E(a)?await O(a.content):a.content,D(a.path),async e=>{let n=k(e,r);if(n&&(E(n)||C(n)))return o(n.path);let i=t.get(e);if(i!==void 0)return i;if(n===void 0)throw Error(`Dependency not found: ${e}`);return o(n.path)},n),c=URL.createObjectURL(new Blob([s],{type:`text/javascript`}));return i.set(e,c),c})();a.set(e,l);try{return await l}finally{a.delete(e)}};for(let t of e)(E(t)||t.path.endsWith(`.js`)||t.path.endsWith(`.mjs`)||t.path.endsWith(`.cjs`))&&await o(t.path);return i}function j(e){return x(e,[`.ts`,`.tsx`])?`typescript`:x(e,[`.js`,`.mjs`,`.cjs`])?`javascript`:x(e,[`.py`])?`python`:x(e,[`.pl`])?`prolog`:x(e,[`.html`,`.htm`])?`html`:x(e,[`.css`])?`css`:x(e,[`.json`])?`json`:x(e,[`.md`])?`markdown`:`text`}function M(e,t){return e.files.find(e=>e.path===t)}function N(e,t){for(let n of t){let t=M(e,n);if(t!==void 0)return t}}function P(e,t){return e.files.find(e=>x(e.path,t))}function F(e,t){let n=typeof t.entry==`string`&&t.entry!==``?M(e,t.entry):void 0;if(n!==void 0)return n;let r=t.ignoreProjectEntry!==!0&&typeof e.entry==`string`&&e.entry!==``?M(e,e.entry):void 0;if(r!==void 0)return r;let i=Array.isArray(t.priorityPaths)&&t.priorityPaths.length>0?N(e,t.priorityPaths):void 0;if(i!==void 0)return i;let a=Array.isArray(t.extensions)&&t.extensions.length>0?P(e,t.extensions):void 0;if(a!==void 0)return a;if(t.fallbackToFirstFile)return e.files.at(0)}function I(e,t){let n=F(e,{entry:t.entry,priorityPaths:t.priorityPaths,extensions:t.extensions,fallbackToFirstFile:t.fallbackToFirstFile});if(n===void 0)throw Error(t.notFoundMessage);return n.content}function L(){return`
<script>
function tpPostToParent(message) {
  const targetWindow = window.parent !== window ? window.parent : window.top;

  if (
    targetWindow !== null &&
    typeof targetWindow.postMessage === 'function'
  ) {
    targetWindow.postMessage(message, '*');
    return;
  }

  if (typeof Window.prototype.postMessage === 'function') {
    Window.prototype.postMessage.call(targetWindow, message, '*');
  }
}

window.addEventListener('error', (event) => {
  tpPostToParent({
    type: 'tp-playground-runtime-error',
    message: event.message
  });
});

function tpPlaygroundReportHeight() {
  const bodyHeight =
    document.body instanceof HTMLBodyElement ? document.body.scrollHeight : 0;

  const documentHeight = document.documentElement.scrollHeight;
  const height = Math.max(bodyHeight, documentHeight);

  tpPostToParent({
    type: 'tp-playground-content-height',
    height
  });
}

window.tpPlaygroundReportHeight = tpPlaygroundReportHeight;

window.addEventListener('load', () => {
  tpPlaygroundReportHeight();
});

// TpPlayground observes the loaded document from the parent. A second
// observer here starts during parsing and can report resize-loop errors in
// Safari while the initial iframe layout is still settling.
<\/script>
`}function R(){return`
<script>
if (typeof window.tpPostToParent !== 'function') {
  window.tpPostToParent = function tpPostToParent(message) {
    const targetWindow = window.parent !== window ? window.parent : window.top;

    if (
      targetWindow !== null &&
      typeof targetWindow.postMessage === 'function'
    ) {
      targetWindow.postMessage(message, '*');
      return;
    }

    if (typeof Window.prototype.postMessage === 'function') {
      Window.prototype.postMessage.call(targetWindow, message, '*');
    }
  };
}

function tpConsoleSerialize(value, seen = new WeakSet()) {
  if (value === null) {
    return null;
  }

  if (value === undefined) {
    return { __tp_console_type: 'undefined' };
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (typeof value === 'bigint') {
    return {
      __tp_console_type: 'bigint',
      value: String(value)
    };
  }

  if (typeof value === 'function') {
    return {
      __tp_console_type: 'function',
      name: value.name || '(anonymous)'
    };
  }

  if (value instanceof Date) {
    return {
      __tp_console_type: 'date',
      value: value.toISOString()
    };
  }

  if (value instanceof Error) {
    return {
      __tp_console_type: 'error',
      name: value.name,
      message: value.message,
      stack: typeof value.stack === 'string' ? value.stack : undefined
    };
  }

  if (typeof value !== 'object') {
    return String(value);
  }

  if (seen.has(value)) {
    return {
      __tp_console_type: 'circular'
    };
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => tpConsoleSerialize(item, seen));
  }

  const output = {};

  for (const [key, entryValue] of Object.entries(value)) {
    output[key] = tpConsoleSerialize(entryValue, seen);
  }

  return output;
}

function tpConsolePost(kind, args) {
  window.tpPostToParent({
    type: 'tp-playground-console-entry',
    kind,
    values: Array.from(args, (value) => tpConsoleSerialize(value))
  });

  window.tpPostToParent({
    type: 'tp-playground-console-change'
  });

  if (typeof window.tpPlaygroundReportHeight === 'function') {
    window.tpPlaygroundReportHeight();
  }
}

const originalLog = console.log.bind(console);
const originalInfo = console.info.bind(console);
const originalWarn = console.warn.bind(console);
const originalError = console.error.bind(console);
const originalTable = console.table.bind(console);
const originalGroup = console.group.bind(console);
const originalGroupCollapsed = console.groupCollapsed.bind(console);
const originalGroupEnd = console.groupEnd.bind(console);
const originalAssert = console.assert.bind(console);
const originalCount = console.count.bind(console);
const originalCountReset = console.countReset.bind(console);
const originalTime = console.time.bind(console);
const originalTimeEnd = console.timeEnd.bind(console);
const originalTimeLog = console.timeLog.bind(console);

console.log = (...args) => {
  originalLog(...args);
  tpConsolePost('log', args);
};

console.info = (...args) => {
  originalInfo(...args);
  tpConsolePost('info', args);
};

console.warn = (...args) => {
  originalWarn(...args);
  tpConsolePost('warn', args);
};

console.error = (...args) => {
  originalError(...args);
  tpConsolePost('error', args);
};

window.addEventListener('error', (event) => {
  const error = event.error instanceof Error
    ? event.error
    : new Error(event.message || 'Uncaught JavaScript error');
  tpConsolePost('error', [error]);
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason instanceof Error
    ? event.reason
    : new Error(String(event.reason ?? 'Unhandled promise rejection'));
  tpConsolePost('error', [reason]);
});

console.table = (...args) => {
  originalTable(...args);
  tpConsolePost('table', args);
};

console.group = (...args) => {
  originalGroup(...args);
  tpConsolePost('group', args);
};

console.groupCollapsed = (...args) => {
  originalGroupCollapsed(...args);
  tpConsolePost('group-collapsed', args);
};

console.groupEnd = () => {
  originalGroupEnd();
  tpConsolePost('group-end', []);
};

const tpCounts = new Map();
const tpTimers = new Map();

console.assert = (condition, ...args) => {
  originalAssert(condition, ...args);

  if (!condition) {
    tpConsolePost('assert', args.length > 0 ? args : ['Assertion failed']);
  }
};

console.count = (label = 'default') => {
  originalCount(label);

  const nextValue = (tpCounts.get(label) || 0) + 1;
  tpCounts.set(label, nextValue);

  tpConsolePost('count', [String(label) + ': ' + String(nextValue)]);
};

console.countReset = (label = 'default') => {
  originalCountReset(label);
  tpCounts.set(label, 0);
};

console.time = (label = 'default') => {
  originalTime(label);
  tpTimers.set(label, performance.now());
};

console.timeLog = (label = 'default', ...args) => {
  originalTimeLog(label, ...args);

  const start = tpTimers.get(label);

  if (start === undefined) {
    tpConsolePost('warn', ["Timer '" + String(label) + "' does not exist"]);
    return;
  }

  const duration = performance.now() - start;
  tpConsolePost('time', [
    String(label) + ': ' + duration.toFixed(2) + ' ms',
    ...args
  ]);
};

console.timeEnd = (label = 'default') => {
  originalTimeEnd(label);

  const start = tpTimers.get(label);

  if (start === undefined) {
    tpConsolePost('warn', ["Timer '" + String(label) + "' does not exist"]);
    return;
  }

  const duration = performance.now() - start;
  tpTimers.delete(label);

  tpConsolePost('time', [
    String(label) + ': ' + duration.toFixed(2) + ' ms'
  ]);
};

console.clear = () => {
  window.tpPostToParent({
    type: 'tp-playground-console-clear'
  });

  window.tpPostToParent({
    type: 'tp-playground-console-change'
  });
};
<\/script>
`}function z(e,t){return e.includes(`</body>`)?e.replace(`</body>`,`${t}</body>`):`${e}\n${t}`}function B(e,t){return e.includes(`</head>`)?e.replace(`</head>`,`${t}</head>`):`${t}\n${e}`}function V(e){return z(e,L())}function H(e){return z(e,R())}function U(e){let t=e.body??``,n=(e.trailingBodyFragments??[]).join(`
`);return`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${y(e.title)}</title>
  </head>
  <body>
${t}
${n}
  </body>
</html>`}function W(e){let t=[L()];return e.showConsole&&t.push(R()),e.importmap!==void 0&&t.push(`
<script type="importmap">
${JSON.stringify(e.importmap,null,2)}
<\/script>
`),t.push(`
<script type="module">
${e.moduleCode}
<\/script>
`),U({title:e.title,body:e.body??`    <main id="app"></main>`,trailingBodyFragments:t})}function G(e){let t=[L()];return e.showConsole&&t.push(R()),U({title:e.title,body:e.body,trailingBodyFragments:t})}export{D as A,C,I as D,F as E,O as M,d as O,u as S,h as T,j as _,T as a,V as b,A as c,P as d,M as f,x as g,S as h,G as i,v as j,g as k,_ as l,b as m,R as n,W as o,N as p,U as r,w as s,L as t,y as u,z as v,E as w,H as x,B as y};
//# sourceMappingURL=playground-build-utils.js.map