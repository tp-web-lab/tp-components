import { afterEach, describe, expect, it, vi } from 'vitest';
import './game-life.js';
import { TpGameLife } from './game-life.js';

describe('<tp-game-life>', () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.useRealTimers();
  });
  it('extends HTMLElement', () => {
    const element = document.createElement('tp-game-life');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpGameLife);
  });

  it('renders toolbar from preset', async () => {
    const element = document.createElement('tp-game-life');
    element.setAttribute('preset', 'glider');
    document.body.append(element);

    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('[data-role="svg"]')).not.toBeNull();
    expect(element.querySelector('tp-button[data-action="step"]')).not.toBeNull();
    expect(element.querySelector('tp-button[data-action="play"]')).not.toBeNull();
    expect(element.querySelector('tp-button[data-action="reset"]')).not.toBeNull();
  });

  it('renders and escapes a script-authored labelled program', async () => {
    const element = document.createElement('tp-game-life');
    element.setAttribute('label', '<Pattern & demo>');
    element.setAttribute('cell-size', 'bad');
    element.setAttribute('padding', '-2');
    element.setAttribute('grid-stroke-width', '0');
    element.setAttribute('cell-radius', '-1');
    element.innerHTML = `<script type="tp/game-life">
      grid width=3 height=3
      pattern(0,0) {
        .*.
        ***
      }
    </script>`;
    document.body.append(element);
    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('.tp-game-life-label')?.textContent).toBe('<Pattern & demo>');
    expect(element.querySelector('[data-role="svg"] svg')).not.toBeNull();
    expect(element.querySelector('tp-button[data-action="download"]')?.getAttribute('href')).toMatch(/^data:/);
  });

  it('steps, plays, pauses, resets, and stops its timer on disconnect', async () => {
    vi.useFakeTimers();
    const element = document.createElement('tp-game-life');
    element.setAttribute('preset', 'blinker');
    element.setAttribute('interval', '1');
    element.setAttribute('wrap', '');
    document.body.append(element);
    await Promise.resolve();
    await Promise.resolve();

    element.querySelector<HTMLElement>('tp-button[data-action="step"]')?.click();
    element.querySelector<HTMLElement>('tp-button[data-action="play"]')?.click();
    expect(element.querySelector('tp-button[data-action="play"]')?.textContent).toContain('Pause');
    vi.advanceTimersByTime(32);
    element.querySelector<HTMLElement>('tp-button[data-action="play"]')?.click();
    expect(element.querySelector('tp-button[data-action="play"]')?.textContent).toContain('Play');
    element.querySelector<HTMLElement>('tp-button[data-action="reset"]')?.click();
    await Promise.resolve();
    element.remove();
  });

  it('supports preset dimensions, steps, autoplay, and visual options', async () => {
    vi.useFakeTimers();
    const element = document.createElement('tp-game-life');
    for (const [name, value] of Object.entries({
      preset: 'toad', 'preset-width': '24', 'preset-height': '12', 'preset-x': '2',
      'preset-y': '3', steps: '2', autoplay: '', interval: '20', background: '#fff',
      'alive-color': '#000', 'dead-color': '#eee', 'grid-color': '#ccc',
    })) element.setAttribute(name, value);
    document.body.append(element);
    await Promise.resolve();
    await Promise.resolve();
    expect(element.querySelector('[data-role="svg"]')).not.toBeNull();
    expect(element.querySelector('tp-button[data-action="play"]')?.textContent).toContain('Pause');
    element.remove();
  });

  it.each(['unknown', ''])('renders a useful error for preset %j', async (preset) => {
    const element = document.createElement('tp-game-life');
    if (preset !== '') element.setAttribute('preset', preset);
    document.body.append(element);
    await Promise.resolve();
    await Promise.resolve();
    expect(element.querySelector('.tp-game-life-error')?.textContent).toContain('tp-game-life error');
  });
});
