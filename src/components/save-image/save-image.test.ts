import { afterEach, describe, expect, it, vi } from 'vitest';
import { TpSaveImage } from './save-image.js';

describe('<tp-save-image>', () => {
  afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks(); });

  it('renders an icon trigger and the three image formats', () => {
    document.body.innerHTML = '<svg id="image"></svg><tp-save-image anchor="#image"></tp-save-image>';
    const control = document.querySelector('tp-save-image');
    expect(control?.querySelector(':scope > tp-icon-button')?.getAttribute('name')).toBe('image-download');
    expect([...control?.querySelectorAll('[data-format]') ?? []].map((item) => item.textContent)).toEqual(['SVG', 'PNG', 'WEBP']);
  });

  it('serializes and downloads an anchored SVG', async () => {
    document.body.innerHTML = '<svg id="image" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>';
    const control = new TpSaveImage();
    control.anchor = '#image';
    control.filename = 'drawing';
    document.body.append(control);
    const createUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    vi.spyOn(window, 'prompt').mockReturnValue('renamed-drawing.svg');
    const listener = vi.fn();
    control.addEventListener('tp-save-image-save', listener);
    await control.save('svg');
    expect(createUrl).toHaveBeenCalledWith(expect.objectContaining({ type: 'image/svg+xml' }));
    expect(click).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail.filename).toBe('renamed-drawing.svg');
  });

  it('uses exportSvg when the anchored component provides it', async () => {
    const target = document.createElement('section') as HTMLElement & { exportSvg: () => string };
    target.id = 'exportable';
    target.exportSvg = vi.fn(() => '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    document.body.append(target);
    const control = new TpSaveImage();
    control.anchor = '#exportable';
    document.body.append(control);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    vi.spyOn(window, 'prompt').mockReturnValue('image.svg');
    await control.save('svg');
    expect(target.exportSvg).toHaveBeenCalledOnce();
  });

  it('writes to the file selected by the native Save as dialog', async () => {
    document.body.innerHTML = '<svg id="native-image" viewBox="0 0 10 10"></svg>';
    const write = vi.fn(async () => undefined);
    const close = vi.fn(async () => undefined);
    const picker = vi.fn(async () => ({
      name: 'chosen-name.svg',
      createWritable: async () => ({ write, close }),
    }));
    Object.defineProperty(window, 'showSaveFilePicker', { configurable: true, value: picker });
    const control = new TpSaveImage();
    control.anchor = '#native-image';
    document.body.append(control);
    await control.save('svg');
    expect(picker).toHaveBeenCalledWith(expect.objectContaining({ suggestedName: 'image.svg' }));
    expect(write).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledOnce();
    Reflect.deleteProperty(window, 'showSaveFilePicker');
  });

  it('reflects presentation properties and safe defaults', () => {
    const control = new TpSaveImage();
    control.name = 'download';
    control.filename = 'My image.PNG';
    control.variant = 'brand';
    control.size = 'l';
    control.disabled = true;
    expect(control.name).toBe('download');
    expect(control.filename).toBe('My image.PNG');
    expect(control.variant).toBe('brand');
    expect(control.size).toBe('l');
    expect(control.disabled).toBe(true);
    control.setAttribute('variant', 'invalid');
    control.setAttribute('size', 'invalid');
    expect(control.variant).toBe('neutral');
    expect(control.size).toBe('m');
  });

  it('updates and reuses its trigger and dropdown', () => {
    const control = new TpSaveImage();
    document.body.append(control);
    const trigger = control.querySelector('tp-icon-button');
    const dropdown = control.querySelector('tp-dropdown');
    control.name = 'camera';
    control.disabled = true;
    expect(control.querySelector('tp-icon-button')).toBe(trigger);
    expect(control.querySelector('tp-dropdown')).toBe(dropdown);
    expect(trigger?.getAttribute('name')).toBe('camera');
    expect(trigger?.hasAttribute('disabled')).toBe(true);
  });

  it('opens the format dropdown only while enabled', () => {
    const control = new TpSaveImage();
    document.body.append(control);
    const dropdown = control.querySelector('tp-dropdown') as HTMLElement & { toggle: () => void };
    const toggle = vi.spyOn(dropdown, 'toggle').mockImplementation(() => undefined);
    control.querySelector<HTMLElement>('tp-icon-button')?.click();
    expect(toggle).toHaveBeenCalledOnce();
    control.disabled = true;
    control.querySelector<HTMLElement>('tp-icon-button')?.click();
    expect(toggle).toHaveBeenCalledOnce();
  });

  it('rejects unsupported formats and missing or invalid anchors', async () => {
    const control = new TpSaveImage();
    await expect(control.save('gif' as 'svg')).rejects.toThrow('Unsupported image format');
    await expect(control.save('svg')).rejects.toThrow('No image matches');
    control.anchor = '[invalid';
    await expect(control.save('svg')).rejects.toThrow('No image matches');
  });

  it('emits an error when the anchored content is not exportable', async () => {
    document.body.innerHTML = '<div id="plain">Text</div>';
    const control = new TpSaveImage();
    control.anchor = '#plain';
    document.body.append(control);
    vi.spyOn(window, 'prompt').mockReturnValue('plain.svg');
    const error = vi.fn();
    control.addEventListener('tp-save-image-error', error);
    await expect(control.save('svg')).rejects.toThrow('does not contain an exportable image');
    expect(error).toHaveBeenCalledOnce();
  });

  it('cancels cleanly when no save target is selected', async () => {
    document.body.innerHTML = '<svg id="image"></svg>';
    const control = new TpSaveImage();
    control.anchor = '#image';
    document.body.append(control);
    vi.spyOn(window, 'prompt').mockReturnValue(null);
    await expect(control.save('svg')).resolves.toBeUndefined();
  });

  it('derives SVG sizes from dimensions, viewBox, and element bounds', () => {
    const control = new TpSaveImage() as unknown as {
      svgSize: (source: string, target: Element) => { width: number; height: number };
      imageSize: (source: HTMLCanvasElement | HTMLImageElement) => { width: number; height: number };
      safeFilename: () => string;
    };
    const target = document.createElement('div');
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      bottom: 600, height: 600, left: 0, right: 800, top: 0, width: 800, x: 0, y: 0,
      toJSON: () => ({}),
    });
    expect(control.svgSize('<svg width="320" height="200"/>', target)).toEqual({ width: 320, height: 200 });
    expect(control.svgSize('<svg viewBox="0 0 640 480"/>', target)).toEqual({ width: 640, height: 480 });
    expect(control.svgSize('<svg width="100%" height="100%"/>', target)).toEqual({ width: 800, height: 600 });
    const canvas = document.createElement('canvas');
    canvas.width = 0;
    canvas.height = 0;
    expect(control.imageSize(canvas)).toEqual({ width: 1, height: 1 });
    expect(control.safeFilename()).toBe('image');
  });

  it('encodes canvas blobs and reports encoding failures', async () => {
    const control = new TpSaveImage() as unknown as {
      canvasBlob: (canvas: HTMLCanvasElement, format: 'png' | 'webp') => Promise<Blob>;
    };
    const canvas = document.createElement('canvas');
    const blob = new Blob(['x'], { type: 'image/png' });
    vi.spyOn(canvas, 'toBlob').mockImplementation((callback) => callback(blob));
    await expect(control.canvasBlob(canvas, 'png')).resolves.toBe(blob);
    vi.spyOn(canvas, 'toBlob').mockImplementation((callback) => callback(null));
    await expect(control.canvasBlob(canvas, 'webp')).rejects.toThrow('could not be encoded as WEBP');
  });

  it('wraps canvas and image sources in SVG', async () => {
    const control = new TpSaveImage() as unknown as {
      createSvg: (target: Element) => Promise<string>;
      imageSize: (source: HTMLCanvasElement | HTMLImageElement) => { width: number; height: number };
    };
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 30;
    vi.spyOn(canvas, 'toDataURL').mockReturnValue('data:image/png;base64,test');
    const svg = await control.createSvg(canvas);
    expect(svg).toContain('width="40" height="30"');
    expect(svg).toContain('data:image/png;base64,test');

    const image = document.createElement('img');
    image.src = 'https://example.test/image.png';
    Object.defineProperties(image, {
      naturalWidth: { configurable: true, value: 50 },
      naturalHeight: { configurable: true, value: 25 },
    });
    expect(await control.createSvg(image)).toContain('width="50" height="25"');
    expect(control.imageSize(image)).toEqual({ width: 50, height: 25 });
  });

  it('uses direct and nested canvases for raster export', async () => {
    const instance = new TpSaveImage();
    const blob = new Blob(['raster'], { type: 'image/png' });
    const internals = instance as unknown as {
      canvasBlob: (canvas: HTMLCanvasElement, format: 'png' | 'webp') => Promise<Blob>;
      createRaster: (target: Element, format: 'png' | 'webp') => Promise<Blob>;
    };
    const canvasBlob = vi.spyOn(internals, 'canvasBlob').mockResolvedValue(blob);
    const canvas = document.createElement('canvas');
    await expect(internals.createRaster(canvas, 'png')).resolves.toBe(blob);
    const wrapper = document.createElement('div');
    wrapper.append(canvas);
    await expect(internals.createRaster(wrapper, 'webp')).resolves.toBe(blob);
    expect(canvasBlob).toHaveBeenCalledTimes(2);
  });

  it('routes menu pointer and keyboard activation to save()', () => {
    const control = new TpSaveImage();
    document.body.append(control);
    const save = vi.spyOn(control, 'save').mockResolvedValue();
    const svgItem = control.querySelector<HTMLElement>('[data-format="svg"]');
    const pngItem = control.querySelector<HTMLElement>('[data-format="png"]');
    svgItem?.click();
    pngItem?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    pngItem?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    pngItem?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(save).toHaveBeenCalledTimes(3);
  });

  it('rasterizes SVG content through an image and canvas', async () => {
    class ImageMock {
      public onload: (() => void) | null = null;
      public onerror: (() => void) | null = null;
      public set src(_value: string) { queueMicrotask(() => this.onload?.()); }
    }
    vi.stubGlobal('Image', ImageMock);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:svg');
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      { drawImage } as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback, type) =>
      callback(new Blob(['raster'], { type: type ?? 'image/png' })),
    );
    const target = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    target.setAttribute('width', '20');
    target.setAttribute('height', '10');
    const control = new TpSaveImage() as unknown as {
      createRaster: (target: Element, format: 'png' | 'webp') => Promise<Blob>;
    };

    const result = await control.createRaster(target, 'png');

    expect(result.type).toBe('image/png');
    expect(drawImage).toHaveBeenCalledOnce();
    expect(revoke).toHaveBeenCalledWith('blob:svg');
    vi.unstubAllGlobals();
  });
});
