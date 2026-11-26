/** Instrument synchronous JavaScript using the already bundled TypeScript parser.
 * Keep expressions in their original lexical context: no eval, proxies or getter evaluation.
 */
import ts from "typescript";

export function instrumentJavaScript(code, { language = "javascript" } = {}) {
	const typescript = language === "typescript";
	const file = ts.createSourceFile(
		typescript ? "program.ts" : "program.js",
		code,
		ts.ScriptTarget.Latest,
		true,
		typescript ? ts.ScriptKind.TS : ts.ScriptKind.JS,
	);
	if (file.parseDiagnostics.length)
		throw new SyntaxError(
			ts.flattenDiagnosticMessageText(
				file.parseDiagnostics[0].messageText,
				"\n",
			),
		);
	let prefix = "__tpTrace";
	while (code.includes(prefix)) prefix += "_";
	const api = `${prefix}Api`;
	let serial = 0;
	const fresh = () => `${prefix}${++serial}`;
	const line = (node) =>
		file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
	const forbidden = new Set([
		"eval",
		"Function",
		"AsyncFunction",
		"GeneratorFunction",
		"Promise",
		"Proxy",
		"setTimeout",
		"setInterval",
		"queueMicrotask",
		"fetch",
		"XMLHttpRequest",
		"WebSocket",
		"Worker",
		"importScripts",
		"postMessage",
		"globalThis",
		"self",
		"window",
		"document",
	]);
	function validate(node) {
    if (typescript && (ts.isEnumDeclaration(node) || ts.isModuleDeclaration(node) || ts.isDecorator(node)))
      throw new Error(`Enums, namespaces and decorators are not supported (line ${line(node)}).`);
    if (typescript && (ts.isTypeNode(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node))) return;
		if (
			ts.isIdentifier(node) &&
			forbidden.has(node.text) &&
			!(ts.isPropertyAssignment(node.parent) && node.parent.name === node)
		)
			throw new Error(
				`${node.text} is outside synchronous tracing (line ${line(node)}).`,
			);
		if (
			ts.isAwaitExpression(node) ||
			ts.isYieldExpression(node) ||
			ts.isWithStatement(node) ||
			ts.isImportDeclaration(node) ||
			ts.isExportDeclaration(node) ||
			ts.isExportAssignment(node) ||
			node.kind === ts.SyntaxKind.ImportKeyword ||
			node.asteriskToken ||
			node.modifiers?.some(
				(m) =>
					m.kind === ts.SyntaxKind.AsyncKeyword ||
					m.kind === ts.SyntaxKind.ExportKeyword,
			)
		)
			throw new Error(
				`Only synchronous scripts are supported (line ${line(node)}).`,
			);
		// These bindings need their own semantics; reject rather than misrepresent them.
		if (ts.isClassStaticBlockDeclaration(node) || ts.isPrivateIdentifier(node))
			throw new Error(
				`Private fields and static blocks are not supported (line ${line(node)}).`,
			);
		ts.forEachChild(node, validate);
	}
	validate(file);
	function bound(name, names) {
		if (ts.isIdentifier(name)) names.add(name.text);
		else if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name))
			for (const part of name.elements)
				if (ts.isBindingElement(part)) bound(part.name, names);
	}
	function isTypeOnly(node) {
    return typescript && (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) ||
      node.modifiers?.some(m => m.kind === ts.SyntaxKind.DeclareKeyword) ||
      (ts.isFunctionDeclaration(node) && !node.body));
  }
  function declarations(statements, params = [], collectVar = false) {
		const names = new Set();
		for (const p of params) if (p.name.getText(file) !== "this") bound(p.name, names);
		for (const statement of statements) {
      if (isTypeOnly(statement)) continue;
			if (ts.isVariableStatement(statement))
				for (const d of statement.declarationList.declarations)
					bound(d.name, names);
			else if (
				(ts.isFunctionDeclaration(statement) ||
					ts.isClassDeclaration(statement)) &&
				statement.name
			)
				names.add(statement.name.text);
		}
		if (collectVar) {
			const visit = (node) => {
				if (ts.isFunctionLike(node)) return;
				if (
					ts.isVariableDeclarationList(node) &&
					!(node.flags & ts.NodeFlags.BlockScoped)
				)
					for (const d of node.declarations) bound(d.name, names);
				ts.forEachChild(node, visit);
			};
			statements.forEach(visit);
		}
		return [...names];
	}
	const getters = (names) =>
		`[${names.map((n) => `[${JSON.stringify(n)},()=>${n}]`).join(",")}]`;
	function scopeHead(env, parent, names, label) {
		return `const ${env}=${api}.scope(${parent},${getters(names)},${JSON.stringify(label)});`;
	}
	function registration(statements, env) {
		return statements
			.filter(ts.isFunctionDeclaration)
			.filter((n) => n.name && n.body)
			.map(
				(n) =>
					`${api}.capture(${n.name.text},${env},${JSON.stringify(n.name.text)});`,
			)
			.join("");
	}
	function compose(node, env, frame) {
		let result = "",
			cursor = node.getStart(file);
		ts.forEachChild(node, (child) => {
			result +=
				code.slice(cursor, child.getStart(file)) +
				expression(child, env, frame);
			cursor = child.end;
		});
		return result + code.slice(cursor, node.end);
	}
	function functionNode(node, outer) {
		const env = fresh(),
			frame = fresh(),
			error = fresh();
		const memberName = ts.isConstructorDeclaration(node)
			? "constructor"
			: node.name?.getText(file);
		const className =
			ts.isClassDeclaration(node.parent) || ts.isClassExpression(node.parent)
				? node.parent.name?.getText(file)
				: undefined;
		const name =
			(className && memberName ? `${className}.${memberName}` : memberName) ||
			(ts.isVariableDeclaration(node.parent)
				? node.parent.name.getText(file)
				: "anonymous");
		const statements = ts.isBlock(node.body) ? [...node.body.statements] : [];
		const names = declarations(statements, node.parameters, true);
		const content = ts.isBlock(node.body)
			? statements.map((n) => statement(n, env, frame)).join("\n")
			: `return ${api}.result(${frame},${expression(node.body, env, frame)},${line(node.body)},${env});`;
		const body = `{let ${frame};try{${scopeHead(env, outer, names, name)}${frame}=${api}.enter(${JSON.stringify(name)},${env},()=>this,${line(node)});${registration(statements, env)}\n${content}\n${api}.result(${frame},undefined,${line(node.body)},${env});}catch(${error}){${api}.exception(${error},${line(node)},${frame});throw ${error};}finally{${api}.leave(${frame});}}`;
		const originalHead = code.slice(
			node.getStart(file),
			node.body.getStart(file),
		);
		const result = originalHead + body;
		return ts.isFunctionExpression(node) || ts.isArrowFunction(node)
			? `${api}.capture((${result}),${outer},${JSON.stringify(name)})`
			: result;
	}
	function block(node, parent, frame, extra = []) {
		const env = fresh(),
			names = [...new Set([...declarations(node.statements), ...extra])];
		return `{${scopeHead(env, parent, names, "block")}${registration([...node.statements], env)}\n${node.statements.map((n) => statement(n, env, frame)).join("\n")}\n}`;
	}
	function body(node, env, frame, extra = []) {
		if (ts.isBlock(node)) return block(node, env, frame, extra);
		if (extra.length) {
			const local = fresh();
			return `{${scopeHead(local, env, extra, "loop")}${statement(node, local, frame)}}`;
		}
		return `{${statement(node, env, frame)}}`;
	}
	function expression(node, env, frame) {
    if (typescript && ts.isTypeNode(node)) return node.getText(file);
		if (ts.isFunctionLike(node) && node.body) return functionNode(node, env);
		if (ts.isBlock(node)) return block(node, env, frame);
		if (ts.isCatchClause(node)) {
			const names = [];
			if (node.variableDeclaration)
				bound(node.variableDeclaration.name, new SetAdapter(names));
			const local = fresh();
			const binding = node.variableDeclaration
				? `(${node.variableDeclaration.getText(file)})`
				: "";
			return `catch${binding}{${scopeHead(local, env, [...names, ...declarations(node.block.statements)], "catch")}${names.length ? `${api}.exception(${names[0]},${line(node)},${frame},${local});` : ""}${node.block.statements.map((n) => statement(n, local, frame)).join("\n")}}`;
		}
		const rendered = compose(node, env, frame);
    // Wrap values, never reference positions (member receivers, assignment
    // targets and bindings). Evaluation order and short-circuiting stay native.
    if (!(node.flags & ts.NodeFlags.OptionalChain) && (ts.isBinaryExpression(node) || (ts.isCallExpression(node) && node.expression.kind !== ts.SyntaxKind.SuperKeyword) ||
        ts.isNewExpression(node) || ts.isConditionalExpression(node) ||
        ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node))) {
      const start = node.getStart(file), end = node.end;
      return `(${api}.at(${start},${end}),${api}.value((${rendered}),${line(node)},${env},${start},${end}))`;
    }
    return rendered;
	}
	function statement(node, env, frame) {
    if (isTypeOnly(node)) return node.getText(file);
		if (ts.isExpressionStatement(node) && ts.isStringLiteral(node.expression))
			return node.getText(file);
		const step = `${api}.step(${line(node)},${env},${node.getStart(file)},${node.end});`;
		if (ts.isFunctionDeclaration(node)) return functionNode(node, env);
		if (ts.isBlock(node)) return block(node, env, frame);
		if (ts.isReturnStatement(node))
			return `${step}return ${api}.result(${frame},${node.expression ? expression(node.expression, env, frame) : "undefined"},${line(node)},${env});`;
		if (ts.isThrowStatement(node))
			return `${step}throw ${api}.thrown(${expression(node.expression, env, frame)},${line(node)},${env});`;
		if (ts.isIfStatement(node))
			return `${step}if(${expression(node.expression, env, frame)})${body(node.thenStatement, env, frame)}${node.elseStatement ? "else " + body(node.elseStatement, env, frame) : ""}`;
		if (
			ts.isForStatement(node) ||
			ts.isForOfStatement(node) ||
			ts.isForInStatement(node) ||
			ts.isWhileStatement(node) ||
			ts.isDoStatement(node)
		) {
			const extra = [];
			if (node.initializer && ts.isVariableDeclarationList(node.initializer))
				for (const d of node.initializer.declarations)
					bound(d.name, new SetAdapter(extra));
			const renderedBody = body(node.statement, env, frame, extra);
			// Instrument even an empty loop, without moving its initializer or labels.
			const loopBody = renderedBody.replace(
				"{",
				`{${api}.step(${line(node)},${env},${node.getStart(file)},${node.end});`,
			);
			let head = "",
				cursor = node.getStart(file);
			for (const child of [
				node.initializer,
				node.condition,
				node.incrementor,
				node.expression,
			]
				.filter(Boolean)
				.filter((n) => n.end <= node.statement.getStart(file))
				.sort((a, b) => a.pos - b.pos)) {
				head +=
					code.slice(cursor, child.getStart(file)) +
					expression(child, env, frame);
				cursor = child.end;
			}
			head += code.slice(cursor, node.statement.getStart(file));
			const tail = code.slice(node.statement.end, node.end);
			return step + head + loopBody + tail;
		}
		if (ts.isSwitchStatement(node)) {
			// Preserve switch lexical scope and fall-through; each executed clause is stepped.
			const local = fresh();
			const statements = node.caseBlock.clauses.flatMap((c) => [
				...c.statements,
			]);
			const clauses = node.caseBlock.clauses
				.map(
					(c) =>
						`${ts.isCaseClause(c) ? "case " + expression(c.expression, env, frame) : "default"}:${local}=${api}.scope(${env},${getters(declarations(statements))},"switch");${c.statements.map((n) => statement(n, local, frame)).join("\n")}`,
				)
				.join("\n");
			return `${step}{let ${local};switch(${expression(node.expression, env, frame)}){${clauses}}}`;
		}
		if (ts.isLabeledStatement(node))
			throw new Error(
				`Labeled statements are not supported (line ${line(node)}).`,
			);
		return step + expression(node, env, frame);
	}
	// Binding helper also handles destructuring loop declarations.
	function SetAdapter(array) {
		this.add = (value) => {
			if (!array.includes(value)) array.push(value);
		};
	}
	const env = fresh();
	const generated = `${scopeHead(env, "null", declarations(file.statements, [], true), "Globals")}${api}.global(${env});${registration([...file.statements], env)}\n${file.statements.map((n) => statement(n, env, "null")).join("\n")}\n${api}.end(${env});`;
	if (!typescript) return { code: generated, parameter: api };
  const output = ts.transpileModule(generated, {
    fileName: "program.ts",
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, useDefineForClassFields: true },
  });
  const diagnostic = output.diagnostics?.find(d => d.category === ts.DiagnosticCategory.Error);
  if (diagnostic) throw new SyntaxError(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
  return { code: output.outputText, parameter: api };
}
