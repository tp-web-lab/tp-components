import { afterEach, describe, expect, it, vi } from 'vitest';
import './console.js';
import type { TpConsole } from './console.js';

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe('<tp-console>', () => {
  it('exposes its entries as copyable text', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
    const consoleEl = document.createElement('tp-console') as TpConsole;
    document.body.append(consoleEl);
    consoleEl.log('hello', 3);

    expect(consoleEl.querySelector('[data-tp-console-header-right] tp-copy-code')).not.toBeNull();
    expect(consoleEl.getValue()).toContain('LOG');
    expect(consoleEl.getValue()).toContain('"hello" 3');
  });

  it('rend les primitives, objets, tableaux et styles console', () => {
    const element = document.createElement('tp-console') as TpConsole;
    document.body.append(element);
    element.log(null, undefined, 'text', 4, true, 5n);
    element.info(new Error('boom'), new Date('2026-01-01T00:00:00Z'));
    element.warn([1, 2], { value: 1 }, function named() {});
    element.table([{ name: 'Ada', score: 2 }, { name: 'Lin' }]);
    element.log('%cStyled', 'color: red', 'tail');

    expect(element.querySelectorAll('[data-tp-console-entry]')).toHaveLength(5);
    expect(element.querySelector('[data-tp-console-table]')).not.toBeNull();
    expect(element.querySelectorAll('tp-object-tree').length).toBeGreaterThan(0);
    expect(element.textContent).toContain('Error: boom');
    expect(element.textContent).toContain('Styled');
  });

  it('gère groupes, assertions, compteurs et minuteurs', () => {
    const element = document.createElement('tp-console') as TpConsole;
    document.body.append(element);
    element.group('Group');
    element.log('child');
    element.groupEnd();
    element.groupCollapsed('Collapsed');
    element.log('hidden');
    element.groupEnd();
    element.assert(true, 'ignored');
    element.assert(false);
    element.assert(false, 'failure');
    element.count();
    element.count('items');
    element.count('items');
    element.countReset('missing');
    element.countReset('items');
    element.timeLog('missing');
    element.timeEnd('missing');
    element.time('work');
    element.timeLog('work', 'step');
    element.timeEnd('work');

    const collapsed = element.querySelector<HTMLElement>('[data-kind="group-collapsed"]');
    collapsed?.click();
    expect(element.getValue()).toContain('Assertion failed');
    expect(element.getValue()).toContain('items: 2');
    expect(element.getValue()).toContain('work:');
  });

  it('émet les événements d’ajout et d’effacement', () => {
    const element = document.createElement('tp-console') as TpConsole;
    document.body.append(element);
    const added = vi.fn();
    const cleared = vi.fn();
    element.addEventListener('tp-console-entry-add', added);
    element.addEventListener('tp-console-clear', cleared);
    element.error('one');
    element.info('two');
    const snapshot = element.getEntries();
    snapshot[0]?.values.push('mutated');
    element.querySelector<HTMLElement>('tp-icon-button[label="Clear console"]')?.click();

    expect(added).toHaveBeenCalledTimes(2);
    expect(cleared.mock.calls[0]?.[0].detail.removedCount).toBe(2);
    expect(element.getEntries()).toEqual([]);
  });

  it('redirige puis restaure les méthodes console de façon idempotente', () => {
    const element = document.createElement('tp-console') as TpConsole;
    document.body.append(element);
    const restore = element.redirectConsoleToSelf();
    const restoreAgain = element.redirectConsoleToSelf();
    console.log('log');
    console.info('info');
    console.warn('warn');
    console.error('error');
    expect(element.getEntries().map(({ kind }) => kind)).toEqual(['log', 'info', 'warn', 'error']);
    restoreAgain();
    restore();
    element.restoreConsole();
    expect(element.getEntries()).toHaveLength(4);
  });
});
