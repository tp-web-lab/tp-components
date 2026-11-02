import{n as e}from"../../chunks/tool-loading.js";import{E as t,a as n,c as r,f as i,n as a,s as o,t as s}from"../../chunks/playground-build-utils.js";function c(e){return e.replace(/<script\b[\s\S]*?<\/script>/gi,``)}async function l(l,u={}){console.log(`browser test project.test`,l.test);let d=u.kind===`typescript`?[`.test.ts`,`.tests.ts`,`.spec.ts`,`.test.tsx`,`.tests.tsx`,`.spec.tsx`,`.test.js`,`.tests.js`,`.spec.js`]:[`.test.js`,`.tests.js`,`.spec.js`],f=l.test,p=typeof f==`string`&&f!==``?i(l,f):t(l,{entry:u.defaultTest,priorityPaths:u.kind===`typescript`?[`/main.test.ts`,`/main.test.tsx`,`/main.test.js`]:[`/main.test.js`],extensions:d,fallbackToFirstFile:!1,ignoreProjectEntry:!0});if(p===void 0)throw Error(typeof f==`string`&&f!==``?`Test file not found: ${f}.`:`No test file found.`);let m=URL.createObjectURL(new Blob([`
const api = window.__tp_test__;

if (!api) {
  throw new Error('Mocha/Chai test API is not initialized.');
}

export const describe = api.describe;
export const it = api.it;
export const expect = api.expect;
`],{type:`text/javascript`})),h={imports:{...u.importmap?.imports??{},"@tp/test":m}},g=o(l.files),_=u.kind===`typescript`?await r(l.files,g,h):await n(l.files,g,h),v=_.get(p.path);if(v===void 0)throw Error(`Test module not built: ${p.path}`);let y=new Map([...g.entries(),..._.entries()]),b=i(l,`/index.html`);return{html:`
<!doctype html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mocha@10/mocha.css">
</head>
<body>
  ${b?c(b.content):``}
  <div id="mocha"></div>
  ${s()}
  ${a()}

  <script crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/mocha@10/mocha.js"><\/script>
  <script crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/chai@4/chai.js"><\/script>

<script>
  ${e(`mocha`,`Mocha`,`mocha.version`)}
  ${e(`chai`,`Chai`,`chai.version`)}
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
${JSON.stringify(h,null,2)}
  <\/script>

  <script type="module">
    import ${JSON.stringify(v)};
    mocha.run();
  <\/script>
</body>
</html>
`,cleanup:()=>{URL.revokeObjectURL(m);for(let e of y.values())URL.revokeObjectURL(e)}}}export{l as buildBrowserTestDocument};
//# sourceMappingURL=browser-test-document.js.map