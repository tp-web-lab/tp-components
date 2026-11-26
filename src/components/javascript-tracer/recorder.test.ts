import { expect, it } from "vitest";
import { recordJavaScript } from "./recorder.js";

function lastStep(result: ReturnType<typeof recordJavaScript>) {
	const last = result.trace.at(-1);
	if (!last) throw new Error("Missing recorded steps");
	return last;
}

it("records shared nested arrays, mutation and cycles without duplicating objects", () => {
	const result = recordJavaScript(
		"const shared=[1,2]; const rows=[shared,[3,4],shared]; shared.push(5); rows.push(rows); console.log(rows[0] === rows[2]);",
	);
	const last = lastStep(result);
	expect(last.stdout).toBe("true\n");
	const shared = last.globals.shared[1],
		rows = last.globals.rows[1];
	expect(last.heap[shared]).toEqual(["ARRAY", 1, 2, 5]);
	expect(last.heap[rows]).toEqual([
		"ARRAY",
		["REF", shared],
		expect.any(Array),
		["REF", shared],
		["REF", rows],
	]);
});
it("records recursive frames and return values", () => {
	const result = recordJavaScript(
		"function factorial(n) { if(n<=1) return 1; return n*factorial(n-1); } console.log(factorial(5));",
	);
	expect(lastStep(result).stdout).toBe("120\n");
	expect(result.trace.some((s) => s.stack_to_render.length === 5)).toBe(true);
});
it("retains independent closure environments and nonlocal updates", () => {
	const result = recordJavaScript(
		"function counter(){let value=0;return ()=>++value;} const a=counter();const b=counter();console.log(a(),a(),b());",
	);
	expect(lastStep(result).stdout).toBe("1 2 1\n");
	const frames: {
		is_parent?: boolean;
		encoded_locals: Record<string, unknown>;
	}[] = lastStep(result).stack_to_render;
	const captured = frames.filter((f) => f.is_parent);
	expect(captured.map((f) => f.encoded_locals.value).sort()).toEqual([1, 2]);
});
it("preserves loops, block shadowing, destructuring and loop closures", () => {
	const result = recordJavaScript(
		'let sum=0;const callbacks=[];for(let i=0;i<3;i++){sum+=i;callbacks.push(()=>i);} {const sum=99;console.log(sum);} const [a,b]=[1,2];console.log(sum,callbacks.map(f=>f()).join(","),a+b);',
	);
	expect(lastStep(result).stdout).toBe("99\n3 0,1,2 3\n");
});
it("shows caught and uncaught exceptions with completed finally effects", () => {
	const result = recordJavaScript(
		'try {throw new Error("caught");}catch(e){console.log(e.message);}finally{console.log("done");} throw new TypeError("stop");',
	);
	expect(lastStep(result).stdout).toBe("caught\ndone\n");
	expect(lastStep(result).exception_msg).toBe("TypeError: stop");
});
it("preserves classes and this without invoking getters for snapshots", () => {
	const result = recordJavaScript(
		"let reads=0;class Counter{constructor(n){this.value=n;}get dangerous(){reads++;return 0;}increment(){return ++this.value;}}const c=new Counter(3);const alias=c;console.log(c.increment(),alias.value,reads);",
	);
	expect(lastStep(result).stdout).toBe("4 4 0\n");
	const last = lastStep(result);
	expect(last.globals.c).toEqual(last.globals.alias);
	expect(last.heap[last.globals.c[1]]).toEqual([
		"INSTANCE",
		"Counter",
		["value", 4],
	]);
});
it("limits even empty loops and keeps a navigable recording", () => {
	const result = recordJavaScript("while(true) {}", { maxSteps: 20 });
	expect(result.trace.length).toBeLessThan(21);
	expect(result.trace.some((step) => (step.grouped_steps ?? 1) > 1)).toBe(true);
	expect(lastStep(result).event).toBe("instruction_limit_reached");
});
it.each([
	"async function f() {}",
	"Promise.resolve(1)",
	"setTimeout(()=>{},0)",
	'import x from "x"',
	'eval("1")',
])("rejects unsupported asynchronous or dynamic execution: %s", (code) => {
	expect(() => recordJavaScript(code)).toThrow();
});
it("keeps getter properties unevaluated and special primitives distinct", () => {
	const result = recordJavaScript(
		"let reads=0;const obj={get x(){reads++;return 1;}}; const values=[undefined,NaN,Infinity,2n];console.log(reads);",
	);
	const last = lastStep(result);
	expect(last.stdout).toBe("0\n");
	expect(last.heap[last.globals.obj[1]]).toEqual([
		"INSTANCE",
		"Object",
		["x", ["ACCESSOR", "<accessor>"]],
	]);
	expect(last.heap[last.globals.values[1]]).toEqual([
		"ARRAY",
		["UNDEFINED", "undefined"],
		["SPECIAL_FLOAT", "NaN"],
		["SPECIAL_FLOAT", "Infinity"],
		["BIGINT", "2n"],
	]);
});

it("shows bindings only after initialization while keeping initialized undefined", () => {
	const result = recordJavaScript(
		"const shared = [1, 2];\nconst rows = [shared];\nlet empty;\nconsole.log(rows);",
	);
	expect(result.trace[0]?.globals).toEqual({});
	expect(result.trace[1]?.ordered_globals).toEqual(["shared"]);
	expect(result.trace[2]?.ordered_globals).toEqual(["shared", "rows"]);
	expect(lastStep(result).globals.empty).toEqual(["UNDEFINED", "undefined"]);
});
it("hides uninitialized locals and lexical shadows without hiding parameters", () => {
	const result = recordJavaScript(
		'const x=1; { console.log("before"); let x=2; console.log(x); } function f(p){let local=p;return local;} f(3);',
	);
	const before = result.trace.find(
		(s) => s.event === "step_line" && !("x" in s.globals) && s.globals.f,
	);
	expect(before).toBeDefined();
	const call = result.trace.find((s) => s.event === "call");
	expect(call?.stack_to_render[0]?.encoded_locals).toEqual({ p: 3 });
	expect(
		result.trace.some((s) => JSON.stringify(s).includes("UNINITIALIZED")),
	).toBe(false);
});
it("traces inheritance, super and this after the base constructor", () => {
	const result = recordJavaScript(
		"class Base{constructor(value){this.value=value;}increment(){return ++this.value;}} class Child extends Base{constructor(value,step){super(value);this.step=step;}increment(){super.increment();this.value+=this.step-1;return this.value;}} const counter=new Child(3,2);console.log(counter.increment());",
	);
	const last = lastStep(result);
	expect(last.stdout).toBe("5\n");
	expect(last.heap[last.globals.Child[1]]?.slice(0, 3)).toEqual([
		"CLASS",
		"Child",
		["Base"],
	]);
	expect(last.heap[last.globals.counter[1]]).toEqual([
		"INSTANCE",
		"Child",
		["value", 5],
		["step", 2],
	]);
	const constructorFrames = result.trace
		.flatMap((s) => s.stack_to_render)
		.filter((f: { func_name: string }) => f.func_name.endsWith(".constructor"));
	expect(
		constructorFrames.some(
			(f: { encoded_locals: Record<string, unknown> }) =>
				f.encoded_locals.step === 2 && !("this" in f.encoded_locals),
		),
	).toBe(true);
	expect(
		constructorFrames.some(
			(f: { encoded_locals: Record<string, unknown> }) =>
				f.encoded_locals.step === 2 && "this" in f.encoded_locals,
		),
	).toBe(true);
});

it("highlights original subexpressions without repeating side effects", () => {
	const code =
		'const emoji = "😀"; let n = 0; const value = (++n + 3) * 4; false && ++n; console.log(value, n);';
	const result = recordJavaScript(code);
	expect(result.trace.at(-1)?.stdout).toBe("16 1\n");
	const highlighted = result.trace.map((step) =>
		step.source_range
			? code.slice(step.source_range.start, step.source_range.end)
			: "",
	);
	expect(highlighted).toContain("++n + 3");
	expect(highlighted).toContain("(++n + 3) * 4");
	expect(highlighted.filter((value) => value === "++n")).toHaveLength(1);
});

it("preserves optional chains and receiver binding", () => {
	const result = recordJavaScript(
		"const missing = null; let n = 0; missing?.run(++n).next(); const obj = {n: 7, get() { return this; }}; console.log(obj.get().n, n);",
	);
	expect(result.trace.at(-1)?.stdout).toBe("7 0\n");
	expect(result.trace.at(-1)?.exception_msg).toBeUndefined();
});
