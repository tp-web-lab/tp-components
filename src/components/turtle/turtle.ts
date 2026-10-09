/**
 * @module components/turtle
 * @summary Turtle DSL rendering component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
// tp-docgen:dependencies:end

import { Turtle, executeProgram, expandProgram, parseProgram, type TurtleProgramLine } from '@tp/tp-utilities/turtle';
import { TpBase } from '../base/base.js';
import style from './turtle.css?inline';
import { TpDeclarativeTextSource } from '../../utilities/declarative-text-source.js';

const TURTLE_STYLE_ID = 'tp-turtle-styles';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**
 * @summary Turtle DSL rendering component.
 * @tagname tp-turtle
 * @example
 * <tp-turtle></tp-turtle>
 */
export class TpTurtle extends TpBase {
  private abortController: AbortController | null = null;
  private lastExpanded = '';
  private lastWidth = 900;
  private lastHeight = 420;
  private lastBackground = 'transparent';
  private renderToken = 0;
  private replayTimer: number | null = null;
  private readonly source = new TpDeclarativeTextSource(this, {
    scriptTypes: ['tp/turtle'],
  });

  public static get observedAttributes(): string[] {
    return ['src', 'width', 'height', 'background', 'label', 'save-label', 'replay-label', 'download-name'];
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.classList.add('tp-turtle');
    this.ensureGlobalStyle(TURTLE_STYLE_ID, style);
    this.source.observe(() => { void this.render(); });
    void this.render();
  }

  public disconnectedCallback(): void {
    this.abortController?.abort();
    this.stopReplay();
    this.source.disconnect();
  }

  protected attributeChangedCallback(): void {
    if (!this.isConnected) return;
    void this.render();
  }

  private async render(): Promise<void> {
    const token = ++this.renderToken;
    this.stopReplay();

    try {
      const width = this.readNumberAttr('width', 900);
      const height = this.readNumberAttr('height', 420);
      const background = this.getAttribute('background') ?? 'transparent';

      const source = await this.readProgramSource();
      if (token !== this.renderToken) return;

      const expanded = expandProgram(source);
      const lines = parseProgram(expanded);
      if (token !== this.renderToken) return;

      this.lastExpanded = expanded;
      this.lastWidth = width;
      this.lastHeight = height;
      this.lastBackground = background;

      const svg = this.renderSvgFromLines(lines);
      if (token !== this.renderToken) return;

      this.renderWithToolbar(svg);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.innerHTML = `<pre class="tp-turtle-error" role="alert"><code>${escapeHtml(message)}</code></pre>`;
    }
  }

  private renderWithToolbar(svgMarkup: string): void {
    const label = this.getAttribute('label')?.trim() ?? '';
    const hasCaption = label !== '';

    this.innerHTML = `
      <div class="tp-turtle-toolbar">
        <button type="button" data-action="replay">${escapeHtml(this.getReplayLabel())}</button>
        <button type="button" data-action="save-svg">${escapeHtml(this.getSaveLabel())}</button>
      </div>
      <figure class="tp-turtle-figure">
        <div class="tp-turtle-viewport" data-role="svg-host">${svgMarkup}</div>
        ${hasCaption ? `<figcaption>${escapeHtml(label)}</figcaption>` : ''}
      </figure>
    `;

    this.ensureResponsiveSvg();

    this.querySelector<HTMLButtonElement>('button[data-action="replay"]')
      ?.addEventListener('click', () => this.replayCurrentProgram());

    this.querySelector<HTMLButtonElement>('button[data-action="save-svg"]')
      ?.addEventListener('click', () => this.downloadCurrentSvg());
  }

  private replayCurrentProgram(): void {
    this.stopReplay();

    const all = parseProgram(this.lastExpanded);
    if (all.length === 0) return;

    const host = this.querySelector<HTMLElement>('[data-role="svg-host"]');
    if (host === null) return;

    const isDraw = (c: TurtleProgramLine): boolean => c.cmd === 'forward' || c.cmd === 'goto';
    const clampSpeed = (v: number | undefined): number => {
      if (!Number.isFinite(v)) return 6;
      return Math.max(1, Math.min(10, Number(v)));
    };
    const dist = (x1: number, y1: number, x2: number, y2: number): number => Math.hypot(x2 - x1, y2 - y1);
    const degToRad = (d: number): number => (d * Math.PI) / 180;

    const buildPartialLines = (budget: number): TurtleProgramLine[] => {
      const out: TurtleProgramLine[] = [];
      let remaining = budget;
      let speed = 6;
      let x = 0;
      let y = 0;
      let heading = 0;

      for (const cmd of all) {
        if (!isDraw(cmd)) {
          out.push(cmd);
          if (cmd.cmd === 'turtle') {
            x = cmd.x ?? 0;
            y = cmd.y ?? 0;
            heading = cmd.heading ?? 0;
            speed = clampSpeed(cmd.speed);
          } else if (cmd.cmd === 'style' && cmd.speed !== undefined) {
            speed = clampSpeed(cmd.speed);
          } else if (cmd.cmd === 'left') {
            heading -= cmd.value;
          } else if (cmd.cmd === 'right') {
            heading += cmd.value;
          }
          continue;
        }

        const speedWeight = 11 - speed;

        if (cmd.cmd === 'forward') {
          const r = degToRad(heading);
          const x2 = x + Math.cos(r) * cmd.value;
          const y2 = y + Math.sin(r) * cmd.value;
          const len = Math.max(0.001, dist(x, y, x2, y2));
          const cost = len * speedWeight;

          if (remaining >= cost) {
            out.push(cmd);
            remaining -= cost;
            x = x2;
            y = y2;
          } else {
            out.push({ ...cmd, value: cmd.value * Math.max(0, Math.min(1, remaining / cost)) });
            return out;
          }
        } else if (cmd.cmd === 'goto') {
          const len = Math.max(0.001, dist(x, y, cmd.x, cmd.y));
          const cost = len * speedWeight;

          if (remaining >= cost) {
            out.push(cmd);
            remaining -= cost;
            x = cmd.x;
            y = cmd.y;
          } else {
            const t = Math.max(0, Math.min(1, remaining / cost));
            out.push({ ...cmd, x: x + (cmd.x - x) * t, y: y + (cmd.y - y) * t });
            return out;
          }
        }
      }

      return out;
    };

    const totalCost = (() => {
      let sum = 0;
      let speed = 6;
      let x = 0;
      let y = 0;
      let heading = 0;

      for (const cmd of all) {
        if (cmd.cmd === 'turtle') {
          x = cmd.x ?? 0;
          y = cmd.y ?? 0;
          heading = cmd.heading ?? 0;
          speed = clampSpeed(cmd.speed);
          continue;
        }
        if (cmd.cmd === 'style' && cmd.speed !== undefined) {
          speed = clampSpeed(cmd.speed);
          continue;
        }
        if (cmd.cmd === 'left') {
          heading -= cmd.value;
          continue;
        }
        if (cmd.cmd === 'right') {
          heading += cmd.value;
          continue;
        }

        const speedWeight = 11 - speed;
        if (cmd.cmd === 'forward') {
          const r = degToRad(heading);
          const x2 = x + Math.cos(r) * cmd.value;
          const y2 = y + Math.sin(r) * cmd.value;
          sum += Math.max(0.001, dist(x, y, x2, y2)) * speedWeight;
          x = x2;
          y = y2;
        } else if (cmd.cmd === 'goto') {
          sum += Math.max(0.001, dist(x, y, cmd.x, cmd.y)) * speedWeight;
          x = cmd.x;
          y = cmd.y;
        }
      }
      return sum;
    })();

    if (totalCost <= 0) {
      host.innerHTML = this.renderSvgFromLines(all);
      this.ensureResponsiveSvg();
      return;
    }

    const targetMs = Math.min(30_000, Math.max(6_000, totalCost * 0.9));
    const start = performance.now();

    const frame = (): void => {
      const progress = Math.max(0, Math.min(1, (performance.now() - start) / targetMs));
      const partial = buildPartialLines(totalCost * progress);
      host.innerHTML = this.renderSvgFromLines(partial);
      this.ensureResponsiveSvg();

      if (progress >= 1) {
        this.stopReplay();
        return;
      }

      this.replayTimer = window.setTimeout(frame, 16);
    };

    frame();
  }

  private downloadCurrentSvg(): void {
    this.stopReplay();

    const lines = parseProgram(this.lastExpanded);
    let svgText = this.renderSvgFromLines(lines);
    if (!svgText.startsWith('<?xml')) {
      svgText = `<?xml version="1.0" encoding="UTF-8"?>\n${svgText}`;
    }

    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.getDownloadName();
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  private stopReplay(): void {
    if (this.replayTimer !== null) {
      window.clearTimeout(this.replayTimer);
      this.replayTimer = null;
    }
  }

  private renderSvgFromLines(lines: TurtleProgramLine[]): string {
    executeProgram(lines, 'static');
    return Turtle.renderSceneSvg({
      width: this.lastWidth,
      height: this.lastHeight,
      background: this.lastBackground,
      padding: 20,
      linecap: 'round',
      linejoin: 'round',
    });
  }

  private ensureResponsiveSvg(): void {
    const svgElement = this.querySelector('svg');
    if (!(svgElement instanceof SVGElement)) return;
    svgElement.setAttribute('role', 'img');
    svgElement.setAttribute('aria-label', this.getAttribute('label')?.trim() || 'Turtle drawing');
    svgElement.style.display = 'block';
    svgElement.style.maxWidth = '100%';
    svgElement.style.height = 'auto';
  }

  private getSaveLabel(): string {
    return this.getAttribute('save-label')?.trim() || 'Save SVG';
  }

  private getReplayLabel(): string {
    return this.getAttribute('replay-label')?.trim() || 'Replay';
  }

  private getDownloadName(): string {
    const raw = this.getAttribute('download-name')?.trim() || 'turtle.svg';
    return raw.toLowerCase().endsWith('.svg') ? raw : `${raw}.svg`;
  }

  private readProgramSource(): Promise<string> {
    const src = this.getAttribute('src') ?? '';
    if (src.trim() !== '') {
      this.abortController?.abort();
      this.abortController = new AbortController();
      return this.source.read({ signal: this.abortController.signal });
    }
    return this.source.read();
  }

  private readNumberAttr(name: string, fallback: number): number {
    const raw = this.getAttribute(name);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  }
}

if (!customElements.get('tp-turtle')) {
  customElements.define('tp-turtle', TpTurtle);
}
