//#region src/components/calculator/calculator-engine.ts
function e(e, t = !0) {
	if (e.length > 4096) throw Error("Expression is too long.");
	let n = e.replaceAll("×", "*").replaceAll("÷", "/").replaceAll("π", "pi").replaceAll("−", "-").match(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[a-zA-Z]+|[^\s]/g) ?? [], r = 0, i = () => n[r], a = (e) => {
		if (i() !== e) throw Error(`Expected ${e}.`);
		r++;
	}, o = (e) => {
		if (!Number.isFinite(e)) throw Error("Result is outside the real finite numbers.");
		return e;
	}, s = (e) => {
		if (!Number.isInteger(e) || e < 0 || e > 170) throw Error("Factorial requires an integer from 0 to 170.");
		let t = 1;
		for (let n = 2; n <= e; n++) t *= n;
		return t;
	}, c = (e, n) => {
		let [r = 0, i = 2] = n;
		if (e === "rand") {
			if (n.length) throw Error("rand takes no arguments.");
			return Math.random();
		}
		if (n.length !== 1 && !(e === "sqrt" && n.length === 2)) throw Error("Invalid number of arguments.");
		let a = t ? r * Math.PI / 180 : r;
		switch (e) {
			case "sqrt":
				if (i === 0) throw Error("Root degree cannot be zero.");
				return o(r < 0 && Number.isInteger(i) && Math.abs(i % 2) === 1 ? -((-r) ** (1 / i)) : r ** (1 / i));
			case "ln": return o(Math.log(r));
			case "log": return o(Math.log10(r));
			case "exp": return o(Math.exp(r));
			case "fact": return s(r);
			case "sin": return Math.sin(a);
			case "cos": return Math.cos(a);
			case "tan":
				if (Math.abs(Math.cos(a)) < 1e-14) throw Error("Tangent is undefined at this angle.");
				return Math.tan(a);
			case "sinh": return o(Math.sinh(r));
			case "cosh": return o(Math.cosh(r));
			case "tanh": return Math.tanh(r);
			default: throw Error(`Unknown function: ${e}.`);
		}
	}, l = () => {
		let e = n[r++];
		if (!e) throw Error("Incomplete expression.");
		if (e === "(") {
			let e = m();
			return a(")"), e;
		}
		if (/^(?:\d|\.)/.test(e)) {
			let t = Number(e);
			if (Number.isNaN(t)) throw Error("Invalid number.");
			return o(t);
		}
		let t = e.toLowerCase();
		if (t === "pi") return Math.PI;
		if (t === "e") return Math.E;
		if (/^[a-z]+$/.test(t)) {
			a("(");
			let e = [];
			if (i() !== ")") for (e.push(m()); i() === ",";) r++, e.push(m());
			return a(")"), c(t, e);
		}
		throw Error(`Unexpected token: ${e}.`);
	}, u = () => {
		let e = l();
		for (; i() === "!" || i() === "%";) e = n[r++] === "!" ? s(e) : e / 100;
		return e;
	}, d = () => {
		let e = u();
		return i() === "^" ? (r++, o(e ** f())) : e;
	}, f = () => i() === "+" || i() === "-" ? (n[r++] === "-" ? -1 : 1) * f() : d(), p = () => {
		let e = f();
		for (; i() === "*" || i() === "/";) {
			let t = n[r++], i = f();
			if (t === "/" && i === 0) throw Error("Cannot divide by zero.");
			e = o(t === "*" ? e * i : e / i);
		}
		return e;
	}, m = () => {
		let e = p();
		for (; i() === "+" || i() === "-";) {
			let t = n[r++], i = p();
			e = o(t === "+" ? e + i : e - i);
		}
		return e;
	}, h = m();
	if (r !== n.length) throw Error(`Unexpected token: ${i()}. Use * for multiplication.`);
	return o(h);
}
//#endregion
export { e as calculate };

//# sourceMappingURL=calculator-engine.js.map