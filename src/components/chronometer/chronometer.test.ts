import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import './chronometer.js';
import type { TpChronometer } from './chronometer.js';

describe('<tp-chronometer>', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T10:00:00'));
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('starts and updates elapsed time when play is clicked', () => {
    const element = document.createElement('tp-chronometer');
    document.body.append(element);

    const buttons = element.querySelectorAll('tp-icon-button');
    buttons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    vi.advanceTimersByTime(1530);

    const display = element.querySelector('[data-tp-chronometer-display]') as HTMLElement | null;
    expect(display?.textContent).toMatch(/^00:01\.\d{2}$/);
  });

  it('keeps elapsed time stable while paused', () => {
    const element = document.createElement('tp-chronometer');
    document.body.append(element);

    const buttons = element.querySelectorAll('tp-icon-button');
    buttons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    vi.advanceTimersByTime(1200);
    buttons[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const display = element.querySelector('[data-tp-chronometer-display]') as HTMLElement | null;
    const pausedValue = display?.textContent;

    vi.advanceTimersByTime(1000);
    expect(display?.textContent).toBe(pausedValue);
  });

  it('resets elapsed time when stop is clicked', () => {
    const element = document.createElement('tp-chronometer');
    document.body.append(element);

    const buttons = element.querySelectorAll('tp-icon-button');
    buttons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    vi.advanceTimersByTime(1500);
    buttons[2]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const display = element.querySelector('[data-tp-chronometer-display]') as HTMLElement | null;
    expect(display?.textContent).toBe('00:00.00');
  });

  it('applies custom size from attribute', () => {
    const element = document.createElement('tp-chronometer');
    element.setAttribute('size', '2rem');
    document.body.append(element);

    expect(element.style.getPropertyValue('--tp-chronometer-size')).toBe('2rem');
  });

  it('renders a timer icon before the numeric display', () => {
    const element = document.createElement('tp-chronometer');
    document.body.append(element);

    const icon = element.querySelector('tp-icon[data-tp-chronometer-icon]');
    expect(icon?.getAttribute('name')).toBe('timer');
  });

  it('normalise la taille vide via sa propriété publique', () => {
    const element = document.createElement('tp-chronometer') as TpChronometer;
    element.size = '2rem';
    expect(element.size).toBe('2rem');
    element.size = '';
    expect(element.size).toBe('1rem');
  });

  it('ignore les actions redondantes dans les états stables', () => {
    const element = document.createElement('tp-chronometer') as TpChronometer;
    element.setAttribute('size', '3rem');
    element.pause();
    element.stop();
    document.body.append(element);
    element.play();
    const timerCount = vi.getTimerCount();
    element.play();
    expect(vi.getTimerCount()).toBe(timerCount);
    element.remove();
    element.remove();
    expect(vi.getTimerCount()).toBe(0);
  });
});
