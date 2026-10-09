import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import './alarm.js';
import type { TpAlarm } from './alarm.js';

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

describe('<tp-alarm>', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T10:00:00'));
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('triggers when current time matches configured alarm time', () => {
    const element = document.createElement('tp-alarm');
    element.setAttribute('time', '10:00:01');
    element.setAttribute('silent', '');

    const onTrigger = vi.fn();
    element.addEventListener('tp-alarm-trigger', onTrigger);
    document.body.append(element);

    vi.advanceTimersByTime(1200);

    expect(element.hasAttribute('data-alert')).toBe(true);
    expect(onTrigger).toHaveBeenCalledTimes(1);
  });

  it('clears alert when stop control is clicked', () => {
    const element = document.createElement('tp-alarm');
    element.setAttribute('time', '10:00:01');
    element.setAttribute('silent', '');
    document.body.append(element);

    vi.advanceTimersByTime(1200);
    const stopButton = element.querySelector('tp-icon-button[name="stop"]');
    stopButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(element.hasAttribute('data-alert')).toBe(false);
    expect(element.hasAttribute('data-stopped')).toBe(true);
  });

  it('renders a notifications icon on the left', () => {
    const element = document.createElement('tp-alarm');
    element.setAttribute('time', '10:00:00');
    element.setAttribute('silent', '');
    document.body.append(element);

    const icon = element.querySelector('tp-icon[data-tp-alarm-icon]');
    expect(icon?.getAttribute('name')).toBe('notifications');
  });

  it('marks invalid time formats', () => {
    const element = document.createElement('tp-alarm');
    element.setAttribute('time', '99:99:99');
    element.setAttribute('silent', '');
    document.body.append(element);

    vi.advanceTimersByTime(300);
    expect(element.hasAttribute('data-invalid')).toBe(true);
  });

  it('does not ring in silent mode', () => {
    const audio = installAudioContextMock();

    const element = document.createElement('tp-alarm');
    element.setAttribute('time', '10:00:01');
    element.setAttribute('silent', '');
    document.body.append(element);

    vi.advanceTimersByTime(1200);
    expect(audio.created()).toBe(0);
  });

  it('does not emit extra sound when stop is clicked after trigger', () => {
    const audio = installAudioContextMock();

    const element = document.createElement('tp-alarm');
    element.setAttribute('time', '10:00:01');
    document.body.append(element);

    vi.advanceTimersByTime(1200);
    const createdBeforeStop = audio.created();
    const stopButton = element.querySelector('tp-icon-button[name="stop"]');
    stopButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    vi.advanceTimersByTime(5000);

    expect(audio.created()).toBe(createdBeforeStop);
  });

  it('emits 10 beeps when alarm is triggered', () => {
    const audio = installAudioContextMock();

    const element = document.createElement('tp-alarm');
    element.setAttribute('time', '10:00:01');
    document.body.append(element);

    vi.advanceTimersByTime(6000);
    expect(audio.created()).toBe(10);
  });

  it('allows editing alarm time from input', () => {
    const element = document.createElement('tp-alarm');
    element.setAttribute('time', '10:00:00');
    element.setAttribute('silent', '');
    document.body.append(element);

    const input = element.querySelector('[data-tp-alarm-time]') as HTMLInputElement | null;
    if (input === null) {
      throw new Error('Alarm input not found');
    }

    input.value = '10:05:00';
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(element.getAttribute('time')).toBe('10:05:00');
    expect(element.querySelector('[data-tp-alarm-display]')?.textContent).toBe('10:05:00');
  });

  it('applies custom size from attribute', () => {
    const element = document.createElement('tp-alarm');
    element.setAttribute('time', '10:00:00');
    element.setAttribute('size', '2rem');
    element.setAttribute('silent', '');
    document.body.append(element);

    expect(element.style.getPropertyValue('--tp-alarm-size')).toBe('2rem');
  });

  it('restarts checking when play control is clicked after stop', () => {
    const element = document.createElement('tp-alarm');
    element.setAttribute('time', '10:00:01');
    element.setAttribute('silent', '');
    document.body.append(element);

    const stopButton = element.querySelector('tp-icon-button[name="stop"]');
    stopButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    vi.advanceTimersByTime(1200);
    expect(element.hasAttribute('data-alert')).toBe(false);

    const playButton = element.querySelector('tp-icon-button[name="play"]');
    playButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    vi.advanceTimersByTime(300);
    expect(element.hasAttribute('data-alert')).toBe(true);
  });

  it('expose et normalise ses propriétés publiques', () => {
    const element = document.createElement('tp-alarm') as TpAlarm;
    element.time = '08:30';
    element.size = '2rem';
    element.silent = true;
    expect(element.time).toBe('08:30');
    expect(element.size).toBe('2rem');
    expect(element.silent).toBe(true);

    element.size = '';
    element.silent = false;
    expect(element.size).toBe('1rem');
    expect(element.silent).toBe(false);
  });

  it('ignore une saisie horaire vide', () => {
    const element = document.createElement('tp-alarm') as TpAlarm;
    document.body.append(element);
    const input = element.querySelector<HTMLInputElement>('[data-tp-alarm-time]');
    if (input === null) throw new Error('Alarm input not found');
    input.value = '';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(element.time).toBe('07:00');
  });
});
