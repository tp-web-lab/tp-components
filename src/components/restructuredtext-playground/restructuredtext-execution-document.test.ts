/**
 * @module components/restructuredtext-playground/execution-document-test
 * @summary Tests for reStructuredText playground execution document generation.
 */

import { describe, expect, it } from 'vitest';
import { buildRestructuredTextExecutionDocument } from './restructuredtext-execution-document.js';
import { TpRestructuredTextProject } from './restructuredtext-project.js';

describe('buildRestructuredTextExecutionDocument', () => {
  it('renders the project with the shared tp-restructuredtext component', async () => {
    const document = await buildRestructuredTextExecutionDocument(
      new TpRestructuredTextProject({
        entry: '/index.rst',
        files: [
          {
            path: '/index.rst',
            language: 'restructuredtext',
            content: 'Document title\n==============',
          },
        ],
      }),
    );

    expect(document.html).toContain(
      'id="tp-restructuredtext-playground-document"',
    );
    expect(document.html).toContain('src="/index.rst"');
    expect(document.html).toContain('"/index.rst":"Document title\\n=============="');
    expect(document.html).toContain(
      '/src/components/restructuredtext/restructuredtext.ts',
    );
    expect(document.html).toContain('/src/tp-loader.ts');
    expect(document.html).not.toContain('from docutils.core import publish_parts');
    expect(document.html).not.toContain('loadPyodide()');
  });

  it('keeps project files available through the virtual fetch layer', async () => {
    const document = await buildRestructuredTextExecutionDocument(
      new TpRestructuredTextProject({
        entry: '/guide/index.rst',
        files: [
          {
            path: '/guide/index.rst',
            language: 'restructuredtext',
            content: 'Guide',
          },
          {
            path: '/guide/details.rst',
            language: 'restructuredtext',
            content: 'Details',
          },
        ],
      }),
    );

    expect(document.html).toContain('tpRestructuredTextPlaygroundFiles');
    expect(document.html).toContain('"/guide/details.rst":"Details"');
    expect(document.html).toContain('tpRestructuredTextPlaygroundFetch');
  });
});
