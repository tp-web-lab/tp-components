/** @module components/graph-geometric-optics @summary Paraxial geometric-optics bench and ABCD simulator. */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-graph-editor
 * @summary Extensible interactive graph editor.
 */
/**
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
// tp-docgen:dependencies:end

import { TpGraphEditor, TP_GRAPH_COMMENT, type TpGraphDocument, type TpGraphEdge, type TpGraphNode, type TpGraphPoint } from '../graph-editor/graph-editor.js';
import '../markdown/markdown.js';
import style from './graph-geometric-optics.css?inline';

export const TP_OPTICS_SOURCE = 'optics-source';
export const TP_OPTICS_POINT_SOURCE = 'optics-point-source';
export const TP_OPTICS_CONVERGING_LENS = 'optics-converging-lens';
export const TP_OPTICS_DIVERGING_LENS = 'optics-diverging-lens';
export const TP_OPTICS_BICONVEX_LENS = 'optics-biconvex-lens';
export const TP_OPTICS_BICONCAVE_LENS = 'optics-biconcave-lens';
export const TP_OPTICS_SCREEN = 'optics-screen';
export const TP_OPTICS_MEDIUM = 'optics-medium';
export const TP_OPTICS_GRIN_MEDIUM = 'optics-grin-medium';
export const TP_OPTICS_PLANE_INTERFACE = 'optics-plane-interface';
export const TP_OPTICS_CURVED_INTERFACE = 'optics-curved-interface';
export const TP_OPTICS_CONCAVE_INTERFACE = 'optics-concave-interface';
export const TP_OPTICS_MIRROR = 'optics-mirror';
export const TP_OPTICS_CONVEX_MIRROR = 'optics-convex-mirror';
export const TP_OPTICS_CONCAVE_MIRROR = 'optics-concave-mirror';
export type TpOpticsMatrix = readonly [number, number, number, number];
export interface TpOpticsMatrixStage { label: string; matrix: TpOpticsMatrix; cumulative: TpOpticsMatrix }
export interface TpOpticsAnalysis {
  axisY: number; sourceId: string; screenId: string | null; matrix: TpOpticsMatrix; stages: TpOpticsMatrixStage[];
  imageX: number | null; magnification: number | null; imageKind: 'real' | 'virtual' | 'afocal';
  orientation: 'upright' | 'inverted' | 'undefined';
}

const OPTICAL_TYPES = [TP_OPTICS_SOURCE, TP_OPTICS_POINT_SOURCE, TP_OPTICS_CONVERGING_LENS, TP_OPTICS_DIVERGING_LENS, TP_OPTICS_BICONVEX_LENS, TP_OPTICS_BICONCAVE_LENS, TP_OPTICS_SCREEN, TP_OPTICS_MEDIUM, TP_OPTICS_GRIN_MEDIUM, TP_OPTICS_PLANE_INTERFACE, TP_OPTICS_CURVED_INTERFACE, TP_OPTICS_CONCAVE_INTERFACE, TP_OPTICS_MIRROR, TP_OPTICS_CONVEX_MIRROR, TP_OPTICS_CONCAVE_MIRROR] as const;
function isOpticsSource(node: Readonly<TpGraphNode>): boolean { return node.type === TP_OPTICS_SOURCE || node.type === TP_OPTICS_POINT_SOURCE; }
function isCurvedInterface(node: Readonly<TpGraphNode>): boolean { return node.type === TP_OPTICS_CURVED_INTERFACE || node.type === TP_OPTICS_CONCAVE_INTERFACE; }
function isSphericalLens(node: Readonly<TpGraphNode>): boolean { return node.type === TP_OPTICS_BICONVEX_LENS || node.type === TP_OPTICS_BICONCAVE_LENS; }
function isOpticsMirror(node: Readonly<TpGraphNode>): boolean { return node.type === TP_OPTICS_MIRROR || node.type === TP_OPTICS_CONVEX_MIRROR || node.type === TP_OPTICS_CONCAVE_MIRROR; }
function objectDirection(node: Readonly<TpGraphNode>): 'up' | 'down' { return node.data?.direction === 'down' ? 'down' : 'up'; }
interface TpOpticsInterface { x: number; y: number; halfHeight: number; n1: number; n2: number; label: string }
type GrinProfile = 'linear' | 'radial' | 'parabolic' | 'custom';
type GrinExpression = (variables: Readonly<{ x: number; y: number; n0: number }>) => number;
const grinExpressionCache = new Map<string, GrinExpression>();
function escapeXml(value: string): string { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }
function dataNumber(node: Readonly<TpGraphNode>, key: string, fallback: number): number {
  const value = node.data?.[key]; return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}
function grinProfile(node: Readonly<TpGraphNode>): GrinProfile {
  const profile = node.data?.profile; return profile === 'linear' || profile === 'radial' || profile === 'custom' ? profile : 'parabolic';
}
function compileGrinExpression(source: string): GrinExpression {
  const cached = grinExpressionCache.get(source); if (cached) return cached;
  const tokens = [...source.matchAll(/\s*(?:(\d*\.?\d+(?:e[+-]?\d+)?)|([A-Za-z_]\w*)|(.))/g)].map((match) => match[1] ?? match[2] ?? match[3] ?? ''); let position = 0;
  const peek = (): string | undefined => tokens[position]; const take = (): string => tokens[position++] ?? '';
  const expression = (): GrinExpression => { let left = term(); while (peek() === '+' || peek() === '-') { const operator = take(); const right = term(); const previous = left; left = operator === '+' ? (variables) => previous(variables) + right(variables) : (variables) => previous(variables) - right(variables); } return left; };
  const term = (): GrinExpression => { let left = power(); while (peek() === '*' || peek() === '/') { const operator = take(); const right = power(); const previous = left; left = operator === '*' ? (variables) => previous(variables) * right(variables) : (variables) => previous(variables) / right(variables); } return left; };
  const power = (): GrinExpression => { const left = unary(); if (peek() !== '^') return left; take(); const right = power(); return (variables) => left(variables) ** right(variables); };
  const unary = (): GrinExpression => { if (peek() === '+') { take(); return unary(); } if (peek() === '-') { take(); const value = unary(); return (variables) => -value(variables); } return primary(); };
  const primary = (): GrinExpression => {
    const token = take(); const numeric = Number(token); if (token !== '' && Number.isFinite(numeric)) return () => numeric;
    if (token === '(') { const value = expression(); if (take() !== ')') throw new TypeError('Missing closing parenthesis in the GRIN expression.'); return value; }
    if (token === 'x' || token === 'y' || token === 'n0') return (variables) => variables[token];
    if (token === 'pi') return () => Math.PI; if (token === 'e') return () => Math.E;
    const functions: Record<string, (value: number) => number> = { abs: Math.abs, cos: Math.cos, exp: Math.exp, log: Math.log, sin: Math.sin, sqrt: Math.sqrt, tan: Math.tan };
    const fn = functions[token]; if (!fn || take() !== '(') throw new TypeError(`Unsupported token "${token}" in the GRIN expression.`); const value = expression(); if (take() !== ')') throw new TypeError('Missing closing parenthesis in the GRIN expression.'); return (variables) => fn(value(variables));
  };
  const compiled = expression(); if (position !== tokens.length) throw new TypeError(`Unexpected token "${peek()}" in the GRIN expression.`);
  grinExpressionCache.set(source, compiled); return compiled;
}
function grinIndex(node: Readonly<TpGraphNode>, worldX: number, worldY: number): number {
  const x = worldX - node.x; const y = worldY - node.y; const n0 = dataNumber(node, 'baseIndex', 1.5); const profile = grinProfile(node); const gradient = dataNumber(node, 'gradient', -0.001); const coefficient = dataNumber(node, 'coefficient', 0.00002);
  if (profile === 'linear') return n0 + gradient * y;
  if (profile === 'radial') return n0 + gradient * Math.hypot(x, y);
  if (profile === 'custom') return compileGrinExpression(typeof node.data?.expression === 'string' ? node.data.expression : 'n0 - 0.00002*y^2')({ x, y, n0 });
  return n0 - coefficient * y * y;
}
function curvedInterfaceRadius(node: Readonly<TpGraphNode>): number {
  const stored = dataNumber(node, 'radius', 160); const curvature = node.data?.curvature;
  if (curvature === 'concave') return -Math.abs(stored);
  if (curvature === 'convex') return Math.abs(stored);
  return stored;
}
function mirrorRadius(node: Readonly<TpGraphNode>): number {
  const radius = Math.abs(dataNumber(node, 'radius', 160));
  return node.data?.shape === 'concave' ? -radius : radius;
}
function opticalLensHalfHeight(graph: Readonly<TpGraphDocument>, node?: Readonly<TpGraphNode>): number {
  if (node?.id === 'preview') return 80;
  const object = graph.nodes.find((candidate) => candidate.type === TP_OPTICS_SOURCE);
  return Math.max(80, Math.abs(object ? dataNumber(object, 'height', 60) : 60) + 30);
}
function opticalScreenHalfHeight(graph: Readonly<TpGraphDocument>, node?: Readonly<TpGraphNode>): number {
  return node?.id === 'preview' ? 105 : opticalLensHalfHeight(graph) + 25;
}
function opticalInterfaces(graph: Readonly<TpGraphDocument>): TpOpticsInterface[] {
  const interfaces: TpOpticsInterface[] = [];
  for (const node of graph.nodes) {
    if (node.type === TP_OPTICS_PLANE_INTERFACE) interfaces.push({
      x: node.x, y: node.y, halfHeight: dataNumber(node, 'height', 240) / 2,
      n1: dataNumber(node, 'leftIndex', 1), n2: dataNumber(node, 'rightIndex', 1.5), label: node.label ?? node.id,
    });
    if (node.type === TP_OPTICS_MEDIUM) {
      const width = dataNumber(node, 'width', 160); const index = dataNumber(node, 'refractiveIndex', 1.5);
      const common = { y: node.y, halfHeight: dataNumber(node, 'height', 240) / 2 };
      interfaces.push({ ...common, x: node.x - width / 2, n1: 1, n2: index, label: `${node.label ?? node.id} entry` });
      interfaces.push({ ...common, x: node.x + width / 2, n1: index, n2: 1, label: `${node.label ?? node.id} exit` });
    }
  }
  return interfaces.sort((a, b) => a.x - b.x);
}
function sphericalLensSurfaces(node: Readonly<TpGraphNode>): [TpGraphNode, TpGraphNode] {
  const thickness = dataNumber(node, 'thickness', 100); const radius1 = dataNumber(node, 'radius1', node.type === TP_OPTICS_BICONVEX_LENS ? 100 : -100); const radius2 = dataNumber(node, 'radius2', node.type === TP_OPTICS_BICONVEX_LENS ? -100 : 100); const index = dataNumber(node, 'refractiveIndex', 1.5); const height = dataNumber(node, 'height', 160);
  return [
    { id: `${node.id}-front`, type: TP_OPTICS_CURVED_INTERFACE, x: node.x - thickness / 2, y: node.y, data: { radius: radius1, leftIndex: 1, rightIndex: index, height } },
    { id: `${node.id}-back`, type: TP_OPTICS_CURVED_INTERFACE, x: node.x + thickness / 2, y: node.y, data: { radius: radius2, leftIndex: index, rightIndex: 1, height } },
  ];
}
function minimumSphericalLensThickness(node: Readonly<TpGraphNode>): number {
  const halfHeight = dataNumber(node, 'height', 160) / 2; const radius1 = dataNumber(node, 'radius1', node.type === TP_OPTICS_BICONVEX_LENS ? 100 : -100); const radius2 = dataNumber(node, 'radius2', node.type === TP_OPTICS_BICONVEX_LENS ? -100 : 100);
  const sag = (radius: number): number => radius - Math.sign(radius) * Math.sqrt(Math.max(0, radius * radius - halfHeight * halfHeight));
  return Math.max(1, Math.ceil(sag(radius1) - sag(radius2) + 5));
}
function multiply(left: TpOpticsMatrix, right: TpOpticsMatrix): TpOpticsMatrix {
  const [a, b, c, d] = left; const [e, f, g, h] = right;
  return [a * e + b * g, a * f + b * h, c * e + d * g, c * f + d * h];
}
function translation(distance: number): TpOpticsMatrix { return [1, distance, 0, 1]; }
function lensMatrix(focalLength: number): TpOpticsMatrix { return [1, 0, -1 / focalLength, 1]; }
function sphericalRefractionMatrix(n1: number, n2: number, radius: number): TpOpticsMatrix { return [1, 0, (n1 - n2) / (radius * n2), n1 / n2]; }
function sphericalLensFocalLength(node: Readonly<TpGraphNode>): number {
  const index = dataNumber(node, 'refractiveIndex', 1.5); const thickness = dataNumber(node, 'thickness', 100); const radius1 = dataNumber(node, 'radius1', 100); const radius2 = dataNumber(node, 'radius2', -100);
  const power = (index - 1) * (1 / radius1 - 1 / radius2 + (index - 1) * thickness / (index * radius1 * radius2));
  return Math.abs(power) < 1e-12 ? Number.POSITIVE_INFINITY : 1 / power;
}
function opticalFocalLength(node: Readonly<TpGraphNode>): number { return isSphericalLens(node) ? sphericalLensFocalLength(node) : dataNumber(node, 'focalLength', 100); }

export function validateGeometricOpticsGraph(graph: Readonly<TpGraphDocument>): void {
  const sources = graph.nodes.filter(isOpticsSource);
  const screens = graph.nodes.filter((node) => node.type === TP_OPTICS_SCREEN);
  if (sources.length !== 1) throw new TypeError('An optical bench requires exactly one source.');
  if (screens.length > 1) throw new TypeError('An optical bench accepts at most one screen.');
  for (const node of graph.nodes) {
    if (node.type !== TP_GRAPH_COMMENT && !(OPTICAL_TYPES as readonly string[]).includes(node.type)) throw new TypeError(`Unsupported geometric-optics node type: ${node.type}`);
    if (node.type === TP_OPTICS_CONVERGING_LENS || node.type === TP_OPTICS_DIVERGING_LENS) {
      const focal = dataNumber(node, 'focalLength', node.type === TP_OPTICS_CONVERGING_LENS ? 100 : -100);
      if (focal === 0 || (node.type === TP_OPTICS_CONVERGING_LENS && focal < 0) || (node.type === TP_OPTICS_DIVERGING_LENS && focal > 0)) throw new TypeError(`Lens "${node.id}" has an invalid focal length.`);
    }
    if (node.type === TP_OPTICS_SOURCE && node.data?.direction !== undefined && node.data.direction !== 'up' && node.data.direction !== 'down') throw new TypeError(`Object "${node.id}" has an invalid direction.`);
    if (isSphericalLens(node)) {
      const thickness = dataNumber(node, 'thickness', 100); const index = dataNumber(node, 'refractiveIndex', 1.5); const height = dataNumber(node, 'height', 160); const radius1 = Math.abs(dataNumber(node, 'radius1', 100)); const radius2 = Math.abs(dataNumber(node, 'radius2', 100));
      if (thickness < minimumSphericalLensThickness(node) || index <= 0 || height <= 0 || height > radius1 * 2 || height > radius2 * 2) throw new TypeError(`Spherical lens "${node.id}" has invalid optical properties.`);
    }
    if (node.type === TP_OPTICS_MEDIUM) {
      if (dataNumber(node, 'refractiveIndex', 1.5) <= 0 || dataNumber(node, 'width', 160) <= 0 || dataNumber(node, 'height', 240) <= 0) throw new TypeError(`Medium "${node.id}" has invalid optical properties.`);
    }
    if (node.type === TP_OPTICS_GRIN_MEDIUM) {
      const width = dataNumber(node, 'width', 180); const height = dataNumber(node, 'height', 200); const step = dataNumber(node, 'integrationStep', 2);
      if (width <= 0 || height <= 0 || step < 0.1 || step > 20) throw new TypeError(`GRIN medium "${node.id}" has invalid dimensions or integration step.`);
      for (const x of [node.x - width / 2, node.x, node.x + width / 2]) for (const y of [node.y - height / 2, node.y, node.y + height / 2]) {
        const index = grinIndex(node, x, y); if (!Number.isFinite(index) || index <= 0) throw new TypeError(`GRIN medium "${node.id}" produces an invalid refractive index.`);
      }
    }
    if (node.type === TP_OPTICS_PLANE_INTERFACE && (dataNumber(node, 'leftIndex', 1) <= 0 || dataNumber(node, 'rightIndex', 1.5) <= 0 || dataNumber(node, 'height', 240) <= 0)) throw new TypeError(`Interface "${node.id}" has invalid optical properties.`);
    if (isCurvedInterface(node)) {
      const radius = curvedInterfaceRadius(node); const height = dataNumber(node, 'height', 240);
      if (dataNumber(node, 'leftIndex', 1) <= 0 || dataNumber(node, 'rightIndex', 1.5) <= 0 || radius === 0 || height <= 0 || height > Math.abs(radius) * 2) throw new TypeError(`Curved interface "${node.id}" has invalid optical properties.`);
    }
    if (node.type === TP_OPTICS_POINT_SOURCE) {
      const rayCount = dataNumber(node, 'rayCount', 3); const openingAngle = dataNumber(node, 'openingAngle', 60); const orientationAngle = dataNumber(node, 'orientationAngle', 0);
      if (!Number.isInteger(rayCount) || rayCount < 1 || rayCount > 10 || openingAngle < 0 || openingAngle > 360 || orientationAngle < -180 || orientationAngle > 180) throw new TypeError(`Point source "${node.id}" has invalid emission properties.`);
    }
    if (isOpticsMirror(node)) {
      const shape = node.data?.shape ?? 'plane'; const height = dataNumber(node, 'height', 240); const radius = Math.abs(dataNumber(node, 'radius', 160));
      if ((shape !== 'plane' && shape !== 'convex' && shape !== 'concave') || height <= 0 || (shape !== 'plane' && (radius === 0 || height > radius * 2))) throw new TypeError(`Mirror "${node.id}" has invalid optical properties.`);
    }
  }
  if (graph.edges.length > 0) throw new TypeError('Optical rays are computed automatically; graph edges are not used.');
  if (screens[0] && (screens[0]?.x ?? 0) <= (sources[0]?.x ?? 0)) throw new TypeError('The screen must be placed to the right of the source.');
}

export function analyzeGeometricOptics(graph: Readonly<TpGraphDocument>): TpOpticsAnalysis {
  validateGeometricOpticsGraph(graph);
  const source = graph.nodes.find(isOpticsSource) as TpGraphNode;
  const screen = graph.nodes.find((node) => node.type === TP_OPTICS_SCREEN);
  const axisY = typeof graph.data?.axisY === 'number' ? graph.data.axisY : source.y;
  const lenses = graph.nodes.filter((node) => node.type === TP_OPTICS_CONVERGING_LENS || node.type === TP_OPTICS_DIVERGING_LENS || isSphericalLens(node))
    .filter((node) => Math.abs(node.y - axisY) < 0.5 && node.x > source.x && (!screen || node.x < screen.x)).sort((a, b) => a.x - b.x);
  const stages: TpOpticsMatrixStage[] = []; let cumulative: TpOpticsMatrix = [1, 0, 0, 1]; let x = source.x;
  for (const lens of lenses) {
    const thickness = isSphericalLens(lens) ? dataNumber(lens, 'thickness', 100) : 0; const entryX = lens.x - thickness / 2;
    const free = translation(entryX - x); cumulative = multiply(free, cumulative);
    stages.push({ label: `Free space ${entryX - x}`, matrix: free, cumulative });
    if (isSphericalLens(lens)) {
      const index = dataNumber(lens, 'refractiveIndex', 1.5); const radius1 = dataNumber(lens, 'radius1', 100); const radius2 = dataNumber(lens, 'radius2', -100);
      const front = sphericalRefractionMatrix(1, index, radius1); cumulative = multiply(front, cumulative); stages.push({ label: `${lens.label ?? lens.id} front (R = ${radius1})`, matrix: front, cumulative });
      const inside = translation(thickness); cumulative = multiply(inside, cumulative); stages.push({ label: `${lens.label ?? lens.id} glass (${thickness})`, matrix: inside, cumulative });
      const back = sphericalRefractionMatrix(index, 1, radius2); cumulative = multiply(back, cumulative); stages.push({ label: `${lens.label ?? lens.id} back (R = ${radius2})`, matrix: back, cumulative }); x = lens.x + thickness / 2;
    } else {
      const focal = dataNumber(lens, 'focalLength', 100); const refraction = lensMatrix(focal);
      cumulative = multiply(refraction, cumulative); stages.push({ label: `${lens.label ?? lens.id} (f = ${focal})`, matrix: refraction, cumulative }); x = lens.x;
    }
  }
  const afterLastLens = cumulative; const [, b, c, d] = afterLastLens; const imageDistance = lenses.length === 0 || Math.abs(d) < 1e-12 ? null : -b / d;
  const imageX = imageDistance === null ? null : x + imageDistance;
  const magnification = imageDistance === null ? null : afterLastLens[0] + imageDistance * c;
  const observationX = screen?.x ?? imageX ?? x + 200; const free = translation(observationX - x); cumulative = multiply(free, cumulative);
  stages.push({ label: `${screen ? 'Free space' : 'Image plane'} ${observationX - x}`, matrix: free, cumulative });
  return { axisY, sourceId: source.id, screenId: screen?.id ?? null,
    matrix: cumulative, stages, imageX, magnification, imageKind: imageDistance === null ? 'afocal' : imageDistance >= 0 ? 'real' : 'virtual',
    orientation: magnification === null ? 'undefined' : magnification < 0 ? 'inverted' : 'upright' };
}

function objectMarkup(node: Readonly<TpGraphNode>, selected: boolean): string {
  const height = Math.max(10, Math.abs(dataNumber(node, 'height', 60))); const direction = objectDirection(node) === 'up' ? -1 : 1; const tip = direction * height; const arrowBase = tip - direction * 10;
  const content = `<path class="tp-graph-shape tp-optics-object${selected ? ' is-selected' : ''}" d="M0 0V${tip}M-7 ${arrowBase}L0 ${tip}L7 ${arrowBase}"/><text class="tp-graph-label" y="${direction < 0 ? 20 : -12}" text-anchor="middle">${escapeXml(node.label ?? 'Object')}</text>`;
  return node.id === 'preview' ? `<g class="tp-optics-object-preview" transform="translate(0 ${-direction * height / 2})">${content}</g>` : content;
}
function pointSourceMarkup(node: Readonly<TpGraphNode>, selected: boolean): string {
  return `<circle class="tp-graph-shape tp-optics-point-source${selected ? ' is-selected' : ''}" r="7"/><circle class="tp-optics-point-source-halo" r="12"/><text class="tp-graph-label" y="27" text-anchor="middle">${escapeXml(node.label ?? 'Point source')}</text>`;
}
function lensMarkup(node: Readonly<TpGraphNode>, selected: boolean, converging: boolean, halfHeight: number, colorIndex: number): string {
  const arrowInset = 10;
  const path = converging
    ? `M0 ${-halfHeight}V${halfHeight}M-8 ${-halfHeight + arrowInset}L0 ${-halfHeight}L8 ${-halfHeight + arrowInset}M-8 ${halfHeight - arrowInset}L0 ${halfHeight}L8 ${halfHeight - arrowInset}`
    : `M0 ${-halfHeight}V${halfHeight}M-8 ${-halfHeight - arrowInset}L0 ${-halfHeight}L8 ${-halfHeight - arrowInset}M-8 ${halfHeight + arrowInset}L0 ${halfHeight}L8 ${halfHeight + arrowInset}`;
  return `<path class="tp-graph-shape tp-optics-lens tp-optics-color-${colorIndex} ${converging ? 'is-converging' : 'is-diverging'}${selected ? ' is-selected' : ''}" d="${path}"/><text class="tp-graph-label" y="${halfHeight + 18}" text-anchor="middle">${escapeXml(node.label ?? 'Lens')}</text>`;
}
function screenMarkup(node: Readonly<TpGraphNode>, selected: boolean, halfHeight: number, colorIndex: number): string {
  const width = node.id === 'preview' ? 22 : 10;
  return `<rect class="tp-graph-shape tp-optics-screen tp-optics-color-${colorIndex}${selected ? ' is-selected' : ''}" x="${-width / 2}" y="${-halfHeight}" width="${width}" height="${halfHeight * 2}"/><text class="tp-graph-label" y="${halfHeight + 16}" text-anchor="middle">${escapeXml(node.label ?? 'Screen')}</text>`;
}
function mediumMarkup(node: Readonly<TpGraphNode>, selected: boolean, colorIndex: number): string {
  const width = dataNumber(node, 'width', 160); const height = dataNumber(node, 'height', 240); const index = dataNumber(node, 'refractiveIndex', 1.5);
  return `<rect class="tp-graph-shape tp-optics-medium tp-optics-color-${colorIndex}${selected ? ' is-selected' : ''}" x="${-width / 2}" y="${-height / 2}" width="${width}" height="${height}"/><text class="tp-graph-label" y="${-height / 2 + 18}" text-anchor="middle">${escapeXml(node.label ?? 'Medium')} · n=${index}</text>`;
}
function grinMediumMarkup(node: Readonly<TpGraphNode>, selected: boolean, colorIndex: number): string {
  const width = dataNumber(node, 'width', 180); const height = dataNumber(node, 'height', 200); const columns = node.id === 'preview' ? 6 : 18; const rows = node.id === 'preview' ? 6 : 12; const samples: Array<{ x: number; y: number; value: number }> = [];
  for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) {
    const x = -width / 2 + (column + 0.5) * width / columns; const y = -height / 2 + (row + 0.5) * height / rows;
    samples.push({ x, y, value: grinIndex(node, node.x + x, node.y + y) });
  }
  const values = samples.map((sample) => sample.value); const minimum = Math.min(...values); const maximum = Math.max(...values); const range = Math.max(1e-9, maximum - minimum);
  const cells = samples.map((sample) => `<rect class="tp-optics-grin-cell" x="${sample.x - width / columns / 2}" y="${sample.y - height / rows / 2}" width="${width / columns + 0.2}" height="${height / rows + 0.2}" fill-opacity="${(0.1 + 0.4 * (sample.value - minimum) / range).toFixed(3)}"/>`).join('');
  const legend = node.id === 'preview' ? '' : `<g class="tp-optics-grin-legend" transform="translate(${-width / 2} ${height / 2 + 16})"><rect width="${width}" height="7"/><text y="20">n min ${minimum.toFixed(3)}</text><text x="${width}" y="20" text-anchor="end">n max ${maximum.toFixed(3)}</text></g>`;
  return `<g class="tp-optics-grin-field tp-optics-color-${colorIndex}">${cells}</g><rect class="tp-graph-shape tp-optics-grin-medium tp-optics-color-${colorIndex}${selected ? ' is-selected' : ''}" x="${-width / 2}" y="${-height / 2}" width="${width}" height="${height}"/><text class="tp-graph-label" y="${-height / 2 + 18}" text-anchor="middle">${escapeXml(node.label ?? 'GRIN medium')} · ${grinProfile(node)}</text>${legend}`;
}
function planeInterfaceMarkup(node: Readonly<TpGraphNode>, selected: boolean, colorIndex: number): string {
  const halfHeight = dataNumber(node, 'height', 240) / 2;
  return `<path class="tp-graph-shape tp-optics-plane-interface tp-optics-color-${colorIndex}${selected ? ' is-selected' : ''}" d="M0 ${-halfHeight}V${halfHeight}"/><line class="tp-optics-normal" x1="-30" y1="0" x2="30" y2="0"/><text class="tp-graph-label" y="${halfHeight + 18}" text-anchor="middle">${escapeXml(node.label ?? 'Plane interface')}</text>`;
}
function curvedInterfaceMarkup(node: Readonly<TpGraphNode>, selected: boolean, colorIndex: number): string {
  const radius = curvedInterfaceRadius(node); const halfHeight = dataNumber(node, 'height', 240) / 2; const points: string[] = [];
  for (let index = 0; index <= 24; index += 1) {
    const y = -halfHeight + index * halfHeight * 2 / 24;
    const x = radius - Math.sign(radius) * Math.sqrt(Math.max(0, radius * radius - y * y));
    points.push(`${x},${y}`);
  }
  return `<polyline class="tp-graph-shape tp-optics-curved-interface tp-optics-color-${colorIndex}${selected ? ' is-selected' : ''}" points="${points.join(' ')}"/><line class="tp-optics-normal" x1="-30" y1="0" x2="30" y2="0"/><text class="tp-graph-label" y="${halfHeight + 18}" text-anchor="middle">${escapeXml(node.label ?? 'Curved interface')}</text>`;
}
function sphericalLensMarkup(node: Readonly<TpGraphNode>, selected: boolean, colorIndex: number): string {
  const halfHeight = dataNumber(node, 'height', 160) / 2; const [front, back] = sphericalLensSurfaces(node);
  const surfacePoints = (surface: Readonly<TpGraphNode>): TpGraphPoint[] => {
    const radius = curvedInterfaceRadius(surface); const points: TpGraphPoint[] = [];
    for (let index = 0; index <= 32; index += 1) {
      const y = -halfHeight + index * halfHeight * 2 / 32;
      points.push({ x: surface.x - node.x + radius - Math.sign(radius) * Math.sqrt(Math.max(0, radius * radius - y * y)), y });
    }
    return points;
  };
  const frontPoints = surfacePoints(front); const backPoints = surfacePoints(back); const outline = [...frontPoints, ...[...backPoints].reverse()];
  return `<polygon class="tp-graph-shape tp-optics-spherical-lens tp-optics-color-${colorIndex}${selected ? ' is-selected' : ''}" points="${outline.map((point) => `${point.x},${point.y}`).join(' ')}"/><text class="tp-graph-label" y="${halfHeight + 18}" text-anchor="middle">${escapeXml(node.label ?? 'Spherical lens')}</text>`;
}
function mirrorMarkup(node: Readonly<TpGraphNode>, selected: boolean, colorIndex: number): string {
  const halfHeight = dataNumber(node, 'height', 240) / 2; const shape = node.data?.shape ?? 'plane'; const points: string[] = [];
  if (shape === 'plane') points.push(`0,${-halfHeight}`, `0,${halfHeight}`);
  else {
    const radius = mirrorRadius(node);
    for (let index = 0; index <= 24; index += 1) {
      const y = -halfHeight + index * halfHeight * 2 / 24; const x = radius - Math.sign(radius) * Math.sqrt(Math.max(0, radius * radius - y * y));
      points.push(`${x},${y}`);
    }
  }
  // Palette previews are strongly downscaled: use a wider geometric offset so
  // the non-reflecting black back remains visible beside the coloured face.
  const backingOffset = node.id === 'preview' ? 16 : 3;
  const backing = points.map((point) => { const [x, y] = point.split(',').map(Number); return `${(x ?? 0) + backingOffset},${y ?? 0}`; }).join(' ');
  const previewBacking = node.id === 'preview' ? ' is-preview" style="stroke:#000' : '';
  return `<polyline class="tp-optics-mirror-backing${previewBacking}" points="${backing}"/><polyline class="tp-graph-shape tp-optics-mirror tp-optics-color-${colorIndex}${selected ? ' is-selected' : ''}" points="${points.join(' ')}"/><text class="tp-graph-label" y="${halfHeight + 18}" text-anchor="middle">${escapeXml(node.label ?? 'Mirror')}</text>`;
}
function curvedRefraction(node: Readonly<TpGraphNode>, start: TpGraphPoint, slope: number, direction: number): { point: TpGraphPoint; slope: number } | null {
  const radius = curvedInterfaceRadius(node); const center = { x: node.x + radius, y: node.y }; const norm = Math.hypot(1, slope);
  const incident = { x: direction / norm, y: -slope * direction / norm }; const offset = { x: start.x - center.x, y: start.y - center.y };
  const b = 2 * (offset.x * incident.x + offset.y * incident.y); const c = offset.x * offset.x + offset.y * offset.y - radius * radius; const discriminant = b * b - 4 * c;
  if (discriminant < 0) return null;
  const roots = [(-b - Math.sqrt(discriminant)) / 2, (-b + Math.sqrt(discriminant)) / 2].filter((root) => root > 1e-6).sort((a, bValue) => a - bValue);
  const halfHeight = dataNumber(node, 'height', 240) / 2;
  for (const distance of roots) {
    const point = { x: start.x + incident.x * distance, y: start.y + incident.y * distance }; const relativeY = point.y - node.y;
    if (Math.abs(relativeY) > halfHeight) continue;
    const branchX = center.x - Math.sign(radius) * Math.sqrt(Math.max(0, radius * radius - relativeY * relativeY));
    if (Math.abs(point.x - branchX) > 0.5) continue;
    let normal = { x: (point.x - center.x) / Math.abs(radius), y: (point.y - center.y) / Math.abs(radius) };
    if (incident.x * normal.x + incident.y * normal.y > 0) normal = { x: -normal.x, y: -normal.y };
    const n1 = direction > 0 ? dataNumber(node, 'leftIndex', 1) : dataNumber(node, 'rightIndex', 1.5);
    const n2 = direction > 0 ? dataNumber(node, 'rightIndex', 1.5) : dataNumber(node, 'leftIndex', 1); const ratio = n1 / n2;
    const cosine = -(incident.x * normal.x + incident.y * normal.y); const k = 1 - ratio * ratio * (1 - cosine * cosine);
    if (k < 0) return null;
    const refracted = { x: ratio * incident.x + (ratio * cosine - Math.sqrt(k)) * normal.x, y: ratio * incident.y + (ratio * cosine - Math.sqrt(k)) * normal.y };
    return { point, slope: -refracted.y / refracted.x };
  }
  return null;
}
function curvedReflection(node: Readonly<TpGraphNode>, start: TpGraphPoint, slope: number, direction: number): { point: TpGraphPoint; slope: number; direction: number } | null {
  const radius = mirrorRadius(node); const center = { x: node.x + radius, y: node.y }; const norm = Math.hypot(1, slope);
  const incident = { x: direction / norm, y: -slope * direction / norm }; const offset = { x: start.x - center.x, y: start.y - center.y };
  const b = 2 * (offset.x * incident.x + offset.y * incident.y); const c = offset.x * offset.x + offset.y * offset.y - radius * radius; const discriminant = b * b - 4 * c;
  if (discriminant < 0) return null;
  const roots = [(-b - Math.sqrt(discriminant)) / 2, (-b + Math.sqrt(discriminant)) / 2].filter((root) => root > 1e-6).sort((a, bValue) => a - bValue);
  const halfHeight = dataNumber(node, 'height', 240) / 2;
  for (const distance of roots) {
    const point = { x: start.x + incident.x * distance, y: start.y + incident.y * distance }; const relativeY = point.y - node.y;
    if (Math.abs(relativeY) > halfHeight) continue;
    const branchX = center.x - Math.sign(radius) * Math.sqrt(Math.max(0, radius * radius - relativeY * relativeY));
    if (Math.abs(point.x - branchX) > 0.5) continue;
    const normal = { x: (point.x - center.x) / Math.abs(radius), y: (point.y - center.y) / Math.abs(radius) }; const dot = incident.x * normal.x + incident.y * normal.y;
    const reflected = { x: incident.x - 2 * dot * normal.x, y: incident.y - 2 * dot * normal.y };
    return { point, slope: -reflected.y / reflected.x, direction: Math.sign(reflected.x) || -direction };
  }
  return null;
}
interface GrinTraceResult { points: TpGraphPoint[]; slope: number; complete: boolean }
function integrateGrinRay(node: Readonly<TpGraphNode>, entry: TpGraphPoint, slope: number, direction: number): GrinTraceResult {
  const width = dataNumber(node, 'width', 180); const height = dataNumber(node, 'height', 200); const step = dataNumber(node, 'integrationStep', 2); const exitX = node.x + direction * width / 2; const epsilon = Math.max(0.05, step * 0.1); const norm = Math.hypot(1, slope);
  const entryIndex = grinIndex(node, entry.x + direction * epsilon, entry.y); const incidentY = -slope * direction / norm; const transmittedY = incidentY / entryIndex;
  if (Math.abs(transmittedY) >= 1) return { points: [entry], slope, complete: false };
  let state = { x: entry.x, y: entry.y, ux: direction * Math.sqrt(1 - transmittedY * transmittedY), uy: transmittedY }; const points: TpGraphPoint[] = [entry];
  const derivative = (candidate: typeof state): typeof state => {
    const index = grinIndex(node, candidate.x, candidate.y); const gradientX = (grinIndex(node, candidate.x + epsilon, candidate.y) - grinIndex(node, candidate.x - epsilon, candidate.y)) / (2 * epsilon); const gradientY = (grinIndex(node, candidate.x, candidate.y + epsilon) - grinIndex(node, candidate.x, candidate.y - epsilon)) / (2 * epsilon); const projection = candidate.ux * gradientX + candidate.uy * gradientY;
    return { x: candidate.ux, y: candidate.uy, ux: (gradientX - candidate.ux * projection) / index, uy: (gradientY - candidate.uy * projection) / index };
  };
  const advance = (candidate: typeof state, delta: typeof state, factor: number): typeof state => ({ x: candidate.x + delta.x * factor, y: candidate.y + delta.y * factor, ux: candidate.ux + delta.ux * factor, uy: candidate.uy + delta.uy * factor });
  for (let iteration = 0; iteration < 10_000; iteration += 1) {
    const previous = state; const k1 = derivative(state); const k2 = derivative(advance(state, k1, step / 2)); const k3 = derivative(advance(state, k2, step / 2)); const k4 = derivative(advance(state, k3, step));
    state = { x: state.x + step * (k1.x + 2 * k2.x + 2 * k3.x + k4.x) / 6, y: state.y + step * (k1.y + 2 * k2.y + 2 * k3.y + k4.y) / 6, ux: state.ux + step * (k1.ux + 2 * k2.ux + 2 * k3.ux + k4.ux) / 6, uy: state.uy + step * (k1.uy + 2 * k2.uy + 2 * k3.uy + k4.uy) / 6 };
    const directionNorm = Math.hypot(state.ux, state.uy); state.ux /= directionNorm; state.uy /= directionNorm;
    if (Math.abs(state.y - node.y) > height / 2) { points.push({ x: state.x, y: state.y }); return { points, slope: -state.uy / state.ux, complete: false }; }
    if ((direction > 0 && state.x >= exitX) || (direction < 0 && state.x <= exitX)) {
      const ratio = (exitX - previous.x) / (state.x - previous.x); const y = previous.y + ratio * (state.y - previous.y); const insideIndex = grinIndex(node, exitX - direction * epsilon, y); const exitY = insideIndex * state.uy;
      points.push({ x: exitX, y }); if (Math.abs(exitY) >= 1) return { points, slope: -state.uy / state.ux, complete: false };
      const exitXDirection = direction * Math.sqrt(1 - exitY * exitY); return { points, slope: -exitY / exitXDirection, complete: true };
    }
    points.push({ x: state.x, y: state.y });
  }
  return { points, slope: -state.uy / state.ux, complete: false };
}

function graduatedAxis(start: number, end: number, axisY: number): string {
  const minorStep = 25;
  const majorStep = 50;
  const firstTick = Math.ceil(start / minorStep) * minorStep;
  const ticks: string[] = [];
  for (let x = firstTick; x <= end; x += minorStep) {
    const major = x % majorStep === 0;
    ticks.push(`<line class="tp-optics-axis-tick${major ? ' is-major' : ''}" x1="${x}" y1="${axisY - (major ? 6 : 3)}" x2="${x}" y2="${axisY + (major ? 6 : 3)}"/>`);
    if (major) ticks.push(`<text class="tp-optics-axis-label" x="${x}" y="${axisY + 19}" text-anchor="middle">${x}</text>`);
  }
  return `<g class="tp-optics-axis-graduation"><line class="tp-optics-axis" x1="${start}" y1="${axisY}" x2="${end}" y2="${axisY}"/>${ticks.join('')}</g>`;
}
function lineIntersection(first: readonly [TpGraphPoint, TpGraphPoint], second: readonly [TpGraphPoint, TpGraphPoint]): TpGraphPoint | null {
  const [a, b] = first; const [c, d] = second; const denominator = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
  if (Math.abs(denominator) < 1e-9) return null;
  const firstCross = a.x * b.y - a.y * b.x; const secondCross = c.x * d.y - c.y * d.x;
  const x = (firstCross * (c.x - d.x) - (a.x - b.x) * secondCross) / denominator; const y = (firstCross * (c.y - d.y) - (a.y - b.y) * secondCross) / denominator;
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}

/** @summary Edits and simulates a paraxial geometric-optics bench. @tagname tp-graph-geometric-optics @event tp-optics-trace * @example
 * <tp-graph-geometric-optics></tp-graph-geometric-optics>
 */
export class TpGraphGeometricOptics extends TpGraphEditor {
  private static readonly opticsStyleId = 'tp-graph-geometric-optics-styles';
  private static instanceCounter = 0;
  private readonly opticsInstanceId = ++TpGraphGeometricOptics.instanceCounter;
  private selectedOpticsId: string | null = null;
  public constructor() {
    super(); this.unregisterPalette('generic');
    const lensHalfHeight = (node: Readonly<TpGraphNode>): number => opticalLensHalfHeight(this.value, node);
    const opticalColor = (node: Readonly<TpGraphNode>): number => this.opticalColorIndex(node);
    const screenHalfHeight = (node: Readonly<TpGraphNode>): number => opticalScreenHalfHeight(this.value, node);
    this.registerPalette({ id: 'optics-sources', label: 'Sources', shapes: [
      { type: TP_OPTICS_SOURCE, label: 'Object', description: 'Luminous object', width: 40, height: (node) => Math.max(100, Math.abs(dataNumber(node, 'height', 60)) + 30), createData: () => ({ height: 60, rayCount: 3, direction: 'up' }), render: objectMarkup },
      { type: TP_OPTICS_POINT_SOURCE, label: 'Point source', description: 'Point emitting a divergent ray bundle', width: 40, height: 55, createData: () => ({ rayCount: 3, openingAngle: 60, orientationAngle: 0 }), render: pointSourceMarkup },
    ] });
    this.registerPalette({ id: 'optics-lenses', label: 'Lenses', shapes: [
      { type: TP_OPTICS_CONVERGING_LENS, label: 'Converging lens', description: 'Positive thin lens', width: 34, height: (node) => lensHalfHeight(node) * 2 + 30, createData: () => ({ focalLength: 100 }), render: (node, selected) => lensMarkup(node, selected, true, lensHalfHeight(node), opticalColor(node)) },
      { type: TP_OPTICS_DIVERGING_LENS, label: 'Diverging lens', description: 'Negative thin lens', width: 34, height: (node) => lensHalfHeight(node) * 2 + 30, createData: () => ({ focalLength: -100 }), render: (node, selected) => lensMarkup(node, selected, false, lensHalfHeight(node), opticalColor(node)) },
      { type: TP_OPTICS_BICONVEX_LENS, label: 'Biconvex lens', description: 'Thick converging lens with two spherical surfaces', width: 110, height: (node) => dataNumber(node, 'height', 160) + 30, createData: () => ({ refractiveIndex: 1.5, thickness: 100, radius1: 100, radius2: -100, height: 160 }), render: (node, selected) => sphericalLensMarkup(node, selected, opticalColor(node)) },
      { type: TP_OPTICS_BICONCAVE_LENS, label: 'Biconcave lens', description: 'Thick diverging lens with two spherical surfaces', width: 110, height: (node) => dataNumber(node, 'height', 160) + 30, createData: () => ({ refractiveIndex: 1.5, thickness: 100, radius1: -100, radius2: 100, height: 160 }), render: (node, selected) => sphericalLensMarkup(node, selected, opticalColor(node)) },
    ] });
    this.registerPalette({ id: 'optics-interfaces', label: 'Interfaces', shapes: [
      { type: TP_OPTICS_PLANE_INTERFACE, label: 'Plane interface', description: 'Plane boundary between two refractive indices', width: 50, height: (node) => dataNumber(node, 'height', 240) + 30, createData: () => ({ leftIndex: 1, rightIndex: 1.5, height: 240 }), render: (node, selected) => planeInterfaceMarkup(node, selected, opticalColor(node)) },
      { type: TP_OPTICS_CURVED_INTERFACE, label: 'Convex interface', description: 'Convex spherical boundary between two refractive indices', width: 90, height: (node) => dataNumber(node, 'height', 240) + 30, createData: () => ({ leftIndex: 1, rightIndex: 1.5, radius: 160, curvature: 'convex', height: 240 }), render: (node, selected) => curvedInterfaceMarkup(node, selected, opticalColor(node)) },
      { type: TP_OPTICS_CONCAVE_INTERFACE, label: 'Concave interface', description: 'Concave spherical boundary between two refractive indices', width: 90, height: (node) => dataNumber(node, 'height', 240) + 30, createData: () => ({ leftIndex: 1, rightIndex: 1.5, radius: 160, curvature: 'concave', height: 240 }), render: (node, selected) => curvedInterfaceMarkup(node, selected, opticalColor(node)) },
    ] });
    this.registerPalette({ id: 'optics-media', label: 'Media', shapes: [
      { type: TP_OPTICS_MEDIUM, label: 'Homogeneous medium', description: 'Parallel slab with a constant refractive index', width: (node) => dataNumber(node, 'width', 160), height: (node) => dataNumber(node, 'height', 240), createData: () => ({ refractiveIndex: 1.5, width: 160, height: 240 }), render: (node, selected) => mediumMarkup(node, selected, opticalColor(node)) },
      { type: TP_OPTICS_GRIN_MEDIUM, label: 'GRIN medium', description: 'Continuous gradient-index medium', width: (node) => dataNumber(node, 'width', 180), height: (node) => dataNumber(node, 'height', 200) + 32, createData: () => ({ profile: 'parabolic', baseIndex: 1.5, gradient: -0.001, coefficient: 0.00002, expression: 'n0 - 0.00002*y^2', integrationStep: 2, width: 180, height: 200 }), render: (node, selected) => grinMediumMarkup(node, selected, opticalColor(node)) },
    ] });
    this.registerPalette({ id: 'optics-mirrors', label: 'Mirrors', shapes: [
      { type: TP_OPTICS_MIRROR, label: 'Plane mirror', description: 'Plane reflecting surface', width: 45, height: (node) => dataNumber(node, 'height', 240) + 30, createData: () => ({ shape: 'plane', radius: 160, height: 240 }), render: (node, selected) => mirrorMarkup(node, selected, opticalColor(node)) },
      { type: TP_OPTICS_CONCAVE_MIRROR, label: 'Concave mirror', description: 'Concave spherical reflecting surface', width: 90, height: (node) => dataNumber(node, 'height', 240) + 30, createData: () => ({ shape: 'concave', radius: 160, height: 240 }), render: (node, selected) => mirrorMarkup(node, selected, opticalColor(node)) },
      { type: TP_OPTICS_CONVEX_MIRROR, label: 'Convex mirror', description: 'Convex spherical reflecting surface', width: 90, height: (node) => dataNumber(node, 'height', 240) + 30, createData: () => ({ shape: 'convex', radius: 160, height: 240 }), render: (node, selected) => mirrorMarkup(node, selected, opticalColor(node)) },
    ] });
    this.registerPalette({ id: 'optics-screen', label: 'Screen', shapes: [
      { type: TP_OPTICS_SCREEN, label: 'Screen', description: 'Image observation screen', width: 24, height: (node) => screenHalfHeight(node) * 2 + 28, render: (node, selected) => screenMarkup(node, selected, screenHalfHeight(node), opticalColor(node)) },
    ] });
    this.addEventListener('tp-graph-selection-change', (event) => { this.selectedOpticsId = (event as CustomEvent<{ id: string | null }>).detail.id; this.updateControls(); });
  }
  protected override connectedCallback(): void { super.connectedCallback(); this.ensureGlobalStyle(TpGraphGeometricOptics.opticsStyleId, style); }
  public override setGraph(graph: TpGraphDocument): void { validateGeometricOpticsGraph(graph); super.setGraph(graph); }
  public override addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode {
    if (type !== TP_GRAPH_COMMENT && !(OPTICAL_TYPES as readonly string[]).includes(type)) throw new TypeError(`Unsupported geometric-optics node type: ${type}`);
    if ((type === TP_OPTICS_SOURCE || type === TP_OPTICS_POINT_SOURCE) && this.value.nodes.some(isOpticsSource)) throw new TypeError('The optical bench already has a source.');
    if (type === TP_OPTICS_SCREEN && this.value.nodes.some((node) => node.type === type)) throw new TypeError('The optical bench already has a screen.');
    return super.addNode(type, point, label);
  }
  public override addEdge(): TpGraphEdge { throw new TypeError('Optical rays are computed automatically.'); }
  protected override edgeDirections(): readonly [] { return []; }
  protected override graphWorldBounds(): Readonly<{ minX: number; minY: number; maxX: number; maxY: number }> {
    const axisY = typeof this.value.data?.axisY === 'number' ? this.value.data.axisY : 240;
    return { minX: 0, minY: axisY - 250, maxX: 1000, maxY: axisY + 250 };
  }
  public analyze(): TpOpticsAnalysis { return analyzeGeometricOptics(this.value); }
  public trace(): void { this.setGraph(this.value); this.dispatchEvent(new CustomEvent('tp-optics-trace', { bubbles: true, detail: { analysis: this.analyze(), graph: this.value } })); }
  protected override renderToolbarActions(): string {
    return `<label class="tp-optics-parameter" hidden>Focal length <input type="number" step="10" data-optics-parameter="focalLength" disabled></label><label class="tp-optics-parameter" hidden>Object height <input type="number" min="10" step="10" data-optics-parameter="height" disabled></label><label class="tp-optics-parameter" hidden>Object direction <select data-optics-object-direction disabled><option value="up">Up</option><option value="down">Down</option></select></label><label class="tp-optics-parameter" hidden>Ray count <input type="number" min="1" max="10" step="1" data-optics-parameter="rayCount" disabled></label><label class="tp-optics-parameter" hidden>Opening angle <input type="number" min="0" max="360" step="5" data-optics-parameter="openingAngle" disabled></label><label class="tp-optics-parameter" hidden>Orientation <input type="number" min="-180" max="180" step="5" data-optics-parameter="orientationAngle" disabled></label><label class="tp-optics-parameter" hidden>Index <input type="number" min="0.01" step="0.01" data-optics-parameter="refractiveIndex" disabled></label><label class="tp-optics-parameter" hidden>Width <input type="number" min="10" step="10" data-optics-parameter="width" disabled></label><label class="tp-optics-parameter" hidden>GRIN profile <select data-optics-grin-profile disabled><option value="linear">Linear n(y)</option><option value="radial">Radial n(x,y)</option><option value="parabolic">Parabolic n(y)</option><option value="custom">Custom expression</option></select></label><label class="tp-optics-parameter" hidden>Base index <input type="number" min="0.01" step="0.01" data-optics-parameter="baseIndex" disabled></label><label class="tp-optics-parameter" hidden>Gradient <input type="number" step="0.0001" data-optics-parameter="gradient" disabled></label><label class="tp-optics-parameter" hidden>Coefficient <input type="number" min="0" step="0.00001" data-optics-parameter="coefficient" disabled></label><label class="tp-optics-parameter" hidden>Step <input type="number" min="0.1" max="20" step="0.5" data-optics-parameter="integrationStep" disabled></label><label class="tp-optics-parameter tp-optics-expression" hidden>n(x,y) <input type="text" data-optics-grin-expression disabled></label><label class="tp-optics-parameter" hidden>Thickness <input type="number" min="1" step="5" data-optics-parameter="thickness" disabled></label><label class="tp-optics-parameter" hidden>Front radius <input type="number" step="10" data-optics-parameter="radius1" disabled></label><label class="tp-optics-parameter" hidden>Back radius <input type="number" step="10" data-optics-parameter="radius2" disabled></label><label class="tp-optics-parameter" hidden>Left n <input type="number" min="0.01" step="0.01" data-optics-parameter="leftIndex" disabled></label><label class="tp-optics-parameter" hidden>Right n <input type="number" min="0.01" step="0.01" data-optics-parameter="rightIndex" disabled></label><label class="tp-optics-parameter" hidden>Curvature <select data-optics-curvature disabled><option value="convex">Convex</option><option value="concave">Concave</option></select></label><label class="tp-optics-parameter" hidden>Mirror shape <select data-optics-mirror-shape disabled><option value="plane">Plane</option><option value="convex">Convex</option><option value="concave">Concave</option></select></label><label class="tp-optics-parameter" hidden>Radius <input type="number" min="1" step="10" data-optics-parameter="radius" disabled></label>`;
  }
  protected override renderResults(): string {
    try {
      const result = this.analyze(); const matrix = (m: TpOpticsMatrix) => `\\begin{pmatrix}${m[0].toFixed(3)}&${m[1].toFixed(3)}\\\\${m[2].toFixed(3)}&${m[3].toFixed(3)}\\end{pmatrix}`;
      const math = (latex: string) => `<tp-markdown><script type="tp/markdown">---\nextensions:\n  - math\n---\n:latexmath:\`${latex}\`</script></tp-markdown>`;
      const rows = result.stages.map((stage) => `<tr><th scope="row">${escapeXml(stage.label)}</th><td>${math(matrix(stage.matrix))}</td><td>${math(matrix(stage.cumulative))}</td></tr>`).join('');
      const source = this.value.nodes.find((node) => node.id === result.sourceId) as TpGraphNode;
      const pointSource = source.type === TP_OPTICS_POINT_SOURCE;
      const objectHeight = pointSource ? 0 : Math.max(10, Math.abs(dataNumber(source, 'height', 60)));
      const imageHeight = result.magnification === null ? null : Math.abs(objectHeight * result.magnification);
      const lenses = this.value.nodes.filter((node) => node.type === TP_OPTICS_CONVERGING_LENS || node.type === TP_OPTICS_DIVERGING_LENS || isSphericalLens(node)).sort((a, b) => a.x - b.x);
      const lensDetails = lenses.map((lens) => `<article class="tp-optics-lens-details"><h5>${escapeXml(lens.label ?? lens.id)}</h5><dl><dt>Type</dt><dd>${isSphericalLens(lens) ? lens.type === TP_OPTICS_BICONVEX_LENS ? 'Biconvex spherical' : 'Biconcave spherical' : lens.type === TP_OPTICS_CONVERGING_LENS ? 'Converging thin' : 'Diverging thin'}</dd><dt>Position</dt><dd>${lens.x.toFixed(2)}</dd><dt>Focal length</dt><dd>${opticalFocalLength(lens).toFixed(2)}</dd>${isSphericalLens(lens) ? `<dt>Index</dt><dd>${dataNumber(lens, 'refractiveIndex', 1.5).toFixed(3)}</dd><dt>Thickness</dt><dd>${dataNumber(lens, 'thickness', 100).toFixed(2)}</dd><dt>R₁ / R₂</dt><dd>${dataNumber(lens, 'radius1', 100).toFixed(2)} / ${dataNumber(lens, 'radius2', -100).toFixed(2)}</dd>` : ''}<dt>On axis</dt><dd>${Math.abs(lens.y - result.axisY) < 0.5 ? 'Yes' : 'No'}</dd></dl></article>`).join('');
      const grinMedia = this.value.nodes.filter((node) => node.type === TP_OPTICS_GRIN_MEDIUM); const grinDetails = grinMedia.map((medium) => {
        const width = dataNumber(medium, 'width', 180); const height = dataNumber(medium, 'height', 200); const sampled = [-1, -0.5, 0, 0.5, 1].flatMap((x) => [-1, -0.5, 0, 0.5, 1].map((y) => grinIndex(medium, medium.x + x * width / 2, medium.y + y * height / 2))); const law = grinProfile(medium) === 'custom' ? String(medium.data?.expression ?? 'n0 - 0.00002*y^2') : grinProfile(medium);
        return `<article class="tp-optics-lens-details"><h5>${escapeXml(medium.label ?? medium.id)}</h5><dl><dt>Profile</dt><dd>${grinProfile(medium)}</dd><dt>Law</dt><dd><code>${escapeXml(law)}</code></dd><dt>Index range</dt><dd>${Math.min(...sampled).toFixed(3)} – ${Math.max(...sampled).toFixed(3)}</dd><dt>Integration step</dt><dd>${dataNumber(medium, 'integrationStep', 2).toFixed(2)}</dd></dl></article>`;
      }).join('');
      const absoluteImageDirection = result.magnification === null ? 'undefined' : (objectDirection(source) === 'up') === (result.magnification > 0) ? 'up' : 'down';
      const imageDetails = lenses.length === 0 ? '' : `<h4>Image</h4><dl><dt>Position</dt><dd>${result.imageX?.toFixed(2) ?? 'At infinity'}</dd><dt>Height</dt><dd>${imageHeight?.toFixed(2) ?? 'Undefined'}</dd><dt>Magnification</dt><dd>${result.magnification?.toFixed(3) ?? 'Undefined'}</dd><dt>Kind</dt><dd>${result.imageKind}</dd><dt>Relative orientation</dt><dd>${result.orientation}</dd><dt>Direction</dt><dd>${absoluteImageDirection}</dd></dl>`;
      const curvedInterfaces = this.value.nodes.filter(isCurvedInterface).map((node) => ({
        x: node.x, y: node.y, halfHeight: dataNumber(node, 'height', 240) / 2, n1: dataNumber(node, 'leftIndex', 1), n2: dataNumber(node, 'rightIndex', 1.5), label: `${node.label ?? node.id} (${curvedInterfaceRadius(node) > 0 ? 'convex' : 'concave'}, R=${Math.abs(curvedInterfaceRadius(node))})`,
      }));
      const interfaces = [...opticalInterfaces(this.value), ...curvedInterfaces].sort((a, b) => a.x - b.x);
      const interfaceRows = interfaces.map((face) => { const critical = face.n1 > face.n2 ? `${(Math.asin(face.n2 / face.n1) * 180 / Math.PI).toFixed(2)}°` : 'None'; return `<tr><th scope="row">${escapeXml(face.label)}</th><td>${face.x.toFixed(2)}</td><td>${face.n1.toFixed(3)}</td><td>${face.n2.toFixed(3)}</td><td>${critical}</td></tr>`; }).join('');
      const snell = interfaces.length === 0 ? '' : `<div class="tp-optics-snell"><h4>Snell–Descartes law</h4>${math('n_1\\sin(i)=n_2\\sin(r)')}<table><thead><tr><th>Interface</th><th>Position</th><th>n₁</th><th>n₂</th><th>Critical angle</th></tr></thead><tbody>${interfaceRows}</tbody></table></div>`;
      const mirrors = this.value.nodes.filter(isOpticsMirror);
      const reflection = mirrors.length === 0 ? '' : `<div class="tp-optics-reflection"><h4>Law of reflection</h4>${math('i=r')}<dl>${mirrors.map((mirror) => `<dt>${escapeXml(mirror.label ?? mirror.id)}</dt><dd>${String(mirror.data?.shape ?? 'plane')}</dd>`).join('')}</dl></div>`;
      const gradientLaw = grinMedia.length === 0 ? '' : `<div class="tp-optics-snell"><h4>Gradient-index ray equation</h4>${math('\\frac{d}{ds}\\left(n\\frac{d\\mathbf r}{ds}\\right)=\\nabla n')}<p>Ray paths are integrated numerically with the step stored by each GRIN medium.</p></div>`;
      const sourceDetails = pointSource
        ? `<h4>Point source</h4><dl><dt>Position x</dt><dd>${source.x.toFixed(2)}</dd><dt>Position y</dt><dd>${source.y.toFixed(2)}</dd><dt>Ray count</dt><dd>${dataNumber(source, 'rayCount', 3)}</dd><dt>Opening angle</dt><dd>${dataNumber(source, 'openingAngle', 60).toFixed(2)}°</dd><dt>Orientation</dt><dd>${dataNumber(source, 'orientationAngle', 0).toFixed(2)}°</dd></dl>`
        : `<h4>Object</h4><dl><dt>Position</dt><dd>${source.x.toFixed(2)}</dd><dt>Height</dt><dd>${objectHeight.toFixed(2)}</dd><dt>Direction</dt><dd>${objectDirection(source)}</dd></dl>`;
      return `<h3 class="tp-graph-results-header">Paraxial analysis</h3><div class="tp-graph-results-content tp-optics-results"><section class="tp-optics-analysis-summary">${sourceDetails}${imageDetails}<h4>Lenses</h4>${lensDetails || '<p>None</p>'}<h4>GRIN media</h4>${grinDetails || '<p>None</p>'}</section><section><h4>ABCD matrices</h4>${math(`M=${matrix(result.matrix)}`)}<table><thead><tr><th>Stage</th><th>Element</th><th>Cumulative</th></tr></thead><tbody>${rows}</tbody></table>${snell}${gradientLaw}${reflection}</section></div>`;
    } catch (error) { return `<h3 class="tp-graph-results-header">Paraxial analysis</h3><div class="tp-graph-results-content">${escapeXml(error instanceof Error ? error.message : 'Analysis unavailable.')}</div>`; }
  }
  protected override bindExtensionEvents(): void {
    for (const input of this.querySelectorAll<HTMLInputElement>('[data-optics-parameter]')) input.addEventListener('change', () => this.updateParameter(input.dataset.opticsParameter ?? '', Number(input.value)));
    this.querySelector<HTMLSelectElement>('[data-optics-curvature]')?.addEventListener('change', (event) => this.updateCurvature((event.currentTarget as HTMLSelectElement).value));
    this.querySelector<HTMLSelectElement>('[data-optics-mirror-shape]')?.addEventListener('change', (event) => this.updateMirrorShape((event.currentTarget as HTMLSelectElement).value));
    this.querySelector<HTMLSelectElement>('[data-optics-grin-profile]')?.addEventListener('change', (event) => this.updateGrinProfile((event.currentTarget as HTMLSelectElement).value));
    this.querySelector<HTMLSelectElement>('[data-optics-object-direction]')?.addEventListener('change', (event) => this.updateObjectDirection((event.currentTarget as HTMLSelectElement).value));
    const grinExpressionInput = this.querySelector<HTMLInputElement>('[data-optics-grin-expression]');
    grinExpressionInput?.addEventListener('input', () => this.validateGrinExpressionField(grinExpressionInput));
    grinExpressionInput?.addEventListener('change', () => { if (this.validateGrinExpressionField(grinExpressionInput)) this.updateGrinExpression(grinExpressionInput.value); });
    this.renderOverlay(); this.updateControls();
  }
  private updateParameter(key: string, value: number): void {
    if (!this.selectedOpticsId || !Number.isFinite(value)) return; const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedOpticsId); if (!node) return;
    if (key === 'height' && node.type === TP_OPTICS_SOURCE) node.data = { ...(node.data ?? {}), height: Math.max(10, Math.abs(value)) };
    else if (key === 'focalLength' && (node.type === TP_OPTICS_CONVERGING_LENS || node.type === TP_OPTICS_DIVERGING_LENS)) node.data = { ...(node.data ?? {}), focalLength: (node.type === TP_OPTICS_CONVERGING_LENS ? 1 : -1) * Math.max(1, Math.abs(value)) };
    else if (key === 'refractiveIndex' && (node.type === TP_OPTICS_MEDIUM || isSphericalLens(node))) node.data = { ...(node.data ?? {}), refractiveIndex: Math.max(0.01, value) };
    else if (key === 'width' && node.type === TP_OPTICS_MEDIUM) node.data = { ...(node.data ?? {}), width: Math.max(10, value) };
    else if (key === 'width' && node.type === TP_OPTICS_GRIN_MEDIUM) node.data = { ...(node.data ?? {}), width: Math.max(10, value) };
    else if (key === 'baseIndex' && node.type === TP_OPTICS_GRIN_MEDIUM) node.data = { ...(node.data ?? {}), baseIndex: Math.max(0.01, value) };
    else if (key === 'gradient' && node.type === TP_OPTICS_GRIN_MEDIUM) node.data = { ...(node.data ?? {}), gradient: value };
    else if (key === 'coefficient' && node.type === TP_OPTICS_GRIN_MEDIUM) node.data = { ...(node.data ?? {}), coefficient: Math.max(0, value) };
    else if (key === 'integrationStep' && node.type === TP_OPTICS_GRIN_MEDIUM) node.data = { ...(node.data ?? {}), integrationStep: Math.min(20, Math.max(0.1, value)) };
    else if (key === 'thickness' && isSphericalLens(node)) node.data = { ...(node.data ?? {}), thickness: Math.max(minimumSphericalLensThickness(node), value) };
    else if ((key === 'radius1' || key === 'radius2') && isSphericalLens(node) && value !== 0) {
      node.data = { ...(node.data ?? {}), [key]: value };
      node.data = { ...node.data, thickness: Math.max(dataNumber(node, 'thickness', 100), minimumSphericalLensThickness(node)) };
    }
    else if (key === 'rayCount' && node.type === TP_OPTICS_POINT_SOURCE) node.data = { ...(node.data ?? {}), rayCount: Math.min(10, Math.max(1, Math.round(value))) };
    else if (key === 'openingAngle' && node.type === TP_OPTICS_POINT_SOURCE) node.data = { ...(node.data ?? {}), openingAngle: Math.min(360, Math.max(0, value)) };
    else if (key === 'orientationAngle' && node.type === TP_OPTICS_POINT_SOURCE) node.data = { ...(node.data ?? {}), orientationAngle: Math.min(180, Math.max(-180, value)) };
    else if ((key === 'leftIndex' || key === 'rightIndex') && node.type === TP_OPTICS_PLANE_INTERFACE) node.data = { ...(node.data ?? {}), [key]: Math.max(0.01, value) };
    else if ((key === 'leftIndex' || key === 'rightIndex') && isCurvedInterface(node)) node.data = { ...(node.data ?? {}), [key]: Math.max(0.01, value) };
    else if (key === 'radius' && (isCurvedInterface(node) || isOpticsMirror(node))) {
      const minimum = dataNumber(node, 'height', 240) / 2; node.data = { ...(node.data ?? {}), radius: Math.max(minimum, Math.abs(value)) };
    }
    else return;
    this.setGraph(graph);
  }
  private updateCurvature(curvature: string): void {
    if (!this.selectedOpticsId || (curvature !== 'convex' && curvature !== 'concave')) return;
    const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedOpticsId);
    if (!node || !isCurvedInterface(node)) return;
    node.data = { ...(node.data ?? {}), radius: Math.abs(dataNumber(node, 'radius', 160)), curvature };
    this.setGraph(graph);
  }
  private updateMirrorShape(shape: string): void {
    if (!this.selectedOpticsId || (shape !== 'plane' && shape !== 'convex' && shape !== 'concave')) return;
    const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedOpticsId);
    if (!node || !isOpticsMirror(node)) return;
    node.data = { ...(node.data ?? {}), shape, radius: Math.abs(dataNumber(node, 'radius', 160)) };
    this.setGraph(graph);
  }
  private updateGrinProfile(profile: string): void {
    if (!this.selectedOpticsId || (profile !== 'linear' && profile !== 'radial' && profile !== 'parabolic' && profile !== 'custom')) return;
    const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedOpticsId); if (!node || node.type !== TP_OPTICS_GRIN_MEDIUM) return;
    node.data = { ...(node.data ?? {}), profile }; this.setGraph(graph);
  }
  private updateObjectDirection(direction: string): void {
    if (!this.selectedOpticsId || (direction !== 'up' && direction !== 'down')) return; const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedOpticsId); if (!node || node.type !== TP_OPTICS_SOURCE) return;
    node.data = { ...(node.data ?? {}), direction }; this.setGraph(graph);
  }
  private updateGrinExpression(expression: string): void {
    if (!this.selectedOpticsId) return; const graph = this.value; const node = graph.nodes.find((candidate) => candidate.id === this.selectedOpticsId); if (!node || node.type !== TP_OPTICS_GRIN_MEDIUM) return;
    compileGrinExpression(expression); node.data = { ...(node.data ?? {}), expression }; this.setGraph(graph);
  }
  private validateGrinExpressionField(input: HTMLInputElement): boolean {
    const node = this.value.nodes.find((candidate) => candidate.id === this.selectedOpticsId); let valid = node?.type === TP_OPTICS_GRIN_MEDIUM;
    if (valid && node) try {
      const evaluate = compileGrinExpression(input.value); const n0 = dataNumber(node, 'baseIndex', 1.5); const width = dataNumber(node, 'width', 180); const height = dataNumber(node, 'height', 200);
      valid = [-width / 2, 0, width / 2].every((x) => [-height / 2, 0, height / 2].every((y) => { const index = evaluate({ x, y, n0 }); return Number.isFinite(index) && index > 0; }));
    } catch { valid = false; }
    input.setAttribute('aria-invalid', String(!valid)); return valid;
  }
  private updateControls(): void {
    const node = this.value.nodes.find((candidate) => candidate.id === this.selectedOpticsId); const focal = this.querySelector<HTMLInputElement>('[data-optics-parameter="focalLength"]'); const height = this.querySelector<HTMLInputElement>('[data-optics-parameter="height"]');
    if (focal) { const enabled = node?.type === TP_OPTICS_CONVERGING_LENS || node?.type === TP_OPTICS_DIVERGING_LENS; focal.disabled = !enabled; focal.closest<HTMLElement>('.tp-optics-parameter')?.toggleAttribute('hidden', !enabled); focal.value = enabled && node ? String(dataNumber(node, 'focalLength', 100)) : ''; }
    if (height) { const enabled = node?.type === TP_OPTICS_SOURCE; height.disabled = !enabled; height.closest<HTMLElement>('.tp-optics-parameter')?.toggleAttribute('hidden', !enabled); height.value = enabled && node ? String(dataNumber(node, 'height', 60)) : ''; }
    const direction = this.querySelector<HTMLSelectElement>('[data-optics-object-direction]'); const directionEnabled = node?.type === TP_OPTICS_SOURCE;
    if (direction) { direction.disabled = !directionEnabled; direction.closest<HTMLElement>('.tp-optics-parameter')?.toggleAttribute('hidden', !directionEnabled); direction.value = directionEnabled && node ? objectDirection(node) : 'up'; }
    for (const key of ['rayCount', 'openingAngle', 'orientationAngle'] as const) {
      const input = this.querySelector<HTMLInputElement>(`[data-optics-parameter="${key}"]`); const enabled = node?.type === TP_OPTICS_POINT_SOURCE;
      const fallback = key === 'rayCount' ? 3 : key === 'openingAngle' ? 60 : 0;
      if (input) { input.disabled = !enabled; input.closest<HTMLElement>('.tp-optics-parameter')?.toggleAttribute('hidden', !enabled); input.value = enabled && node ? String(dataNumber(node, key, fallback)) : ''; }
    }
    for (const key of ['refractiveIndex', 'width', 'leftIndex', 'rightIndex'] as const) {
      const input = this.querySelector<HTMLInputElement>(`[data-optics-parameter="${key}"]`);
      const enabled = key === 'refractiveIndex' ? node?.type === TP_OPTICS_MEDIUM || (node !== undefined && isSphericalLens(node)) : key === 'width' ? node?.type === TP_OPTICS_MEDIUM || node?.type === TP_OPTICS_GRIN_MEDIUM : node?.type === TP_OPTICS_PLANE_INTERFACE || (node !== undefined && isCurvedInterface(node));
      const fallback = key === 'width' ? 160 : key === 'leftIndex' ? 1 : 1.5;
      if (input) { input.disabled = !enabled; input.closest<HTMLElement>('.tp-optics-parameter')?.toggleAttribute('hidden', !enabled); input.value = enabled && node ? String(dataNumber(node, key, fallback)) : ''; }
    }
    for (const key of ['thickness', 'radius1', 'radius2'] as const) {
      const input = this.querySelector<HTMLInputElement>(`[data-optics-parameter="${key}"]`); const enabled = node !== undefined && isSphericalLens(node); const fallback = key === 'thickness' ? 100 : key === 'radius1' ? 100 : -100;
      if (input) { input.disabled = !enabled; input.closest<HTMLElement>('.tp-optics-parameter')?.toggleAttribute('hidden', !enabled); input.value = enabled && node ? String(dataNumber(node, key, fallback)) : ''; if (key === 'thickness') input.min = enabled && node ? String(minimumSphericalLensThickness(node)) : '1'; }
    }
    const grinEnabled = node?.type === TP_OPTICS_GRIN_MEDIUM; const profile = this.querySelector<HTMLSelectElement>('[data-optics-grin-profile]'); const expression = this.querySelector<HTMLInputElement>('[data-optics-grin-expression]');
    if (profile) { profile.disabled = !grinEnabled; profile.closest<HTMLElement>('.tp-optics-parameter')?.toggleAttribute('hidden', !grinEnabled); profile.value = grinEnabled && node ? grinProfile(node) : 'parabolic'; }
    for (const key of ['baseIndex', 'gradient', 'coefficient', 'integrationStep'] as const) {
      const input = this.querySelector<HTMLInputElement>(`[data-optics-parameter="${key}"]`); const visible = grinEnabled && (key === 'baseIndex' || key === 'integrationStep' || (key === 'gradient' && (profile?.value === 'linear' || profile?.value === 'radial')) || (key === 'coefficient' && profile?.value === 'parabolic')); const fallback = key === 'baseIndex' ? 1.5 : key === 'gradient' ? -0.001 : key === 'coefficient' ? 0.00002 : 2;
      if (input) { input.disabled = !visible; input.closest<HTMLElement>('.tp-optics-parameter')?.toggleAttribute('hidden', !visible); input.value = visible && node ? String(dataNumber(node, key, fallback)) : ''; }
    }
    const expressionVisible = grinEnabled && profile?.value === 'custom'; if (expression) { expression.disabled = !expressionVisible; expression.closest<HTMLElement>('.tp-optics-parameter')?.toggleAttribute('hidden', !expressionVisible); expression.value = expressionVisible && node && typeof node.data?.expression === 'string' ? node.data.expression : 'n0 - 0.00002*y^2'; if (expressionVisible) this.validateGrinExpressionField(expression); else expression.removeAttribute('aria-invalid'); }
    const radius = this.querySelector<HTMLInputElement>('[data-optics-parameter="radius"]'); const curvature = this.querySelector<HTMLSelectElement>('[data-optics-curvature]'); const mirrorShape = this.querySelector<HTMLSelectElement>('[data-optics-mirror-shape]'); const radiusEnabled = (node !== undefined && isCurvedInterface(node)) || (node !== undefined && isOpticsMirror(node) && node.data?.shape !== 'plane');
    if (radius) { radius.disabled = !radiusEnabled; radius.closest<HTMLElement>('.tp-optics-parameter')?.toggleAttribute('hidden', !radiusEnabled); radius.value = radiusEnabled && node ? String(Math.abs(curvedInterfaceRadius(node))) : ''; }
    const curvatureEnabled = node !== undefined && isCurvedInterface(node);
    if (curvature) { curvature.disabled = !curvatureEnabled; curvature.closest<HTMLElement>('.tp-optics-parameter')?.toggleAttribute('hidden', !curvatureEnabled); curvature.value = curvatureEnabled && node && curvedInterfaceRadius(node) < 0 ? 'concave' : 'convex'; }
    const mirrorEnabled = node !== undefined && isOpticsMirror(node);
    if (mirrorShape) { mirrorShape.disabled = !mirrorEnabled; mirrorShape.closest<HTMLElement>('.tp-optics-parameter')?.toggleAttribute('hidden', !mirrorEnabled); mirrorShape.value = mirrorEnabled && node && typeof node.data?.shape === 'string' ? node.data.shape : 'plane'; }
  }
  private opticalColorIndex(element: Readonly<TpGraphNode>): number {
    const sameType = this.value.nodes.filter((node) => node.type === element.type);
    return Math.max(0, sameType.findIndex((node) => node.id === element.id)) % 5;
  }
  private traceRayPoints(initialHeight: number, angle: number, result: TpOpticsAnalysis, direction = 1): TpGraphPoint[] {
    const graph = this.value; const source = graph.nodes.find((node) => node.id === result.sourceId) as TpGraphNode; const screen = graph.nodes.find((node) => node.id === result.screenId);
    const endX = direction > 0 ? screen?.x ?? 1000 : 0;
    const between = (x: number): boolean => direction > 0 ? x > source.x && x < endX : x < source.x && x > endX;
    const lenses = graph.nodes.filter((node) => node.type === TP_OPTICS_CONVERGING_LENS || node.type === TP_OPTICS_DIVERGING_LENS).filter((node) => Math.abs(node.y - result.axisY) < 0.5 && between(node.x)).sort((a, b) => (a.x - b.x) * direction);
    const interfaces = opticalInterfaces(graph).filter((face) => between(face.x));
    const curved = [...graph.nodes.filter((node) => isCurvedInterface(node) && between(node.x)), ...graph.nodes.filter((node) => isSphericalLens(node) && Math.abs(node.y - result.axisY) < 0.5).flatMap(sphericalLensSurfaces).filter((node) => between(node.x))];
    const mirrors = graph.nodes.filter((node) => isOpticsMirror(node) && between(node.x));
    const grinMedia = graph.nodes.filter((node) => node.type === TP_OPTICS_GRIN_MEDIUM && between(node.x - direction * dataNumber(node, 'width', 180) / 2));
    const elements = [...lenses.map((lens) => ({ x: lens.x, lens, face: null as TpOpticsInterface | null, curved: null as TpGraphNode | null, mirror: null as TpGraphNode | null, grin: null as TpGraphNode | null })),
      ...interfaces.map((face) => ({ x: face.x, lens: null as TpGraphNode | null, face, curved: null as TpGraphNode | null, mirror: null as TpGraphNode | null, grin: null as TpGraphNode | null })),
      ...curved.map((node) => ({ x: node.x, lens: null as TpGraphNode | null, face: null as TpOpticsInterface | null, curved: node, mirror: null as TpGraphNode | null, grin: null as TpGraphNode | null })),
      ...mirrors.map((node) => ({ x: node.x, lens: null as TpGraphNode | null, face: null as TpOpticsInterface | null, curved: null as TpGraphNode | null, mirror: node, grin: null as TpGraphNode | null })),
      ...grinMedia.map((node) => ({ x: node.x - direction * dataNumber(node, 'width', 180) / 2, lens: null as TpGraphNode | null, face: null as TpOpticsInterface | null, curved: null as TpGraphNode | null, mirror: null as TpGraphNode | null, grin: node }))].sort((a, b) => (a.x - b.x) * direction);
    let x = source.x; let height = initialHeight; const points: TpGraphPoint[] = [{ x, y: result.axisY - height }];
    for (const element of elements) {
      if (element.grin) {
        height += (element.x - x) * angle; x = element.x; points.push({ x, y: result.axisY - height }); const halfHeight = dataNumber(element.grin, 'height', 200) / 2;
        if (Math.abs(result.axisY - height - element.grin.y) > halfHeight) { x = element.grin.x + direction * dataNumber(element.grin, 'width', 180) / 2; height += (x - element.x) * angle; points.push({ x, y: result.axisY - height }); continue; }
        const trace = integrateGrinRay(element.grin, { x, y: result.axisY - height }, angle, direction); points.push(...trace.points.slice(1)); const last = trace.points.at(-1) as TpGraphPoint; x = last.x; height = result.axisY - last.y; angle = trace.slope; if (!trace.complete) return points; continue;
      }
      if (element.mirror) {
        const shape = element.mirror.data?.shape ?? 'plane'; let reflectedDirection = -direction; let reflectedSlope = -angle;
        if (shape === 'plane') {
          height += (element.x - x) * angle; x = element.x;
          if (Math.abs(result.axisY - height - element.mirror.y) > dataNumber(element.mirror, 'height', 240) / 2) continue;
          points.push({ x, y: result.axisY - height });
        } else {
          const reflection = curvedReflection(element.mirror, { x, y: result.axisY - height }, angle, direction);
          if (!reflection) continue;
          x = reflection.point.x; height = result.axisY - reflection.point.y; reflectedDirection = reflection.direction; reflectedSlope = reflection.slope; points.push(reflection.point);
        }
        const reflectedEnd = reflectedDirection > 0 ? screen?.x ?? 1000 : 0;
        height += (reflectedEnd - x) * reflectedSlope; points.push({ x: reflectedEnd, y: result.axisY - height });
        return points;
      }
      if (element.curved) {
        const refraction = curvedRefraction(element.curved, { x, y: result.axisY - height }, angle, direction);
        if (refraction) { x = refraction.point.x; height = result.axisY - refraction.point.y; angle = refraction.slope; points.push(refraction.point); }
        continue;
      }
      height += (element.x - x) * angle; x = element.x; points.push({ x, y: result.axisY - height });
      if (element.lens && Math.abs(height) <= opticalLensHalfHeight(graph, element.lens)) angle -= direction * height / dataNumber(element.lens, 'focalLength', 100);
      if (element.face && Math.abs(result.axisY - height - element.face.y) <= element.face.halfHeight) {
        const n1 = direction > 0 ? element.face.n1 : element.face.n2; const n2 = direction > 0 ? element.face.n2 : element.face.n1;
        const sine = n1 * Math.sin(Math.atan(angle)) / n2;
        if (Math.abs(sine) > 1) break;
        angle = Math.tan(Math.asin(sine));
      }
    }
    if ((direction > 0 && x < endX) || (direction < 0 && x > endX)) { height += (endX - x) * angle; points.push({ x: endX, y: result.axisY - height }); }
    return points;
  }
  private mountOpticsOverlay(group: SVGGElement, sourceId: string): void {
    const nodesLayer = this.querySelector('.tp-graph-nodes'); nodesLayer?.after(group);
    const sourceElement = this.querySelector<SVGGElement>(`[data-node-id="${CSS.escape(sourceId)}"]`);
    if (sourceElement && group.parentNode) group.after(sourceElement);
  }
  private renderOverlay(): void {
    let result: TpOpticsAnalysis; try { result = this.analyze(); } catch { return; } const graph = this.value; const source = graph.nodes.find((node) => node.id === result.sourceId) as TpGraphNode; const screen = graph.nodes.find((node) => node.id === result.screenId);
    const endX = screen?.x ?? 1000;
    const lenses = graph.nodes.filter((node) => node.type.includes('lens')).filter((node) => Math.abs(node.y - result.axisY) < 0.5);
    const pointSource = source.type === TP_OPTICS_POINT_SOURCE;
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g'); group.setAttribute('class', 'tp-optics-overlay');
    const axis = graduatedAxis(0, 1000, result.axisY);
    if (!pointSource && lenses.length === 0 && opticalInterfaces(graph).length === 0 && !graph.nodes.some((node) => isCurvedInterface(node) || isOpticsMirror(node) || node.type === TP_OPTICS_GRIN_MEDIUM)) { group.innerHTML = axis; this.mountOpticsOverlay(group, source.id); return; }
    const objectHeight = Math.max(10, Math.abs(dataNumber(source, 'height', 60))); const height = pointSource ? result.axisY - source.y : objectDirection(source) === 'up' ? objectHeight : -objectHeight; const firstLens = lenses.filter((node) => node.x > source.x && node.x < endX).sort((a, b) => a.x - b.x)[0];
    const lensDistance = firstLens ? firstLens.x - source.x : 1;
    const focalLength = firstLens ? opticalFocalLength(firstLens) : 100;
    const focalRayDistance = lensDistance - focalLength;
    const rayCount = Math.round(dataNumber(source, 'rayCount', 3)); const opening = dataNumber(source, 'openingAngle', 60) * Math.PI / 180; const orientation = dataNumber(source, 'orientationAngle', 0) * Math.PI / 180;
    const emissionAngles = pointSource ? Array.from({ length: rayCount }, (_value, index) => {
      if (rayCount === 1) return orientation;
      return opening >= Math.PI * 2 ? orientation - Math.PI + index * Math.PI * 2 / rayCount : orientation - opening / 2 + index * opening / (rayCount - 1);
    }) : [];
    const focalRayAngle = !firstLens ? -0.1
      : focalLength > 0 && focalRayDistance <= 0 ? -height / (lensDistance + focalLength)
      : Math.abs(focalRayDistance) > 0.001 ? -height / focalRayDistance
      : -height / (lensDistance + Math.abs(focalLength));
    const objectAngles = [0, firstLens ? -height / lensDistance : 0.1, focalRayAngle];
    const rayPoints = pointSource ? emissionAngles.map((angle) => Math.abs(Math.cos(angle)) < 1e-6
      ? [{ x: source.x, y: source.y }, { x: source.x, y: Math.sin(angle) > 0 ? 0 : result.axisY * 2 }]
      : this.traceRayPoints(height, Math.tan(angle), result, Math.sign(Math.cos(angle))))
      : objectAngles.map((angle) => this.traceRayPoints(height, angle, result));
    const activeLenses = lenses.filter((node) => node.x > source.x && node.x < endX).sort((a, b) => a.x - b.x);
    const rayGradients = rayPoints.map((_points, rayIndex) => {
      const stops: string[] = [];
      if (activeLenses.length === 0) stops.push('<stop class="tp-optics-color-0" offset="0"/><stop class="tp-optics-color-0" offset="100%"/>');
      for (const [index, lens] of activeLenses.entries()) {
        const color = this.opticalColorIndex(lens);
        if (index === 0) stops.push(`<stop class="tp-optics-color-${color}" offset="0"/>`);
        else {
          const previousColor = this.opticalColorIndex(activeLenses[index - 1] as TpGraphNode);
          const offset = `${((lens.x - source.x) / (endX - source.x)) * 100}%`;
          stops.push(`<stop class="tp-optics-color-${previousColor}" offset="${offset}"/><stop class="tp-optics-color-${color}" offset="${offset}"/>`);
        }
        if (index === activeLenses.length - 1) stops.push(`<stop class="tp-optics-color-${color}" offset="100%"/>`);
      }
      return `<linearGradient id="tp-optics-ray-gradient-${this.opticsInstanceId}-${rayIndex}" gradientUnits="userSpaceOnUse" x1="${source.x}" x2="${endX}">${stops.join('')}</linearGradient>`;
    }).join('');
    const rays = rayPoints.map((points, index) => `<polyline class="tp-optics-ray tp-optics-ray-${index + 1}" style="stroke:url(#tp-optics-ray-gradient-${this.opticsInstanceId}-${index})" points="${points.map((point) => `${point.x},${point.y}`).join(' ')}"/>`).join('');
    const foci = lenses.map((node) => { const f = Math.abs(opticalFocalLength(node)); const color = this.opticalColorIndex(node); return `<circle class="tp-optics-focus tp-optics-color-${color}" cx="${node.x - f}" cy="${result.axisY}" r="3"/><circle class="tp-optics-focus tp-optics-color-${color}" cx="${node.x + f}" cy="${result.axisY}" r="3"/>`; }).join('');
    const emergentSegments = rayPoints.map((points): [TpGraphPoint, TpGraphPoint] | null => points.length > 2 ? [points.at(-2) as TpGraphPoint, points.at(-1) as TpGraphPoint] : null).filter((segment): segment is [TpGraphPoint, TpGraphPoint] => segment !== null);
    const intersections: TpGraphPoint[] = [];
    if (result.imageKind !== 'afocal' && lenses.some(isSphericalLens)) for (let first = 0; first < emergentSegments.length; first += 1) for (let second = first + 1; second < emergentSegments.length; second += 1) {
      const intersection = lineIntersection(emergentSegments[first] as [TpGraphPoint, TpGraphPoint], emergentSegments[second] as [TpGraphPoint, TpGraphPoint]);
      if (intersection && intersection.x > -1500 && intersection.x < 2250 && intersection.y > -1000 && intersection.y < 1500) intersections.push(intersection);
    }
    const rayIntersections = intersections.map((point) => `<circle class="tp-optics-ray-intersection" cx="${point.x}" cy="${point.y}" r="4"/>`).join('');
    const intersectionSpread = intersections.length < 2 ? '' : (() => {
      const xs = intersections.map((point) => point.x); const ys = intersections.map((point) => point.y); const minX = Math.min(...xs); const maxX = Math.max(...xs); const minY = Math.min(...ys); const maxY = Math.max(...ys);
      return `<ellipse class="tp-optics-image-spread" cx="${(minX + maxX) / 2}" cy="${(minY + maxY) / 2}" rx="${Math.max(6, (maxX - minX) / 2 + 4)}" ry="${Math.max(6, (maxY - minY) / 2 + 4)}"/>`;
    })();
    const imageHeight = result.magnification === null ? null : height * result.magnification;
    const lastLens = lenses.filter((node) => node.x > source.x && node.x < endX).sort((a, b) => a.x - b.x).at(-1);
    const extensionX = intersections.length > 0 ? Math.min(...intersections.map((point) => point.x), result.imageX ?? Number.POSITIVE_INFINITY) : result.imageX;
    const virtualExtensions = result.imageKind !== 'virtual' || extensionX === null || !lastLens ? '' : emergentSegments.map(([from, to]) => {
      const deltaX = to.x - from.x; if (Math.abs(deltaX) < 1e-9) return '';
      const extensionY = from.y + (extensionX - from.x) * (to.y - from.y) / deltaX;
      return `<line class="tp-optics-virtual-ray tp-optics-image-extension tp-optics-color-${this.opticalColorIndex(lastLens)}" x1="${extensionX}" y1="${extensionY}" x2="${from.x}" y2="${from.y}"/>`;
    }).join('');
    const image = result.imageX === null || imageHeight === null ? '' : pointSource
      ? `<circle class="tp-optics-image tp-optics-point-image" cx="${result.imageX}" cy="${result.axisY - imageHeight}" r="6"/><text class="tp-optics-image-label" x="${result.imageX}" y="${result.axisY - imageHeight - 12}" text-anchor="middle">Paraxial image</text>`
      : `<path class="tp-optics-image" d="M${result.imageX} ${result.axisY}V${result.axisY - imageHeight}M${result.imageX - 7} ${result.axisY - imageHeight + Math.sign(imageHeight) * 10}L${result.imageX} ${result.axisY - imageHeight}L${result.imageX + 7} ${result.axisY - imageHeight + Math.sign(imageHeight) * 10}"/><text class="tp-optics-image-label" x="${result.imageX}" y="${result.axisY - imageHeight + (imageHeight < 0 ? 18 : -10)}" text-anchor="middle">Paraxial image</text>`;
    group.innerHTML = `${axis}<defs>${rayGradients}</defs>${foci}${virtualExtensions}${rays}${intersectionSpread}${rayIntersections}${image}`; this.mountOpticsOverlay(group, source.id);
  }
}
if (!customElements.get('tp-graph-geometric-optics')) customElements.define('tp-graph-geometric-optics', TpGraphGeometricOptics);
