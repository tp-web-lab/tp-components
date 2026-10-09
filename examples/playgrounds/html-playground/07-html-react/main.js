import { createElement, useState } from 'react';
import { createRoot } from 'react-dom/client';

const items = [
  ['HTML', 'HTML structures the document.'],
  ['CSS', 'CSS styles the document.'],
  ['JavaScript', 'JavaScript adds behavior.'],
  [
    'React',
    createElement(
      'span',
      null,
      createElement(
        'a',
        {
          href: 'https://reactjs.org/',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        'React',
      ),
      ' builds UI with components.',
    ),
  ],
];

function App() {
  const [selected, setSelected] = useState(0);

  return createElement(
    'section',
    { className: 'tabs' },
    createElement(
      'div',
      { className: 'tab-list', role: 'tablist' },
      items.map(([label], index) =>
        createElement(
          'button',
          {
            key: label,
            type: 'button',
            role: 'tab',
            'aria-selected': index === selected,
            onClick: () => setSelected(index),
          },
          label,
        ),
      ),
    ),
    createElement(
      'div',
      { className: 'tab-panel', role: 'tabpanel' },
      items[selected] ? items[selected][1] : '',
    ),
  );
}

const root = document.querySelector('#app');

if (root !== null) {
  createRoot(root).render(createElement(App));
}