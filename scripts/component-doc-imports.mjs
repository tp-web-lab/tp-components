/* Shared Imports section for generated component documentation. */
export function imports(directory) {
  return `::: tp-tabs
script
: Autoloading:

  \`\`\`html
  <script type="module" src="tp-loader.js"></script>
  \`\`\`

  Cherry picking:

  \`\`\`html
  <script type="module" src="/path/to/components/${directory}/${directory}.js"></script>
  \`\`\`

import
: \`\`\`js
  import "/path/to/components/${directory}/${directory}.js";
  \`\`\`

bundler
: \`\`\`js
  import "@tp/tp-components/components/${directory}/${directory}.js";
  \`\`\`
:::`;
}


/** Synchronizes only Imports, preserving subsequent sections and authored prose. */
export function syncImports(markdown, directory) {
  const pattern = /^### Imports[^\n]*\n[\s\S]*?(?=^#{1,3} |^<!-- tp-docgen:dependencies:start -->|(?![\s\S]))/m;
  const block = `### Imports\n\n${imports(directory)}\n\n`;
  if (pattern.test(markdown)) return markdown.replace(pattern, () => block);
  const apiEnd = '<!-- /tp-docgen:api -->';
  if (markdown.includes(apiEnd)) return markdown.replace(apiEnd, `${apiEnd}\n\n${block}`);
  return markdown;
}

