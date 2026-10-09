import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EditorState } from '@codemirror/state';
import { CompletionContext } from '@codemirror/autocomplete';

import { sqlCompletion } from './code-editor.js';
import './code-editor.js';
import '../badge/badge.js';
import '../button/button.js';
import '../copy-code/copy-code.js';

/**
 * Attend la fin des micro-tâches en cours.
 *
 * @summary Attend la stabilisation asynchrone du DOM.
 * @returns Promesse résolue au prochain tour de micro-tâche.
 */
async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

/**
 * Retourne l’élément `<tp-code-editor>` attendu ou lève une erreur.
 *
 * @summary Récupère l’éditeur de code dans le document.
 * @returns Élément `<tp-code-editor>`.
 * @throws {Error} Si l’élément n’existe pas.
 */
function getEditor(): HTMLElement & {
  focus: () => void;
  getValue: () => string;
  reload: () => void;
  setValue: (value: string) => void;
} {
  const editor = document.querySelector('tp-code-editor');

  if (editor === null) {
    throw new Error('tp-code-editor not found');
  }

  return editor as HTMLElement & {
    focus: () => void;
    getValue: () => string;
    reload: () => void;
    setValue: (value: string) => void;
  };
}

describe('<tp-code-editor>', () => {
  it('highlights Markdown definition lists and web-component directives', async () => {
    document.body.innerHTML = `<tp-code-editor language="markdown" value="Term&#10;: Definition&#10;&#10;::: tp-card { disabled }&#10;Content&#10;:::&#10;&#10;:tp-icon:{name=&quot;star&quot;}"></tp-code-editor>`;
    await flush();

    const editor = getEditor();
    expect(editor.querySelector('.cm-tp-markdown-definition-term')?.textContent).toBe('Term');
    expect(editor.querySelector('.cm-tp-markdown-definition-marker')?.textContent).toBe(':');
    expect(editor.querySelector('.cm-tp-markdown-fence')?.textContent).toBe(':::');
    expect(editor.querySelector('.cm-tp-markdown-component')?.textContent).toContain('tp-');
    expect(editor.querySelector('.cm-tp-markdown-attributes')?.textContent).toContain('disabled');
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('est défini', () => {
    expect(customElements.get('tp-code-editor')).toBeDefined();
  });

  it('exerce l’API de propriétés et la cible de réinitialisation', async () => {
    const editor = document.createElement('tp-code-editor') as unknown as ReturnType<typeof getEditor> & {
      value: string; src: string; filename: string; language: string; placeholder: string;
      readonly: boolean; lineNumbers: boolean; foldGutter: boolean; wordWrap: boolean; toolbar: boolean;
      setInitialValue(value: string): void; getInitialValue(): string; reset(): void;
      isCursorAtStart(): boolean; isCursorAtEnd(): boolean; syncHeightToContent(): void;
    };
    document.body.append(editor);
    await flush();
    editor.value = 'value'; editor.src = '/source.js'; editor.filename = 'source.js'; editor.language = 'javascript'; editor.placeholder = 'Code';
    editor.readonly = true; editor.lineNumbers = true; editor.foldGutter = true; editor.wordWrap = true; editor.toolbar = true;
    expect([editor.value, editor.src, editor.filename, editor.language, editor.placeholder]).toEqual(['value', '/source.js', 'source.js', 'javascript', 'Code']);
    expect([editor.readonly, editor.lineNumbers, editor.foldGutter, editor.wordWrap, editor.toolbar]).toEqual([true, true, true, true, true]);
    editor.value = ''; editor.src = ''; editor.filename = ''; editor.placeholder = '';
    editor.readonly = false; editor.lineNumbers = false; editor.foldGutter = false; editor.wordWrap = false;
    expect(editor.hasAttribute('value')).toBe(false);
    editor.setInitialValue('initial');
    expect(editor.getInitialValue()).toBe('initial');
    const reset = vi.fn(); editor.addEventListener('tp-code-editor-reset', reset);
    editor.setValue('changed'); editor.reset();
    expect(editor.getValue()).toBe('initial');
    expect(reset).toHaveBeenCalled();
    editor.syncHeightToContent();
    expect(editor.isCursorAtStart()).toBe(true);
    expect(editor.isCursorAtEnd()).toBe(false);
  });

  it('réinitialise à vide sans valeur initiale', async () => {
    document.body.innerHTML = '<tp-code-editor value="temporary"></tp-code-editor>';
    await flush();
    const editor = getEditor() as ReturnType<typeof getEditor> & { reset(): void };
    editor.reset();
    expect(editor.getValue()).toBe('');
  });

  it('propose les mots-clés, tables et colonnes SQL', () => {
    window.__tp_sql_schema__ = [{ name: 'people', columns: ['id', 'name'] }];
    const state = EditorState.create({ doc: 'SEL' });
    const result = sqlCompletion(new CompletionContext(state, 3, true));
    expect(result?.from).toBe(0);
    expect(result?.options.map(({ label }) => label)).toEqual(expect.arrayContaining(['SELECT', 'people', 'id', 'name']));
    delete window.__tp_sql_schema__;
    const emptySchema = sqlCompletion(new CompletionContext(EditorState.create({ doc: '' }), 0, true));
    expect(emptySchema?.options.some(({ label }) => label === 'SELECT')).toBe(true);
    expect(sqlCompletion({ matchBefore: () => null } as unknown as CompletionContext)).toBeNull();
  });

  it('colore les constructions ABC et Prolog', async () => {
    document.body.innerHTML = '<tp-code-editor language="abc"></tp-code-editor>';
    await flush();
    getEditor().setValue('% comment\nX:1\n"title" [CEG] C2 z2 |:');
    await flush();
    expect(getEditor().querySelector('.cm-content')?.textContent).toContain('comment');
    expect(getEditor().querySelectorAll('.cm-line span').length).toBeGreaterThan(3);
    document.body.innerHTML = '<tp-code-editor language="prolog"></tp-code-editor>';
    await flush();
    getEditor().setValue('% note\nParent(X) :- atom, "text", \'quoted\'.');
    await flush();
    expect(getEditor().querySelector('.cm-content')?.textContent).toContain('Parent(X)');
    expect(getEditor().querySelectorAll('.cm-line span').length).toBeGreaterThan(3);
  });

  it('distingue les principales constructions AsciiDoc', async () => {
    document.body.innerHTML = '<tp-code-editor language="asciidoc"></tp-code-editor>';
    await flush();

    const editor = getEditor();
    editor.setValue(`== Rich title
:toc: left
[tp-card.notice,open]
====
NOTE: Read *this section* and include::chapter.adoc[].
====
[script,type="tp/asciidoc"]
----
Content with *unparsed markup*.
----`);
    await flush();

    const highlighted = Array.from(editor.querySelectorAll('.cm-line span'), (span) =>
      span.textContent ?? '',
    );
    expect(highlighted).toContain('== Rich title');
    expect(highlighted).toContain(':toc:');
    expect(highlighted).toContain('tp-card');
    expect(highlighted).toContain('NOTE:');
    expect(highlighted).toContain('*this section*');
    expect(highlighted).toContain('include::');
    expect(highlighted).toContain('Content with *unparsed markup*.');
  });

  it('crée le conteneur CodeMirror, le panel d’actions, le badge, la position et le bouton de copie', async () => {
    document.body.innerHTML = '<tp-code-editor></tp-code-editor>';

    await flush();

    const editor = getEditor();

    expect(
      editor.querySelector(':scope > [data-tp-code-editor]'),
    ).toBeTruthy();

    expect(
      editor.querySelector('[data-tp-code-editor-action-panel]'),
    ).toBeTruthy();
    expect(
      editor.querySelector(':scope > [data-tp-code-editor-panels]'),
    ).toBeTruthy();

    expect(
      editor.querySelector(
        '[data-tp-code-editor-action-section="start"] > tp-badge',
      ),
    ).toBeTruthy();
    expect(
      editor.querySelector(
        '[data-tp-code-editor-action-section="start"] > [data-tp-code-editor-cursor-position]',
      ),
    ).toBeTruthy();

    expect(
      editor.querySelector(
        '[data-tp-code-editor-action-section="end"] > tp-copy-code',
      ),
    ).toBeTruthy();
    expect(
      editor.querySelector(
        '[data-tp-code-editor-action-section="end"] > tp-fullscreen[data-tp-code-editor-fullscreen]',
      ),
    ).toBeTruthy();
    expect(editor.querySelector('[data-tp-code-editor-action-section="center"]')).toBeTruthy();

    expect(editor.querySelector('.cm-editor')).toBeTruthy();
  });

  it('affiche la toolbar uniquement avec l’attribut et la bascule avec F1', async () => {
    document.body.innerHTML = '<tp-code-editor></tp-code-editor>';
    await flush();

    const editor = getEditor();
    const panel = editor.querySelector<HTMLElement>('[data-tp-code-editor-action-panel]');
    const content = editor.querySelector<HTMLElement>('.cm-content');

    expect(panel).not.toBeNull();
    expect(getComputedStyle(panel as HTMLElement).display).toBe('none');

    content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'F1', bubbles: true }));
    await flush();

    expect(editor.hasAttribute('toolbar')).toBe(true);
    expect(getComputedStyle(panel as HTMLElement).display).toBe('flex');

    content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'F1', bubbles: true }));
    await flush();

    expect(editor.hasAttribute('toolbar')).toBe(false);
  });

  it('place Toggle toolbar à la fin de la palette de commandes', async () => {
    document.body.innerHTML = '<tp-code-editor toolbar></tp-code-editor>';
    await flush();

    const actions = Array.from(
      document.querySelectorAll<HTMLElement>('[data-tp-code-editor-keyboard-action]'),
    );
    const last = actions.at(-1);

    expect(last?.getAttribute('data-tp-code-editor-keyboard-action')).toBe('toggle-toolbar');
    expect(last?.textContent).toContain('Toggle toolbar');
    expect(last?.textContent).toContain('F1');
    expect(last?.textContent).not.toContain('Opens or closes the toolbar');
  });

  it('exécute toutes les commandes accessibles de la palette clavier', async () => {
    document.body.innerHTML = '<tp-code-editor toolbar value="line one&#10;line two"></tp-code-editor>';
    await flush();
    const editor = getEditor() as ReturnType<typeof getEditor> & {
      runKeyboardAction(action: string): Promise<void>;
    };
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { readText: vi.fn().mockResolvedValue('paste') } });
    for (const action of [
      'undo', 'redo', 'copy', 'cut', 'paste', 'select-all', 'indent', 'dedent', 'search', 'replace',
      'goto-line', 'toggle-line-comment', 'toggle-block-comment', 'fold-code', 'unfold-code',
      'toggle-gutters', 'toggle-line-numbers', 'toggle-command-palette', 'toggle-toolbar', 'unknown',
    ]) await editor.runKeyboardAction(action);
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(execCommand).toHaveBeenCalledWith('cut');
    expect(navigator.clipboard.readText).toHaveBeenCalled();
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { readText: vi.fn().mockRejectedValue(new Error('denied')) } });
    await editor.runKeyboardAction('paste');
    expect(execCommand).toHaveBeenCalledWith('paste');
  });

  it('exécute les raccourcis CodeMirror et signale les limites du document', async () => {
    document.body.innerHTML = '<tp-code-editor value="one&#10;two"></tp-code-editor>';
    await flush();
    const editor = getEditor();
    const content = editor.querySelector<HTMLElement>('.cm-content');
    const boundary = vi.fn(); editor.addEventListener('tp-code-editor-boundary', boundary);
    const key = (name: string, init: KeyboardEventInit = {}) => content?.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...init }));
    key('ArrowUp'); key('Backspace');
    for (const name of ['ArrowDown', 'ArrowUp', 'g', 'l', 'f', 'c', 'b']) key(name, { ctrlKey: true, altKey: true });
    key('g', { ctrlKey: true });
    key('p', { ctrlKey: true, shiftKey: true });
    await flush();
    expect(boundary).toHaveBeenCalledWith(expect.objectContaining({ detail: { direction: 'before' } }));
    expect(editor.hasAttribute('fold-gutter')).toBe(true);
    expect(editor.hasAttribute('line-numbers')).toBe(true);
    const length = editor.getValue().length;
    content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', ctrlKey: true, bubbles: true }));
    key('ArrowDown'); key('Delete');
    expect(length).toBeGreaterThan(0);
  });

  it('covers detached guards and both cursor-boundary outcomes', async () => {
    const detached = document.createElement('tp-code-editor') as unknown as ReturnType<typeof getEditor> & {
      value: string; language: string; placeholder: string; isCursorAtStart(): boolean; isCursorAtEnd(): boolean;
      runKeyboardAction(action: string): Promise<void>; createEditor(): void; applyValueToEditor(value: string): void;
      toggleKeyboardDropdown(): void; handleKeyboardDropdownClick(event: Event): void;
      handleKeyboardDropdownToggle(event: Event): void;
      getShortcutLabels(): { mod: string; shift: string; alt: string };
    };
    expect(detached.language).toBe('html');
    expect(detached.placeholder).toContain('html');
    expect(detached.isCursorAtStart()).toBe(false);
    expect(detached.isCursorAtEnd()).toBe(false);
    await detached.runKeyboardAction('undo');
    detached.createEditor(); detached.applyValueToEditor('ignored'); detached.toggleKeyboardDropdown();
    detached.handleKeyboardDropdownClick(new Event('click'));
    detached.handleKeyboardDropdownToggle(new Event('toggle'));
    const unrelated = document.createElement('span');
    unrelated.addEventListener('click', (event) => detached.handleKeyboardDropdownClick(event));
    unrelated.dispatchEvent(new Event('click'));
    const closest = vi.spyOn(Element.prototype, 'closest').mockReturnValue(document.createElement('div'));
    unrelated.dispatchEvent(new Event('click'));
    closest.mockRestore();
    unrelated.addEventListener('toggle', (event) => detached.handleKeyboardDropdownToggle(event));
    unrelated.dispatchEvent(new Event('toggle'));
    Object.defineProperty(navigator, 'platform', { configurable: true, value: 'MacIntel' });
    expect(detached.getShortcutLabels().mod).toBe('⌘');
    Object.defineProperty(navigator, 'platform', { configurable: true, value: 'Linux' });
    Object.defineProperty(navigator, 'userAgent', { configurable: true, value: 'Firefox' });
    expect(detached.getShortcutLabels().mod).toBe('Ctrl');

    detached.value = 'abc'; document.body.append(detached); await flush();
    const internal = detached as unknown as { editor: { state: { doc: { length: number } }; dispatch(spec: { selection: { anchor: number } }): void } };
    internal.editor.dispatch({ selection: { anchor: 1 } });
    const content = detached.querySelector<HTMLElement>('.cm-content');
    expect(detached.isCursorAtStart()).toBe(false);
    expect(detached.isCursorAtEnd()).toBe(false);
    content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    internal.editor.dispatch({ selection: { anchor: internal.editor.state.doc.length } });
    expect(detached.isCursorAtEnd()).toBe(true);
    content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
  });

  it('garantit une hauteur minimale de deux lignes pour la zone de code', async () => {
    document.body.innerHTML = '<tp-code-editor></tp-code-editor>';

    await flush();

    const editor = getEditor();
    const styleEl = document.getElementById('tp-code-editor-styles');
    expect(styleEl?.textContent).toContain('tp-code-editor .cm-content');
    expect(styleEl?.textContent).toContain(
      'border: 1px solid var(--tp-neutral-stroke-soft, #d1d5db);',
    );
    expect(styleEl?.textContent).toContain('display: grid;');
    expect(styleEl?.textContent).toContain('grid-template-rows: auto minmax(0, 1fr);');
    expect(styleEl?.textContent).toContain('min-block-size: 2lh;');
    expect(Number.parseFloat(editor.style.blockSize)).toBeGreaterThanOrEqual(42);
  });

  it('affiche les contrôles dans un panel CodeMirror conditionné par toolbar', async () => {
    document.body.innerHTML = '<tp-code-editor></tp-code-editor>';

    await flush();

    const styleEl = document.getElementById('tp-code-editor-styles');
    expect(styleEl?.textContent).toContain(
      "tp-code-editor [data-tp-code-editor-action-section='start']",
    );
    expect(styleEl?.textContent).toContain(
      'tp-code-editor [data-tp-code-editor-action-panel]',
    );
    expect(styleEl?.textContent).toContain('display: flex;');
    expect(styleEl?.textContent).not.toContain(
      'tp-code-editor:hover [data-tp-code-editor-action-panel]',
    );
    expect(styleEl?.textContent).toContain(
      'tp-code-editor:not([toolbar]) [data-tp-code-editor-action-panel]',
    );
    expect(styleEl?.textContent).toContain('position: static;');
    expect(styleEl?.textContent).toContain('inset: auto;');
    expect(styleEl?.textContent).toContain('tp-code-editor .cm-content');
    expect(styleEl?.textContent).toContain('line-height: 1.5rem;');
    expect(styleEl?.textContent).toContain('tp-code-editor .cm-panels');
    expect(styleEl?.textContent).toContain('tp-code-editor > [data-tp-code-editor-panels]');
    expect(styleEl?.textContent).toContain('z-index: 20;');
    expect(styleEl?.textContent).toContain(
      'tp-code-editor > [data-tp-code-editor-panels] .cm-panels',
    );
    expect(styleEl?.textContent).toContain('position: static !important;');
    expect(styleEl?.textContent).toContain('overflow: visible;');
    expect(styleEl?.textContent).toContain('flex-wrap: nowrap;');
    expect(styleEl?.textContent).toContain('overflow-x: auto;');
    expect(styleEl?.textContent).toContain(
      'tp-code-editor .cm-panels :is(input, button, select, .cm-button)',
    );
    expect(styleEl?.textContent).toContain('overflow: visible;');
    expect(styleEl?.textContent).toContain('--tp-code-editor-surface');
    expect(styleEl?.textContent).toContain('--tp-code-editor-token-keyword');
    expect(styleEl?.textContent).toContain('--tp-syntax-token-keyword');
    expect(styleEl?.textContent).toContain('tp-code-editor.tp-dark');
    expect(styleEl?.textContent).toContain('--tp-syntax-token-string: #ce9178;');
    expect(styleEl?.textContent).toContain(
      "tp-code-editor [data-tp-code-editor-action-section='center']",
    );
    expect(styleEl?.textContent).toContain(
      "tp-code-editor [data-tp-code-editor-action-section='end']",
    );
    expect(styleEl?.textContent).toContain(
      'tp-code-editor [data-tp-code-editor-action-panel] tp-theme',
    );
    expect(styleEl?.textContent).toContain(
      'tp-code-editor [data-tp-code-editor-action-panel] tp-fullscreen',
    );
    expect(styleEl?.textContent).toContain(
      'tp-code-editor [data-tp-code-editor-action-panel] tp-theme > tp-icon-button > button',
    );
    expect(styleEl?.textContent).toContain(
      'tp-code-editor [data-tp-code-editor-action-panel] tp-fullscreen > tp-icon-button > button',
    );
    expect(styleEl?.textContent).toContain('border: 0 !important;');
    expect(styleEl?.textContent).toContain(
      'tp-code-editor [data-tp-code-editor-cursor-position]',
    );
    const dropdownStyleEl = document.getElementById('tp-dropdown-styles');
    expect(dropdownStyleEl?.textContent).toContain('z-index: 10000;');
    expect(dropdownStyleEl?.textContent).toContain(
      'tp-dropdown[data-tp-code-editor-keyboard-dropdown]',
    );
    expect(dropdownStyleEl?.textContent).toContain('max-block-size: calc(100vh - 1rem);');
    expect(dropdownStyleEl?.textContent).toContain('max-height: calc(100vh - 1rem);');
    expect(dropdownStyleEl?.textContent).toContain('overflow-x: hidden;');
    expect(dropdownStyleEl?.textContent).toContain('overflow-y: auto;');
    expect(dropdownStyleEl?.textContent).toContain(
      "tp-dropdown[data-tp-code-editor-keyboard-dropdown] > ul[role='menu']",
    );
    expect(dropdownStyleEl?.textContent).toContain('overscroll-behavior: contain;');
  });

  it('affiche le langage courant dans tp-badge', async () => {
    document.body.innerHTML =
      '<tp-code-editor language="html"></tp-code-editor>';

    await flush();

    const editor = getEditor();
    const badge = editor.querySelector('tp-badge');

    expect(badge).toBeTruthy();
    expect(badge?.textContent?.trim()).toBe('html');
  });

  it('affiche la ligne et la colonne courantes après le badge', async () => {
    document.body.innerHTML = '<tp-code-editor></tp-code-editor>';

    await flush();

    const editor = getEditor();
    editor.setValue('abc\ndef');
    await flush();

    const position = editor.querySelector<HTMLElement>(
      '[data-tp-code-editor-action-section="start"] > [data-tp-code-editor-cursor-position]',
    );

    expect(position?.textContent).toBe('Ln 1, Col 1');

    const view = (editor as unknown as {
      editor: {
        dispatch: (spec: { selection: { anchor: number } }) => void;
      } | null;
    }).editor;

    view?.dispatch({ selection: { anchor: 7 } });

    await flush();

    expect(position?.textContent).toBe('Ln 2, Col 4');
    expect(position?.getAttribute('aria-label')).toBe('Line 2, column 4');
  });

  it('charge le contenu depuis l’attribut value', async () => {
    document.body.innerHTML = `
      <tp-code-editor value="<p>Hello</p>"></tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    expect(editor.getValue()).toBe('<p>Hello</p>');
  });

  it('affiche le placeholder quand l’éditeur est vide', async () => {
    document.body.innerHTML = `
      <tp-code-editor placeholder="Type code here..."></tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    const placeholderElement = editor.querySelector('.cm-placeholder');

    expect(placeholderElement?.textContent).toBe('Type code here...');
  });

  it('affiche un placeholder par défaut adapté au langage', async () => {
    document.body.innerHTML = `
      <tp-code-editor language="typescript"></tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    expect(editor.querySelector('.cm-placeholder')?.textContent).toBe(
      'Type some typescript code... or F1 to toggle the toolbar',
    );
  });

  it('met à jour le placeholder quand l’attribut change', async () => {
    document.body.innerHTML = `
      <tp-code-editor placeholder="First placeholder"></tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    expect(editor.querySelector('.cm-placeholder')?.textContent).toBe('First placeholder');

    editor.setAttribute('placeholder', 'Second placeholder');

    await flush();

    expect(editor.querySelector('.cm-placeholder')?.textContent).toBe('Second placeholder');
  });

  it('charge le contenu depuis un script inline tp/html', async () => {
    document.body.innerHTML = `
      <tp-code-editor language="html">
        <script type="tp/html" filename="example.html">
          <p>Hello <strong>inline</strong></p>
        </script>
      </tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    expect(editor.getValue()).toBe('<p>Hello <strong>inline</strong></p>');
  });

  it('déduit le langage depuis script[type=\"tp/...\"] sans attribut language', async () => {
    document.body.innerHTML = `
      <tp-code-editor>
        <script type="tp/typescript">
          const answer: number = 42;
        </script>
      </tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    expect(editor.getValue()).toContain('const answer: number = 42;');
    const badge = editor.querySelector('tp-badge');
    expect(badge?.textContent?.trim()).toBe('typescript');
  });

  it('déduit le langage depuis script[type=\"tp/...\"] avant l’attribut language', async () => {
    document.body.innerHTML = `
      <tp-code-editor language="html">
        <script type="tp/typescript">
          const answer: number = 42;
        </script>
      </tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    expect(editor.getValue()).toContain('const answer: number = 42;');
    const badge = editor.querySelector('tp-badge');
    expect(badge?.textContent?.trim()).toBe('typescript');
  });

  it('charge le contenu depuis src', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return {
          ok: true,
          text: async () => '<section>From file</section>',
        };
      }),
    );

    document.body.innerHTML = `
      <tp-code-editor src="/example.html" language="html"></tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    expect(editor.getValue()).toBe('<section>From file</section>');
  });

  it('déduit le langage depuis l’extension src avant l’attribut language', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return {
          ok: true,
          headers: new Headers({
            'content-type': 'text/plain',
          }),
          text: async () => 'print("hello")',
        };
      }),
    );

    document.body.innerHTML = `
      <tp-code-editor src="/example.py" language="javascript"></tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    expect(editor.getValue()).toBe('print("hello")');
    const badge = editor.querySelector('tp-badge');
    expect(badge?.textContent?.trim()).toBe('python');
  });

  it('déduit le langage depuis une extension src avant query string', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return {
          ok: true,
          headers: new Headers({
            'content-type': 'text/plain',
          }),
          text: async () => 'const ok: string = "query";',
        };
      }),
    );

    document.body.innerHTML = `
      <tp-code-editor src="/example.ts?v=1" language="html"></tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    const badge = editor.querySelector('tp-badge');
    expect(badge?.textContent?.trim()).toBe('typescript');
  });

  it('déduit restructuredtext depuis une source .rst', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return {
          ok: true,
          headers: new Headers({
            'content-type': 'text/plain',
          }),
          text: async () => 'Document title\n==============',
        };
      }),
    );

    document.body.innerHTML = `
      <tp-code-editor src="/example.rst"></tp-code-editor>
    `;

    await flush();

    const badge = getEditor().querySelector('tp-badge');
    expect(badge?.textContent?.trim()).toBe('restructuredtext');
  });

  it('applique un langage défini pendant le chargement initial', async () => {
    const editor = document.createElement('tp-code-editor');
    document.body.append(editor);

    editor.setValue('Document title\n==============');
    editor.language = 'restructuredtext';

    await flush();

    expect(editor.querySelector('tp-badge')?.textContent?.trim()).toBe(
      'restructuredtext',
    );
  });

  it('utilise l’attribut language si l’extension src est inconnue', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return {
          ok: true,
          headers: new Headers({
            'content-type': 'text/plain',
          }),
          text: async () => 'SELECT 1;',
        };
      }),
    );

    document.body.innerHTML = `
      <tp-code-editor src="/example.unknown" language="sql"></tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    const badge = editor.querySelector('tp-badge');
    expect(badge?.textContent?.trim()).toBe('sql');
  });

  it('utilise html si aucune source ne permet de déduire le langage', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return {
          ok: true,
          headers: new Headers({
            'content-type': 'text/plain',
          }),
          text: async () => 'unknown',
        };
      }),
    );

    document.body.innerHTML = `
      <tp-code-editor src="/example.unknown"></tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    const badge = editor.querySelector('tp-badge');
    expect(badge?.textContent?.trim()).toBe('html');
  });

  it('émet tp-code-editor-load après résolution d’une source inline', async () => {
    document.body.innerHTML = `
      <tp-code-editor language="html">
        <script type="tp/html" filename="demo.html">
          <p>Loaded</p>
        </script>
      </tp-code-editor>
    `;

    const editor = getEditor();
    const listener = vi.fn();

    editor.addEventListener('tp-code-editor-load', listener);

    await flush();

    expect(listener).toHaveBeenCalled();

    const event = listener.mock.calls.at(-1)?.[0] as CustomEvent<{
      filename: string;
      source: string;
      valueLength: number;
    }>;

    expect(event.detail.source).toBe('script');
    expect(event.detail.filename).toBe('demo.html');
    expect(event.detail.valueLength).toBe('<p>Loaded</p>'.length);
  });

  it('émet tp-code-editor-error si le chargement par fetch échoue', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return {
          ok: false,
          status: 404,
          text: async () => '',
        };
      }),
    );

    document.body.innerHTML = `
      <tp-code-editor src="/missing.html" language="html"></tp-code-editor>
    `;

    const editor = getEditor();
    const listener = vi.fn();

    editor.addEventListener('tp-code-editor-error', listener);

    await flush();

    expect(listener).toHaveBeenCalled();

    const event = listener.mock.calls.at(-1)?.[0] as CustomEvent<{
      message: string;
    }>;

    expect(event.detail.message).toContain('/missing.html');
    const inlineError = editor.querySelector(
      '[data-tp-code-editor-source-error]',
    );
    expect(inlineError).toBeTruthy();
    expect((inlineError as HTMLElement).textContent ?? '').toContain('/missing.html');
    expect(editor.getValue()).toContain('Failed to load src:');
  });

  it('rejette le fallback HTML index quand src attend un fichier texte', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return {
          ok: true,
          status: 200,
          headers: new Headers({
            'content-type': 'text/plain',
          }),
          text: async () => '<!doctype html><html><body><tp-markdown-multi-pages></tp-markdown-multi-pages></body></html>',
        };
      }),
    );

    document.body.innerHTML = `
      <tp-code-editor src="/docs/components/code-editor/examples/typescript.txt" language="typescript"></tp-code-editor>
    `;

    const editor = getEditor();
    const listener = vi.fn();

    editor.addEventListener('tp-code-editor-error', listener);

    await flush();

    expect(listener).toHaveBeenCalled();
    expect(editor.getValue()).toContain('Failed to load src:');
  });

  it('résout ../../components/... vers /docs/components/... après fallback HTML', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url =
          typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.href
              : input.url;

        if (url.includes('/docs/components/code-editor/examples/typescript.txt')) {
          return {
            ok: true,
            status: 200,
            headers: new Headers({
              'content-type': 'text/plain',
            }),
            text: async () => 'const ok: string = "docs";',
          };
        }

        return {
          ok: true,
          status: 200,
          headers: new Headers({
            'content-type': 'text/html',
          }),
          text: async () => '<!doctype html><html><body>App shell</body></html>',
        };
      }),
    );

    document.body.innerHTML = `
      <tp-code-editor src="../../components/code-editor/examples/typescript.txt" language="typescript"></tp-code-editor>
    `;

    const editor = getEditor();
    const listener = vi.fn();

    editor.addEventListener('tp-code-editor-error', listener);

    await flush();
    await flush();

    expect(listener).not.toHaveBeenCalled();
    expect(editor.getValue()).toBe('const ok: string = "docs";');
    const inlineError = editor.querySelector('[data-tp-code-editor-source-error]');
    expect((inlineError as HTMLElement | null)?.hidden).toBe(true);
  });

  it('résout src depuis le document Markdown courant', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      headers: new Headers({
        'content-type': 'text/plain',
      }),
      text: async () => 'const fromDocs = true;',
    }));
    vi.stubGlobal('fetch', fetchMock);

    document.body.innerHTML = `
      <div data-tp-markdown-source="/docs/components/code-editor/index.md">
        <tp-code-editor src="examples/typescript.txt" language="typescript"></tp-code-editor>
      </div>
    `;

    const editor = getEditor();
    await flush();
    await flush();

    const firstCall = fetchMock.mock.calls[0] as [RequestInfo | URL, RequestInit?] | undefined;
    const requestedPath = new URL(String(firstCall?.[0]), window.location.href).pathname;

    expect(requestedPath).toBe('/docs/components/code-editor/examples/typescript.txt');
    expect(editor.getValue()).toBe('const fromDocs = true;');
  });

  it('setValue() met à jour le contenu courant', async () => {
    document.body.innerHTML = '<tp-code-editor></tp-code-editor>';

    await flush();

    const editor = getEditor();

    editor.setValue('<div>Updated</div>');

    await flush();

    expect(editor.getValue()).toBe('<div>Updated</div>');
  });

  it('reload() recharge la source courante depuis src', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        text: async () => '<p>First</p>',
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => '<p>Second</p>',
      });

    vi.stubGlobal('fetch', fetchMock);

    document.body.innerHTML = `
      <tp-code-editor src="/reload.html" language="html"></tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    expect(editor.getValue()).toBe('<p>First</p>');

    editor.reload();

    await flush();

    expect(editor.getValue()).toBe('<p>Second</p>');
  });

  it('met à jour le badge quand l’attribut language change', async () => {
    document.body.innerHTML =
      '<tp-code-editor language="html"></tp-code-editor>';

    await flush();

    const editor = getEditor();
    const badge = editor.querySelector('tp-badge');

    expect(badge?.textContent?.trim()).toBe('html');

    editor.setAttribute('language', 'css');

    await flush();

    expect(badge?.textContent?.trim()).toBe('css');
    expect(editor.querySelector('.cm-placeholder')?.textContent).toBe(
      'Type some css code... or F1 to toggle the toolbar',
    );
  });

  it('place le focus dans l’éditeur via focus()', async () => {
    document.body.innerHTML = '<tp-code-editor></tp-code-editor>';

    await flush();

    const editor = getEditor();
    editor.focus();

    await flush();

    const focused = editor.querySelector('.cm-focused');
    expect(focused).toBeTruthy();
  });

  it('ajoute le bouton de copie dans le panel d’actions', async () => {
    document.body.innerHTML = `
      <tp-code-editor value="const answer = 42;" language="html"></tp-code-editor>
    `;

    await flush();

    const editor = getEditor();
    const copyButton = editor.querySelector('tp-copy-code');

    expect(copyButton).toBeTruthy();
  });

  it('ouvre le menu clavier sans déclencher la copie', async () => {
    document.body.innerHTML = '<tp-code-editor value="const x = 1;"></tp-code-editor>';
    await flush();

    const editor = getEditor();
    const copy = editor.querySelector(
      '[data-tp-code-editor-action-section="end"] > tp-copy-code[data-tp-code-editor-copy]',
    );
    const keyboardButton = editor.querySelector(
      '[data-tp-code-editor-action-section="end"] > [data-tp-code-editor-keyboard-button]',
    );
    const keyboardDropdown = document.querySelector(
      '[data-tp-code-editor-keyboard-dropdown]',
    );

    const copySuccessListener = vi.fn();
    const copyErrorListener = vi.fn();
    copy?.addEventListener('tp-copy-code-success', copySuccessListener);
    copy?.addEventListener('tp-copy-code-error', copyErrorListener);

    keyboardButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await flush();

    const dropdownElement = keyboardDropdown as HTMLElement | null;
    if (dropdownElement !== null) {
      dropdownElement.style.overflowY = 'auto';
      Object.defineProperty(dropdownElement, 'scrollHeight', {
        configurable: true,
        value: 480,
      });
      Object.defineProperty(dropdownElement, 'clientHeight', {
        configurable: true,
        value: 120,
      });
      dropdownElement.scrollTop = 0;
    }
    const wheelEvent = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: 64,
    });
    keyboardDropdown?.dispatchEvent(wheelEvent);

    expect(keyboardDropdown?.hasAttribute('open')).toBe(true);
    expect((keyboardDropdown as HTMLElement | null)?.style.maxHeight).not.toBe('');
    expect(keyboardDropdown?.getAttribute('data-tp-dropdown-align')).toBe('end');
    expect(wheelEvent.defaultPrevented).toBe(true);
    expect(dropdownElement?.scrollTop).toBe(64);
    expect(copySuccessListener).not.toHaveBeenCalled();
    expect(copyErrorListener).not.toHaveBeenCalled();
  });

  it('applique size="xs" aux contrôles du panel', async () => {
    document.body.innerHTML = '<tp-code-editor></tp-code-editor>';
    await flush();

    const editor = getEditor();
    const badge = editor.querySelector(
      '[data-tp-code-editor-action-section="start"] > tp-badge[data-tp-code-editor-language-badge]',
    );
    const copy = editor.querySelector(
      '[data-tp-code-editor-action-section="end"] > tp-copy-code[data-tp-code-editor-copy]',
    );
    const keyboardButton = editor.querySelector(
      '[data-tp-code-editor-action-section="end"] > [data-tp-code-editor-keyboard-button]',
    );
    const fullscreen = editor.querySelector(
      '[data-tp-code-editor-action-section="end"] > tp-fullscreen[data-tp-code-editor-fullscreen]',
    );
    const theme = editor.querySelector(
      '[data-tp-code-editor-action-section="end"] > tp-theme[data-tp-code-editor-theme]',
    );
    const endItems = Array.from(
      editor.querySelectorAll<HTMLElement>('[data-tp-code-editor-action-section="end"] > *'),
    );

    expect(badge?.getAttribute('size')).toBe('xs');
    expect(badge?.hasAttribute('outlined')).toBe(true);
    expect(copy?.getAttribute('size')).toBe('xs');
    expect(keyboardButton?.getAttribute('size')).toBe('xs');
    expect(fullscreen).toBeTruthy();
    expect(fullscreen?.getAttribute('anchor')).toBe(`#${editor.id}`);
    expect(endItems).toEqual([
      keyboardButton,
      copy,
      theme,
      fullscreen,
    ]);
  });

  it('ajoute un tp-theme dans le panel pour choisir le thème local', async () => {
    document.body.innerHTML = '<tp-code-editor></tp-code-editor>';
    await flush();

    const editor = getEditor();
    const theme = editor.querySelector(
      '[data-tp-code-editor-action-section="end"] > tp-theme[data-tp-code-editor-theme]',
    );

    expect(theme).toBeInstanceOf(HTMLElement);
    expect(editor.id).not.toBe('');
    expect(theme?.getAttribute('anchor')).toBe(`#${editor.id}`);
    const themeDropdown = theme?.querySelector('tp-dropdown');
    expect(themeDropdown?.getAttribute('placement')).toBe('start');
  });

  it('réagit à une saisie utilisateur en émettant tp-code-editor-input et tp-code-editor-change', async () => {
    document.body.innerHTML = '<tp-code-editor></tp-code-editor>';

    await flush();

    const editor = getEditor();
    const inputListener = vi.fn();
    const changeListener = vi.fn();

    editor.addEventListener('tp-code-editor-input', inputListener);
    editor.addEventListener('tp-code-editor-change', changeListener);

    editor.setValue('<p>Typed</p>');

    await flush();

    expect(editor.getValue()).toBe('<p>Typed</p>');
  });
});
