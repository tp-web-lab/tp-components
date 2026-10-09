import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import './clock.js';
import type { TpClock } from './clock.js';

describe('<tp-clock>', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T10:15:30'));
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('renders live time and date tooltip content', () => {
    const element = document.createElement('tp-clock');
    document.body.append(element);

    const timeEl = element.querySelector('[data-tp-clock-time]') as HTMLElement | null;
    const tooltip = element.querySelector('tp-tooltip');

    expect(timeEl?.textContent).toBe('10:15:30');
    expect(tooltip?.textContent).toBe(new Date('2026-01-01T10:15:30').toLocaleDateString());
  });

  it('updates clock hands and displayed time every second in analogic mode', () => {
    const element = document.createElement('tp-clock');
    element.setAttribute('type', 'analogic');
    document.body.append(element);

    const secondHand = element.querySelector('line[y2="15"]') as SVGLineElement | null;
    const firstTransform = secondHand?.getAttribute('transform');

    vi.advanceTimersByTime(1000);

    const timeEl = element.querySelector('[data-tp-clock-time]') as HTMLElement | null;
    const secondTransform = secondHand?.getAttribute('transform');
    const ticks = Array.from(element.querySelectorAll('[data-tp-clock-tick]'));
    const tickValues = ticks.map((tick) => tick.textContent);

    expect(timeEl?.textContent).toBe('10:15:31');
    expect(secondTransform).not.toBe(firstTransform);
    expect(ticks).toHaveLength(12);
    expect(tickValues).toContain('0');
    expect(tickValues).toContain('11');
  });

  it('uses digital mode by default', () => {
    const element = document.createElement('tp-clock');
    document.body.append(element);

    expect(element.getAttribute('data-type')).toBe('digital');
  });

  it('applies custom size from attribute', () => {
    const element = document.createElement('tp-clock');
    element.setAttribute('size', '2rem');
    document.body.append(element);

    expect(element.style.getPropertyValue('--tp-clock-size')).toBe('2rem');
  });

  it('expose et normalise ses propriétés publiques', () => {
    const element = document.createElement('tp-clock') as TpClock;
    element.type = 'analogic';
    element.size = '3rem';
    expect(element.type).toBe('analogic');
    expect(element.size).toBe('3rem');

    element.type = 'digital';
    element.size = '';
    expect(element.type).toBe('digital');
    expect(element.size).toBe('1rem');
  });

  it('conserve un seul ticker lors d’une reconnexion', () => {
    const element = document.createElement('tp-clock');
    document.body.append(element);
    document.body.append(element);
    element.remove();
    element.remove();

    expect(vi.getTimerCount()).toBe(0);
  });
});
