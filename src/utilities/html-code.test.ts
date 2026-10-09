import { describe, expect, it } from 'vitest';

import { formatHtmlForDisplay } from './html-code.js';

describe('formatHtmlForDisplay', () => {
  it('uses the compact syntax for empty and boolean component attributes', () => {
    const source = '<tp-center intrinsic="" center-text="" max-inline-size="24rem"></tp-center>';

    expect(formatHtmlForDisplay(source)).toBe(
      '<tp-center intrinsic center-text max-inline-size="24rem"></tp-center>',
    );
  });

  it('keeps inline markup on the surrounding text line', () => {
    const source = `
      <section>
        <p>Hello, <strong>bold and <em>emphasized</em></strong> text with <a href="/docs">a link</a>.</p>
        <p>Press <kbd>Enter</kbd> to continue.</p>
      </section>
    `;

    expect(formatHtmlForDisplay(source)).toBe([
      '<section>',
      '  <p>Hello, <strong>bold and <em>emphasized</em></strong> text with <a href="/docs">a link</a>.</p>',
      '  <p>Press <kbd>Enter</kbd> to continue.</p>',
      '</section>',
    ].join('\n'));
  });

  it('preserves relative indentation and blank lines in declarative scripts', () => {
    const source = [
      '<tp-asciidoc>',
      '  <script type="tp/asciidoc">',
      '        [source, typescript]',
      '        ----',
      "        function hello(name: string = 'World'): string {",
      '          return `Hello, ${name}!`;',
      '        }',
      '        ----',
      '',
      '        A second paragraph.',
      '  </script>',
      '</tp-asciidoc>',
    ].join('\n');

    expect(formatHtmlForDisplay(source)).toBe([
      '<tp-asciidoc>',
      '  <script type="tp/asciidoc">',
      '    [source, typescript]',
      '    ----',
      "    function hello(name: string = 'World'): string {",
      '      return `Hello, ${name}!`;',
      '    }',
      '    ----',
      '',
      '    A second paragraph.',
      '  </script>',
      '</tp-asciidoc>',
    ].join('\n'));
  });
});
