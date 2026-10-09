/**
 * @module components/game-life
 * @summary Conway's Game of Life component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
/**
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
// tp-docgen:dependencies:end

import {
  executeProgram,
  expandProgram,
  parseProgram,
  renderGameLifeSvg,
  stepGrid,
  toGameLifeSvgDataUrl,
  type GameLifeGrid,
  type GameLifeSvgOptions,
} from '@tp/tp-utilities/game-life';
import { TpBase } from '../base/base.js';
import '../button/button.js';
import '../button-group/button-group.js';
import style from './game-life.css?inline';
import { dedent } from '../../utilities/code.js';

type PresetName = 'glider' | 'blinker' | 'toad' | 'beacon' | 'gosper-gun';

type PresetDef = {
  width: number;
  height: number;
  x: number;
  y: number;
  rows: string[];
};

const PRESETS: Record<PresetName, PresetDef> = {
  glider: { width: 20, height: 12, x: 1, y: 1, rows: ['.*.', '..*', '***'] },
  blinker: { width: 15, height: 9, x: 6, y: 4, rows: ['***'] },
  toad: { width: 18, height: 10, x: 6, y: 4, rows: ['.***', '***.'] },
  beacon: { width: 18, height: 10, x: 6, y: 3, rows: ['**..', '**..', '..**', '..**'] },
  'gosper-gun': {
    width: 90,
    height: 40,
    x: 1,
    y: 1,
    rows: [
      '........................*...........',
      '......................*.*...........',
      '............**......**............**',
      '...........*...*....**............**',
      '**........*.....*...**..............',
      '**........*...*.**....*.*...........',
      '..........*.....*.......*...........',
      '...........*...*....................',
      '............**......................',
    ],
  },
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**
 * @summary Conway's Game of Life component.
 * @tagname tp-game-life
 * @example
 * <tp-game-life></tp-game-life>
 */
export class TpGameLife extends TpBase {
  private static readonly gameLifeStyleId = 'tp-game-life-styles';
  private currentGrid: GameLifeGrid | null = null;
  private renderToken = 0;
  private autoplayTimer: number | null = null;

  public static get observedAttributes(): string[] {
    return [
      'cell-size',
      'padding',
      'background',
      'alive-color',
      'dead-color',
      'grid-color',
      'grid-stroke-width',
      'cell-radius',
      'steps',
      'interval',
      'label',
      'wrap',
      'autoplay',
      'preset',
      'preset-x',
      'preset-y',
      'preset-width',
      'preset-height',
    ];
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.ensureGlobalStyle(TpGameLife.gameLifeStyleId, style);
    void this.render();
  }

  public disconnectedCallback(): void {
    this.stopAutoplay();
  }

  protected attributeChangedCallback(): void {
    if (!this.isConnected) return;
    void this.render();
  }

  private hasBoolAttr(name: string): boolean {
    return this.hasAttribute(name);
  }

  private readIntAttr(name: string, fallback: number): number {
    const raw = this.getAttribute(name);
    if (raw === null || raw.trim() === '') return fallback;
    const n = Number(raw);
    if (!Number.isFinite(n) || !Number.isInteger(n)) return fallback;
    return n;
  }

  private readPositiveIntAttr(name: string, fallback: number): number {
    const n = this.readIntAttr(name, fallback);
    return n > 0 ? n : fallback;
  }

  private readNumberAttr(name: string, fallback: number): number {
    const raw = this.getAttribute(name);
    if (raw === null || raw.trim() === '') return fallback;
    const n = Number(raw);
    if (!Number.isFinite(n)) return fallback;
    return n;
  }

  private readStringAttr(name: string, fallback = ''): string {
    return this.getAttribute(name) ?? fallback;
  }

  private getPresetName(): PresetName | null {
    const raw = this.getAttribute('preset');
    if (!raw) return null;
    const v = raw.trim().toLowerCase();
    if (v === 'glider' || v === 'blinker' || v === 'toad' || v === 'beacon' || v === 'gosper-gun') {
      return v;
    }
    return null;
  }

  private buildPresetProgram(): string {
    const presetName = this.getPresetName();
    if (!presetName) {
      throw new Error(`Unknown or missing preset. Expected one of: ${Object.keys(PRESETS).join(', ')}`);
    }

    const def = PRESETS[presetName];
    const width = this.readPositiveIntAttr('preset-width', def.width);
    const height = this.readPositiveIntAttr('preset-height', def.height);
    const x = this.readIntAttr('preset-x', def.x);
    const y = this.readIntAttr('preset-y', def.y);
    const rows = def.rows.map((r) => `      ${r}`).join('\n');

    return [`grid width=${width} height=${height}`, `pattern(${x},${y}) {`, rows, '}'].join('\n');
  }

  private async readProgramSource(): Promise<string> {
    const script = this.querySelector('script[type="tp/game-life"]');
    if (script?.textContent && script.textContent.trim() !== '') {
      return dedent(script.textContent);
    }

    const presetName = this.getPresetName();
    if (presetName) return this.buildPresetProgram();

    throw new Error(
      'Missing program source. Provide <script type="tp/game-life">...</script> or a valid preset attribute.',
    );
  }

  private readSvgOptions(): GameLifeSvgOptions {
    const gridColor =
      this.getAttribute('grid-color') ??
      'color-mix(in srgb, currentColor 24%, transparent)';

    return {
      cellSize: Math.max(1, this.readNumberAttr('cell-size', 16)),
      padding: Math.max(0, this.readNumberAttr('padding', 0)),
      background: this.getAttribute('background') ?? undefined,
      aliveColor: this.getAttribute('alive-color') ?? undefined,
      deadColor: this.getAttribute('dead-color') ?? undefined,
      gridColor,
      gridStrokeWidth: Math.max(0.1, this.readNumberAttr('grid-stroke-width', 1)),
      cellRadius: Math.max(0, this.readNumberAttr('cell-radius', 0)),
      includeXmlHeader: false,
    };
  }

  private renderWithToolbar(): void {
    if (!this.currentGrid) return;

    const label = this.readStringAttr('label', '').trim();
    const svgOptions = this.readSvgOptions();
    const svg = renderGameLifeSvg(this.currentGrid, svgOptions);
    const dataUrl = toGameLifeSvgDataUrl(this.currentGrid, svgOptions);
    const playLabel = this.autoplayTimer === null ? 'Play' : 'Pause';

    this.innerHTML = `
      <div class="tp-game-life-container">
        ${label ? `<div class="tp-game-life-label">${escapeHtml(label)}</div>` : ''}
        <div class="tp-game-life-toolbar">
          <span class="tp-game-life-title">Game of life</span>
          <tp-button-group attached>
            <tp-button data-action="step" variant="neutral" size="s">Step</tp-button>
            <tp-button data-action="play" variant="brand" size="s">${playLabel}</tp-button>
            <tp-button data-action="reset" variant="neutral" outlined size="s">Reset</tp-button>
            <tp-button
              data-action="download"
              href="${escapeHtml(dataUrl)}"
              download="game-life.svg"
              variant="info"
              outlined
              size="s"
            >
              Download SVG
            </tp-button>
          </tp-button-group>
        </div>
        <div data-role="svg" class="tp-game-life-svg">${svg}</div>
      </div>
    `;

    this.querySelector<HTMLElement>('tp-button[data-action="step"]')?.addEventListener('click', () => {
      this.stepOnce();
    });

    this.querySelector<HTMLElement>('tp-button[data-action="play"]')?.addEventListener('click', () => {
      if (this.autoplayTimer === null) this.startAutoplay();
      else this.stopAutoplay();
      this.renderWithToolbar();
    });

    this.querySelector<HTMLElement>('tp-button[data-action="reset"]')?.addEventListener('click', () => {
      void this.render();
    });
  }

  private stepOnce(): void {
    if (!this.currentGrid) return;
    this.currentGrid = stepGrid(this.currentGrid, { wrap: this.hasBoolAttr('wrap') });
    this.renderWithToolbar();
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    const interval = Math.max(16, this.readIntAttr('interval', 250));
    this.autoplayTimer = window.setInterval(() => this.stepOnce(), interval);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer !== null) {
      window.clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  private async render(): Promise<void> {
    const token = ++this.renderToken;

    try {
      const source = await this.readProgramSource();
      if (token !== this.renderToken) return;

      const lines = parseProgram(expandProgram(source));
      if (token !== this.renderToken) return;

      const initial = executeProgram(lines);
      const wrap = this.hasBoolAttr('wrap');
      const steps = this.readIntAttr('steps', 0);

      let grid = initial;
      for (let i = 0; i < steps; i += 1) {
        grid = stepGrid(grid, { wrap });
      }

      this.currentGrid = grid;
      this.renderWithToolbar();
      if (token !== this.renderToken) return;

      if (this.hasBoolAttr('autoplay')) this.startAutoplay();
      else this.stopAutoplay();
      this.renderWithToolbar();
    } catch (error) {
      this.stopAutoplay();
      const message = error instanceof Error ? error.message : String(error);
      this.currentGrid = null;
      this.innerHTML = `<pre class="tp-game-life-error">tp-game-life error: ${escapeHtml(message)}</pre>`;
    }
  }
}

if (!customElements.get('tp-game-life')) {
  customElements.define('tp-game-life', TpGameLife);
}

declare global {
  interface HTMLElementTagNameMap {
    'tp-game-life': TpGameLife;
  }
}
