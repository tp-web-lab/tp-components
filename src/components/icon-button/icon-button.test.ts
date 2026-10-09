import { afterEach, describe, expect, it } from 'vitest';

import './icon-button.js';
import type { TpIconButton } from './icon-button.js';

describe('<tp-icon-button>', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('forwards icon presentation attributes to its internal tp-icon', async () => {
    const element = document.createElement('tp-icon-button') as TpIconButton;
    element.setAttribute('name', 'check');
    element.setAttribute('color', 'tomato');
    element.setAttribute('scale', '2');
    element.setAttribute('rotate', '45deg');
    element.setAttribute('flip-h', '');
    element.setAttribute('flip-v', '');
    element.setAttribute('spin', '');
    document.body.append(element);
    await Promise.resolve();

    const icon = element.querySelector('tp-icon');
    expect(icon?.getAttribute('color')).toBe('tomato');
    expect(icon?.getAttribute('scale')).toBe('2');
    expect(icon?.getAttribute('rotate')).toBe('45deg');
    expect(icon?.hasAttribute('flip-h')).toBe(true);
    expect(icon?.hasAttribute('flip-v')).toBe(true);
    expect(icon?.hasAttribute('spin')).toBe(true);
  });

  it('removes forwarded boolean attributes when disabled', async () => {
    const element = document.createElement('tp-icon-button') as TpIconButton;
    element.spin = true;
    element.flipH = true;
    document.body.append(element);
    element.spin = false;
    element.flipH = false;
    await Promise.resolve();

    const icon = element.querySelector('tp-icon');
    expect(icon?.hasAttribute('spin')).toBe(false);
    expect(icon?.hasAttribute('flip-h')).toBe(false);
  });

  it('reflects the complete icon button API', async () => {
    const element = document.createElement('tp-icon-button') as TpIconButton;
    element.name = 'check';
    element.library = 'actions';
    element.label = 'Confirm';
    element.type = 'submit';
    element.variant = 'success';
    element.size = 'l';
    element.color = 'green';
    element.scale = 1.5;
    element.rotate = '90deg';
    element.flipH = true;
    element.flipV = true;
    element.spin = true;
    element.disabled = true;
    document.body.append(element);
    await Promise.resolve();
    expect([element.name, element.library, element.label, element.type, element.variant, element.size, element.color, element.scale, element.rotate]).toEqual(['check', 'actions', 'Confirm', 'submit', 'success', 'l', 'green', 1.5, '90deg']);
    expect([element.flipH, element.flipV, element.spin, element.disabled]).toEqual([true, true, true, true]);
    expect(element.querySelector('button')?.getAttribute('aria-label')).toBe('Confirm');
  });

  it('normalizes invalid enum and numeric attributes', () => {
    const element = document.createElement('tp-icon-button') as TpIconButton;
    element.setAttribute('type', 'other');
    element.setAttribute('variant', 'other');
    element.setAttribute('size', 'other');
    element.setAttribute('scale', 'bad');
    expect(element.type).toBe('button');
    expect(element.variant).toBe('neutral');
    expect(element.size).toBe('m');
    expect(element.scale).toBe(1);
  });
});
