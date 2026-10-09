/**
 * @module components/diagram
 * @summary Accessible Mermaid diagram renderer.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpDeclarativeTextSource } from '../../utilities/declarative-text-source.js';
import { TpBase } from '../base/base.js';
import style from './diagram.css?inline';

const STYLE_ID = 'tp-diagram-styles';
let diagramCount = 0;
let mermaidInitialization: Promise<void> | null = null;
let mermaidRenderQueue = Promise.resolve();

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * @summary Renders Mermaid source supplied inline or through a source URL.
 * @tagname tp-diagram
 * @attr {string} src = "" - Mermaid source file loaded relative to the containing document.
 * @attr {string} label = "Diagram" - Accessible name applied to the rendered SVG.
 * @event tp-diagram-rendered Emitted after Mermaid has rendered the diagram.
 * @eventdetail tp-diagram-rendered { src: string }
 * @accessibility Exposes the generated SVG as an image with the accessible name provided by label.
 * @accessibilityresponsibility Provide a label that communicates the diagram's purpose or content.
 * @accessibilityresponsibility Supply an adjacent textual explanation when the diagram communicates information that cannot be expressed adequately by its accessible name alone.
 * @example
 * <tp-diagram label="Request flow">
 *   <script type="tp/diagram">
 *     flowchart LR
 *       Browser --> Server
 *   </script>
 * </tp-diagram>
 */
export class TpDiagram extends TpBase {
  public static get observedAttributes(): string[] {
    return ['src', 'label'];
  }

  private readonly source = new TpDeclarativeTextSource(this, {
    scriptTypes: ['tp/diagram'],
  });
  private renderToken = 0;
  private initialRenderStarted = false;
  private lifecycleReady = false;

  public get src(): string {
    return this.getAttribute('src') ?? '';
  }

  public set src(value: string) {
    if (value.trim() === '') this.removeAttribute('src');
    else this.setAttribute('src', value);
  }

  public get label(): string {
    return this.getAttribute('label')?.trim() || 'Diagram';
  }

  public set label(value: string) {
    if (value.trim() === '') this.removeAttribute('label');
    else this.setAttribute('label', value);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.classList.add('tp-diagram');
    this.ensureGlobalStyle(STYLE_ID, style);
    this.source.observe(() => {
      this.storeInlineAuthorSource();
      if (this.initialRenderStarted) void this.renderDiagram();
    });
    // A defined custom element may be connected as soon as the HTML parser sees
    // its opening tag. Defer the first read until its child script has been parsed.
    setTimeout(() => {
      if (!this.isConnected) return;
      this.initialRenderStarted = true;
      if (this.source.capture()) {
        this.storeInlineAuthorSource();
      }
      this.lifecycleReady = true;
      void this.renderDiagram();
    }, 0);
  }

  protected disconnectedCallback(): void {
    this.source.disconnect();
    this.initialRenderStarted = false;
    this.lifecycleReady = false;
    this.renderToken += 1;
  }

  protected attributeChangedCallback(): void {
    if (this.isConnected && this.lifecycleReady) void this.renderDiagram();
  }

  private async renderDiagram(): Promise<void> {
    const token = ++this.renderToken;
    const rawSrc = this.src.trim();
    this.removeAttribute('data-tp-diagram-rendered');
    this.setAttribute('aria-busy', 'true');

    try {
      const source = await this.source.read({ cache: 'no-store' });
      if (token !== this.renderToken) return;

      if (source.trim() === '') {
        this.replaceChildren();
        this.removeAttribute('aria-busy');
        return;
      }

      const [{ default: mermaid }, { default: zenuml }] = await Promise.all([
        import('mermaid'),
        import('@mermaid-js/mermaid-zenuml'),
      ]);
      if (token !== this.renderToken) return;
      if (mermaidInitialization === null) {
        mermaidInitialization = (async () => {
          await mermaid.registerExternalDiagrams([zenuml]);
          mermaid.initialize({
            securityLevel: 'strict',
            startOnLoad: false,
            suppressErrorRendering: true,
          });
        })();
      }
      await mermaidInitialization;

      diagramCount += 1;
      const id = `tp-diagram-${String(diagramCount)}`;
      // Mermaid renders through shared document state. Serializing calls avoids
      // collisions when a page contains several diagrams.
      const renderTask = mermaidRenderQueue.then(() => mermaid.render(id, source));
      mermaidRenderQueue = renderTask.then(() => undefined, () => undefined);
      const rendered = await renderTask;
      if (token !== this.renderToken) return;

      const output = document.createElement('div');
      output.className = 'tp-diagram-output';
      output.innerHTML = rendered.svg;
      const svg = output.querySelector('svg');
      if (svg !== null) {
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', this.label);
        svg.removeAttribute('aria-roledescription');
      }
      this.replaceChildren(output);
      rendered.bindFunctions?.(output);
      this.setAttribute('data-tp-diagram-rendered', '');
      this.removeAttribute('aria-busy');
      this.dispatchEvent(new CustomEvent('tp-diagram-rendered', {
        bubbles: true,
        detail: { src: rawSrc },
      }));
    } catch (error) {
      if (token !== this.renderToken) return;
      const message = error instanceof Error ? error.message : String(error);
      this.removeAttribute('aria-busy');
      this.innerHTML = `<pre class="tp-diagram-error" role="alert" tabindex="0"><code>${escapeHtml(message)}</code></pre>`;
    }
  }

  private storeInlineAuthorSource(): void {
    const clone = this.cloneNode(true) as HTMLElement;
    clone.removeAttribute('aria-busy');
    clone.removeAttribute('data-source');
    clone.removeAttribute('data-tp-base-host');
    clone.removeAttribute('data-tp-diagram-rendered');
    clone.classList.remove('tp-diagram');
    if (clone.classList.length === 0) clone.removeAttribute('class');
    this.setAttribute('data-source', clone.outerHTML);
  }

}

if (!customElements.get('tp-diagram')) {
  customElements.define('tp-diagram', TpDiagram);
}

declare global {
  interface HTMLElementTagNameMap {
    'tp-diagram': TpDiagram;
  }
}
