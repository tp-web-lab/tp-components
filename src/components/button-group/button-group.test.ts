import { beforeEach, describe, expect, it } from 'vitest';
import './button-group.js';
import type { TpButtonGroup } from './button-group.js';

describe('<tp-button-group>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('registers, renders its children and injects styles once', () => {
    document.body.innerHTML = `
      <tp-button-group><tp-button>One</tp-button><tp-button>Two</tp-button></tp-button-group>
      <tp-button-group></tp-button-group>
    `;
    expect(document.querySelector('tp-button-group')).toBeInstanceOf(HTMLElement);
    expect(document.querySelectorAll('tp-button-group tp-button')).toHaveLength(2);
    expect(document.head.querySelectorAll('#tp-button-group-styles')).toHaveLength(1);
  });

  it('defaults and normalizes orientation', () => {
    const element = document.createElement('tp-button-group') as TpButtonGroup;
    document.body.append(element);
    expect(element.orientation).toBe('horizontal');
    expect(element.getAttribute('orientation')).toBe('horizontal');
    element.setAttribute('orientation', 'diagonal');
    expect(element.orientation).toBe('horizontal');
    expect(element.getAttribute('orientation')).toBe('horizontal');
    element.orientation = 'vertical';
    expect(element.getAttribute('orientation')).toBe('vertical');
  });

  it('reflects attached and stretch boolean states', () => {
    const element = document.createElement('tp-button-group') as TpButtonGroup;
    element.attached = true;
    element.stretch = true;
    expect(element.attached).toBe(true);
    expect(element.stretch).toBe(true);
    element.attached = false;
    element.stretch = false;
    expect(element.hasAttribute('attached')).toBe(false);
    expect(element.hasAttribute('stretch')).toBe(false);
  });

  it('can be disconnected and reconnected without losing state', () => {
    const element = document.createElement('tp-button-group') as TpButtonGroup;
    element.orientation = 'vertical';
    document.body.append(element);
    element.remove();
    document.body.append(element);
    expect(element.orientation).toBe('vertical');
  });
});
