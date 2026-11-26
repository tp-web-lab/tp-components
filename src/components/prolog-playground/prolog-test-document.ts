import {
	createTestReporter,
	testResultsHead,
} from "../playground/test-results.js";
import {
	createSwiplRuntimeScript,
	serializePrologData,
} from "./prolog-runtime.js";
/**
 * @module components/prolog-playground/prolog-test-document
 * @summary SWI-Prolog WASM test document builder.
 */

import type { TpExecutionDocument } from "../playground/playground.js";
import {
	createCommonRuntimeScript,
	createConsoleBridgeScript,
	findProjectFile,
	resolveEntryFile,
} from "../playground/playground-build-utils.js";
import type { TpPrologProject } from "./prolog-project.js";
/** Options for building a Prolog test document. */
export interface BuildPrologTestDocumentOptions {
	/** Default test file path. */
	defaultTest?: string;
}

function resolveTestFile(
	project: TpPrologProject,
	defaultTest?: string,
): { path: string; content: string } | undefined {
	if (typeof project.test === "string" && project.test !== "") {
		return findProjectFile(project, project.test);
	}

	return resolveEntryFile(project, {
		entry: defaultTest,
		priorityPaths: ["/test.pl", "/program.test.pl"],
		extensions: [".test.pl", ".tests.pl", ".spec.pl"],
		fallbackToFirstFile: false,
		ignoreProjectEntry: true,
	});
}

/** Builds the SWI-Prolog WASM test execution document. */
export async function buildPrologTestDocument(
	project: TpPrologProject,
	options: BuildPrologTestDocumentOptions = {},
): Promise<TpExecutionDocument> {
	const testFile = resolveTestFile(project, options.defaultTest);

	if (testFile === undefined) {
		throw new Error("No Prolog test file found.");
	}

	const entryFile = resolveEntryFile(project, {
		entry: project.entry,
		priorityPaths: ["/program.pl", "/main.pl"],
		extensions: [".pl"],
		fallbackToFirstFile: false,
	});

	if (entryFile === undefined) {
		throw new Error("No Prolog entry file found.");
	}

	const htmlFile = findProjectFile(project, "/index.html");
	const prologFiles = project.files.filter(
		(file) =>
			file.path.endsWith(".pl") &&
			file.path !== testFile.path &&
			file.path !== project.query,
	);
	const orderedSources = [
		...prologFiles.filter((file) => file.path !== entryFile.path),
		entryFile,
	];
	const sourcesJson = serializePrologData(
		orderedSources.map(({ path, content }) => ({ path, content })),
	);
	const testSourceJson = serializePrologData(testFile.content);
	const body = htmlFile?.content ?? '<main id="prolog-test-output"></main>';

	return {
		html: `
<!doctype html>
<html>
<head>
  ${testResultsHead()}
</head>
<body>
  ${body}
  ${createCommonRuntimeScript()}
  ${createConsoleBridgeScript()}
  <script type="module">
    const sources = ${sourcesJson};
    const testSource = ${testSourceJson};
    const testPath = ${serializePrologData(testFile.path)};
    ${createSwiplRuntimeScript()}

    function ensureOutput() {
      let output = document.querySelector('[data-tp-prolog-test-output]');

      if (output instanceof HTMLElement) {
        return output;
      }

      const target =
        document.querySelector('#prolog-test-output') ?? document.body;
      output = document.createElement('pre');
      output.setAttribute('data-tp-prolog-test-output', '');
      target.append(output);
      return output;
    }

    function stripComments(source) {
      return source
        .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '')
        .replace(/(^|\\n)\\s*%[^\\n]*/g, '$1');
    }

    function splitTopLevel(source) {
      const parts = [];
      let current = '';
      let quote = null;
      let escaped = false;
      let roundDepth = 0;
      let squareDepth = 0;

      for (const char of source) {
        if (escaped) {
          current += char;
          escaped = false;
          continue;
        }

        if (char === '\\\\') {
          current += char;
          escaped = true;
          continue;
        }

        if (quote !== null) {
          current += char;

          if (char === quote) {
            quote = null;
          }

          continue;
        }

        if (char === "'" || char === '"') {
          current += char;
          quote = char;
          continue;
        }

        if (char === '(') {
          roundDepth += 1;
        } else if (char === ')') {
          roundDepth -= 1;
        } else if (char === '[') {
          squareDepth += 1;
        } else if (char === ']') {
          squareDepth -= 1;
        }

        if (char === ',' && roundDepth === 0 && squareDepth === 0) {
          parts.push(current.trim());
          current = '';
          continue;
        }

        current += char;
      }

      const tail = current.trim();

      if (tail !== '') {
        parts.push(tail);
      }

      return parts;
    }

    function parseExpectedList(source) {
      const trimmed = source.trim();

      if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
        return [];
      }

      return splitTopLevel(trimmed.slice(1, -1)).map((item) =>
        item.trim().replace(/^["']|["']$/g, ''),
      );
    }

    function parseTestDirectives(source) {
      const tests = [];
      const cleanSource = stripComments(source);
      let index = 0;

      while (index < cleanSource.length) {
        const start = cleanSource.indexOf(':- test(', index);

        if (start < 0) {
          break;
        }

        let cursor = start + ':- test('.length;
        let quote = null;
        let escaped = false;
        let depth = 1;
        let body = '';

        while (cursor < cleanSource.length && depth > 0) {
          const char = cleanSource[cursor];

          if (escaped) {
            body += char;
            escaped = false;
            cursor += 1;
            continue;
          }

          if (char === '\\\\') {
            body += char;
            escaped = true;
            cursor += 1;
            continue;
          }

          if (quote !== null) {
            body += char;

            if (char === quote) {
              quote = null;
            }

            cursor += 1;
            continue;
          }

          if (char === "'" || char === '"') {
            body += char;
            quote = char;
            cursor += 1;
            continue;
          }

          if (char === '(') {
            depth += 1;
          } else if (char === ')') {
            depth -= 1;

            if (depth === 0) {
              cursor += 1;
              break;
            }
          }

          body += char;
          cursor += 1;
        }

        const args = splitTopLevel(body);

        if (args.length >= 2) {
          tests.push({
            name: args[0].trim(),
            goal: args[1].trim(),
            expected: args.length >= 3 ? parseExpectedList(args[2]) : [],
          });
        }

        index = cursor;
      }

      return tests;
    }

    const reporter = (${createTestReporter.toString()})(document.body, 'PlUnit');
    async function main() {
      const output = ensureOutput();
      reporter.attachLog(output);
      output.textContent = 'Loading SWI-Prolog WASM...';

      const transcript = [];
      const { prolog, FS } = await loadSwipl([], text => { transcript.push(text); }, false);
      await prolog.load_string(":- dynamic tp_test_load_error/1. :- multifile user:message_hook/3. user:message_hook(T,error,_) :- assertz(tp_test_load_error(T)), fail.", '/tp-test-errors.pl');
      for (const source of sources) {
        const path = source.path.startsWith('/') ? source.path : '/' + source.path;
        const directory = path.slice(0, path.lastIndexOf('/'));
        if (directory) FS.mkdirTree(directory);
        FS.writeFile(path, source.content);
      }
      for (const source of sources) await prolog.forEach('load_files(File, [if(not_loaded)])', {File:source.path});
      async function checkLoading() {
        const errors = await prolog.forEach('tp_test_load_error(T), term_string(T,Error)');
        if (errors.length) throw new Error(errors.map(row=>row.Error).join('\\n'));
      }
      await checkLoading();
      if (/:-\\s*begin_tests\\s*\\(/.test(stripComments(testSource))) {
        await prolog.load_string(testSource, testPath);
        await checkLoading();
        await prolog.forEach('use_module(library(plunit))');
        const results = await prolog.forEach('run_tests(all, [cleanup(false)])');
        // The pinned SWI distribution stores completed PlUnit cases here.
        // Read outcomes after run_tests so fixtures, forall and options stay native.
        const rows = await prolog.forEach("(plunit:passed(U,N,_,_,_), Status=passed, D=''; plunit:failed(U,N,_,Reason,_), Status=failed, term_string(Reason,D); plunit:blocked(U,N,_,Reason), Status=skipped, term_string(Reason,D)), term_string(U,Suite), term_string(N,Name)");
        for (const row of rows) {
          reporter.add({suite:row.Suite,name:row.Name,status:row.Status,details:row.D});
          const label = (row.Status === 'passed' ? '✓ ' : row.Status === 'failed' ? '✗ ' : '– ') + row.Suite + '.' + row.Name + ' [' + row.Status + ']';
          const line = (label + (row.D ? ' — ' + row.D : '')).replace(/\\s+/g, ' ');
          (row.Status === 'failed' ? console.error : console.info)(line);
        }
        if (!results.length && !rows.some(row=>row.Status==='failed')) reporter.error(transcript.join('') || 'PlUnit failed');
        reporter.finish();
        const ok = results.length > 0 && !reporter.results.some(row=>row.status==='failed');
        transcript.push(ok ? 'PlUnit: passed' : 'PlUnit: failed');
        output.textContent = transcript.join('');
        output.dataset.testResult = ok ? 'passed' : 'failed';
        window.tpPlaygroundReportHeight?.();
        return;
      }

      const tests = parseTestDirectives(testSource);

      if (tests.length === 0) {
        reporter.finish();
        output.textContent = 'No Prolog test directive found.';
        return;
      }

      const lines = [];
      let passed = 0;


      for (const test of tests) {
        let answers = [];
        let actual = [];
        let errorMessage = '';

        try {
          answers = await prolog.forEach('tp_runtime:run(Source, Text)', {Source:test.goal});
          actual = answers.map(answer => answer.Text);
        } catch (error) {
          errorMessage = prologErrorMessage(error);
        }

        const ok =
          errorMessage === '' &&
          (test.expected.length === 0
            ? answers.length > 0
            : test.expected.every((expected) => actual.includes(expected)));

        reporter.add({suite:'Legacy directives',name:test.name,status:ok?'passed':'failed',details:ok?'':('Expected: '+(test.expected.join('; ')||'success')+'; actual: '+(errorMessage||actual.join('; ')||'false'))});
        if (ok) {
          passed += 1;
          lines.push('✓ ' + test.name);
          console.info(('✓ ' + test.name + ' [passed]').replace(/\\s+/g, ' '));
        } else {
          lines.push('✗ ' + test.name);
          lines.push('  goal: ' + test.goal);
          lines.push('  expected: ' + (test.expected.join('; ') || 'success'));
          lines.push(
            '  actual: ' + (errorMessage || actual.join('; ') || 'false'),
          );
          console.error(('✗ ' + test.name + ' [failed] — expected: ' + (test.expected.join('; ') || 'success') + '; actual: ' + (errorMessage || actual.join('; ') || 'false')).replace(/\\s+/g, ' '));
        }
      }


      reporter.finish();
      lines.push('');
      lines.push('Tests: ' + passed + '/' + tests.length + ' passed');
      output.textContent = lines.join('\\n');
      window.tpPlaygroundReportHeight?.();
    }

    main().catch((error) => {
      const output = ensureOutput();
      reporter.error(error);
      output.textContent = error?.message ?? String(error);
      console.error(error);
      window.tpPlaygroundReportHeight?.();
    });
  </script>
</body>
</html>
`,
	};
}
