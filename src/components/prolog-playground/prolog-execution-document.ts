import {
	createSwiplRuntimeScript,
	serializePrologData,
} from "./prolog-runtime.js";
/**
 * @module components/prolog-playground/prolog-execution-document
 * @summary SWI-Prolog WASM execution document builder.
 */

import type { TpExecutionDocument } from "../playground/playground.js";
import {
	createCommonRuntimeScript,
	createConsoleBridgeScript,
	escapeHtml,
	findProjectFile,
	resolveEntryFile,
} from "../playground/playground-build-utils.js";
import type { TpPrologProject } from "./prolog-project.js";

interface PrologNotebookSource {
	path: string;
	content: string;
}

const notebookSources = new Map<string, Map<number, PrologNotebookSource[]>>();

/** Options for building a Prolog execution document. */
export interface BuildPrologExecutionDocumentOptions {
	/** Entry Prolog source file. */
	entry?: string;
	/** Query Prolog source file. */
	query?: string;
	scope?: string;
	index?: number;
}

function resolveQueryFile(
	project: TpPrologProject,
	query?: string,
): { path: string; content: string } | undefined {
	const queryPath = query ?? project.query;

	if (typeof queryPath === "string" && queryPath !== "") {
		const file = findProjectFile(project, queryPath);

		if (file !== undefined) {
			return file;
		}
	}

	return (
		findProjectFile(project, "/query.pl") ??
		project.files.find((file) => file.path.endsWith(".query.pl"))
	);
}

/** Builds the SWI-Prolog WASM execution document. */
export async function buildPrologExecutionDocument(
	project: TpPrologProject,
	options: BuildPrologExecutionDocumentOptions = {},
): Promise<TpExecutionDocument> {
	const entryFile = resolveEntryFile(project, {
		entry: options.entry,
		priorityPaths: ["/program.pl", "/main.pl"],
		extensions: [".pl"],
		fallbackToFirstFile: false,
	});

	const queryFile = resolveQueryFile(project, options.query);
	const programEntryFile =
		entryFile?.path === queryFile?.path ? undefined : entryFile;
	const htmlFile = findProjectFile(project, "/index.html");
	const prologFiles = project.files.filter(
		(file) =>
			file.path.endsWith(".pl") &&
			file.path !== queryFile?.path &&
			file.path !== project.test,
	);

	const orderedSources = [
		...prologFiles.filter((file) => file.path !== programEntryFile?.path),
		...(programEntryFile === undefined ? [] : [programEntryFile]),
	];
	const ownSources = orderedSources.map(({ path, content }) => ({
		path,
		content,
	}));
	let executionSources = ownSources;
	if (options.scope !== undefined && options.scope !== "") {
		const cells =
			notebookSources.get(options.scope) ??
			new Map<number, PrologNotebookSource[]>();
		cells.set(options.index ?? 0, ownSources);
		notebookSources.set(options.scope, cells);
		executionSources = Array.from(cells.entries())
			.sort(([left], [right]) => left - right)
			.flatMap(([, sources]) => sources);
	}
	const grouped = new Map<string, string[]>();
	for (const source of executionSources) {
		const contents = grouped.get(source.path) ?? [];
		contents.push(source.content);
		grouped.set(source.path, contents);
	}
	const sourcesJson = serializePrologData(
		[...grouped].map(([path, contents]) => ({
			path,
			content: contents.join("\n\n"),
		})),
	);
	const queryJson = serializePrologData(queryFile?.content ?? "");
	const body = htmlFile?.content ?? '<main id="prolog-output"></main>';

	return {
		html: `
<!doctype html>
<html>
<head>
  <style>
    body {
      box-sizing: border-box;
      font-family: system-ui, sans-serif;
      margin: 0;
      padding: 1rem;
    }

    pre[data-tp-prolog-output] {
      background: transparent;
      border: 0;
      color: inherit;
      margin-block: 0;
      overflow: auto;
      padding: 0;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  ${body}
  ${createCommonRuntimeScript()}
  ${createConsoleBridgeScript()}
  <script type="module">
    const sources = ${sourcesJson};
    const querySource = ${queryJson};
    ${createSwiplRuntimeScript()}

    function ensureOutput() {
      let output = document.querySelector('[data-tp-prolog-output]');

      if (output instanceof HTMLElement) {
        return output;
      }

      const target = document.querySelector('#prolog-output') ?? document.body;
      output = document.createElement('pre');
      output.setAttribute('data-tp-prolog-output', '');
      target.append(output);
      return output;
    }

    async function main() {
      const output = ensureOutput();
      output.textContent = 'Loading SWI-Prolog WASM...';

      let transcript = '';
      const append = text => { transcript += text; ensureOutput().textContent = transcript; window.tpPlaygroundReportHeight?.(); };
      const { prolog } = await loadSwipl(sources, append);

      const queries = splitPrologQueries(querySource);

      if (queries.length === 0) {
        if (!transcript) output.remove();
        return;
      }

      for (const query of queries) {
        append('?- ' + query + '\\n');

        let count = 0;
        let failed = false;

        try {
          await prolog.forEach('tp_runtime:run(Source, Text)', {Source:query}, answer => {
            count += 1;
            append(answer.Text + '\\n');
          });
        } catch (error) {
          const message = prologErrorMessage(error);
          if(!window.__tpInlineConsole) console.error(message);
          failed = true;
          append('ERROR: ' + message + '\\n');
        }

        if (count === 0 && !failed) {
          append('false.\\n');
        }

        append('\\n');
      }

      output.textContent = transcript.trimEnd();
      window.tpPlaygroundReportHeight?.();
    }

    main().catch((error) => {
      if(!window.__tpInlineConsole) console.error(error?.message ?? String(error));
      const output = ensureOutput();
      output.textContent = error?.message ?? String(error);
      window.tpPlaygroundReportHeight?.();
    });
  </script>
</body>
</html>
`,
	};
}

/** Returns a small escaped source preview for diagnostics. */
export function createPrologSourcePreview(source: string): string {
	return `<pre><code class="language-prolog">${escapeHtml(source)}</code></pre>`;
}
