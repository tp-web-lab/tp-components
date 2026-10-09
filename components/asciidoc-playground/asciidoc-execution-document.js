import { Ct as e, Lt as t, ft as n, pt as r } from "../../chunks/lib/typescript/typescript.js";
//#region src/components/asciidoc-playground/asciidoc-execution-document.ts
var i = "https://cdn.jsdelivr.net/npm/@asciidoctor/core@3.0.4/dist/browser/asciidoctor.js";
function a(e) {
	return e.replace(/<script\b[\s\S]*?<\/script>/gi, "");
}
function o(e) {
	return (e ?? []).filter((e) => e.enabled !== !1);
}
async function s(s, c = {}) {
	let l = t(s, {
		entry: c.entry,
		priorityPaths: ["/index.adoc", "/main.adoc"],
		extensions: [".adoc", ".asciidoc"],
		fallbackToFirstFile: !1
	});
	if (l === void 0) throw Error("No AsciiDoc entry file found.");
	let u = e(s, "/tp-components/index.html"), d = u ? a(u.content) : "<main id=\"app\"></main>", f = JSON.stringify(Object.fromEntries(s.files.map((e) => [e.path, e.content]))), p = JSON.stringify(l.path), m = JSON.stringify(s.attributes ?? {}), h = JSON.stringify(o(s.extensions));
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

    #app {
      max-inline-size: 72rem;
    }

    pre,
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    table {
      border-collapse: collapse;
    }

    th,
    td {
      border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);
      padding: 0.35rem 0.5rem;
    }
  </style>
</head>
<body>
  ${d}
  ${n()}
  ${r()}

<script>
async function loadCommonJsExtension(extension) {
  const response = await fetch(extension.url);

  if (!response.ok) {
    throw new Error('Unable to load extension: ' + extension.url);
  }

  const source = await response.text();

  const module = { exports: {} };
  const exports = module.exports;

  const runner = new Function(
    'module',
    'exports',
    source + '\\nreturn module.exports;',
  );

  const exported = runner(module, exports);

  window.__tp_asciidoc_extensions__ =
    window.__tp_asciidoc_extensions__ ?? {};

  window.__tp_asciidoc_extensions__[extension.id] = exported;

  return exported;
}

function resolveProjectRelativePath(fromPath, relativePath) {
  const safeFromPath =
    typeof fromPath === 'string' && fromPath !== ''
      ? fromPath
      : ${p};

  const safeRelativePath = String(relativePath);

  if (safeRelativePath.startsWith('/')) {
    return safeRelativePath;
  }

  const fromSegments = safeFromPath.split('/').filter(Boolean);
  fromSegments.pop();

  const outputSegments = [...fromSegments];

  for (const segment of safeRelativePath.split('/')) {
    if (segment === '' || segment === '.') {
      continue;
    }

    if (segment === '..') {
      outputSegments.pop();
      continue;
    }

    outputSegments.push(segment);
  }

  return '/' + outputSegments.join('/');
}

function registerProjectIncludeProcessor(asciidoctor, registry, files) {
  registry.includeProcessor(function () {
    this.handles(() => true);

    this.process((doc, reader, target, attributes) => {
      const currentFile =
        typeof reader.file === 'string' && reader.file !== ''
          ? reader.file
          : ${p};

      const path = resolveProjectRelativePath(currentFile, String(target));      const content = files[path];

      if (typeof content !== 'string') {
        throw new Error('AsciiDoc include not found: ' + target + ' resolved as ' + path);
      }

      reader.pushInclude(
        content,
        path,
        path,
        1,
        attributes,
      );
    });
  });
}

function registerLoadedExtension(asciidoctor, registry, extension) {
  const exported = window.__tp_asciidoc_extensions__?.[extension.id];

  if (exported && typeof exported.register === 'function') {
    exported.register(registry);
    console.info('Extension registered:', extension.label);
    return;
  }

  if (typeof exported === 'function') {
    exported(registry, asciidoctor);
    console.info('Extension registered:', extension.label);
    return;
  }

  console.warn('Extension not registered:', extension.label);
}

function fixInternalAnchorLinks(root) {
  const links = root.querySelectorAll('a[href^="#"]');

  for (const link of links) {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');

      if (href === null || href === '#') {
        return;
      }

      event.preventDefault();

      const id = href.slice(1);
      const target = root.querySelector('#' + CSS.escape(id));

      if (!(target instanceof HTMLElement)) {
        console.warn('Internal anchor target not found:', href);
        return;
      }

      const scrollTarget =
        target.closest('dt, dd, section, article') ?? target;

      if (scrollTarget instanceof HTMLElement) {
        scrollTarget.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  }
}

async function main() {
  try {
const asciidoctorModule = await import(${JSON.stringify(i)});
const AsciidoctorFactory =
  asciidoctorModule.default ??
  asciidoctorModule.Asciidoctor ??
  asciidoctorModule;

if (typeof AsciidoctorFactory !== 'function') {
  throw new Error('Asciidoctor browser runtime was not loaded.');
}

const asciidoctor = AsciidoctorFactory();

    const files = ${f};
    const entryPath = ${p};
    const attributes = ${m};
    const extensions = ${h};

    for (const extension of extensions) {
      await loadCommonJsExtension(extension);
    }

    const registry = asciidoctor.Extensions.create();

    registerProjectIncludeProcessor(asciidoctor, registry, files);

    for (const extension of extensions) {
      registerLoadedExtension(asciidoctor, registry, extension);
    }

    const source = files[entryPath];

    if (typeof source !== 'string') {
      throw new Error('AsciiDoc entry file not found: ' + entryPath);
    }

    const html = asciidoctor.convert(source, {
      safe: 'unsafe',
      base_dir: '/',
      to_file: false,
      attributes,
      extension_registry: registry,
    });

    let app = document.getElementById('app');

    if (!app) {
      app = document.createElement('main');
      app.id = 'app';
      document.body.append(app);
    }

    app.innerHTML = String(html);
    fixInternalAnchorLinks(app);

    if (typeof window.tpPlaygroundReportHeight === 'function') {
      window.tpPlaygroundReportHeight();
    }
  } catch (error) {
    console.error(error);
  }
}

void main();
<\/script>
</body>
</html>
` };
}
//#endregion
export { s as buildAsciidocExecutionDocument };

