/**
 * @module components/clock
 * @summary Live clock component with digital or analogic display and date tooltip.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-tooltip
 * @summary Displays anchored tooltip content.
 */
// tp-docgen:dependencies:end

import style from './clock.css?inline';

import '../tooltip/tooltip.js';

import { TpBase } from '../base/base.js';

/**
 * Checks whether a value is an SVG line element.
 *
 * @summary Narrows unknown values to SVG line elements.
 * @param value Value to test.
 * @returns `true` when the value is an SVG `<line>` element.
 */
function isSvgLineElement(value: unknown): value is SVGElement {
  return value instanceof SVGElement && value.tagName.toLowerCase() === 'line';
}

/**
 * Live clock component.
 *
 * The component renders local time and keeps itself updated every second.
 * The `type` attribute controls whether the display is `digital` or `analogic`.
 * The date is exposed through an attached `<tp-tooltip>`.
 *
 * @tagname tp-clock
 * @attr {string} type = "digital" - Display type (`digital` or `analogic`).
 * @attr {string} size = "1rem" - Clock size.
 * @cssprop --tp-clock-size Clock size.
 * @example
 * <tp-clock></tp-clock>
 */
export class TpClock extends TpBase {
  private static readonly styleId = 'tp-clock-styles';

  private tickTimer: number | null = null;
  private timeEl: HTMLTimeElement | null = null;
  private tooltipEl: HTMLElement | null = null;
  private digitalAnchorId = '';
  private analogicAnchorId = '';
  private hourHandEl: SVGLineElement | null = null;
  private minuteHandEl: SVGLineElement | null = null;
  private secondHandEl: SVGLineElement | null = null;

  /**
   * Returns the list of attributes observed by the component.
   *
   * @summary Returns the observed attributes.
  */
  public static get observedAttributes(): string[] {
    return ['type', 'size'];
  }

  /**
   * Returns the configured clock display type.
   *
   * @summary Returns the current clock display type.
   */
  public get type(): 'digital' | 'analogic' {
    return this.getStringAttribute('type', 'digital').toLowerCase() === 'analogic'
      ? 'analogic'
      : 'digital';
  }

  /**
   * Updates the configured clock display type.
   *
   * @summary Sets the clock display type.
   * @param value Display type to apply.
   */
  public set type(value: 'digital' | 'analogic') {
    this.setStringAttribute('type', value === 'analogic' ? 'analogic' : 'digital');
  }

  /**
   * Returns the configured component size.
   *
   * @summary Returns the configured size value.
   */
  public get size(): string {
    return this.getStringAttribute('size', '1rem');
  }

  /**
   * Updates the configured component size.
   *
   * @summary Sets the configured size value.
   * @param value Size value to apply.
   */
  public set size(value: string) {
    this.setStringAttribute('size', value.trim() === '' ? '1rem' : value);
  }

  /**
   * Initializes the clock when the element is connected.
   *
   * @summary Connects the clock component.
   * @internal
   */
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.ensureGlobalStyle(TpClock.styleId, style);
    this.ensureDom();
    this.startTicker();
    this.updateClock();
  }

  /**
   * Refreshes the clock after an observed attribute changes.
   *
   * @summary Handles observed attribute changes.
   * @internal
   */
  protected attributeChangedCallback(): void {
    if (!this.isConnected) {
      return;
    }

    this.updateClock();
  }

  /**
   * Stops the clock ticker when the element is disconnected.
   *
   * @summary Disconnects the clock component.
   * @internal
   */
  public disconnectedCallback(): void {
    this.stopTicker();
  }

  /**
   * Creates and caches the internal DOM structure for digital and analog views.
   *
   * @summary Ensures the internal clock DOM exists.
   */
  private ensureDom(): void {
    if (
      this.timeEl instanceof HTMLTimeElement &&
      this.tooltipEl instanceof HTMLElement &&
      isSvgLineElement(this.hourHandEl) &&
      isSvgLineElement(this.minuteHandEl) &&
      isSvgLineElement(this.secondHandEl)
    ) {
      return;
    }

    const anchorId = `tp-clock-${Math.random().toString(36).slice(2, 10)}`;
    this.digitalAnchorId = `${anchorId}-digital`;
    this.analogicAnchorId = `${anchorId}-analogic`;

    const timeEl = document.createElement('time');
    timeEl.id = this.digitalAnchorId;
    timeEl.setAttribute('data-tp-clock-time', '');

    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.id = this.analogicAnchorId;
    svg.setAttribute('data-tp-clock-graphic', '');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');

    const face = document.createElementNS(svgNs, 'circle');
    face.setAttribute('cx', '50');
    face.setAttribute('cy', '50');
    face.setAttribute('r', '48');
    face.setAttribute('fill', 'none');
    face.setAttribute('stroke', 'currentColor');
    face.setAttribute('stroke-width', '4');

    const tickLabels = Array.from({ length: 12 }, (_, value) => {
      const angleInRadians = ((value * 30) - 90) * (Math.PI / 180);
      const labelRadius = 36;
      const labelX = 50 + (Math.cos(angleInRadians) * labelRadius);
      const labelY = 50 + (Math.sin(angleInRadians) * labelRadius);
      const label = document.createElementNS(svgNs, 'text');
      label.setAttribute('data-tp-clock-tick', '');
      label.setAttribute('x', String(labelX));
      label.setAttribute('y', String(labelY));
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('font-size', '8');
      label.textContent = String(value);
      return label;
    });

    const hourHand = document.createElementNS(svgNs, 'line');
    hourHand.setAttribute('x1', '50');
    hourHand.setAttribute('y1', '50');
    hourHand.setAttribute('x2', '50');
    hourHand.setAttribute('y2', '28');
    hourHand.setAttribute('stroke', 'currentColor');
    hourHand.setAttribute('stroke-width', '4');
    hourHand.setAttribute('stroke-linecap', 'round');

    const minuteHand = document.createElementNS(svgNs, 'line');
    minuteHand.setAttribute('x1', '50');
    minuteHand.setAttribute('y1', '50');
    minuteHand.setAttribute('x2', '50');
    minuteHand.setAttribute('y2', '20');
    minuteHand.setAttribute('stroke', 'currentColor');
    minuteHand.setAttribute('stroke-width', '3');
    minuteHand.setAttribute('stroke-linecap', 'round');

    const secondHand = document.createElementNS(svgNs, 'line');
    secondHand.setAttribute('x1', '50');
    secondHand.setAttribute('y1', '52');
    secondHand.setAttribute('x2', '50');
    secondHand.setAttribute('y2', '15');
    secondHand.setAttribute('stroke', 'currentColor');
    secondHand.setAttribute('stroke-width', '2');
    secondHand.setAttribute('stroke-linecap', 'round');

    const centerDot = document.createElementNS(svgNs, 'circle');
    centerDot.setAttribute('cx', '50');
    centerDot.setAttribute('cy', '50');
    centerDot.setAttribute('r', '3');
    centerDot.setAttribute('fill', 'currentColor');

    svg.append(face, ...tickLabels, hourHand, minuteHand, secondHand, centerDot);

    const tooltip = document.createElement('tp-tooltip');
    tooltip.setAttribute('anchor', `#${this.digitalAnchorId}`);
    tooltip.setAttribute('placement', 'bottom');

    this.replaceChildren(timeEl, svg, tooltip);

    this.timeEl = timeEl;
    this.tooltipEl = tooltip;
    this.hourHandEl = hourHand;
    this.minuteHandEl = minuteHand;
    this.secondHandEl = secondHand;
  }

  /**
   * Starts the one-second refresh ticker.
   *
   * @summary Starts the clock refresh ticker.
   */
  private startTicker(): void {
    if (this.tickTimer !== null) {
      return;
    }

    this.tickTimer = window.setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  /**
   * Stops the one-second refresh ticker.
   *
   * @summary Stops the clock refresh ticker.
   */
  private stopTicker(): void {
    if (this.tickTimer === null) {
      return;
    }

    window.clearInterval(this.tickTimer);
    this.tickTimer = null;
  }

  /**
   * Refreshes the visible time, tooltip date, and analog hands.
   *
   * @summary Updates the clock UI state.
   */
  private updateClock(): void {
    this.ensureDom();

    if (
      !(this.timeEl instanceof HTMLTimeElement) ||
      !(this.tooltipEl instanceof HTMLElement) ||
      !isSvgLineElement(this.hourHandEl) ||
      !isSvgLineElement(this.minuteHandEl) ||
      !isSvgLineElement(this.secondHandEl)
    ) {
      return;
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeText = `${hours}:${minutes}:${seconds}`;
    const dateText = now.toLocaleDateString();

    this.timeEl.textContent = timeText;
    this.timeEl.dateTime = now.toISOString();
    this.tooltipEl.textContent = dateText;
    this.style.setProperty('--tp-clock-size', this.size);
    this.setAttribute('data-type', this.type);
    this.tooltipEl.setAttribute('anchor', this.type === 'analogic'
      ? `#${this.analogicAnchorId}`
      : `#${this.digitalAnchorId}`);

    const hourAngle = ((now.getHours() % 12) * 30) + (now.getMinutes() * 0.5);
    const minuteAngle = (now.getMinutes() * 6) + (now.getSeconds() * 0.1);
    const secondAngle = now.getSeconds() * 6;

    this.hourHandEl.setAttribute('transform', `rotate(${String(hourAngle)} 50 50)`);
    this.minuteHandEl.setAttribute('transform', `rotate(${String(minuteAngle)} 50 50)`);
    this.secondHandEl.setAttribute('transform', `rotate(${String(secondAngle)} 50 50)`);
  }
}

if (!customElements.get('tp-clock')) {
  customElements.define('tp-clock', TpClock);
}

declare global {
  interface HTMLElementTagNameMap {
    'tp-clock': TpClock;
  }
}
