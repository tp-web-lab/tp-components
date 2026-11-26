import { compactTraceSteps } from "../trace/visible-steps.js";
import { instrumentJavaScript } from "./instrument.js";

/** Record synchronous execution. This function also runs in node for semantic tests. */
export function recordJavaScript(code, { maxSteps = 1000, language = "javascript" } = {}) {
	if (code.length > 20000) throw new Error("Source limit: 20,000 characters.");
	const compiled = instrumentJavaScript(code, { language });
	const uninitialized = Symbol("uninitialized");
	const trace = [],
		stack = [],
		captures = new WeakMap(),
		identities = new WeakMap();
	let nextObject = 0,
		nextEnvironment = 0,
		nextFrame = 0,
		root,
		current,
		stdout = "",
		stopped = false;
	const limit = new Error("Trace limit: 1,000 events.");
	const special = (kind, value) => [kind, value];
	const read = (env) => {
		const values = new Map();
		for (const [name, get] of env?.bindings || []) {
			try {
				values.set(name, get());
			} catch {
				values.set(name, uninitialized);
			}
		}
		return values;
	};
	const errorText = (error) => {
		try {
			return error instanceof Error
				? `${error.name}: ${error.message}`
				: String(error);
		} catch {
			return "Thrown value";
		}
	};
	let sourceRange;
	function snapshot(event, line, env, exception) {
		if (stopped) throw limit;
		if (trace.length >= maxSteps) {
			stopped = true;
			throw limit;
		}
		current = env || current || root;
		if (stack.length && env) stack.at(-1).current = env;
		const heap = {},
			retained = new Map();
		let objects = 0;
		const encode = (value) => {
			if (value === uninitialized)
				return special("UNINITIALIZED", "<uninitialized>");
			if (value === undefined) return special("UNDEFINED", "undefined");
			if (typeof value === "bigint") return special("BIGINT", `${value}n`);
			if (typeof value === "symbol") return special("SYMBOL", String(value));
			if (
				typeof value === "number" &&
				(!Number.isFinite(value) || Object.is(value, -0))
			)
				return special(
					"SPECIAL_FLOAT",
					Object.is(value, -0) ? "-0" : String(value),
				);
			if (
				value === null ||
				(typeof value !== "object" && typeof value !== "function")
			)
				return value;
			if (!identities.has(value)) identities.set(value, ++nextObject);
			const id = identities.get(value);
			if (heap[id]) return ["REF", id];
			if (++objects > 300) return special("TRUNCATED", "<object limit>");
			heap[id] = ["OBJECT"];
			if (typeof value === "function") {
				const capture = captures.get(value);
				if (capture) retained.set(capture.env.id, capture.env);
				if (Function.prototype.toString.call(value).startsWith("class ")) {
					const fields = Object.getOwnPropertyDescriptors(value);
					const prototype = fields.prototype?.value;
					const methods = prototype
						? Object.getOwnPropertyDescriptors(prototype)
						: {};
					const base = Object.getPrototypeOf(value);
					const baseName =
						base !== Function.prototype && typeof base === "function"
							? Object.getOwnPropertyDescriptor(base, "name")?.value
							: undefined;
					heap[id] = [
						"CLASS",
						value.name,
						baseName ? [baseName] : [],
						...Object.entries({ ...fields, ...methods })
							.filter(
								([name]) =>
									!["length", "name", "prototype", "constructor"].includes(
										name,
									),
							)
							.slice(0, 200)
							.map(([name, d]) => [
								name,
								"value" in d
									? encode(d.value)
									: special("ACCESSOR", "<accessor>"),
							]),
					];
				} else
					heap[id] = [
						"FUNCTION",
						capture?.name || value.name || "anonymous",
						capture?.env.id ?? null,
					];
				return ["REF", id];
			}
			const descriptors = Object.getOwnPropertyDescriptors(value);
			if (Array.isArray(value)) {
				const length = Math.min(value.length, 200);
				heap[id] = [
					"ARRAY",
					...Array.from({ length }, (_, i) =>
						descriptors[i]
							? "value" in descriptors[i]
								? encode(descriptors[i].value)
								: special("ACCESSOR", "<accessor>")
							: special("UNDEFINED", "<empty>"),
					),
				];
				if (value.length > length) heap[id].push(special("TRUNCATED", "…"));
			} else {
				const proto = Object.getPrototypeOf(value),
					ctor =
						proto &&
						Object.getOwnPropertyDescriptor(proto, "constructor")?.value;
				const className = typeof ctor === "function" ? ctor.name : "Object";
				heap[id] = [
					"INSTANCE",
					className || "Object",
					...Object.entries(descriptors)
						.filter(([, d]) => d.enumerable)
						.slice(0, 200)
						.map(([name, d]) => [
							name,
							"value" in d
								? encode(d.value)
								: special("ACCESSOR", "<accessor>"),
						]),
				];
			}
			return ["REF", id];
		};
		const localValues = (env) => {
			const chain = [];
			let scope = env;
			while (scope && scope !== root) {
				chain.unshift(scope);
				if (scope.functionRoot) break;
				scope = scope.parent;
			}
			const values = new Map();
			for (const scope of chain)
				for (const pair of read(scope)) values.set(...pair);
			return values;
		};
		// Merge scopes before filtering: a binding in its TDZ still shadows its parent.
		const encodeValues = (values) =>
			Object.fromEntries(
				[...values]
					.filter(([, value]) => value !== uninitialized)
					.map(([name, value]) => [name, encode(value)]),
			);
		const locals = (env) => encodeValues(localValues(env));
		const globalValues = read(root);
		if (!stack.length && current !== root)
			for (const [name, value] of localValues(current))
				globalValues.set(name, value);
		const globals = encodeValues(globalValues);
		const frames = stack.map((f) => {
			const values = locals(f.current);
			// Derived constructors acquire this only after super() has completed.
			try {
				const thisValue = f.getThis();
				if (thisValue !== undefined) values.this = encode(thisValue);
			} catch {}
			if (f.returned) values.__return__ = encode(f.result);
			return {
				func_name: f.name,
				frame_id: f.id,
				encoded_locals: values,
				ordered_varnames: Object.keys(values),
				is_highlighted: f === stack.at(-1),
			};
		});
		const seen = new Set(stack.flatMap((f) => [f.env.id, f.current.id]));
		for (const env of retained.values()) {
			let scope = env;
			while (scope && scope !== root) {
				if (!seen.has(scope.id)) {
					seen.add(scope.id);
					const values = locals(scope);
					frames.unshift({
						func_name: `${scope.label} (captured)`,
						frame_id: `scope-${scope.id}`,
						encoded_locals: values,
						ordered_varnames: Object.keys(values),
						is_parent: true,
						is_zombie: true,
					});
				}
				scope = scope.parent;
			}
		}
		const step = {
			event,
			line: line || 1,
			func_name: stack.at(-1)?.name || "<script>",
			globals,
			ordered_globals: Object.keys(globals),
			stack_to_render: frames,
			heap,
			stdout,
		};
		if (exception) step.exception_msg = exception;
		if (sourceRange) step.source_range = { ...sourceRange };
		trace.push(step);
	}
	const api = {
		scope(parent, bindings, label) {
			return { id: ++nextEnvironment, parent, bindings, label };
		},
		global(env) {
			root = current = env;
		},
		capture(fn, env, name) {
			captures.set(fn, { env, name });
			return fn;
		},
        at(start, end) { sourceRange = { start, end }; },
        value(value, line, env, start, end) {
            sourceRange = { start, end };
            snapshot("step_line", line, env);
            return value;
        },
		step(line, env, start, end) {
            sourceRange = { start, end };
			snapshot("step_line", line, env);
		},
		enter(name, env, getThis, line) {
			env.functionRoot = true;
			const frame = { id: ++nextFrame, name, env, current: env, getThis };
			stack.push(frame);
			snapshot("call", line, env);
			return frame;
		},
		result(frame, value, line, env) {
			if (frame) {
				frame.returned = true;
				frame.result = value;
			}
			snapshot("return", line, env);
			return value;
		},
		leave(frame) {
			if (frame && stack.at(-1) === frame) stack.pop();
		},
		thrown(error, line, env) {
			if (error !== limit) snapshot("exception", line, env, errorText(error));
			return error;
		},
		exception(error, line, frame, env) {
			if (error !== limit)
				snapshot(
					"exception",
					env ? line : trace.at(-1)?.line || line,
					env || frame?.current || current,
					errorText(error),
				);
		},
		end(env) {
			snapshot("return", code.split("\n").length, env);
		},
	};
	const console = {};
	for (const kind of ["log", "info", "warn", "error", "debug"])
		console[kind] = (...values) => {
			const seen = new WeakSet();
			const safe = (value, depth = 0) => {
				if (typeof value === "bigint") return `${value}n`;
				if (typeof value === "function")
					return `[Function: ${value.name || "anonymous"}]`;
				if (value === null || typeof value !== "object") return value;
				if (seen.has(value)) return "<circular object>";
				if (depth > 8) return "<depth limit>";
				seen.add(value);
				const descriptors = Object.getOwnPropertyDescriptors(value);
				const result = Array.isArray(value) ? [] : Object.create(null);
				for (const [key, d] of Object.entries(descriptors)
					.filter(([, d]) => d.enumerable)
					.slice(0, 200))
					result[key] = "value" in d ? safe(d.value, depth + 1) : "<accessor>";
				seen.delete(value);
				return result;
			};
			stdout +=
				values
					.map((value) =>
						typeof value === "string"
							? value
							: (JSON.stringify(safe(value)) ?? String(value)),
					)
					.join(" ") + "\n";
			if (stdout.length > 100000) {
				stopped = true;
				throw limit;
			}
		};
	try {
		new Function(
			compiled.parameter,
			"console",
			`"use strict";\n${compiled.code}`,
		)(api, console);
	} catch (error) {
		if (error === limit) {
			const last = trace.at(-1);
			trace.push({
				...last,
				event: "instruction_limit_reached",
				exception_msg: limit.message,
			});
		} else if (trace.at(-1)?.exception_msg !== errorText(error)) {
			try {
				snapshot("exception", trace.at(-1)?.line, current, errorText(error));
			} catch {}
		}
	}
	return { version: 1, language, code, trace: compactTraceSteps(trace) };
}
