import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './splitter.js';
import type { TpSplitter } from './splitter.js';
import {
  setupTpSplitterTriggers,
  teardownTpSplitterTriggers,
} from './splitter-triggers.js';

function installLocalStorageMock(): void {
  const data = new Map<string, string>();
  const storage: Storage = {
    clear: () => {
      data.clear();
    },
    getItem: (key: string) => data.get(String(key)) ?? null,
    key: (index: number) => Array.from(data.keys())[index] ?? null,
    removeItem: (key: string) => {
      data.delete(String(key));
    },
    setItem: (key: string, value: string) => {
      data.set(String(key), String(value));
    },
    get length() {
      return data.size;
    },
  };

  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
    writable: true,
  });
}

describe('setupTpSplitterTriggers', () => {
  beforeEach(() => {
    installLocalStorageMock();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    localStorage.clear();
  });

  afterEach(() => {
    teardownTpSplitterTriggers(document);
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('handles reset action', () => {
    document.body.innerHTML = `
      <button
        id="reset"
        type="button"
        data-tp-splitter-action="reset"
        data-tp-splitter-target="#split"
      >
        Reset
      </button>

      <tp-splitter id="split" position="35%">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    setupTpSplitterTriggers();

    const button = document.querySelector('#reset');
    const splitter = document.querySelector('#split') as TpSplitter;

    splitter.position = '70%';
    expect(splitter.position).toBe('70%');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(splitter.position).toBe('35%');
  });

  it('does nothing when target selector is missing', () => {
    document.body.innerHTML = `
      <button
        id="reset"
        type="button"
        data-tp-splitter-action="reset"
      >
        Reset
      </button>

      <tp-splitter id="split" position="35%">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    setupTpSplitterTriggers();

    const button = document.querySelector('#reset');
    const splitter = document.querySelector('#split') as TpSplitter;

    splitter.position = '80%';
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(splitter.position).toBe('80%');
  });

  it('does nothing when target is not found', () => {
    document.body.innerHTML = `
      <button
        id="reset"
        type="button"
        data-tp-splitter-action="reset"
        data-tp-splitter-target="#missing"
      >
        Reset
      </button>

      <tp-splitter id="split" position="35%">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    setupTpSplitterTriggers();

    const button = document.querySelector('#reset');
    const splitter = document.querySelector('#split') as TpSplitter;

    splitter.position = '80%';
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(splitter.position).toBe('80%');
  });

  it('does nothing when target exists but is not a TpSplitter', () => {
    document.body.innerHTML = `
      <button
        id="reset"
        type="button"
        data-tp-splitter-action="reset"
        data-tp-splitter-target="#target"
      >
        Reset
      </button>

      <div id="target"></div>
    `;

    setupTpSplitterTriggers();

    const button = document.querySelector('#reset');

    expect(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }).not.toThrow();
  });

  it('does nothing when action is invalid', () => {
    document.body.innerHTML = `
      <button
        id="invalid"
        type="button"
        data-tp-splitter-action="other"
        data-tp-splitter-target="#split"
      >
        Invalid
      </button>

      <tp-splitter id="split" position="35%">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    setupTpSplitterTriggers();

    const button = document.querySelector('#invalid');
    const splitter = document.querySelector('#split') as TpSplitter;

    splitter.position = '80%';
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(splitter.position).toBe('80%');
  });

  it('supports clicking on a descendant element inside the trigger', () => {
    document.body.innerHTML = `
      <button
        id="reset"
        type="button"
        data-tp-splitter-action="reset"
        data-tp-splitter-target="#split"
      >
        <span id="inner-label">Reset</span>
      </button>

      <tp-splitter id="split" position="35%">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    setupTpSplitterTriggers();

    const label = document.querySelector('#inner-label');
    const splitter = document.querySelector('#split') as TpSplitter;

    splitter.position = '75%';
    label?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(splitter.position).toBe('35%');
  });

  it('does nothing when clicking outside a trigger', () => {
    document.body.innerHTML = `
      <div id="outside">Outside</div>

      <tp-splitter id="split" position="35%">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    setupTpSplitterTriggers();

    const outside = document.querySelector('#outside');
    const splitter = document.querySelector('#split') as TpSplitter;

    splitter.position = '75%';
    outside?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(splitter.position).toBe('75%');
  });

  it('does not attach multiple listeners on the same root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <button
        type="button"
        data-tp-splitter-action="reset"
        data-tp-splitter-target="#split"
      >
        Reset
      </button>

      <tp-splitter id="split" position="35%">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    document.body.append(root);

    const splitter = root.querySelector('#split') as TpSplitter;
    const button = root.querySelector('button');

    splitter.position = '75%';

    const resetSpy = vi.spyOn(splitter, 'reset');

    setupTpSplitterTriggers(root);
    setupTpSplitterTriggers(root);

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(resetSpy).toHaveBeenCalledTimes(1);
    expect(splitter.position).toBe('35%');
  });

  it('works with a custom root', () => {
    const root = document.createElement('div');

    root.innerHTML = `
      <button
        id="reset"
        type="button"
        data-tp-splitter-action="reset"
        data-tp-splitter-target="#split"
      >
        Reset
      </button>

      <tp-splitter id="split" position="35%">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    document.body.append(root);

    setupTpSplitterTriggers(root);

    const button = root.querySelector('#reset');
    const splitter = root.querySelector('#split') as TpSplitter;

    splitter.position = '75%';
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(splitter.position).toBe('35%');
  });

  it('teardown removes the listener', () => {
    document.body.innerHTML = `
      <button
        id="reset"
        type="button"
        data-tp-splitter-action="reset"
        data-tp-splitter-target="#split"
      >
        Reset
      </button>

      <tp-splitter id="split" position="35%">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    setupTpSplitterTriggers();
    teardownTpSplitterTriggers();

    const button = document.querySelector('#reset');
    const splitter = document.querySelector('#split') as TpSplitter;

    splitter.position = '75%';
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(splitter.position).toBe('75%');
  });

  it('reset via trigger updates localStorage when storage-key is set', () => {
    document.body.innerHTML = `
      <button
        id="reset"
        type="button"
        data-tp-splitter-action="reset"
        data-tp-splitter-target="#split"
      >
        Reset
      </button>

      <tp-splitter id="split" position="40%" storage-key="my-split">
        <dl>
          <dt>start</dt>
          <dd>Left</dd>
          <dt>end</dt>
          <dd>Right</dd>
        </dl>
      </tp-splitter>
    `;

    setupTpSplitterTriggers();

    const button = document.querySelector('#reset');
    const splitter = document.querySelector('#split') as TpSplitter;

    splitter.position = '70%';
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(splitter.position).toBe('40%');
    expect(localStorage.getItem('my-split')).toBe('40%');
  });
});