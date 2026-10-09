import { describe, expect, it } from 'vitest';
import { analyzeGeometricOptics, TpGraphGeometricOptics, type TpOpticsMatrix } from './graph-geometric-optics.js';
import type { TpGraphDocument } from '../graph-editor/graph-editor.js';

const BENCH: TpGraphDocument = {
  version: 1, title: 'Converging lens', data: { axisY: 240 },
  nodes: [
    { id: 'object', type: 'optics-source', x: 100, y: 240, label: 'Object', data: { height: 60 } },
    { id: 'lens', type: 'optics-converging-lens', x: 300, y: 240, label: 'L1', data: { focalLength: 100 } },
    { id: 'screen', type: 'optics-screen', x: 500, y: 240, label: 'Screen' },
  ], edges: [],
};

describe('<tp-graph-geometric-optics>', () => {
  it('computes the image and total ABCD matrix of a thin converging lens', () => {
    const result = analyzeGeometricOptics(BENCH);
    expect(result.matrix.map((value) => Number(value.toFixed(6))) as unknown as TpOpticsMatrix).toEqual([-1, 0, -0.01, -1]);
    expect(result.imageX).toBe(500);
    expect(result.magnification).toBe(-1);
    expect(result.imageKind).toBe('real');
    expect(result.orientation).toBe('inverted');
  });
  it('renders the optical bench, principal rays, and matrix results', async () => {
    const editor = new TpGraphGeometricOptics(); editor.value = BENCH; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelectorAll('.tp-optics-ray')).toHaveLength(3);
    const lensLayer = editor.querySelector('[data-node-id="lens"]') as SVGElement; const overlayLayer = editor.querySelector('.tp-optics-overlay') as SVGElement; const objectLayer = editor.querySelector('[data-node-id="object"]') as SVGElement;
    expect(lensLayer.compareDocumentPosition(overlayLayer) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
    expect(overlayLayer.compareDocumentPosition(objectLayer) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
    expect(editor.querySelectorAll('.tp-optics-focus')).toHaveLength(2);
    expect(editor.querySelectorAll('.tp-optics-axis-tick')).toHaveLength(41);
    expect(editor.querySelectorAll('.tp-optics-axis-tick.is-major')).toHaveLength(21);
    expect(editor.querySelector('.tp-optics-axis-label')?.textContent).toBe('0');
    expect(editor.querySelectorAll('.tp-optics-axis-label').item(20).textContent).toBe('1000');
    const minimap = editor.querySelector<SVGSVGElement>('.tp-graph-minimap svg');
    expect(Number(minimap?.dataset.minimapMinX) + Number(minimap?.dataset.minimapWidth)).toBeGreaterThanOrEqual(1040);
    expect(editor.querySelector('.tp-optics-results')?.textContent).toContain('Magnification');
    expect(editor.querySelector('[data-optics-action="trace"]')).toBeNull();
    expect(editor.querySelector('.tp-optics-analysis-summary')?.textContent).toContain('Object');
    expect(editor.querySelector('.tp-optics-analysis-summary')?.textContent).toContain('Height60.00');
    expect(editor.querySelector('.tp-optics-lens-details')?.textContent).toContain('Focal length100.00');
    expect(editor.querySelectorAll('[data-shape]')).toHaveLength(17);
    expect(editor.querySelectorAll('[data-palette-id^="optics-"]')).toHaveLength(6);
    expect(editor.querySelectorAll('[data-palette-id="optics-sources"] [data-shape]')).toHaveLength(2);
    expect(editor.querySelectorAll('[data-palette-id="optics-lenses"] [data-shape]')).toHaveLength(4);
    expect(editor.querySelectorAll('[data-palette-id="optics-interfaces"] [data-shape]')).toHaveLength(3);
    expect(editor.querySelectorAll('[data-palette-id="optics-media"] [data-shape]')).toHaveLength(2);
    expect(editor.querySelectorAll('[data-palette-id="optics-mirrors"] [data-shape]')).toHaveLength(3);
    expect(editor.querySelector('[data-palette-id="optics-interfaces"]')?.previousElementSibling?.textContent).toBe('Interfaces');
    expect(editor.querySelector('[data-palette-id="optics-media"]')?.previousElementSibling?.textContent).toBe('Media');
    expect(editor.querySelector('[data-shape="optics-source"] .tp-optics-object-preview')?.getAttribute('transform')).toBe('translate(0 30)');
    expect(editor.querySelector('[data-shape="optics-mirror"] .tp-optics-mirror')?.getAttribute('points')).toBe('0,-120 0,120');
    expect(editor.querySelector('[data-shape="optics-mirror"] .tp-optics-mirror-backing.is-preview')?.getAttribute('points')).toBe('16,-120 16,120');
    expect(editor.querySelector('[data-shape="optics-mirror"] .tp-optics-mirror-backing.is-preview')?.getAttribute('style')).toBe('stroke:#000');
    expect(editor.querySelector('[data-shape="optics-convex-mirror"] .tp-optics-mirror')?.getAttribute('points')?.startsWith('-')).toBe(false);
    expect(editor.querySelector('[data-shape="optics-concave-mirror"] .tp-optics-mirror')?.getAttribute('points')?.startsWith('-')).toBe(true);
    expect(editor.querySelector('[data-shape="optics-concave-interface"] .tp-optics-curved-interface')?.getAttribute('points')?.startsWith('-')).toBe(true);
    expect(editor.querySelector('[data-shape="optics-screen"] .tp-optics-screen')?.getAttribute('width')).toBe('22');
    expect(editor.querySelector('[data-node-id="lens"] .tp-optics-lens')?.getAttribute('d')).toContain('M0 -90V90');
    expect(editor.querySelector('[data-shape="optics-diverging-lens"] .tp-optics-lens')?.getAttribute('d')).toContain('M-8 -90L0 -80L8 -90');
    expect(editor.querySelector('[data-node-id="screen"] rect.tp-optics-screen')?.getAttribute('width')).toBe('10');
    expect(editor.querySelector('[data-node-id="screen"] rect.tp-optics-screen')?.getAttribute('height')).toBe('230');
  });
  it('models a thick biconvex lens as two spherical refractions separated by glass', async () => {
    const graph = structuredClone(BENCH);
    graph.nodes.splice(1, 1, { id: 'thick-lens', type: 'optics-biconvex-lens', x: 300, y: 240, label: 'L1', data: { refractiveIndex: 1.5, thickness: 80, radius1: 240, radius2: -240, height: 240 } });
    const result = analyzeGeometricOptics(graph);
    expect(result.stages.some((stage) => stage.label.includes('front'))).toBe(true);
    expect(result.stages.some((stage) => stage.label.includes('glass'))).toBe(true);
    expect(result.stages.some((stage) => stage.label.includes('back'))).toBe(true);
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('[data-node-id="thick-lens"] .tp-optics-spherical-lens')).not.toBeNull();
    expect(editor.querySelectorAll('.tp-optics-ray')).toHaveLength(3);
    expect(editor.querySelector('.tp-optics-lens-details')?.textContent).toContain('Biconvex spherical');
  });
  it('keeps the default biconvex image inside the initial optical bench', () => {
    const graph = structuredClone(BENCH);
    graph.nodes.splice(1, 1, { id: 'default-thick-lens', type: 'optics-biconvex-lens', x: 300, y: 240, label: 'L1' });
    graph.nodes = graph.nodes.filter((node) => node.type !== 'optics-screen');
    const analysis = analyzeGeometricOptics(graph);
    expect(analysis.imageKind).toBe('real');
    expect(analysis.imageX).toBeGreaterThan(300);
    expect(analysis.imageX).toBeLessThan(1000);
  });
  it('rejects a biconvex thickness that would make its spherical surfaces cross', () => {
    const graph = structuredClone(BENCH);
    graph.nodes.splice(1, 1, { id: 'thick-lens', type: 'optics-biconvex-lens', x: 300, y: 240, data: { refractiveIndex: 1.5, thickness: 69, radius1: 240, radius2: -240, height: 240 } });
    expect(() => analyzeGeometricOptics(graph)).toThrow('invalid optical properties');
    const valid = graph.nodes.find((node) => node.id === 'thick-lens');
    if (valid?.data) valid.data.thickness = 70;
    expect(() => analyzeGeometricOptics(graph)).not.toThrow();
  });
  it('keeps every lens taller than the object', async () => {
    const graph = structuredClone(BENCH);
    const object = graph.nodes.find((node) => node.id === 'object');
    if (object) object.data = { ...(object.data ?? {}), height: 180 };
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const path = editor.querySelector('[data-node-id="lens"] .tp-optics-lens')?.getAttribute('d') ?? '';
    expect(path).toContain('M0 -210V210');
    expect(editor.querySelector('[data-node-id="screen"] rect.tp-optics-screen')?.getAttribute('height')).toBe('470');
  });
  it('reverses the object, its principal rays, and the absolute image direction', async () => {
    const graph = structuredClone(BENCH); const object = graph.nodes.find((node) => node.id === 'object'); if (object) object.data = { ...(object.data ?? {}), direction: 'down' };
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('[data-node-id="object"] .tp-optics-object')?.getAttribute('d')).toContain('V60');
    expect(editor.querySelector('.tp-optics-ray')?.getAttribute('points')?.startsWith('100,300')).toBe(true);
    expect(editor.querySelector('.tp-optics-analysis-summary')?.textContent).toContain('Directiondown');
    editor.dispatchEvent(new CustomEvent('tp-graph-selection-change', { detail: { id: 'object' } }));
    const direction = editor.querySelector<HTMLSelectElement>('[data-optics-object-direction]'); expect(direction?.value).toBe('down');
    if (direction) { direction.value = 'up'; direction.dispatchEvent(new Event('change')); }
    expect(editor.value.nodes.find((node) => node.id === 'object')?.data?.direction).toBe('up');
  });
  it('rejects manual graph edges', () => {
    const editor = new TpGraphGeometricOptics(); editor.value = BENCH;
    expect(() => editor.addEdge()).toThrow('computed automatically');
  });
  it('hides rays and focal points while a lens is off the optical axis', async () => {
    const graph = structuredClone(BENCH);
    const lens = graph.nodes.find((node) => node.id === 'lens');
    if (lens) lens.y += 40;
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('.tp-optics-axis')).not.toBeNull();
    expect(editor.querySelector('.tp-optics-ray')).toBeNull();
    expect(editor.querySelector('.tp-optics-focus')).toBeNull();
  });
  it('keeps tracing through aligned lenses when another lens is off axis', async () => {
    const graph = structuredClone(BENCH);
    graph.nodes.splice(1, 0,
      { id: 'off-axis', type: 'optics-converging-lens', x: 200, y: 280, label: 'Off axis', data: { focalLength: 80 } });
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelectorAll('.tp-optics-ray')).toHaveLength(3);
    expect(editor.querySelectorAll('.tp-optics-focus')).toHaveLength(2);
    expect(editor.querySelector('.tp-optics-ray-1')?.getAttribute('points')).not.toContain('200,');
    expect(editor.analyze().stages.some((stage) => stage.label.includes('Off axis'))).toBe(false);
  });
  it('constructs the three principal rays through the optical center and both focal points', async () => {
    const graph = structuredClone(BENCH);
    const lens = graph.nodes.find((node) => node.id === 'lens');
    const screen = graph.nodes.find((node) => node.id === 'screen');
    if (lens) lens.x = 350;
    if (screen) screen.x = 550;
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const points = (selector: string): number[][] => (editor.querySelector(selector)?.getAttribute('points') ?? '')
      .split(' ').map((pair) => pair.split(',').map(Number));
    const yAt = (first: number[], second: number[], x: number): number => first[1]! + (second[1]! - first[1]!) * (x - first[0]!) / (second[0]! - first[0]!);
    const parallel = points('.tp-optics-ray-1');
    const central = points('.tp-optics-ray-2');
    const focal = points('.tp-optics-ray-3');
    expect(yAt(parallel[1]!, parallel[2]!, 450)).toBeCloseTo(240);
    expect(central[1]?.[1]).toBeCloseTo(240);
    expect(yAt(focal[0]!, focal[1]!, 250)).toBeCloseTo(240);
  });
  it('does not refract a focal ray that misses the finite lens', async () => {
    const graph = structuredClone(BENCH);
    const lens = graph.nodes.find((node) => node.id === 'lens');
    if (lens) lens.x = 170;
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const points = (editor.querySelector('.tp-optics-ray-3')?.getAttribute('points') ?? '')
      .split(' ').map((pair) => pair.split(',').map(Number));
    expect(points[1]?.[1]).not.toBe(points[2]?.[1]);
  });
  it('shows the dashed computed image when no screen is present', async () => {
    const graph = structuredClone(BENCH);
    graph.nodes = graph.nodes.filter((node) => node.type !== 'optics-screen');
    const analysis = analyzeGeometricOptics(graph);
    expect(analysis.screenId).toBeNull();
    expect(analysis.imageX).toBe(500);
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('.tp-optics-image')).not.toBeNull();
    expect(editor.querySelector('.tp-optics-image')?.getAttribute('d')).toContain('M500 240V300');
    expect(editor.querySelectorAll('.tp-optics-ray')).toHaveLength(3);
  });
  it('extends the emergent rays backwards through a virtual image', async () => {
    const graph = structuredClone(BENCH);
    graph.nodes.splice(2, 0,
      { id: 'diverging', type: 'optics-diverging-lens', x: 340, y: 240, label: 'L2', data: { focalLength: -50 } });
    const analysis = analyzeGeometricOptics(graph);
    expect(analysis.imageKind).toBe('virtual');
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const extensions = editor.querySelectorAll('.tp-optics-image-extension');
    expect(extensions).toHaveLength(3);
    expect(editor.querySelector('[data-node-id="lens"] .tp-optics-lens')?.classList).toContain('tp-optics-color-0');
    expect(editor.querySelector('[data-node-id="diverging"] .tp-optics-lens')?.classList).toContain('tp-optics-color-0');
    expect(editor.querySelectorAll('.tp-optics-focus.tp-optics-color-0')).toHaveLength(4);
    expect(editor.querySelector('linearGradient .tp-optics-color-0')).not.toBeNull();
    for (const extension of extensions) {
      expect(Number(extension.getAttribute('x1'))).toBeCloseTo(analysis.imageX ?? 0);
      expect(extension.getAttribute('x2')).toBe('340');
    }
  });
  it('extends rays backwards from the rear diopter of a spherical lens', async () => {
    const graph = structuredClone(BENCH);
    graph.nodes.splice(1, 1, { id: 'thick-diverging', type: 'optics-biconcave-lens', x: 300, y: 240, label: 'L1', data: { refractiveIndex: 1.5, thickness: 80, radius1: -240, radius2: 240, height: 240 } });
    graph.nodes = graph.nodes.filter((node) => node.type !== 'optics-screen');
    const analysis = analyzeGeometricOptics(graph);
    expect(analysis.imageKind).toBe('virtual');
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const extensions = editor.querySelectorAll('.tp-optics-image-extension');
    expect(extensions).toHaveLength(3);
    const extensionImageX = Number(extensions[0]?.getAttribute('x1'));
    for (const extension of extensions) {
      expect(Number(extension.getAttribute('x1'))).toBeCloseTo(extensionImageX);
      expect(Number(extension.getAttribute('x2'))).toBeGreaterThan(300);
    }
    expect(editor.querySelectorAll('.tp-optics-ray-intersection')).toHaveLength(3);
    expect(editor.querySelector('.tp-optics-image-spread')).not.toBeNull();
    expect(editor.querySelector('.tp-optics-image-label')?.textContent).toBe('Paraxial image');
    const thirdRayPoints = (editor.querySelector('.tp-optics-ray-3')?.getAttribute('points') ?? '').split(' ').map((pair) => pair.split(',').map(Number));
    expect(thirdRayPoints.every((point) => point.every(Number.isFinite))).toBe(true);
    expect(Math.min(...thirdRayPoints.map((point) => point[1] ?? 0))).toBeGreaterThan(0);
  });
  it('refracts rays through a homogeneous medium and reports its plane interfaces', async () => {
    const graph = structuredClone(BENCH);
    graph.nodes = graph.nodes.filter((node) => node.type !== 'optics-converging-lens');
    graph.nodes.splice(1, 0,
      { id: 'glass', type: 'optics-medium', x: 300, y: 240, label: 'Glass', data: { refractiveIndex: 1.5, width: 100, height: 240 } });
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const points = (editor.querySelector('.tp-optics-ray-2')?.getAttribute('points') ?? '').split(' ').map((pair) => pair.split(',').map(Number));
    const outsideSlope = ((points[1]?.[1] ?? 0) - (points[0]?.[1] ?? 0)) / ((points[1]?.[0] ?? 1) - (points[0]?.[0] ?? 0));
    const insideSlope = ((points[2]?.[1] ?? 0) - (points[1]?.[1] ?? 0)) / ((points[2]?.[0] ?? 1) - (points[1]?.[0] ?? 0));
    expect(Math.abs(insideSlope)).toBeLessThan(Math.abs(outsideSlope));
    expect(editor.analyze().imageX).toBeNull();
    expect(editor.analyze().imageKind).toBe('afocal');
    expect(editor.querySelector('.tp-optics-image')).toBeNull();
    expect([...editor.querySelectorAll('.tp-optics-analysis-summary h4')].map((heading) => heading.textContent)).not.toContain('Image');
    expect(editor.querySelector('.tp-optics-snell')?.textContent).toContain('Glass entry');
    expect(editor.querySelector('.tp-optics-snell')?.textContent).toContain('1.500');
  });
  it('integrates curved rays through a parabolic GRIN medium and renders its index map', async () => {
    const graph = structuredClone(BENCH);
    graph.nodes = graph.nodes.filter((node) => node.type !== 'optics-converging-lens');
    graph.nodes.splice(1, 0, { id: 'grin', type: 'optics-grin-medium', x: 300, y: 240, label: 'GRIN', data: { profile: 'parabolic', baseIndex: 1.5, coefficient: 0.00002, integrationStep: 2, width: 180, height: 200 } });
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const points = (editor.querySelector('.tp-optics-ray-1')?.getAttribute('points') ?? '').split(' ').map((pair) => pair.split(',').map(Number));
    expect(points.length).toBeGreaterThan(50);
    expect(new Set(points.map((point) => point[1]?.toFixed(3))).size).toBeGreaterThan(10);
    expect(editor.querySelectorAll('[data-node-id="grin"] .tp-optics-grin-cell')).toHaveLength(216);
    expect(editor.querySelector('[data-node-id="grin"] .tp-optics-grin-legend')?.textContent).toContain('n min');
    editor.dispatchEvent(new CustomEvent('tp-graph-selection-change', { detail: { id: 'grin' } }));
    const visibleKeys = [...editor.querySelectorAll<HTMLInputElement>('[data-optics-parameter]')].filter((input) => !input.closest<HTMLElement>('.tp-optics-parameter')?.hidden).map((input) => input.dataset.opticsParameter);
    expect(visibleKeys).toEqual(['width', 'baseIndex', 'coefficient', 'integrationStep']);
  });
  it('validates custom GRIN expressions without executing arbitrary code', () => {
    const graph = structuredClone(BENCH); graph.nodes = graph.nodes.filter((node) => node.type !== 'optics-converging-lens');
    graph.nodes.splice(1, 0, { id: 'grin', type: 'optics-grin-medium', x: 300, y: 240, data: { profile: 'custom', expression: 'n0 - 0.00002*y^2 + 0.0001*x', baseIndex: 1.5, integrationStep: 2, width: 180, height: 200 } });
    expect(() => analyzeGeometricOptics(graph)).not.toThrow();
    const grin = graph.nodes.find((node) => node.id === 'grin'); if (grin?.data) grin.data.expression = 'globalThis.alert(1)';
    expect(() => analyzeGeometricOptics(graph)).toThrow('Unsupported token');
  });
  it('marks an invalid custom GRIN expression with a danger state', async () => {
    const graph = structuredClone(BENCH); graph.nodes = graph.nodes.filter((node) => node.type !== 'optics-converging-lens');
    graph.nodes.splice(1, 0, { id: 'grin', type: 'optics-grin-medium', x: 300, y: 240, data: { profile: 'custom', expression: 'n0 - 0.00002*y^2', baseIndex: 1.5, integrationStep: 2, width: 180, height: 200 } });
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor); await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    editor.dispatchEvent(new CustomEvent('tp-graph-selection-change', { detail: { id: 'grin' } }));
    const expression = editor.querySelector<HTMLInputElement>('[data-optics-grin-expression]'); expect(expression?.disabled).toBe(false);
    if (expression) { expression.value = 'notAFunction(y)'; expression.dispatchEvent(new Event('input')); }
    expect(expression?.getAttribute('aria-invalid')).toBe('true');
    if (expression) { expression.value = 'n0 - 0.00001*y^2'; expression.dispatchEvent(new Event('input')); }
    expect(expression?.getAttribute('aria-invalid')).toBe('false');
  });
  it('cycles non-danger colors for successive elements of the same type', async () => {
    const graph = structuredClone(BENCH);
    graph.nodes.splice(1, 0,
      { id: 'medium-1', type: 'optics-medium', x: 180, y: 240, data: { refractiveIndex: 1.2, width: 40, height: 240 } },
      { id: 'medium-2', type: 'optics-medium', x: 240, y: 240, data: { refractiveIndex: 1.4, width: 40, height: 240 } });
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('[data-node-id="medium-1"] .tp-optics-medium')?.classList).toContain('tp-optics-color-0');
    expect(editor.querySelector('[data-node-id="medium-2"] .tp-optics-medium')?.classList).toContain('tp-optics-color-1');
    expect(editor.querySelector('[data-node-id="object"] .tp-optics-object')?.getAttribute('class')).not.toContain('tp-optics-color-');
  });
  it('shows only the parameters relevant to the selected optical element', async () => {
    const graph = structuredClone(BENCH);
    graph.nodes.splice(1, 0,
      { id: 'glass', type: 'optics-medium', x: 220, y: 240, data: { refractiveIndex: 1.5, width: 80, height: 240 } },
      { id: 'interface', type: 'optics-plane-interface', x: 260, y: 240, data: { leftIndex: 1, rightIndex: 1.4, height: 240 } });
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const visibleKeys = (): string[] => [...editor.querySelectorAll<HTMLInputElement>('[data-optics-parameter]')]
      .filter((input) => !input.closest<HTMLElement>('.tp-optics-parameter')?.hidden).map((input) => input.dataset.opticsParameter ?? '');
    editor.dispatchEvent(new CustomEvent('tp-graph-selection-change', { detail: { id: 'glass' } }));
    expect(visibleKeys()).toEqual(['refractiveIndex', 'width']);
    const width = editor.querySelector<HTMLInputElement>('[data-optics-parameter="width"]');
    if (width) { width.value = '220'; width.dispatchEvent(new Event('change')); }
    expect(editor.value.nodes.find((node) => node.id === 'glass')?.data?.width).toBe(220);
    expect(editor.querySelector('[data-node-id="glass"] .tp-optics-medium')?.getAttribute('width')).toBe('220');
    editor.dispatchEvent(new CustomEvent('tp-graph-selection-change', { detail: { id: 'interface' } }));
    expect(visibleKeys()).toEqual(['leftIndex', 'rightIndex']);
    editor.dispatchEvent(new CustomEvent('tp-graph-selection-change', { detail: { id: 'screen' } }));
    expect(visibleKeys()).toEqual([]);
  });
  it('renders a red point source and its divergent rays without a lens', async () => {
    const graph = structuredClone(BENCH);
    graph.nodes = graph.nodes.filter((node) => node.type !== 'optics-converging-lens');
    graph.nodes[0] = { id: 'point', type: 'optics-point-source', x: 100, y: 220, label: 'S', data: { rayCount: 8, openingAngle: 360 } };
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('[data-node-id="point"] .tp-optics-point-source')).not.toBeNull();
    expect(editor.querySelectorAll('.tp-optics-ray')).toHaveLength(8);
    const rayStarts = [...editor.querySelectorAll('.tp-optics-ray')].map((ray) => ray.getAttribute('points')?.split(' ')[0]);
    expect(rayStarts).toEqual(Array.from({ length: 8 }, () => '100,220'));
    expect([...editor.querySelectorAll('.tp-optics-ray')].some((ray) => ray.getAttribute('points')?.includes('0,'))).toBe(true);
    expect(editor.querySelector('.tp-optics-analysis-summary')?.textContent).toContain('Point source');
    expect(editor.querySelector('[data-optics-parameter="height"]')?.closest<HTMLElement>('.tp-optics-parameter')?.hidden).toBe(true);
    editor.dispatchEvent(new CustomEvent('tp-graph-selection-change', { detail: { id: 'point' } }));
    const visibleKeys = [...editor.querySelectorAll<HTMLInputElement>('[data-optics-parameter]')]
      .filter((input) => !input.closest<HTMLElement>('.tp-optics-parameter')?.hidden).map((input) => input.dataset.opticsParameter);
    expect(visibleKeys).toEqual(['rayCount', 'openingAngle', 'orientationAngle']);
  });
  it('orients the point-source emission cone from the horizontal axis', async () => {
    const graph = structuredClone(BENCH); graph.nodes = [
      { id: 'point', type: 'optics-point-source', x: 100, y: 240, data: { rayCount: 1, openingAngle: 0, orientationAngle: 90 } },
      { id: 'screen', type: 'optics-screen', x: 500, y: 240 },
    ];
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('.tp-optics-ray')?.getAttribute('points')).toBe('100,240 100,0');
    expect(editor.querySelector('.tp-optics-analysis-summary')?.textContent).toContain('Orientation90.00°');
  });
  it('refracts a ray against the local normal of a spherical interface', async () => {
    const graph = structuredClone(BENCH);
    graph.nodes = [
      { id: 'point', type: 'optics-point-source', x: 100, y: 200, data: { rayCount: 1, openingAngle: 0 } },
      { id: 'surface', type: 'optics-curved-interface', x: 300, y: 240, label: 'Spherical diopter', data: { leftIndex: 1, rightIndex: 1.5, radius: 160, height: 240 } },
      { id: 'screen', type: 'optics-screen', x: 500, y: 240 },
    ];
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    const points = (editor.querySelector('.tp-optics-ray')?.getAttribute('points') ?? '').split(' ').map((pair) => pair.split(',').map(Number));
    expect(points[1]?.[0]).toBeGreaterThan(300);
    expect(points[2]?.[1]).not.toBeCloseTo(200);
    expect(editor.querySelector('.tp-optics-snell')?.textContent).toContain('Spherical diopter (convex, R=160)');
    editor.dispatchEvent(new CustomEvent('tp-graph-selection-change', { detail: { id: 'surface' } }));
    const visibleKeys = [...editor.querySelectorAll<HTMLInputElement>('[data-optics-parameter]')]
      .filter((input) => !input.closest<HTMLElement>('.tp-optics-parameter')?.hidden).map((input) => input.dataset.opticsParameter);
    expect(visibleKeys).toEqual(['leftIndex', 'rightIndex', 'radius']);
    const curvature = editor.querySelector<HTMLSelectElement>('[data-optics-curvature]');
    expect(curvature?.closest<HTMLElement>('.tp-optics-parameter')?.hidden).toBe(false);
    if (curvature) { curvature.value = 'concave'; curvature.dispatchEvent(new Event('change')); }
    expect(editor.value.nodes.find((node) => node.id === 'surface')?.data?.curvature).toBe('concave');
    expect(editor.querySelector('[data-node-id="surface"] .tp-optics-curved-interface')?.getAttribute('points')?.startsWith('-')).toBe(true);
  });
  it('reflects rays on plane and curved mirrors', async () => {
    const graph = structuredClone(BENCH);
    graph.nodes = [
      { id: 'point', type: 'optics-point-source', x: 100, y: 200, data: { rayCount: 1, openingAngle: 0 } },
      { id: 'mirror', type: 'optics-mirror', x: 300, y: 240, label: 'M1', data: { shape: 'plane', radius: 160, height: 240 } },
    ];
    const editor = new TpGraphGeometricOptics(); editor.value = graph; document.body.append(editor);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    expect(editor.querySelector('.tp-optics-ray')?.getAttribute('points')).toBe('100,200 300,200 0,200');
    expect(editor.querySelector('[data-node-id="mirror"] .tp-optics-mirror-backing')?.getAttribute('points')).toBe('3,-120 3,120');
    expect(editor.querySelector('[data-node-id="mirror"] .tp-optics-mirror-hatching')).toBeNull();
    expect(editor.querySelector('.tp-optics-reflection')?.textContent).toContain('Law of reflection');
    editor.dispatchEvent(new CustomEvent('tp-graph-selection-change', { detail: { id: 'mirror' } }));
    const shape = editor.querySelector<HTMLSelectElement>('[data-optics-mirror-shape]');
    expect(shape?.closest<HTMLElement>('.tp-optics-parameter')?.hidden).toBe(false);
    expect(editor.querySelector('[data-optics-parameter="radius"]')?.closest<HTMLElement>('.tp-optics-parameter')?.hidden).toBe(true);
    if (shape) { shape.value = 'concave'; shape.dispatchEvent(new Event('change')); }
    expect(editor.value.nodes.find((node) => node.id === 'mirror')?.data?.shape).toBe('concave');
    expect(editor.querySelector('[data-node-id="mirror"] .tp-optics-mirror')?.getAttribute('points')?.startsWith('-')).toBe(true);
    expect(editor.querySelector('[data-optics-parameter="radius"]')?.closest<HTMLElement>('.tp-optics-parameter')?.hidden).toBe(false);
  });
});
