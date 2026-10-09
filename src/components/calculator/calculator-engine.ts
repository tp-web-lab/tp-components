/** Evaluates calculator expressions without executing JavaScript. */
export function calculate(source: string, degrees = true): number {
	if (source.length > 4096) throw new Error("Expression is too long.");
	const text = source
		.replaceAll("×", "*")
		.replaceAll("÷", "/")
		.replaceAll("π", "pi")
		.replaceAll("−", "-");
	const tokens =
		text.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[a-zA-Z]+|[^\s]/g) ??
		[];
	let pos = 0;
	const peek = () => tokens[pos];
	const take = (token: string) => {
		if (peek() !== token) throw new Error(`Expected ${token}.`);
		pos++;
	};
	const finite = (n: number) => {
		if (!Number.isFinite(n))
			throw new Error("Result is outside the real finite numbers.");
		return n;
	};
	const factorial = (n: number) => {
		if (!Number.isInteger(n) || n < 0 || n > 170)
			throw new Error("Factorial requires an integer from 0 to 170.");
		let result = 1;
		for (let i = 2; i <= n; i++) result *= i;
		return result;
	};
	const call = (name: string, args: number[]) => {
		const [x = 0, y = 2] = args;
		if (name === "rand") {
			if (args.length) throw new Error("rand takes no arguments.");
			return Math.random();
		}
		if (args.length !== 1 && !(name === "sqrt" && args.length === 2))
			throw new Error("Invalid number of arguments.");
		const angle = degrees ? (x * Math.PI) / 180 : x;
		switch (name) {
			case "sqrt":
				if (y === 0) throw new Error("Root degree cannot be zero.");
				return finite(
					x < 0 && Number.isInteger(y) && Math.abs(y % 2) === 1
						? -((-x) ** (1 / y))
						: x ** (1 / y),
				);
			case "ln":
				return finite(Math.log(x));
			case "log":
				return finite(Math.log10(x));
			case "exp":
				return finite(Math.exp(x));
			case "fact":
				return factorial(x);
			case "sin":
				return Math.sin(angle);
			case "cos":
				return Math.cos(angle);
			case "tan":
				if (Math.abs(Math.cos(angle)) < 1e-14)
					throw new Error("Tangent is undefined at this angle.");
				return Math.tan(angle);
			case "sinh":
				return finite(Math.sinh(x));
			case "cosh":
				return finite(Math.cosh(x));
			case "tanh":
				return Math.tanh(x);
			default:
				throw new Error(`Unknown function: ${name}.`);
		}
	};
	const primary = (): number => {
		const token = tokens[pos++];
		if (!token) throw new Error("Incomplete expression.");
		if (token === "(") {
			const value = expression();
			take(")");
			return value;
		}
		if (/^(?:\d|\.)/.test(token)) {
			const n = Number(token);
			if (Number.isNaN(n)) throw new Error("Invalid number.");
			return finite(n);
		}
		const name = token.toLowerCase();
		if (name === "pi") return Math.PI;
		if (name === "e") return Math.E;
		if (/^[a-z]+$/.test(name)) {
			take("(");
			const args: number[] = [];
			if (peek() !== ")") {
				args.push(expression());
				while (peek() === ",") {
					pos++;
					args.push(expression());
				}
			}
			take(")");
			return call(name, args);
		}
		throw new Error(`Unexpected token: ${token}.`);
	};
	const postfix = (): number => {
		let value = primary();
		while (peek() === "!" || peek() === "%")
			value = tokens[pos++] === "!" ? factorial(value) : value / 100;
		return value;
	};
	const power = (): number => {
		const value = postfix();
		if (peek() === "^") {
			pos++;
			return finite(value ** unary());
		}
		return value;
	};
	const unary = (): number => {
		if (peek() === "+" || peek() === "-") {
			const sign = tokens[pos++];
			return (sign === "-" ? -1 : 1) * unary();
		}
		return power();
	};
	const product = (): number => {
		let value = unary();
		while (peek() === "*" || peek() === "/") {
			const op = tokens[pos++];
			const right = unary();
			if (op === "/" && right === 0) throw new Error("Cannot divide by zero.");
			value = finite(op === "*" ? value * right : value / right);
		}
		return value;
	};
	const expression = (): number => {
		let value = product();
		while (peek() === "+" || peek() === "-") {
			const op = tokens[pos++];
			const right = product();
			value = finite(op === "+" ? value + right : value - right);
		}
		return value;
	};
	const result = expression();
	if (pos !== tokens.length)
		throw new Error(`Unexpected token: ${peek()}. Use * for multiplication.`);
	return finite(result);
}
