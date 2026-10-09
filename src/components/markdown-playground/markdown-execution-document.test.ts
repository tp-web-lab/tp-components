/**
 * @module components/markdown-playground/execution-document-test
 * @summary Tests for Markdown playground execution document generation.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildMarkdownExecutionDocument } from './markdown-execution-document.js';
import { TpMarkdownProject } from './markdown-project.js';

describe('buildMarkdownExecutionDocument', () => {
  it('does not load local Markdown extensions by default', async () => {
    const document = await buildMarkdownExecutionDocument(
      new TpMarkdownProject({
        entry: '/index.md',
        files: [
          {
            path: '/index.md',
            language: 'markdown',
            content: '# Markdown',
          },
        ],
      }),
    );

    expect(document.html).not.toContain('/extensions/markdown/audio/index.js');
    expect(document.html).not.toContain('defaultLocalExtensionUrls');
  });

  it('renders Markdown with the tp-markdown component', async () => {
    const document = await buildMarkdownExecutionDocument(
      new TpMarkdownProject({
        entry: '/index.md',
        extensions: [
          {
            id: 'design',
            label: 'Design',
            url: '/extensions/markdown/design/index.js',
            enabled: true,
          },
        ],
        files: [
          {
            path: '/index.md',
            language: 'markdown',
            content: '# Markdown',
          },
        ],
      }),
    );

    expect(document.html).toContain('<tp-markdown src="/index.md">');
    expect(document.html).toContain('"/index.md":"# Markdown"');
    expect(document.html).not.toContain('<pre><code># Markdown</code></pre>');
    expect(document.html).toContain('/src/components/markdown/markdown.ts');
    expect(document.html).toContain('/src/tp-loader.ts');
    expect(document.html).toContain('/tp-loader.js');
    expect(document.html).toContain('new URL(candidate, window.parent.location.origin).href');
    expect(document.html).not.toContain('window.markdownit');
    expect(document.html).not.toContain('/extensions/markdown/design/index.js');
  });

  it('handles section-numbering as an internal extension', async () => {
    const document = await buildMarkdownExecutionDocument(
      new TpMarkdownProject({
        entry: '/index.md',
        files: [
          {
            path: '/index.md',
            language: 'markdown',
            content: `---
extensions:
  - section-numbering
---

# Title
## Subtitle`,
          },
        ],
      }),
    );

    expect(document.html).toContain('section-numbering');
    expect(document.html).toContain('# Title');
    expect(document.html).toContain('## Subtitle');
    expect(document.html).not.toContain('/extensions/markdown/section-numbering/index.js');
  });

  it('builds packaged Markdown playground examples', async () => {
    const root = join(
      process.cwd(),
      'public/examples/playgrounds/markdown-playground',
    );

    for (const directory of readdirSync(root)) {
      const basePath = join(root, directory);
      const projectPath = join(basePath, 'project.json');
      const entryPath = join(basePath, 'index.md');

      if (!existsSync(projectPath) || !existsSync(entryPath)) {
        continue;
      }

      const project = JSON.parse(
        readFileSync(projectPath, 'utf8'),
      ) as Record<string, unknown>;
      const document = await buildMarkdownExecutionDocument(
        new TpMarkdownProject({
          ...project,
          files: [
            {
              path: '/index.md',
              language: 'markdown',
              content: readFileSync(entryPath, 'utf8'),
            },
          ],
        }),
      );

      expect(document.html).toContain('<tp-markdown src="/index.md">');
      expect(document.html).toContain('tpMarkdownPlaygroundFiles');

      if (directory === '02-md-math') {
        expect(document.html).toContain('mathjax');
        expect(document.html).toContain(':latexmath:');
      }

      if (directory === '03-md-mermaid') {
        expect(document.html).toContain('extensions:\\n  - diagram');
        expect(document.html).toContain('``` diagram');
      }

      if (directory === '05-md-music') {
        expect(document.html).toContain(':::music');
      }

      if (directory === '06-md-map') {
        expect(document.html).toContain(':::map');
      }
    }
  });
});
