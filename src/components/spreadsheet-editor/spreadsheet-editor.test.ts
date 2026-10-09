import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('xlsx', async (importOriginal) => ({
  ...await importOriginal<typeof import('xlsx')>(),
  writeFileXLSX: vi.fn(),
}));

import { cellCoordinates, columnName, parseSpreadsheetCsv, serializeSpreadsheetCsv, type TpSpreadsheetEditor } from './spreadsheet-editor.js';
import './spreadsheet-editor.js';

describe('<tp-spreadsheet-editor>', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('converts Excel cell coordinates', () => {
    expect(columnName(0)).toBe('A');
    expect(columnName(26)).toBe('AA');
    expect(cellCoordinates('AA12')).toEqual([11, 26]);
  });

  it('reads and writes quoted CSV data', () => {
    const data = [['Name', 'Description'], ['Pen', 'Blue, "fine"'], ['Line', 'one\ntwo']];
    expect(parseSpreadsheetCsv(serializeSpreadsheetCsv(data))).toEqual(data);
  });

  it('renders a grid and evaluates Excel-style formulas', () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    editor.rows = 3; editor.columns = 3;
    editor.value = JSON.stringify([['2', '3', '=SUM(A1:B1)'], ['4', '=A1*A2', '=AVERAGE(A1:A2)']]);
    document.body.append(editor);
    expect(editor.querySelector<HTMLInputElement>('[data-cell="C1"]')?.value).toBe('5');
    expect(editor.querySelector<HTMLInputElement>('[data-cell="B2"]')?.value).toBe('8');
    expect(editor.querySelector<HTMLInputElement>('[data-cell="C2"]')?.value).toBe('3');
  });

  it('updates the formula bar and emits cell changes', () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    editor.rows = 2; editor.columns = 2; document.body.append(editor);
    const listener = vi.fn(); editor.addEventListener('tp-spreadsheet-editor-input', listener);
    const cell = editor.querySelector<HTMLInputElement>('[data-cell="B2"]');
    cell?.focus();
    expect(editor.querySelector('output')?.textContent).toBe('B2');
    if (cell !== null) { cell.value = '=1+2'; cell.dispatchEvent(new Event('change')); }
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ detail: { cell: 'B2', raw: '=1+2', value: 3 } }));
  });

  it('provides formula selection and CSV, JSON and XLSX file actions', () => {
    const editor = document.createElement('tp-spreadsheet-editor'); document.body.append(editor);
    expect(editor.querySelector('tp-formula-picker')).not.toBeNull();
    expect(editor.querySelector<HTMLInputElement>('input[type="file"]')?.accept).toContain('.xlsx');
    expect([...editor.querySelectorAll('[data-file-action]')].map((item) => item.textContent)).toEqual(expect.arrayContaining([
      expect.stringContaining('Export CSV'), expect.stringContaining('Export JSON'), expect.stringContaining('Export XLSX'),
    ]));
  });

  it('renders the prose-style toolbar and supports undo and cell formatting', () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    editor.rows = 2; editor.columns = 2; document.body.append(editor);
    expect(editor.querySelector('tp-toolbar')).not.toBeNull();
    expect(editor.querySelector('tp-fullscreen')).not.toBeNull();
    expect(editor.querySelector('tp-fullscreen')?.getAttribute('anchor')).toBe(`#${editor.id}`);
    expect(editor.querySelector('tp-color')).not.toBeNull();
    expect(editor.querySelector('tp-color')?.getAttribute('anchor')).toBe(`#${editor.id}`);
    expect(editor.querySelector('tp-theme')).not.toBeNull();
    expect(editor.querySelector('tp-theme')?.getAttribute('anchor')).toBe(`#${editor.id}`);
    expect(editor.hasAttribute('data-tp-color-scope')).toBe(true);
    expect(editor.hasAttribute('data-tp-theme-scope')).toBe(true);
    const files = editor.querySelector<HTMLElement>('[label="Files"]');
    const fileDropdown = editor.querySelector<HTMLElement>('[data-spreadsheet-file-dropdown]');
    files?.click();
    expect(fileDropdown?.hasAttribute('open')).toBe(true);
    const format = editor.querySelector<HTMLElement>('[label="Format"]');
    const formatDropdown = editor.querySelector<HTMLElement>('[data-spreadsheet-format-dropdown]');
    format?.click();
    expect(fileDropdown?.hasAttribute('open')).toBe(false);
    expect(formatDropdown?.hasAttribute('open')).toBe(true);
    const cell = editor.querySelector<HTMLInputElement>('[data-cell="A1"]');
    if (cell !== null) { cell.value = '12'; cell.dispatchEvent(new Event('change')); }
    editor.querySelector<HTMLElement>('[data-command="undo"]')?.click();
    expect(editor.getData()[0]?.[0]).toBe('');
  });

  it('inserts and deletes rows and columns around the active cell', () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    editor.rows = 2; editor.columns = 2; editor.value = JSON.stringify([['A', 'B'], ['C', 'D']]); document.body.append(editor);
    editor.querySelector<HTMLInputElement>('[data-cell="B2"]')?.focus();
    editor.insertRow('before');
    expect(editor.getData()).toEqual([['A', 'B'], ['', ''], ['C', 'D']]);
    editor.insertColumn('after');
    expect(editor.getData()).toEqual([['A', 'B', ''], ['', '', ''], ['C', 'D', '']]);
    editor.deleteColumn();
    editor.deleteRow();
    expect(editor.getData()).toEqual([['A', 'B'], ['C', 'D']]);
  });

  it('opens the Table menu and includes structural changes in undo', () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    editor.rows = 2; editor.columns = 2; document.body.append(editor);
    editor.querySelector<HTMLElement>('[label="Table"]')?.click();
    expect(editor.querySelector('[data-spreadsheet-table-dropdown]')?.hasAttribute('open')).toBe(true);
    editor.insertRow(); expect(editor.rows).toBe(3);
    editor.querySelector<HTMLElement>('[data-command="undo"]')?.click(); expect(editor.rows).toBe(2);
  });

  it('separates value formats from cell styles', () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor; document.body.append(editor);
    expect(editor.querySelectorAll('[data-tp-spreadsheet-editor-separator]')).toHaveLength(2);
    expect(editor.querySelector('[label="Format"]')).not.toBeNull();
    expect(editor.querySelector('[label="Cell style"]')).not.toBeNull();
    editor.querySelector<HTMLElement>('[data-cell-style="bold"]')?.click();
    expect(editor.querySelector<HTMLInputElement>('[data-cell="A1"]')?.dataset.style).toContain('bold');
    editor.querySelector<HTMLElement>('[data-command="unformat"]')?.click();
    expect(editor.querySelector<HTMLInputElement>('[data-cell="A1"]')?.dataset.style).toBe('');
  });

  it('preserves its local color and theme when the grid rerenders', () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor; document.body.append(editor);
    editor.querySelector('tp-color')?.setAttribute('preset', 'tp-red');
    editor.querySelector('tp-theme')?.setAttribute('mode', 'dark');
    const cell = editor.querySelector<HTMLInputElement>('[data-cell="A1"]');
    if (cell !== null) { cell.value = 'updated'; cell.dispatchEvent(new Event('change')); }
    expect(editor.querySelector('tp-color')?.getAttribute('preset')).toBe('tp-red');
    expect(editor.querySelector('tp-theme')?.getAttribute('mode')).toBe('dark');
    expect(editor.classList.contains('tp-red')).toBe(true);
    expect(editor.classList.contains('tp-dark')).toBe(true);
  });

  it('normalizes dimensions, values and malformed serialized data', () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    editor.setAttribute('rows', 'invalid');
    editor.setAttribute('columns', '0');
    editor.setAttribute('value', '{invalid');
    document.body.append(editor);
    expect(editor.rows).toBe(20);
    expect(editor.columns).toBe(1);
    editor.rows = -2;
    editor.columns = 2.8;
    editor.setData([[1, null], [true]]);
    expect(editor.rows).toBe(2);
    expect(editor.columns).toBe(2);
    expect(editor.getData()).toEqual([['1', ''], ['true', '']]);
    expect(JSON.parse(editor.value)).toEqual(editor.getData());
    expect(cellCoordinates('A0')).toBeNull();
  });

  it('evaluates operators, booleans, strings and formula errors', () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    editor.setData([[
      '=2^3', '=+2-5', '=8/2*3', '="a"&"b"', '=TRUE=FALSE', '=2<>3', '=2<3', '=3>2', '=2<=2', '=3>=2',
      '=UNKNOWN(1)', '=1+', '=@', '=A1:?', '=O1',
    ]]);
    document.body.append(editor);
    const values = [...editor.querySelectorAll<HTMLInputElement>('[data-cell]')].map((cell) => cell.value);
    expect(values.slice(0, 10)).toEqual(['8', '-3', '12', 'ab', 'false', 'true', 'true', 'true', 'true', 'true']);
    expect(values.slice(10, 14)).toEqual(['#NAME?', '#ERROR! Missing value', '#ERROR! Unexpected @', '#ERROR! Unexpected ?']);
    expect(values[14]).toBe('#CYCLE!');
  });

  it('imports CSV and both supported JSON shapes and rejects invalid files', async () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    document.body.append(editor);
    const imported = vi.fn();
    editor.addEventListener('tp-spreadsheet-editor-import', imported);
    await editor.importFile(new File(['a,b\n1,2\n'], 'table.csv'));
    expect(editor.getData()).toEqual([['a', 'b'], ['1', '2']]);
    await editor.importFile(new File([JSON.stringify({ data: [[3, 4]] })], 'table.json'));
    expect(editor.getData()).toEqual([['3', '4']]);
    await editor.importFile(new File([JSON.stringify([[5]])], 'matrix.JSON'));
    expect(editor.getData()).toEqual([['5']]);
    expect(imported).toHaveBeenCalledTimes(3);
    await expect(editor.importFile(new File(['{}'], 'bad.json'))).rejects.toThrow('two-dimensional');
    await expect(editor.importFile(new File(['x'], 'bad.txt'))).rejects.toThrow('Supported import formats');
  });

  it('imports and exports XLSX formulas and scalar cell types', async () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    document.body.append(editor);
    const { utils, write } = await import('xlsx');
    const workbook = utils.book_new();
    const sheet = utils.aoa_to_sheet([[2, 3, 5]]);
    sheet.C1 = { t: 'n', f: 'A1+B1', v: 5 };
    utils.book_append_sheet(workbook, sheet, 'Data');
    await editor.importFile(new File([write(workbook, { type: 'array', bookType: 'xlsx' })], 'data.xlsx'));
    expect(editor.getData()[0]).toEqual(['2', '3', '=A1+B1']);
    const xlsx = await import('xlsx');
    const writeFile = vi.mocked(xlsx.writeFileXLSX);
    editor.setData([['=1+1', '2', 'text', '']]);
    editor.exportFile('xlsx', 'report');
    expect(writeFile).toHaveBeenCalledWith(expect.anything(), 'report.xlsx');
    writeFile.mockClear();
  });

  it('exports CSV and JSON through downloadable object URLs', () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    editor.setData([['a,b', '2']]);
    document.body.append(editor);
    const createUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const revokeUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const exported = vi.fn();
    editor.addEventListener('tp-spreadsheet-editor-export', exported);
    editor.exportFile('csv', 'data');
    editor.exportFile('json');
    expect(createUrl).toHaveBeenCalledTimes(2);
    expect(revokeUrl).toHaveBeenCalledWith('blob:test');
    expect(click).toHaveBeenCalledTimes(2);
    expect(exported).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { format: 'json', filename: 'spreadsheet.json' } }));
  });

  it('applies each display format and toggles cell styles', () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    editor.setData([['1234.5', '0.25', '2026-09-07']]);
    document.body.append(editor);
    const select = (reference: string) => editor.querySelector<HTMLInputElement>(`[data-cell="${reference}"]`)?.focus();
    select('A1');
    for (const format of ['number', 'currency', 'general']) {
      editor.querySelector<HTMLElement>(`[data-format="${format}"]`)?.click();
    }
    select('B1'); editor.querySelector<HTMLElement>('[data-format="percent"]')?.click();
    expect(editor.querySelector<HTMLInputElement>('[data-cell="B1"]')?.value).toContain('25');
    select('C1'); editor.querySelector<HTMLElement>('[data-format="date"]')?.click();
    expect(editor.querySelector<HTMLInputElement>('[data-cell="C1"]')?.value).not.toBe('Invalid Date');
    for (const style of ['italic', 'underline', 'strikethrough']) {
      editor.querySelector<HTMLElement>(`[data-cell-style="${style}"]`)?.click();
    }
    editor.querySelector<HTMLElement>('[data-cell-style="italic"]')?.click();
    expect(editor.querySelector<HTMLInputElement>('[data-cell="C1"]')?.dataset.style).not.toContain('italic');
  });

  it('searches cells and supports copy, cut, paste, undo and redo', async () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    editor.setData([['Needle', '']]);
    document.body.append(editor);
    const writeText = vi.fn().mockResolvedValue(undefined);
    const readText = vi.fn().mockResolvedValue('pasted');
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText, readText } });
    editor.querySelector<HTMLInputElement>('[data-cell="A1"]')?.focus();
    editor.querySelector<HTMLElement>('[data-command="search"]')?.click();
    const search = editor.querySelector<HTMLInputElement>('input[type="search"]');
    if (search !== null) { search.value = 'needle'; search.dispatchEvent(new Event('input')); }
    expect(editor.querySelector('[data-cell="A1"]')?.hasAttribute('data-search-match')).toBe(true);
    editor.querySelector<HTMLElement>('[data-command="copy"]')?.click();
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('Needle'));
    editor.querySelector<HTMLElement>('[data-command="cut"]')?.click();
    await vi.waitFor(() => expect(editor.getData()[0]?.[0]).toBe(''));
    editor.querySelector<HTMLElement>('[data-command="paste"]')?.click();
    await vi.waitFor(() => expect(editor.getData()[0]?.[0]).toBe('pasted'));
    editor.querySelector<HTMLElement>('[data-command="undo"]')?.click();
    editor.querySelector<HTMLElement>('[data-command="redo"]')?.click();
    expect(editor.getData()[0]?.[0]).toBe('pasted');
    editor.querySelector<HTMLElement>('[data-command="close-search"]')?.click();
    expect(editor.querySelector<HTMLInputElement>('input[type="search"]')?.value).toBe('');
  });

  it('reports clipboard failures and dispatches every table menu action', async () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    editor.rows = 2; editor.columns = 2; document.body.append(editor);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')), readText: vi.fn() } });
    const failure = vi.fn(); editor.addEventListener('tp-spreadsheet-editor-clipboard-error', failure);
    editor.querySelector<HTMLElement>('[data-command="copy"]')?.click();
    await vi.waitFor(() => expect(failure).toHaveBeenCalled());
    const toolbar = editor.querySelector('tp-toolbar');
    for (const action of ['insert-row-before', 'insert-row-after', 'insert-column-before', 'insert-column-after', 'delete-row', 'delete-column']) {
      const item = editor.querySelector<HTMLElement>(`[data-table-action="${action}"]`);
      toolbar?.dispatchEvent(new CustomEvent('tp-menu-item-select', { bubbles: true, detail: { item } }));
    }
    expect(editor.rows).toBe(3);
    expect(editor.columns).toBe(3);
  });

  it('inserts a picked formula and imports a file selected from the hidden input', async () => {
    const editor = document.createElement('tp-spreadsheet-editor') as TpSpreadsheetEditor;
    document.body.append(editor);
    const picker = editor.querySelector('tp-formula-picker');
    picker?.dispatchEvent(new CustomEvent('tp-formula-picker-select', {
      detail: { formula: '=SUM()', selectionStart: 5, selectionEnd: 5 },
    }));
    const formula = editor.querySelector<HTMLInputElement>('[aria-label="Cell value or formula"]');
    expect(formula?.value).toBe('=SUM()');
    expect(formula?.selectionStart).toBe(5);
    const input = editor.querySelector<HTMLInputElement>('[data-spreadsheet-file]');
    const file = new File(['a,b'], 'picked.csv');
    Object.defineProperty(input, 'files', { configurable: true, value: [file] });
    input?.dispatchEvent(new Event('change'));
    await vi.waitFor(() => expect(editor.getData()).toEqual([['a', 'b']]));
    expect(input?.value).toBe('');
  });
});
