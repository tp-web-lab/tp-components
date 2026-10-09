import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import './timer.js';
import type { TpTimer } from './timer.js';

function installAudioContextMock(): { created: () => number } {
  let createdCount = 0;

  class AudioContextMock {
    public destination = {} as AudioDestinationNode;

    public currentTime = 0;

    public constructor() {
      createdCount += 1;
    }

    public createOscillator(): OscillatorNode {
      return {
        type: 'sine',
        frequency: { value: 0 } as AudioParam,
        connect: () => undefined,
        start: () => undefined,
        stop: () => undefined,
      } as unknown as OscillatorNode;
    }

    public createGain(): GainNode {
      const gainParam = {
        value: 0,
        setValueAtTime: () => undefined,
        linearRampToValueAtTime: () => undefined,
        exponentialRampToValueAtTime: () => undefined,
      } as unknown as AudioParam;

      return {
        gain: gainParam,
        connect: () => undefined,
      } as unknown as GainNode;
    }

    public close(): Promise<void> {
      return Promise.resolve();
    }

    public resume(): Promise<void> {
      return Promise.resolve();
    }
  }

  vi.stubGlobal('AudioContext', AudioContextMock as unknown as typeof AudioContext);
  return { created: () => createdCount };
}

describe('<tp-timer>', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('counts down and emits elapsed state', () => {
    const element = document.createElement('tp-timer');
    element.setAttribute('duration', '2');
    element.setAttribute('silent', '');

    const onElapsed = vi.fn();
    element.addEventListener('tp-timer-elapsed', onElapsed);
    document.body.append(element);

    vi.advanceTimersByTime(2200);

    const display = element.querySelector('[data-tp-timer-display]') as HTMLElement | null;
    expect(display?.textContent).toBe('00:00');
    expect(element.hasAttribute('data-elapsed')).toBe(true);
    expect(onElapsed).toHaveBeenCalledTimes(1);
  });

  it('resets countdown when stop control is clicked', () => {
    const element = document.createElement('tp-timer');
    element.setAttribute('duration', '5');
    element.setAttribute('silent', '');
    document.body.append(element);

    vi.advanceTimersByTime(2200);
    const stopButton = element.querySelector('tp-icon-button[name="stop"]');
    stopButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const display = element.querySelector('[data-tp-timer-display]') as HTMLElement | null;
    expect(display?.textContent).toBe('00:05');
    expect(element.hasAttribute('data-elapsed')).toBe(false);
    expect(element.hasAttribute('data-stopped')).toBe(true);
  });

  it('renders a camera-timer icon on the left', () => {
    const element = document.createElement('tp-timer');
    element.setAttribute('silent', '');
    document.body.append(element);

    const icon = element.querySelector('tp-icon[data-tp-timer-icon]');
    expect(icon?.getAttribute('name')).toBe('camera-timer');
  });

  it('does not ring when silent is enabled', () => {
    const audio = installAudioContextMock();

    const element = document.createElement('tp-timer');
    element.setAttribute('duration', '1');
    element.setAttribute('silent', '');
    document.body.append(element);

    vi.advanceTimersByTime(1500);
    expect(audio.created()).toBe(0);
  });

  it('rings when countdown reaches zero', () => {
    const audio = installAudioContextMock();

    const element = document.createElement('tp-timer');
    element.setAttribute('duration', '1');
    document.body.append(element);

    vi.advanceTimersByTime(2500);
    expect(audio.created()).toBe(3);
  });

  it('does not emit extra sound when stop is clicked after elapsed', () => {
    const audio = installAudioContextMock();

    const element = document.createElement('tp-timer');
    element.setAttribute('duration', '1');
    document.body.append(element);

    vi.advanceTimersByTime(1500);
    const createdBeforeStop = audio.created();
    const stopButton = element.querySelector('tp-icon-button[name="stop"]');
    stopButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    vi.advanceTimersByTime(3000);

    expect(audio.created()).toBe(createdBeforeStop);
  });

  it('allows editing duration from input', () => {
    const element = document.createElement('tp-timer');
    element.setAttribute('duration', '5');
    element.setAttribute('silent', '');
    document.body.append(element);

    const input = element.querySelector('[data-tp-timer-duration]') as HTMLInputElement | null;
    if (input === null) {
      throw new Error('Timer input not found');
    }

    input.value = '8';
    input.dispatchEvent(new Event('change', { bubbles: true }));

    const display = element.querySelector('[data-tp-timer-display]') as HTMLElement | null;
    expect(element.getAttribute('duration')).toBe('8');
    expect(display?.textContent).toBe('00:08');
  });

  it('applies custom size from attribute', () => {
    const element = document.createElement('tp-timer');
    element.setAttribute('size', '2rem');
    element.setAttribute('silent', '');
    document.body.append(element);

    expect(element.style.getPropertyValue('--tp-timer-size')).toBe('2rem');
  });

  it('restarts countdown when play control is clicked after stop', () => {
    const element = document.createElement('tp-timer');
    element.setAttribute('duration', '5');
    element.setAttribute('silent', '');
    document.body.append(element);

    vi.advanceTimersByTime(2200);
    const stopButton = element.querySelector('tp-icon-button[name="stop"]');
    stopButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const playButton = element.querySelector('tp-icon-button[name="play"]');
    playButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    vi.advanceTimersByTime(1100);

    const display = element.querySelector('[data-tp-timer-display]') as HTMLElement | null;
    expect(display?.textContent).toBe('00:04');
    expect(element.hasAttribute('data-stopped')).toBe(false);
  });

  it('normalise ses propriétés publiques', () => {
    const element = document.createElement('tp-timer') as TpTimer;
    element.duration = 2.6;
    element.size = '2rem';
    element.silent = true;
    expect(element.duration).toBe(3);
    expect(element.size).toBe('2rem');
    expect(element.silent).toBe(true);

    element.setAttribute('duration', 'invalid');
    element.size = '';
    element.silent = false;
    expect(element.duration).toBe(60);
    expect(element.size).toBe('1rem');
    expect(element.silent).toBe(false);
  });

  it('refuse une durée saisie invalide', () => {
    const element = document.createElement('tp-timer') as TpTimer;
    element.duration = 5;
    document.body.append(element);
    const input = element.querySelector<HTMLInputElement>('[data-tp-timer-duration]');
    if (input === null) throw new Error('Timer input not found');
    input.value = '0';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(input.value).toBe('5');
    expect(element.duration).toBe(5);
  });

  it('ne redémarre pas après un changement de durée à l’arrêt', () => {
    const element = document.createElement('tp-timer') as TpTimer;
    document.body.append(element);
    element.querySelector('tp-icon-button[name="stop"]')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    element.duration = 10;
    expect(element.hasAttribute('data-stopped')).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });
});
