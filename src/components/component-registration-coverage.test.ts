import { describe, expect, it } from 'vitest';

import './asciidoc-playground/asciidoc-playground.js';
import './button-group/button-group.js';
import './file-tree/file-tree.js';
import './html-playground/html-playground.js';
import './javascript-notebook/javascript-notebook.js';
import './javascript-playground/javascript-playground.js';
import './sql-notebook/sql-notebook.js';
import './sql-playground/sql-playground.js';
import './typescript-notebook/typescript-notebook.js';
import './typescript-playground/typescript-playground.js';

const components = [
  'tp-asciidoc-playground',
  'tp-button-group',
  'tp-file-tree',
  'tp-html-playground',
  'tp-javascript-notebook',
  'tp-javascript-playground',
  'tp-sql-notebook',
  'tp-sql-playground',
  'tp-typescript-notebook',
  'tp-typescript-playground',
] as const;

describe('component registration coverage', () => {
  it.each(components)('registers %s', (tagName) => {
    expect(customElements.get(tagName)).toBeDefined();
  });
});
