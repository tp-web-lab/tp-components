import{t as e}from"../../chunks/playground.js";import{getMarkupExtensionIdFromAction as t,isMarkupExtensionAction as n,renderMarkupExtensionMenu as r,syncMarkupExtensionMenuChecks as i}from"../markup-playground/markup-extension-menu.js";import{createMarkupExtensionMenuItems as a,toMarkupRuntimeExtensions as o,toggleMarkupExtensionId as s}from"../markup-playground/markup-extension-registry.js";import{buildRestructuredTextExecutionDocument as c}from"./restructuredtext-execution-document.js";import{TpRestructuredTextProject as l}from"./restructuredtext-project.js";var u=class extends e{createEmptyProject(){return new l({name:`reStructuredText project`,entry:`/index.rst`,files:[{path:`/index.rst`,language:`restructuredtext`,content:`reStructuredText playground
===========================
.. tp-callout::
   :variant: info
   :heading: About this playground

   This \`reStructuredText <https://docutils.sourceforge.io/rst.html>\`_ document is rendered in the browser with \`Pyodide <https://pyodide.org/>\`_ and \`docutils <https://docutils.sourceforge.io/>\`_.

.. contents:: Contents
   :depth: 2
   :local:


Lists
-----

Unordered list
^^^^^^^^^^^^^^

- HTML
- CSS
- JavaScript

  - DOM
  - Events
  - Fetch API

Ordered list
^^^^^^^^^^^^

1. Install dependencies
2. Start the dev server
3. Open the browser

Definition list
^^^^^^^^^^^^^^^

HTML
  Structures the document.

CSS
  Styles the document.

JavaScript
  Adds behavior to the document.



Tables
------

Simple table
^^^^^^^^^^^^

=========  ===========
Language   Role
=========  ===========
HTML       Structure
CSS        Style
Python     Rendering
=========  ===========

List table
^^^^^^^^^^

.. list-table:: Languages
   :header-rows: 1

   * - Language
     - Role
   * - HTML
     - Structure
   * - CSS
     - Style

CSV table
^^^^^^^^^

.. csv-table:: Languages
   :header: "Language", "Role"

   "HTML", "Structure"
   "CSS", "Style"
   "Python", "Runtime"


Codes
-----

Load the highlight.js extension to add syntax highlighting to code blocks.

Literal block
^^^^^^^^^^^^^

::

  print("Hello reStructuredText")


Javascript
^^^^^^^^^^

.. code-block:: javascript

   function greet(name) {
       console.log(\`Hello \${name}\`);
   }

   greet('world');


Python
^^^^^^

.. code-block:: python

   def greet(name: str) -> None:
       print(f"Hello {name}")

   greet("world")

HTML
^^^^

.. code-block:: html

   <section class="card">
     <h2>Hello</h2>
   </section>


Bash
^^^^

.. code-block:: bash

   pnpm install
   pnpm dev`}]})}createNewProject(){return this.createEmptyProject()}createClearProject(){return new l({name:`Untitled project`,files:[]})}normalizeProject(e){let t=e.clone();return(t.entry===void 0||t.entry===``)&&(t.entry=t.files.find(e=>e.path.endsWith(`.rst`))?.path??t.files.find(e=>e.path.endsWith(`.rest`))?.path??t.files[0]?.path),t}resolveEntry(e){return typeof e.entry==`string`&&e.findFile(e.entry)!==void 0?e.entry:e.files.find(e=>e.path===`/index.rst`)?.path??e.files.find(e=>e.path===`/main.rst`)?.path??e.files.find(e=>e.path.endsWith(`.rst`))?.path??e.files.find(e=>e.path.endsWith(`.rest`))?.path??null}getPlaygroundKind(){return`restructuredtext`}getLanguageIconName(){return`file_type_restructuredtext`}getLanguageHelp(){return`
      <h2>reStructuredText</h2>
      <p>reStructuredText est rendu avec docutils dans Pyodide.</p>
      <ul>
        <li><a href="https://docutils.sourceforge.io/rst.html" target="_blank" rel="noreferrer">reStructuredText</a></li>
        <li><a href="https://docutils.sourceforge.io/" target="_blank" rel="noreferrer">docutils</a></li>
        <li><a href="https://pyodide.org/" target="_blank" rel="noreferrer">Pyodide</a></li>
      </ul>
    `}createProjectFromExample(e,t){let n=e;return new l({name:e.name??e.label??e.id??`reStructuredText project`,entry:e.entry??`/index.rst`,test:e.test,libs:Array.isArray(n.libs)?n.libs.filter(e=>typeof e==`string`):void 0,extensions:Array.isArray(n.extensions)?n.extensions.filter(e=>typeof e==`object`&&!!e&&typeof e.id==`string`&&typeof e.label==`string`&&typeof e.url==`string`):void 0,files:t})}async buildExecutionDocument(e){return c(e,{entry:this.resolveEntry(e)??void 0,libs:e.libs})}getAdditionalToolbarMenuItems(){return r(a(`restructuredtext`,this.getActiveMarkupExtensionIds()))}handleAdditionalToolbarAction(e){if(!n(e))return!1;let r=t(e);if(r===null)return!1;let i=s(this.getActiveMarkupExtensionIds(),r);return this.applyMarkupExtensions(i),!0}getActiveMarkupExtensionIds(){return new Set(this.getProject().extensions?.map(e=>e.id)??[])}applyMarkupExtensions(e){this.toolbarStartMenuEl?.closeAll?.(),this.syncProjectFromFilesystem();let t=this.getProject();this.setProject(new l({name:t.name,entry:t.entry,test:t.test,libs:t.libs,files:t.files,extensions:o(`restructuredtext`,e)})),queueMicrotask(()=>{this.syncToolbarExtensionChecks(),this.run()})}syncToolbarExtensionChecks(){i(this,this.getActiveMarkupExtensionIds())}get exampleCategory(){return`playgrounds`}get exampleGroup(){return`restructuredtext`}afterProjectLoaded(){queueMicrotask(()=>{this.syncToolbarExtensionChecks()})}};customElements.get(`tp-restructuredtext-playground`)||customElements.define(`tp-restructuredtext-playground`,u);export{u as TpRestructuredTextPlayground,l as TpRestructuredTextProject};
//# sourceMappingURL=restructuredtext-playground.js.map