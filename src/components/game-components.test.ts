import { describe, expect, it } from 'vitest';

import './binary/binary.js';
import './crossword/crossword.js';
import './cryptarithm/cryptarithm.js';
import './mastermind/mastermind.js';
import './sudoku/sudoku.js';
import './turtle/turtle.js';
import './xy-plot/xy-plot.js';
import './yakazu/yakazu.js';

describe('game components migration', () => {
  it('renders tp-binary from its puzzle attribute', async () => {
    const element = document.createElement('tp-binary');
    element.setAttribute('puzzle', '0!011\n01!01\n1!010\n110!0');
    document.body.append(element);

    await Promise.resolve();

    expect(element.querySelector('.tp-binary-grid')).not.toBeNull();
    expect(element.querySelector('.tp-binary-error')).toBeNull();
  });

  it('renders tp-sudoku from its puzzle attribute', async () => {
    const element = document.createElement('tp-sudoku');
    element.setAttribute(
      'puzzle',
      '53..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79',
    );
    document.body.append(element);

    await Promise.resolve();

    expect(element.querySelector('.tp-sudoku-grid')).not.toBeNull();
  });

  it('renders tp-yakazu from data attribute', async () => {
    const element = document.createElement('tp-yakazu');
    element.setAttribute('data-yakazu-puzzle', '. . 3 .\n. # . .\n2 . . .\n. . # .');
    document.body.append(element);

    await Promise.resolve();

    const grid = element.querySelector('.tp-yakazu-grid');
    const error = element.querySelector('.tp-yakazu-error');
    expect(grid || error).not.toBeNull();
  });

  it('renders tp-crossword from data attribute', async () => {
    const element = document.createElement('tp-crossword');
    element.setAttribute(
      'data-crossword-puzzle',
      'a. ab\nb. cd\nA. first across\nB. second across\n1. first down\n2. second down',
    );
    document.body.append(element);

    await Promise.resolve();

    expect(element.querySelector('.tp-crossword-grid')).not.toBeNull();
  });

  it('shows the across and down definitions once below the selected crossword cell', async () => {
    const element = document.createElement('tp-crossword');
    element.innerHTML = `
      <dl>
        <dt>solution</dt>
        <dd><ol><li>CHAT</li><li>HIER</li><li>AIRE</li><li>TRES</li></ol></dd>
        <dt>across</dt>
        <dd><ol><li>A. Félin domestique</li><li>B. Le jour précédent</li><li>C. Surface</li><li>D. Beaucoup</li></ol></dd>
        <dt>down</dt>
        <dd><ol><li>1. Félin domestique</li><li>2. Le jour précédent</li><li>3. Purifie</li><li>4. Beaucoup</li></ol></dd>
      </dl>
    `;
    document.body.append(element);

    await Promise.resolve();

    const cellC2 = element.querySelector<HTMLInputElement>(
      '.tp-crossword-input[data-row="2"][data-col="1"]',
    );
    cellC2?.focus();
    await Promise.resolve();

    const currentDefinitions = Array.from(
      element.querySelectorAll<HTMLElement>('.tp-crossword-current-clue'),
      (clue) => clue.textContent,
    );
    expect(currentDefinitions).toEqual(['C. Surface', '2. Le jour précédent']);
    expect(element.querySelectorAll('.tp-crossword-row-label')).toHaveLength(4);
    expect(element.querySelectorAll('.tp-crossword-col-label')).toHaveLength(4);
  });

  it('renders tp-cryptarithm from its attributes and selects equation cells', async () => {
    const element = document.createElement('tp-cryptarithm');
    element.setAttribute('equation', 'SEND + MORE = MONEY');
    element.setAttribute('solution', '9567 + 1085 = 10652');
    document.body.append(element);

    await Promise.resolve();

    expect(element.querySelector('.tp-cryptarithm-board')).not.toBeNull();

    const letterCell = element.querySelector<HTMLElement>('.tp-cryptarithm-char');
    letterCell?.click();

    const selectedLetter = letterCell?.querySelector('.tp-cryptarithm-char-symbol')?.textContent;
    expect((document.activeElement as HTMLInputElement).dataset.letter).toBe(selectedLetter);
  });

  it('rejects cryptarithms with more than 10 distinct letters', async () => {
    const element = document.createElement('tp-cryptarithm');
    element.setAttribute('equation', 'ABCDEF + GHIJK = ABCDE');
    element.setAttribute('solution', '123456 + 78901 = 23456');
    document.body.append(element);

    await Promise.resolve();

    expect(element.querySelector('.tp-cryptarithm-error')?.textContent).toContain(
      'Cryptarithm puzzles can use at most 10 distinct letters',
    );
    expect(element.querySelector('.tp-cryptarithm-board')).toBeNull();
  });

  it('plays and solves tp-mastermind', async () => {
    const element = document.createElement('tp-mastermind');
    element.setAttribute('solution', 'red blue green yellow');
    element.setAttribute('attempts', '6');
    document.body.append(element);

    await Promise.resolve();

    const palette = element.querySelector('.tp-mastermind-palette');
    const board = element.querySelector('.tp-mastermind-board');
    expect(palette).not.toBeNull();
    expect(board).not.toBeNull();
    expect(
      (palette as Element).compareDocumentPosition(board as Node) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);
    expect(element.querySelectorAll('.tp-mastermind-color')).toHaveLength(6);
    expect(element.querySelector('.tp-mastermind-color.tp-red')).not.toBeNull();
    expect(element.querySelector('.tp-mastermind-row.current .tp-mastermind-check')?.textContent).toBe('Play');
    expect(element.querySelector('.tp-mastermind-chronometer')).not.toBeNull();
    expect(element.querySelector('.tp-mastermind-new-game')?.getAttribute('name')).toBe('refresh');
    expect(
      element.querySelector('.tp-mastermind-new-game')?.nextElementSibling?.classList.contains(
        'tp-mastermind-chronometer',
      ),
    ).toBe(true);
    expect(element.querySelector('.tp-mastermind-undo')?.getAttribute('name')).toBe('undo');
    expect(element.querySelector('.tp-mastermind-redo')?.getAttribute('name')).toBe('redo');
    expect(element.querySelector('.tp-mastermind-assist-trigger')?.getAttribute('name')).toBe('help');
    expect(element.querySelector('.tp-mastermind-assist')?.tagName).toBe('TP-DROPDOWN');
    element.querySelector<HTMLElement>('.tp-mastermind-assist-trigger')?.click();
    expect(element.querySelector('.tp-mastermind-assist')?.hasAttribute('open')).toBe(true);

    for (const color of ['red', 'blue', 'green', 'yellow']) {
      element.querySelector<HTMLButtonElement>(`.tp-mastermind-color[data-color="${color}"]`)?.click();
    }
    element.querySelector<HTMLButtonElement>('.tp-mastermind-check')?.click();

    expect(element.querySelector('.tp-mastermind-feedback-exact')?.textContent).toContain('4');
    expect(element.querySelector('.tp-mastermind-status')?.textContent).toContain('Code cracked');
    expect(element.querySelector('.tp-mastermind-status.won')).not.toBeNull();

    const previousCode = element.getAttribute('solution');
    element.querySelector<HTMLElement>('.tp-mastermind-new-game')?.click();
    expect(element.getAttribute('solution')).not.toBe(previousCode);
    expect(element.querySelector('.tp-mastermind-status')?.textContent).toContain('Attempt 1');
  });

  it('renders tp-turtle from inline script', async () => {
    const element = document.createElement('tp-turtle');
    element.innerHTML = `
      <script type="tp/turtle">
        turtle x=0 y=0 heading=0 speed=6
        forward 40
        right 90
        forward 40
      </script>
    `;
    document.body.append(element);

    await Promise.resolve();

    expect(element.querySelector('svg, .tp-turtle-error')).not.toBeNull();
  });

  it('renders tp-xy-plot from inline text', async () => {
    const element = document.createElement('tp-xy-plot');
    element.textContent = `
xyFunctionGraph
  title "Standard functions"
  legend-x "x"
  legend-y "y"
  x-axis [-10,10]
  y-axis [-5,5]
  functions [
    ["Line", "-2.5 + x/2"],
    ["Parabola", "5-x**2/10"],
    ["Sinus", "2*sin(x)"],
    ["Cosinus", "2*cos(x)"],
    ["Damped sine", "2*exp(-0.1*x)*sin(2*x)"]
  ]
`;
    document.body.append(element);

    await Promise.resolve();

    expect(element.querySelector('.tp-xy-plot-preview, .tp-xy-plot-error')).not.toBeNull();
    expect(element.querySelector('.tp-xy-plot-zoom-button')).not.toBeNull();
  });

  it('renders tp-xy-plot from indented inline script', async () => {
    const element = document.createElement('tp-xy-plot');
    element.innerHTML = `
      <script type="tp/xy-plot">
        xyFunctionGraph
          title "Standard functions"
          legend-x "x"
          legend-y "y"
          x-axis [-10,10]
          y-axis [-5,5]
          functions [
            ["Line", "-2.5 + x/2"],
            ["Parabola", "5-x**2/10"],
            ["Sinus", "2*sin(x)"],
            ["Cosinus", "2*cos(x)"],
            ["Damped sine", "2*exp(-0.1*x)*sin(2*x)"]
          ]
      </script>
    `;
    document.body.append(element);

    await Promise.resolve();

    expect(element.querySelector('.tp-xy-plot-preview')).not.toBeNull();
    expect(element.querySelector('.tp-xy-plot-error')).toBeNull();
  });
});
