const list = document.querySelector('#topics');

if (list instanceof HTMLDListElement) {
  const terms = Array.from(list.querySelectorAll(':scope > dt'));
  const descriptions = Array.from(list.querySelectorAll(':scope > dd'));

  const tabs = document.createElement('section');
  tabs.className = 'tabs';

  const tabList = document.createElement('div');
  tabList.className = 'tab-list';
  tabList.setAttribute('role', 'tablist');

  const panel = document.createElement('div');
  panel.className = 'tab-panel';

  for (const [index, term] of terms.entries()) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = term.textContent ?? '';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(index === 0));

    button.addEventListener('click', () => {
      for (const tab of Array.from(tabList.children)) {
        tab.setAttribute('aria-selected', 'false');
      }
      button.setAttribute('aria-selected', 'true');
      panel.textContent = descriptions[index]?.textContent ?? '';
    });

    tabList.append(button);
  }

  panel.textContent = descriptions[0]?.textContent ?? '';

  tabs.append(tabList, panel);
  list.replaceWith(tabs);
}