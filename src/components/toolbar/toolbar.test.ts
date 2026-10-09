/**
 * @module toolbar/test
 * @summary Tests for the `<tp-toolbar>` component.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './toolbar.js';
import type { TpToolbar } from './toolbar.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Appends a `<tp-toolbar>` to the body and returns it.
 *
 * @summary Creates and connects a toolbar instance.
 * @param html Optional inner HTML to inject before connecting.
 * @returns The connected toolbar element.
 */
function mountToolbar(html = ''): TpToolbar {
  const el = document.createElement('tp-toolbar') as TpToolbar;

  if (html) {
    el.innerHTML = html;
  }

  document.body.append(el);
  return el;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('<tp-toolbar>', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // --- Registration ---

  it('is registered as a custom element', () => {
    expect(customElements.get('tp-toolbar')).toBeDefined();
  });

  // --- Orientation ---

  it('defaults to horizontal orientation', () => {
    const el = mountToolbar();
    expect(el.orientation).toBe('horizontal');
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('reads orientation attribute', () => {
    const el = mountToolbar();
    el.setAttribute('orientation', 'vertical');
    expect(el.orientation).toBe('vertical');
  });

  it('writes orientation via setter', () => {
    const el = mountToolbar();
    el.orientation = 'vertical';
    expect(el.getAttribute('orientation')).toBe('vertical');
    expect(el.getAttribute('data-orientation')).toBe('vertical');
  });

  it('falls back to horizontal for unknown orientation', () => {
    const el = mountToolbar();
    el.setAttribute('orientation', 'diagonal');
    expect(el.orientation).toBe('horizontal');
  });

  // --- Placement ---

  it('defaults to top for horizontal orientation', () => {
    const el = mountToolbar();
    expect(el.placement).toBe('top');
    expect(el.getAttribute('data-placement')).toBe('top');
  });

  it('defaults to start for vertical orientation', () => {
    const el = mountToolbar();
    el.setAttribute('orientation', 'vertical');
    expect(el.placement).toBe('start');
  });

  it('reads explicit placement attribute', () => {
    const el = mountToolbar();
    el.setAttribute('placement', 'bottom');
    expect(el.placement).toBe('bottom');
  });

  it('writes placement via setter', () => {
    const el = mountToolbar();
    el.placement = 'end';
    expect(el.getAttribute('placement')).toBe('end');
    expect(el.getAttribute('data-placement')).toBe('end');
  });

  it('falls back to top for unknown placement in horizontal mode', () => {
    const el = mountToolbar();
    el.setAttribute('placement', 'middle');
    expect(el.placement).toBe('top');
  });

  // --- Section containers ---

  it('creates start, center, end section containers on connect', () => {
    const el = mountToolbar();
    expect(el.querySelector('[data-toolbar-start]')).not.toBeNull();
    expect(el.querySelector('[data-toolbar-center]')).not.toBeNull();
    expect(el.querySelector('[data-toolbar-end]')).not.toBeNull();
  });

  it('does not duplicate sections on multiple connects', () => {
    const el = mountToolbar();
    document.body.removeChild(el);
    document.body.append(el);
    expect(el.querySelectorAll('[data-toolbar-start]').length).toBe(1);
  });

  // --- Child distribution ---

  it('puts children with no section attribute into the start section', () => {
    const el = mountToolbar('<span id="c1">item</span>');
    const start = el.querySelector('[data-toolbar-start]');
    expect(start?.querySelector('#c1')).not.toBeNull();
  });

  it('puts section="start" children into the start section', () => {
    const el = mountToolbar('<span section="start" id="c1">s</span>');
    expect(el.querySelector('[data-toolbar-start] #c1')).not.toBeNull();
  });

  it('puts section="center" children into the center section', () => {
    const el = mountToolbar('<span section="center" id="c2">c</span>');
    expect(el.querySelector('[data-toolbar-center] #c2')).not.toBeNull();
  });

  it('puts section="end" children into the end section', () => {
    const el = mountToolbar('<span section="end" id="c3">e</span>');
    expect(el.querySelector('[data-toolbar-end] #c3')).not.toBeNull();
  });

  it('distributes children added dynamically after connect', async () => {
    const el = mountToolbar();
    const span = document.createElement('span');
    span.setAttribute('section', 'center');
    span.id = 'dynamic';
    el.append(span);

    // MutationObserver fires as a microtask
    await Promise.resolve();
    expect(el.querySelector('[data-toolbar-center] #dynamic')).not.toBeNull();
  });

  it('distributes multiple children into different sections', () => {
    const el = mountToolbar(
      '<span section="start" id="s">s</span>' +
      '<span section="center" id="c">c</span>' +
      '<span section="end" id="e">e</span>',
    );
    expect(el.querySelector('[data-toolbar-start] #s')).not.toBeNull();
    expect(el.querySelector('[data-toolbar-center] #c')).not.toBeNull();
    expect(el.querySelector('[data-toolbar-end] #e')).not.toBeNull();
  });

  // --- Attribute change reaction ---

  it('updates data-orientation when orientation attribute changes', () => {
    const el = mountToolbar();
    el.setAttribute('orientation', 'vertical');
    expect(el.getAttribute('data-orientation')).toBe('vertical');
  });

  it('updates data-placement when placement attribute changes', () => {
    const el = mountToolbar();
    el.setAttribute('placement', 'bottom');
    expect(el.getAttribute('data-placement')).toBe('bottom');
  });

  it.each(['start', 'center', 'end'])('adds a button to the %s section', (section) => {
    const el = mountToolbar();
    const button = document.createElement('button');
    el.addButtonToSection(button, section);
    expect(el.querySelector(`[data-toolbar-${section}] button`)).toBe(button);
  });

  it('rejects programmatic insertion before initialization and unknown sections', () => {
    const detached = document.createElement('tp-toolbar') as TpToolbar;
    expect(() => detached.addButtonToSection(document.createElement('button'), 'start')).toThrow(
      'Toolbar sections are not initialized.',
    );
    const connected = mountToolbar();
    expect(() => connected.addButtonToSection(document.createElement('button'), 'other')).toThrow(
      'Invalid section: other',
    );
  });

  it('ignores lifecycle attribute callbacks whose value did not change', () => {
    const el = mountToolbar();
    const internals = el as unknown as {
      attributeChangedCallback: (name: string, oldValue: string, newValue: string) => void;
    };
    internals.attributeChangedCallback('orientation', 'horizontal', 'horizontal');
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
  });
});
