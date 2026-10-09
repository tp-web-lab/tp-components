import { afterEach, describe, expect, it, vi } from 'vitest';
import './animation.js';
import { TpAnimation } from './animation.js';
import {
  setupTpAnimationTriggers,
  teardownTpAnimationTriggers,
} from './animation-triggers.js';

describe('tp-animation external triggers', () => {
  afterEach(() => {
    teardownTpAnimationTriggers(document);
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  function appendFixture(action: string, target = '#animation'): TpAnimation {
    document.body.innerHTML = `
      <button data-tp-animation-action="${action}" data-tp-animation-target="${target}">
        <span>Run</span>
      </button>
      <tp-animation id="animation" trigger="manual"><span>Content</span></tp-animation>
    `;
    const animation = document.querySelector('#animation');
    if (!(animation instanceof TpAnimation)) throw new Error('Expected tp-animation.');
    return animation;
  }

  it.each([
    ['play-in', 'playIn'],
    ['play-out', 'playOut'],
    ['pause', 'pause'],
    ['cancel', 'cancel'],
    ['restart', 'restart'],
  ] as const)('dispatches %s to %s()', (action, method) => {
    const animation = appendFixture(action);
    const spy = vi.spyOn(animation, method).mockImplementation(() =>
      method === 'playIn' || method === 'playOut' || method === 'restart'
        ? Promise.resolve()
        : undefined,
    );
    setupTpAnimationTriggers();
    document.querySelector('button span')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(spy).toHaveBeenCalledOnce();
  });

  it.each([
    ['', '#animation'],
    ['unknown', '#animation'],
    ['play-in', ''],
    ['play-in', '#missing'],
  ])('ignores invalid action/target pair %j → %j', (action, target) => {
    const animation = appendFixture(action, target);
    const spy = vi.spyOn(animation, 'playIn').mockResolvedValue();
    setupTpAnimationTriggers();
    document.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not install the same delegated listener twice', () => {
    const animation = appendFixture('play-in');
    const spy = vi.spyOn(animation, 'playIn').mockResolvedValue();
    setupTpAnimationTriggers(document);
    setupTpAnimationTriggers(document);
    document.querySelector('button')?.click();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('removes the listener and tolerates repeated teardown', () => {
    const animation = appendFixture('play-in');
    const spy = vi.spyOn(animation, 'playIn').mockResolvedValue();
    setupTpAnimationTriggers(document);
    teardownTpAnimationTriggers(document);
    teardownTpAnimationTriggers(document);
    document.querySelector('button')?.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('ignores clicks whose target is not an Element', () => {
    const animation = appendFixture('play-in');
    const spy = vi.spyOn(animation, 'playIn').mockResolvedValue();
    setupTpAnimationTriggers(document);
    document.dispatchEvent(new Event('click'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('resolves a target inside the trigger shadow root', () => {
    const host = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<button data-tp-animation-action="play-in" data-tp-animation-target="#local">Run</button><tp-animation id="local" trigger="manual"><span>Content</span></tp-animation>`;
    document.body.append(host);
    const animation = shadow.querySelector('#local');
    if (!(animation instanceof TpAnimation)) throw new Error('Expected tp-animation.');
    const spy = vi.spyOn(animation, 'playIn').mockResolvedValue();
    setupTpAnimationTriggers(shadow);
    shadow.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(spy).toHaveBeenCalledOnce();
    teardownTpAnimationTriggers(shadow);
  });
});
