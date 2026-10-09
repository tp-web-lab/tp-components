/**
 * @module dir/test
 * @summary Tests du composant `<tp-dir>`.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TpDir } from './dir.js';

type MutationCallback = (records: MutationRecord[]) => void;

/**
 * Déclenche manuellement les callbacks MutationObserver enregistrés
 * sur `document.documentElement`.
 *
 * @summary Simule une mutation sur la racine du document.
 * @internal
 */
let capturedObservers: Array<{ callback: MutationCallback; target: Node }> = [];

const OriginalMutationObserver = globalThis.MutationObserver;

class MutationObserverMock {
  private callback: MutationCallback;

  public constructor(callback: MutationCallback) {
    this.callback = callback;
  }

  public observe(target: Node): void {
    capturedObservers.push({ callback: this.callback, target });
  }

  public disconnect(): void {
    capturedObservers = capturedObservers.filter((o) => o.callback !== this.callback);
  }

  public takeRecords(): MutationRecord[] {
    return [];
  }
}

function triggerDocumentMutation(): void {
  for (const obs of capturedObservers) {
    if (obs.target === document.documentElement) {
      obs.callback([] as unknown as MutationRecord[]);
    }
  }
}

describe('<tp-dir>', () => {
  beforeEach(() => {
    capturedObservers = [];
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('lang');
    globalThis.MutationObserver = MutationObserverMock as unknown as typeof MutationObserver;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('lang');
    globalThis.MutationObserver = OriginalMutationObserver;
  });

  it('est défini', () => {
    expect(customElements.get('tp-dir')).toBe(TpDir);
  });

  it('applique dir="ltr" sur le parent en mode ltr', () => {
    document.body.innerHTML = '<section><tp-dir mode="ltr"></tp-dir></section>';
    const section = document.querySelector('section');

    expect(section?.getAttribute('dir')).toBe('ltr');
  });

  it('applique dir="rtl" sur le parent en mode rtl', () => {
    document.body.innerHTML = '<section><tp-dir mode="rtl"></tp-dir></section>';
    const section = document.querySelector('section');

    expect(section?.getAttribute('dir')).toBe('rtl');
  });

  it('utilise ltr par défaut en mode auto sans signal RTL sur le document', () => {
    document.body.innerHTML = '<section><tp-dir mode="auto"></tp-dir></section>';
    const section = document.querySelector('section');

    expect(section?.getAttribute('dir')).toBe('ltr');
  });

  it('détecte rtl depuis dir="rtl" sur <html> en mode auto', () => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.innerHTML = '<section><tp-dir mode="auto"></tp-dir></section>';
    const section = document.querySelector('section');

    expect(section?.getAttribute('dir')).toBe('rtl');
  });

  it('détecte rtl depuis lang="ar" sur <html> en mode auto', () => {
    document.documentElement.setAttribute('lang', 'ar');
    document.body.innerHTML = '<section><tp-dir mode="auto"></tp-dir></section>';
    const section = document.querySelector('section');

    expect(section?.getAttribute('dir')).toBe('rtl');
  });

  it('détecte rtl depuis le code régional "ma" sur <html> en mode auto', () => {
    document.documentElement.setAttribute('lang', 'ma');
    document.body.innerHTML = '<section><tp-dir mode="auto"></tp-dir></section>';
    const section = document.querySelector('section');

    expect(section?.getAttribute('dir')).toBe('rtl');
  });

  it('détecte rtl depuis lang="he-IL" sur <html> en mode auto', () => {
    document.documentElement.setAttribute('lang', 'he-IL');
    document.body.innerHTML = '<section><tp-dir mode="auto"></tp-dir></section>';
    const section = document.querySelector('section');

    expect(section?.getAttribute('dir')).toBe('rtl');
  });

  it('détecte ltr depuis lang="fr" sur <html> en mode auto', () => {
    document.documentElement.setAttribute('lang', 'fr');
    document.body.innerHTML = '<section><tp-dir mode="auto"></tp-dir></section>';
    const section = document.querySelector('section');

    expect(section?.getAttribute('dir')).toBe('ltr');
  });

  it('met à jour la direction quand <html lang> change en mode auto', () => {
    document.body.innerHTML = '<section><tp-dir mode="auto"></tp-dir></section>';
    const section = document.querySelector('section');

    expect(section?.getAttribute('dir')).toBe('ltr');

    document.documentElement.setAttribute('lang', 'ar');
    triggerDocumentMutation();

    expect(section?.getAttribute('dir')).toBe('rtl');
  });

  it('met à jour la direction quand <html dir> change en mode auto', () => {
    document.body.innerHTML = '<section><tp-dir mode="auto"></tp-dir></section>';
    const section = document.querySelector('section');

    expect(section?.getAttribute('dir')).toBe('ltr');

    document.documentElement.setAttribute('dir', 'rtl');
    triggerDocumentMutation();

    expect(section?.getAttribute('dir')).toBe('rtl');
  });

  it("ne réagit pas aux mutations quand le mode n'est pas auto", () => {
    document.body.innerHTML = '<section><tp-dir mode="ltr"></tp-dir></section>';
    const section = document.querySelector('section');

    document.documentElement.setAttribute('dir', 'rtl');
    triggerDocumentMutation();

    expect(section?.getAttribute('dir')).toBe('ltr');
  });

  it('change de mode via setAttribute', () => {
    document.body.innerHTML = '<section><tp-dir mode="ltr"></tp-dir></section>';
    const section = document.querySelector('section');
    const dir = document.querySelector('tp-dir') as TpDir;

    dir.setAttribute('mode', 'rtl');
    expect(section?.getAttribute('dir')).toBe('rtl');
  });

  it('émet tp-dir-change avec la direction effective et la cible', () => {
    document.body.innerHTML = '<section id="scope"><tp-dir mode="ltr" anchor="#scope"></tp-dir></section>';
    const section = document.getElementById('scope');
    const dir = document.querySelector('tp-dir') as TpDir;
    const events: Array<CustomEvent<{
      mode: string;
      dir: string;
      anchor: string;
      target: HTMLElement;
    }>> = [];
    dir.addEventListener('tp-dir-change', (event) => {
      events.push(event as CustomEvent<{
        mode: string;
        dir: string;
        anchor: string;
        target: HTMLElement;
      }>);
    });

    dir.mode = 'rtl';

    expect(events).toHaveLength(1);
    expect(events[0]?.detail).toMatchObject({
      mode: 'rtl',
      dir: 'rtl',
      anchor: '#scope',
      target: section,
    });
  });

  it('change de mode via la propriété .mode', () => {
    document.body.innerHTML = '<section><tp-dir mode="ltr"></tp-dir></section>';
    const section = document.querySelector('section');
    const dir = document.querySelector('tp-dir') as TpDir;

    dir.mode = 'rtl';
    expect(section?.getAttribute('dir')).toBe('rtl');
  });

  it('utilise anchor comme cible explicite', () => {
    document.body.innerHTML = `
      <article id="target"></article>
      <section>
        <tp-dir mode="rtl" anchor="#target"></tp-dir>
      </section>
    `;

    const target = document.getElementById('target');
    const section = document.querySelector('section');

    expect(target?.getAttribute('dir')).toBe('rtl');
    expect(section?.hasAttribute('dir')).toBe(false);
  });

  it('transmet variant, size et disabled au déclencheur', () => {
    document.body.innerHTML = '<section><tp-dir variant="brand" size="s" disabled></tp-dir></section>';
    const dir = document.querySelector('tp-dir');
    const trigger = document.querySelector('tp-dir > tp-icon-button');

    expect(trigger?.getAttribute('variant')).toBe('brand');
    expect(trigger?.getAttribute('size')).toBe('s');
    expect(trigger?.hasAttribute('disabled')).toBe(true);

    dir?.setAttribute('variant', 'danger');
    dir?.setAttribute('size', 'l');
    dir?.removeAttribute('disabled');

    expect(trigger?.getAttribute('variant')).toBe('danger');
    expect(trigger?.getAttribute('size')).toBe('l');
    expect(trigger?.hasAttribute('disabled')).toBe(false);
  });

  it("restaure l'ancienne cible quand anchor change", () => {
    document.body.innerHTML = `
      <article id="first" dir="ltr"></article>
      <article id="second"></article>
      <tp-dir mode="rtl" anchor="#first"></tp-dir>
    `;

    const first = document.getElementById('first');
    const second = document.getElementById('second');
    const dir = document.querySelector('tp-dir') as TpDir;

    expect(first?.getAttribute('dir')).toBe('rtl');

    dir.anchor = '#second';

    expect(first?.getAttribute('dir')).toBe('ltr');
    expect(second?.getAttribute('dir')).toBe('rtl');
  });

  it('rend un tp-icon-button intégré avec un menu', () => {
    document.body.innerHTML = '<section><tp-dir mode="auto"></tp-dir></section>';

    const control = document.querySelector('tp-dir tp-icon-button');
    const dropdown = document.querySelector('tp-dir tp-dropdown');
    const items = document.querySelectorAll('tp-dir .tp-dir-option');

    expect(control).not.toBeNull();
    expect(control?.getAttribute('name')).toBe('arrow-right');
    expect(control?.getAttribute('data-mode')).toBe('auto');
    expect(control?.id).toContain('tp-dir-control-');
    expect(document.querySelector('tp-dir tp-tooltip')).toBeNull();
    expect(dropdown?.getAttribute('anchor')).toBe(`#${control?.id}`);
    expect(items).toHaveLength(3);
    expect(
      document
        .querySelector<HTMLElement>('tp-dir .tp-dir-option[data-mode="ltr"] tp-icon.tp-dir-option-icon')
        ?.getAttribute('name'),
    ).toBe('arrow-right');
    expect(
      document
        .querySelector<HTMLElement>('tp-dir .tp-dir-option[data-mode="rtl"] tp-icon.tp-dir-option-icon')
        ?.getAttribute('name'),
    ).toBe('arrow-left');
  });

  it('sélectionne un mode via le menu dropdown', () => {
    document.body.innerHTML = '<section><tp-dir mode="auto"></tp-dir></section>';
    const section = document.querySelector('section');
    const rtlItem = document.querySelector<HTMLElement>('tp-dir .tp-dir-option[data-mode="rtl"]');

    rtlItem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(section?.getAttribute('dir')).toBe('rtl');
    const control = document.querySelector('tp-dir tp-icon-button');
    expect(control?.getAttribute('name')).toBe('arrow-left');
    expect(control?.getAttribute('data-mode')).toBe('rtl');
    expect(control?.getAttribute('data-effective-dir')).toBe('rtl');
  });

  it("marque l'option sélectionnée avec data-selected", () => {
    document.body.innerHTML = '<section><tp-dir mode="ltr"></tp-dir></section>';

    const ltrOption = document.querySelector<HTMLElement>('tp-dir .tp-dir-option[data-mode="ltr"]');
    const rtlOption = document.querySelector<HTMLElement>('tp-dir .tp-dir-option[data-mode="rtl"]');

    expect(ltrOption?.hasAttribute('data-selected')).toBe(true);
    expect(rtlOption?.hasAttribute('data-selected')).toBe(false);
  });

  it('synchronise deux tp-dir sur le même parent', () => {
    document.body.innerHTML = `
      <section id="scope">
        <tp-dir id="first" mode="ltr"></tp-dir>
        <tp-dir id="second" mode="ltr"></tp-dir>
      </section>
    `;

    const second = document.querySelector<TpDir>('#second');
    second?.setAttribute('mode', 'rtl');

    const first = document.querySelector<TpDir>('#first');
    expect(first?.mode).toBe('rtl');
    expect(first?.getAttribute('data-effective-dir') ?? document.querySelector('section')?.getAttribute('dir')).not.toBeNull();

    const section = document.querySelector('section');
    expect(section?.getAttribute('dir')).toBe('rtl');
  });

  it('syncToMode synchronise sans déclencher de boucle', () => {
    document.body.innerHTML = `
      <section>
        <tp-dir id="a" mode="ltr"></tp-dir>
        <tp-dir id="b" mode="ltr"></tp-dir>
      </section>
    `;

    const a = document.querySelector<TpDir>('#a')!;
    const b = document.querySelector<TpDir>('#b')!;

    b.syncToMode('rtl');

    expect(a.mode).toBe('rtl');
    expect(b.mode).toBe('rtl');
  });

  it('restaure le dir initial du parent à la déconnexion', () => {
    document.body.innerHTML = '<section dir="ltr"></section>';
    const section = document.querySelector('section')!;
    const dir = document.createElement('tp-dir');
    dir.setAttribute('mode', 'rtl');

    section.append(dir);
    expect(section.getAttribute('dir')).toBe('rtl');

    dir.remove();
    expect(section.getAttribute('dir')).toBe('ltr');
  });

  it('supprime dir du parent si absent initialement, à la déconnexion', () => {
    document.body.innerHTML = '<section></section>';
    const section = document.querySelector('section')!;
    const dir = document.createElement('tp-dir');
    dir.setAttribute('mode', 'ltr');

    section.append(dir);
    expect(section.getAttribute('dir')).toBe('ltr');

    dir.remove();
    expect(section.hasAttribute('dir')).toBe(false);
  });

  it("détache l'observateur MutationObserver à la déconnexion", () => {
    document.body.innerHTML = '<section><tp-dir mode="auto"></tp-dir></section>';

    expect(capturedObservers).toHaveLength(1);

    const dir = document.querySelector('tp-dir')!;
    dir.remove();

    expect(capturedObservers).toHaveLength(0);
  });

  it("n'enregistre pas d'observateur en mode ltr (non-auto)", () => {
    document.body.innerHTML = '<section><tp-dir mode="ltr"></tp-dir></section>';

    expect(capturedObservers).toHaveLength(0);
  });

  it('expose les propriétés visuelles et retire une ancre vide', () => {
    const element = document.createElement('tp-dir') as TpDir;
    element.anchor = '#target';
    element.variant = 'brand';
    element.size = 's';
    element.disabled = true;
    expect(element.anchor).toBe('#target');
    expect(element.variant).toBe('brand');
    expect(element.size).toBe('s');
    expect(element.disabled).toBe(true);
    element.anchor = ' ';
    element.disabled = false;
    expect(element.hasAttribute('anchor')).toBe(false);
    expect(element.disabled).toBe(false);
  });
});
