import{E as e,n as t,t as n}from"../../chunks/playground-build-utils.js";import{n as r}from"../../chunks/html-viewer.js";import{resolveLatexInputs as i}from"./latex-inputs.js";async function a(a){let o=e(a,{priorityPaths:[`/main.tex`,`/index.tex`],extensions:[`.tex`,`.latex`],fallbackToFirstFile:!1});if(!o)throw Error(`No LaTeX entry file found.`);let s=document.createElement(`tp-latex`);return s.setAttribute(`value`,i(a,o.path)),{html:r(n()+t()+`<script>
 document.addEventListener('tp-latex-error', event => console.error(event.detail.message));
 document.addEventListener('tp-tikz-error', event => console.error(event.detail.message));
 <\/script>`+s.outerHTML,document.baseURI)}}export{a as buildLatexExecutionDocument};
//# sourceMappingURL=latex-execution-document.js.map