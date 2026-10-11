import { o as e } from "./rolldown-runtime.js";
import { resolveSpecifier as t } from "../utilities/importmap/importmap-resolver.js";
(function(e) {
	return e[e.Static = 1] = "Static", e[e.Dynamic = 2] = "Dynamic", e[e.ImportMeta = 3] = "ImportMeta", e[e.StaticSourcePhase = 4] = "StaticSourcePhase", e[e.DynamicSourcePhase = 5] = "DynamicSourcePhase", e[e.StaticDeferPhase = 6] = "StaticDeferPhase", e[e.DynamicDeferPhase = 7] = "DynamicDeferPhase", e;
})({});
var n = new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
function r(e, t = "@") {
	if (!o) return s.then(() => r(e));
	let c = e.length + 1, l = (o.__heap_base.value || o.__heap_base) + 4 * c - o.memory.buffer.byteLength;
	l > 0 && o.memory.grow(Math.ceil(l / 65536));
	let u = o.sa(c - 1);
	if (typeof Buffer < "u" ? Buffer.from(o.memory.buffer, u, 2 * (c - 1)).write(e, "utf16le") : (n ? a : i)(e, new Uint16Array(o.memory.buffer, u, c)), !o.parse()) throw Object.assign(/* @__PURE__ */ Error(`Parse error ${t}:${e.slice(0, o.e()).split("\n").length}:${o.e() - e.lastIndexOf("\n", o.e() - 1)}`), { idx: o.e() });
	let d = [], f = [];
	for (; o.ri();) {
		let t = o.is(), n = o.ie(), r = o.it(), i = o.ai(), a = o.id(), s = o.ss(), c = o.se(), l;
		o.ip() && (l = p(e.slice(a === -1 ? t - 1 : t, a === -1 ? n + 1 : n)));
		let u = null;
		for (u = [], o.rsa(); o.ra();) {
			let t = o.aks(), n = o.ake(), r = o.avs(), i = o.ave();
			u.push([m(e.slice(t, n)), m(e.slice(r, i))]);
		}
		u.length === 0 && (u = null), d.push({
			n: l,
			t: r,
			s: t,
			e: n,
			ss: s,
			se: c,
			d: a,
			a: i,
			at: u
		});
	}
	for (; o.re();) {
		let t = o.es(), n = o.ee(), r = o.els(), i = o.ele(), a = r < 0 ? void 0 : m(e.slice(r, i)), s = m(e.slice(t, n));
		f.push({
			s: t,
			e: n,
			ls: r,
			le: i,
			ss: o.ess(),
			n: s,
			ln: a
		});
	}
	function p(e) {
		try {
			return (0, eval)(e);
		} catch {}
	}
	function m(e) {
		if (!e) return e;
		let t = e[0];
		return (t === "\"" || t === "'") && p(e) || e;
	}
	return [
		d,
		f,
		!!o.f(),
		!!o.ms()
	];
}
function i(e, t) {
	let n = e.length, r = 0;
	for (; r < n;) {
		let n = e.charCodeAt(r);
		t[r++] = (255 & n) << 8 | n >>> 8;
	}
}
function a(e, t) {
	let n = e.length, r = 0;
	for (; r < n;) t[r] = e.charCodeAt(r++);
}
var o, s = WebAssembly.compile((() => {
	return e = "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", typeof Buffer < "u" ? Buffer.from(e, "base64") : Uint8Array.from(atob(e), (e) => e.charCodeAt(0));
	var e;
})()).then(WebAssembly.instantiate).then(({ exports: e }) => {
	o = e;
}), c = "?tp-css-module";
function l(e) {
	return e.startsWith("http://") || e.startsWith("https://") || e.startsWith("data:") || e.startsWith("blob:") || e.startsWith("npm:") || e.startsWith("#");
}
function u(e, t) {
	if (t.startsWith("/")) return t;
	let n = e.split("/").filter(Boolean);
	n.pop();
	let r = t.split("/").filter(Boolean), i = [...n];
	for (let e of r) if (e !== ".") {
		if (e === "..") {
			i.pop();
			continue;
		}
		i.push(e);
	}
	return `/${i.join("/")}`;
}
function d(e) {
	return e.replace(/import\s+([A-Za-z_$][\w$]*)\s+from\s+(['"])((?:\.{1,2}\/|\/)[^'"]+\.css)\2\s+(?:with|assert)\s*\{\s*type\s*:\s*(['"])css\4\s*\}\s*;?/g, (e, t, n, r) => `import ${t} from ${n}${r}${c}${n};`);
}
function f(e) {
	let t = e.indexOf("?");
	return t < 0 ? {
		pathname: e,
		query: ""
	} : {
		pathname: e.slice(0, t),
		query: e.slice(t)
	};
}
function p(e) {
	return `const sheet = new CSSStyleSheet();
sheet.replaceSync(${_(e)});
export default sheet;
`;
}
async function m(e) {
	await s;
	let [t] = r(e), n = [];
	for (let r of t) r.n !== void 0 && n.push({
		start: r.s,
		end: r.e,
		specifier: e.slice(r.s, r.e),
		isDynamic: r.d > -1
	});
	return n;
}
async function h(e, n, r, i) {
	let a = d(e), o = await m(a);
	if (o.length === 0) return a;
	let s = "", c = 0;
	for (let e of o) {
		s += a.slice(c, e.start);
		let o = e.specifier;
		if (l(o)) {
			s += o, c = e.end;
			continue;
		}
		if (!(o.startsWith("./") || o.startsWith("../") || o.startsWith("/"))) {
			let r = t(o, i);
			console.log("rewrite import", {
				fromPath: n,
				rawSpecifier: o,
				resolvedSpecifier: r
			}), s += r ?? o, c = e.end;
			continue;
		}
		let d = await r(u(n, o));
		s += d, c = e.end;
	}
	return s += a.slice(c), s;
}
function g(e) {
	let t = document.createElement("textarea");
	return t.innerHTML = e, t.value;
}
function _(e) {
	return JSON.stringify(e);
}
function v(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function y(e) {
	return e.split("/").filter(Boolean).at(-1) ?? e;
}
function b(e, t) {
	return t.some((t) => e.endsWith(t));
}
function x(e) {
	let t = e.path;
	return t.endsWith(".html") || t.endsWith(".htm") ? "text/html" : t.endsWith(".css") ? "text/css" : t.endsWith(".js") || t.endsWith(".mjs") || t.endsWith(".cjs") ? "text/javascript" : t.endsWith(".json") ? "application/json" : t.endsWith(".svg") ? "image/svg+xml" : "text/plain";
}
function S(e) {
	return e.path.endsWith(".js") || e.path.endsWith(".mjs") || e.path.endsWith(".cjs");
}
function C(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (S(n)) continue;
		let e = new Blob([n.content], { type: x(n) });
		t.set(n.path, URL.createObjectURL(e));
	}
	return t;
}
async function w(e, t, n) {
	let r = new Map(e.map((e) => [e.path, e])), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = async (e) => {
		let s = i.get(e);
		if (s !== void 0) return s;
		let l = a.get(e);
		if (l !== void 0) return l;
		let u = (async () => {
			let a = r.get(e);
			if (a === void 0) throw Error(`Module not found: ${e}`);
			let s = await h(a.content, a.path, async (e) => {
				let { pathname: n, query: a } = f(e);
				if (a === c) {
					let t = i.get(e);
					if (t !== void 0) return t;
					let a = r.get(n);
					if (a === void 0) throw Error(`CSS module not found: ${n}`);
					let o = new Blob([p(a.content)], { type: "text/javascript" }), s = URL.createObjectURL(o);
					return i.set(e, s), s;
				}
				let s = t.get(n);
				if (s !== void 0) return s;
				let l = r.get(n);
				if (l === void 0) throw Error(`Dependency not found: ${n}`);
				if (S(l)) return o(n);
				let u = new Blob([l.content], { type: x(l) });
				return URL.createObjectURL(u);
			}, n), l = new Blob([s], { type: "text/javascript" }), u = URL.createObjectURL(l);
			return i.set(e, u), u;
		})();
		a.set(e, u);
		try {
			return await u;
		} finally {
			a.delete(e);
		}
	};
	for (let t of e) S(t) && await o(t.path);
	return i;
}
function T(e) {
	return e.path.endsWith(".ts") || e.path.endsWith(".tsx");
}
function E(e) {
	return e.replace(/\.tsx?$/, ".js");
}
async function D(t) {
	let { default: n } = await import("./typescript.js").then((t) => /* @__PURE__ */ e(t.default, 1));
	return n.transpileModule(t, { compilerOptions: {
		target: n.ScriptTarget.ES2022,
		module: n.ModuleKind.ESNext,
		jsx: n.JsxEmit.ReactJSX,
		useDefineForClassFields: !1
	} }).outputText;
}
function O(e, t) {
	let n = t.get(e);
	if (n !== void 0) return n;
	if (e.endsWith(".js")) return t.get(e.replace(/\.js$/, ".ts")) ?? t.get(e.replace(/\.js$/, ".tsx"));
}
async function k(e, t, n) {
	let r = new Map(e.map((e) => [e.path, e])), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = async (e) => {
		let s = i.get(e);
		if (s !== void 0) return s;
		let c = a.get(e);
		if (c !== void 0) return c;
		let l = (async () => {
			let a = r.get(e);
			if (a === void 0) throw Error(`Module not found: ${e}`);
			let s = await h(T(a) ? await D(a.content) : a.content, E(a.path), async (e) => {
				let n = O(e, r);
				if (n && (T(n) || S(n))) return o(n.path);
				let i = t.get(e);
				if (i !== void 0) return i;
				if (n === void 0) throw Error(`Dependency not found: ${e}`);
				return o(n.path);
			}, n), c = URL.createObjectURL(new Blob([s], { type: "text/javascript" }));
			return i.set(e, c), c;
		})();
		a.set(e, l);
		try {
			return await l;
		} finally {
			a.delete(e);
		}
	};
	for (let t of e) (T(t) || t.path.endsWith(".js") || t.path.endsWith(".mjs") || t.path.endsWith(".cjs")) && await o(t.path);
	return i;
}
function A(e) {
	return b(e, [".ts", ".tsx"]) ? "typescript" : b(e, [
		".js",
		".mjs",
		".cjs"
	]) ? "javascript" : b(e, [".py"]) ? "python" : b(e, [".pl"]) ? "prolog" : b(e, [".html", ".htm"]) ? "html" : b(e, [".css"]) ? "css" : b(e, [".json"]) ? "json" : b(e, [".md"]) ? "markdown" : "text";
}
function j(e, t) {
	return e.files.find((e) => e.path === t);
}
function M(e, t) {
	for (let n of t) {
		let t = j(e, n);
		if (t !== void 0) return t;
	}
}
function N(e, t) {
	return e.files.find((e) => b(e.path, t));
}
function P(e, t) {
	let n = typeof t.entry == "string" && t.entry !== "" ? j(e, t.entry) : void 0;
	if (n !== void 0) return n;
	let r = t.ignoreProjectEntry !== !0 && typeof e.entry == "string" && e.entry !== "" ? j(e, e.entry) : void 0;
	if (r !== void 0) return r;
	let i = Array.isArray(t.priorityPaths) && t.priorityPaths.length > 0 ? M(e, t.priorityPaths) : void 0;
	if (i !== void 0) return i;
	let a = Array.isArray(t.extensions) && t.extensions.length > 0 ? N(e, t.extensions) : void 0;
	if (a !== void 0) return a;
	if (t.fallbackToFirstFile) return e.files.at(0);
}
function F(e, t) {
	let n = P(e, {
		entry: t.entry,
		priorityPaths: t.priorityPaths,
		extensions: t.extensions,
		fallbackToFirstFile: t.fallbackToFirstFile
	});
	if (n === void 0) throw Error(t.notFoundMessage);
	return n.content;
}
function I() {
	return "\n<script>\nfunction tpPostToParent(message) {\n  const targetWindow = window.parent !== window ? window.parent : window.top;\n\n  if (\n    targetWindow !== null &&\n    typeof targetWindow.postMessage === 'function'\n  ) {\n    targetWindow.postMessage(message, '*');\n    return;\n  }\n\n  if (typeof Window.prototype.postMessage === 'function') {\n    Window.prototype.postMessage.call(targetWindow, message, '*');\n  }\n}\n\nwindow.addEventListener('error', (event) => {\n  tpPostToParent({\n    type: 'tp-playground-runtime-error',\n    message: event.message\n  });\n});\n\nfunction tpPlaygroundReportHeight() {\n  const bodyHeight =\n    document.body instanceof HTMLBodyElement ? document.body.scrollHeight : 0;\n\n  const documentHeight = document.documentElement.scrollHeight;\n  const height = Math.max(bodyHeight, documentHeight);\n\n  tpPostToParent({\n    type: 'tp-playground-content-height',\n    height\n  });\n}\n\nwindow.tpPlaygroundReportHeight = tpPlaygroundReportHeight;\n\nwindow.addEventListener('load', () => {\n  tpPlaygroundReportHeight();\n});\n\n// TpPlayground observes the loaded document from the parent. A second\n// observer here starts during parsing and can report resize-loop errors in\n// Safari while the initial iframe layout is still settling.\n<\/script>\n";
}
function L() {
	return "\n<script>\nif (typeof window.tpPostToParent !== 'function') {\n  window.tpPostToParent = function tpPostToParent(message) {\n    const targetWindow = window.parent !== window ? window.parent : window.top;\n\n    if (\n      targetWindow !== null &&\n      typeof targetWindow.postMessage === 'function'\n    ) {\n      targetWindow.postMessage(message, '*');\n      return;\n    }\n\n    if (typeof Window.prototype.postMessage === 'function') {\n      Window.prototype.postMessage.call(targetWindow, message, '*');\n    }\n  };\n}\n\nfunction tpConsoleSerialize(value, seen = new WeakSet()) {\n  if (value === null) {\n    return null;\n  }\n\n  if (value === undefined) {\n    return { __tp_console_type: 'undefined' };\n  }\n\n  if (\n    typeof value === 'string' ||\n    typeof value === 'number' ||\n    typeof value === 'boolean'\n  ) {\n    return value;\n  }\n\n  if (typeof value === 'bigint') {\n    return {\n      __tp_console_type: 'bigint',\n      value: String(value)\n    };\n  }\n\n  if (typeof value === 'function') {\n    return {\n      __tp_console_type: 'function',\n      name: value.name || '(anonymous)'\n    };\n  }\n\n  if (value instanceof Date) {\n    return {\n      __tp_console_type: 'date',\n      value: value.toISOString()\n    };\n  }\n\n  if (value instanceof Error) {\n    return {\n      __tp_console_type: 'error',\n      name: value.name,\n      message: value.message,\n      stack: typeof value.stack === 'string' ? value.stack : undefined\n    };\n  }\n\n  if (typeof value !== 'object') {\n    return String(value);\n  }\n\n  if (seen.has(value)) {\n    return {\n      __tp_console_type: 'circular'\n    };\n  }\n\n  seen.add(value);\n\n  if (Array.isArray(value)) {\n    return value.map((item) => tpConsoleSerialize(item, seen));\n  }\n\n  const output = {};\n\n  for (const [key, entryValue] of Object.entries(value)) {\n    output[key] = tpConsoleSerialize(entryValue, seen);\n  }\n\n  return output;\n}\n\nfunction tpConsolePost(kind, args) {\n  window.tpPostToParent({\n    type: 'tp-playground-console-entry',\n    kind,\n    values: Array.from(args, (value) => tpConsoleSerialize(value))\n  });\n\n  window.tpPostToParent({\n    type: 'tp-playground-console-change'\n  });\n\n  if (typeof window.tpPlaygroundReportHeight === 'function') {\n    window.tpPlaygroundReportHeight();\n  }\n}\n\nconst originalLog = console.log.bind(console);\nconst originalInfo = console.info.bind(console);\nconst originalWarn = console.warn.bind(console);\nconst originalError = console.error.bind(console);\nconst originalTable = console.table.bind(console);\nconst originalGroup = console.group.bind(console);\nconst originalGroupCollapsed = console.groupCollapsed.bind(console);\nconst originalGroupEnd = console.groupEnd.bind(console);\nconst originalAssert = console.assert.bind(console);\nconst originalCount = console.count.bind(console);\nconst originalCountReset = console.countReset.bind(console);\nconst originalTime = console.time.bind(console);\nconst originalTimeEnd = console.timeEnd.bind(console);\nconst originalTimeLog = console.timeLog.bind(console);\n\nconsole.log = (...args) => {\n  originalLog(...args);\n  tpConsolePost('log', args);\n};\n\nconsole.info = (...args) => {\n  originalInfo(...args);\n  tpConsolePost('info', args);\n};\n\nconsole.warn = (...args) => {\n  originalWarn(...args);\n  tpConsolePost('warn', args);\n};\n\nconsole.error = (...args) => {\n  originalError(...args);\n  tpConsolePost('error', args);\n};\n\nwindow.addEventListener('error', (event) => {\n  const error = event.error instanceof Error\n    ? event.error\n    : new Error(event.message || 'Uncaught JavaScript error');\n  tpConsolePost('error', [error]);\n});\n\nwindow.addEventListener('unhandledrejection', (event) => {\n  const reason = event.reason instanceof Error\n    ? event.reason\n    : new Error(String(event.reason ?? 'Unhandled promise rejection'));\n  tpConsolePost('error', [reason]);\n});\n\nconsole.table = (...args) => {\n  originalTable(...args);\n  tpConsolePost('table', args);\n};\n\nconsole.group = (...args) => {\n  originalGroup(...args);\n  tpConsolePost('group', args);\n};\n\nconsole.groupCollapsed = (...args) => {\n  originalGroupCollapsed(...args);\n  tpConsolePost('group-collapsed', args);\n};\n\nconsole.groupEnd = () => {\n  originalGroupEnd();\n  tpConsolePost('group-end', []);\n};\n\nconst tpCounts = new Map();\nconst tpTimers = new Map();\n\nconsole.assert = (condition, ...args) => {\n  originalAssert(condition, ...args);\n\n  if (!condition) {\n    tpConsolePost('assert', args.length > 0 ? args : ['Assertion failed']);\n  }\n};\n\nconsole.count = (label = 'default') => {\n  originalCount(label);\n\n  const nextValue = (tpCounts.get(label) || 0) + 1;\n  tpCounts.set(label, nextValue);\n\n  tpConsolePost('count', [String(label) + ': ' + String(nextValue)]);\n};\n\nconsole.countReset = (label = 'default') => {\n  originalCountReset(label);\n  tpCounts.set(label, 0);\n};\n\nconsole.time = (label = 'default') => {\n  originalTime(label);\n  tpTimers.set(label, performance.now());\n};\n\nconsole.timeLog = (label = 'default', ...args) => {\n  originalTimeLog(label, ...args);\n\n  const start = tpTimers.get(label);\n\n  if (start === undefined) {\n    tpConsolePost('warn', [\"Timer '\" + String(label) + \"' does not exist\"]);\n    return;\n  }\n\n  const duration = performance.now() - start;\n  tpConsolePost('time', [\n    String(label) + ': ' + duration.toFixed(2) + ' ms',\n    ...args\n  ]);\n};\n\nconsole.timeEnd = (label = 'default') => {\n  originalTimeEnd(label);\n\n  const start = tpTimers.get(label);\n\n  if (start === undefined) {\n    tpConsolePost('warn', [\"Timer '\" + String(label) + \"' does not exist\"]);\n    return;\n  }\n\n  const duration = performance.now() - start;\n  tpTimers.delete(label);\n\n  tpConsolePost('time', [\n    String(label) + ': ' + duration.toFixed(2) + ' ms'\n  ]);\n};\n\nconsole.clear = () => {\n  window.tpPostToParent({\n    type: 'tp-playground-console-clear'\n  });\n\n  window.tpPostToParent({\n    type: 'tp-playground-console-change'\n  });\n};\n<\/script>\n";
}
function R(e, t) {
	return e.includes("</body>") ? e.replace("</body>", `${t}</body>`) : `${e}\n${t}`;
}
function z(e, t) {
	return e.includes("</head>") ? e.replace("</head>", `${t}</head>`) : `${t}\n${e}`;
}
function B(e) {
	return R(e, I());
}
function V(e) {
	return R(e, L());
}
function H(e) {
	let t = e.body ?? "", n = (e.trailingBodyFragments ?? []).join("\n");
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${v(e.title)}</title>
  </head>
  <body>
${t}
${n}
  </body>
</html>`;
}
function U(e) {
	let t = [I()];
	return e.showConsole && t.push(L()), e.importmap !== void 0 && t.push(`
<script type="importmap">
${JSON.stringify(e.importmap, null, 2)}
<\/script>
`), t.push(`
<script type="module">
${e.moduleCode}
<\/script>
`), H({
		title: e.title,
		body: e.body ?? "    <main id=\"app\"></main>",
		trailingBodyFragments: t
	});
}
function W(e) {
	let t = [I()];
	return e.showConsole && t.push(L()), H({
		title: e.title,
		body: e.body,
		trailingBodyFragments: t
	});
}
//#endregion
export { E as A, S as C, F as D, P as E, D as M, u as O, l as S, m as T, A as _, w as a, B as b, k as c, N as d, j as f, b as g, x as h, W as i, _ as j, h as k, g as l, y as m, L as n, U as o, M as p, H as r, C as s, I as t, v as u, R as v, T as w, V as x, z as y };

//# sourceMappingURL=playground-build-utils.js.map