/** Generate a DOM API equivalent of a declarative example, with explicit component imports. */
import { parseFragment } from 'parse5';

const quote = value => JSON.stringify(value).replaceAll('<', '\\u003c');
export function javascriptExample(source, componentModules) {
 const root = parseFragment(source);
 const imports = new Set();
 const lines = ['const example = document.createDocumentFragment();'];
 let sequence = 0;
 const append = (node, parent) => {
  if(node.nodeName === '#text') {
   if(node.value) lines.push(`${parent}.append(document.createTextNode(${quote(node.value)}));`);
   return;
  }
  if(node.nodeName === '#comment') {
   lines.push(`${parent}.append(document.createComment(${quote(node.data)}));`);
   return;
  }
  if(!node.tagName) return;
  const module = componentModules.get(node.tagName);
  if(module) imports.add(module);
  const name = `element${++sequence}`;
  const create = node.namespaceURI === 'http://www.w3.org/1999/xhtml'
   ? `document.createElement(${quote(node.tagName)})`
   : `document.createElementNS(${quote(node.namespaceURI)}, ${quote(node.tagName)})`;
  lines.push('', `const ${name} = ${create};`);
  for(const attr of node.attrs ?? []) {
   lines.push(attr.namespace
    ? `${name}.setAttributeNS(${quote(attr.namespace)}, ${quote(attr.prefix ? `${attr.prefix}:${attr.name}` : attr.name)}, ${quote(attr.value)});`
    : `${name}.setAttribute(${quote(attr.name)}, ${quote(attr.value)});`);
  }
  if(node.tagName === 'script') {
   const text = (node.childNodes ?? []).map(n=>n.value ?? '').join('');
   if(text) lines.push(`${name}.textContent = ${quote(text)};`);
  } else for(const child of node.tagName === 'template' ? node.content.childNodes : node.childNodes ?? []) append(child,node.tagName === 'template' ? `${name}.content` : name);
  lines.push(`${parent}.append(${name});`);
 };
 for(const node of root.childNodes) append(node,'example');
 // Renderers may create nested components from literal source (HTML, Markdown, etc.).
 for(const [tag,module] of componentModules) if(source.includes(`<${tag}`)) imports.add(module);
 lines.push('', 'document.body.append(example);');
 return `<script type="module">\n${[...imports].sort().map(module=>`import ${quote(`/components/${module}/${module}.js`)};`).join('\n')}\n\n${lines.join('\n')}\n</script>`;
}
