import MagicString from 'magic-string';

/** Flatten static module discovery for document renderers without following lazy imports. */
export function collectDocumentPreloads(bundle) {
  const result = {};
  for (const name of ['markdown', 'markup-single-page', 'markup-multi-pages', 'toc', 'icon', 'iframe']) {
    const entry = Object.values(bundle).find(chunk => chunk.type !== 'asset' &&
      chunk.facadeModuleId?.replaceAll('\\', '/').endsWith(`/src/components/${name}/${name}.ts`));
    if (!entry) continue;
    const seen = new Set();
    const visit = file => {
      if (seen.has(file) || !bundle[file] || bundle[file].type === 'asset') return;
      seen.add(file);
      for (const dependency of bundle[file].imports) visit(dependency);
    };
    visit(entry.fileName);
    result[`tp-${name}`] = [...seen];
  }
  return result;
}

export function documentPreloadPlugin() {
  return {
    name: 'tp-document-preloads',
    apply: 'build',
    renderChunk(code, _chunk, _options, meta) {
      const marker = /(["'`])__TP_DOCUMENT_PRELOADS__\1/g;
      if (!marker.test(code)) return null;
      marker.lastIndex = 0;
      const manifest = JSON.stringify(JSON.stringify(collectDocumentPreloads(meta.chunks)));
      const output = new MagicString(code);
      for (const match of code.matchAll(marker)) {
        output.overwrite(match.index, match.index + match[0].length, manifest);
      }
      return { code: output.toString(), map: output.generateMap({ hires: true }) };
    },
  };
}
