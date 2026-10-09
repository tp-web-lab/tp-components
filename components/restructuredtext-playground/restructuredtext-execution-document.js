import { Ct as e, Lt as t, ft as n, pt as r } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/restructuredtext-playground/restructuredtext-execution-document.ts
function i(e) {
	return JSON.stringify(e).replaceAll("<\/script", "<\\/script");
}
function a(e) {
	return e.replace(/<script(?![^>]*\bsrc=)[\s\S]*?<\/script>/gi, "");
}
async function o(o, s = {}) {
	let c = t(o, {
		entry: s.entry,
		priorityPaths: ["/index.rst", "/main.rst"],
		extensions: [
			".rst",
			".rest",
			".txt"
		],
		fallbackToFirstFile: !1
	});
	if (c === void 0) throw Error("No reStructuredText entry file found.");
	let l = e(o, "/index.html"), u = l === void 0 ? "<main id=\"app\"></main>" : a(l.content), d = i(Object.fromEntries(o.files.map((e) => [e.path, e.content]))), f = i(c.path), p = i((o.extensions ?? []).filter((e) => e.enabled !== !1));
	return { html: `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: system-ui, sans-serif;
      line-height: 1.5;
      margin: 0;
      padding: 1rem;
    }

    #app,
    tp-restructuredtext {
      display: block;
      max-inline-size: 72rem;
    }
  </style>
</head>
<body>
  ${u}
  <tp-restructuredtext
    id="tp-restructuredtext-playground-document"
    src=${f}
  ></tp-restructuredtext>
  ${n()}
  ${r()}

  <script type="module">
    const tpRestructuredTextPlaygroundFiles = ${d};
    const tpRestructuredTextPlaygroundFetch = window.fetch.bind(window);

    window.fetch = (input, init) => {
      const requestUrl =
        input instanceof Request
          ? input.url
          : typeof input === 'string' || input instanceof URL
            ? String(input)
            : '';

      try {
        const url = new URL(requestUrl, window.location.href);
        const content = tpRestructuredTextPlaygroundFiles[url.pathname];

        if (typeof content === 'string') {
          return Promise.resolve(new Response(content, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
            },
          }));
        }
      } catch {
        const content = tpRestructuredTextPlaygroundFiles[requestUrl];

        if (typeof content === 'string') {
          return Promise.resolve(new Response(content, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
            },
          }));
        }
      }

      return tpRestructuredTextPlaygroundFetch(input, init);
    };

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

    async function loadRuntimeExtension(extension) {
      const response = await fetch(extension.url);

      if (!response.ok) {
        throw new Error('Unable to load extension: ' + extension.url);
      }

      const source = await response.text();
      if (source.trim().startsWith('<')) {
        throw new Error(
          'Extension URL returned HTML instead of JavaScript: ' + extension.url,
        );
      }

      const module = { exports: {} };
      const runner = new Function(
        'module',
        'exports',
        source + '\\nreturn module.exports;',
      );
      return runner(module, module.exports);
    }

    const documentElement = document.getElementById(
      'tp-restructuredtext-playground-document',
    );
    if (!(documentElement instanceof HTMLElement)) {
      throw new Error('Unable to initialize tp-restructuredtext.');
    }

    let app = document.getElementById('app');
    if (app === null) {
      app = document.createElement('main');
      app.id = 'app';
      document.body.append(app);
    }
    app.replaceChildren(documentElement);

    documentElement.addEventListener('tp-restructuredtext-rendered', async () => {
      const output = documentElement.querySelector('.tp-restructuredtext-output');
      if (output instanceof HTMLElement) {
        for (const extension of ${p}) {
          const plugin = await loadRuntimeExtension(extension);
          if (typeof plugin === 'function') {
            await plugin(output, { extension, console });
          }
        }
      }

      if (typeof window.tpPlaygroundReportHeight === 'function') {
        window.tpPlaygroundReportHeight();
      }
    });

    await importFirstAvailable(
      isViteDev
        ? [
            '/tp-components/components/restructuredtext/restructuredtext.ts',
            '/tp-components/components/restructuredtext/restructuredtext.js',
            '/tp-components/components/restructuredtext/restructuredtext.js',
          ]
        : [
            '/tp-components/components/restructuredtext/restructuredtext.js',
            '/tp-components/components/restructuredtext/restructuredtext.js',
            '/tp-components/components/restructuredtext/restructuredtext.ts',
          ],
      'tp-restructuredtext',
    );

    await importFirstAvailable(
      isViteDev
        ? ['/tp-components/tp-loader.js', '/tp-components/tp-loader.js', '/tp-components/tp-loader.js']
        : ['/tp-components/tp-loader.js', '/tp-components/tp-loader.js', '/tp-components/tp-loader.js'],
      'tp-loader.js',
    );

  <\/script>
</body>
</html>
` };
}
//#endregion
export { o as buildRestructuredTextExecutionDocument };

