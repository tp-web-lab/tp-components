import {
	ComputeEngine,
	type Expression,
	isFunction,
	type MathJsonExpression,
} from "@cortex-js/compute-engine";

export type MathTransformation =
	| "normalization"
	| "simplification"
	| "equivalence";

export type MathChecker = (
	answer: string,
	expected: string,
	reportTransformation?: (transformation: MathTransformation) => void,
) => boolean | undefined;

/** Each question owns its engine; this module is imported only for math grading. */
export function createMathChecker(): MathChecker {
	const ce = new ComputeEngine();
	const functions = new Set<string>();
	return (answer, expected, reportTransformation) => {
		if (!answer.trim()) return false;
		try {
			// Scalar functions occurring in the reference define the notation context.
			for (const match of expected.matchAll(/\b([a-zA-Z])(?:'+|\s*\()/g)) {
				const name = match[1];
				if (name && !functions.has(name)) {
					ce.declare(name, "(real) -> real");
					functions.add(name);
				}
			}
			const atoms = new Map<string, string>();
			const normalize = (json: MathJsonExpression): MathJsonExpression => {
				if (!Array.isArray(json)) return json;
				const [head, ...args] = json;
				if (head === "Annotated" && args[0] !== undefined)
					return normalize(args[0]);
				// f'(a)(x-a) is scalar multiplication in this answer context.
				if (
					head === "Apply" &&
					Array.isArray(args[0]) &&
					args[0][0] === "Apply"
				) {
					return ["Multiply", ...args.map(normalize)];
				}
				// Treat unknown scalar function values as formal algebraic indeterminates.
				if (
					(typeof head === "string" && functions.has(head)) ||
					head === "Apply"
				) {
					const key = JSON.stringify(json);
					let name = atoms.get(key);
					if (!name) {
						name = `tpAnswerAtom${atoms.size}`;
						atoms.set(key, name);
					}
					return name;
				}
				return [head, ...args.map(normalize)] as MathJsonExpression;
			};
			const a = ce.parse(answer);
			const b = ce.parse(expected);
			if (!a.isValid || !b.isValid) return undefined;
			const left = ce.expr(normalize(a.json));
			const right = ce.expr(normalize(b.json));
			if (left.isSame(right)) {
				// Ignore presentation commands and whitespace, but retain the authored
				// term order and operations to detect canonical rearrangements.
				const original = withoutPresentation(
					ce.parse(answer, { form: "raw" }).json,
				);
				const reference = withoutPresentation(
					ce.parse(expected, { form: "raw" }).json,
				);
				if (JSON.stringify(original) !== JSON.stringify(reference))
					reportTransformation?.("normalization");
				return true;
			}
			const compare = (
				lhs: Expression,
				rhs: Expression,
			): boolean | undefined => {
				const difference = ce.expr(["Subtract", lhs.json, rhs.json]).simplify();
				if (difference.isSame(ce.number(0))) {
					reportTransformation?.("simplification");
					return true;
				}
				// Compare rational forms by expanding their cross-products. This proves
				// sign rearrangements symbolically instead of relying on sampled equality.
				if (
					isFunction(lhs) &&
					lhs.operator === "Divide" &&
					lhs.ops.length === 2 &&
					isFunction(rhs) &&
					rhs.operator === "Divide" &&
					rhs.ops.length === 2
				) {
					const crossDifference = ce
						.expr([
							"Expand",
							[
								"Subtract",
								["Multiply", lhs.ops[0]?.json ?? 0, rhs.ops[1]?.json ?? 1],
								["Multiply", rhs.ops[0]?.json ?? 0, lhs.ops[1]?.json ?? 1],
							],
						])
						.evaluate()
						.simplify();
					if (crossDifference.isSame(ce.number(0))) {
						reportTransformation?.("simplification");
						return true;
					}
				}
				const equal = lhs.isIdenticallyEqual(rhs);
				if (equal === true) reportTransformation?.("equivalence");
				return equal;
			};
			if (
				isFunction(left) &&
				isFunction(right) &&
				left.operator === "Equal" &&
				right.operator === "Equal" &&
				left.ops.length === 2 &&
				right.ops.length === 2
			) {
				const l = ce
					.expr(["Subtract", left.ops[0]?.json ?? 0, left.ops[1]?.json ?? 0])
					.simplify();
				const r = ce
					.expr(["Subtract", right.ops[0]?.json ?? 0, right.ops[1]?.json ?? 0])
					.simplify();
				const direct = compare(l, r);
				if (direct === true) return true;
				return compare(l, ce.expr(["Negate", r.json]));
			}
			if (left.operator === "Equal" || right.operator === "Equal") return false;
			const result = compare(left.simplify(), right.simplify());
			if (result !== undefined) return result;
			// A failed identity proof is not a negative verdict. An exact rational
			// counterexample is: both original expressions must be defined there.
			return hasRationalCounterexample(ce, a, b, functions) ? false : undefined;
		} catch {
			return undefined;
		}
	};
}

/** Only integer/rational arithmetic is admitted: no floating-point tolerances. */
function rationalValue(json: MathJsonExpression): [bigint, bigint] | undefined {
	if (typeof json === "number" && Number.isSafeInteger(json))
		return [BigInt(json), 1n];
	if (
		Array.isArray(json) &&
		json[0] === "Rational" &&
		typeof json[1] === "number" &&
		Number.isSafeInteger(json[1]) &&
		typeof json[2] === "number" &&
		Number.isSafeInteger(json[2]) &&
		json[2] !== 0
	)
		return [BigInt(json[1]), BigInt(json[2])];
	return undefined;
}

/** Reject only with a concrete witness, never accept based on sampled agreement. */
function hasRationalCounterexample(
	ce: ComputeEngine,
	answer: Expression,
	expected: Expression,
	functions: Set<string>,
): boolean {
	const variables = [
		...new Set([...answer.unknowns, ...expected.unknowns]),
	].sort();
	const arithmetic = new Set([
		"Add",
		"Subtract",
		"Negate",
		"Multiply",
		"Divide",
		"Power",
		"Square",
		"Rational",
	]);
	for (const degree of [1, 2, 3]) {
		for (const offset of [0, 2, -4]) {
			const values = new Map(
				variables.map((name, index) => [name, index + offset + 1]),
			);
			const substitute = (
				json: MathJsonExpression,
			): MathJsonExpression | undefined => {
				if (typeof json === "number" && Number.isSafeInteger(json)) return json;
				if (typeof json === "string") return values.get(json);
				if (!Array.isArray(json)) return undefined;
				const [head, ...args] = json;
				if (head === "Annotated" && args[0] !== undefined)
					return substitute(args[0]);
				const operands = args.map(substitute);
				if (operands.some((value) => value === undefined)) return undefined;
				const known = operands as MathJsonExpression[];
				if (
					typeof head === "string" &&
					functions.has(head) &&
					known.length === 1
				)
					return ["Power", known[0], degree] as MathJsonExpression;
				if (typeof head !== "string" || !arithmetic.has(head)) return undefined;
				return [head, ...known] as MathJsonExpression;
			};
			const lhs = substitute(answer.json);
			const rhs = substitute(expected.json);
			if (lhs === undefined || rhs === undefined) continue;
			const a = rationalValue(ce.expr(lhs).evaluate().json);
			const b = rationalValue(ce.expr(rhs).evaluate().json);
			if (a && b && a[0] * b[1] !== b[0] * a[1]) return true;
		}
	}
	return false;
}

/** Remove styling only; mathematical structure stays intact for comparison. */
function withoutPresentation(json: MathJsonExpression): MathJsonExpression {
	if (!Array.isArray(json)) return json;
	if (json[0] === "Annotated" && json[1] !== undefined)
		return withoutPresentation(json[1]);
	const [head, ...args] = json;
	return [head, ...args.map(withoutPresentation)] as MathJsonExpression;
}
