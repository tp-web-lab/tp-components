import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const initialize = vi.fn();
const registerExternalDiagrams = vi.fn();
const bindFunctions = vi.fn();
const render = vi.fn(async (id: string, source: string) => ({
  bindFunctions,
  svg: `<svg id="${id}"><text>${source}</text></svg>`,
}));

vi.mock('mermaid', () => ({ default: { initialize, registerExternalDiagrams, render } }));
vi.mock('@mermaid-js/mermaid-zenuml', () => ({ default: { id: 'zenuml' } }));

import './diagram.js';
import { TpDiagram } from './diagram.js';

async function settle(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('<tp-diagram>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('renders an inline Mermaid script as an accessible SVG', async () => {
    const element = document.createElement('tp-diagram');
    element.setAttribute('label', 'Request flow');
    element.innerHTML = '<script type="tp/diagram">flowchart LR\n  A --> B</script>';
    document.body.append(element);
    await settle();

    expect(element).toBeInstanceOf(TpDiagram);
    expect(render).toHaveBeenCalledWith(expect.stringMatching(/^tp-diagram-/), 'flowchart LR\n  A --> B');
    expect(element.querySelector('svg')?.getAttribute('role')).toBe('img');
    expect(element.querySelector('svg')?.getAttribute('aria-label')).toBe('Request flow');
    expect(bindFunctions).toHaveBeenCalled();
    expect(registerExternalDiagrams).toHaveBeenCalledOnce();
    expect(document.head.querySelectorAll('#tp-diagram-styles')).toHaveLength(1);
  });

  it('waits for an inline script added immediately after connection', async () => {
    const element = document.createElement('tp-diagram');
    document.body.append(element);
    element.innerHTML = '<script type="tp/diagram">flowchart LR\n  Parser --> Component</script>';
    element.setAttribute('label', 'Parser timing');
    await settle();

    expect(render).toHaveBeenCalledWith(
      expect.stringMatching(/^tp-diagram-/),
      'flowchart LR\n  Parser --> Component',
    );
    expect(element.querySelector('svg')?.getAttribute('aria-label')).toBe('Parser timing');
  });

  it('renders an inline script added after its initial empty render', async () => {
    const element = document.createElement('tp-diagram');
    document.body.append(element);
    await settle();
    element.innerHTML = '<script type="tp/diagram">flowchart LR\n  Late --> Source</script>';
    await settle();

    expect(render).toHaveBeenCalledWith(
      expect.stringMatching(/^tp-diagram-/),
      'flowchart LR\n  Late --> Source',
    );
    expect(element.getAttribute('data-source')).toContain('type="tp/diagram"');
    expect(element.getAttribute('data-source')).toContain('Late --> Source');
  });

  it('cancels its deferred first render when disconnected immediately', async () => {
    const element = document.createElement('tp-diagram');
    document.body.append(element);
    element.remove();
    await settle();

    expect(render).not.toHaveBeenCalled();
  });

  it('keeps its tp/diagram inline source for rerenders', async () => {
    const element = document.createElement('tp-diagram');
    element.innerHTML = '<script type="tp/diagram">sequenceDiagram\n  A->>B: Hello</script>';
    document.body.append(element);
    await settle();
    element.label = 'Sequence';
    await settle();

    expect(render).toHaveBeenCalledTimes(2);
    expect(element.querySelector('svg')?.getAttribute('aria-label')).toBe('Sequence');
  });

  it('loads Mermaid source through src relative to the containing document', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => 'classDiagram\n  Animal <|-- Duck',
    });
    vi.stubGlobal('fetch', fetchMock);
    const element = document.createElement('tp-diagram');
    element.src = 'diagram.mmd';
    document.body.append(element);
    await settle();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('diagram.mmd'),
      { cache: 'no-store' },
    );
    expect(render).toHaveBeenCalledWith(
      expect.stringMatching(/^tp-diagram-/),
      'classDiagram\n  Animal <|-- Duck',
    );
  });

  it('clears empty content and reports HTTP and Mermaid errors accessibly', async () => {
    const empty = document.createElement('tp-diagram');
    document.body.append(empty);
    await settle();
    expect(empty.innerHTML).toBe('');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    empty.src = '/missing.mmd';
    await settle();
    expect(empty.querySelector('[role="alert"]')?.textContent).toContain('404');

    render.mockRejectedValueOnce('<invalid>');
    const invalid = document.createElement('tp-diagram');
    invalid.innerHTML = '<script type="tp/diagram">invalid</script>';
    document.body.append(invalid);
    await settle();
    expect(invalid.innerHTML).toContain('&lt;invalid&gt;');
  });

  it('reflects src and label properties', () => {
    const element = document.createElement('tp-diagram') as TpDiagram;
    expect(element.label).toBe('Diagram');
    element.label = 'Architecture';
    element.src = '/architecture.mmd';
    expect(element.label).toBe('Architecture');
    expect(element.src).toBe('/architecture.mmd');
    element.label = ' ';
    element.src = ' ';
    expect(element.hasAttribute('label')).toBe(false);
    expect(element.hasAttribute('src')).toBe(false);
  });
});
