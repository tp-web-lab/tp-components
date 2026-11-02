import{n as e}from"../../chunks/tool-loading.js";import{E as t,f as n,n as r,t as i,u as a}from"../../chunks/playground-build-utils.js";import{PROLOG_DOM_MODULE_SOURCE as o,flattenLocalPrologModules as s,getLocalPrologModuleNames as c,usesPrologDomModule as l}from"./prolog-source.js";var u=`https://esm.sh/scryer`,d=new Map,f=new Set([`append`,`between`,`call`,`catch`,`fail`,`false`,`findall`,`forall`,`is`,`length`,`member`,`nl`,`once`,`phrase`,`read`,`repeat`,`throw`,`true`,`write`,`writeln`]);function p(e){return(e.match(/[^.]+(?:\.|$)/g)??[]).flatMap(e=>{let t=e.trim(),n=t.match(/^([a-z][A-Za-z0-9_]*)\s*(?:\(|\.|$)/)?.[1];return n===void 0||f.has(n)?[]:[[t,n]]})}function m(e,t){let r=t??e.query;if(typeof r==`string`&&r!==``){let t=n(e,r);if(t!==void 0)return t}return n(e,`/query.pl`)??e.files.find(e=>e.path.endsWith(`.query.pl`))}async function h(a,f={}){let h=t(a,{entry:f.entry,priorityPaths:[`/program.pl`,`/main.pl`],extensions:[`.pl`],fallbackToFirstFile:!1}),g=m(a,f.query),_=h?.path===g?.path?void 0:h,v=n(a,`/index.html`),y=a.files.filter(e=>e.path.endsWith(`.pl`)&&e.path!==g?.path&&e.path!==a.test),b=[...y.filter(e=>e.path!==_?.path),..._===void 0?[]:[_]],x=c(y),S=[...y.some(e=>l(e.content))?[{path:`/library/dom.pl`,content:o}]:[],...b.map(e=>({path:e.path,content:s(e.content,x)}))],C=S;if(f.scope!==void 0&&f.scope!==``){let e=d.get(f.scope)??new Map;e.set(f.index??0,S),d.set(f.scope,e),C=Array.from(e.entries()).sort(([e],[t])=>e-t).flatMap(([,e])=>e)}let w=C.find(e=>e.path===`/library/dom.pl`),T=C.filter(e=>e.path!==`/library/dom.pl`).map(e=>e.content.trim()).filter(e=>e!==``).join(`

`),E=JSON.stringify([...w===void 0?[]:[w],...T===``?[]:[{path:`/notebook-program.pl`,content:T}]]),D=JSON.stringify(g?.content??``),O=JSON.stringify(g?.path??``),k=JSON.stringify(T===``?p(g?.content??``):[]);return{html:`
<!doctype html>
<html>
<head>
  <style>
    body {
      box-sizing: border-box;
      font-family: system-ui, sans-serif;
      margin: 0;
      padding: 1rem;
    }

    pre[data-tp-prolog-output] {
      background: transparent;
      border: 0;
      color: inherit;
      margin-block: 0;
      overflow: auto;
      padding: 0;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  ${v?.content??`<main id="prolog-output"></main>`}
  ${i()}
  ${r()}
  <script type="module">
    const sources = ${E};
    const querySource = ${D};
    const queryPath = ${O};
    const undefinedQueries = new Map(${k});
    const scryerModuleUrl = ${JSON.stringify(u)};
    const scryerInitWarning =
      'using deprecated parameters for the initialization function; pass a single object instead';

    async function loadScryer() {
      const originalWarn = console.warn;

      console.warn = (...args) => {
        if (args.some((arg) => String(arg).includes(scryerInitWarning))) {
          return;
        }

        originalWarn.apply(console, args);
      };

      try {
        const scryer = await import(scryerModuleUrl);
        await scryer.init();
        ${e(`scryer`,`Scryer Prolog`)}
        return scryer;
      } finally {
        console.warn = originalWarn;
      }
    }


    function ensureOutput() {
      let output = document.querySelector('[data-tp-prolog-output]');

      if (output instanceof HTMLElement) {
        return output;
      }

      const target = document.querySelector('#prolog-output') ?? document.body;
      output = document.createElement('pre');
      output.setAttribute('data-tp-prolog-output', '');
      target.append(output);
      return output;
    }

    function stringifyTerm(value) {
      if (value === null || value === undefined) {
        return String(value);
      }

      if (typeof value === 'string') {
        return value;
      }

      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }

      if (typeof value.toString === 'function') {
        return value.toString();
      }

      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    function formatBindings(bindings) {
      if (bindings === null || bindings === undefined) {
        return 'true.';
      }

      const entries =
        bindings instanceof Map
          ? Array.from(bindings.entries())
          : Object.entries(bindings);
      const visibleEntries = entries.filter(
        ([name]) => name !== 'TpPlaygroundResult',
      );

      if (visibleEntries.length === 0) {
        return 'true.';
      }

      return visibleEntries
        .map(([name, value]) => name + ' = ' + stringifyTerm(value))
        .join(', ');
    }

    function termName(value) {
      if (value === null || value === undefined) {
        return '';
      }

      if (typeof value === 'string') {
        return value;
      }

      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }

      if (typeof value.value === 'string') {
        return value.value;
      }

      return stringifyTerm(value);
    }

    function isCompound(value, functor, arity) {
      return (
        value !== null &&
        typeof value === 'object' &&
        value.functor === functor &&
        Array.isArray(value.args) &&
        value.args.length === arity
      );
    }

    function getBindingValue(bindings, name) {
      if (bindings instanceof Map) {
        return bindings.get(name);
      }

      return bindings?.[name];
    }

    function formatPrologError(error) {
      if (error === null || error === undefined) {
        return 'Unknown Prolog error';
      }

      if (typeof error.toProlog === 'function') {
        return error.toProlog();
      }

      if (typeof error.toString === 'function') {
        return error.toString();
      }

      return String(error);
    }

    function describePrologError(error, query) {
      const message = formatPrologError(error);

      if (/Prolog error false/i.test(String(message))) {
        return 'Unable to execute "' + query + '": Scryer Prolog could not resolve the predicate. Check that it is defined and that its name and number of arguments are correct.';
      }

      return message;
    }

    let tpDomIdCounter = 0;
    let currentDomEvent = null;
    const tpDomElements = new Map();
    const tpDomEventListeners = new Map();

    function escapePrologString(value) {
      return String(value)
        .replaceAll('\\\\', '\\\\\\\\')
        .replaceAll('"', '\\\\"')
        .replaceAll('\\n', '\\\\n')
        .replaceAll('\\r', '\\\\r');
    }

    function prologString(value) {
      return '"' + escapePrologString(value) + '"';
    }

    function escapePrologAtom(value) {
      return String(value)
        .replaceAll('\\\\', '\\\\\\\\')
        .replaceAll("'", "\\\\'");
    }

    function prologAtom(value) {
      const text = String(value);

      if (/^[a-z][A-Za-z0-9_]*$/.test(text)) {
        return text;
      }

      return "'" + escapePrologAtom(text) + "'";
    }

    function escapeAttributeSelectorValue(value) {
      return String(value).replaceAll('\\\\', '\\\\\\\\').replaceAll('"', '\\\\"');
    }

    function getDomElementId(element) {
      if (element.id !== '') {
        return element.id;
      }

      const existing = element.getAttribute('data-tp-prolog-dom-id');

      if (existing !== null && existing !== '') {
        return existing;
      }

      tpDomIdCounter += 1;
      const id = '__tp_dom_' + tpDomIdCounter;
      element.setAttribute('data-tp-prolog-dom-id', id);
      return id;
    }

    function getDomElement(id) {
      const key = termName(id);
      const registeredElement = tpDomElements.get(key);

      if (registeredElement instanceof Element) {
        return registeredElement;
      }

      const elementById = document.getElementById(key);

      if (elementById !== null) {
        return elementById;
      }

      return document.querySelector(
        '[data-tp-prolog-dom-id="' + escapeAttributeSelectorValue(key) + '"]',
      );
    }

    function extractDomSelectors() {
      const selectors = new Set();
      const selectorPattern =
        /query_select(?:_all)?\\s*\\(([^)]*)\\)/gs;
      const literalPattern = /(["'])(.*?)\\1/g;

      for (const source of sources) {
        for (const match of source.content.matchAll(selectorPattern)) {
          const args = match[1] ?? '';
          const literals = Array.from(args.matchAll(literalPattern)).map(
            (literalMatch) => literalMatch[2],
          );

          if (literals.length > 0) {
            selectors.add(literals.at(-1));
          }
        }
      }

      return Array.from(selectors);
    }

    function createDomFacts() {
      const elements = [document.body, ...document.body.querySelectorAll('*')];
      const lines = [];

      for (const element of elements) {
        const id = getDomElementId(element);
        lines.push('tp_dom_known_element(' + prologAtom(id) + ').');
        lines.push(
          'tp_dom_html(' +
            prologAtom(id) +
            ', ' +
            prologString(element.innerHTML) +
            ').',
        );
        lines.push(
          'tp_dom_text(' +
            prologAtom(id) +
            ', ' +
            prologString(element.textContent ?? '') +
            ').',
        );

        if (element.parentElement instanceof Element) {
          lines.push(
            'tp_dom_parent(' +
              prologAtom(id) +
              ', ' +
              prologAtom(getDomElementId(element.parentElement)) +
              ').',
          );
        }

        if (element.nextElementSibling instanceof Element) {
          lines.push(
            'tp_dom_sibling(' +
              prologAtom(id) +
              ', ' +
              prologAtom(getDomElementId(element.nextElementSibling)) +
              ').',
          );
        }

        for (const attribute of Array.from(element.attributes)) {
          if (attribute.name === 'data-tp-prolog-dom-id') {
            continue;
          }

          lines.push(
            'tp_dom_attr(' +
              prologAtom(id) +
              ', ' +
              prologAtom(attribute.name) +
              ', ' +
              prologString(attribute.value) +
              ').',
          );
        }

        for (const className of Array.from(element.classList)) {
          lines.push(
            'tp_dom_class(' +
              prologAtom(id) +
              ', ' +
              prologAtom(className) +
              ').',
          );
        }

        for (const property of Array.from(element.style)) {
          lines.push(
            'tp_dom_style(' +
              prologAtom(id) +
              ', ' +
              prologAtom(property) +
              ', ' +
              prologString(element.style.getPropertyValue(property)) +
              ').',
          );
        }
      }

      for (const selector of extractDomSelectors()) {
        try {
          for (const element of Array.from(document.querySelectorAll(selector))) {
            const id = prologAtom(getDomElementId(element));
            const selectorTerms = new Set([
              prologAtom(selector),
              prologString(selector),
            ]);

            for (const selectorTerm of selectorTerms) {
              lines.push(
                'tp_dom_query_selector(' +
                  selectorTerm +
                  ', ' +
                  id +
                ').',
              );
            }
          }

          for (const parent of elements) {
            const parentId = prologAtom(getDomElementId(parent));

            for (const element of Array.from(parent.querySelectorAll(selector))) {
              const id = prologAtom(getDomElementId(element));
              const selectorTerms = new Set([
                prologAtom(selector),
                prologString(selector),
              ]);

              for (const selectorTerm of selectorTerms) {
                lines.push(
                  'tp_dom_query_selector(' +
                    parentId +
                    ', ' +
                    selectorTerm +
                    ', ' +
                    id +
                    ').',
                );
              }
            }
          }
        } catch (error) {
          console.warn('Invalid DOM selector for query_select:', selector, error);
        }
      }

      return lines.join('\\n');
    }

    function listenerKey(id, eventName) {
      return termName(id) + '::' + termName(eventName);
    }

    function removeDomListeners(id, eventName, goal) {
      const key = listenerKey(id, eventName);
      const records = tpDomEventListeners.get(key);

      if (!Array.isArray(records)) {
        return;
      }

      const goalText =
        goal !== undefined && typeof goal?.toProlog === 'function'
          ? goal.toProlog()
          : undefined;
      const keptRecords = [];

      for (const record of records) {
        if (goalText !== undefined && record.goal !== goalText) {
          keptRecords.push(record);
          continue;
        }

        record.element.removeEventListener(record.eventName, record.listener);
      }

      if (keptRecords.length === 0) {
        tpDomEventListeners.delete(key);
      } else {
        tpDomEventListeners.set(key, keptRecords);
      }
    }

    function applyDomActions(actions) {
      if (!Array.isArray(actions)) {
        return;
      }

      for (const action of actions) {
        if (isCompound(action, 'create', 2)) {
          const [id, tag] = action.args;
          const element = document.createElement(termName(tag));
          const key = termName(id);
          element.setAttribute('data-tp-prolog-dom-id', key);
          tpDomElements.set(key, element);
          continue;
        }

        if (isCompound(action, 'append_child', 2)) {
          const [parentId, childId] = action.args;
          const parent = getDomElement(parentId);
          const child = getDomElement(childId);

          if (parent !== null && child !== null && !child.isConnected) {
            parent.append(child);
          }
          continue;
        }

        if (isCompound(action, 'insert_after', 2)) {
          const [referenceId, childId] = action.args;
          const reference = getDomElement(referenceId);
          const child = getDomElement(childId);

          if (
            reference !== null &&
            child !== null &&
            reference.parentNode !== null &&
            !child.isConnected
          ) {
            reference.parentNode.insertBefore(child, reference.nextSibling);
          }
          continue;
        }

        if (isCompound(action, 'insert_before', 2)) {
          const [referenceId, childId] = action.args;
          const reference = getDomElement(referenceId);
          const child = getDomElement(childId);

          if (
            reference !== null &&
            child !== null &&
            reference.parentNode !== null &&
            !child.isConnected
          ) {
            reference.parentNode.insertBefore(child, reference);
          }
          continue;
        }

        if (isCompound(action, 'remove_child', 2)) {
          const [parentId, childId] = action.args;
          const parent = getDomElement(parentId);
          const child = getDomElement(childId);

          if (parent !== null && child !== null && child.parentElement === parent) {
            parent.removeChild(child);
          }
          continue;
        }

        if (isCompound(action, 'replace_child', 3)) {
          const [parentId, oldChildId, newChildId] = action.args;
          const parent = getDomElement(parentId);
          const oldChild = getDomElement(oldChildId);
          const newChild = getDomElement(newChildId);

          if (
            parent !== null &&
            oldChild !== null &&
            newChild !== null &&
            oldChild.parentElement === parent &&
            !newChild.isConnected
          ) {
            parent.replaceChild(newChild, oldChild);
          }
          continue;
        }

        if (isCompound(action, 'set_attr', 3)) {
          const [id, attribute, value] = action.args;
          getDomElement(id)?.setAttribute(termName(attribute), termName(value));
          continue;
        }

        if (isCompound(action, 'set_html', 2)) {
          const [id, html] = action.args;
          const element = getDomElement(id);
          if (element !== null) {
            element.innerHTML = termName(html);
          }
          continue;
        }

        if (isCompound(action, 'set_text', 2)) {
          const [id, text] = action.args;
          const element = getDomElement(id);
          if (element !== null) {
            element.textContent = termName(text);
          }
          continue;
        }

        if (isCompound(action, 'set_style', 3)) {
          const [id, property, value] = action.args;
          const element = getDomElement(id);
          if (element instanceof HTMLElement) {
            element.style.setProperty(termName(property), termName(value));
          }
          continue;
        }

        if (isCompound(action, 'add_class', 2)) {
          const [id, className] = action.args;
          getDomElement(id)?.classList.add(termName(className));
          continue;
        }

        if (isCompound(action, 'remove_class', 2)) {
          const [id, className] = action.args;
          getDomElement(id)?.classList.remove(termName(className));
          continue;
        }

        if (isCompound(action, 'toggle_class', 2)) {
          const [id, className] = action.args;
          getDomElement(id)?.classList.toggle(termName(className));
          continue;
        }

        if (isCompound(action, 'unbind', 2)) {
          const [id, eventName] = action.args;
          removeDomListeners(id, eventName);
          continue;
        }

        if (isCompound(action, 'unbind', 3)) {
          const [id, eventName, goal] = action.args;
          removeDomListeners(id, eventName, goal);
          continue;
        }

        if (isCompound(action, 'prevent_default', 1)) {
          currentDomEvent?.preventDefault();
          continue;
        }

        if (isCompound(action, 'hide', 1)) {
          const [id] = action.args;
          const element = getDomElement(id);
          if (element instanceof HTMLElement) {
            element.hidden = true;
          }
          continue;
        }

        if (isCompound(action, 'show', 1)) {
          const [id] = action.args;
          const element = getDomElement(id);
          if (element instanceof HTMLElement) {
            element.hidden = false;
            element.style.removeProperty('display');
          }
          continue;
        }

        if (isCompound(action, 'toggle', 1)) {
          const [id] = action.args;
          const element = getDomElement(id);
          if (element instanceof HTMLElement) {
            element.hidden = !element.hidden;
          }
        }
      }
    }

    function collectDomActions(prolog) {
      try {
        const answer = prolog.queryOnce('tp_dom_collect_actions(Actions).');

        if (answer === false) {
          return [];
        }

        return getBindingValue(answer.bindings, 'Actions') ?? [];
      } catch {
        return [];
      }
    }

    function bindDomEvents(prolog) {
      let bindings = [];

      try {
        const answer = prolog.queryOnce('tp_dom_collect_bindings(Bindings).');

        if (answer !== false) {
          bindings = getBindingValue(answer.bindings, 'Bindings') ?? [];
        }
      } catch {
        return;
      }

      if (!Array.isArray(bindings)) {
        return;
      }

      for (const binding of bindings) {
        if (!isCompound(binding, 'binding', 4)) {
          continue;
        }

        const [id, eventName, _eventTerm, goal] = binding.args;
        const element = getDomElement(id);

        if (element === null || typeof goal?.toProlog !== 'function') {
          continue;
        }

        const eventNameText = termName(eventName);
        const listener = (event) => {
          currentDomEvent = event;

          try {
            for (const _answer of prolog.query('(' + goal.toProlog() + '), tp_dom_collect_actions(Actions).')) {
              applyDomActions(getBindingValue(_answer.bindings, 'Actions') ?? []);
            }
          } catch (error) {
            console.error(error);
          } finally {
            currentDomEvent = null;
          }
        };

        element.addEventListener(eventNameText, listener);

        const key = listenerKey(id, eventName);
        const records = tpDomEventListeners.get(key) ?? [];
        records.push({
          element,
          eventName: eventNameText,
          goal: goal.toProlog(),
          listener,
        });
        tpDomEventListeners.set(key, records);
      }
    }

    function splitQueries(source) {
      const queries = [];
      let current = '';
      let quote = null;
      let escaped = false;

      for (const char of source) {
        current += char;

        if (escaped) {
          escaped = false;
          continue;
        }

        if (char === '\\\\') {
          escaped = true;
          continue;
        }

        if (quote !== null) {
          if (char === quote) {
            quote = null;
          }
          continue;
        }

        if (char === "'" || char === '"') {
          quote = char;
          continue;
        }

        if (char === '.') {
          const query = current.trim();

          if (query !== '') {
            queries.push(query);
          }

          current = '';
        }
      }

      const tail = current.trim();

      if (tail !== '') {
        queries.push(tail.endsWith('.') ? tail : tail + '.');
      }

      return queries;
    }

    function createExecutableQuery(query) {
      const goal = query.trim().replace(/\\.\\s*$/, '');
      return '(' + goal + '), TpPlaygroundResult = true.';
    }

    async function main() {
      const output = ensureOutput();
      output.textContent = 'Loading Scryer Prolog...';

      const { Prolog } = await loadScryer();
      const prolog = new Prolog();

      for (const source of sources) {
        prolog.consultText(source.content);

        if (source.path === '/library/dom.pl') {
          prolog.consultText(createDomFacts());
        }
      }

      const queries = splitQueries(querySource);

      if (queries.length === 0) {
        output.remove();
        return;
      }

      const lines = [];

      for (const query of queries) {
        lines.push('?- ' + query);

        const undefinedPredicate = undefinedQueries.get(query.trim()) ?? null;
        if (undefinedPredicate !== null) {
          lines.push(
            'ERROR: Undefined predicate "' + undefinedPredicate + '". ' +
            'No matching definition was found in the loaded program files.'
          );
          lines.push('');
          continue;
        }

        let count = 0;

        try {
          for (const answer of prolog.query(createExecutableQuery(query))) {
            count += 1;
            lines.push(formatBindings(answer.bindings));
            applyDomActions(getBindingValue(answer.bindings, 'Actions') ?? []);
          }
        } catch (error) {
          const message = describePrologError(error, query);
          lines.push('ERROR: ' + message);
        }

        if (count === 0) {
          lines.push('false.');
        }

        lines.push('');
      }

      output.textContent = lines.join('\\n').trimEnd();
      applyDomActions(collectDomActions(prolog));
      bindDomEvents(prolog);
      window.tpPlaygroundReportHeight?.();
    }

    main().catch((error) => {
      const output = ensureOutput();
      output.textContent = error?.message ?? String(error);
      window.tpPlaygroundReportHeight?.();
    });
  <\/script>
</body>
</html>
`}}function g(e){return`<pre><code class="language-prolog">${a(e)}</code></pre>`}export{h as buildPrologExecutionDocument,g as createPrologSourcePreview};
//# sourceMappingURL=prolog-execution-document.js.map