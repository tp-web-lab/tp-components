import{dedent as e}from"../utilities/code.js";import{TpBase as t}from"../components/base/base.js";import{resolveComponentSourceUrl as n}from"../utilities/source-url.js";var r=``+new URL(`../fonts.css`,import.meta.url).href,i=``+new URL(`../tikzjax-tp.js`,import.meta.url).href,a=`tp-tikz{min-width:0;max-width:100%;display:block}`,o=new URL(i,import.meta.url).href,s=new URL(r,import.meta.url).href,c=class extends t{static get observedAttributes(){return[`src`,`value`,`libraries`,`label`,`scale`]}revision=0;request;snapshot;frame;timer;source=``;output=this.attachShadow({mode:`open`});receive=e=>{if(!this.frame?.contentWindow||e.source!==this.frame.contentWindow||e.data?.type!==`tp-tikz`)return;if(e.data.error){this.fail(String(e.data.error));return}let t=Number(e.data.height);Number.isFinite(t)&&t>0&&(this.frame.style.height=`${Math.ceil(t)}px`),e.data.ready&&this.hasAttribute(`aria-busy`)&&(clearTimeout(this.timer),this.removeAttribute(`aria-busy`),this.output.querySelector(`[role="status"]`)?.remove(),this.dispatchEvent(new CustomEvent(`tp-tikz-rendered`,{bubbles:!0})))};get src(){return this.getAttribute(`src`)??``}set src(e){this.setAttribute(`src`,e)}get value(){return this.getAttribute(`value`)??this.snapshot??``}set value(e){this.setAttribute(`value`,e)}get libraries(){return this.getAttribute(`libraries`)??``}set libraries(e){this.setAttribute(`libraries`,e)}get scale(){let e=Number(this.getAttribute(`scale`)??1);return Number.isFinite(e)&&e>0?e:1}set scale(e){this.setAttribute(`scale`,String(e))}get label(){return this.getAttribute(`label`)??`TikZ drawing`}set label(e){this.setAttribute(`label`,e)}connectedCallback(){super.connectedCallback(),this.ensureGlobalStyle(`tp-tikz-styles`,a),this.snapshot??=e(this.querySelector(`script[type="tp/tikz"]`)?.textContent??this.textContent??``),window.addEventListener(`message`,this.receive),this.render()}disconnectedCallback(){this.revision++,this.request?.abort(),window.removeEventListener(`message`,this.receive),clearTimeout(this.timer),this.frame?.remove(),this.frame=void 0}attributeChangedCallback(e){if(e===`scale`){this.frame?.contentWindow?.postMessage({type:`tp-tikz-scale`,scale:this.scale},`*`);return}if(e===`label`){this.frame&&(this.frame.title=this.label);return}this.isConnected&&this.render()}fail(e){clearTimeout(this.timer),this.removeAttribute(`aria-busy`);let t=document.createElement(`p`);t.setAttribute(`role`,`alert`),t.textContent=`TikZ : ${e}`,this.output.replaceChildren(t),this.frame=void 0,this.dispatchEvent(new CustomEvent(`tp-tikz-error`,{bubbles:!0,detail:{message:e}}))}async render(){let e=++this.revision;this.request?.abort(),this.request=new AbortController,clearTimeout(this.timer),this.frame?.remove(),this.frame=void 0,this.setAttribute(`aria-busy`,`true`),this.output.textContent=`Loading TikZ…`;try{let t=this.value;if(this.src.trim()){let e=await fetch(n(this,this.src),{signal:this.request.signal});if(!e.ok)throw Error(`Unable to load TikZ (${e.status}).`);t=await e.text()}if(e!==this.revision||!this.isConnected)return;this.source=t,this.renderFrame()}catch(t){e===this.revision&&this.isConnected&&this.fail(t instanceof Error?t.message:String(t))}}renderFrame(){let e=this.getAttribute(`libraries`)??``;if(e&&!/^[a-zA-Z0-9.,-]+$/.test(e)){this.fail(`Invalid library names`);return}if(!this.source.trim()){this.output.replaceChildren(),this.frame=void 0,this.removeAttribute(`aria-busy`);return}let t=(e?`\\usetikzlibrary{${e}}\n`:``)+`\\begin{document}
`+this.source,n=JSON.stringify(t).replaceAll(`<`,`\\u003c`),r=document.createElement(`p`);r.setAttribute(`role`,`status`),r.textContent=`Compiling TikZ…`;let i=document.createElement(`iframe`);i.title=this.label,i.setAttribute(`sandbox`,`allow-scripts`),i.style.cssText=`display:block;width:100%;height:1px;border:0`,this.frame=i,this.setAttribute(`aria-busy`,`true`),i.srcdoc=`<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://tikzjax.com/v1/fonts.css">
<link rel="stylesheet" href="${s}">
<style>html,body{margin:0;padding:0}body>div{display:block!important;max-width:100%;height:auto!important}svg{position:static!important;width:100%;max-width:100%;height:auto;display:block}</style>
<script>
const send = data => parent.postMessage({type:'tp-tikz',...data}, '*');
addEventListener('error', event => send({error:event.message || 'Unable to load TikZJax.'}));
addEventListener('unhandledrejection', event => send({error:String(event.reason)}));
let scale = ${this.scale};
const naturalWidths = new WeakMap();
const applyScale = () => {
  for (const drawing of document.querySelectorAll('body > div')) {
    if (!drawing.querySelector('svg')) continue;
    if (!naturalWidths.has(drawing)) naturalWidths.set(drawing, drawing.style.width);
    const width = naturalWidths.get(drawing);
    if (width) drawing.style.width = 'calc(' + width + ' * ' + scale + ')';
  }
};
const report = () => {
  applyScale();
  const drawings = Array.from(document.querySelectorAll('body > div svg'));
  if (drawings.length) send({ready:true,height:Math.max(1, ...drawings.map(drawing => drawing.getBoundingClientRect().bottom))});
};
addEventListener('message', event => {
  if (event.source !== parent || event.data?.type !== 'tp-tikz-scale') return;
  const next = Number(event.data.scale);
  scale = Number.isFinite(next) && next > 0 ? next : 1;
  report();
});
addEventListener('DOMContentLoaded', () => {
  new MutationObserver(report).observe(document.body,{childList:true,subtree:true});
  new ResizeObserver(report).observe(document.body);
  document.fonts.ready.then(report);
});
<\/script></head><body><script>
const input = document.createElement('script'); input.type='text/tikz'; input.textContent=${n}; document.body.append(input);
<\/script><script src="${o}"><\/script></body></html>`,i.addEventListener(`load`,()=>{this.frame===i&&i.contentWindow?.postMessage({type:`tp-tikz-scale`,scale:this.scale},`*`)}),this.output.replaceChildren(r,i),this.timer=setTimeout(()=>this.fail(`Compilation timed out or resources are unavailable. Change the source to retry.`),9e4)}};customElements.get(`tp-tikz`)||customElements.define(`tp-tikz`,c);export{c as t};
//# sourceMappingURL=tikz2.js.map