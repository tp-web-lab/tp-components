import { E as e, a as t, c as n, f as r, n as i, s as a, t as o } from "../../chunks/playground-build-utils.js";
//#region src/components/playground/browser-test-document.ts
function s(e) {
	return e.replace(/<script\b[\s\S]*?<\/script>/gi, "");
}
async function c(c, l = {}) {
	console.log("browser test project.test", c.test);
	let u = l.kind === "typescript" ? [
		".test.ts",
		".tests.ts",
		".spec.ts",
		".test.tsx",
		".tests.tsx",
		".spec.tsx",
		".test.js",
		".tests.js",
		".spec.js"
	] : [
		".test.js",
		".tests.js",
		".spec.js"
	], d = c.test, f = typeof d == "string" && d !== "" ? r(c, d) : e(c, {
		entry: l.defaultTest,
		priorityPaths: l.kind === "typescript" ? [
			"/main.test.ts",
			"/main.test.tsx",
			"/main.test.js"
		] : ["/main.test.js"],
		extensions: u,
		fallbackToFirstFile: !1,
		ignoreProjectEntry: !0
	});
	if (f === void 0) throw Error(typeof d == "string" && d !== "" ? `Test file not found: ${d}.` : "No test file found.");
	let p = URL.createObjectURL(new Blob(["\nconst api = window.__tp_test__;\n\nif (!api) {\n  throw new Error('Mocha/Chai test API is not initialized.');\n}\n\nexport const describe = api.describe;\nexport const it = api.it;\nexport const expect = api.expect;\n"], { type: "text/javascript" })), m = { imports: {
		...l.importmap?.imports ?? {},
		"@tp/test": p
	} }, h = a(c.files), g = l.kind === "typescript" ? await n(c.files, h, m) : await t(c.files, h, m), _ = g.get(f.path);
	if (_ === void 0) throw Error(`Test module not built: ${f.path}`);
	let v = new Map([...h.entries(), ...g.entries()]), y = r(c, "/index.html");
	return {
		html: `
<!doctype html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mocha@10/mocha.css">
</head>
<body>
  ${y ? s(y.content) : ""}
  <div id="mocha"></div>
  ${o()}
  ${i()}

  <script crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/mocha@10/mocha.js"><\/script>
  <script crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/chai@4/chai.js"><\/script>

<script>
  mocha.setup('bdd');

  window.__tp_test__ = {
    describe: window.describe,
    it: window.it,
    expect: window.chai.expect
  };

  function TpConsoleReporter(runner) {
    let passCount = 0;
    let failCount = 0;
    const suiteTitles = [];

    runner.on('suite', (suite) => {
      if (suite.root) {
        return;
      }

      suiteTitles.push(suite.title);
      console.group(suite.title);
    });

    runner.on('suite end', (suite) => {
      if (suite.root) {
        return;
      }

      console.groupEnd();
    });

    runner.on('pass', (test) => {
      passCount += 1;
      console.info('%c✓ ' + test.title, 'color: green;');
    });

    runner.on('fail', (test, error) => {
      failCount += 1;
      console.error(
        '%c✗ ' + test.title,
        'color: red; font-weight: bold;',
        error,
      );
    });

    runner.once('end', () => {
      const suiteLabel =
        suiteTitles.length === 1 ? suiteTitles[0] : 'All tests';

      if (failCount === 0) {
        console.log(\`\${suiteLabel}: Tests passed: \${passCount}\`);
      } else {
        console.warn(
          \`\${suiteLabel}: Tests finished: \${passCount} passed, \${failCount} failed\`,
        );
      }
    });
  }

  mocha.reporter(TpConsoleReporter);
<\/script>
  <script type="importmap">
${JSON.stringify(m, null, 2)}
  <\/script>

  <script type="module">
    import ${JSON.stringify(_)};
    mocha.run();
  <\/script>
</body>
</html>
`,
		cleanup: () => {
			URL.revokeObjectURL(p);
			for (let e of v.values()) URL.revokeObjectURL(e);
		}
	};
}
//#endregion
export { c as buildBrowserTestDocument };

//# sourceMappingURL=browser-test-document.js.map