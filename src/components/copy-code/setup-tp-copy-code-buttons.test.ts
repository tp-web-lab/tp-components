import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import './copy-code.js';
import './setup-tp-copy-code-buttons.js';

import {
  attachTpCopyCodeButton,
  setupTpCopyCodeButtons,
  teardownTpCopyCodeButtons,
} from './setup-tp-copy-code-buttons.js';

describe('setupTpCopyCodeButtons()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('ajoute un bouton à chaque cible', () => {
    document.body.innerHTML = `
      <tp-code-editor id="a"></tp-code-editor>
      <tp-html id="b"></tp-html>
    `;

    const created = setupTpCopyCodeButtons();

    expect(created.length).toBe(2);

    const buttons = document.querySelectorAll('tp-copy-code');
    expect(buttons.length).toBe(2);

    for (const btn of buttons) {
      expect(btn.hasAttribute('data-tp-copy-code-generated')).toBe(true);
    }
  });

  it('n’ajoute pas de doublon si déjà présent', () => {
    document.body.innerHTML = `
      <tp-code-editor id="a"></tp-code-editor>
    `;

    setupTpCopyCodeButtons();
    setupTpCopyCodeButtons();

    const buttons = document.querySelectorAll('tp-copy-code');
    expect(buttons.length).toBe(1);
  });

  it('respecte le selector personnalisé', () => {
    document.body.innerHTML = `
      <tp-code-editor id="a"></tp-code-editor>
      <tp-html id="b"></tp-html>
    `;

    const created = setupTpCopyCodeButtons({
      selector: 'tp-html',
    });

    expect(created.length).toBe(1);

    const html = document.getElementById('b');
    const editor = document.getElementById('a');

    expect(html?.querySelector('tp-copy-code')).toBeTruthy();
    expect(editor?.querySelector('tp-copy-code')).toBeNull();
  });
});

describe('attachTpCopyCodeButton()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('attache un bouton à un élément donné', () => {
    const target = document.createElement('div');
    document.body.append(target);

    const btn = attachTpCopyCodeButton(target);

    expect(btn).toBeTruthy();
    expect(target.querySelector('tp-copy-code')).toBe(btn);
  });

  it('n’ajoute pas de bouton si déjà présent', () => {
    const target = document.createElement('div');
    document.body.append(target);

    attachTpCopyCodeButton(target);
    const second = attachTpCopyCodeButton(target);

    expect(second).toBeNull();
    expect(target.querySelectorAll('tp-copy-code').length).toBe(1);
  });
});

describe('teardownTpCopyCodeButtons()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('supprime uniquement les boutons générés', () => {
    document.body.innerHTML = `
      <tp-code-editor id="a">
        <tp-copy-code data-tp-copy-code-generated></tp-copy-code>
        <tp-copy-code></tp-copy-code>
      </tp-code-editor>
    `;

    teardownTpCopyCodeButtons();

    const remaining = document.querySelectorAll('tp-copy-code');

    expect(remaining.length).toBe(1);
    expect(
      remaining[0]?.hasAttribute('data-tp-copy-code-generated'),
    ).toBe(false);
  });

  it('respecte le selector personnalisé', () => {
    document.body.innerHTML = `
      <tp-code-editor id="a">
        <tp-copy-code data-tp-copy-code-generated></tp-copy-code>
      </tp-code-editor>

      <tp-html id="b">
        <tp-copy-code data-tp-copy-code-generated></tp-copy-code>
      </tp-html>
    `;

    teardownTpCopyCodeButtons({
      selector: 'tp-html',
    });

    const editorButtons = document
      .getElementById('a')
      ?.querySelectorAll('tp-copy-code');

    const htmlButtons = document
      .getElementById('b')
      ?.querySelectorAll('tp-copy-code');

    expect(editorButtons?.length).toBe(1);
    expect(htmlButtons?.length).toBe(0);
  });

  it('ne plante pas si aucun bouton n’existe', () => {
    document.body.innerHTML = `
      <tp-code-editor></tp-code-editor>
    `;

    expect(() => teardownTpCopyCodeButtons()).not.toThrow();
  });
});