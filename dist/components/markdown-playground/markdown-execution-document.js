import { Rt as e, mt as t, pt as n, wt as r } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/markdown-playground/markdown-execution-document.ts
function i(e) {
	return JSON.stringify(e).replaceAll("<\/script", "<\\/script");
}
async function a(a, o = {}) {
	let s = e(a, {
		entry: o.entry,
		priorityPaths: ["/index.md", "/main.md"],
		extensions: [".md", ".markdown"],
		fallbackToFirstFile: !1
	});
	if (s === void 0) throw Error("No Markdown entry file found.");
	let c = r(a, "/index.html")?.content ?? "", l = i(Object.fromEntries(a.files.map((e) => [e.path, e.content]))), u = i(s.path);
	return { html: `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  ${c}
  <style>
    body {
      font-family: system-ui, sans-serif;
      line-height: 1.5;
      margin: 0;
      padding: 1rem;
    }

    tp-markdown {
      display: block;
      max-inline-size: 72rem;
    }
  </style>
</head>
<body>
  ${n()}
  ${t()}

  <script>
    const tpMarkdownPlaygroundFiles = ${l};
    const tpMarkdownPlaygroundFetch = window.fetch.bind(window);

    window.fetch = (input, init) => {
      const requestUrl =
        input instanceof Request
          ? input.url
          : typeof input === 'string' || input instanceof URL
            ? String(input)
            : '';

      try {
        const url = new URL(requestUrl, window.location.href);
        const content = tpMarkdownPlaygroundFiles[url.pathname];

        if (typeof content === 'string') {
          return Promise.resolve(new Response(content, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
            },
          }));
        }
      } catch {
        const content = tpMarkdownPlaygroundFiles[requestUrl];

        if (typeof content === 'string') {
          return Promise.resolve(new Response(content, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
            },
          }));
        }
      }

      return tpMarkdownPlaygroundFetch(input, init);
    };

    document.addEventListener('tp-markdown-rendered', () => {
      if (typeof window.tpPlaygroundReportHeight === 'function') {
        window.tpPlaygroundReportHeight();
      }
    }, true);
  <\/script>

  <tp-markdown src=${u}></tp-markdown>

  <script type="module">
    const isViteDev =
      window.parent?.document?.querySelector('script[src*="/@vite/client"]') !== null;

    async function importFirstAvailable(candidates, label) {
      let lastError = null;

      for (const candidate of candidates) {
        try {
          const url = new URL(candidate, window.parent.location.origin).href;
          await import(url);
          return;
        } catch (error) {
          lastError = error;
        }
      }

      throw new Error(\`Unable to load \${label}: \${String(lastError)}\`);
    }

    await importFirstAvailable(
      isViteDev
        ? [
            '/src/components/markdown/markdown.ts',
            '/components/markdown/markdown.js',
            '/dist/components/markdown/markdown.js',
          ]
        : [
            '/components/markdown/markdown.js',
            '/dist/components/markdown/markdown.js',
            '/src/components/markdown/markdown.ts',
          ],
      'tp-markdown',
    );

    await importFirstAvailable(
      isViteDev
        ? ['/src/tp-loader.ts', '/tp-loader.js', '/dist/tp-loader.js']
        : ['/tp-loader.js', '/dist/tp-loader.js', '/src/tp-loader.ts'],
      'tp-loader.js',
    );
  <\/script>
</body>
</html>
` };
}
//#endregion
export { a as buildMarkdownExecutionDocument };

//# sourceMappingURL=markdown-execution-document.js.map