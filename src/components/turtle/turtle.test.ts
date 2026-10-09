import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './turtle.js';

const source = `
turtle x=0 y=0 heading=0 speed=6
forward 40
right 90
forward 20
`;

async function settle(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe('<tp-turtle>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('renders an accessible responsive SVG with toolbar and caption', async () => {
    const element = document.createElement('tp-turtle');
    element.setAttribute('width', '420');
    element.setAttribute('height', '220');
    element.setAttribute('background', 'white');
    element.setAttribute('label', 'A drawing');
    element.innerHTML = `<script type="tp/turtle">${source}</script>`;
    document.body.append(element);
    await settle();
    const svg = element.querySelector('svg');
    expect(element.classList.contains('tp-turtle')).toBe(true);
    expect(document.head.querySelectorAll('#tp-turtle-styles')).toHaveLength(1);
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('A drawing');
    expect(svg?.style.maxWidth).toBe('100%');
    expect(element.querySelector('figcaption')?.textContent).toBe('A drawing');
  });

  it('uses safe labels, numeric fallbacks, and an accessible default SVG name', async () => {
    const element = document.createElement('tp-turtle');
    element.setAttribute('width', 'invalid');
    element.setAttribute('height', 'invalid');
    element.setAttribute('save-label', '<Save>');
    element.setAttribute('replay-label', '<Replay>');
    element.innerHTML = `<script type="tp/turtle">${source}</script>`;
    document.body.append(element);
    await settle();
    expect(element.querySelector('svg')?.getAttribute('aria-label')).toBe('Turtle drawing');
    expect(element.querySelector('[data-action="save-svg"]')?.textContent).toBe('<Save>');
    expect(element.querySelector('[data-action="replay"]')?.textContent).toBe('<Replay>');
    expect(element.querySelector('figcaption')).toBeNull();
  });

  it('loads remote programs and renders fetch failures as alerts', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, text: async () => source })
      .mockResolvedValueOnce({ ok: false, status: 500 });
    vi.stubGlobal('fetch', fetchMock);
    const element = document.createElement('tp-turtle');
    element.setAttribute('src', '/drawing.turtle');
    document.body.append(element);
    await settle();
    expect(element.querySelector('svg')).not.toBeNull();
    element.setAttribute('src', '/missing.turtle');
    await settle();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('500');
  });

  it('escapes parser errors and supports non-Error failures', async () => {
    const element = document.createElement('tp-turtle');
    element.innerHTML = '<script type="tp/turtle">invalid &lt;command&gt;</script>';
    document.body.append(element);
    await settle();
    expect(element.querySelector('[role="alert"]')).not.toBeNull();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('<offline>'));
    element.setAttribute('src', '/offline.turtle');
    await settle();
    expect(element.innerHTML).toContain('&lt;offline&gt;');
  });

  it('downloads the current SVG with a normalized filename', async () => {
    const createObjectURL = vi.fn(() => 'blob:test');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL, revokeObjectURL }));
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const element = document.createElement('tp-turtle');
    element.setAttribute('download-name', 'drawing');
    element.innerHTML = `<script type="tp/turtle">${source}</script>`;
    document.body.append(element);
    await settle();
    element.querySelector<HTMLButtonElement>('[data-action="save-svg"]')?.click();
    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');
  });

  it('replays static and animated programs', async () => {
    vi.useFakeTimers();
    const element = document.createElement('tp-turtle');
    element.innerHTML = `<script type="tp/turtle">${source}</script>`;
    document.body.append(element);
    await settle();
    element.querySelector<HTMLButtonElement>('[data-action="replay"]')?.click();
    vi.advanceTimersByTime(40_000);
    expect(element.querySelector('svg')).not.toBeNull();
    vi.useRealTimers();
  });

  it('replays turns, style changes, forward moves and goto segments', async () => {
    vi.useFakeTimers();
    const element = document.createElement('tp-turtle');
    element.innerHTML = `<script type="tp/turtle">
      turtle x=1 y=2 heading=10 speed=20
      style speed=0
      left 20
      forward 10
      right 30
      goto(20,30,true)
    </script>`;
    document.body.append(element);
    await settle();
    element.querySelector<HTMLButtonElement>('[data-action="replay"]')?.click();
    vi.advanceTimersByTime(40_000);
    expect(element.querySelector('svg')).not.toBeNull();
    vi.useRealTimers();
  });

  it('handles replay without drawable commands and a missing viewport', async () => {
    const staticElement = document.createElement('tp-turtle');
    staticElement.innerHTML = '<script type="tp/turtle">turtle x=0 y=0</script>';
    document.body.append(staticElement);
    await settle();
    staticElement.querySelector<HTMLButtonElement>('[data-action="replay"]')?.click();
    expect(staticElement.querySelector('svg')).not.toBeNull();

    const element = document.createElement('tp-turtle');
    element.innerHTML = `<script type="tp/turtle">${source}</script>`;
    document.body.append(element);
    await settle();
    const replay = element.querySelector<HTMLButtonElement>('[data-action="replay"]')!;
    element.querySelector('[data-role="svg-host"]')?.remove();
    replay.click();
    expect(replay.isConnected).toBe(true);
  });
});
