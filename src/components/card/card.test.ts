import { describe, expect, it } from 'vitest';

import './card.js';

describe('<tp-card>', () => {
  it('renders definition-list content in header, main, footer order', () => {
    const element = document.createElement('tp-card');
    element.innerHTML = `
      <dl>
        <dt>header</dt><dd>content header</dd>
        <dt>footer</dt><dd>content footer</dd>
        <dt>main</dt><dd><strong>content body</strong></dd>
      </dl>
    `;
    document.body.append(element);

    expect(Array.from(element.children, (child) => child.className)).toEqual([
      'tp-card-header',
      'tp-card-main',
      'tp-card-footer',
    ]);
    expect(element.querySelector('.tp-card-header')?.textContent).toBe('content header');
    expect(element.querySelector('.tp-card-main strong')?.textContent).toBe('content body');
    expect(element.querySelector('.tp-card-footer')?.textContent).toBe('content footer');
    expect(element.querySelector('dl')).toBeNull();
  });

  it('renders an error when the definition list is missing', () => {
    const element = document.createElement('tp-card');
    document.body.append(element);

    expect(element.querySelector('.tp-card-error')?.textContent).toContain(
      'tp-card requires a definition list',
    );
  });

  it.each(['img', 'svg'])('removes main spacing for a standalone %s without header or footer', (tag) => {
    const element = document.createElement('tp-card');
    element.innerHTML = `
      <dl>
        <dt>main</dt>
        <dd>${tag === 'img' ? '<img src="card.png" alt="Card">' : '<svg viewBox="0 0 16 9"></svg>'}</dd>
      </dl>
    `;
    document.body.append(element);

    expect(element.querySelector('.tp-card-main')?.classList.contains('tp-card-main-media')).toBe(
      true,
    );
    expect(element.classList.contains('tp-card-media-only')).toBe(true);
  });

  it.each([
    '<figure class="imageblock"><img src="card.png" alt="Card"></figure>',
    '<p><span class="image"><img src="card.png" alt="Card"></span></p>',
  ])('unwraps markup wrappers around a standalone image', (markup) => {
    const element = document.createElement('tp-card');
    element.innerHTML = `
      <dl>
        <dt>main</dt>
        <dd>${markup}</dd>
      </dl>
    `;
    document.body.append(element);

    const main = element.querySelector('.tp-card-main');
    expect(main?.classList.contains('tp-card-main-media')).toBe(true);
    expect(main?.children).toHaveLength(1);
    expect(main?.firstElementChild?.localName).toBe('img');
  });

  it('keeps a figure that contains a caption', () => {
    const element = document.createElement('tp-card');
    element.innerHTML = `
      <dl>
        <dt>main</dt>
        <dd><figure><img src="card.png" alt="Card"><figcaption>Caption</figcaption></figure></dd>
      </dl>
    `;
    document.body.append(element);

    expect(element.querySelector('.tp-card-main')?.classList.contains('tp-card-main-media')).toBe(
      false,
    );
    expect(element.querySelector('figcaption')?.textContent).toBe('Caption');
  });

  it('keeps main spacing when a standalone image is accompanied by a header', () => {
    const element = document.createElement('tp-card');
    element.innerHTML = `
      <dl>
        <dt>header</dt><dd>Header</dd>
        <dt>main</dt><dd><img src="card.png" alt="Card"></dd>
      </dl>
    `;
    document.body.append(element);

    expect(element.querySelector('.tp-card-main')?.classList.contains('tp-card-main-media')).toBe(
      false,
    );
  });
});
