# Document Object Model

<tp-toc position="end" expand-all open brand></tp-toc>

The **D**ocument **O**bject **M**odel ([DOM](https://developer.mozilla.org/en/docs/Web/API/Document_Object_Model)) represents a document as a logical tree. Each branch of the tree ends in a node, and each node contains objects. The [DOM’s methods](https://developer.mozilla.org/en-US/docs/Web/API/Document) allow the tree to be accessed programmatically. They enable the structure, style or content of the document to be modified.

## Types of DOM
There are typically three types of DOM:

[Light DOM](https://developer.mozilla.org/en/docs/Web/API/Document_Object_Model)
: This is the page’s ‘normal’ DOM: the elements written directly in the HTML or added to the main document tree.

  [`tp-components`](/docs/cover.md), [`JQuery`](https://jquery.com), [`SolidJS`](https://www.solidjs.com), [`Svelte`](https://svelte.dev) and [`Alpine.js`](https://alpinejs.dev) all use the lightDOM directly.

[Shadow DOM](https://developer.mozilla.org/en/docs/Web/API/Web_components/Using_shadow_DOM) 
: It is an encapsulated DOM element attached to another element. It is used to isolate a component’s internal structure and styles. Global styles do not automatically apply to it, and its internal content is protected from the outer page. This is useful for creating highly isolated components, but less practical when you want the content to remain naturally stylable and inspectable.

  [`FAST`](https://docs.fastjs.dev), [`Ionic`](https://ionicframework.com) and [`Lit`](https://lit.dev) use the shadowDOM.

[Virtual DOM](https://en.wikipedia.org/wiki/Virtual_DOM)
: It is not an actual browser DOM. It is a JavaScript representation of the interface. The Virtual DOM is therefore a rendering technique, not a section of the document like the Light DOM or the Shadow DOM.

  [`Inferno`](https://www.infernojs.org), [`Mithril`](https://mithril.js.org), [`React`](https://legacy.reactjs.org) and [`Vue`](https://vuejs.org) first process changes via a virtual DOM so that only the necessary changes are applied to the LightDOM.


