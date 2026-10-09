import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './icon.js';
import { TpIcon } from './icon.js';
import { tpInternalIcons } from './icon-internal.js';
import {
  clearTpIconRegistry,
  getAllTpIconLibraries,
  getTpIcon,
  getTpIconLibrary,
  hasTpIcon,
  listTpIconLibraries,
  listTpIcons,
  registerTpIcon,
  registerTpIconLibrary,
} from './icon-registry.js';
import { setupTpIcons } from './icon-setup.js';

describe('<tp-icon>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    clearTpIconRegistry();
    setupTpIcons();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    clearTpIconRegistry();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  async function createIcon(): Promise<TpIcon> {
    document.body.innerHTML = `
      <tp-icon name="close"></tp-icon>
    `;

    const element = document.querySelector('tp-icon');
    if (!(element instanceof TpIcon)) {
      throw new Error('Expected <tp-icon> instance.');
    }

    await Promise.resolve();
    return element;
  }

  it('extends HTMLElement', () => {
    const element = document.createElement('tp-icon');

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(TpIcon);
  });

  it('injects CSS once', async () => {
    const first = await createIcon();
    const second = document.createElement('tp-icon');
    second.setAttribute('name', 'check');
    document.body.append(second);

    await Promise.resolve();

    expect(document.head.querySelectorAll('#tp-icon-styles')).toHaveLength(1);
    expect(first).toBeInstanceOf(TpIcon);
  });

  it('registers internal tp icons', () => {
    expect(hasTpIcon('close', 'tp')).toBe(true);
    expect(hasTpIcon('check', 'tp')).toBe(true);
    expect(getTpIcon('close', 'tp')).toBe(tpInternalIcons.close);
  });

  it('lists libraries and icons', () => {
    expect(listTpIconLibraries()).toContain('tp');
    expect(listTpIcons('tp')).toContain('close');
  });

  it('registers a custom icon library', () => {
    registerTpIconLibrary('custom', {
      star: '<svg viewBox="0 0 24 24"></svg>',
    });

    expect(hasTpIcon('star', 'custom')).toBe(true);
    expect(getTpIcon('star', 'custom')).toContain('<svg');
  });

  it('registers a single custom icon', () => {
    registerTpIcon('home', '<svg viewBox="0 0 24 24"></svg>', 'mdi');

    expect(hasTpIcon('home', 'mdi')).toBe(true);
  });

  it('serializes complete libraries and handles missing libraries', () => {
    registerTpIconLibrary('custom', { zebra: '<svg>z</svg>', alpha: '<svg>a</svg>' });
    expect(listTpIcons('custom')).toEqual(['alpha', 'zebra']);
    expect(getTpIconLibrary('custom')).toEqual({ zebra: '<svg>z</svg>', alpha: '<svg>a</svg>' });
    expect(getAllTpIconLibraries().custom).toEqual(getTpIconLibrary('custom'));
    expect(getTpIcon('missing', 'absent')).toBeNull();
    expect(listTpIcons('absent')).toEqual([]);
    expect(getTpIconLibrary('absent')).toEqual({});
  });

  it('keeps existing registry entries and makes setup idempotent', () => {
    registerTpIcon('extra', '<svg>extra</svg>');
    registerTpIconLibrary('tp', { another: '<svg>another</svg>' });
    setupTpIcons();
    expect(getTpIcon('extra')).toBe('<svg>extra</svg>');
    expect(getTpIcon('another')).toBe('<svg>another</svg>');
  });

  it('uses tp as default library', async () => {
    const element = await createIcon();

    expect(element.library).toBe('tp');
  });

  it('reflects name property', async () => {
    const element = await createIcon();

    element.name = 'check';

    expect(element.getAttribute('name')).toBe('check');
    expect(element.name).toBe('check');
  });

  it('reflects library property', async () => {
    const element = await createIcon();

    element.library = 'mdi';

    expect(element.getAttribute('library')).toBe('mdi');
    expect(element.library).toBe('mdi');
  });

  it('reflects src property', async () => {
    const element = await createIcon();

    element.src = '/icons/test.svg';

    expect(element.getAttribute('src')).toBe('/icons/test.svg');
    expect(element.src).toBe('/icons/test.svg');
  });

  it('reflects color property', async () => {
    const element = await createIcon();

    element.color = 'red';

    expect(element.getAttribute('color')).toBe('red');
    expect(element.color).toBe('red');
  });

  it('reflects size property', async () => {
    const element = await createIcon();

    element.size = '24px';

    expect(element.getAttribute('size')).toBe('24px');
    expect(element.size).toBe('24px');
  });

  it('uses 1em as default size', async () => {
    const element = await createIcon();

    expect(element.size).toBe('1em');
  });

  it('reflects scale property', async () => {
    const element = await createIcon();

    element.scale = 2;

    expect(element.getAttribute('scale')).toBe('2');
    expect(element.scale).toBe(2);
  });

  it('reflects rotate property', async () => {
    const element = await createIcon();

    element.rotate = '90deg';

    expect(element.getAttribute('rotate')).toBe('90deg');
    expect(element.rotate).toBe('90deg');
  });

  it('normalizes numeric rotate values to deg', async () => {
    const element = await createIcon();
    element.setAttribute('rotate', '45');

    expect(element.rotate).toBe('45deg');
  });

  it('reflects flipH property', async () => {
    const element = await createIcon();

    expect(element.flipH).toBe(false);

    element.flipH = true;
    expect(element.hasAttribute('flip-h')).toBe(true);

    element.flipH = false;
    expect(element.hasAttribute('flip-h')).toBe(false);
  });

  it('reflects flipV property', async () => {
    const element = await createIcon();

    expect(element.flipV).toBe(false);

    element.flipV = true;
    expect(element.hasAttribute('flip-v')).toBe(true);

    element.flipV = false;
    expect(element.hasAttribute('flip-v')).toBe(false);
  });

  it('reflects spin property', async () => {
    const element = await createIcon();

    expect(element.spin).toBe(false);

    element.spin = true;
    expect(element.hasAttribute('spin')).toBe(true);

    element.spin = false;
    expect(element.hasAttribute('spin')).toBe(false);
  });

  it('reflects fallback property', async () => {
    const element = await createIcon();

    element.fallback = '?';

    expect(element.getAttribute('fallback')).toBe('?');
    expect(element.fallback).toBe('?');
  });

  it('reflects fallbackIcon property', async () => {
    const element = await createIcon();

    element.fallbackIcon = 'warning';

    expect(element.getAttribute('fallback-icon')).toBe('warning');
    expect(element.fallbackIcon).toBe('warning');
  });

  it('retire les propriétés textuelles lorsqu’elles sont vidées', async () => {
    const element = await createIcon();
    element.name = 'close';
    element.library = 'custom';
    element.src = '/icon.svg';
    element.size = '2rem';
    element.color = 'red';
    element.rotate = '1turn';
    element.fallback = '?';
    element.fallbackIcon = 'warning';

    element.name = '';
    element.library = '';
    element.src = '';
    element.size = '';
    element.color = '';
    element.rotate = '';
    element.fallback = '';
    element.fallbackIcon = '';

    expect(element.hasAttribute('name')).toBe(false);
    expect(element.library).toBe('tp');
    expect(element.hasAttribute('src')).toBe(false);
    expect(element.size).toBe('1em');
    expect(element.hasAttribute('color')).toBe(false);
    expect(element.rotate).toBe('0deg');
    expect(element.hasAttribute('fallback')).toBe(false);
    expect(element.hasAttribute('fallback-icon')).toBe(false);
  });

  it('normalise les transformations invalides et les dimensions complexes', async () => {
    const element = await createIcon();
    element.setAttribute('rotate', 'invalid');
    element.size = 'var(--icon-size)';
    element.scale = 2;

    expect(element.rotate).toBe('0deg');
    expect(element.style.getPropertyValue('--tp-icon-size')).toBe(
      'calc((var(--icon-size)) * 2)',
    );
  });

  it('réutilise son conteneur interne lors d’une reconnexion', async () => {
    const element = await createIcon();
    const container = element.querySelector('[data-tp-icon-container]');
    element.remove();
    document.body.append(element);
    await Promise.resolve();

    expect(element.querySelector('[data-tp-icon-container]')).toBe(container);
  });

  it('renders svg from the registry', async () => {
    const element = await createIcon();

    expect(element.querySelector('svg')).not.toBeNull();
  });

  it('renders nothing when icon is missing and no fallback is provided', async () => {
    document.body.innerHTML = `
      <tp-icon name="missing"></tp-icon>
    `;

    const element = document.querySelector('tp-icon');
    if (!(element instanceof TpIcon)) {
      throw new Error('Expected <tp-icon> instance.');
    }

    await Promise.resolve();

    expect(element.querySelector('svg')).toBeNull();
    expect(element.textContent).toBe('');
  });

  it('renders fallback text when icon is missing and fallback is provided', async () => {
    document.body.innerHTML = `
      <tp-icon name="missing" fallback="?"></tp-icon>
    `;

    const element = document.querySelector('tp-icon');
    if (!(element instanceof TpIcon)) {
      throw new Error('Expected <tp-icon> instance.');
    }

    await Promise.resolve();

    const fallback = element.querySelector('[data-tp-icon-fallback]');
    expect(fallback).not.toBeNull();
    expect(fallback?.textContent).toBe('?');
  });

  it('renders fallback icon when icon is missing and fallback-icon is provided', async () => {
    document.body.innerHTML = `
      <tp-icon name="missing" fallback-icon="warning"></tp-icon>
    `;

    const element = document.querySelector('tp-icon');
    if (!(element instanceof TpIcon)) {
      throw new Error('Expected <tp-icon> instance.');
    }

    await Promise.resolve();

    expect(element.querySelector('svg')).not.toBeNull();
  });

  it('prefers fallback-icon over fallback text', async () => {
    document.body.innerHTML = `
      <tp-icon name="missing" fallback-icon="warning" fallback="?"></tp-icon>
    `;

    const element = document.querySelector('tp-icon');
    if (!(element instanceof TpIcon)) {
      throw new Error('Expected <tp-icon> instance.');
    }

    await Promise.resolve();

    expect(element.querySelector('svg')).not.toBeNull();
    expect(element.querySelector('[data-tp-icon-fallback]')).toBeNull();
  });

  it('renders icon from a custom library', async () => {
    registerTpIconLibrary('mdi', {
      home: `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 10L12 4L20 10V20H4Z"></path>
        </svg>
      `.trim(),
    });

    document.body.innerHTML = `
      <tp-icon library="mdi" name="home"></tp-icon>
    `;

    const element = document.querySelector('tp-icon');
    if (!(element instanceof TpIcon)) {
      throw new Error('Expected <tp-icon> instance.');
    }

    await Promise.resolve();

    expect(element.querySelector('svg')).not.toBeNull();
    expect(element.innerHTML).toContain('data-tp-icon-container');
  });

  it('loads svg from src with fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          '<svg viewBox="0 0 24 24"><path d="M0 0H24V24H0Z"></path></svg>',
      }),
    );

    document.body.innerHTML = `
      <tp-icon src="/icons/logo.svg"></tp-icon>
    `;

    const element = document.querySelector('tp-icon');
    if (!(element instanceof TpIcon)) {
      throw new Error('Expected <tp-icon> instance.');
    }

    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    {
      const firstCall = vi.mocked(fetch).mock.calls[0] as [RequestInfo | URL, RequestInit?] | undefined;
      const requestedPath = new URL(String(firstCall?.[0]), window.location.href).pathname;
      expect(requestedPath).toBe('/icons/logo.svg');
    }
    expect(
      element.querySelector('[data-tp-icon-container]'),
    ).not.toBeNull();
  });

  it('résout src depuis le document Markdown courant', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<svg id="docs"></svg>',
      }),
    );

    document.body.innerHTML = `
      <div data-tp-markdown-source="/docs/components/icon/index.md">
        <tp-icon src="icons/logo.svg"></tp-icon>
      </div>
    `;

    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    const firstCall = vi.mocked(fetch).mock.calls[0] as [RequestInfo | URL, RequestInit?] | undefined;
    const requestedPath = new URL(String(firstCall?.[0]), window.location.href).pathname;

    expect(requestedPath).toBe('/docs/components/icon/icons/logo.svg');
  });

  it('falls back to registry when src fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        text: async () => '',
      }),
    );

    document.body.innerHTML = `
      <tp-icon src="/icons/missing.svg" name="close"></tp-icon>
    `;

    const element = document.querySelector('tp-icon');
    if (!(element instanceof TpIcon)) {
      throw new Error('Expected <tp-icon> instance.');
    }

    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('svg')).not.toBeNull();
  });

  it('uses fallback icon when src and name both fail', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error')),
    );

    document.body.innerHTML = `
      <tp-icon
        src="/icons/missing.svg"
        name="missing"
        fallback-icon="warning"
      ></tp-icon>
    `;

    const element = document.querySelector('tp-icon');
    if (!(element instanceof TpIcon)) {
      throw new Error('Expected <tp-icon> instance.');
    }

    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('svg')).not.toBeNull();
  });

  it('applies size CSS variable', async () => {
    const element = await createIcon();
    element.size = '32px';

    expect(element.style.getPropertyValue('--tp-icon-size')).toBe('32px');
  });

  it('applies color style', async () => {
    const element = await createIcon();
    element.color = 'blue';

    expect(element.style.color).toBe('blue');
  });

  it('applies any CSS color to explicit visible SVG fills', async () => {
    const element = await createIcon();
    element.color = 'var(--tp-brand-text-colorful, tomato)';
    await Promise.resolve();
    await Promise.resolve();

    const painted = element.querySelector<SVGElement>('svg [fill]:not([fill="none"])');
    expect(painted).not.toBeNull();
    expect(painted?.style.fill).toBe('var(--tp-brand-text-colorful, tomato)');
  });

  it('preserves contrasting fills when coloring a number icon', async () => {
    registerTpIcon(
      '2',
      '<svg viewBox="0 0 24 24"><circle fill="white" stroke="currentColor" cx="12" cy="12" r="11"/><path fill="none" stroke="currentColor" d="M10 8h4"/></svg>',
      'numbers-test',
    );
    const element = document.createElement('tp-icon') as TpIcon;
    element.setAttribute('name', '2');
    element.setAttribute('library', 'numbers-test');
    element.setAttribute('color', 'tomato');
    document.body.append(element);
    await Promise.resolve();
    await Promise.resolve();

    const circle = element.querySelector<SVGElement>('circle');
    const path = element.querySelector<SVGElement>('path');
    expect(circle?.getAttribute('fill')).toBe('white');
    expect(circle?.style.fill).toBe('');
    expect(circle?.style.stroke).toBe('tomato');
    expect(path?.getAttribute('fill')).toBe('none');
    expect(path?.style.fill).toBe('');
    expect(path?.style.stroke).toBe('tomato');
  });

  it('applies transform style for scale and rotate', async () => {
    const element = await createIcon();
    element.scale = 1.5;
    element.rotate = '90deg';

    const container = element.querySelector('[data-tp-icon-container]');
    expect(container).not.toBeNull();
    expect(element.style.getPropertyValue('--tp-icon-size')).toBe('1.5em');
    expect((container as HTMLElement).style.transform).toContain('scale(1, 1)');
    expect((container as HTMLElement).style.transform).toContain(
      'rotate(90deg)',
    );
  });

  it('ignores rotate while spin is active and preserves scale', async () => {
    const element = await createIcon();
    element.scale = 1.5;
    element.rotate = '90deg';
    element.spin = true;

    const container = element.querySelector<HTMLElement>('[data-tp-icon-container]');
    expect(element.style.getPropertyValue('--tp-icon-size')).toBe('1.5em');
    expect(container?.style.transform).toContain('scale(1, 1)');
    expect(container?.style.transform).toContain('rotate(0deg)');
    expect(container?.style.transform).not.toContain('rotate(90deg)');
  });

  it('applies transform style for horizontal and vertical flips', async () => {
    const element = await createIcon();
    element.flipH = true;
    element.flipV = true;

    const container = element.querySelector('[data-tp-icon-container]');
    expect((container as HTMLElement).style.transform).toContain(
      'scale(-1, -1)',
    );
  });

  it('uses inline svg in priority', async () => {
    document.body.innerHTML = `
      <tp-icon>
        <svg id="inline"></svg>
      </tp-icon>
    `;

    const el = document.querySelector('tp-icon') as TpIcon;
    await Promise.resolve();

    expect(el.querySelector('#inline')).not.toBeNull();
  });

  it('prefers inline over src and name', async () => {
    vi.stubGlobal('fetch', vi.fn());

    document.body.innerHTML = `
      <tp-icon name="close" src="/x.svg">
        <svg id="inline"></svg>
      </tp-icon>
    `;

    const el = document.querySelector('tp-icon') as TpIcon;
    await Promise.resolve();

    expect(el.querySelector('#inline')).not.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('uses src when no inline', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<svg id="src"></svg>',
      }),
    );

    document.body.innerHTML = `<tp-icon src="/x.svg"></tp-icon>`;

    const el = document.querySelector('tp-icon') as TpIcon;
    await Promise.resolve();
    await Promise.resolve();

    {
      const firstCall = vi.mocked(fetch).mock.calls[0] as [RequestInfo | URL, RequestInit?] | undefined;
      const requestedPath = new URL(String(firstCall?.[0]), window.location.href).pathname;
      expect(requestedPath).toBe('/x.svg');
    }
    expect(el.querySelector('[data-tp-icon-container]')).not.toBeNull();
  });
});
